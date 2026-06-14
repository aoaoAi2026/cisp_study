import re

path = r'e:\internal_safe\cisp1\cisp\scripts\gen_defense_penetration.py'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Find patterns where Chinese single quotes ('...') appear inside Python single-quoted strings
# Pattern: inside a Python single-quoted string (non-r, non-f), there are Chinese quotes
# The problematic pattern is '...'...'...'  where the inner quotes are Chinese quotes that
# prematurely terminate the Python string

# Let's search for all lines that might have this issue
# We want lines with unescaped Chinese single quotes inside Python single quotes

lines = content.split('\n')
problems = []
for i, line in enumerate(lines, 1):
    stripped = line.strip()
    # Check if line has Chinese single quotes (U+2018 ' and U+2019 ')
    if '\u2018' in stripped or '\u2019' in stripped:
        # Check if this is inside a Python single-quoted string (not inside triple quotes)
        # Simple heuristic: not inside r"""...""" or """..."""
        problems.append((i, stripped[:120]))

print(f'Found {len(problems)} lines with Chinese single quotes:')
for ln, text in problems:
    print(f'  Line {ln}: {text}')
