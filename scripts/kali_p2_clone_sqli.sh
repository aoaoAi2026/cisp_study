#!/bin/bash
# 克隆 SQLi-Labs 到 /var/www/html/sqli-labs/
export KALI_PASS="kail"
echo "$KALI_PASS" | sudo -S -v -p "" 2>/dev/null
SUDO="sudo"
WEB=/var/www/html
SL="$WEB/sqli-labs"
if [ -d "$SL" ]; then $SUDO mv "$SL" "${SL}.old.$(date +%s)"; fi

TRY=(
  "https://gitee.com/zhuifengshaonian233/sqli-labs-php7.git"
  "https://gitee.com/zyhsyz/sqli-labs-php7.git"
  "https://gitee.com/mirrors/SQLi-Labs.git"
  "https://github.com/Audi-1/sqli-labs.git"
)
for url in "${TRY[@]}"; do
  echo "[TRY] $url"
  if $SUDO git clone --depth 1 "$url" "$WEB/__tmp_sqli" 2>&1 | tail -5; then
    $SUDO mv "$WEB/__tmp_sqli" "$SL"
    echo "[OK] 克隆成功: $SL (source: $url)"
    break
  fi
  $SUDO rm -rf "$WEB/__tmp_sqli" 2>/dev/null
done
$SUDO chown -R www-data:www-data "$SL"
echo "--- ls $SL ---"
ls "$SL" 2>&1 | head -20
echo "--- size / php files ---"
echo "Size: $(du -sh $SL | cut -f1)"
echo "PHP files: $(find $SL -name '*.php' | wc -l)"
echo "--- check old mysql_* calls ---"
if grep -rEl "mysql_(connect|select_db|query|fetch_array|error)" "$SL" --include="*.php" 2>/dev/null | head -1 | grep -q .; then
  echo "SHIM_NEEDED=YES (has old mysql_* calls)"
else
  echo "SHIM_NEEDED=NO (already mysqli based, PHP8.4 compatible)"
fi
echo "--- Less files count ---"
find $SL -maxdepth 1 -type d -name "Less-*" | wc -l
echo "DONE"
