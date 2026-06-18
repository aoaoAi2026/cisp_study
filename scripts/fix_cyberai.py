"""Fix cyberAi.ts thoroughly: 
1. Escape inner double quotes in content strings
2. Fix incomplete content strings that span multiple lines
"""
import re

with open('src/data/cyberAi.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Strategy: Process the file character by character through a state machine
# to properly handle string literals, escaping inner quotes, and fixing multiline strings

lines = text.split('\n')
fixed = []
i = 0

while i < len(lines):
    line = lines[i]
    stripped = line.strip()
    
    # Check for content: "..." with raw newlines or inner quotes
    if stripped.startswith('content: "') and not stripped.endswith('",'):
        # This is a broken content string - needs fixing
        # Remove 'content: "' prefix and start collecting
        prefix = 'content: "'
        content_text = stripped[len(prefix):]
        
        # Collect continuation lines
        j = i + 1
        while j < len(lines):
            next_stripped = lines[j].strip()
            if next_stripped.endswith('",') or next_stripped.endswith('"'):
                # End of content string found
                end_part = next_stripped
                if next_stripped.endswith('",'):
                    end_part = next_stripped[:-2]  # Remove trailing ",
                elif next_stripped.endswith('"'):
                    end_part = next_stripped[:-1]  # Remove trailing "
                    
                content_text += '\\n' + end_part
                # Escape any remaining inner double quotes
                content_text = content_text.replace('"', '\\"')
                # Put it back together
                if next_stripped.endswith('",'):
                    fixed.append(f'    content: "{content_text}",')
                else:
                    fixed.append(f'    content: "{content_text}"')
                i = j
                break
            else:
                # Continuation line
                content_text += '\\n' + next_stripped
                j += 1
        else:
            # Shouldn't happen, but fallback
            fixed.append(line)
    else:
        # Normal line or already-fixed content line
        # Check if content string needs inner quote escaping
        if stripped.startswith('content: "') and stripped.endswith('",'):
            inner = stripped[len('content: "'):-2]  # Remove prefix and '",'
            if '"' in inner:
                # Has inner quotes that need escaping
                # Be careful not to escape already-escaped ones
                # Strategy: replace " with \" only if not already \"
                inner_fixed = inner.replace('\\"', '\x00').replace('"', '\\"').replace('\x00', '\\"')
                indent = line[:len(line) - len(line.lstrip())]
                fixed.append(f'{indent}content: "{inner_fixed}",')
            else:
                fixed.append(line)
        else:
            fixed.append(line)
    
    i += 1

with open('src/data/cyberAi.ts', 'w', encoding='utf-8') as f:
    f.write('\n'.join(fixed))

print(f"Fixed {len(fixed)} lines")
