#!/usr/bin/env python3
"""检查 cyber-learning 模块中每个day的子功能丰富程度"""
import re
import os

base = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

files = [
    ('Basic【基础】', os.path.join(base, 'src', 'data', 'cyberBasic.ts')),
    ('Defense【防御】', os.path.join(base, 'src', 'data', 'cyberDefense.ts')),
    ('Penetration【渗透】', os.path.join(base, 'src', 'data', 'cyberPenetration.ts')),
]

for name, path in files:
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 统计每个day的codeExamples数量
    code_blocks = re.findall(r"codeExamples:\s*\[", content)
    # 统计每个day的quiz数量
    quiz_blocks = re.findall(r"quiz:\s*\[", content)
    # 统计每个day的expertNotes数量
    expert_blocks = re.findall(r"expertNotes:\s*\[", content)
    # 统计labEnvironment
    lab_blocks = re.findall(r"labEnvironment:\s*\[", content)
    # 统计resources
    resource_blocks = re.findall(r"resources:\s*\[", content)
    # 统计recommendedTools
    tool_blocks = re.findall(r"recommendedTools:\s*\[", content)
    
    print(f"\n{'='*60}")
    print(f"  {name}  - 30天")
    print(f"{'='*60}")
    print(f"  代码示例(codeExamples):    {len(code_blocks)}/30 天")
    print(f"  随堂测试(quiz):           {len(quiz_blocks)}/30 天")
    print(f"  大神笔记(expertNotes):    {len(expert_blocks)}/30 天")
    print(f"  实验环境(labEnvironment):  {len(lab_blocks)}/30 天")
    print(f"  学习资源(resources):      {len(resource_blocks)}/30 天")
    print(f"  推荐工具(recommendedTools):{len(tool_blocks)}/30 天")
    
    # 统计专家笔记的总数和每条长度
    expert_entries = re.findall(r"author:\s*'([^']*)',\s*title:\s*'([^']*)',\s*content:\s*'([^']*)'", content)
    print(f"\n  专家笔记详情: 共 {len(expert_entries)} 条")
    for author, title, text in expert_entries:
        print(f"    [{author}] {title} ({len(text)}字)")
    
    # 统计quiz详情
    quiz_questions = re.findall(r"question:\s*'([^']*)'", content)
    print(f"\n  随堂测试详情: 共 {len(quiz_questions)} 题")
    
    # 检查哪些day缺少子功能 (粗略通过空数组检测)
    # 检查是否有空的expertNotes: [], quiz: [], codeExamples: []
    empty_expert = len(re.findall(r"expertNotes:\s*\[\s*\]", content))
    empty_quiz = len(re.findall(r"quiz:\s*\[\s*\]", content))
    empty_code = len(re.findall(r"codeExamples:\s*\[\s*\]", content))
    empty_lab = len(re.findall(r"labEnvironment:\s*\[\s*\]", content))
    empty_resource = len(re.findall(r"resources:\s*\[\s*\]", content))
    empty_tool = len(re.findall(r"recommendedTools:\s*\[\s*\]", content))
    
    # 缺少子功能的天数
    missing_expert = len(re.findall(r"expertNotes:\s*\[", content)) - len(re.findall(r"expertNotes:\s*\[\s*\]", content))
    
    print(f"\n  缺失情况:")
    print(f"    空代码示例: {empty_code} 天")
    print(f"    空随堂测试: {empty_quiz} 天")
    print(f"    空大神笔记: {empty_expert} 天")
    print(f"    空实验环境: {empty_lab} 天")
    print(f"    空学习资源: {empty_resource} 天")
    print(f"    空推荐工具: {empty_tool} 天")

print("\n" + "="*60)
print("总结: 主内容(md文件)每篇931行已很充实")
print("     但TS数据中的子功能(codeExamples/quiz/expertNotes)")
print("     才是前端侧边面板展示的内容!")
print("="*60)
