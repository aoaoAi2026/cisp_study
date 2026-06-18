import os

def fix_code_quotes(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 找到所有 code: '...' 模式并替换为 code: `...`
    # 但需要处理嵌套的引号问题
    
    import re
    
    # 模式匹配 code: ' 后面跟着内容直到下一个 '
    # 这是一个简化的方法，我们需要找到正确的匹配边界
    
    # 方法：找到所有 code: ' 的位置，然后找到匹配的结束单引号
    # 由于代码中可能包含单引号，我们需要找到正确的结束位置
    
    lines = content.split('\n')
    new_lines = []
    in_code_block = False
    code_buffer = []
    code_start_line = 0
    
    for i, line in enumerate(lines):
        if "code: '" in line and not in_code_block:
            # 开始一个代码块
            parts = line.split("code: '", 1)
            before = parts[0] + "code: `"
            rest = parts[1]
            
            # 检查这一行是否包含完整的代码块
            if rest.count("',") >= 1 or rest.endswith("',"):
                # 单行代码块，直接替换
                # 找到 ', 并替换为 `,
                idx = rest.find("',")
                if idx != -1:
                    rest = rest[:idx] + "`," + rest[idx+2:]
                new_lines.append(before + rest)
            else:
                # 多行代码块
                in_code_block = True
                code_start_line = i
                code_buffer = [before + rest]
        elif in_code_block:
            # 在代码块中，继续收集直到找到结束
            # 检查是否是最后一行（以 ', 结尾）
            if "'," in line:
                # 找到 ', 的位置
                idx = line.find("',")
                code_buffer.append(line[:idx] + "`" + line[idx+1:])
                in_code_block = False
                new_lines.extend(code_buffer)
                code_buffer = []
            else:
                code_buffer.append(line)
        else:
            new_lines.append(line)
    
    return '\n'.join(new_lines)

file_path = os.path.join(os.path.dirname(__file__), '../src/data/cyberPenetration.ts')
fixed_content = fix_code_quotes(file_path)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(fixed_content)

print('修复完成!')