import re, os, json

base = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

for fname, label in [
    ('src/data/cyberBasic.ts', 'Basic'),
    ('src/data/cyberDefense.ts', 'Defense'),
    ('src/data/cyberPenetration.ts', 'Penetration'),
]:
    fpath = os.path.join(base, fname)
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Extract day IDs and titles
    days_data = re.findall(
        r"id:\s*'([^']+)'\s*,\s*day:\s*\d+\s*,\s*title:\s*'([^']+)'",
        content
    )
    print(f'\n=== {label} ({len(days_data)} days) ===')
    for did, title in days_data:
        print(f'  {did}: {title}')

    # Check with quiz (singular) and quizzes (plural)
    for prop in ['quiz', 'quizzes']:
        days_with = set(re.findall(r"id:\s*'([^']+)'.*?" + prop + r':\s*\[', content, re.DOTALL))
        all_ids = [d[0] for d in days_data]
        missing = [d for d in all_ids if d not in days_with]
        if missing:
            print(f'  MISSING {prop}: {len(missing)} days')

    for attr in ['resources', 'recommendedTools', 'labEnvironment', 'codeExamples', 'expertNotes']:
        days_with = set(re.findall(r"id:\s*'([^']+)'.*?" + attr + r':\s*\[', content, re.DOTALL))
        all_ids = [d[0] for d in days_data]
        missing = [d for d in all_ids if d not in days_with]
        if missing:
            print(f'  MISSING {attr}: {len(missing)} days - {missing[:5]}...' if len(missing)>5 else f'  MISSING {attr}: {missing}')
