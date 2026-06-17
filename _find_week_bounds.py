import os, sys, re
sys.stdout.reconfigure(encoding='utf-8')

# ============================================================
# Step 1: Analyze allDays.ts week boundaries precisely
# ============================================================
with open('src/data/learningData/allDays.ts', encoding='utf-8') as f:
    lines = f.readlines()

# Find week comments and their line numbers
week_boundaries = []
for i, l in enumerate(lines):
    m = re.search(r'// ========== Week (\d+):', l)
    if m:
        week_boundaries.append((int(m.group(1)), i, l.strip()))

# Add end of file
week_boundaries.append((None, len(lines), ''))

print("=== allDays.ts Week Boundaries ===")
for i in range(len(week_boundaries)-1):
    wk, start, comment = week_boundaries[i]
    next_start = week_boundaries[i+1][1]
    print(f"  Week {wk}: lines {start+1}-{next_start} ({next_start-start} lines)")

# Extract header (lines before first week comment)
header_end = week_boundaries[0][1]
header = ''.join(lines[:header_end])
tail = lines[-1] if lines[-1].strip() == '];' else ''

print(f"\n  Header: {header_end} lines")
print(f"  Tail: '{tail.strip()}'")

# ============================================================
# Step 2: Analyze generatedDays.ts week boundaries
# ============================================================
with open('src/data/learningData/generatedDays.ts', encoding='utf-8') as f:
    glines = f.readlines()

# Find week comments in generatedDays
g_week_boundaries = []
for i, l in enumerate(glines):
    m = re.search(r'// ==========\s*$', l)
    if m:
        # Next line should have week info
        if i+1 < len(glines):
            nm = re.search(r'// Week (\d+):', glines[i+1])
            if nm:
                g_week_boundaries.append((int(nm.group(1)), i, glines[i].strip() + ' ' + glines[i+1].strip()))

# Add end
g_week_boundaries.append((None, len(glines), ''))

print("\n=== generatedDays.ts Week Boundaries ===")
for i in range(len(g_week_boundaries)-1):
    wk, start, comment = g_week_boundaries[i]
    next_start = g_week_boundaries[i+1][1]
    print(f"  Week {wk}: lines {start+1}-{next_start} ({next_start-start} lines)")

# Extract header of generatedDays
g_header_end = g_week_boundaries[0][0]
g_header = ''.join(glines[:g_week_boundaries[0][1]])
print(f"\n  Header start line: {g_week_boundaries[0][1]+1}")
print(f"  Header:\n{g_header[:300]}")

# ============================================================
# Find the exact push() boundary lines for each week
# ============================================================
print("\n=== Finding exact week content boundaries ===")

# For allDays.ts - each week section contains day objects in array
# For generatedDays.ts - each week section contains allDays.push() calls

# Save boundaries for later use
import json

all_wk_data = {}
for i in range(len(week_boundaries)-1):
    wk, start, _ = week_boundaries[i]
    if wk is None: break
    end = week_boundaries[i+1][1]
    content = ''.join(lines[start:end])
    all_wk_data[wk] = {'start': start, 'end': end, 'lines': end-start}

with open('_all_week_bounds.json', 'w') as f:
    json.dump(all_wk_data, f)

g_wk_data = {}
for i in range(len(g_week_boundaries)-1):
    wk, start, _ = g_week_boundaries[i]
    if wk is None: break
    end = g_week_boundaries[i+1][1]
    g_wk_data[wk] = {'start': start, 'end': end}

with open('_gen_week_bounds.json', 'w') as f:
    json.dump(g_wk_data, f)

print(f"Saved boundaries: allDays weeks={sorted(all_wk_data.keys())}, generatedDays weeks={sorted(g_wk_data.keys())}")

# Check directory structure
os.makedirs('src/data/learningData/weeks', exist_ok=True)
print("\n  Created src/data/learningData/weeks/")
