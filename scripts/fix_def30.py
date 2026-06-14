import json, os, re
BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
fpath = os.path.join(BASE, 'src/data/cyberDefense.ts')

with open(fpath, 'r', encoding='utf-8') as f:
    content = f.read()

# Find def-30
idx = content.find("id: 'def-30'")
obj_start = content.rfind('{', 0, idx)
print(f"def-30 obj_start: {obj_start}")

# Find the closing
# def-30 is in week4, last element before '];'
# Look for '  }\n];' after def-30
rest = content[obj_start:]
# Find the last closing of the day object before ];
m = re.search(r'(\n\s+\})\s*\n\]', rest)
if m:
    day_end = obj_start + m.start(1)
    print(f"Found closing at: {day_end}")
    print(f"Context: ...{content[day_end-20:day_end+30]}...")
    
    # Check what's missing
    day_text = content[obj_start:day_end]
    to_add = ''
    
    import fix_modules_v2
    if 'resources:' not in day_text:
        to_add += ',\n      resources: ' + json.dumps(fix_modules_v2.RESOURCE_MAP.get('def-30', []), ensure_ascii=False)
    if 'recommendedTools:' not in day_text:
        to_add += ',\n      recommendedTools: ' + json.dumps(fix_modules_v2.DEFENSE_TOOLS.get('def-30', []), ensure_ascii=False)
    if 'labEnvironment:' not in day_text:
        lab = fix_modules_v2.DEFENSE_LABS.get('def-30')
        if lab:
            to_add += ',\n      labEnvironment: [' + json.dumps(lab, ensure_ascii=False) + ']'
    
    if to_add:
        content = content[:day_end] + to_add + content[day_end:]
        with open(fpath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'def-30: +{to_add.count(": [")} modules')
    else:
        print('def-30 already has all modules')
else:
    print('Could not find closing for def-30')
    # Try alternative
    m2 = re.search(r'\n\s*\}[\s,]*\n\]', rest)
    if m2:
        print(f'Alt match at: {obj_start + m2.start()}')
        print(f'Context: ...{rest[m2.start()-10:m2.end()+30]}...')
