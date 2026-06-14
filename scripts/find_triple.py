"""Find all triple-quote occurrences in gen_penetration.py that might cause issues."""
import re

path = r'e:\internal_safe\cisp1\cisp\scripts\gen_penetration.py'
with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

matches = []
for i, line in enumerate(lines, 1):
    if '"""' in line and 'gen(' not in line:
        stripped = line.strip()
        # Only report if the line is NOT a gen() call boundary
        matches.append((i, stripped[:120]))

print(f'Found {len(matches)} non-gen lines with triple quotes')
# Group by proximity to see blocks
for ln, text in matches[:50]:
    print(f'  L{ln}: {text}')
if len(matches) > 50:
    print(f'  ... and {len(matches)-50} more')
