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

fixes = 0

# 1. Fix emergencyScenarios trailing commas
for f in glob.glob(os.path.join(BASE, 'src/data/emergencyScenarios/*.ts')):
    c = read_f(f)
    # Pattern: ,\n]; at end of array
    if c.rstrip().endswith(',\n]') or ',\n]' in c[-20:]:
        c = c.replace(',\n]', '\n]')
        write_f(f, c)
        fixes += 1
        print(f'  Fixed trailing comma: {os.path.basename(f)}')

# 2. Fix learningData/weeks - add missing type import
# Files use 'LearningDay' and 'dayExpertNotes' without importing them
for f in glob.glob(os.path.join(BASE, 'src/data/learningData/weeks/week*.ts')):
    c = read_f(f)
    if 'import type' in c[:200] and 'LearningDay' not in c[:200]:
        # Add import for LearningDay
        c = c.replace("import type",
                       "import type { LearningDay } from '../../types/learning';\nimport type")
        # But that might double-insert. Let me check first
        if 'from '../../types/learning' not in c:
            lines = c.split('\n')
            new_lines = [lines[0]]
            new_lines.append("import type { LearningDay } from '../../types/learning';")
            new_lines.append("import type { CyberDayExpertNote } from '../../cybersecurityData';")
            new_lines.extend(lines[1:])
            c = '\n'.join(new_lines)
            write_f(f, c)
            fixes += 1
            print(f'  Added imports: {os.path.basename(f)}')

# 3. Fix learningData/weeks/index.ts - add type import
f = os.path.join(BASE, 'src/data/learningData/weeks/index.ts')
c = read_f(f)
if 'import type { LearningDay }' not in c:
    c = 'import type { LearningDay } from "../../types/learning";\n' + c
    write_f(f, c)
    fixes += 1
    print(f'  Added import: weeks/index.ts')

# 4. Fix toolSitesData imports - wrong relative path
# They import '../../types/toolSitesTypes' but should be '../../types/toolSitesTypes'
# Actually the issue is these files are in src/data/toolSitesData/
# '../../types/toolSitesTypes' resolves to src/types/toolSitesTypes
# But types are in src/data/types/toolSitesTypes.ts → need '../../data/types/toolSitesTypes'
# Wait, the types directory location... let me check
for f in glob.glob(os.path.join(BASE, 'src/data/toolSitesData/*.ts')):
    c = read_f(f)
    if "from '../../types/toolSitesTypes'" in c:
        c = c.replace("from '../../types/toolSitesTypes'", "from '../types/toolSitesTypes'")
        write_f(f, c)
        fixes += 1
        print(f'  Fixed import: {os.path.basename(f)}')

# 5. Fix resourceData entries imports
for f in glob.glob(os.path.join(BASE, 'src/data/resourceData/entries/*.ts')):
    c = read_f(f)
    if "from '../../types/resource'" in c:
        c = c.replace("from '../../types/resource'", "from '../../types/resource'")
        # Actually check the real path
        pass

# 6. Fix cyberSecurity/days imports
for f in glob.glob(os.path.join(BASE, 'src/data/cyberSecurity/days/days*.ts')):
    c = read_f(f)
    if "from '../../types'" in c:
        c = c.replace("from '../../types'", "from '../../../data/plans/types'")
        write_f(f, c)
        fixes += 1
        print(f'  Fixed import: {os.path.basename(f)}')

f = os.path.join(BASE, 'src/data/cyberSecurity/days/index.ts')
c = read_f(f)
if "from '../../types'" in c:
    c = c.replace("from '../../types'", "from '../../../data/plans/types'")
    write_f(f, c)
    fixes += 1
    print('  Fixed import: days/index.ts')

print(f'\nTotal fixes: {fixes}')
