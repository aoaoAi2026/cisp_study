# Find all lines with fullwidth characters that might cause issues in Python 3.12+
import os

base = r'e:\internal_safe\cisp1\cisp\scripts'

for fn in ['gen_defense.py', 'gen_penetration.py']:
    path = os.path.join(base, fn)
    with open(path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    issues = []
    for i, line in enumerate(lines, 1):
        for ch in line:
            cp = ord(ch)
            # Fullwidth parentheses, commas, etc that are not valid Python
            if cp in range(0xFF00, 0xFFEF):
                issues.append((i, cp, ch))
                break  # one per line is enough
    
    print(f'\n{fn}: {len(issues)} lines with fullwidth chars')
    for ln, cp, ch in issues[:20]:
        print(f'  Line {ln}: U+{cp:04X} ({ch}) -> {lines[ln-1].strip()[:80]}')
    if len(issues) > 20:
        print(f'  ... and {len(issues)-20} more')
