import os

tools_dir = os.path.join(os.path.dirname(__file__), '..', 'public', 'contents', 'tools')
files = sorted([f for f in os.listdir(tools_dir) if f.endswith('.md')])

total_ok = 0
total_bad = 0

for f in files:
    path = os.path.join(tools_dir, f)
    with open(path, encoding='utf-8') as fh:
        lines = sum(1 for _ in fh)
    status = "OK" if lines >= 800 else f"NEED {800 - lines} more"
    if lines >= 800:
        total_ok += 1
    else:
        total_bad += 1
    print(f"{f}: {lines} lines [{status}]")

print(f"\nOK: {total_ok}, Need fix: {total_bad}, Total: {len(files)}")
