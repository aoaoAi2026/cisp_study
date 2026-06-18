import os, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
BASE = r'e:\internal_safe\cisp1\cisp'
fpath = os.path.join(BASE, 'src', 'data', 'cyberBasic.ts')
with open(fpath, 'r', encoding='utf-8') as f:
    content = f.read()

# Show content around position 6880-6920
print('Around pos 6880:')
for i in range(6870, 6930):
    c = content[i]
    if c == '\n':
        print(f'[{i}] \\n')
    else:
        print(f'[{i}] {c}', end='')
        if content[i:i+1] == '}':
            print('  <--- BRACE', end='')
        print()
print()

# Show content from 6400-6500 (looking for basic-1's end)
print('Around pos 6400:')
for i in range(6400, 6600):
    c = content[i]
    if c == '\n':
        print(f'[{i}] \\n')
    else:
        print(f'[{i}] {c}', end='')
        if content[i:i+1] == '}':
            print('  <--- BRACE', end='')
        print()
