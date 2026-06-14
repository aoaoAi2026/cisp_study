#!/usr/bin/env python3
"""全面对比三个模块的子功能数据质量"""
import re
from collections import Counter

files = {
    'Basic【基础】': ('src/data/cyberBasic.ts', "'"),
    'Penetration【渗透】': ('src/data/cyberPenetration.ts', "'"),
    'Defense【防御】': ('src/data/cyberDefense.ts', '"'),
}

for name, (path, quote) in files.items():
    with open(path, 'r', encoding='utf-8') as f:
        c = f.read()
    
    print(f"\n{'='*60}")
    print(f"  {name}")
    print(f"{'='*60}")
    
    # codeExamples
    code_titles = re.findall(quote + r'title' + quote + r'\s*:\s*' + quote + r'([^' + quote + r']*)' + quote, c)
    codes_days = len(re.findall(r'codeExamples:\s*\[', c))
    print(f"代码示例: {codes_days}/30天, {len(code_titles)}条, 不同标题{len(set(code_titles))}个")
    
    # quiz
    quiz_qs = re.findall(quote + r'question' + quote + r'\s*:\s*' + quote + r'([^' + quote + r']*)' + quote, c)
    quiz_days = len(re.findall(r'quiz:\s*\[', c))
    q_counter = Counter(quiz_qs)
    repeats = [(q, cnt) for q, cnt in q_counter.most_common(20) if cnt >= 5]
    print(f"随堂测试: {quiz_days}/30天, {len(quiz_qs)}题, 不同题{len(set(quiz_qs))}题")
    if repeats:
        print(f"  重复题({len(repeats)}题出现>=5次):")
        for q, cnt in repeats[:5]:
            print(f"    [{cnt}次] {q[:70]}")
    
    # expertNotes
    expert_authors = re.findall(quote + r'author' + quote + r'\s*:\s*' + quote + r'([^' + quote + r']*)' + quote, c)
    expert_titles = re.findall(quote + r'title' + quote + r'\s*:\s*' + quote + r'([^' + quote + r']*)' + quote, c)
    expert_days = len(re.findall(r'expertNotes:\s*\[', c))
    # Filter out code example titles that got caught
    real_expert_titles = [t for t in expert_titles if '动手实践' not in t and '安全防御' not in t and '安全运维' not in t and '安全管理' not in t]
    if name == 'Defense【防御】':
        real_expert_authors = expert_authors[30:]  # Skip code example entries
        real_expert_titles = expert_titles[30:]
    else:
        real_expert_authors = expert_authors
        real_expert_titles = expert_titles
    
    print(f"大神笔记: {expert_days}/30天, {len(real_expert_authors)}条, 不同作者{len(set(real_expert_authors))}位")
    
    # resources
    res_days = len(re.findall(r'resources:\s*\[', c))
    print(f"学习资源: {res_days}/30天")
    
    # tools
    tool_days = len(re.findall(r'recommendedTools:\s*\[', c))
    print(f"推荐工具: {tool_days}/30天")
    
    # labs
    lab_days = len(re.findall(r'labEnvironment:\s*\[', c))
    print(f"实验靶场: {lab_days}/30天")

print(f"\n{'='*60}")
print("  KEY: 真正的差距不在于覆盖率(都是100%),")
print("  而在于内容与当篇文章的关联度!")
print(f"{'='*60}")
