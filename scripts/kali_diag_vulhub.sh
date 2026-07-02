#!/bin/bash
set +e
KALI_PASS="kail"
SUDO="echo $KALI_PASS | sudo -S -p ''"

echo "=== 1) docker daemon 状态 ==="
$SUDO systemctl status docker --no-pager 2>&1 | head -12

echo ""
echo "=== 2) /etc/docker/daemon.json 内容 ==="
cat /etc/docker/daemon.json 2>&1 || echo "文件不存在"

echo ""
echo "=== 3) docker info 中的 registry mirrors ==="
$SUDO docker info 2>&1 | grep -iE "Registry Mirrors" -A 10 | head -20

echo ""
echo "=== 4) docker compose / docker-compose 版本 ==="
docker-compose --version 2>&1
echo "--- 尝试 docker compose（空格语法） ---"
$SUDO docker compose version 2>&1 || echo "docker compose 空格语法不可用"

echo ""
echo "=== 5) 手动拉取 hello-world:latest 看详细报错 ==="
$SUDO docker pull hello-world:latest 2>&1 | tail -30

echo ""
echo "=== 6) 当前 Vulhub CVE-2017-12615 容器列表（含未启动） ==="
cd ~/vulhub/tomcat/CVE-2017-12615
$SUDO docker-compose ps 2>&1 | tail -15
echo ""
echo "=== 7) 查看 docker-compose build 失败日志，重新跑一次看详细报错 ==="
$SUDO docker-compose build --no-cache 2>&1 | tail -40
