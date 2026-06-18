import os, sys, re
sys.stdout.reconfigure(encoding='utf-8')

# Analyze allDays.ts
with open('src/data/learningData/allDays.ts', encoding='utf-8') as f:
    lines = f.readlines()

print("=== allDays.ts ===")
# Find day entries
day_entries = []
for i, l in enumerate(lines):
    m = re.search(r"\bid:\s*'day-(\d+)'", l)
    if m:
        d = int(m.group(1))
        wm = re.search(r'\bweek:\s*(\d+)', l)
        w = int(wm.group(1)) if wm else 0
        day_entries.append((i+1, w, d))
        
weeks_all = {}
for line, w, d in day_entries:
    weeks_all.setdefault(w, []).append(d)
for w in sorted(weeks_all):
    ds = weeks_all[w]
    print(f"  Week {w}: days {min(ds)}-{max(ds)} ({len(ds)} days)")

print(f"  Total lines: {len(lines)}")
print()

# Analyze generatedDays.ts
with open('src/data/learningData/generatedDays.ts', encoding='utf-8') as f:
    glines = f.readlines()

print(f"=== generatedDays.ts: {len(glines)} lines ===")
gday_entries = []
for i, l in enumerate(glines):
    if l.strip().startswith('allDays.push'):
        week_m = re.search(r'week:(\d+)', l)
        day_m = re.search(r'day:(\d+)', l)
        if week_m and day_m:
            gday_entries.append((i+1, int(week_m.group(1)), int(day_m.group(1))))

gweeks = {}
for line, w, d in gday_entries:
    gweeks.setdefault(w, []).append(d)
for w in sorted(gweeks):
    ds = gweeks[w]
    print(f"  Week {w}: days {min(ds)}-{max(ds)} ({len(ds)} days)")

# Check overlap
all_weeks = set(weeks_all.keys())
gen_weeks = set(gweeks.keys())
print(f"\n  Overlapping weeks: {sorted(all_weeks & gen_weeks)}")
