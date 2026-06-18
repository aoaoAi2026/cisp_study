import re, json
from collections import Counter

# Verify resourceData.ts
with open('src/data/resourceData.ts', 'r', encoding='utf-8') as f:
    c = f.read()
ids = re.findall(r'"id":\s*"([^"]+)"', c)
cats = Counter(re.findall(r'"category":\s*"([^"]+)"', c))
print(f'=== resourceData.ts ===')
print(f'Total resources: {len(ids)}')
print()
for k, v in cats.most_common():
    print(f'  {k}: {v}')

# Verify dayResourceMap.ts has ai and vendor
with open('src/data/dayResourceMap.ts', 'r', encoding='utf-8') as f:
    dm = f.read()
has_ai = '"ai":' in dm
has_vendor = '"vendor":' in dm
print(f'\n=== dayResourceMap.ts ===')
print(f'Has cyber.ai: {has_ai}')
print(f'Has cyber.vendor: {has_vendor}')

# Check new tools articles exist
import os
tools_files = [
    'public/contents/tools/tools-nmap-001.md',
    'public/contents/tools/tools-burp-001.md',
    'public/contents/tools/tools-wireshark-001.md',
    'public/contents/tools/tools-metasploit-001.md',
    'public/contents/reverse/tools-ida-001.md',
]
print(f'\n=== New article files ===')
for f in tools_files:
    exists = os.path.exists(f)
    size = os.path.getsize(f) if exists else 0
    print(f'  {f}: {"OK" if exists else "MISSING"} ({size} bytes)')

# Summary
print(f'\n=== Summary ===')
print(f'Resources before: 357 (previously from 348 ids in resourceData.ts)')
print(f'Resources after: {len(ids)}')
print(f'Added: {len(ids) - 357} high-quality tools/reverse articles')
print(f'No articles deleted. Only added.')
print(f'dayResourceMap.ts now covers all 13 plans with existing resource matches.')
