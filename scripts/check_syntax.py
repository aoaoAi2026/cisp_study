import re
with open('gen_day29_30.py','r',encoding='utf-8') as f:
    lines = f.readlines()
for i, line in enumerate(lines):
    stripped = line.strip()
    if stripped == '])':
        if i+1 < len(lines):
            n = lines[i+1].strip()
            if n and not n.startswith('+ r') and not n.startswith("r'''") and not n.startswith('#'):
                print(f'Line {i+2}: ISSUE: {n[:100]}')
