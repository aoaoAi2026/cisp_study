import json, os, re

with open('src/data/resourceData.ts', 'r', encoding='utf-8') as f:
    content = f.read()

existing_ids = set(re.findall(r'"id":\s*"([^"]+)"', content))
print(f"Existing resource count: {len(existing_ids)}")

# Tool articles to add - only if IDs don't exist yet
tool_articles = [
    {
        "id": "tools-nmap-001",
        "category": "tools",
        "title": "Nmap 从入门到精通：端口扫描的瑞士军刀",
        "summary": "全面掌握 Nmap 的各种扫描技术，从基础主机发现到高级 NSE 脚本引擎，覆盖渗透测试中的信息收集全流程",
        "tags": ["Nmap", "端口扫描", "信息收集", "NSE脚本", "主机发现", "OS探测"],
        "difficulty": "入门",
        "readMinutes": 25,
        "updatedAt": "2026-06-18",
        "contentPath": "contents/tools/tools-nmap-001.md",
        "author": "网安百宝箱编辑部"
    },
    {
        "id": "tools-burp-001",
        "category": "tools",
        "title": "Burp Suite 实战完全指南：Web 渗透的必备利器",
        "summary": "从 Proxy 拦截到 Intruder 爆破，再到 Repeater 重放和 Scanner 扫描，全方位掌握 Burp Suite 在 Web 渗透中的实战用法",
        "tags": ["Burp Suite", "Web渗透", "代理拦截", "Intruder", "Repeater", "漏洞扫描"],
        "difficulty": "进阶",
        "readMinutes": 30,
        "updatedAt": "2026-06-18",
        "contentPath": "contents/tools/tools-burp-001.md",
        "author": "网安百宝箱编辑部"
    },
    {
        "id": "tools-wireshark-001",
        "category": "tools",
        "title": "Wireshark 流量分析实战：从抓包到溯源",
        "summary": "深入掌握 Wireshark 过滤语法、协议分析与攻击流量识别，涵盖 HTTP/HTTPS/DNS/TCP 等常见协议的分析技巧",
        "tags": ["Wireshark", "流量分析", "抓包", "协议分析", "溯源", "网络取证"],
        "difficulty": "进阶",
        "readMinutes": 28,
        "updatedAt": "2026-06-18",
        "contentPath": "contents/tools/tools-wireshark-001.md",
        "author": "网安百宝箱编辑部"
    },
    {
        "id": "tools-metasploit-001",
        "category": "tools",
        "title": "Metasploit 渗透测试框架深度使用指南",
        "summary": "系统学习 Metasploit 的核心模块体系：exploit、payload、auxiliary、post-exploitation，构建完整的渗透测试工作流",
        "tags": ["Metasploit", "渗透测试", "漏洞利用", "Meterpreter", "payload", "后渗透"],
        "difficulty": "进阶",
        "readMinutes": 30,
        "updatedAt": "2026-06-18",
        "contentPath": "contents/tools/tools-metasploit-001.md",
        "author": "网安百宝箱编辑部"
    },
    {
        "id": "tools-ida-001",
        "category": "reverse",
        "title": "IDA Pro & Ghidra 逆向分析入门：从二进制到伪代码",
        "summary": "掌握静态逆向分析的核心方法论，学会使用 IDA Pro 和 Ghidra 进行反汇编、函数识别、交叉引用分析和关键逻辑定位",
        "tags": ["IDA Pro", "Ghidra", "逆向工程", "反汇编", "反编译", "二进制分析"],
        "difficulty": "精通",
        "readMinutes": 30,
        "updatedAt": "2026-06-18",
        "contentPath": "contents/reverse/tools-ida-001.md",
        "author": "网安百宝箱编辑部"
    },
]

new_articles = []
for art in tool_articles:
    if art["id"] in existing_ids:
        print(f"SKIP (already exists): {art['id']}")
    else:
        new_articles.append(art)
        print(f"WILL ADD: {art['id']}")

print(f"\nNew articles to append: {len(new_articles)}")

if new_articles:
    # Append to resourceData.ts
    res_lines = []
    for r in new_articles:
        tags_str = ',\n    '.join(f'"{t}"' for t in r['tags'])
        entry = f'''  {{
    "id": "{r['id']}",
    "category": "{r['category']}",
    "title": "{r['title']}",
    "summary": "{r['summary']}",
    "tags": [{tags_str}],
    "difficulty": "{r['difficulty']}",
    "readMinutes": {r['readMinutes']},
    "updatedAt": "{r['updatedAt']}",
    "contentPath": "{r['contentPath']}",
    "author": "{r['author']}"
  }}'''
        res_lines.append(entry)

    last_bracket_pos = content.rfind('\n];')
    if last_bracket_pos > 0:
        new_content = content[:last_bracket_pos] + ',\n' + ',\n'.join(res_lines) + '\n];'
        with open('src/data/resourceData.ts', 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Appended {len(new_articles)} new tool articles to resourceData.ts")
    else:
        print("ERROR: Could not find array closing bracket")

# Save new articles info for content generation
with open('_new_tools.json', 'w', encoding='utf-8') as f:
    json.dump(new_articles, f, ensure_ascii=False, indent=2)

print("Done - saved _new_tools.json")
