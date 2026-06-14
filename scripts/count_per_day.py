import re

for fname, prefix in [
    ('src/data/cyberBasic.ts', 'basic-'),
    ('src/data/cyberDefense.ts', 'def-'),
    ('src/data/cyberPenetration.ts', 'pen-'),
]:
    fpath = rf'e:\internal_safe\cisp1\cisp\{fname}'
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find each day's id
    days = re.findall(r"id:\s*'(" + prefix + r"\d+)'", content)
    
    dupes = []
    for day_id in days:
        # Count occurrences of 'resources: [' near this day
        idx = content.find(f"id: '{day_id}'")
        next_day = content.find(f"\n  {{ \n    id: '", idx + 50)
        if next_day == -1:
            next_day = content.find(f"\n  {{\n    id: '", idx + 50)
        if next_day == -1:
            next_day = content.find(f"\n    id: '", idx + 100)
        if next_day == -1:
            next_day = len(content)
        
        chunk = content[idx:next_day]
        count = len(re.findall(r'resources:\s*\[', chunk))
        if count > 1:
            dupes.append(f'{day_id}({count}x)')
    
    if dupes:
        print(f'{fname}: 重复项 = {dupes}')
    else:
        print(f'{fname}: 无重复')

# Also check basic-1 specifically
print('\n--- basic-1 detail ---')
idx1 = content.find("id: 'basic-1'")
idx2 = content.find("id: 'basic-3'")  # next day after basic-1 and basic-2

with open(r'e:\internal_safe\cisp1\cisp\src\data\cyberBasic.ts', 'r', encoding='utf-8') as f:
    basic_content = f.read()

b1_start = basic_content.find("id: 'basic-1'")
b2_start = basic_content.find("id: 'basic-3'")
chunk = basic_content[b1_start:b2_start]
count = len(re.findall(r'resources:\s*\[', chunk))
print(f'basic-1 resources count: {count}')
# Find each occurrence position
for m in re.finditer(r'resources:\s*\[', chunk):
    pos = m.start()
    ctx = chunk[max(0,pos-50):pos+80]
    print(f'  at {pos}: ...{ctx[:80]}...')
