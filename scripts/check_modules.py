import re

import os
base = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

for fname, label in [
    ('src/data/cyberBasic.ts', 'Basic'),
    ('src/data/cyberDefense.ts', 'Defense'),
    ('src/data/cyberPenetration.ts', 'Penetration'),
]:
    fpath = os.path.join(base, fname)
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()

    days = re.findall(r"id:\s*'([^']+)'", content)
    print(f'\n=== {label} ({len(days)} days) ===')

    for attr in ['resources', 'codeExamples', 'recommendedTools', 'labEnvironment', 'expertNotes']:
        matches = re.findall(r"id:\s*'([^']+)'.*?" + attr + r':\s*\[', content, re.DOTALL)
        has_attr = set(matches)
        missing = [d for d in days if d not in has_attr]
        if missing:
            print(f'  Missing {attr}: {missing}')

    # quizzes
    days_with_quiz = set()
    for d in days:
        idx = content.find("id: '" + d + "'")
        end_search = min(idx + 50000, len(content))
        chunk = content[idx:end_search]
        next_day = re.search(r"\n\s*\{\s*\n\s*id:\s*'", chunk[100:])
        if next_day:
            chunk = chunk[:next_day.start()+100]
        if 'quizzes: [' in chunk:
            q_start = chunk.find('quizzes: [')
            q_end = chunk.find(']', q_start)
            if q_end > q_start:
                q_content = chunk[q_start:q_end+1]
                if 'question:' in q_content:
                    days_with_quiz.add(d)
    missing_q = [d for d in days if d not in days_with_quiz]
    if missing_q:
        print(f'  Missing quizzes: {missing_q}')
