import re
with open(r'e:\internal_safe\cisp1\cisp\src\data\cyberPenetration.ts', 'r', encoding='utf-8') as f:
    content = f.read()
idx = content.find("id: 'pen-30'")
if idx >= 0:
    start = max(0, idx - 500)
    end = min(len(content), idx + 5000)
    chunk = content[start:end]
    out_path = r'e:\internal_safe\cisp1\cisp\scripts\pen30_context.txt'
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write(f"Position: {idx}\n")
        f.write(f"Context around pen-30:\n\n")
        f.write(chunk)
    print(f"Written to {out_path}")
else:
    print("pen-30 not found!")
    
# Also count braces around pen-30 to debug
depth = 0
in_str = False
escape_next = False
for i in range(idx, len(content)):
    c = content[i]
    if escape_next:
        escape_next = False
        continue
    if c == '\\':
        escape_next = True
        continue
    if c in ["'", '"']:
        in_str = not in_str
        continue
    if in_str:
        continue
    if c == '{':
        depth += 1
    elif c == '}':
        depth -= 1
        if depth == 0:
            print(f"Closing brace at position: {i}")
            print(f"Character at close: ...{content[max(0,i-50):i+5]}...")
            break
