#!/usr/bin/env python3
"""精确分析Defense模块数据"""
import re
from collections import Counter

with open('src/data/cyberDefense.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 统计codeExamples
codes = re.findall(r'codeExamples:\s*\[', content)
print(f'代码示例: {len(codes)}/30天')

# 查找codeExamples中的title
code_titles = re.findall(r'"title":"([^"]+)"', content)
code_title_counter = Counter(code_titles)
print(f'  不同代码标题数: {len(code_title_counter)}')
for t, c in code_title_counter.most_common():
    print(f'    [{c}天] {t[:80]}')

# 统计expertNotes 
expert_authors = re.findall(r'"author":"([^"]+)"', content)
expert_titles = re.findall(r'"title":"([^"]+)"', content)
expert_content = re.findall(r'"content":"([^"]*)"', content)
author_counter = Counter(expert_authors)
title_counter = Counter(expert_titles)

print(f'\n大神笔记: {len(expert_authors)}条记录')
print(f'  不同作者数: {len(author_counter)}')
for a, c in author_counter.most_common():
    print(f'    [{c}次] {a}')
print(f'  不同标题数: {len(title_counter)}')
for t, c in title_counter.most_common(5):
    print(f'    [{c}次] {t[:60]}')

# 统计quiz题目
quiz_questions = re.findall(r'"question":"([^"]*)"', content)
q_counter = Counter(quiz_questions)
print(f'\n随堂测试: {len(quiz_questions)}题')
print(f'  不同题目数: {len(q_counter)}')
print(f'  重复题目 (出现>=10次):')
for q, c in q_counter.most_common(15):
    if c >= 5:
        print(f'    [{c}次] {q[:80]}')

# 统计resources, tools, labs
resources = len(re.findall(r'resources:\s*\[', content))
tools = len(re.findall(r'recommendedTools:\s*\[', content))
labs = len(re.findall(r'labEnvironment:\s*\[', content))
print(f'\n学习资源: {resources}/30天')
print(f'推荐工具: {tools}/30天')
print(f'实验靶场: {labs}/30天')
