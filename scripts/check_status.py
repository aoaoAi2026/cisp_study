"""Check what's missing in each TS file"""
import os, re

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(BASE, 'src', 'data')

for fname in ['cyberBasic.ts', 'cyberDefense.ts', 'cyberPenetration.ts']:
    fpath = os.path.join(DATA, fname)
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    ids = re.findall(r"id:\s*'([^']+)'", content)
    # Count days with/without resources, recommendedTools, labEnvironment
    missing_res = 0
    missing_tools = 0
    missing_lab = 0
    
    for day_id in ids:
        if not (day_id.startswith('basic-') or day_id.startswith('def-') or day_id.startswith('pen-')):
            continue
        idx = content.find(f"id: '{day_id}'")
        if idx < 0:
            continue
        # Find next day or end
        next_idx = 99999999
        for other_id in ids:
            if other_id != day_id:
                oidx = content.find(f"id: '{other_id}'")
                if oidx > idx and oidx < next_idx:
                    next_idx = oidx
        segment = content[idx:next_idx] if next_idx < len(content) else content[idx:]
        
        if 'resources:' not in segment:
            missing_res += 1
        if fname == 'cyberDefense.ts':
            if 'recommendedTools:' not in segment:
                missing_tools += 1
            if 'labEnvironment:' not in segment:
                missing_lab += 1
    
    print(f'\n=== {fname} ===')
    print(f'  Total days: {len(ids)}')
    print(f'  Missing resources: {missing_res}')
    if fname == 'cyberDefense.ts':
        print(f'  Missing recommendedTools: {missing_tools}')
        print(f'  Missing labEnvironment: {missing_lab}')

# Also check pen-14 specifically
print('\n=== pen-14 detail ===')
fpath = os.path.join(DATA, 'cyberPenetration.ts')
with open(fpath, 'r', encoding='utf-8') as f:
    content = f.read()
idx = content.find("id: 'pen-14'")
print(f'  pen-14 offset: {idx}')
if idx > 0:
    seg = content[idx:idx+500]
    has = ['resources:', 'recommendedTools:', 'labEnvironment:']
    for h in has:
        print(f'  Has {h}: {h in seg}')
    print(f'  500 chars:\n{seg}')
