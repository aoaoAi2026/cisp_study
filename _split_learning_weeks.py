import os, sys, re, json
sys.stdout.reconfigure(encoding='utf-8')

os.makedirs('src/data/learningData/weeks', exist_ok=True)

# ============================================================
# SPLIT allDays.ts by week
# ============================================================
with open('src/data/learningData/allDays.ts', encoding='utf-8') as f:
    lines = f.readlines()

# Header: first 4 lines (imports + blank + export line)
header = ''.join(lines[:4])
tail = '];\n'

# Week boundaries from analysis
all_weeks = {
    1: (4, 298),    # lines 5-298 (0-indexed: 4-297)
    2: (298, 508),
    3: (508, 726),
    4: (726, 1002),
    5: (1002, 1096),
}

print("=== Splitting allDays.ts ===")
for wk, (start, end) in sorted(all_weeks.items()):
    content_lines = lines[start:end]
    # The first line should be the week comment
    # Content between the import lines and the array closing
    
    # Build the week file
    week_file = f'src/data/learningData/weeks/week{wk}.ts'
    
    # Extract the types that need to be imported
    # These are LearningDay objects in an array
    week_content = ''.join(content_lines)
    
    # Generate the week file with proper imports
    output = "import type { LearningDay } from '../../types/learning';\n"
    output += f"\nexport const week{wk}Days: LearningDay[] = [\n"
    output += week_content
    output += '\n];\n'
    
    with open(week_file, 'w', encoding='utf-8') as f:
        f.write(output)
    print(f"  Week {wk}: {end-start} lines -> week{wk}.ts")

# ============================================================
# SPLIT generatedDays.ts by week
# ============================================================
with open('src/data/learningData/generatedDays.ts', encoding='utf-8') as f:
    glines = f.readlines()

# In generatedDays, each allDays.push() is a complete statement
# Find each push line and categorize by week
import re

push_entries = []
for i, l in enumerate(glines):
    if l.strip().startswith('allDays.push('):
        wm = re.search(r'week:(\d+)', l)
        dm = re.search(r'day:(\d+)', l)
        if wm and dm:
            push_entries.append((i, int(wm.group(1)), int(dm.group(1))))

# Group by week
gen_weeks = {}
for line_idx, wk, day in push_entries:
    gen_weeks.setdefault(wk, []).append((line_idx, day))

print("\n=== Splitting generatedDays.ts ===")
# For week 5, we need to merge with allDays week 5
# Week 5 in generatedDays starts at line 7 (after week comment)
# But let's be smarter - find each push block

# Extract content between successive push entries for each week
for wk in sorted(gen_weeks):
    entries = gen_weeks[wk]
    days = [d for _, d in entries]
    
    # Find the content range for this week
    # First entry line to last push's end + 1
    first_line = entries[0][0]
    last_line = entries[-1][0]
    
    # The push() call might span one very long line
    content_lines = []
    
    # For each push entry, find the complete line
    for line_idx, day in entries:
        content_lines.append(glines[line_idx])
    
    week_content = ''.join(content_lines)
    
    # Remove 'allDays.push(' prefix and trailing ');'
    # Actually, we want to keep these as push calls since they reference external data
    # Better: rewrite as proper array elements
    
    # Let's extract just the object {...} from each push
    items = []
    for line in content_lines:
        # Remove allDays.push( and trailing );
        s = line.strip()
        if s.startswith('allDays.push('):
            s = s[len('allDays.push('):]
        if s.endswith(');'):
            s = s[:-2]
        # Add trailing comma if not present
        if not s.rstrip().endswith(','):
            s = s.rstrip() + ',\n'
        items.append(s)
    
    # For week 5, we append to the week5 file
    if wk == 5:
        # Read existing week5.ts to append to it
        with open('src/data/learningData/weeks/week5.ts', 'r', encoding='utf-8') as f:
            existing = f.read()
        # Find the ]; at the end and insert before it
        insert_pos = existing.rfind('];')
        if insert_pos > 0:
            new_content = existing[:insert_pos] + '\n  ' + '\n  '.join(items) + existing[insert_pos:]
            with open('src/data/learningData/weeks/week5.ts', 'w', encoding='utf-8') as f:
                f.write(new_content)
        print(f"  Week {wk}: appended {len(items)} days to week5.ts")
    else:
        # New week file
        week_file = f'src/data/learningData/weeks/week{wk}.ts'
        
        # Need to handle the fact that these push() calls reference weekToolMap and dayExpertNotes
        output = "import type { LearningDay } from '../../types/learning';\n"
        output += "import { weekToolMap } from '../weekTools';\n"
        output += "import { dayExpertNotes } from '../expertNotes';\n"
        output += f"\nexport const week{wk}Days: LearningDay[] = [\n"
        output += ''.join(items)
        output += '];\n'
        
        with open(week_file, 'w', encoding='utf-8') as f:
            f.write(output)
        print(f"  Week {wk}: {len(items)} days -> week{wk}.ts")

# ============================================================
# CREATE barrel index.ts
# ============================================================
print("\n=== Creating weeks/index.ts ===")
max_week = max(all_weeks.keys() | gen_weeks.keys())
weeks_all = sorted(set(all_weeks.keys()) | gen_weeks.keys())

barrel_lines = []
for wk in weeks_all:
    barrel_lines.append(f"import {{ week{wk}Days }} from './week{wk}';\n")

barrel_lines.append("\nexport const allLearningDays: LearningDay[] = [\n")
for wk in weeks_all:
    barrel_lines.append(f"  ...week{wk}Days,\n")
barrel_lines.append("];\n")

with open('src/data/learningData/weeks/index.ts', 'w', encoding='utf-8') as f:
    f.write(''.join(barrel_lines))
print(f"  Created with weeks: {weeks_all}")

# ============================================================
# UPDATE allDays.ts to be a re-export barrel
# ============================================================
print("\n=== Updating allDays.ts ===")
new_allDays = "import type { LearningDay } from '../types/learning';\n"
new_allDays += "import { allLearningDays } from './weeks';\n"
new_allDays += "import { weekToolMap } from './weekTools';\n"
new_allDays += "\nexport const allDays: LearningDay[] = allLearningDays;\n"

with open('src/data/learningData/allDays.ts', 'w', encoding='utf-8') as f:
    f.write(new_allDays)
print("  Updated to barrel re-export")

# ============================================================
# UPDATE learningData.ts - remove side-effect import
# ============================================================
print("\n=== Updating learningData.ts ===")
with open('src/data/learningData.ts', 'r', encoding='utf-8') as f:
    ldata = f.read()

# Remove the generatedDays side-effect import
ldata = re.sub(r"// Generated days auto-extend allDays\nimport '\./learningData/generatedDays';\n", '', ldata)

with open('src/data/learningData.ts', 'w', encoding='utf-8') as f:
    f.write(ldata)
print("  Removed generatedDays side-effect import")

# ============================================================
# Keep generatedDays.ts but make it empty (can be deleted later)
# ============================================================
# Actually, we can delete it since nothing imports it anymore
# But let's keep it as a backup for now

print("\n=== Complete! ===")
print(f"Created {len(weeks_all)} week files in weeks/")
print(f"Updated allDays.ts and learningData.ts")
