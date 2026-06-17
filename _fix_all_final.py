"""批量修复所有预存的 TypeScript 编译错误"""
import os
import re
import glob

base = 'e:/internal_safe/cisp1/cisp'

def read_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()

def write_file(path, content):
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

def replace_str_in_file(path, old, new):
    content = read_file(path)
    if old in content:
        content = content.replace(old, new)
        write_file(path, content)
        return True
    return False

fix_count = 0

# ============================================================
# Fix 1: Module path - cyberSecurity/days/*.ts
# 'from '../../types'' → 'from '../../cybersecurityData''
# ============================================================
for f in glob.glob(os.path.join(base, 'src/data/cyberSecurity/days/*.ts')):
    if replace_str_in_file(f, "from '../../types'", "from '../../cybersecurityData'"):
        fix_count += 1
        print(f"Fixed imports in: {os.path.basename(f)}")

# cybersecurityData/days/index.ts
f = os.path.join(base, 'src/data/cybersecurityData/days/index.ts')
if replace_str_in_file(f, "from '../../types'", "from '../../cybersecurityData'"):
    fix_count += 1
    print(f"Fixed imports in: cybersecurityData/days/index.ts")

# ============================================================
# Fix 2: Module path - toolSitesData/*.ts
# ============================================================
for f in glob.glob(os.path.join(base, 'src/data/toolSitesData/*.ts')):
    if replace_str_in_file(f, "from '../../types/toolSitesTypes'", "from '../types/toolSitesTypes'"):
        fix_count += 1
        print(f"Fixed imports in: toolSitesData/{os.path.basename(f)}")

# ============================================================
# Fix 3: Module path - resourceData/entries/*.ts
# ../../types/resource → ../../../types/resource
# ============================================================
for f in glob.glob(os.path.join(base, 'src/data/resourceData/entries/*.ts')):
    if replace_str_in_file(f, "from '../../types/resource'", "from '../../../types/resource'"):
        fix_count += 1
        print(f"Fixed imports in: resourceData/entries/{os.path.basename(f)}")

# ============================================================
# Fix 4: Trailing commas in emergencyScenarios/*.ts (TS1009)
# ============================================================
emergency_files = [
    'data-breach.ts', 'ddos-attack.ts', 'patching-failure.ts',
    'ransomware-general.ts', 'ransomware-government.ts', 'ransomware-hospital.ts',
    'supply-chain-attack.ts', 'zero-day-emergency.ts'
]
for fname in emergency_files:
    f = os.path.join(base, 'src/data/emergencyScenarios', fname)
    if not os.path.exists(f):
        continue
    content = read_file(f)
    lines = content.split('\n')
    modified = False
    i = 0
    while i < len(lines) - 1:
        stripped = lines[i].strip()
        if stripped == '},' or stripped == '],':
            # Check if next non-empty line is a structural end (new section comment or end of structure)
            next_line = lines[i + 1].strip()
            if (not next_line or next_line.startswith('//') or 
                next_line == '];' or next_line == '};' or next_line.startswith('---')):
                # Remove trailing comma
                lines[i] = lines[i].rstrip(',')
                modified = True
        i += 1
    if modified:
        write_file(f, '\n'.join(lines))
        fix_count += 1
        print(f"Fixed trailing commas: emergencyScenarios/{fname}")

# ============================================================
# Fix 5: Add import for LearningDay in learningData/weeks/index.ts
# ============================================================
f = os.path.join(base, 'src/data/learningData/weeks/index.ts')
content = read_file(f)
if "LearningDay" in content and "import type { LearningDay }" not in content:
    new_import = "import type { LearningDay } from '../../types/learning';\n"
    content = new_import + content
    write_file(f, content)
    fix_count += 1
    print("Added LearningDay import: learningData/weeks/index.ts")

# ============================================================
# Fix 6: Add import for dayExpertNotes in learningData/weeks/week*.ts
# ============================================================
for f in glob.glob(os.path.join(base, 'src/data/learningData/weeks/week*.ts')):
    content = read_file(f)
    if 'dayExpertNotes' in content and 'import { dayExpertNotes }' not in content:
        # Insert after first import line
        lines = content.split('\n')
        insert_idx = 0
        for i, line in enumerate(lines):
            if line.startswith('import type { LearningDay }'):
                insert_idx = i + 1
                break
            elif line.startswith('import '):
                insert_idx = i + 1
        if insert_idx > 0:
            lines.insert(insert_idx, "import { dayExpertNotes } from '../../learningData';")
            write_file(f, '\n'.join(lines))
            fix_count += 1
            print(f"Added dayExpertNotes import: learningData/weeks/{os.path.basename(f)}")

# ============================================================
# Fix 7: Add 'Code' to lucide-react import in CodeSnippets.tsx
# ============================================================
f = os.path.join(base, 'src/pages/CodeRunner/CodeSnippets.tsx')
content = read_file(f)
old = "import { X } from 'lucide-react'"
new = "import { X, Code } from 'lucide-react'"
if replace_str_in_file(f, old, new):
    fix_count += 1
    print("Added Code import: CodeRunner/CodeSnippets.tsx")

# ============================================================
# Fix 8: Add 'Columns2' to lucide-react import in ExecutionHistory.tsx
# ============================================================
f = os.path.join(base, 'src/pages/CodeRunner/ExecutionHistory.tsx')
content = read_file(f)
old = "import { History, Trash2 } from 'lucide-react'"
new = "import { History, Trash2, Columns2 } from 'lucide-react'"
if replace_str_in_file(f, old, new):
    fix_count += 1
    print("Added Columns2 import: CodeRunner/ExecutionHistory.tsx")

# ============================================================
# Fix 9: Add 'export' to LAB_MODULES in modules.tsx
# ============================================================
f = os.path.join(base, 'src/pages/LabEnvironment/modules.tsx')
content = read_file(f)
old = "const LAB_MODULES: LabModule[] = ["
new = "export const LAB_MODULES: LabModule[] = ["
if replace_str_in_file(f, old, new):
    fix_count += 1
    print("Exported LAB_MODULES: LabEnvironment/modules.tsx")

# ============================================================
# Fix 10: Add 'export' to CTFChallenges in CTFChallenges.tsx
# ============================================================
f = os.path.join(base, 'src/pages/LabEnvironment/CTFChallenges.tsx')
content = read_file(f)
old = "const CTFChallenges: React.FC = () => {"
new = "export const CTFChallenges: React.FC = () => {"
if replace_str_in_file(f, old, new):
    fix_count += 1
    print("Exported CTFChallenges: LabEnvironment/CTFChallenges.tsx")

# ============================================================
# Fix 11: Add 'export' to SNIPPETS in codeSnippets.ts
# ============================================================
f = os.path.join(base, 'src/data/codeSnippets.ts')
content = read_file(f)
old = "const SNIPPETS: Snippet[] = ["
new = "export const SNIPPETS: Snippet[] = ["
if replace_str_in_file(f, old, new):
    fix_count += 1
    print("Exported SNIPPETS: data/codeSnippets.ts")

# ============================================================
# Fix 12: Re-export the 4 functions from pastPapers.ts
# ============================================================
f = os.path.join(base, 'src/data/pastPapers.ts')
content = read_file(f)
# Check what's already exported
if "export { domainQuestions } from './domainQuestions'" in content:
    old = "export { domainQuestions } from './domainQuestions';"
    new = """export { domainQuestions } from './domainQuestions';
export { getAllPastPaperQuestions, getRandomQuestions, getQuestionsByDomain, getPastPaperStats } from './pastPapers/domainQuestions';"""
    if replace_str_in_file(f, old, new):
        fix_count += 1
        print("Added function re-exports: data/pastPapers.ts")

# ============================================================
# Fix 13: cybersecurityData.ts - fix ...cyberDays spread
# ============================================================
f = os.path.join(base, 'src/data/cybersecurityData.ts')
content = read_file(f)
old = "  ...cyberDays,"
new = "  days: cyberDays,"
if replace_str_in_file(f, old, new):
    fix_count += 1
    print("Fixed cyberDays spread: data/cybersecurityData.ts")

print(f"\n=== Total fixes applied: {fix_count} ===")
