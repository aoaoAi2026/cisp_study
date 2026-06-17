import os, sys, re
sys.stdout.reconfigure(encoding='utf-8')

# Analyze allDays.ts
with open('src/data/learningData/allDays.ts', encoding='utf-8') as f:
    lines = f.readlines()

weeks = {}
current_week = None
week_start = None

for i, l in enumerate(lines):
    m = re.search(r'Week\s+(\d+)', l)
    if m and '=== ' in l and l.strip().startswith('//'):
        current_week = int(m.group(1))
        week_start = i + 1  # 1-based line number
        
# Find the actual boundary lines for each week in allDays.ts
print("=== allDays.ts Week Boundaries ===")
# Week boundaries are at comment markers
boundaries = []
for i, l in enumerate(lines):
    m = re.search(r'// ========== Week (\d+):', l)
    if m:
        wk = int(m.group(1))
        boundaries.append((wk, i+1, l.strip()))

for wk, line, comment in boundaries:
    print(f"  Week {wk}: starts at line {line}")

# Find the closing of the array and the export
for i, l in enumerate(lines):
    if l.strip() == '];' or l.strip() == ']':
        if i > len(lines) - 5:
            print(f"  Array closes at line {i+1}")
    if l.strip().startswith('export const allDays'):
        print(f"  Export at line {i+1}")

print()

# Count days per week  
print("=== allDays.ts Days per Week ===")
day_counts = {}
current_week = None
for i, l in enumerate(lines):
    m = re.search(r'// ========== Week (\d+):', l)
    if m:
        current_week = int(m.group(1))
        day_counts[current_week] = 0
    if current_week and re.search(r"id:\s*'day-", l):
        day_counts[current_week] += 1
for wk, cnt in sorted(day_counts.items()):
    print(f"  Week {wk}: {cnt} days")

print()

# Analyze generatedDays.ts
with open('src/data/learningData/generatedDays.ts', encoding='utf-8') as f:
    glines = f.readlines()

print(f"=== generatedDays.ts: {len(glines)} lines ===")
day_lines = []
for i, l in enumerate(glines):
    if l.strip().startswith('allDays.push'):
        day_lines.append(i+1)
        # Extract week/day info
        m = re.search(r"week:(\d+)", l)
        d = re.search(r"day:(\d+)", l)
        if m and d:
            day_lines[-1] = (i+1, int(m.group(1)), int(d.group(1)))

print(f"  Total push() calls: {len(day_lines)}")
weeks_seen = set()
for line, wk, day in day_lines:
    weeks_seen.add(wk)
print(f"  Weeks covered: {sorted(weeks_seen)}")
# Show first and last 3
print("  First 3:")
for line, wk, day in day_lines[:3]:
    print(f"    L{line}: week={wk} day={day}")
print("  Last 3:")
for line, wk, day in day_lines[-3:]:
    print(f"    L{line}: week={wk} day={day}")
