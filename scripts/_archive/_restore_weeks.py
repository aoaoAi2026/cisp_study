import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('_learningData_original.ts', encoding='utf-8') as f:
    lines = f.readlines()

# The data is in `const allDays: LearningDay[] = [` starting at line 704 (0-indexed: 703)
# Week boundaries in the backup:
# Week 1: line 705 (0-idx 704)
# Week 2: line 999 (0-idx 998)
# Week 3: line 1209 (0-idx 1208)
# Week 4: line 1427 (0-idx 1426)
# Week 5 starts at line 1703 (0-idx 1702)

week_ranges = {
    1: (704, 998),
    2: (998, 1208),
    3: (1208, 1426),
    4: (1426, 1702),
}

print("=== Extracting weeks 1-4 from backup ===")
for wk, (start, end) in sorted(week_ranges.items()):
    content_lines = lines[start:end]
    week_content = ''.join(content_lines)
    
    output = "import type { LearningDay } from '../../types/learning';\n"
    output += f"\nexport const week{wk}Days: LearningDay[] = [\n"
    output += week_content
    output += '\n];\n'
    
    out_file = f'src/data/learningData/weeks/week{wk}.ts'
    with open(out_file, 'w', encoding='utf-8') as f:
        f.write(output)
    print(f"  Week {wk}: {end-start} lines ({len(out_file.encode('utf-8'))/1024:.1f}KB) -> week{wk}.ts")

print("\n=== Verifying ===")
# Count day entries in each file
import re
for wk in [1,2,3,4]:
    with open(f'src/data/learningData/weeks/week{wk}.ts', encoding='utf-8') as f:
        content = f.read()
    days = len(re.findall(r"id:\s*'day-(\d+)'", content))
    print(f"  week{wk}.ts: {days} days")
