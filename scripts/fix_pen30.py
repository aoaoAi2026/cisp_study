import json

fpath = r'e:\internal_safe\cisp1\cisp\src\data\cyberPenetration.ts'
with open(fpath, 'r', encoding='utf-8') as f:
    content = f.read()

resources = [
    {"name": "渗透测试报告模板", "url": "https://github.com/noraj/OSCP-Exam-Report-Template-Markdown", "type": "article"},
    {"name": "漏洞评级标准(CVSS)", "url": "https://www.first.org/cvss/v3.1/user-guide", "type": "article"},
    {"name": "技术报告撰写指南", "url": "https://www.sans.org/reading-room/whitepapers/testing/", "type": "article"},
    {"name": "渗透测试报告案例", "url": "https://www.freebuf.com/articles/web/298023.html", "type": "article"}
]
res_str = ',\n      resources: ' + json.dumps(resources, ensure_ascii=False)

# Find pen-30
idx = content.find("id: 'pen-30'")
# Find environmentSetup which is the last module before closing
env_idx = content.find('environmentSetup: {', idx)
# Find '];\n' which closes the week array
end_marker = content.find('];\n', env_idx)

# Find the last '  }' before '];'
text_before_end = content[env_idx:end_marker]
last_close = text_before_end.rfind('\n  }')
if last_close >= 0:
    close_pos = env_idx + last_close
    new_text = content[:close_pos] + res_str + content[close_pos:]
    with open(fpath, 'w', encoding='utf-8') as f:
        f.write(new_text)
    print('pen-30: +resources (4条) 修复成功')
else:
    # Fallback: just before '];' minus '  }'
    print('pen-30: 尝试备用方案')
    # Try finding the last non-template closing brace
    # The structure is:
    #   environmentSetup: { ... }
    # }
    # ];
    # Look for '  }\n];'
    marker = content.find('\n  }\n];', env_idx)
    if marker >= 0:
        new_text = content[:marker] + res_str + content[marker:]
        with open(fpath, 'w', encoding='utf-8') as f:
            f.write(new_text)
        print('pen-30: +resources (4条) 备用方案成功')
    else:
        print('pen-30: 备用方案也失败')
