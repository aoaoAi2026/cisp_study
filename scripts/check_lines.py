import os, glob, sys
sys.stdout.reconfigure(encoding='utf-8')

base = r'e:\internal_safe\cisp1\cisp\public\contents\cyber-learning'
cats = ['basic', 'defense', 'penetration']

for cat in cats:
    files = sorted(glob.glob(f'{base}/{cat}/day-*.md'),
                   key=lambda x: int(os.path.basename(x).replace('day-','').replace('.md','')))
    print(f'\n=== {cat} ({len(files)} files) ===')
    total = 0
    thin = 0
    for f in files:
        with open(f, 'r', encoding='utf-8') as fh:
            lines = sum(1 for _ in fh)
        total += lines
        name = os.path.basename(f)
        flag = '[THIN]' if lines < 400 else ''
        print(f'  {name:16s} {lines:5d} lines {flag}')
        if lines < 400:
            thin += 1
    print(f'  Total: {total} lines, Thin: {thin} files')
