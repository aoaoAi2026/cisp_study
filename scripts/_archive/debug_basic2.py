"""调试 basic 所有 day"""
import re, os, json

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
fpath = os.path.join(BASE, 'src', 'data', 'cyberBasic.ts')
with open(fpath, 'r', encoding='utf-8') as f:
    content = f.read()

RESOURCE_MAP = {}
# 只测试 basic-1
RESOURCE_MAP['basic-1'] = [{'name':'test','url':'http://test','type':'article'}]

def find_day_closing_brace(content, obj_start):
    depth = 0
    in_single = False
    in_double = False
    in_backtick = False
    i = obj_start
    while i < len(content):
        c = content[i]
        if c == "'" and not in_double and not in_backtick:
            in_single = not in_single
        elif c == '"' and not in_single and not in_backtick:
            in_double = not in_double
        elif c == '`' and not in_single and not in_double:
            in_backtick = not in_backtick
        elif not in_single and not in_double and not in_backtick:
            if c == '{':
                depth += 1
            elif c == '}':
                depth -= 1
                if depth == 0:
                    return i
        i += 1
    return -1

# Find all day ids
day_ids = []
for m in re.finditer(r"id:\s*'([^']+)'", content):
    did = m.group(1)
    if did.startswith('basic-'):
        obj_start = content.rfind('{', 0, m.start())
        if obj_start >= 0:
            day_ids.append((did, obj_start))

print(f'Total basic day_ids found: {len(day_ids)}')

for did, obj_start in day_ids[:5]:  # 只测试前5个
    day_end = find_day_closing_brace(content, obj_start)
    if day_end < 0:
        print(f'{did}: obj_start={obj_start}, 未找到匹配 }}')
    else:
        day_text = content[obj_start:day_end]
        has_res = 'resources:' in day_text
        has_key = did in RESOURCE_MAP
        print(f'{did}: obj_start={obj_start}, day_end={day_end}, len={day_end-obj_start}, has_resources={has_res}, in_map={has_key}')

# 检查一下是否有任何 day 的 id 格式不同
ids = re.findall(r"id:\s*'([^']+)'", content)
print(f'\nAll ids in file: {ids[:10]}...')
basic_ids = [x for x in ids if x.startswith('basic-')]
print(f'Basic ids: {basic_ids}')
