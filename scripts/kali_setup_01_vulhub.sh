#!/bin/bash
# 第 ① 步：Vulhub 完整搭建流程
set +e  # 允许个别步骤失败，继续往下
KALI_PASS="kail"
SUDO="echo $KALI_PASS | sudo -S -p ''"
SEP="========================================================"

echo "$SEP"
echo "  阶段 1：修复 Docker 镜像加速器（替换失效的阿里云）"
echo "$SEP"

# 备份已有 daemon.json
$SUDO mkdir -p /etc/docker
if [ -f /etc/docker/daemon.json ]; then
  $SUDO cp -a /etc/docker/daemon.json "/etc/docker/daemon.json.bak.$(date +%s)"
  echo "[OK] 已有 daemon.json 已备份"
fi

# 用 Python 写 daemon.json（避免所有 shell/引号转义问题）
python3 <<'PYEOF'
import json, os
cfg = {
    "registry-mirrors": [
        "https://mirror.ccs.tencentyun.com",
        "https://docker.mirrors.ustc.edu.cn",
        "https://docker.nju.edu.cn"
    ],
    "log-driver": "json-file",
    "log-opts": { "max-size": "10m", "max-file": "3" }
}
tmp = "/tmp/daemon.json"
with open(tmp, "w", encoding="utf-8") as f:
    json.dump(cfg, f, indent=2, ensure_ascii=False)
    f.write("\n")
print("wrote ->", tmp)
print(open(tmp, "r", encoding="utf-8").read())
PYEOF

echo "[*] 把 daemon.json 安装到 /etc/docker/"
$SUDO cp /tmp/daemon.json /etc/docker/daemon.json

echo "[*] 重启 Docker daemon..."
$SUDO systemctl daemon-reload
$SUDO systemctl restart docker
sleep 5
echo "[*] docker 状态:"
$SUDO systemctl is-active docker
echo ""
$SUDO docker info 2>/dev/null | grep -iE "Registry Mirrors" -A 10 | head -15

echo ""
echo "$SEP"
echo "  阶段 2：验证镜像拉取（测试拉一个小镜像 hello-world）"
echo "$SEP"
$SUDO docker run --rm hello-world 2>&1 | tail -10

echo ""
echo "$SEP"
echo "  阶段 3：启动 Vulhub 示例靶场（Tomcat CVE-2017-12615 PUT RCE）"
echo "$SEP"
cd ~/vulhub/tomcat/CVE-2017-12615 || exit 1
echo "当前目录: $(pwd)"
echo "[-] 清理旧容器（如果有）..."
$SUDO docker-compose down -v 2>&1 | tail -5
echo "[-] docker-compose up -d（首次会 build 镜像，较长，耐心等）..."
$SUDO docker-compose up -d 2>&1 | tail -30
echo ""
echo "[-] 容器运行状态:"
$SUDO docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}\t{{.Image}}"
echo ""
echo "[-] 检查 8080 监听:"
ss -tlnp 2>/dev/null | grep :8080 || netstat -tlnp 2>/dev/null | grep :8080 || echo "[!] 8080 未监听，可能镜像仍在启动..."

echo ""
echo "$SEP"
echo "  阶段 4：HTTP 健康检查（curl Tomcat 首页）"
echo "$SEP"
for i in 1 2 3 4 5 6 7 8 9 10; do
    echo "[重试 $i] curl -s -o /dev/null -w HTTP_CODE:%{http_code} http://127.0.0.1:8080/"
    CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:8080/" --max-time 5)
    echo "       => 返回码: $CODE"
    if [ "$CODE" = "200" ]; then
        echo "[OK] Tomcat CVE-2017-12615 靶场健康！首页 200."
        echo "    外网访问地址: http://192.168.108.128:8080/"
        break
    fi
    sleep 3
done

echo ""
echo "$SEP"
echo "  阶段 5：列出 Vulhub 推荐入门漏洞环境清单（方便后续起）"
echo "$SEP"
echo "漏洞环境总数: $(find ~/vulhub -name docker-compose.yml | wc -l) 个"
echo ""
echo "【入门 Top 10 推荐】："
echo "  1) tomcat/CVE-2017-12615  （已启动演示）          Tomcat PUT RCE"
echo "  2) httpd/CVE-2021-41773                             Apache HTTPd 路径穿越/RCE"
echo "  3) php/CVE-2019-11043                                 PHP-FPM 远程代码执行"
echo "  4) thinkphp/5-rce                                      ThinkPHP 5 全版本 RCE"
echo "  5) weblogic/CVE-2017-10271                             WebLogic WLS-WS RCE"
echo "  6) struts2/s2-045                                      Struts2 S2-045 RCE"
echo "  7) nginx/insecure-configuration                        Nginx 配置错误导致的漏洞集合"
echo "  8) redis/4-unacc                                       Redis 未授权（写公钥/RCE）"
echo "  9) mysql/CVE-2012-2122                                 MySQL 认证绕过"
echo " 10) flink/CVE-2020-17518                                Flink 目录穿越 RCE"

echo ""
echo "[总结 Vulhub 用法（以后直接用就行）]:"
echo "  - 启动: cd ~/vulhub/<组件>/<CVE-id>/  &&  echo 'kail' | sudo -S docker-compose up -d"
echo "  - 停止: cd ~/vulhub/<组件>/<CVE-id>/  &&  echo 'kail' | sudo -S docker-compose down"
echo "  - 查看: echo 'kail' | sudo -S docker ps"
echo "  - 清理: echo 'kail' | sudo -S docker-compose down -v   (含数据卷)"
echo "$SEP"
echo "DONE: Vulhub 搭建 + 首个示例靶场 Tomcat CVE-2017-12615 完成!"
