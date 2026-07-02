#!/bin/bash
# Vulhub 搭建修复版（解决 sudo 密码管道 + daemon.json 覆盖问题）
set +e
export KALI_PASS="kail"
SEP="========================================================"

# 先 sudo -v 缓存凭据（一次喂密码，后面 15 分钟内 sudo 免密）
echo "[*] 输入 sudo 密码并缓存凭据..."
echo "$KALI_PASS" | sudo -S -v -p "" 2>/dev/null
# 验证
if sudo -n true 2>/dev/null; then
  echo "[OK] sudo 凭据已缓存，后续 sudo 免密运行"
else
  echo "[FAIL] sudo 缓存失败，退出"
  exit 1
fi

echo ""
echo "$SEP"
echo "  阶段 1：重写 daemon.json（完全覆盖旧内容）"
echo "$SEP"

sudo mkdir -p /etc/docker
# 先备份旧的
if [ -f /etc/docker/daemon.json ]; then
  sudo cp /etc/docker/daemon.json /etc/docker/daemon.json.bak.$(date +%s)
  echo "[*] 旧 daemon.json 已备份"
fi

# 用 Python 写完整合法 JSON（没有任何 shell 转义）
python3 <<'PYEOF'
import json, os
cfg = {
    "registry-mirrors": [
        "https://mirror.ccs.tencentyun.com",
        "https://docker.mirrors.ustc.edu.cn",
        "https://docker.nju.edu.cn"
    ],
    "dns": ["223.5.5.5", "114.114.114.114", "8.8.8.8"],
    "ipv6": False,
    "log-driver": "json-file",
    "log-opts": {
        "max-size": "10m",
        "max-file": "3"
    },
    "max-concurrent-downloads": 10
}
tmp = "/tmp/daemon.json"
with open(tmp, "w", encoding="utf-8") as f:
    json.dump(cfg, f, indent=2, ensure_ascii=False)
    f.write("\n")
# 合法性自检
with open(tmp, "r", encoding="utf-8") as f:
    json.load(f)
    print(f"Python 自检 JSON 合法 ✓，写入文件：{tmp}")
PYEOF

echo "[验证 /tmp/daemon.json]"
cat /tmp/daemon.json
echo ""
python3 -c "import json; json.load(open('/tmp/daemon.json','r')); print('python json 检查 OK')" || echo "python json 检查 FAIL!"

echo "[*] 用 sudo cp 覆盖到 /etc/docker/daemon.json"
sudo cp /tmp/daemon.json /etc/docker/daemon.json
echo "[验证 /etc/docker/daemon.json]"
cat /etc/docker/daemon.json
python3 -c "import json; json.load(open('/etc/docker/daemon.json','r')); print('/etc/docker/daemon.json JSON 合法 ✓')" || echo "[FAIL] /etc/docker/daemon.json 仍然不合法!"

echo ""
echo "[*] 重启 docker daemon 并等 5 秒..."
sudo systemctl daemon-reload
sudo systemctl restart docker
sleep 6
sudo systemctl --no-pager status docker | head -8
echo "active? -> $(sudo systemctl is-active docker)"

echo ""
echo "$SEP"
echo "  阶段 2：docker info 看 mirrors 并拉取 hello-world"
echo "$SEP"

sudo docker info 2>&1 | grep -iE "Registry Mirrors" -A 8

echo ""
echo "[*] pull hello-world:latest"
sudo docker pull hello-world:latest 2>&1 | tail -20

echo ""
echo "[*] 运行 hello-world"
sudo docker run --rm hello-world 2>&1 | tail -12

echo ""
echo "$SEP"
echo "  阶段 3：再次尝试启动 Tomcat CVE-2017-12615（含 build）"
echo "$SEP"

cd ~/vulhub/tomcat/CVE-2017-12615 || exit 1
echo "cwd: $(pwd)"

echo "[*] docker-compose build（第一次会很慢，要拉 tomcat 镜像）..."
sudo docker-compose build 2>&1 | tail -30

echo ""
echo "[*] docker-compose up -d"
sudo docker-compose up -d 2>&1 | tail -20

echo ""
echo "=== docker ps 容器状态 ==="
sudo docker ps --format "table {{.ID}}\t{{.Names}}\t{{.Status}}\t{{.Ports}}"
echo ""
echo "=== docker-compose ps ==="
sudo docker-compose ps 2>&1

echo ""
echo "=== docker-compose logs 末尾 20 行 ==="
sudo docker-compose logs --tail=20 2>&1 | tail -30

echo ""
echo "=== 宿主机 8080 端口监听? ==="
ss -tlnp 2>/dev/null | grep :8080 || netstat -tlnp 2>/dev/null | grep :8080 || echo "[-] 宿主机 8080 没监听"

echo ""
echo "$SEP"
echo "  阶段 4：HTTP 重试（10 次 × 5 秒间隔）"
echo "$SEP"
up=0
for i in 1 2 3 4 5 6 7 8 9 10 11 12; do
  CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 http://127.0.0.1:8080/)
  echo "[$i] HTTP -> $CODE"
  if [ "$CODE" = "200" ]; then
    echo "[成功 ✓] Tomcat CVE-2017-12615 可访问: http://192.168.108.128:8080/"
    up=1
    break
  fi
  sleep 4
done
if [ "$up" != "1" ]; then
  echo "[诊断] 靶场未启动成功，列所有镜像看 vulhub/tomcat:8.5.19 是否已拉到："
  sudo docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}\t{{.ID}}" | grep -iE "vulhub/tomcat|REPOSITORY"
fi

echo ""
echo "$SEP"
echo "  阶段 5：顺便列出 Vulhub 漏洞环境总数 + 入门 Top10"
echo "$SEP"
echo "Vulhub docker-compose.yml 个数（=漏洞环境数）: $(find ~/vulhub -name docker-compose.yml 2>/dev/null | wc -l)"
ls ~/vulhub/ | head -30
echo ""
echo "[入门必备 Top10 环境目录（直接 cd 进去 docker-compose up -d 就能用）]"
for env in \
  "tomcat/CVE-2017-12615" \
  "httpd/CVE-2021-41773" \
  "php/CVE-2019-11043" \
  "thinkphp/5-rce" \
  "weblogic/CVE-2017-10271" \
  "struts2/s2-045" \
  "nginx/insecure-configuration" \
  "redis/4-unacc" \
  "mysql/CVE-2012-2122" \
  "flink/CVE-2020-17518"; do
  if [ -d ~/vulhub/$env ]; then
    echo "  ✓ $env"
  else
    echo "  ✗ $env  (不存在)"
  fi
done

echo ""
echo "DONE"
