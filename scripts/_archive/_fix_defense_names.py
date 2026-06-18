import sys, re, os
sys.stdout.reconfigure(encoding='utf-8')

# Fix: rename imports to use valid JS identifiers (def-15 -> def15)
for part, export_name in [('part2', 'defensePart2'), ('part3', 'defensePart3')]:
    barrel_path = f'src/data/plans/defense/{part}.ts'
    with open(barrel_path, encoding='utf-8') as f:
        content = f.read()
    
    # Replace import def-XX -> import defXX and from variable names
    content = re.sub(r'import def-(\d+)', r'import def\1', content)
    content = re.sub(r'\bdef-(\d+)\b(?!\.)', r'def\1', content)
    
    with open(barrel_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Fixed {part}.ts")

# Also fix the day files themselves - they use `const day: CyberDay = ...`
# which is fine since it's `day`, not `def-15`

print("Done - check lint now")
