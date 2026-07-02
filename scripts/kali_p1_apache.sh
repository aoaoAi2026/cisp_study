#!/bin/bash
export KALI_PASS="kail"
echo "$KALI_PASS" | sudo -S -v -p "" 2>/dev/null
SUDO="sudo"
$SUDO tee /etc/apache2/ports.conf >/dev/null <<'PORTS'
Listen 0.0.0.0:80
Listen 0.0.0.0:9111

<IfModule ssl_module>
	Listen 443
</IfModule>

<IfModule mod_gnutls.c>
	Listen 443
</IfModule>
PORTS
echo "--- ports.conf ---"
cat /etc/apache2/ports.conf
echo "--- configtest ---"
$SUDO apache2ctl configtest 2>&1
echo "--- restart ---"
$SUDO systemctl restart apache2 2>&1 | tail -5
sleep 4
echo "apache2=$(sudo systemctl is-active apache2)"
echo "--- ports ---"
$SUDO ss -tlnp 2>/dev/null | grep -E "apache|80|9111" || true
echo "--- HTTP ---"
for p in 80 9111; do
  echo -n "127.0.0.1:$p  "; curl -s -o /dev/null -w "HTTP %{http_code}\n" --max-time 5 http://127.0.0.1:$p/
done
