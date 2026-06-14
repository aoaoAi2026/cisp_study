"""Fix f-string to regular string in gen_penetration.py.
The f-strings don't have actual interpolations but markdown content has {braces}
which cause syntax errors.
"""
import re

path = r'e:\internal_safe\cisp1\cisp\scripts\gen_penetration.py'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace f""" with """ at gen() calls
# Pattern: gen('day-X.md', f""" -> gen('day-X.md', """
original = content
content = re.sub(r"(gen\('day-\d+\.md',\s*)f\"\"\"", r'\1"""', content)

fixes = len(re.findall(r"(gen\('day-\d+\.md',\s*)f\"\"\"", original))
print(f'Fixed {fixes} f-string declarations')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
