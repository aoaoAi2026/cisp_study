import re

files = {
    'basic': ('src/data/cyberBasic.ts', re.compile(r'question\s*:')),
    'penetration': ('src/data/cyberPenetration.ts', re.compile(r'question\s*:')),
    'defense': ('src/data/cyberDefense.ts', re.compile(r'"question"')),
}

for plan_id, (fpath, pat) in files.items():
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find day sections
    day_re = re.compile(r'day:\s*(\d+),\s*title:\s*[\'"]([^\'"]+)[\'"]')
    matches = list(day_re.finditer(content))
    
    counts = {}
    topics = {}
    for j, m in enumerate(matches):
        day_num = int(m.group(1))
        title = m.group(2)
        start = m.start()
        end = matches[j+1].start() if j+1 < len(matches) else len(content)
        section = content[start:end]
        q_count = len(pat.findall(section))
        counts[day_num] = q_count
        topics[day_num] = title
    
    total = sum(counts.values())
    print(f'\n=== {plan_id.upper()} ({total} questions total) ===')
    for d in sorted(counts.keys()):
        print(f'  Day {d:2d}: {counts[d]:2d} questions - {topics[d]}')
    print(f'  Average: {total/len(counts):.1f}q/day')
