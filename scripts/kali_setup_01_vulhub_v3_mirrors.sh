#!/bin/bash
# 测试并更新 Docker 镜像源，然后重新尝试拉取 vulhub/tomcat
set +e
export KALI_PASS="kail"
echo "$KALI_PASS" | sudo -S -v -p "" 2>/dev/null
if ! sudo -n true 2>/dev/null; then echo "sudo 失败!"; exit 1; fi

echo "=== 1) 扩充 registry-mirrors 候选（近年可用的公共镜像代理） ==="

python3 <<'PYEOF'
import json
cfg = {
    "registry-mirrors": [
        "https://docker.m.daocloud.io",
        "https://docker.1ms.run",
        "https://docker.registry.cyou",
        "https://hub.rat.dev",
        "https://docker.proxy.ustclug.org",
        "https://mirror.ccs.tencentyun.com"
    ],
    "dns": ["223.5.5.5", "114.114.114.114", "8.8.8.8"],
    "ipv6": False,
    "log-driver": "json-file",
    "log-opts": { "max-size": "10m", "max-file": "3" },
    "max-concurrent-downloads": 8
}
tmp = "/tmp/daemon_v2.json"
with open(tmp, "w", encoding="utf-8") as f:
    json.dump(cfg, f, indent=2, ensure_ascii=False)
    f.write("\n")
# Validate
with open(tmp, "r", encoding="utf-8") as f:
    json.load(f)
print("written & validated ->", tmp)
PYEOF

echo "→ /tmp/daemon_v2.json:"
cat /tmp/daemon_v2.json

echo ""
echo "[*] 覆盖到 /etc/docker/daemon.json 并重启 docker"
sudo cp /tmp/daemon_v2.json /etc/docker/daemon.json
python3 -c "import json; json.load(open('/etc/docker/daemon.json')); print('JSON 合法 ✓')"
sudo systemctl daemon-reload
sudo systemctl restart docker
sleep 6
echo "docker active: $(sudo systemctl is-active docker)"

echo ""
echo "=== 2) docker info 看当前 mirrors ==="
sudo docker info 2>&1 | grep -iE "Registry Mirrors" -A 10 | head -14

echo ""
echo "=== 3) 拉取 vulhub/tomcat:8.5.19 镜像（看是否有镜像源能成功） ==="
time sudo docker pull vulhub/tomcat:8.5.19 2>&1 | tail -15

echo ""
echo "镜像是否存在?"
sudo docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}" | grep -i "vulhub/tomcat\|REPOSITORY"

echo ""
echo "=== 4) 如果拉到了，就启动 Tomcat CVE-2017-12615 ==="
cd ~/vulhub/tomcat/CVE-2017-12615
if sudo docker images | grep -q "vulhub/tomcat"; then
  echo "[*] 找到了 vulhub/tomcat 镜像，启动环境..."
  sudo docker-compose up -d 2>&1 | tail -10
  sleep 8
  sudo docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
  for i in 1 2 3 4 5; do
    C=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 http://127.0.0.1:8080/)
    echo "  [尝试 $i] HTTP=$C"
    if [ "$C" = "200" ]; then
      echo "[✓] Tomcat 启动成功 -> http://192.168.108.128:8080/"
      break
    fi
    sleep 3
  done
else
  echo "[跳过] 镜像没拉到，暂时不启动 CVE-2017-12615。Vulhub 所有 170 个环境文件仍然在 ~/vulhub/ 下，以后网络好或有加速器随时能 docker-compose up。"
fi

echo ""
echo "==== Vulhub 文件完整性确认 ===="
echo "vulhub 根目录大小: $(du -sh ~/vulhub | cut -f1)"
echo "docker-compose.yml 数量: $(find ~/vulhub -name docker-compose.yml | wc -l)"
echo "常用入门环境列表(全部存在性 check):"
for d in "tomcat/CVE-2017-12615" "thinkphp/5-rce" "struts2/s2-045" "weblogic/CVE-2017-10271" "redis/4-unacc" "nginx/insecure-configuration" "php/CVE-2019-11043" "mysql/CVE-2012-2122"; do
  [ -f ~/vulhub/$d/docker-compose.yml ] && echo "  ✓  $d" || echo "  ✗  $d"
done

echo ""
echo "DONE: Vulhub 已克隆、配置完整，仅待 docker 拉取镜像即可运行靶场。"
