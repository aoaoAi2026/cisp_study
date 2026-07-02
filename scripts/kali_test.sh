#!/bin/bash
# Kali 上的小测试脚本 —— 验证 --script 模式 + base64 传输工作
set -e
echo "=== 测试: $(date) ==="
whoami
hostname
echo "Kali 工作目录: $(pwd)"
echo "HOME=$HOME"
echo "Shell PID: $$"
echo "Kali 发行版: $(cat /etc/os-release 2>/dev/null | head -3)"
echo "OK: base64 脚本执行成功！"
