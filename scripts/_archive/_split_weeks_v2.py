import os, sys, re
sys.stdout.reconfigure(encoding='utf-8')

os.makedirs('src/data/learningData/weeks', exist_ok=True)

# ============================================================
# SPLIT allDays.ts by week (unchanged from before)
# ============================================================
with open('src/data/learningData/allDays.ts', encoding='utf-8') as f:
    lines = f.readlines()

all_weeks = {
    1: (4, 298),
    2: (298, 508),
    3: (508, 726),
    4: (726, 1002),
    5: (1002, 1096),
}

print("=== Splitting allDays.ts (weeks 1-5) ===")
for wk, (start, end) in sorted(all_weeks.items()):
    content_lines = lines[start:end]
    week_content = ''.join(content_lines)
    
    output = "import type { LearningDay } from '../../types/learning';\n"
    # For week6+, also need weekToolMap and dayExpertNotes
    output += f"\nexport const week{wk}Days: LearningDay[] = [\n"
    output += week_content
    output += '\n];\n'
    
    with open(f'src/data/learningData/weeks/week{wk}.ts', 'w', encoding='utf-8') as f:
        f.write(output)
    print(f"  Week {wk}: {end-start} lines -> week{wk}.ts")

# ============================================================
# SPLIT generatedDays.ts by week - FIXED multi-line push()
# ============================================================
with open('src/data/learningData/generatedDays.ts', encoding='utf-8') as f:
    glines = f.readlines()

# Find ALL push() boundaries - both start and end of each push
# A push starts with 'allDays.push(' and ends with ');\n' (possibly with trailing whitespace)
push_ranges = []  # (start_line_idx, end_line_idx, week, day)
i = 0
while i < len(glines):
    line = glines[i]
    if line.strip().startswith('allDays.push('):
        start = i
        # Find the matching end ');'
        depth = 0
        found_start = False
        while i < len(glines):
            l = glines[i]
            for ch in l:
                if ch == '(' and found_start:
                    depth += 1
                elif ch == ')':
                    depth -= 1
                    if depth < 0:
                        # Found the closing ) of allDays.push(...);
                        # Check if next char is ;
                        pass
                elif ch == '(' and not found_start:
                    found_start = True
                    depth += 1
            
            # Simple check: line ends with ');'
            if l.rstrip().endswith(');'):
                end = i
                break
            i += 1
        
        # Extract week and day from first line
        wm = re.search(r'week:(\d+)', glines[start])
        dm = re.search(r'day:(\d+)', glines[start])
        if wm and dm:
            push_ranges.append((start, end, int(wm.group(1)), int(dm.group(1))))
        i = end + 1
    else:
        i += 1

# Group by week
gen_weeks = {}
for start, end, wk, day in push_ranges:
    gen_weeks.setdefault(wk, []).append((start, end, day))

print(f"\n=== Splitting generatedDays.ts (weeks 5-11) ===")
print(f"  Found {len(push_ranges)} push() calls across {len(gen_weeks)} weeks")

for wk in sorted(gen_weeks):
    entries = gen_weeks[wk]
    
    # Extract each push as array element (remove 'allDays.push(' wrapper)
    items = []
    for start, end, day in entries:
        # Get the complete push content
        push_lines = glines[start:end+1]
        push_text = ''.join(push_lines)
        
        # Remove allDays.push( prefix
        if push_text.strip().startswith('allDays.push('):
            push_text = push_text.strip()[len('allDays.push('):]
        # Remove trailing );
        if push_text.rstrip().endswith(');'):
            push_text = push_text.rstrip()[:-2]
        # Add trailing comma
        if not push_text.rstrip().endswith(','):
            push_text = push_text.rstrip() + ',\n'
        items.append(push_text)
    
    full_content = '\n  ' + '  '.join(items) + '\n'
    
    if wk == 5:
        # Append to existing week5.ts
        with open('src/data/learningData/weeks/week5.ts', 'r', encoding='utf-8') as f:
            existing = f.read()
        insert_pos = existing.rfind('];')
        if insert_pos > 0:
            new_content = existing[:insert_pos] + full_content + existing[insert_pos:]
            with open('src/data/learningData/weeks/week5.ts', 'w', encoding='utf-8') as f:
                f.write(new_content)
        print(f"  Week {wk}: appended {len(items)} days to week5.ts")
    else:
        output = "import type { LearningDay } from '../../types/learning';\n"
        output += "import { weekToolMap } from '../weekTools';\n"
        output += "import { dayExpertNotes } from '../expertNotes';\n"
        output += f"\nexport const week{wk}Days: LearningDay[] = [\n"
        output += full_content
        output += '];\n'
        
        with open(f'src/data/learningData/weeks/week{wk}.ts', 'w', encoding='utf-8') as f:
            f.write(output)
        print(f"  Week {wk}: {len(items)} days -> week{wk}.ts")

# ============================================================
# CREATE barrel index.ts
# ============================================================
print("\n=== Creating weeks/index.ts ===")
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

# ============================================================
# UPDATE allDays.ts
# ============================================================
new_allDays = "import type { LearningDay } from '../types/learning';\n"
new_allDays += "import { allLearningDays } from './weeks';\n"
new_allDays += "\nexport const allDays: LearningDay[] = allLearningDays;\n"

with open('src/data/learningData/allDays.ts', 'w', encoding='utf-8') as f:
    f.write(new_allDays)
print("Updated allDays.ts (removed unused import)")

# ============================================================
# UPDATE learningData.ts
# ============================================================
with open('src/data/learningData.ts', 'r', encoding='utf-8') as f:
    ldata = f.read()

ldata = re.sub(r"// Generated days auto-extend allDays\nimport '\./learningData/generatedDays';\n", '', ldata)

with open('src/data/learningData.ts', 'w', encoding='utf-8') as f:
    f.write(ldata)

print(f"\nDone! 11 weeks split into weeks/ directory")
