"""Generate dayResourceMap.ts from _day_resource_map.json (no new resources)"""
import json, os

with open('_day_resource_map.json', 'r', encoding='utf-8') as f:
    mapping = json.load(f)

ts_lines = [
    '// Auto-generated day-to-resource mapping',
    '// Maps (planType, planId, dayNumber) -> resourceId[]',
    '',
    'export type PlanType = "cyber" | "interview";',
    '',
    'type DayMap = Record<string, string[]>;',
    'type PlanMap = Record<string, DayMap>;',
    '',
    'export const dayResourceMap: Record<PlanType, PlanMap> = {',
]

for plan_type in ['cyber', 'interview']:
    ts_lines.append(f'  "{plan_type}": {{')
    for full_key in sorted(mapping.keys()):
        if not full_key.startswith(plan_type + '/'):
            continue
        plan_id = full_key.split('/')[1]
        day_map = mapping[full_key]
        # Sort by day number
        sorted_days = sorted(day_map.keys(), key=lambda x: int(x))
        ts_lines.append(f'    "{plan_id}": {{')
        for day_num in sorted_days:
            res_ids = day_map[day_num]
            if res_ids:
                ids_str = ', '.join(f'"{r}"' for r in res_ids)
                ts_lines.append(f'      "{day_num}": [{ids_str}],')
            else:
                ts_lines.append(f'      "{day_num}": [],')
        ts_lines.append('    },')
    ts_lines.append('  },')
ts_lines.append('};')
ts_lines.append('')
ts_lines.append('export function getReadingsForDay(planType: PlanType, planId: string, day: number): string[] {')
ts_lines.append('  return dayResourceMap[planType]?.[planId]?.[String(day)] || [];')
ts_lines.append('}')

with open('src/data/dayResourceMap.ts', 'w', encoding='utf-8') as f:
    f.write('\n'.join(ts_lines))

# Count stats
total_with = sum(1 for pt in mapping.values() for d in pt.values() for _ in d if d)
total_without = sum(1 for pt in mapping.values() for d in pt.values() for r in d if not r)
print(f'Generated dayResourceMap.ts')
print(f'Days with readings: {total_with}')
print(f'Days without readings: {total_without}')
print(f'Only {total_without} days will show "暂无该课程的课内读物"')
