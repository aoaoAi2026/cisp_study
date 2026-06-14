import re, os
BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
fpath = os.path.join(BASE, 'src/data/cyberDefense.ts')
with open(fpath, 'r', encoding='utf-8') as f:
    content = f.read()

# Check day detection
day_ids = re.findall(r"id:\s*'([^']+)'", content)
print(f'Found day IDs: {day_ids[:5]}... ({len(day_ids)} total)')

# Check def-1 specifically
idx = content.find("id: 'def-1'")
print(f'\ndef-1 position: {idx}')
print(f'Content around def-1 start:')
print(content[idx-20:idx+100])

# Check for closing brace
obj_start = content.rfind('{', 0, idx)
print(f'\nobj_start: {obj_start}')
segment = content[obj_start:obj_start + 3000]
# Find potential closing
for pat in [r'\n\s+\}(?=\s*,?\s*\n\s*(?:\{|\]))', r'\n\s+\}(?=\s*$)']:
    m = re.search(pat, segment)
    if m:
        print(f'Pattern {pat}: found at {m.start()}')
        print(f'  Context: ...{segment[m.start()-10:m.end()+50]}...')
    else:
        print(f'Pattern {pat}: NOT FOUND')

print(f'\nHas resources: {"resources:" in segment}')
print(f'Segment length: {len(segment)}')
