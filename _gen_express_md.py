"""Extract inline content fields from cyberHwExpress28.ts and write to individual .md files."""
import re
import os

ts_file = r"e:\internal_safe\cisp1\cisp\src\data\cyberHwExpress28.ts"
out_dir = r"e:\internal_safe\cisp1\cisp\public\contents\cyber-learning\hw-express"

with open(ts_file, 'r', encoding='utf-8') as f:
    text = f.read()

# Match each day block: find day number and the content template literal
# Pattern: day: <N>, ... content: `...`,
# The content is inside backtick-quoted template strings.
# We need to handle the case where backticks may appear inside the content.

# Find all day entries by looking for "day: N," pattern followed by content
day_blocks = re.findall(r'day:\s*(\d+),.*?content:\s*`(.*?)`,?\s*(?:quiz:|$)', text, re.DOTALL)

print(f"Found {len(day_blocks)} day blocks")

# Alternative approach: find content blocks more carefully
# The content field is always: content: `...`,
# Let's use a state machine approach

contents = {}
current_day = None
current_content = None
in_content = False
backtick_count = 0

lines = text.split('\n')
i = 0
while i < len(lines):
    line = lines[i]
    
    # Detect day number
    day_match = re.match(r'\s*day:\s*(\d+),', line)
    if day_match and not in_content:
        current_day = int(day_match.group(1))
    
    # Detect start of content
    content_match = re.match(r"\s*content:\s*`(.*)", line)
    if content_match and current_day is not None and not in_content:
        in_content = True
        content_lines = [content_match.group(1)]
        # Check if this line also ends the content (single-line content)
        if '`,' not in content_match.group(1) and '`' not in content_match.group(1):
            pass  # multi-line content
        i += 1
        continue
    
    if in_content:
        # Look for end of content - a backtick followed by comma
        if re.match(r'^(.*)`\s*,?\s*$', line):
            end_match = re.match(r'^(.*)`\s*,?\s*$', line)
            if end_match:
                content_lines.append(end_match.group(1))
            in_content = False
            # Store content
            raw = '\n'.join(content_lines)
            # Unescape template literal escapes
            # Actually the content is already valid markdown, just keep as-is
            contents[current_day] = raw
            current_day = None
            content_lines = []
        else:
            content_lines.append(line)
    
    i += 1

print(f"Extracted contents for days: {sorted(contents.keys())}")

# Write to files
os.makedirs(out_dir, exist_ok=True)
for day, md_text in sorted(contents.items()):
    filename = os.path.join(out_dir, f"day-{day}.md")
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(md_text)
    print(f"Written: {filename}")

print(f"\nDone! {len(contents)} files written to {out_dir}")
