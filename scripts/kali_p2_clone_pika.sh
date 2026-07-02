#!/bin/bash
# 克隆 Pikachu 到 /var/www/html/pikachu/
export KALI_PASS="kail"
echo "$KALI_PASS" | sudo -S -v -p "" 2>/dev/null
SUDO="sudo"
WEB=/var/www/html
PK="$WEB/pikachu"
if [ -d "$PK" ]; then $SUDO mv "$PK" "${PK}.old.$(date +%s)"; fi

TRY=(
  "https://gitee.com/zhuifengshaonian233/pikachu.git"
  "https://gitee.com/mirrors/pikachu.git"
  "https://gitee.com/songboy/pikachu.git"
  "https://github.com/zhuifengshaonianhanlu/pikachu.git"
)
for url in "${TRY[@]}"; do
  echo "[TRY] $url"
  if $SUDO git clone --depth 1 "$url" "$WEB/__tmp_pika" 2>&1 | tail -5; then
    $SUDO mv "$WEB/__tmp_pika" "$PK"
    echo "[OK] 克隆成功: $PK (source: $url)"
    break
  fi
  $SUDO rm -rf "$WEB/__tmp_pika" 2>/dev/null
done
$SUDO chown -R www-data:www-data "$PK"
echo "--- ls $PK ---"
ls "$PK" 2>&1 | head -20
echo "--- size / php files ---"
echo "Size: $(du -sh $PK | cut -f1)"
echo "PHP files: $(find $PK -name '*.php' | wc -l)"
echo "--- config files ---"
find $PK -name "config.inc.php" -o -name "install.php" 2>&1 | head -10
echo "DONE"
