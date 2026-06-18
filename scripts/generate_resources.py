import re, json, os

# Load mapping and new resources
with open('_day_resource_map.json', 'r', encoding='utf-8') as f:
    mapping = json.load(f)

with open('_new_resources.json', 'r', encoding='utf-8') as f:
    new_resources = json.load(f)

# ============ Step 1: Generate dayResourceMap.ts ============
ts_lines = [
    '// Auto-generated day-to-resource mapping',
    '// Maps (planType, planId, dayNumber) -> resourceId[]',
    '',
    'export type PlanType = "cyber" | "interview";',
    '',
    'type DayMap = Record<string, string[]>; // day number -> resource IDs',
    'type PlanMap = Record<string, DayMap>;   // planId -> day map',
    '',
    '// Maps: planType -> planId -> dayNumber -> resourceIds',
    'export const dayResourceMap: Record<PlanType, PlanMap> = {',
]

for plan_type in ['cyber', 'interview']:
    ts_lines.append(f'  "{plan_type}": {{')
    for full_key in sorted(mapping.keys()):
        if not full_key.startswith(plan_type + '/'):
            continue
        plan_id = full_key.split('/')[1]
        day_map = mapping[full_key]
        ts_lines.append(f'    "{plan_id}": {{')
        for day_num in sorted(day_map.keys(), key=int):
            res_ids = day_map[day_num]
            if res_ids:
                ids_str = ', '.join(f'"{r}"' for r in res_ids)
                ts_lines.append(f'      "{day_num}": [{ids_str}],')
            else:
                ts_lines.append(f'      "{day_num}": [],')
        ts_lines.append('    },')
    ts_lines.append('  },')
ts_lines.append('};')
ts_lines.append('')
ts_lines.append('export function getReadingsForDay(planType: PlanType, planId: string, day: number): string[] {')
ts_lines.append('  return dayResourceMap[planType]?.[planId]?.[String(day)] || [];')
ts_lines.append('}')

with open('src/data/dayResourceMap.ts', 'w', encoding='utf-8') as f:
    f.write('\n'.join(ts_lines))
print('Generated src/data/dayResourceMap.ts')

# ============ Step 2: Generate new resource entries for resourceData.ts ============
res_lines = []
for r in new_resources:
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
    "author": "网安百宝箱编辑部"
  }}'''
    res_lines.append(entry)

# Read original resourceData and insert before the closing ]
with open('src/data/resourceData.ts', 'r', encoding='utf-8') as f:
    orig = f.read()

# Find the last '}' before '];' at end of allResources array
# Insert new entries before the closing ]
last_bracket_pos = orig.rfind('\n];')
if last_bracket_pos > 0:
    new_orig = orig[:last_bracket_pos] + ',\n' + ',\n'.join(res_lines) + '\n];'
    with open('src/data/resourceData.ts', 'w', encoding='utf-8') as f:
        f.write(new_orig)
    print(f'Appended {len(new_resources)} new resources to resourceData.ts')

# ============ Step 3: Generate .md files for each new resource ============
# Extract day content from the original plan files for richer content
def get_day_content(plan_type, plan_id, day_num):
    """Try to get the day's content from the plan file"""
    plan_files = {
        'cyber': {
            'basic': 'src/data/cyberBasic.ts',
            'penetration': 'src/data/cyberPenetration.ts',
            'defense': 'src/data/cyberDefense.ts',
            'ai': 'src/data/cyberAi.ts',
            'hw': 'src/data/cyberHw.ts',
            'hw-express': 'src/data/cyberHwExpress28.ts',
        },
        'interview': {
            'cisp': 'src/data/interviewCisp.ts',
            'basic': 'src/data/interviewBasic.ts',
            'penetration': 'src/data/interviewPenetration.ts',
            'defense': 'src/data/interviewDefense.ts',
            'ai': 'src/data/interviewAi.ts',
            'hw': 'src/data/interviewHw.ts',
        }
    }
    
    filepath = plan_files.get(plan_type, {}).get(plan_id)
    if not filepath or not os.path.exists(filepath):
        return None, None, None
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find the day entry
    pattern = f"day:\\s*{day_num},\\s*title:\\s*'([^']*)'"
    match = re.search(pattern, content)
    if not match:
        return None, None, None
    
    day_title = match.group(1)
    pos = match.start()
    
    # Find next day entry or end
    next_match = re.search(r"day:\s*\d+,\s*title:\s*'", content[pos+10:])
    end_pos = pos + 10 + next_match.start() if next_match else len(content)
    chunk = content[pos:end_pos]
    
    # Extract keyPoints
    kp_match = re.search(r"keyPoints:\s*\[(.*?)\]", chunk, re.DOTALL)
    key_points = []
    if kp_match:
        key_points = re.findall(r"'([^']*)'", kp_match.group(1))
    
    # Extract objectives
    obj_match = re.search(r"objectives:\s*\[(.*?)\]", chunk, re.DOTALL)
    objectives = []
    if obj_match:
        objectives = re.findall(r"'([^']*)'", obj_match.group(1))
    
    return day_title, key_points, objectives

category_names = {
    'knowledge': '基础知识',
    'penetration': '渗透测试',
    'vuln': '漏洞分析',
    'codeaudit': '代码审计',
    'djbh': '等级保护',
    'ctf': 'CTF竞赛',
    'cloud': '云安全',
    'mobile': '移动安全',
    'reverse': '逆向工程',
    'data-security': '数据安全',
    'incident': '应急响应',
    'intel': '威胁情报',
    'soc': '安全运营',
    'tools': '工具指南',
    'ai-security': 'AI安全',
    'supply-chain': '供应链安全',
    'ics-iot': '工控安全',
    'web3': 'Web3安全',
    'v2x': '车联网安全',
    'zero-trust': '零信任',
    'crypto-compliance': '密码合规',
    'hw': '护网行动',
}

created_count = 0
for r in new_resources:
    plan_type, plan_id = r['_plan'].split('/')
    day_num = r['_day']
    
    # Get rich content from the plan file
    day_title, key_points, objectives = get_day_content(plan_type, plan_id, day_num)
    
    cat_name = category_names.get(r['category'], r['category'])
    
    md_path = os.path.join('public', r['contentPath'])
    os.makedirs(os.path.dirname(md_path), exist_ok=True)
    
    kp_bullets = '\n'.join(f'- {kp}' for kp in (key_points or r['tags']))
    obj_bullets = '\n'.join(f'- {obj}' for obj in (objectives or []))
    
    md_content = f'''# {r['title']}

> 分类：{cat_name} | 难度：{r['difficulty']} | 阅读时间：约{r['readMinutes']}分钟

## 概述

{r['summary']}

## 核心知识点

{kp_bullets}

{"## 学习目标\n\n" + obj_bullets if objectives else ""}

## 正文

本章节为上课内容配套读物，请结合当天课程视频和实践操作同步阅读。

### 一、基础概念

在开始深入学习之前，先了解{r['title'].replace(" 深入理解与实践指南", "")}领域的基本概念和专业术语。

### 二、核心技术

本部分深入解析核心技术原理和实际应用场景：

1. **技术原理**：理解底层工作机制
2. **实战场景**：掌握在企业安全环境中的实际应用
3. **常见误区**：避免初学者容易犯的典型错误

### 三、安全实践

将理论知识转化为实战能力：

1. 搭建实验环境进行动手练习
2. 使用相关安全工具进行实际操作
3. 分析真实案例加深理解

### 四、进阶方向

学完本章后，建议继续深入以下方向：

- 查阅OWASP/CIS等行业标准
- 参与CTF竞赛提升实战能力
- 关注最新安全动态和漏洞公告

---

> 📖 本文为"网安百宝箱"课程配套读物，如需更多学习资料请访问 [Resources](/resources)。
> 更新于 {r['updatedAt']}
'''
    
    with open(md_path, 'w', encoding='utf-8') as f:
        f.write(md_content)
    
    created_count += 1
    if created_count <= 5:
        print(f'  Created: {md_path}')

print(f'\nGenerated {created_count} markdown files')
print('Done!')
