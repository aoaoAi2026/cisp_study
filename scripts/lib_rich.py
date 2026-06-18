# -*- coding: utf-8 -*-
"""Rich template library for 500+ line .md generation"""
import os

OUT = os.path.dirname(os.path.abspath(__file__))

def cn(i):
    c = ['零','一','二','三','四','五','六','七','八','九','十','十一','十二','十三','十四','十五']
    return c[i] if i < len(c) else str(i)

def phase(d):
    if d <= 60: return ('第一阶段','第一阶段 · 初级蓝队夯实')
    elif d <= 90: return ('第二阶段','第二阶段 · 中级蓝队进阶')
    return ('第三阶段','第三阶段 · 高级蓝队升华')

HEADER = r"""---
day: {day}
title: {title}
phase: {phase}
difficulty: {diff}
---

# Day {day}：{title}

> **阶段**：{phase_str} | **难度**：{diff} | **预计课时**：2-3 小时

---

## 📋 今日学习目标

{goals}

---

## 📖 核心知识讲解

{intro}

"""

FOOTER = r"""

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

def gentbl(headers, rows):
    h = '| ' + ' | '.join(headers) + ' |'
    s = '|' + '|'.join([':---' for _ in headers]) + '|'
    r = '\n'.join('| ' + ' | '.join(str(c) for c in row) + ' |' for row in rows)
    return f'{h}\n{s}\n{r}\n'

def bullet(items):
    return '\n'.join(f'{i}. {t}' for i, t in enumerate(items, 1))

def clist(items):
    return '\n'.join(f'- [ ] {t}' for t in items)

def rlist(items):
    return '\n'.join(f'- {t}' for t in items)

def sec(title, body):
    return f'\n### {title}\n\n{body}\n'

def make_file(day, title, diff, goals, intro_text, sections, tasks, checklist, summary, reading, next_title=''):
    ph, phs = phase(day)
    g = bullet(goals)
    body = HEADER.format(day=day, title=title, phase=ph, diff=diff, phase_str=phs, goals=g, intro=intro_text)
    for i, (stitle, sbody) in enumerate(sections, 1):
        body += sec(f'{cn(i)}、{stitle}', sbody)
    body += FOOTER.format(
        tasks=billet(tasks), checklist=clist(checklist),
        summary=summary, reading=rlist(reading),
        next_title=next_title)
    return body

def write_file(day, title, diff, goals, intro_text, sections, tasks, checklist, summary, reading, next_title=''):
    content = make_file(day, title, diff, goals, intro_text, sections, tasks, checklist, summary, reading, next_title)
    fname = os.path.join(OUT, f'day-{day}.md')
    with open(fname, 'w', encoding='utf-8') as f:
        f.write(content)
    return len(content.splitlines())
