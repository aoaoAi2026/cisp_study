# AWD 攻防赛脚本编写与部署实战

---

## 一、防御脚本

```python
#!/usr/bin/env python3
"""AWD 自动化防御"""
import os, shutil, time, hashlib
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

WWW = "/var/www/html/"
BACKUP = "/tmp/backup/"

class Defender(FileSystemEventHandler):
    def on_modified(self, event):
        if not event.src_path.endswith('.php'): return
        
        # 计算哈希对比备份
        with open(event.src_path, 'rb') as f:
            h = hashlib.md5(f.read()).hexdigest()
        
        backup_path = BACKUP + event.src_path.replace(WWW, '')
        if not os.path.exists(backup_path): return
        
        with open(backup_path, 'rb') as f:
            backup_hash = hashlib.md5(f.read()).hexdigest()
        
        if h != backup_hash:
            print(f"⚠️ 文件被修改: {event.src_path} → 自动恢复!")
            shutil.copy2(backup_path, event.src_path)

# 启动监控
observer = Observer()
observer.schedule(Defender(), WWW, recursive=True)
observer.start()

# 定期提交flag
while True:
    time.sleep(300)  # 每5分钟
```

---

## 二、攻击脚本

```bash
#!/bin/bash
# AWD 批量攻击

FLAG_REGEX='flag\{[a-f0-9-]+\}'
SUBMIT_URL="http://平台/submit"

# 批量攻击数组
attack_funcs=(
    "sqli_attack"
    "rce_attack" 
    "ssrf_attack"
)

for ip in $(cat targets.txt); do
    for func in "${attack_funcs[@]}"; do
        flag=$($func $ip 2>/dev/null | grep -oP "$FLAG_REGEX" | head -1)
        [ -n "$flag" ] && curl -s "$SUBMIT_URL?flag=$flag&token=$TOKEN" &
    done
done
wait
```

---

## 三、应急恢复

```bash
#!/bin/bash
# 一键恢复被删除的文件
tar xzf /tmp/backup.tar.gz -C /var/www/html/
chown -R www-data:www-data /var/www/html/
chmod 644 /var/www/html/*.php
echo "恢复完成 $(date)" >> /tmp/recover.log
```
