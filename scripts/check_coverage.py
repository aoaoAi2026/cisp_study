import re

with open(r'e:\internal_safe\cisp1\cisp\scripts\gen_defense_penetration.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Find defense range - look for tuples starting with (number,
defense_nums = []
for match in re.finditer(r'^\s*\((\d+),\s*[\"\x27]', content, re.MULTILINE):
    defense_nums.append(int(match.group(1)))

# Find penetration section start
pen_start = content.find('pen_days')
if pen_start > 0:
    pen_section = content[pen_start:]
    pen_nums = [int(m.group(1)) for m in re.finditer(r'^\s*\((\d+),\s*[\"\x27]', pen_section, re.MULTILINE)]
else:
    pen_nums = []

print(f'Defense article numbers: {defense_nums[:5]}...{defense_nums[-5:]}  (total: {len(defense_nums)})')
print(f'Penetration article numbers: {pen_nums[:5]}...{pen_nums[-5:]}  (total: {len(pen_nums)})')
print(f'Total articles in script: {len(defense_nums)+len(pen_nums)}')
