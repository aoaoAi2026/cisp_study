import sys, os, glob, re, json

BASE = os.path.dirname(__file__)
fixes = []

# ============================================================
# 1. cybersecurityData.ts: 接口定义缺少 }
# ============================================================
f = os.path.join(BASE, 'src/data/cybersecurityData.ts')
with open(f, 'r', encoding='utf-8') as fh: lines = fh.readlines()
# 在 line 64 (index 63) 插入 }  closing the CyberStage interface
if lines[63].strip() == '' and lines[64].strip().startswith('import'):
    lines.insert(64, '}\n')
    with open(f, 'w', encoding='utf-8') as fh: fh.writelines(lines)
    fixes.append('cybersecurityData.ts: added missing } after interface')

# ============================================================
# 2. defense days (def-15 to def-30): ],; at end of long line → ]};
# ============================================================
for df in glob.glob(os.path.join(BASE, 'src/data/plans/defense/days/def-*.ts')):
    with open(df, 'r', encoding='utf-8') as fh: content = fh.read()
    # Pattern: on the long line, the object ends with ...,quiz: [...]],; \nexport default day;
    # Fix: replace ],;\nexport default day; with ]};\nexport default day;
    old = '],;\nexport default day;'
    new = ']};\nexport default day;'
    if old in content:
        content = content.replace(old, new)
        with open(df, 'w', encoding='utf-8') as fh: fh.write(content)
        fixes.append(f'{os.path.basename(df)}: fixed object closing')

# ============================================================
# 3. basic days: extra ; after ];
# ============================================================
for bf in glob.glob(os.path.join(BASE, 'src/data/plans/basic/days/basic-*.ts')):
    with open(bf, 'r', encoding='utf-8') as fh: content = fh.read()
    # Pattern: ];\n;  at end of file → just ];
    if content.rstrip().endswith('];\n;'):
        content = content.rstrip()[:-1] + '\n'
        with open(bf, 'w', encoding='utf-8') as fh: fh.write(content)
        fixes.append(f'{os.path.basename(bf)}: removed extra trailing ;')

# ============================================================
# 4. penetration days: extra ]; and ;
# ============================================================
for pf in glob.glob(os.path.join(BASE, 'src/data/plans/penetration/days/pen-*.ts')):
    with open(pf, 'r', encoding='utf-8') as fh: content = fh.read()
    # Fix: remove extra ]; and ; at end
    fixed = False
    while content.rstrip().endswith('];\n];'):
        content = content.rstrip()[:-3]
        fixed = True
    if content.rstrip().endswith(';'):
        # Check if there's a real statement end or just noise
        if content.rstrip()[-3:] == '];;':
            # trailing ; after ];
            lines = content.split('\n')
            if lines[-1].strip() in ('', ';'):
                # remove trailing ; line
                while lines and lines[-1].strip() in ('', ';'):
                    lines.pop()
                content = '\n'.join(lines) + '\n'
                fixed = True
    if fixed:
        with open(pf, 'w', encoding='utf-8') as fh: fh.write(content)
        fixes.append(f'{os.path.basename(pf)}: cleaned trailing brackets')

# ============================================================
# 5. toolSitesData files with Chinese names: export const ... = {  {  → {
# ============================================================
for tf in glob.glob(os.path.join(BASE, 'src/data/toolSitesData/*.ts')):
    with open(tf, 'r', encoding='utf-8') as fh: content = fh.read()
    # Pattern: export const xxx: ToolSite = {\n  {\n
    old_pat = 'export const toolSites_'
    if old_pat in content:
        # Find the pattern = {\n  {\n and fix to = {\n
        new_content = content
        # More general: replace " = {\n  {" with " = {\n"
        import re
        new_content = re.sub(r'(const \w+: ToolSite = )\{\s*\{', r'\1{', new_content)
        if new_content != content:
            with open(tf, 'w', encoding='utf-8') as fh: fh.write(new_content)
            fixes.append(f'{os.path.basename(tf)}: fixed double brace')

# ============================================================
# 6. weekTools.ts: line 194 needs }); closing
# ============================================================
wtf = os.path.join(BASE, 'src/data/learningData/weekTools.ts')
with open(wtf, 'r', encoding='utf-8') as fh: content = fh.read()
# All lines starting with "allDays.push(" need proper closing
lines = content.split('\n')
fixed_lines = []
i = 0
while i < len(lines):
    line = lines[i]
    if line.strip().startswith('allDays.push('):
        # Look for the end - this push call needs to end with });
        # Find the end of the push statement
        j = i
        depth = line.count('{') + line.count('(') - line.count('}') - line.count(')')
        while depth > 0 and j+1 < len(lines):
            j += 1
            depth += lines[j].count('{') + lines[j].count('(') - lines[j].count('}') - lines[j].count(')')
        # j is the last line of the push call
        if j < len(lines) and not lines[j].rstrip().endswith('});'):
            # Need to add closing
            lines[j] = lines[j].rstrip() + '});'
            fixes.append(f'weekTools.ts: fixed allDays.push closing at line {j+1}')
        fixed_lines.extend(lines[i:j+1])
        i = j + 1
    else:
        fixed_lines.append(line)
        i += 1
with open(wtf, 'w', encoding='utf-8') as fh: fh.write('\n'.join(fixed_lines))

# ============================================================
# 7. resourceData entries: fix hyphens in variable names
# ============================================================
# The issue: files like ai-security.ts have:
#   export const resources_ai-security: Resource[] = [
# But hyphens are not valid in JS identifiers. Need to use underscore.
# And entries.ts imports need to match.

entries_base = os.path.join(BASE, 'src/data/resourceData/entries')
# Fix the individual entry files (export const resources_xxx-yyy → resources_xxx_yyy)
for ef in glob.glob(os.path.join(entries_base, '*.ts')):
    if 'index' in ef:
        continue
    with open(ef, 'r', encoding='utf-8') as fh: content = fh.read()
    # Find export const resources_xxx-yyy
    import re
    new_content = re.sub(r'export const (resources_\w+-\w+)', 
                        lambda m: f'export const {m.group(1).replace("-", "_")}', 
                        content)
    if new_content != content:
        with open(ef, 'w', encoding='utf-8') as fh: fh.write(new_content)
        fixes.append(f'{os.path.basename(ef)}: fixed hyphen in export name')

# Fix the entries.ts barrel file
entries_ts = os.path.join(BASE, 'src/data/resourceData/entries.ts')
with open(entries_ts, 'r', encoding='utf-8') as fh: content = fh.read()
new_content = re.sub(r'(import \{ )?resources_(\w+)-(\w+)( \})?', 
                    lambda m: m.group(0).replace('-', '_'), 
                    content)
# Same for usage in the spread array
new_content = re.sub(r'\.\.\.resources_(\w+)-(\w+)',
                    lambda m: m.group(0).replace('-', '_'),
                    new_content)
if new_content != content:
    with open(entries_ts, 'w', encoding='utf-8') as fh: fh.write(new_content)
    fixes.append('resourceData/entries.ts: fixed hyphens in imports')

# ============================================================
# 8. defense weeks - rebuild barrel files
# ============================================================
defense_days_dir = os.path.join(BASE, 'src/data/plans/defense/days')
defense_weeks_dir = os.path.join(BASE, 'src/data/plans/defense/weeks')

# Get all defense day files
day_files = sorted(glob.glob(os.path.join(defense_days_dir, 'def-*.ts')))
# Group by week: def-1..def-7 = week1, def-8..def-14 = week2
weeks = {}
for df in day_files:
    basename = os.path.basename(df)
    m = re.match(r'def-(\d+)\.ts', basename)
    if m:
        day_num = int(m.group(1))
        week_num = (day_num - 1) // 7 + 1
        if week_num not in weeks:
            weeks[week_num] = []
        var_name = os.path.splitext(basename)[0].replace('-', '_')
        weeks[week_num].append((var_name, basename))

import_suffix = '../../../types'

for week_num, day_entries in sorted(weeks.items()):
    lines = []
    lines.append(f"import type {{ CyberDay }} from '{import_suffix}';\n")
    for var_name, filename in day_entries:
        lines.append(f"import {var_name} from '../days/{filename}';\n")
    lines.append(f"\nexport const week{week_num}: CyberDay[] = [\n")
    for var_name, _ in day_entries:
        lines.append(f"  {var_name},\n")
    lines.append("];\n")
    
    wf = os.path.join(defense_weeks_dir, f'week{week_num}.ts')
    with open(wf, 'w', encoding='utf-8') as fh: fh.write(''.join(lines))
    fixes.append(f'defense/weeks/week{week_num}.ts: rebuilt with {len(day_entries)} days')

# ============================================================
# Summary
# ============================================================
print(f"Total fixes: {len(fixes)}")
for f in fixes:
    print(f"  ✓ {f}")
