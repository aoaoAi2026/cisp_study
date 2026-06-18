import os, glob, re

BASE = os.path.dirname(__file__)

def read_f(path):
    try:
        with open(path, 'r', encoding='utf-8') as f:
            return f.read()
    except:
        with open(path, 'r', encoding='utf-16') as f:
            return f.read()

def write_f(path, content):
    with open(path, 'w', encoding='utf-8', newline='\n') as f:
        f.write(content)

fixes = []

# ============================================================
# Only remove TRAILING garbage lines (from end backwards until non-garbage)
# ============================================================
GARBAGE = {'', ']', '];', '};', ';'}

for bf in glob.glob(os.path.join(BASE, 'src/data/plans/basic/days/basic-*.ts')):
    lines = read_f(bf).split('\n')
    # Remove trailing garbage
    while lines and lines[-1].strip() in GARBAGE:
        lines.pop()
    result = '\n'.join(lines).rstrip()
    # Remove trailing comma from last line
    result = result.rstrip()
    while result.endswith(',') or result.endswith(';'):
        result = result[:-1].rstrip()
    result = result.rstrip() + ';\n'
    write_f(bf, result)
    fixes.append(os.path.basename(bf))

for pf in glob.glob(os.path.join(BASE, 'src/data/plans/penetration/days/pen-*.ts')):
    lines = read_f(pf).split('\n')
    while lines and lines[-1].strip() in GARBAGE:
        lines.pop()
    result = '\n'.join(lines).rstrip()
    while result.endswith(',') or result.endswith(';'):
        result = result[:-1].rstrip()
    result = result.rstrip() + ';\n'
    write_f(pf, result)
    fixes.append(os.path.basename(pf))

# ============================================================
# defense weeks: fix "export default const" → proper export
# ============================================================
for wf in glob.glob(os.path.join(BASE, 'src/data/plans/defense/weeks/week[12].ts')):
    content = read_f(wf)
    # Fix: "export default const" → "const"
    content = content.replace('export default const', 'const')
    
    lines = content.split('\n')
    # Remove trailing garbage including "as CyberDay[]" lines
    new_lines = []
    for line in lines:
        s = line.strip()
        if s.startswith('as CyberDay'):
            continue
        new_lines.append(line)
    
    # Remove trailing garbage
    while new_lines and new_lines[-1].strip() in GARBAGE:
        new_lines.pop()
    
    result = '\n'.join(new_lines).rstrip()
    
    # Ensure array is closed
    if not result.rstrip().endswith('];'):
        result = result.rstrip() + '\n];'
    
    # Add export default at end
    wn = 'week1' if 'week1' in wf else 'week2'
    result = result.rstrip() + f'\n\nexport default {wn};\n'
    
    write_f(wf, result)
    fixes.append(os.path.basename(wf))

# ============================================================
# LabEnvironment/modules.ts 
# ============================================================
modf = os.path.join(BASE, 'src/pages/LabEnvironment/modules.ts')
content = read_f(modf)
lines = content.split('\n')
for i in [17, 18, 19, 20]:
    if i < len(lines):
        print(f"  modules.ts L{i+1}: {lines[i][:150]}")
fixes.append('modules.ts: inspected')

print(f"\nFixed {len(fixes)} files")
