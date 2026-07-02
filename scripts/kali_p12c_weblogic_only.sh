#!/bin/bash
# 单独拉 + 启动 WebLogic CVE-2017-10271
export KALI_PASS="kail"
echo "$KALI_PASS" | sudo -S -v -p "" 2>/dev/null
SUDO="sudo"

D=~/vulhub/weblogic/CVE-2017-10271
echo "[i] 进入目录：$D"
cd "$D"
echo "[i] 当前 yml："
cat docker-compose.yml
echo ""

$SUDO docker-compose down 2>/dev/null || true
echo "[*] 重写 docker-compose.yml（端口 8083 → 7001）"
$SUDO tee docker-compose.yml >/dev/null <<'EOF'
version: '2'
services:
  weblogic:
    image: vulhub/weblogic:12.2.1.3-2017
    container_name: vulhub-weblogic-cve201710271
    ports:
      - "8083:7001"
EOF
echo "[*] 拉取镜像开始（1.2GB，DaoCloud 加速，耐心等）"
date '+%F %T 开始 pull'
$SUDO docker-compose pull 2>&1 | tail -30
date '+%F %T pull 结束'
echo ""
echo "[*] up -d 启动容器"
$SUDO docker-compose up -d 2>&1 | tail -10
echo ""
echo "[*] 等 WebLogic 控制台和 wsat 端点（最多等 5 分钟）"
for i in $(seq 1 25); do
  sleep 20
  C=$(curl -s -o /dev/null -w "%{http_code}" --max-time 15 "http://127.0.0.1:8083/ws-wsat/CoordinatorPortType" 2>&1 || echo 000)
  SZ=$(curl -s --max-time 15 "http://127.0.0.1:8083/ws-wsat/CoordinatorPortType" 2>/dev/null | wc -c)
  CONSOLE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 15 "http://127.0.0.1:8083/console/" 2>&1 || echo 000)
  echo "  [wait #$i]  /ws-wsat HTTP $C ($SZ bytes)  /console HTTP $CONSOLE"
  if [ "$SZ" -gt 200 ]; then
    echo ""
    echo "✅✅✅ WebLogic CVE-2017-10271 靶场启动成功！WSAT 端点正常！"
    break
  fi
done

echo ""
$SUDO docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Ports}}" 2>&1 | grep -E "weblogic|NAMES"
echo ""
echo "宿主机： http://192.168.108.128:8083/console/  (用户名 weblogic  密码 Oracle@123)"
echo "漏洞端点: http://192.168.108.128:8083/ws-wsat/CoordinatorPortType"
echo "如果 pull 半天超时也没关系 → 文档里路线 B Vulfocus.cn 在线靶场 10 秒启动搞定"
echo "DONE."
