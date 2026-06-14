import json, sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'E:\internal_safe\cisp1\cisp\src\data\cyberAi.ts', 'r', encoding='utf-8') as f:
    content = f.read()

print(f'Total chars: {len(content)}')
for w in ['week1','week2','week2_rest','week3','week4','week5']:
    count = content.count('const ' + w)
    print(f'{w}: defined={count > 0}')
print(f'Has import: {"import type" in content or "import {" in content}')
print(f'Has export: {"export const cyberAiPlan" in content}')
print(f'Has id ai: {"id: \\'ai\\'" in content}')
print()

# Show last 15 lines
lines = content.split('\n')
print('---Last 15 lines---')
for line in lines[-15:]:
    print(line)
