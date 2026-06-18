import re
fp = r'src/data/learningData.ts'
with open(fp, 'r', encoding='utf-8') as f:
    content = f.read()

days = re.findall(r"id:\s*'(day-\d+)'", content)
titles = re.findall(r"title:\s*'([^']+)'", content)

print(f"Total CISP days: {len(days)}")
print(f"Total titles: {len(titles)}")
for i in range(min(5, len(days))):
    print(f"  {days[i]}: {titles[i] if i < len(titles) else '?'}")
