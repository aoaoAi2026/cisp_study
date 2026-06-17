import sys, re, os
sys.stdout.reconfigure(encoding='utf-8')

os.makedirs('src/data/plans/defense/days', exist_ok=True)

# ============================================================
# Split defense/part2.ts and part3.ts by day
# ============================================================
all_day_files = []

for part, export_name in [('part2', 'defensePart2'), ('part3', 'defensePart3')]:
    with open(f'src/data/plans/defense/{part}.ts', encoding='utf-8') as f:
        content = f.read()
        lines = content.split('\n')
    
    day_entries = []
    current_line = None
    for i, l in enumerate(lines):
        dm = re.search(r"id:\s*'def-(\d+)'", l)
        if dm:
            if current_line is not None:
                day_entries.append((current_line_day_id, current_line, end_line))
            current_line = i
            current_line_day_id = dm.group(1)
            end_line = i
        elif current_line is not None:
            end_line = i
    
    # Add last entry
    if current_line is not None:
        day_entries.append((current_line_day_id, current_line, end_line))
    
    print(f"\n=== {part}.ts: {len(day_entries)} days ===")
    
    day_files = []
    for day_id, start, end in day_entries:
        # Each day is on a single very long line
        day_content = lines[start].strip()
        
        # Write day file
        day_file = f'src/data/plans/defense/days/def-{day_id}.ts'
        output = "import type { CyberDay } from '../../types';\n\n"
        output += f"const day: CyberDay = {day_content};\nexport default day;\n"
        
        with open(day_file, 'w', encoding='utf-8') as f:
            f.write(output)
        day_files.append(f'def-{day_id}')
        print(f"  Day {day_id} -> def-{day_id}.ts")
    
    # Write the new barrel part file
    new_content = "import type { CyberDay } from '../types';\n"
    for df in day_files:
        new_content += f"import {df} from './days/{df}';\n"
    new_content += f"\nexport const {export_name}: CyberDay[] = [\n"
    for df in day_files:
        new_content += f"  {df},\n"
    new_content += "];\n"
    
    with open(f'src/data/plans/defense/{part}.ts', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"  Updated {part}.ts ({len(new_content)} bytes barrel)")
    
    all_day_files.extend(day_files)

print(f"\n=== Total: {len(all_day_files)} day files created ===")
for df in all_day_files:
    size = os.path.getsize(f'src/data/plans/defense/days/{df}.ts')
    print(f"  {df}.ts: {size/1024:.1f}KB")
