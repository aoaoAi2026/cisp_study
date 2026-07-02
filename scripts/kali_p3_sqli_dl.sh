#!/bin/bash
# 通过 wget zip + 解压方式部署 SQLi-Labs（比 git clone 稳）
export KALI_PASS="kail"
echo "$KALI_PASS" | sudo -S -v -p "" 2>/dev/null
SUDO="sudo"
WEB=/var/www/html
SL="$WEB/sqli-labs"
TMPD=/tmp/sqli_dl

$SUDO rm -rf "$TMPD" "$SL" "${SL}.old"
mkdir -p "$TMPD"
cd "$TMPD"

ZIPS=(
  "https://gitee.com/zhuifengshaonian233/sqli-labs-php7/repository/archive/master.zip|php7_master.zip"
  "https://gitee.com/mirrors/SQLi-Labs/repository/archive/master.zip|mirrors_master.zip"
  "https://codeload.github.com/Audi-1/sqli-labs/zip/refs/heads/master|audi1_master.zip"
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
        # 找到解压出来的第一个子目录就是源码根
        SRC=$(find "$TMPD/unzipped" -maxdepth 2 -name "index.php" -type f 2>/dev/null | head -1 | xargs dirname 2>/dev/null)
        if [ -z "$SRC" ]; then SRC=$(find "$TMPD/unzipped" -maxdepth 2 -type d -name "Less-1" 2>/dev/null | head -1 | xargs dirname 2>/dev/null); fi
        if [ -n "$SRC" ]; then
          $SUDO cp -r "$SRC" "$SL"
          OK=1
          echo "[OK] 解压成功 -> $SL (来自: $url)"
          break
        fi
      fi
    fi
  fi
  rm -f "$fn"; rm -rf "$TMPD/unzipped"
done
if [ $OK -eq 0 ]; then echo "[FAIL] 所有下载源失败"; exit 2; fi

$SUDO chown -R www-data:www-data "$SL"
echo "--- ls $SL ---"
ls "$SL" 2>&1 | head -20
echo "Size: $(du -sh $SL | cut -f1)  PHP files: $(find $SL -name '*.php' | wc -l)"
echo "--- Less dirs count ---"
find $SL -maxdepth 1 -type d -name "Less-*" | wc -l
echo "--- 检查是否使用老版 mysql_* (需要SHIM?) ---"
CNT=$(grep -rEl "mysql_(connect|select_db|query|fetch_array|error)" "$SL" --include="*.php" 2>/dev/null | wc -l)
echo "OLD mysql_* based files: $CNT"
if [ "$CNT" -gt 0 ]; then echo "SHIM_NEEDED=YES"; else echo "SHIM_NEEDED=NO (PHP8 ready)"; fi
echo "DONE."
