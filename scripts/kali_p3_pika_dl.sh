#!/bin/bash
# 通过 wget zip + 解压方式部署 Pikachu（比 git clone 稳）
export KALI_PASS="kail"
echo "$KALI_PASS" | sudo -S -v -p "" 2>/dev/null
SUDO="sudo"
WEB=/var/www/html
PK="$WEB/pikachu"
TMPD=/tmp/pika_dl

$SUDO rm -rf "$TMPD" "$PK" "${PK}.old"
mkdir -p "$TMPD"
cd "$TMPD"

ZIPS=(
  "https://gitee.com/zhuifengshaonian233/pikachu/repository/archive/master.zip|pika_p1.zip"
  "https://gitee.com/mirrors/pikachu/repository/archive/master.zip|pika_m.zip"
  "https://gitee.com/songboy/pikachu/repository/archive/master.zip|pika_s.zip"
  "https://codeload.github.com/zhuifengshaonianhanlu/pikachu/zip/refs/heads/master|pika_gh.zip"
)
OK=0
for entry in "${ZIPS[@]}"; do
  url="${entry%%|*}"; fn="${entry##*|}"
  echo "[TRY] $url -> $fn"
  if wget --timeout=60 --tries=2 -O "$fn" "$url" 2>&1 | tail -3; then
    SIZE=$(stat -c%s "$fn" 2>/dev/null || echo 0)
    echo "     下载大小: $SIZE bytes"
    if [ "$SIZE" -gt 50000 ]; then
      if unzip -o -q "$fn" -d "$TMPD/unzipped" 2>&1 | tail -2; then
        SRC=$(find "$TMPD/unzipped" -maxdepth 3 -name "install.php" -type f 2>/dev/null | head -1 | xargs dirname 2>/dev/null)
        if [ -z "$SRC" ]; then SRC=$(find "$TMPD/unzipped" -maxdepth 3 -name "index.php" -path "*vul*" -type f 2>/dev/null | head -1 | xargs -I{} dirname $(dirname {}) 2>/dev/null); fi
        if [ -z "$SRC" ]; then SRC=$(find "$TMPD/unzipped" -maxdepth 3 -type d -name "inc" 2>/dev/null | head -1 | xargs dirname 2>/dev/null); fi
        if [ -n "$SRC" ]; then
          $SUDO cp -r "$SRC" "$PK"
          OK=1
          echo "[OK] 解压成功 -> $PK (来自: $url)"
          break
        fi
      fi
    fi
  fi
  rm -f "$fn"; rm -rf "$TMPD/unzipped"
done
if [ $OK -eq 0 ]; then echo "[FAIL] 所有下载源失败"; exit 2; fi

$SUDO chown -R www-data:www-data "$PK"
echo "--- ls $PK ---"
ls "$PK" 2>&1 | head -20
echo "Size: $(du -sh $PK | cut -f1)  PHP files: $(find $PK -name '*.php' | wc -l)"
echo "--- config & install files ---"
find $PK \( -name "config.inc.php" -o -name "install.php" \) 2>&1 | head -10
echo "--- check modules ---"
for m in vul inc platform; do
  [ -d "$PK/$m" ] && echo "子目录 $m 存在 OK"
done
echo "DONE."
