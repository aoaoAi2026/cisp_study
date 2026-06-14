import os, re
BASE = r'e:\internal_safe\cisp1\cisp'
fpath = os.path.join(BASE, 'src', 'data', 'cyberDefense.ts')
with open(fpath, 'r', encoding='utf-8') as f:
    content = f.read()

# Collect day IDs
day_ids = []
for m in re.finditer(r"id:\s*'([^']+)'", content):
    did = m.group(1)
    if did.startswith('def-'):
        obj_start = content.rfind('{', 0, m.start())
        if obj_start >= 0:
            day_ids.append((did, obj_start))
        else:
            print(f'{did}: rfind 找不到 {{')

print(f'Total def day_ids found: {len(day_ids)}')
if day_ids:
    print(f'First: {day_ids[0]}, Last: {day_ids[-1]}')

# Test find_day_closing_brace on first day
def find_day_closing_brace(content, obj_start):
    depth = 0
    in_single = False
    in_double = False
    in_backtick = False
    i = obj_start
    while i < len(content):
        c = content[i]
        cp = content[i-1] if i > 0 else ''
        escaped = False
        if i > 0 and cp == '\\':
            esc_cnt = 0
            j = i - 1
            while j >= 0 and content[j] == '\\':
                esc_cnt += 1
                j -= 1
            escaped = (esc_cnt % 2 == 1)
        if c == "'" and not in_double and not in_backtick and not escaped:
            in_single = not in_single
        elif c == '"' and not in_single and not in_backtick and not escaped:
            in_double = not in_double
        elif c == '`' and not in_single and not in_double and not escaped:
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

if day_ids:
    did, obj_start = day_ids[0]
    day_end = find_day_closing_brace(content, obj_start)
    day_text = content[obj_start:day_end] if day_end > 0 else ''
    has_res = 'resources:' in day_text
    print(f'\n{ did}: obj_start={obj_start}, day_end={day_end}, has_resources={has_res}')
    print(f'  Segment[:150]: {repr(content[obj_start:obj_start+150])}')
