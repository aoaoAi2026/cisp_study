# -*- coding: utf-8 -*-
"""
Fix all problematic quote characters in generate_days.py
"""
with open('generate_days.py', 'r', encoding='utf-8') as f:
    lines = f.readlines()

fixed_lines = []
# Track which section of the file we're in
in_data_section = False

for i, line in enumerate(lines):
    # Check if we're entering the data section (after line ~1400)
    if 'topics_71_80 = [' in line or 'topics_81_90 = [' in line or 'topics_91_120 = [' in line:
        in_data_section = True
    
    # If in data section and line has Chinese content with inner quotes
    if in_data_section and line.strip().startswith('"') and line.strip().endswith('",'):
        # This is a Chinese text line - replace inner double quotes
        # Count the quotes - if more than 2, there are inner quotes
        stripped = line.strip()
        if stripped.count('"') > 4:  # Opening " and closing ", plus inner pairs
            # Replace inner double quotes with Chinese brackets
            # Strategy: find content between the first " and last ",
            inner = stripped[1:-2]  # Remove outer " and ",
            
            # Replace inner " pairs with 「」
            parts = inner.split('"')
            if len(parts) > 1:
                # Rebuild with 「」 for quoted sections
                new_inner = ''
                for j, part in enumerate(parts):
                    if j == 0:
                        new_inner += part
                    elif j % 2 == 1:
                        new_inner += '「' + part
                    else:
                        new_inner += '」' + part
                # Handle trailing case
                new_line = ' ' * (len(line) - len(stripped)) + '"' + new_inner + '",\n'
                fixed_lines.append(new_line)
                continue
    
    fixed_lines.append(line)

with open('generate_days.py', 'w', encoding='utf-8') as f:
    f.writelines(fixed_lines)

print('Fixed all quote issues')
