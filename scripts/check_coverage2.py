import re, os
base = r'e:\internal_safe\cisp1\cisp\scripts'

for fn in ['gen_defense.py', 'gen_penetration.py', 'gen_all_remaining.py', 'gen_basic.py',
           'gen_basic_part2.py', 'gen_basic_3_10.py', 'gen_defense_batch.py']:
    path = os.path.join(base, fn)
    if not os.path.exists(path):
        print(f'{fn}: NOT FOUND')
        continue
    size_kb = os.path.getsize(path) / 1024
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    matches = re.findall(r"gen\('day-(\d+)\.md'", content)
    # Also check for make_day pattern
    matches2 = re.findall(r"make_day\('[^']*',\s*(\d+)\s*,", content)
    print(f'{fn}: {size_kb:.0f}KB, gen() days: {sorted(set(matches))} ({len(set(matches))} total)')
    if matches2:
        print(f'       make_day() days: {sorted(set(int(m) for m in matches2))} ({len(set(matches2))} total)')
