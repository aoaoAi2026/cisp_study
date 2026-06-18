import re
fp = r'src/data/learningData.ts'
with open(fp, 'r', encoding='utf-8') as f:
    content = f.read()

# Extract all day entries with title and objectives
days = []
current_day = None
for line in content.split('\n'):
    id_match = re.search(r"id:\s*'(day-\d+)'", line)
    title_match = re.search(r"title:\s*'([^']+)'", line)
    week_match = re.search(r"week:\s*(\d+)", line)
    objective_match = re.search(r"objectives:\s*\[(.*?)\]", line)
    if id_match:
        current_day = {'id': id_match.group(1)}
        days.append(current_day)
    if current_day and title_match:
        current_day['title'] = title_match.group(1)
    if current_day and week_match and 'week' not in current_day:
        current_day['week'] = week_match.group(1)

print(f"Total CISP days: {len(days)}")
print()
for d in days:
    print(f"{d['id']} (week {d.get('week','?')}): {d.get('title','?')}")
