# -*- coding: utf-8 -*-
"""Core generator - reads JSON data, writes rich .md files"""
import json, os, sys

OUT = os.path.dirname(os.path.abspath(__file__))

TEMPLATE = r"""---
day: {day}
title: {title}
phase: {phase}
difficulty: {diff}
---

# Day {day}：{title}

> **阶段**：{phase_str} | **难度**：{diff} | **预计课时**：2-3小时

---

## 📋 今日学习目标

{goals}

---

## 📖 核心知识讲解

{intro}

{content}

---

## 🔧 实操任务

{tasks}

---

## ✅ 验收标准

{checklist}

---

## 📝 今日小结

{summary}

---

## 📚 延伸阅读

{reading}

---

> 🎯 **明日预告**：{next_title}
"""

def phase_info(d):
    if d <= 60:
        return ('第一阶段', '第一阶段 · 初级蓝队夯实')
    elif d <= 90:
        return ('第二阶段', '第二阶段 · 中级蓝队进阶')
    return ('第三阶段', '第三阶段 · 高级蓝队升华')

def as_bullet(items, fmt='{i}. {t}'):
    return '\n'.join(fmt.format(i=i, t=t) for i, t in enumerate(items, 1))

def as_checklist(items):
    return '\n'.join(f'- [ ] {t}' for t in items)

def as_reading(items):
    return '\n'.join(f'- {t}' for t in items)

def build_sections(sections):
    """sections is a list of {title:, body:} dicts"""
    out = []
    for i, sec in enumerate(sections, 1):
        out.append(f'\n### {num_cn(i)}、{sec["title"]}\n')
        out.append(sec['body'])
        out.append('')
    return '\n'.join(out)

def num_cn(n):
    return ['零','一','二','三','四','五','六','七','八','九','十',
            '十一','十二','十三','十四','十五'][n] if n <= 15 else str(n)

def generate(data_file):
    """Read JSON data file and generate .md files"""
    with open(data_file, 'r', encoding='utf-8') as f:
        all_data = json.load(f)
    
    days_data = all_data.get('days', all_data)
    count = 0
    
    for day_str, d in sorted(days_data.items(), key=lambda x: int(x[0])):
        day = int(day_str)
        ph, phs = phase_info(day)
        
        # Build sections
        content = build_sections(d.get('sections', []))
        
        # Get next day title
        next_day = str(day + 1)
        next_title = days_data.get(next_day, {}).get('title', '敬请期待')
        
        # Build introduction
        intro = d.get('intro', '')
        if intro:
            intro = f'> 🧠 **白话理解**：{intro}\n'
        
        text = TEMPLATE.format(
            day=day, title=d['title'], phase=ph, diff=d.get('diff', '⭐⭐ 基础'),
            phase_str=phs,
            goals=as_bullet(d.get('goals', []), '{i}. {t}'),
            intro=intro,
            content=content,
            tasks=as_bullet(d.get('tasks', []), '{i}. {t}'),
            checklist=as_checklist(d.get('checklist', [])),
            summary=d.get('summary', ''),
            reading=as_reading(d.get('reading', [])),
            next_title=next_title,
        )
        
        fname = os.path.join(OUT, f'day-{day}.md')
        with open(fname, 'w', encoding='utf-8') as f:
            f.write(text)
        count += 1
    
    print(f'Generated {count} files.')

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print('Usage: python gen_core.py <data.json>')
        sys.exit(1)
    generate(sys.argv[1])
