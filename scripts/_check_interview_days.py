import re, os

files = [
    'src/data/interviewBasic.ts',
    'src/data/interviewPenetration.ts',
    'src/data/interviewDefense.ts',
    'src/data/interviewAi.ts',
    'src/data/interviewHw.ts',
]

for f in files:
    if os.path.exists(f):
        content = open(f, encoding='utf-8').read()
        days = re.findall(r"id:\s*'interview-day-(\d+)'", content)
        print(f"{f}: {len(days)} days, IDs: {days[0]}...{days[-1]}")
    else:
        print(f"{f}: NOT FOUND")
