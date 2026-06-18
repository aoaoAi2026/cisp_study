import sys, re
sys.stdout.reconfigure(encoding='utf-8')

for part in ['part2', 'part3']:
    with open(f'src/data/plans/defense/{part}.ts', encoding='utf-8') as f:
        lines = f.readlines()
    
    print(f"\n=== defense/{part}.ts: {len(lines)} lines ===")
    
    # Find all day entries
    for i, l in enumerate(lines):
        m = re.search(r"id:\s*'def-(\d+)'", l)
        if m:
            print(f"  Day def-{m.group(1)} at line {i+1}")

print()

# Also check part1
with open('src/data/plans/defense/part1.ts', encoding='utf-8') as f:
    lines = f.readlines()
print(f"=== defense/part1.ts: {len(lines)} lines ===")
for i, l in enumerate(lines):
    m = re.search(r"id:\s*'def-(\d+)'", l)
    if m:
        print(f"  Day def-{m.group(1)} at line {i+1}")

# Check how defense exports work
print("\n=== defense/index.ts ===")
with open('src/data/plans/defense/index.ts', encoding='utf-8') as f:
    print(f.read())

print("=== defense/weeks/index.ts ===")
import os
wi_path = 'src/data/plans/defense/weeks/index.ts'
if os.path.exists(wi_path):
    with open(wi_path, encoding='utf-8') as f:
        print(f.read())
