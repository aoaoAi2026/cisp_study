import os, glob

files = sorted(glob.glob('day-*.md'), key=lambda x: int(x.split('-')[1].split('.')[0]))
missing = []
empty = []

for f in files:
    s = os.path.getsize(f)
    day = int(f.split('-')[1].split('.')[0])
    status = 'EMPTY!' if s == 0 else f'{s:>6d} B'
    print(f'{f:20s} {status}')

for d in range(1, 121):
    fp = f'day-{d}.md'
    if not os.path.exists(fp):
        missing.append(d)

for f in files:
    if os.path.getsize(f) == 0:
        day = int(f.split('-')[1].split('.')[0])
        empty.append(day)

print(f'\n=== SUMMARY ===')
print(f'Total files: {len(files)}')
print(f'Empty files: {empty if empty else "None"}')
print(f'Missing days: {missing if missing else "None"}')
print(f'All 120 days OK: {len(files)==120 and not empty and not missing}')
