import re

with open('gen_day29_30.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Pattern: ]) followed by a blank line and then Chinese text (starting with >, **, etc.)
# That Chinese text should be part of a raw string
# Fix: insert + r''' after ]) when the next non-blank line starts with non-code characters

lines = content.split('\n')
fixed_lines = []
i = 0
while i < len(lines):
    line = lines[i]
    fixed_lines.append(line)
    
    # Check if this line ends with ]) and next line starts a bare Chinese text block
    stripped = line.strip()
    if stripped == '])' or (stripped.endswith('])') and stripped.count(')') == stripped.count('(') + 1):
        # Look ahead: skip blank lines, check if next actual content starts with Chinese or markdown
        j = i + 1
        while j < len(lines) and lines[j].strip() == '':
            fixed_lines.append(lines[j])
            j += 1
        if j < len(lines):
            next_line = lines[j].strip()
            # If next line is not code and not already a string continuation
            if next_line and not next_line.startswith("+") and not next_line.startswith("r'''") and not next_line.startswith("r\"\"\"") and not next_line.startswith('#') and not next_line.startswith(']') and not next_line.startswith(')') and not next_line.startswith("'''") and not next_line.startswith('for ') and not next_line.startswith('if ') and not next_line.startswith('sec(') and not next_line.startswith('def ') and not next_line.startswith('write_day'):
                # Check if it looks like content (Chinese chars or markdown)
                has_chinese = any('\u4e00' <= c <= '\u9fff' or '\uff00' <= c <= '\uffef' for c in next_line)
                has_markdown = next_line.startswith('>') or next_line.startswith('**') or next_line.startswith('```') or next_line.startswith('|')
                if has_chinese or has_markdown:
                    # This is content that should be inside a string
                    # Insert + r''' before the next non-blank line
                    # Go back and fix the blank lines too
                    fixed_lines.pop()  # Remove the last blank line
                    fixed_lines.append(line)  # Keep the ])
                    fixed_lines.append('')  # Add blank line
                    fixed_lines.append("")  # Add another blank line  
                    fixed_lines.append(f"{' ' * (len(lines[i]) - len(lines[i].lstrip()))})+ r'''")
                    # Reset to just before the content line
                    i = j - 1
    
    i += 1

with open('gen_day29_30.py', 'w', encoding='utf-8') as f:
    f.write('\n'.join(fixed_lines))

print('Fixed!')
