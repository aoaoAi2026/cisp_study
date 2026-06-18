import re, json, os

def extract_day_titles(filepath):
    """Extract all day/title pairs from a cyber learning data file.
    Handles 3 patterns:
    1. day: N, title: 'XXX'  (single-quoted inline objects)
    2. day: N, title: "XXX"  (double-quoted inline objects, cyberAi.ts)
    3. d('id', N, 'title', ...) (cyberVendor.ts helper function)
    """
    if not os.path.exists(filepath):
        return []
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    titles = []

    # Pattern 1: day: N, title: 'XXX' (single quotes, most plans)
    matches = re.findall(r"day:\s*(\d+),\s*title:\s*'([^']*)'", content)
    titles.extend([(int(d), t) for d, t in matches])

    # Pattern 2: day: N, title: "XXX" (double quotes, cyberAi.ts)
    matches2 = re.findall(r'day:\s*(\d+),\s*title:\s*"([^"]*)"', content)
    titles.extend([(int(d), t) for d, t in matches2])

    # Pattern 3: d('id', day, 'title', ...) - cyberVendor.ts
    # d( takes 7 positional args: id, day, title, subtitle, obj[], kp[], content
    # We need to match the day (2nd arg) and title (3rd arg)
    vend_matches = re.findall(
        r"d\('[^']*',\s*(\d+),\s*'([^']*)'",
        content
    )
    titles.extend([(int(d), t) for d, t in vend_matches])

    return sorted(set(titles), key=lambda x: x[0])


# Cyber plans
cyber_plans = {
    'basic': 'src/data/cyberBasic.ts',
    'penetration': 'src/data/cyberPenetration.ts',
    'defense': 'src/data/cyberDefense.ts',
    'ai': 'src/data/cyberAi.ts',
    'hw': 'src/data/cyberHw.ts',
    'hw-express': 'src/data/cyberHwExpress28.ts',
    'vendor': 'src/data/cyberVendor.ts',
}

# Interview plans
interview_plans = {
    'cisp': 'src/data/interviewCisp.ts',
    'basic': 'src/data/interviewBasic.ts',
    'penetration': 'src/data/interviewPenetration.ts',
    'defense': 'src/data/interviewDefense.ts',
    'ai': 'src/data/interviewAi.ts',
    'hw': 'src/data/interviewHw.ts',
}

results = {}
for plan_id, filepath in cyber_plans.items():
    titles = extract_day_titles(filepath)
    results[f'cyber/{plan_id}'] = [{'day': d, 'title': t} for d, t in titles]
    print(f'cyber/{plan_id}: {len(titles)} days')

for plan_id, filepath in interview_plans.items():
    titles = extract_day_titles(filepath)
    results[f'interview/{plan_id}'] = [{'day': d, 'title': t} for d, t in titles]
    print(f'interview/{plan_id}: {len(titles)} days')

with open('_day_titles.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

total = sum(len(v) for v in results.values())
print(f'\nTotal days across all plans: {total}')
