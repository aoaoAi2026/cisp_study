"""
V2: Only match existing resources to days. No new resource generation.
Maps ai/vendor plan days to existing resources where possible.
Even with low-score matches, something is better than nothing for the "课内读物" tab.
"""
import re, json, os
from collections import Counter

def extract_day_data(filepath):
    """Extract all day data (title, keyPoints, objectives) from a plan file."""
    if not os.path.exists(filepath):
        return []
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    days = []

    # Pattern 1: day: N, title: 'XXX' (single quotes)
    day_positions = [(m.start(), m.group(1), m.group(2), 'single')
                     for m in re.finditer(r"day:\s*(\d+),\s*title:\s*'([^']*)'", content)]

    # Pattern 2: day: N, title: "XXX" (double quotes, cyberAi.ts)
    day_positions += [(m.start(), m.group(1), m.group(2), 'double')
                      for m in re.finditer(r'day:\s*(\d+),\s*title:\s*"([^"]*)"', content)]

    # Pattern 3: d('id', day, 'title', ...) for vendor file
    day_positions += [(m.start(), m.group(1), m.group(2), 'vendor')
                      for m in re.finditer(r"d\('[^']*',\s*(\d+),\s*'([^']*)'", content)]

    day_positions.sort(key=lambda x: x[0])

    for i, (pos, day_num, title, style) in enumerate(day_positions):
        end_pos = day_positions[i+1][0] if i+1 < len(day_positions) else len(content)
        chunk = content[pos:end_pos]

        kp_match = re.search(r"keyPoints:\s*\[(.*?)\]", chunk, re.DOTALL)
        key_points = []
        if kp_match:
            key_points = re.findall(r"'([^']*)'", kp_match.group(1))
            if not key_points:
                key_points = re.findall(r'"([^"]*)"', kp_match.group(1))

        obj_match = re.search(r"objectives:\s*\[(.*?)\]", chunk, re.DOTALL)
        objectives = []
        if obj_match:
            objectives = re.findall(r"'([^']*)'", obj_match.group(1))
            if not objectives:
                objectives = re.findall(r'"([^"]*)"', obj_match.group(1))

        days.append({
            'day': int(day_num),
            'title': title,
            'keyPoints': key_points,
            'objectives': objectives,
        })

    return days


# Parse existing resources
with open('src/data/resourceData.ts', 'r', encoding='utf-8') as f:
    res_content = f.read()

res_blocks = re.split(r'\n  \{\n', res_content)
resources = []
for block in res_blocks:
    id_match = re.search(r'"id":\s*"([^"]+)"', block)
    if not id_match:
        continue
    rid = id_match.group(1)
    title_match = re.search(r'"title":\s*"([^"]+)"', block)
    tags_match = re.search(r'"tags":\s*\[(.*?)\]', block, re.DOTALL)
    cat_match = re.search(r'"category":\s*"([^"]+)"', block)
    summ_match = re.search(r'"summary":\s*"([^"]+)"', block)
    diff_match = re.search(r'"difficulty":\s*"([^"]+)"', block)
    minutes_match = re.search(r'"readMinutes":\s*(\d+)', block)
    path_match = re.search(r'"contentPath":\s*"([^"]+)"', block)
    author_match = re.search(r'"author":\s*"([^"]+)"', block)
    date_match = re.search(r'"updatedAt":\s*"([^"]+)"', block)

    tags = re.findall(r'"([^"]+)"', tags_match.group(1)) if tags_match else []
    resources.append({
        'id': rid,
        'title': title_match.group(1) if title_match else '',
        'tags': tags,
        'category': cat_match.group(1) if cat_match else '',
        'summary': summ_match.group(1) if summ_match else '',
        'difficulty': diff_match.group(1) if diff_match else '进阶',
        'readMinutes': int(minutes_match.group(1)) if minutes_match else 20,
        'contentPath': path_match.group(1) if path_match else '',
        'author': author_match.group(1) if author_match else '',
        'updatedAt': date_match.group(1) if date_match else '',
    })

print(f'Existing resources: {len(resources)}')


def match_score(day, resource):
    """Score how well a resource matches a day's topic"""
    day_text = day['title'] + ' ' + ' '.join(day.get('keyPoints', []))
    res_text = resource['title'] + ' ' + ' '.join(resource.get('tags', []))
    day_lower = day_text.lower()
    res_lower = res_text.lower()

    score = 0
    day_words = set()
    for kw in day.get('keyPoints', []) + [day['title']]:
        for w in re.findall(r'[\u4e00-\u9fff]{2,}', kw):
            day_words.add(w)
        for w in re.findall(r'[A-Za-z0-9+#]{2,}', kw):
            day_words.add(w.lower())

    for w in day_words:
        if w.lower() in res_lower:
            score += 3
        elif len(w) >= 3:
            for tag in resource.get('tags', []):
                if w.lower() in tag.lower() or tag.lower() in w.lower():
                    score += 1

    return score


cyber_plans = {
    'basic': 'src/data/cyberBasic.ts',
    'penetration': 'src/data/cyberPenetration.ts',
    'defense': 'src/data/cyberDefense.ts',
    'ai': 'src/data/cyberAi.ts',
    'hw': 'src/data/cyberHw.ts',
    'hw-express': 'src/data/cyberHwExpress28.ts',
    'vendor': 'src/data/cyberVendor.ts',
}

interview_plans = {
    'cisp': 'src/data/interviewCisp.ts',
    'basic': 'src/data/interviewBasic.ts',
    'penetration': 'src/data/interviewPenetration.ts',
    'defense': 'src/data/interviewDefense.ts',
    'ai': 'src/data/interviewAi.ts',
    'hw': 'src/data/interviewHw.ts',
}

mapping = {}
stats = {}  # plan -> {total, matched, unmatched}

for plan_type, plans in [('cyber', cyber_plans), ('interview', interview_plans)]:
    for plan_id, filepath in plans.items():
        days = extract_day_data(filepath)
        key = f'{plan_type}/{plan_id}'
        mapping[key] = {}
        stats[key] = {'total': len(days), 'matched': 0, 'unmatched': 0}

        for day in days:
            scores = [(match_score(day, r), r) for r in resources]
            scores.sort(key=lambda x: -x[0])

            # Lower threshold for ai/vendor plans since they have few matching resources
            threshold = 2 if plan_id in ('ai', 'vendor') else 4
            matched_res = [r['id'] for s, r in scores if s >= threshold][:2]

            if matched_res:
                mapping[key][str(day['day'])] = matched_res
                stats[key]['matched'] += 1
            else:
                mapping[key][str(day['day'])] = []
                stats[key]['unmatched'] += 1

# Print stats
print(f'\n{"Plan":<25} {"Total":>6} {"Matched":>8} {"Unmatched":>10}')
print('-' * 52)
total_days = 0
total_matched = 0
total_unmatched = 0
for plan_key in sorted(stats.keys()):
    s = stats[plan_key]
    total_days += s['total']
    total_matched += s['matched']
    total_unmatched += s['unmatched']
    pct = s['matched']/s['total']*100 if s['total'] > 0 else 0
    print(f'{plan_key:<25} {s["total"]:>6} {s["matched"]:>8} {s["unmatched"]:>10}  ({pct:.0f}%)')
print('-' * 52)
print(f'{"TOTAL":<25} {total_days:>6} {total_matched:>8} {total_unmatched:>10}')

# Save mapping
with open('_day_resource_map.json', 'w', encoding='utf-8') as f:
    json.dump(mapping, f, ensure_ascii=False, indent=2)

print(f'\nSaved _day_resource_map.json')
print(f'No new resources will be created - only mapping to existing {len(resources)} resources.')
