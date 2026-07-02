#!/bin/bash
# ============================================================
# 尝试：拉 3 个课程核心框架靶场 Docker 镜像（ThinkPHP5 + S2-045 + Weblogic）
# 如果拉成功就启动，失败就给 Vulfocus 在线替代方案
# 背景：之前 vulhub/tomcat:8.5.19 已成功拉取并跑在 :8080，所以 Docker 是能用的
# ============================================================
export KALI_PASS="kail"
echo "$KALI_PASS" | sudo -S -v -p "" 2>/dev/null
SUDO="sudo"
SEP="========================================================"

echo "=== 先看 Vulhub 源码里 3 个漏洞目录是否存在 ==="
for d in thinkphp/5-rce struts2/s2-045 weblogic/CVE-2017-10271; do
  if [ -d ~/vulhub/$d ]; then
    echo "  ✅ ~/vulhub/$d 存在 (docker-compose.yml: $(ls ~/vulhub/$d/docker-compose.yml 2>&1))"
  else
    echo "  ❌ ~/vulhub/$d 不存在"
  fi
done

echo ""
echo "$SEP"
echo " Docker 现状（当前占用的端口 + 可用镜像源）"
echo "$SEP"
$SUDO docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Ports}}\t{{.Status}}" 2>&1 | head -15
echo ""
echo "当前已下载的 Images:"
$SUDO docker images 2>&1 | head -10
echo ""
echo "--- 可用镜像源（之前配置的 DaoCloud 6 个）---"
$SUDO docker info 2>&1 | grep -A 8 "Registry Mirrors" | head -10

echo ""
echo "$SEP"
echo " 1/3 拉 ThinkPHP 5 RCE（thinkphp:5.0.23），占用 8081 端口"
echo "$SEP"
cd ~/vulhub/thinkphp/5-rce 2>/dev/null && {
  # 先改 docker-compose.yml 端口从 8080 → 8081（避免冲突）
  $SUDO sed -i -E 's/[-] 8080:80/- "8081:80"/g' docker-compose.yml
  cat docker-compose.yml
  echo "[-] Pull + Up 开始"
  # 超时 10 分钟
  timeout 600 $SUDO docker-compose pull 2>&1 | tail -20
  echo "--- pull 完成，启动 ---"
  timeout 180 $SUDO docker-compose up -d 2>&1 | tail -10
  sleep 20
  for i in 1 2 3 4 5; do
    C=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 http://127.0.0.1:8081/ 2>&1 || echo 000)
    echo "  尝试 $i: HTTP $C"
    [ "$C" = "302" ] || [ "$C" = "200" ] && break
    sleep 15
  done
  $SUDO docker ps --format "{{.Names}} {{.Ports}}" | grep -i think
} || echo "thinkphp 目录不存在，跳过"

echo ""
echo "$SEP"
echo " 2/3 拉 Struts2 S2-045（CVE-2017-5638），占用 8082 端口"
echo "$SEP"
cd ~/vulhub/struts2/s2-045 2>/dev/null && {
  $SUDO sed -i -E 's/[-] 8080:8080/- "8082:8080"/g' docker-compose.yml
  cat docker-compose.yml
  echo "[-] Pull + Up 开始"
  timeout 600 $SUDO docker-compose pull 2>&1 | tail -20
  timeout 180 $SUDO docker-compose up -d 2>&1 | tail -10
  sleep 20
  for i in 1 2 3 4 5 6 7; do
    C=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 http://127.0.0.1:8082/ 2>&1 || echo 000)
    echo "  尝试 $i: HTTP $C  (Tomcat/Struts 启动真的慢，最多等 2 分钟)"
    [ "$C" != "000" ] && break
    sleep 20
  done
  $SUDO docker ps --format "{{.Names}} {{.Ports}}" | grep -i s2
} || echo "struts2/s2-045 目录不存在，跳过"

echo ""
echo "$SEP"
echo " 3/3 拉 WebLogic CVE-2017-10271（Oracle WLS WLS-wsat），占用 8083 端口"
echo "$SEP"
cd ~/vulhub/weblogic/CVE-2017-10271 2>/dev/null && {
  $SUDO sed -i -E 's/[-] 7001:7001/- "8083:7001"/g' docker-compose.yml
  cat docker-compose.yml
  echo "[-] Pull + Up 开始（WebLogic 镜像最大 >1GB，拉+启动最多等 20 分钟）"
  timeout 1200 $SUDO docker-compose pull 2>&1 | tail -25
  timeout 300 $SUDO docker-compose up -d 2>&1 | tail -10
  sleep 30
  for i in 1 2 3 4 5 6 7 8 9 10; do
    C=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 http://127.0.0.1:8083/ 2>&1 || echo 000)
    WLS=$(curl -s --max-time 10 "http://127.0.0.1:8083/ws-wsat/CoordinatorPortType" 2>&1 | head -c 500)
    echo "  尝试 $i: / = HTTP $C  /ws-wsat/.. = ${#WLS} bytes"
    if [ ${#WLS} -gt 50 ]; then break; fi
    sleep 20
  done
  $SUDO docker ps --format "{{.Names}} {{.Ports}}" | grep -i weblogic
} || echo "weblogic/CVE-2017-10271 目录不存在，跳过"

echo ""
echo "$SEP"
echo " 最终汇总：3 个框架靶场状态"
echo "$SEP"
declare -A CHK=(
  ["ThinkPHP5 RCE     (端口8081)"]="http://127.0.0.1:8081/"
  ["Struts2 S2-045    (端口8082)"]="http://127.0.0.1:8082/"
  ["WebLogic CVE2017  (端口8083)"]="http://127.0.0.1:8083/"
  ["Tomcat CVE2017-12615 (旧:8080)"]="http://127.0.0.1:8080/"
)
for name in "${!CHK[@]}"; do
  url="${CHK[$name]}"
  C=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$url" 2>&1 || echo 000)
  TAG=$([ "$C" != "000" ] && [ "$C" != "502" ] && [ "$C" != "404" ] && echo "✅ 可用" || echo "❌ 未启动")
  echo "  $TAG  $name  HTTP $C  -> ${url/:8080/:8080}${url/:8081/:8081}${url/:8082/:8082}${url/:8083/:8083}"
done
echo ""
echo "宿主机直接访问（记得换 IP）："
echo "  ThinkPHP5 RCE   : http://192.168.108.128:8081/"
echo "  Struts2 S2-045  : http://192.168.108.128:8082/"
echo "  WebLogic CVE   : http://192.168.108.128:8083/   /ws-wsat/CoordinatorPortType"
echo "  Tomcat CVE-示例: http://192.168.108.128:8080/"
echo ""
echo "DONE."
