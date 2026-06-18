import json
import os
import re
from collections import Counter

base = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# 1. Day resource map coverage
with open(os.path.join(base, '_day_resource_map.json'), 'r', encoding='utf-8') as f:
    data = json.load(f)

total_days = 0
matched_to_existing = 0
newly_created = 0
unmatched = 0
plan_stats = {}

for plan_key, days in data.items():
    plan_stats[plan_key] = {'total': len(days), 'matched': 0, 'new': 0, 'empty': 0}
    total_days += len(days)
    for day_num, resource_ids in days.items():
        if len(resource_ids) == 0:
            plan_stats[plan_key]['empty'] += 1
            unmatched += 1
        else:
            rid = resource_ids[0]
            if rid.startswith('read-'):
                plan_stats[plan_key]['new'] += 1
                newly_created += 1
            else:
                plan_stats[plan_key]['matched'] += 1
                matched_to_existing += 1

print('=== 总体覆盖统计 ===')
print(f'总天数: {total_days}')
print(f'匹配已有资源: {matched_to_existing} ({matched_to_existing/total_days*100:.1f}%)')
print(f'新生成资源: {newly_created} ({newly_created/total_days*100:.1f}%)')
print(f'无匹配(空): {unmatched} ({unmatched/total_days*100:.1f}%)')
print()

print('=== 各计划覆盖 ===')
for plan in sorted(plan_stats.keys()):
    s = plan_stats[plan]
    print(f'  {plan}: 总{s["total"]}天, 已有{s["matched"]}, 新增{s["new"]}, 空{s["empty"]}')

# 2. New resources category distribution
with open(os.path.join(base, '_new_resources.json'), 'r', encoding='utf-8') as f:
    new_res = json.load(f)

new_cats = Counter(r['category'] for r in new_res)
print()
print('=== 新增资源分类分布 ===')
for cat, count in new_cats.most_common():
    print(f'  {cat}: {count}篇')

# 3. Full resource category count
res_path = os.path.join(base, 'src', 'data', 'resourceData.ts')
with open(res_path, 'r', encoding='utf-8') as f:
    res_content = f.read()

categories_raw = re.findall(r'"category"\s*:\s*"([^"]+)"', res_content)
all_cats = Counter(categories_raw)

print()
print(f'=== 全量资源分类分布 (共{len(categories_raw)}篇) ===')
print(f'分类数: {len(all_cats)}')
for cat, count in all_cats.most_common():
    print(f'  {cat}: {count}篇')
