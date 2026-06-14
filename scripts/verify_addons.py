import re

t = open(r'E:\internal_safe\cisp1\cisp\src\data\cyberDefense.ts', encoding='utf-8').read()

print("=== Field counts ===")
for field in ['expertNotes', 'resources', 'recommendedTools', 'labEnvironment']:
    c = len(re.findall(rf'\b{field}:', t))
    print(f'  {field}: {c}')

print("\n=== Spot check day entries ===")
for day_id in ['def-1', 'def-10', 'def-15', 'def-20', 'def-30']:
    idx = t.find(f"id: '{day_id}'")
    if idx == -1:
        print(f'{day_id}: NOT FOUND')
        continue
    chunk = t[idx:idx + 3000]
    has_res = 'resources:' in chunk
    has_tools = 'recommendedTools:' in chunk
    has_lab = 'labEnvironment:' in chunk
    has_notes = 'expertNotes:' in chunk
    print(f'  {day_id}: res={has_res} tools={has_tools} lab={has_lab} notes={has_notes}')
