import re, json, os, sys
from collections import Counter

def extract_day_data(filepath):
    """Extract all day data (title, keyPoints, objectives) from a plan file.
    Handles single-quoted, double-quoted, and d() function patterns."""
    if not os.path.exists(filepath):
        return []
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    days = []

    # Try pattern 1: day: N, title: 'XXX' (single quotes)
    day_pattern_single = r"day:\s*(\d+),\s*title:\s*'([^']*)'"
    day_positions = [(m.start(), m.group(1), m.group(2), 'single')
                     for m in re.finditer(day_pattern_single, content)]

    # Also try pattern 2: day: N, title: "XXX" (double quotes)
    day_pattern_double = r'day:\s*(\d+),\s*title:\s*"([^"]*)"'
    day_positions += [(m.start(), m.group(1), m.group(2), 'double')
                      for m in re.finditer(day_pattern_double, content)]

    # Pattern 3: d('id', day, 'title', ...) for vendor file
    day_pattern_vendor = r"d\('[^']*',\s*(\d+),\s*'([^']*)'"
    day_positions += [(m.start(), m.group(1), m.group(2), 'vendor')
                      for m in re.finditer(day_pattern_vendor, content)]

    # Sort by position
    day_positions.sort(key=lambda x: x[0])

    for i, (pos, day_num, title, style) in enumerate(day_positions):
        end_pos = day_positions[i+1][0] if i+1 < len(day_positions) else len(content)
        chunk = content[pos:end_pos]

        # Extract keyPoints - handle both quote styles
        kp_match = re.search(r"keyPoints:\s*\[(.*?)\]", chunk, re.DOTALL)
        key_points = []
        if kp_match:
            kp_text = kp_match.group(1)
            key_points = re.findall(r"'([^']*)'", kp_text)
            if not key_points:
                key_points = re.findall(r'"([^"]*)"', kp_text)

        # Extract objectives - handle both quote styles
        obj_match = re.search(r"objectives:\s*\[(.*?)\]", chunk, re.DOTALL)
        objectives = []
        if obj_match:
            obj_text = obj_match.group(1)
            objectives = re.findall(r"'([^']*)'", obj_text)
            if not objectives:
                objectives = re.findall(r'"([^"]*)"', obj_text)

        days.append({
            'day': int(day_num),
            'title': title,
            'keyPoints': key_points,
            'objectives': objectives,
        })

    return days


# Parse resource data
with open('src/data/resourceData.ts', 'r', encoding='utf-8') as f:
    res_content = f.read()

# Extract each resource entry
res_blocks = re.split(r'\n  \{\n', res_content)
resources = []
for block in res_blocks:
    id_match = re.search(r'"id":\s*"([^"]+)"', block)
    if not id_match:
        continue
    rid = id_match.group(1)
    title_match = re.search(r'"title":\s*"([^"]+)"', block)
    tags_match = re.search(r'"tags":\s*\[(.*?)\]', block, re.DOTALL)
    cat_match = re.search(r'"category":\s*"([^"]+)"', block)
    summ_match = re.search(r'"summary":\s*"([^"]+)"', block)
    diff_match = re.search(r'"difficulty":\s*"([^"]+)"', block)
    minutes_match = re.search(r'"readMinutes":\s*(\d+)', block)
    path_match = re.search(r'"contentPath":\s*"([^"]+)"', block)
    author_match = re.search(r'"author":\s*"([^"]+)"', block)
    date_match = re.search(r'"updatedAt":\s*"([^"]+)"', block)

    tags = re.findall(r'"([^"]+)"', tags_match.group(1)) if tags_match else []
    resources.append({
        'id': rid,
        'title': title_match.group(1) if title_match else '',
        'tags': tags,
        'category': cat_match.group(1) if cat_match else '',
        'summary': summ_match.group(1) if summ_match else '',
        'difficulty': diff_match.group(1) if diff_match else '进阶',
        'readMinutes': int(minutes_match.group(1)) if minutes_match else 20,
        'contentPath': path_match.group(1) if path_match else '',
        'author': author_match.group(1) if author_match else '网安百宝箱编辑部',
        'updatedAt': date_match.group(1) if date_match else '2026-06-18',
    })

print(f'Existing resources: {len(resources)}')

# Keyword matching with better scoring
def match_score(day, resource):
    day_text = day['title'] + ' ' + ' '.join(day.get('keyPoints', []))
    res_text = resource['title'] + ' ' + ' '.join(resource.get('tags', []))
    day_lower = day_text.lower()
    res_lower = res_text.lower()

    score = 0
    day_words = set()
    for kw in day.get('keyPoints', []) + [day['title']]:
        for w in re.findall(r'[\u4e00-\u9fff]{2,}', kw):
            day_words.add(w)
        for w in re.findall(r'[A-Za-z0-9+#]{2,}', kw):
            day_words.add(w.lower())

    for w in day_words:
        if w.lower() in res_lower:
            score += 3
        elif len(w) >= 3:
            for tag in resource.get('tags', []):
                if w.lower() in tag.lower() or tag.lower() in w.lower():
                    score += 1

    # Bonus for category match
    cat_map = {
        '渗透测试': 'penetration', '漏洞利用': 'vuln', 'SQL注入': 'vuln',
        'XSS': 'penetration', 'SSRF': 'penetration', '文件上传': 'penetration',
        '等级保护': 'djbh', '等保': 'djbh', 'AI': 'ai-security',
        '护网': 'hw', '应急响应': 'incident', '安全运营': 'soc',
        '代码审计': 'codeaudit', '密码': 'crypto-compliance',
        '数据安全': 'data-security', '零信任': 'zero-trust',
    }
    for kw, cat in cat_map.items():
        if kw in day['title'] and resource['category'] == cat:
            score += 2

    return score


cyber_plans = {
    'basic': 'src/data/cyberBasic.ts',
    'penetration': 'src/data/cyberPenetration.ts',
    'defense': 'src/data/cyberDefense.ts',
    'ai': 'src/data/cyberAi.ts',
    'hw': 'src/data/cyberHw.ts',
    'hw-express': 'src/data/cyberHwExpress28.ts',
    'vendor': 'src/data/cyberVendor.ts',
}

interview_plans = {
    'cisp': 'src/data/interviewCisp.ts',
    'basic': 'src/data/interviewBasic.ts',
    'penetration': 'src/data/interviewPenetration.ts',
    'defense': 'src/data/interviewDefense.ts',
    'ai': 'src/data/interviewAi.ts',
    'hw': 'src/data/interviewHw.ts',
}

mapping = {}
unmatched = []
matched = []

for plan_type, plans in [('cyber', cyber_plans), ('interview', interview_plans)]:
    for plan_id, filepath in plans.items():
        days = extract_day_data(filepath)
        key = f'{plan_type}/{plan_id}'
        mapping[key] = {}

        for day in days:
            scores = [(match_score(day, r), r) for r in resources]
            scores.sort(key=lambda x: -x[0])
            best_score, best_res = scores[0] if scores else (0, None)

            matched_res = []
            for s, r in scores:
                if s >= 4:
                    matched_res.append(r['id'])
                if len(matched_res) >= 2:
                    break

            if matched_res:
                mapping[key][str(day['day'])] = matched_res
                matched.append({'plan': key, **day, 'resources': matched_res, 'score': best_score})
            else:
                mapping[key][str(day['day'])] = []
                unmatched.append({'plan': key, **day, 'best_score': best_score, 'best_id': best_res['id'] if best_res else 'none'})

print(f'\nMatched days: {len(matched)}')
print(f'Unmatched days (need new resources): {len(unmatched)}')

# Group unmatched by plan
plan_counts = Counter(d['plan'] for d in unmatched)
print('\nNew resources needed per plan:')
for plan, count in sorted(plan_counts.items()):
    print(f'  {plan}: {count}')


# Improved category detection - more specific matching
def determine_category(day):
    title = day.get('title', '')
    key_points = ' '.join(day.get('keyPoints', []))
    full_text = title + ' ' + key_points

    # Priority-ordered keyword → category mapping (first match wins)
    cat_rules = [
        # AI安全
        ('ai-security', ['AI安全', 'LLM', '大模型', '机器学习', '深度学习', '对抗样本', '模型', 'Prompt注入', '神经网络', 'NLP', '自然语言', '数据挖掘', 'ML', 'RAG', '向量', 'Embedding', 'GPT', 'Claude', 'Copilot', 'GAN', 'Transformer']),
        # 护网
        ('hw', ['护网', 'HW行动', '红队', '蓝队', '值守', '研判', '溯源', 'HW', '红蓝对抗', '蓝军', '红军']),
        # 渗透测试
        ('penetration', ['渗透', 'SQL注入', 'XSS', 'CSRF', 'SSRF', '文件上传', '文件包含', '命令注入', '反序列化', '提权', '横向移动', '后渗透', '信息收集', '端口扫描', '漏洞扫描', '社工', '钓鱼', '打点', '突破', '免杀', '代理', '隧道', '反弹Shell', 'Payload', 'C2']),
        # 漏洞分析
        ('vuln', ['CVE', '0day', 'EXP', '漏洞复现', '漏洞挖掘', 'Fuzz', 'PoC', '漏洞分析']),
        # 代码审计
        ('codeaudit', ['代码审计', '代码', '源码', 'SAST', 'DAST', '白盒', 'SDLC', 'DevSecOps', 'CI/CD', 'Java', 'Python', 'PHP', 'JavaScript']),
        # 应急响应
        ('incident', ['应急', '响应', '日志分析', '取证', '勒索', '病毒', '木马', '后门', '入侵', 'APT', '威胁狩猎', '威胁检测', 'EDR', 'HIDS']),
        # 安全运营
        ('soc', ['SOC', 'SIEM', 'SOAR', '运营', '监控', '告警', '日志', '态势感知', 'Splunk', 'ELK']),
        # 数据安全
        ('data-security', ['数据安全', '数据', '隐私', '脱敏', 'DLP', '个人信息', 'PIPL', 'GDPR', '数据分类']),
        # 云安全
        ('cloud', ['云安全', '云', 'K8s', 'Kubernetes', 'Docker', '容器', 'AWS', 'S3', 'Serverless', '多云', '虚拟化']),
        # 密码合规
        ('crypto-compliance', ['密码', '加密', '解密', '国密', 'SM2', 'SM3', 'SM4', 'PKI', '哈希', '数字签名', '证书', 'SSL', 'TLS', 'HTTPS', 'AES', 'RSA']),
        # 等级保护
        ('djbh', ['等保', '等级保护', '合规', '测评', '定级', '备案']),
        # 零信任
        ('zero-trust', ['零信任', 'IAM', 'MFA', 'SSO', 'PAM', '身份', '权限', '授权', '访问控制']),
        # CTF
        ('ctf', ['CTF', '夺旗', '解题', 'AWD', '攻防']),
        # 工控IoT
        ('ics-iot', ['工控', 'ICS', 'SCADA', 'IoT', '物联网', 'PLC', 'Modbus']),
        # 移动安全
        ('mobile', ['移动', 'Android', 'iOS', 'APP', '逆向', 'Hook', 'Frida', 'Xposed']),
        # 威胁情报
        ('intel', ['威胁情报', '情报', 'IOC', 'TTP', 'MITRE', 'ATT&CK']),
        # Web3
        ('web3', ['Web3', '区块链', '智能合约', 'Solidity', 'NFT', 'DeFi']),
        # 车联网
        ('v2x', ['车联网', 'V2X', 'CAN', '自动驾驶']),
        # 供应链
        ('supply-chain', ['供应链', '供应链安全', 'SBOM', '开源']),
        # 逆向
        ('reverse', ['逆向', '反编译', '反汇编', 'IDA', 'Ghidra', '脱壳']),
        # 工具
        ('tools', ['工具', 'Wireshark', 'Nmap', 'Burp', 'Metasploit', 'Nessus', 'AWVS']),
    ]

    scores_by_cat = {}
    for cat, keywords in cat_rules:
        score = 0
        for kw in keywords:
            if kw in full_text:
                score += 1
        if score > 0:
            scores_by_cat[cat] = score

    if scores_by_cat:
        best_cat = max(scores_by_cat, key=scores_by_cat.get)
        return best_cat

    return 'knowledge'


# Generate new resource entries for unmatched days
new_id_counter = {}
new_resources = []

for d in unmatched:
    plan_id = d['plan'].split('/')[1]
    plan_type = d['plan'].split('/')[0]

    if plan_id not in new_id_counter:
        new_id_counter[plan_id] = 0
    new_id_counter[plan_id] += 1

    prefix_map = {
        'basic': 'basic-read', 'penetration': 'read-pen', 'defense': 'read-def',
        'ai': 'read-ai', 'hw': 'read-hw', 'hw-express': 'read-hw',
        'cisp': 'read-cisp',
    }
    prefix = prefix_map.get(plan_id, f'read-{plan_id[:4]}')
    new_id = f'{prefix}-{new_id_counter[plan_id]:03d}'

    # Determine category using improved function
    best_cat = determine_category(d)

    # Determine difficulty
    difficulty = '进阶'
    title_lower = d['title'].lower()
    if '概述' in d['title'] or '基础' in d['title'] or '入门' in d['title'] or '简介' in d['title']:
        difficulty = '入门'
    elif '高级' in d['title'] or '深度' in d['title'] or '精通' in d['title'] or '实战' in d['title']:
        difficulty = '精通'

    # Generate summary from objectives or keyPoints
    summary_parts = []
    if d.get('objectives'):
        summary_parts = d['objectives'][:3]
    elif d.get('keyPoints'):
        summary_parts = d['keyPoints'][:3]
    summary = '；'.join(summary_parts) if summary_parts else d['title']
    if len(summary) > 80:
        summary = summary[:77] + '...'

    # Tags from keyPoints + title keywords
    tags = []
    if d.get('keyPoints'):
        tags = d['keyPoints'][:5]
    if len(tags) < 3:
        extra_tags = list(dict.fromkeys(re.findall(r'[\u4e00-\u9fff]{2,4}', d['title'])))[:5]
        for et in extra_tags:
            if et not in tags:
                tags.append(et)
        tags = tags[:5]

    read_mins = 15
    if d.get('keyPoints'):
        read_mins = min(30, 12 + len(d['keyPoints']) * 3)

    new_res = {
        'id': new_id,
        'category': best_cat,
        'title': f"{d['title']}",
        'summary': summary,
        'tags': tags if tags else [d['title']],
        'difficulty': difficulty,
        'readMinutes': read_mins,
        'updatedAt': '2026-06-18',
        'contentPath': f"contents/{best_cat}/{new_id}.md",
        'author': '网安百宝箱编辑部',
        '_day': d['day'],
        '_plan': d['plan'],
        '_planType': plan_type,
    }
    new_resources.append(new_res)
    mapping[d['plan']][str(d['day'])] = [new_id]

# Save outputs
with open('_day_resource_map.json', 'w', encoding='utf-8') as f:
    json.dump(mapping, f, ensure_ascii=False, indent=2)

with open('_new_resources.json', 'w', encoding='utf-8') as f:
    json.dump(new_resources, f, ensure_ascii=False, indent=2)

# Stats on new resources categories
new_cats = Counter(r['category'] for r in new_resources)
print('\n=== New resource categories ===')
for cat, count in new_cats.most_common():
    print(f'  {cat}: {count}')

print(f'\nTotal new resources to create: {len(new_resources)}')
print('Saved mapping and new resources to JSON files')
