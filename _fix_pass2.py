"""第二轮修复：113个剩余TS编译错误"""
import os, glob, re

base = 'e:/internal_safe/cisp1/cisp'
fix_count = 0

def read_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()

def write_file(path, content):
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

def replace_str(path, old, new):
    content = read_file(path)
    if old in content:
        content = content.replace(old, new)
        write_file(path, content)
        return True
    return False

# === Fix 1: week5.ts - add weekToolMap import ===
f = os.path.join(base, 'src/data/learningData/weeks/week5.ts')
content = read_file(f)
if 'import { dayExpertNotes }' in content and 'weekToolMap' in content and 'import { weekToolMap }' not in content:
    old = "import { dayExpertNotes } from '../../learningData';"
    new = "import { dayExpertNotes } from '../../learningData';\nimport { weekToolMap } from '../weekTools';"
    if replace_str(f, old, new):
        fix_count += 1
        print("Added weekToolMap import: week5.ts")

# === Fix 2: weekTools.ts - add allDays and dayExpertNotes imports ===
f = os.path.join(base, 'src/data/learningData/weekTools.ts')
content = read_file(f)
if "import type { LabTool, LabEnvironment } from '../types/learning';" in content:
    old = "import type { LabTool, LabEnvironment } from '../types/learning';"
    new = "import type { LabTool, LabEnvironment } from '../types/learning';\nimport { allLearningDays } from './weeks/index';\nimport { dayExpertNotes } from './expertNotes';"
    if replace_str(f, old, new):
        fix_count += 1
        print("Added imports: weekTools.ts")
    # Also, replace `allDays` references with `allLearningDays` or use alias
    content = read_file(f)
    lines = content.split('\n')
    # Replace `allDays` -> `allLearningDays` in data references (not in import line)
    new_lines = []
    for line in lines:
        if 'import ' not in line:
            line = line.replace('allDays', 'allLearningDays')
        new_lines.append(line)
    if '\n'.join(new_lines) != content:
        write_file(f, '\n'.join(new_lines))
        fix_count += 1
        print("Renamed allDays → allLearningDays: weekTools.ts")

# === Fix 3: toolSites.ts - add local ToolSite import ===
f = os.path.join(base, 'src/data/toolSites.ts')
content = read_file(f)
if "export { ToolSite } from './types/toolSitesTypes';" in content:
    old = "export { ToolSite } from './types/toolSitesTypes';"
    new = "import type { ToolSite } from './types/toolSitesTypes';\nexport type { ToolSite };"
    if replace_str(f, old, new):
        fix_count += 1
        print("Fixed ToolSite import/export: toolSites.ts")

# === Fix 4: plans/defense/part2.ts - fix day file names (def15→def-15) ===
for part_name in ['part1', 'part2', 'part3']:
    f = os.path.join(base, 'src/data/plans/defense', f'{part_name}.ts')
    if os.path.exists(f):
        content = read_file(f)
        modified = False
        for day_num in range(1, 31):
            # Replace `defXX` in import paths with `def-XX`
            old_import = f"./days/def{day_num}'"
            new_import = f"./days/def-{day_num}'"
            if old_import in content:
                content = content.replace(old_import, new_import)
                modified = True
            # Also replace var declarations
            old_var = f"def{day_num}" 
            new_var = f"def{day_num}"  # same, but just the import needs fix
            # Actually the import statement says `import def15 from './days/def15'`
            # => `import def15 from './days/def-15'`
        if modified:
            write_file(f, content)
            fix_count += 1
            print(f"Fixed day file names: defense/{part_name}.ts")

# === Fix 5: plans/defense/weeks/week3-5.ts - fix types import ===
for week_file in ['week3', 'week4', 'week5']:
    f = os.path.join(base, 'src/data/plans/defense/weeks', f'{week_file}.ts')
    if os.path.exists(f):
        if replace_str(f, "from '../../../types'", "from '../../types'"):
            fix_count += 1
            print(f"Fixed types import: defense/weeks/{week_file}.ts")

# === Fix 6: plans/basic/days/basic-*.ts - fix '../types' → '../../types' ===
for f in glob.glob(os.path.join(base, 'src/data/plans/basic/days/basic-*.ts')):
    content = read_file(f)
    old = "import type { CyberDay } from '../types';"
    new = "import type { CyberDay } from '../../types';"
    if old in content:
        content = content.replace(old, new)
        write_file(f, content)
        fix_count += 1
        # Don't print every file - too verbose

# Same for pen and defense days:
for subdir in ['penetration/days', 'defense/days']:
    for f in glob.glob(os.path.join(base, 'src/data/plans', subdir, '*.ts')):
        content = read_file(f)
        old = "import type { CyberDay } from '../types';"
        new = "import type { CyberDay } from '../../types';"
        if old in content:
            content = content.replace(old, new)
            write_file(f, content)
            fix_count += 1

if fix_count > 0:  # Only print once for the batch
    print(f"Fixed types import batch: basic/penetration/defense days")

# === Fix 7: mockExamQuestions.ts - fix import paths ===
f = os.path.join(base, 'src/data/mockExamQuestions.ts')
content = read_file(f)
if replace_str(f, "from './types'", "from './mockExamQuestions/types'"):
    fix_count += 1
    print("Fixed types import: mockExamQuestions.ts")

for domain_file in ['信息安全保障', '信息安全技术', '信息安全管理', '信息安全法规与标准', '安全工程与运营']:
    content = read_file(f)
    old = f"from './{domain_file}'"
    new = f"from './mockExamQuestions/{domain_file}'"
    if old in content:
        content = content.replace(old, new)
        write_file(f, content)
        fix_count += 1

# === Fix 8: pastPapers.ts - fix domainQuestions import path ===
f = os.path.join(base, 'src/data/pastPapers.ts')
content = read_file(f)
old = "export { domainQuestions } from './domainQuestions';"
new = "export { domainQuestions } from './pastPapers/domainQuestions';"
if replace_str(f, old, new):
    fix_count += 1
    print("Fixed domainQuestions import: pastPapers.ts")

# === Fix 9: pastPapers/domainQuestions.ts - fix types import and pastPapers reference ===
f = os.path.join(base, 'src/data/pastPapers/domainQuestions.ts')
content = read_file(f)
if "import type { PastPaperQuestion } from './types';" in content:
    old = "import type { PastPaperQuestion } from './types';"
    # Need to find correct import. PastPaperQuestion is in ../pastPapers
    new = "import type { PastPaperQuestion } from '../pastPapers';\nimport { pastPapers } from '../pastPapers';"
    if replace_str(f, old, new):
        fix_count += 1
        print("Fixed types import: pastPapers/domainQuestions.ts")

# === Fix 10: resourceData/entries.ts - fix import path ===
f = os.path.join(base, 'src/data/resourceData/entries.ts')
content = read_file(f)
if replace_str(f, "from '../types/resource'", "from '../../types/resource'"):
    fix_count += 1
    print("Fixed Resource import: resourceData/entries.ts")

# === Fix 11: securityScripts trailing commas ===
for f in glob.glob(os.path.join(base, 'src/data/securityScripts/*.ts')):
    content = read_file(f)
    lines = content.split('\n')
    modified = False
    for i in range(len(lines)):
        stripped = lines[i].strip()
        if stripped in ('},', '],') and i < len(lines) - 1:
            next_stripped = lines[i + 1].strip() if i + 1 < len(lines) else ''
            if (not next_stripped or next_stripped.startswith('//') or 
                next_stripped in ('];', '};', ']);', '});') or next_stripped.startswith('---') or
                next_stripped in ('];', '};') or next_stripped in ('', ');')):
                lines[i] = lines[i].rstrip(',')
                modified = True
    if modified:
        write_file(f, '\n'.join(lines))
        fix_count += 1

if fix_count > 0:  # Just count summary
    print(f"Fixed trailing commas: securityScripts batch")

# === Fix 12: pastPapers/papers2024/cisp-2024-hubei.ts trailing comma ===
f = os.path.join(base, 'src/data/pastPapers/papers2024/cisp-2024-hubei.ts')
if os.path.exists(f):
    content = read_file(f)
    lines = content.split('\n')
    modified = False
    for i in range(len(lines)):
        stripped = lines[i].strip()
        if stripped == '},' and i < len(lines) - 1:
            next_stripped = lines[i + 1].strip() if i + 1 < len(lines) else ''
            if not next_stripped or next_stripped == '];':
                lines[i] = lines[i].rstrip(',')
                modified = True
    if modified:
        write_file(f, '\n'.join(lines))
        fix_count += 1
        print("Fixed trailing comma: cisp-2024-hubei.ts")

print(f"\n=== Total fixes applied: {fix_count} ===")
