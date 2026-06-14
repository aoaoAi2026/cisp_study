import re
for fname in ['src/data/cyberBasic.ts', 'src/data/cyberDefense.ts', 'src/data/cyberPenetration.ts']:
    fpath = rf'e:\internal_safe\cisp1\cisp\{fname}'
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()
    # Count occurrences of 'resources: ['
    count = len(re.findall(r'resources:\s*\[', content))
    print(f'{fname}: {count} resources: [ 出现次数')
