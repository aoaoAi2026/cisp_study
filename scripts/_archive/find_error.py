"""Binary search to find which day causes syntax error"""
import sys

with open('scripts/gen_cyberAi_part2.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract just the add() calls for each day
lines = content.split('\n')

# Find line numbers of each "add(" start
day_starts = []
for i, line in enumerate(lines):
    if line.strip().startswith('# DAY') or line.strip().startswith('add(mk(') or line.strip().startswith('add(dict('):
        day_starts.append((i+1, line.strip()[:80]))

print("Day entries:")
for ln, line in day_starts:
    print(f"  Line {ln}: {line}")

# Try parsing up to each day to find first failure
print("\n--- Trying incremental parsing ---")
for idx, (ln, marker) in enumerate(day_starts):
    # Build content up to end of this day's add() call
    # Find the matching close
    # For simplicity, try up to start of next day minus 1
    if idx + 1 < len(day_starts):
        end_ln = day_starts[idx + 1][0] - 1
    else:
        end_ln = len(lines)  # Last day
    
    partial = '\n'.join(lines[:end_ln])
    # Add the closing bracket
    partial += '\n]'
    
    try:
        import ast
        ast.parse(partial)
        print(f"  OK through line {end_ln} (end of: {marker})")
    except SyntaxError as e:
        print(f"  FAIL at day ending around line {end_ln}: {e}")
        # Show the last few lines
        for l in lines[max(0,end_ln-5):min(len(lines),end_ln+1)]:
            print(f"    | {l[:100]}")
        break
