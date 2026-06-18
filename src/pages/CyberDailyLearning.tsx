// 网络安全学习 - 每日课程详情页
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Target,
  Wrench,
  Terminal,
  Server,
  ExternalLink,
  Clock,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Play,
  Star,
  AlertTriangle,
  Copy,
  Check,
  Award,
  User,
  AlertCircle,
  Zap,
  Code,
  TrendingUp,
  Flame,
  Trophy,
  Medal,
  RefreshCw,
  Keyboard,
  RotateCcw,
  Video,
  FileQuestion,
  Eye,
  Library,
  Shield
} from 'lucide-react';
import MilkdownEditor from '../components/MilkdownEditor';
import { Card, Badge, Button } from '../components/UI';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Editor from '@monaco-editor/react';
import type { QuizQuestion } from '../data/cyberBasic';
import { Pomodoro } from '../components/Pomodoro';
import { plans, planSupplements, planColor } from './CyberDailyLearning/constants';
import { saveData, loadData } from '../data/persistData';
import { loadAllResources } from '../data/resourceData';
import type { Resource } from '../types/resource';
import { getReadingsForDay } from '../data/dayResourceMap';
import { useQuizPractice, useWrongQuestionBook, checkQuizAnswer, useGamification, useCodeExecutor } from '../hooks';
import type { QuizAnswer } from '../hooks';

// 通过 fetch 动态加载 public/ 下的 .md 文件（Vite 不支持 glob 读取 public/）

// 提取"## ✅ 验收标准" 下的 checkbox 列表
const extractAcceptanceChecklist = (md: string): string[] => {
  const m = md.match(/##\s*✅\s*验收标准\s*\n([\s\S]*?)(?:\n##|\n---|\n*$)/);
  if (!m) return [];
  return (m[1].match(/- \[.\] (.+)/g) || []).map(s => s.replace(/- \[.\] /, '').trim()).filter(Boolean);
};

// 提取"## 🎯 蓝队面试高频题" 下的 Q&A
const extractInterviewQA = (md: string): { q: string; a: string }[] => {
  const m = md.match(/##\s*🎯\s*.*面试高频.*\n([\s\S]*?)(?:\n##\s(?!##)|\n---\n\n|\n*$)/);
  if (!m) return [];
  const qas: { q: string; a: string }[] = [];
  const qaRegex = /\*\*Q\d+[：:]\s*(.+?)\*\*\s*\n>\s*(.+?)(?=\n\n\*\*Q|\n*$)/gs;
  let qm;
  while ((qm = qaRegex.exec(m[1])) !== null) {
    qas.push({ q: qm[1].trim(), a: qm[2].replace(/\n>/g, '\n').trim() });
  }
  return qas;
};

// 提取"## 📈 学习效果自检" 下的自检问题
const extractSelfCheckQuestions = (md: string): string[] => {
  const m = md.match(/##\s*📈\s*学习效果自检\s*\n([\s\S]*?)(?:\n##|\n---|\n*$)/);
  if (!m) return [];
  return m[1].split('\n')
    .filter(l => /^\d+[\.\、]/.test(l.trim()))
    .map(l => l.replace(/^\d+[\.\、]\s*/, '').trim())
    .filter(Boolean);
};

// 提取"## 📚 延伸阅读" 中的链接
const extractExtraLinks = (md: string): { name: string; url: string; type: 'article' | 'video' | 'book' }[] => {
  const m = md.match(/##\s*📚\s*延伸阅读\s*\n([\s\S]*?)(?:\n##|\n---|\n*$)/);
  if (!m) return [];
  const links: { name: string; url: string; type: 'article' | 'video' | 'book' }[] = [];
  const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g;
  let lm;
  while ((lm = linkRegex.exec(m[1])) !== null) {
    const name = lm[1].replace(/^[-*]\s*/, '').trim();
    const url = lm[2];
    if (!links.some(l => l.url === url)) {
      links.push({ name, url, type: 'article' });
    }
  }
  return links;
};

// 提取"## 🎯 实战思维训练"场景作为实战题目
const extractScenarioTraining = (md: string): { scenario: string; layers: string[] }[] => {
  const m = md.match(/##\s*🎯\s*实战思维训练\s*\n([\s\S]*?)(?:\n##\s(?!##)|\n---\n\n|\n*$)/);
  if (!m) return [];
  const scenarios: { scenario: string; layers: string[] }[] = [];
  // 匹配"**场景：...**"段落
  const sceneRegex = /\*\*场景[：:]\s*(.+?)\*\*/g;
  let sm;
  while ((sm = sceneRegex.exec(m[1])) !== null) {
    const scenario = sm[1].trim();
    // 提取该场景后的分层思考（🛡️ 🔍 🚨 📊 开头的行）
    const rest = m[1].slice(sm.index + sm[0].length);
    const layerRegex = /[🛡️🔍🚨📊]\s*\*\*([^*]+)\*\*[：:]\s*(.+?)(?=\n\||\n\n|$)/g;
    const layers: string[] = [];
    let lm;
    while ((lm = layerRegex.exec(rest)) !== null) {
      layers.push(`${lm[1].trim()}：${lm[2].trim()}`);
    }
    if (layers.length > 0) {
      scenarios.push({ scenario, layers });
    }
  }
  return scenarios;
};

// 提取"## 🎯 实战思维训练"中的条件反射表格行
const extractConditionedResponse = (md: string): { phenomenon: string; association: string; action: string }[] => {
  const m = md.match(/##\s*🎯\s*实战思维训练\s*\n([\s\S]*?)(?:\n##\s(?!##)|\n---\n\n|\n*$)/);
  if (!m) return [];
  const rows: { phenomenon: string; association: string; action: string }[] = [];
  // 匹配表格行：| 现象 | 联想到 | 动作 |
  const rowRegex = /\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|/g;
  let rm;
  while ((rm = rowRegex.exec(m[1])) !== null) {
    const p = rm[1].trim();
    if (p === '现象' || p.startsWith(':-')) continue; // 跳过表头
    rows.push({ phenomenon: p, association: rm[2].trim(), action: rm[3].trim() });
  }
  return rows;
};

// 从 markdown 内容中提取代码块（包括无语言标记的块），供"代码实战"tab 使用
const extractCodeBlocksFromMd = (md: string): { title: string; language: string; code: string; explanation: string }[] => {
  const blocks: { title: string; language: string; code: string; explanation: string }[] = [];
  // 匹配代码块：```language（可选）\n...``` ，\w* 支持无语言标记
  const regex = /```(\w*)\s*\n([\s\S]*?)```/g;
  let match;
  while ((match = regex.exec(md)) !== null) {
    const lang = match[1] || 'plain';
    const code = match[2].trim();
    if (!code || code.length < 12) continue;
    // 判断是否像"可执行/可练习"的内容
    const codeLines = code.split('\n').length;
    const hasCodeTokens = /[=;{}()#!\/]|import |def |function |grep |curl |nmap |sudo |docker |python\d? |SELECT |INSERT |WHERE |echo |cat |ls |cd |mkdir/i.test(code);
    // 跳过纯 ASCII 图（大量 │├└ 字符）、纯文字叙述
    const isAsciiArt = (code.match(/[│├└─┌┐┘└◀▶]/g) || []).length > 3;
    const isPureNarrative = codeLines <= 3 && /^[^=;{}():#]+$/.test(code.replace(/\n/g, '')) && !hasCodeTokens;
    if (isAsciiArt || isPureNarrative) continue;
    // 确定显示语言
    const displayLang = lang === 'plain' ? (hasCodeTokens ? 'bash' : 'text') : lang;
    // 给过长代码块截断
    const displayCode = code.length > 3000 ? code.slice(0, 3000) + '\n...(已截断，完整内容见课程内容)' : code;
    // 提取该代码块前的最近一个标题作为名称
    const before = md.slice(0, match.index);
    const hMatch = before.match(/^#{2,4}\s+(.+)/gm);
    const title = hMatch ? hMatch[hMatch.length - 1].replace(/^#+\s*/, '').trim() : `${displayLang} 代码示例`;
    // 提取代码块后的说明文字
    const after = md.slice(match.index + match[0].length);
    const explMatch = after.match(/^(.{4,150}?)[。\.\n]/m);
    const explanation = explMatch ? explMatch[1].trim().replace(/^[>\s*]+\s*/, '') : `${displayLang} 代码示例`;
    blocks.push({ title, language: displayLang, code: displayCode, explanation });
    if (blocks.length >= 20) break;
  }
  return blocks;
};

// 从 .md 内容自动生成随堂测验题目，高质量、紧扣知识点
const generateMdQuizQuestions = (md: string, targetCount: number): QuizQuestion[] => {
  const questions: QuizQuestion[] = [];
  const usedQuestions = new Set<string>();

  const addQuestion = (q: QuizQuestion) => {
    // 去重
    const key = q.question.slice(0, 50);
    if (usedQuestions.has(key)) return;
    usedQuestions.add(key);
    questions.push(q);
  };

  // ===== 策略1：从「蓝队面试高频题」提取 Q&A → 单选题（最高质量）=====
  const qaRegex = /\*\*Q\d+[：:]\s*(.+?)\*\*\s*\n>\s*(.+?)(?=\n\n\*\*Q|\n*$)/gs;
  let qaMatch;
  while ((qaMatch = qaRegex.exec(md)) !== null && questions.length < targetCount) {
    const qText = qaMatch[1].trim().replace(/\*\*/g, '');
    const aText = qaMatch[2].trim().replace(/\*\*/g, '').replace(/\n>/g, '\n');
    if (qText.length < 10 || aText.length < 30) continue;

    // 从答案中提取关键句作为正确选项
    const keySentence = aText.split(/[。；\n]/).filter(s => s.trim().length > 10 && s.trim().length < 100)[0];
    if (!keySentence) continue;

    // 找干扰项：从其他 Q&A 的答案中取
    const otherAnswers: string[] = [];
    const qaRegex2 = /\*\*Q\d+[：:]\s*(.+?)\*\*\s*\n>\s*(.+?)(?=\n\n\*\*Q|\n*$)/gs;
    let qa2;
    while ((qa2 = qaRegex2.exec(md)) !== null && otherAnswers.length < 4) {
      if (qa2[1].trim() === qaMatch[1].trim()) continue;
      const otherSent = qa2[2].trim().replace(/\*\*/g, '').replace(/\n>/g, '\n').split(/[。；\n]/).filter(s => s.trim().length > 10 && s.trim().length < 100)[0];
      if (otherSent && !otherAnswers.includes(otherSent)) otherAnswers.push(otherSent);
    }

    // 如果干扰项不够，从正文提取句子
    if (otherAnswers.length < 2) {
      const bodySentences = md.replace(/#{1,4}\s+.+/g, '').replace(/\*\*/g, '').split(/[。\n]/).filter(s => {
        const t = s.trim();
        return t.length > 15 && t.length < 80 && !t.includes('|') && !t.includes('```') && !t.startsWith('#') && !t.startsWith('>') && t !== keySentence.trim();
      });
      for (const s of bodySentences) {
        if (otherAnswers.length >= 3) break;
        const t = s.trim();
        if (t && !otherAnswers.includes(t)) otherAnswers.push(t);
      }
    }

    if (otherAnswers.length < 2) continue;

    // 打乱选项顺序
    const allOptions = [keySentence.trim(), ...otherAnswers.slice(0, 3)];
    const shuffled = allOptions.map((opt, i) => ({ opt, origIdx: i })).sort(() => Math.random() - 0.5);
    const correctIdx = shuffled.findIndex(s => s.origIdx === 0);

    addQuestion({
      id: `mdgen_qa_${questions.length}`,
      type: 'single',
      question: qText,
      options: shuffled.map(s => s.opt),
      correctIndex: correctIdx,
      explanation: aText.slice(0, 200).trim(),
    });
  }

  // ===== 策略2：从「新手常见误区纠正」提取 → 判断题（高质量）=====
  const misconceptionRegex = /\d+\.\s*\*\*误区\*\*[：:]\s*["""]?(.+?)["""]?\s*\n\s*-\s*\*\*真相\*\*[：:]\s*(.+?)(?=\n\n|\n*$)/g;
  let misMatch;
  while ((misMatch = misconceptionRegex.exec(md)) !== null && questions.length < targetCount) {
    const myth = misMatch[1].trim().replace(/\*\*/g, '');
    const truth = misMatch[2].trim().replace(/\*\*/g, '').split(/\n/)[0].trim();
    if (myth.length < 10 || truth.length < 20) continue;

    addQuestion({
      id: `mdgen_mis_${questions.length}`,
      type: 'boolean',
      question: myth,
      options: ['正确', '错误'],
      correctIndex: 1, // 误区是错误说法
      explanation: truth,
    });
  }

  // ===== 策略3：从表格提取关键事实 → 单选题/填空题 =====
  const tableRegex = /\|(.+)\|\n\|[-| :]+\|\n((?:\|.+\|\n?)+)/g;
  let tableMatch;
  while ((tableMatch = tableRegex.exec(md)) !== null && questions.length < targetCount) {
    const headerRow = tableMatch[1];
    const bodyRows = tableMatch[2];
    const headers = headerRow.split('|').map(h => h.trim()).filter(Boolean);
    const rows = bodyRows.split('\n').filter(r => r.trim().startsWith('|'))
      .map(r => r.split('|').map(c => c.trim()).filter(Boolean));

    if (headers.length < 2 || rows.length < 2) continue;

    // 找到适合出题的列（避免代码/链接列）
    const goodCols = headers.map((h, i) => ({ h, i })).filter(c =>
      !c.h.includes('--') && !c.h.includes('```') && c.h.length > 0 &&
      rows.every(r => r[c.i] && r[c.i].length > 1 && !r[c.i].includes('```') && !r[c.i].includes('http'))
    );
    if (goodCols.length < 2) continue;

    // 单选题：给一个值，问对应的另一个属性
    const qCol = goodCols[0];
    const aCol = goodCols[goodCols.length > 1 ? 1 : 0];
    if (qCol.i === aCol.i) continue;

    const pickedRow = rows[Math.floor(Math.random() * Math.min(rows.length, 6))];
    const qVal = pickedRow[qCol.i].replace(/\*\*/g, '');
    const aVal = pickedRow[aCol.i].replace(/\*\*/g, '');

    if (qVal.length < 2 || aVal.length < 3) continue;

    // 干扰项：同一列的其他值
    const distractors = rows.filter(r => r !== pickedRow).map(r => r[aCol.i].replace(/\*\*/g, '')).filter(v => v && v !== aVal).slice(0, 3);
    if (distractors.length < 2) continue;

    const opts = [aVal, ...distractors].sort(() => Math.random() - 0.5);
    const correctI = opts.indexOf(aVal);

    addQuestion({
      id: `mdgen_tbl_${questions.length}`,
      type: 'single',
      question: `关于「${headers[qCol.i]}」，${qVal} 对应的${headers[aCol.i]}是什么？`,
      options: opts,
      correctIndex: correctI,
      explanation: `${qVal} 的${headers[aCol.i]}是：${aVal}。`,
    });
  }

  // ===== 策略4：从关键概念段提取 → 精炼填空题 =====
  if (questions.length < targetCount) {
    // 找「核心术语词典」类表格或列表中的定义
    const defPatterns = [
      /\|\s*\d+\s*\|\s*\*\*(.+?)\*\*\s*\|(.+?)\|/g, // 术语表格
      /\*\*(SOC|SIEM|IOC|WAF|IDS|IPS|C2|ATT&CK|MTTD|MTTR|PDCERF|Webshell|EDR|DLP|SOAR)\*\*[：:]*\s*(.+?)(?=[\n\*])/g,
    ];

    let defMatch;
    const defRegex = defPatterns[0];
    const usedDefs = new Set<string>();
    while ((defMatch = defRegex.exec(md)) !== null && questions.length < targetCount) {
      const term = defMatch[1].trim();
      const def = defMatch[2].trim().replace(/\*\*/g, '').slice(0, 80);
      if (term.length < 2 || def.length < 8 || usedDefs.has(term)) continue;
      usedDefs.add(term);

      addQuestion({
        id: `mdgen_def_${questions.length}`,
        type: 'fill',
        question: `____ 是${def}`,
        correctAnswer: term,
        explanation: `${term} 是${def}`,
      });
    }
  }

  // ===== 策略5：从验收标准/自检问题生成题目 =====
  if (questions.length < targetCount) {
    const checkItems = md.match(/-\s*\[.\]\s*(.+)/g);
    if (checkItems) {
      const items = checkItems.map(c => c.replace(/-\s*\[.\]\s*/, '').trim()).filter(c => c.length > 10);
      for (let i = 0; i < Math.min(items.length, targetCount - questions.length); i++) {
        const item = items[i];
        // 根据本节验收标准生成判断题
        addQuestion({
          id: `mdgen_chk_${questions.length}`,
          type: 'boolean',
          question: `根据本节学习内容，"${item.slice(0, 50)}${item.length > 50 ? '...' : ''}" 是该节要求掌握的知识点。`,
          options: ['正确', '错误'],
          correctIndex: 0,
          explanation: `这是本节明确列出的验收标准/自检项，应当掌握。`,
        });
      }
    }
  }

  return questions;
};

export const CyberDailyLearning: React.FC = () => {
  const { planId } = useParams<{ planId: string }>();
  const navigate = useNavigate();

  // 护网轨道切换：120天完整 vs 28天速成
  const [hwTrack, setHwTrack] = useState<'full' | 'express'>('full');

  const plan = useMemo(() => {
    if (!planId) return null;
    if (planId === 'hw' && hwTrack === 'express') {
      return plans['hw-express'] || null;
    }
    return plans[planId] || null;
  }, [planId, hwTrack]);

  const effectiveTotalDays = plan?.totalDays ?? 120;
  const [currentDay, setCurrentDay] = useState(1);

  // 切换轨道时 clamp 当前天数到有效范围
  useEffect(() => {
    setCurrentDay(d => Math.max(1, Math.min(d, effectiveTotalDays)));
  }, [effectiveTotalDays]);
  const [completedDays, setCompletedDays] = useState<Set<number>>(new Set());
  const [expanded, setExpanded] = useState<string | null>('content');
  const [note, setNote] = useState('');
  const [noteSavedAt, setNoteSavedAt] = useState<number | null>(null);
  const [noteReady, setNoteReady] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [mdContent, setMdContent] = useState<string | null>(null);
  const [mdLoading, setMdLoading] = useState(false);
  const [, setMdError] = useState<string | null>(null);
  const saveTimer = React.useRef<number | null>(null);

  // Gamification (共享hook，按 planId 隔离数据)
  const gamify = useGamification({ storageKey: 'cisp_cyber_gamify', subKey: planId });
  const { xp, userLevel, streakHeatmap, quizAvg, showLevelUp, setShowLevelUp, showConfetti, addXp, bumpHeatmap } = gamify;

  // Code editor states
  const [editorCode, setEditorCode] = useState('');
  const [editorLang, setEditorLang] = useState('python');
  const { codeOutput, setCodeOutput, codeRunning, execute: executeCode } = useCodeExecutor();

  // Coding exercise states
  const [exerciseAnswer, setExerciseAnswer] = useState('');
  const [exerciseResult, setExerciseResult] = useState<'correct'|'wrong'|null>(null);

  // Interview Q&A expand state (随堂测验tab中的面试高频题展开)
  const [expandedQA, setExpandedQA] = useState<Set<number>>(new Set());

  // Stats panel visibility
  const [showStats, setShowStats] = useState(true);

  // Tab navigation
  const [activeTab, setActiveTab] = useState<'content' | 'video' | 'code' | 'readings' | 'quiz' | 'expert'>('content');

  // 课内读物
  const [readings, setReadings] = useState<Resource[]>([]);
  const [readingsLoading, setReadingsLoading] = useState(false);

  // Bilibili video
  const [bilibiliBvid, setBilibiliBvid] = useState<string | null>(null);
  const [bilibiliVideoTitle, setBilibiliVideoTitle] = useState<string>('');
  const [videoLoading, setVideoLoading] = useState(false);

  // Quiz timer
  const [quizTimer, setQuizTimer] = useState(30);
  const [quizTimerRunning, setQuizTimerRunning] = useState(false);
  const quizTimerRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  // 随堂测验：全部展开模式
  const [quizFullyExpanded, setQuizFullyExpanded] = useState(false);
  // 展开模式下每道题的独立状态
  const [expandedAnswers, setExpandedAnswers] = useState<Record<number, QuizAnswer>>({});
  const [expandedShowAnswer, setExpandedShowAnswer] = useState<Record<number, boolean>>({});

  // 测验和错题本 hooks —— 合并 supplement 中提取的结构化数据
  const day = useMemo(() => {
    const d = plan?.days.find(d => d.day === currentDay);
    if (!d) return undefined;
    
    const planSuppl = planId ? planSupplements[planId] : undefined;
    const s = planSuppl ? planSuppl[d.day] : undefined;
    
    if (!s) return d;
    
    // 合并策略：将补充的quiz追加到已有quiz后面，补充的codeExamples追加到已有codeExamples后面
    const mergedQuiz = [
      ...(d.quiz || []),
      ...(s.quiz || [])
    ];
    
    const mergedCodeExamples = [
      ...(d.codeExamples || []),
      ...(s.codeExamples || [])
    ];
    
    return {
      ...d,
      quiz: mergedQuiz.length > 0 ? mergedQuiz : d.quiz,
      codeExamples: mergedCodeExamples.length > 0 ? mergedCodeExamples : d.codeExamples,
      // resources和recommendedTools仍用fallback策略（优先使用day自身的）
      resources: (d.resources && d.resources.length > 0) ? d.resources : (s.resources as any),
      recommendedTools: (d.recommendedTools && d.recommendedTools.length > 0) ? d.recommendedTools : (s.recommendedTools as any),
    };
  }, [plan, currentDay, planId]);

  // 从加载的 .md 内容中提取代码块，当结构化 codeExamples 为空时作为 fallback
  const effectiveCodeExamples = useMemo(() => {
    if (day?.codeExamples && day.codeExamples.length > 0) return day.codeExamples;
    if (!mdContent) return [];
    return extractCodeBlocksFromMd(mdContent);
  }, [day?.codeExamples, mdContent]);

  // 从 .md 文件提取结构化内容，填充到随堂测验和学习资源区域
  const extractedFromMd = useMemo(() => {
    if (!mdContent) return { acceptanceChecklist: [] as string[], interviewQA: [] as { q: string; a: string }[], selfCheckQuestions: [] as string[], extraLinks: [] as { name: string; url: string; type: 'article' | 'video' | 'book' }[], scenarioTraining: [] as { scenario: string; layers: string[] }[], conditionedResponse: [] as { phenomenon: string; association: string; action: string }[] };
    return {
      acceptanceChecklist: extractAcceptanceChecklist(mdContent),
      interviewQA: extractInterviewQA(mdContent),
      selfCheckQuestions: extractSelfCheckQuestions(mdContent),
      extraLinks: extractExtraLinks(mdContent),
      scenarioTraining: extractScenarioTraining(mdContent),
      conditionedResponse: extractConditionedResponse(mdContent),
    };
  }, [mdContent]);

  // 合并 day.resources 与从 md 中提取的延伸阅读链接
  const effectiveResources = useMemo(() => {
    const base = day?.resources || [];
    const extras = extractedFromMd.extraLinks.filter(el => !base.some(b => b.url === el.url));
    return [...base, ...extras];
  }, [day?.resources, extractedFromMd.extraLinks]);

  const wrongQuestionBook = useWrongQuestionBook();

  // 天切换标识：用于快照错题本，避免 session 中动态变化
  const dayKey = useMemo(() => `${planId}_${currentDay}`, [planId, currentDay]);
  const prevDayKey = React.useRef(dayKey);
  const wrongBookSnapshot = React.useRef<typeof wrongQuestionBook.entries>([]);
  if (prevDayKey.current !== dayKey) {
    prevDayKey.current = dayKey;
    wrongBookSnapshot.current = [...wrongQuestionBook.entries];
  }

  // 构建合并题库：当天题 + 错题本待复习 + 自动生成题（保证≥20题）
  const { allQuizQuestions, quizKeyMap, wrongBookCount, mdGenCount } = useMemo(() => {
    const baseQuiz: QuizQuestion[] = [];
    const keyMap: string[] = []; // quizKeyMap[i] = 题目来源 key

    // 1. 当天原始题目
    const dayQuiz = day?.quiz || [];
    dayQuiz.forEach((q, i) => {
      const id = `${planId}_${currentDay}_q${i}`;
      baseQuiz.push({ ...q, id: id || q.id });
      keyMap.push(id);
    });

    // 2. 错题本中尚未释放的题（使用快照避免 session 中动态变化），最多10道错题
    const MAX_WRONG_INLINE = 10;
    let wbCount = 0;
    wrongBookSnapshot.current.forEach(entry => {
      if (entry.consecutiveCorrect < 3 && wbCount < MAX_WRONG_INLINE) {
        const entryKey = entry.key;
        if (!keyMap.includes(entryKey)) {
          baseQuiz.push({ ...entry.question, id: entryKey });
          keyMap.push(entryKey);
          wbCount++;
        }
      }
    });

    // 3. 自动生成题 补齐到最少 20 题，总上限 30 题
    const MIN_QUIZ = 20;
    const MAX_QUIZ = 30;
    const needed = Math.max(0, MIN_QUIZ - baseQuiz.length);
    const maxGen = Math.max(0, MAX_QUIZ - baseQuiz.length);
    let genCount = 0;
    const genTarget = Math.min(needed, maxGen);
    if (genTarget > 0 && mdContent) {
      const generated = generateMdQuizQuestions(mdContent, genTarget);
      generated.forEach(q => {
        const gid = `mdgen_${planId}_${currentDay}_g${genCount}`;
        baseQuiz.push({ ...q, id: gid });
        keyMap.push(gid);
        genCount++;
      });
    }

    return { allQuizQuestions: baseQuiz, quizKeyMap: keyMap, wrongBookCount: wbCount, mdGenCount: genCount };
  }, [day?.quiz, planId, currentDay, mdContent]);

  const quiz = useQuizPractice(allQuizQuestions);

  // 切换天时重置测验和定时器
  const resetQuiz = useCallback(() => {
    quiz.reset();
    setQuizTimer(30);
    setQuizTimerRunning(false);
    if (quizTimerRef.current) { clearInterval(quizTimerRef.current); quizTimerRef.current = null; }
    setExpandedAnswers({});
    setExpandedShowAnswer({});
  }, [quiz.reset]);
  useEffect(() => {
    resetQuiz();
    setEditorCode('');
    setCodeOutput('');
    setExerciseAnswer('');
    setExerciseResult(null);
  }, [resetQuiz]);

  // Gamification 加载 —— 已迁移到 useGamification hook

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'ArrowLeft') { e.preventDefault(); setCurrentDay(Math.max(1, currentDay - 1)); }
      if (e.key === 'ArrowRight') { e.preventDefault(); if (currentDay < (plan?.totalDays || 1)) setCurrentDay(currentDay + 1); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [currentDay, plan?.totalDays]);

  // Bilibili 视频搜索
  useEffect(() => {
    if (activeTab !== 'video' || !day) return;
    setVideoLoading(true);
    setBilibiliBvid(null);
    const keyword = encodeURIComponent(day.title + ' 网络安全 CISP');
    fetch(`/api-bili/x/web-interface/search/type?search_type=video&keyword=${keyword}&page=1`)
      .then(res => res.json())
      .then(data => {
        if (data?.data?.result?.length > 0) {
          const first = data.data.result[0];
          setBilibiliBvid(first.bvid);
          setBilibiliVideoTitle(first.title || '');
        }
      })
      .catch(() => {})
      .finally(() => setVideoLoading(false));
  }, [activeTab, day?.title]);

  // 代码执行 —— 已迁移到 useCodeExecutor hook
  const handleRunCode = async (code: string, lang: string) => {
    await executeCode(code, lang);
    addXp(5);
  };

  // addXp —— 已迁移到 useGamification hook

  useEffect(() => {
    if (!planId) return;
    async function load() {
      const data = await loadData<any>('cisp_cyber_progress', {});
      if (data[planId]?.completedDays) {
        setCompletedDays(new Set(data[planId].completedDays));
      }
    }
    load();
  }, [planId]);

  useEffect(() => {
    if (!planId) return;
    setNote('');
    setNoteReady(false);
    setNoteSavedAt(null);
    async function load() {
      const noteKey = `cyber_${planId}_${currentDay}`;
      const raw = await loadData<string>(noteKey, '');
      if (raw) { setNote(raw); setNoteSavedAt(Date.now()); } else { setNote(''); setNoteSavedAt(null); }
      setNoteReady(true);
    }
    load();
  }, [planId, currentDay]);

  // 通过 fetch 动态加载 public/contents/cyber-learning/ 下的 .md 文件
  // 速成轨道使用 hw-express 目录，完整轨道使用 hw 目录
  const fetchPlanId = React.useMemo(() => {
    if (planId === 'hw' && hwTrack === 'express') return 'hw-express';
    return planId;
  }, [planId, hwTrack]);

  useEffect(() => {
    if (!planId || !fetchPlanId) return;
    setMdLoading(true);
    setMdError(null);
    fetch(`/contents/cyber-learning/${fetchPlanId}/day-${currentDay}.md`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
      })
      .then(text => {
        setMdContent(text);
        setMdError(null);
      })
      .catch(() => {
        // 文件不存在时静默 fallback 到 day.content
        setMdContent(null);
        setMdError(null);
      })
      .finally(() => setMdLoading(false));
  }, [fetchPlanId, currentDay]);

  // 课内读物：按当天课程精确匹配
  useEffect(() => {
    if (!planId || !currentDay) return;
    setReadingsLoading(true);
    const ids = getReadingsForDay('cyber', planId, currentDay);
    if (ids.length === 0) {
      setReadings([]);
      setReadingsLoading(false);
      return;
    }
    loadAllResources().then(all => {
      const resourceMap = new Map(all.map(r => [r.id, r]));
      const matched = ids.map(id => resourceMap.get(id)).filter(Boolean) as Resource[];
      setReadings(matched);
      setReadingsLoading(false);
    });
  }, [planId, currentDay]);

  const handleNoteChange = (val: string) => {
    setNote(val);
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(async () => {
      if (!planId) return;
      const noteKey = `cyber_${planId}_${currentDay}`;
      await saveData(noteKey, val);
      setNoteSavedAt(Date.now());
    }, 800);
  };

  // Quiz timer effect
  useEffect(() => {
    if (quizTimerRunning && quizTimer > 0) {
      quizTimerRef.current = setInterval(() => {
        setQuizTimer(prev => {
          if (prev <= 1) {
            if (quizTimerRef.current) { clearInterval(quizTimerRef.current); quizTimerRef.current = null; }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (quizTimerRef.current) { clearInterval(quizTimerRef.current); quizTimerRef.current = null; } };
  }, [quizTimerRunning]);

  // Start timer when quiz question appears and answer not yet shown
  useEffect(() => {
    if (!quiz.showAnswer && allQuizQuestions.length > 0) {
      setQuizTimer(30);
      setQuizTimerRunning(true);
    } else if (quiz.showAnswer) {
      setQuizTimerRunning(false);
    }
  }, [quiz.currentIndex, quiz.showAnswer, allQuizQuestions.length]);

  const handleQuizAnswer = (answer: number | number[] | string) => {
    if (quiz.showAnswer) return;
    setQuizTimerRunning(false);
    const isCorrect = quiz.answerOne(answer);
    const idx = quiz.currentIndex;
    const qKey = quizKeyMap[idx] || `${planId}_${currentDay}_q${idx}`;
    const question = allQuizQuestions[idx];
    if (question) {
      wrongQuestionBook.recordAnswer(qKey, question, planId!, currentDay, idx, isCorrect);
    }
  };

  const handleMultipleSelect = (index: number) => {
    quiz.toggleMultiple(index);
  };

  const nextQuestion = () => {
    if (quiz.isLastQuestion) {
      markComplete();
    } else {
      quiz.nextQuestion();
    }
  };

  const markComplete = async () => {
    if (!planId) return;
    const newSet = new Set(completedDays);
    if (newSet.has(currentDay)) { newSet.delete(currentDay); } else { newSet.add(currentDay); addXp(50); }
    setCompletedDays(newSet);
    bumpHeatmap();
    const data = await loadData<any>('cisp_cyber_progress', {});
    data[planId] = { ...data[planId], completedDays: Array.from(newSet) };
    await saveData('cisp_cyber_progress', data);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedCmd(id);
      setTimeout(() => setCopiedCmd(null), 2000);
    });
  };

  if (!plan) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertTriangle size={48} className="text-cyber-gold mb-4" />
        <h2 className="font-orbitron text-xl text-white mb-2">学习计划不存在</h2>
        <Button onClick={() => navigate('/cyber-learning')}>返回学习中心</Button>
      </div>
    );
  }

  const color = planColor(planId!);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/cyber-learning')}
            className="p-2 rounded-lg border border-cyber-purple/30 hover:bg-cyber-purple/20 transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-400" />
          </button>
          <div>
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <span className={`font-orbitron text-xl font-bold ${color.main}`}>
                {plan.icon} {plan.name}
              </span>
              <Badge
                className={planId === 'basic' ? 'bg-cyber-green/20 text-cyber-green' :
                           planId === 'penetration' ? 'bg-cyber-red/20 text-cyber-red' :
                           planId === 'ai' ? 'bg-[#6b5b95]/25 text-gray-200 border border-[#6b5b95]/30' :
                           'bg-cyber-blue/20 text-cyber-blue'}
              >
                第{currentDay}天
              </Badge>
              {/* 护网轨道切换：120天完整 / 28天速成 */}
              {planId === 'hw' && (
                <div className="flex rounded-lg border border-cyber-gold/30 overflow-hidden">
                  <button
                    onClick={() => setHwTrack('full')}
                    className={`px-3 py-1 text-xs font-medium transition-colors ${
                      hwTrack === 'full'
                        ? 'bg-cyber-gold text-black'
                        : 'bg-transparent text-gray-400 hover:text-cyber-gold'
                    }`}
                  >
                    🛡️ 120天完整
                  </button>
                  <button
                    onClick={() => setHwTrack('express')}
                    className={`px-3 py-1 text-xs font-medium transition-colors ${
                      hwTrack === 'express'
                        ? 'bg-cyber-gold text-black'
                        : 'bg-transparent text-gray-400 hover:text-cyber-gold'
                    }`}
                  >
                    ⚡ 28天速成
                  </button>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-400">{plan.description}</p>
          </div>
        </div>
        <Button
          onClick={markComplete}
          variant={completedDays.has(currentDay) ? 'outline' : 'primary'}
          colorScheme={planId}
          className={completedDays.has(currentDay) ? `${color.border} ${color.textColor}` : ''}
        >
          {completedDays.has(currentDay) ? (
            <><CheckCircle size={16} /> 已完成</>
          ) : (
            <><Star size={16} /> 完成今日学习</>
          )}
        </Button>
      </motion.div>

      {/* Day Navigation */}
      <motion.div variants={itemVariants}>
        <Card className={color.cardBorder}>
          <div className="flex items-center gap-4 overflow-x-auto pb-2">
            {[...plan.days].sort((a, b) => a.day - b.day).map((d) => (
              <button
                key={d.day}
                onClick={() => { setCurrentDay(d.day); }}
                className={`
                  flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium
                  transition-all duration-200
                  ${currentDay === d.day
                    ? `${color.bgLight} ${color.main} border ${color.borderFaint}`
                    : completedDays.has(d.day)
                      ? 'bg-cyber-green/10 text-cyber-green border border-cyber-green/20'
                      : 'bg-cyber-purple/10 text-gray-400 border border-cyber-purple/20 hover:bg-cyber-purple/20'
                  }
                `}
              >
                {completedDays.has(d.day) ? <CheckCircle size={16} /> : d.day}
              </button>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Gamification Stats Panel */}
      <motion.div variants={itemVariants}>
        <Card className={`${color.cardBorder} overflow-hidden`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className={`text-sm font-medium ${color.main} flex items-center gap-2`}>
              <TrendingUp size={16} /> 学习统计
            </h3>
            <button onClick={() => setShowStats(!showStats)}
              className="text-xs text-gray-500 hover:text-white transition">
              {showStats ? '收起' : '展开'}
            </button>
          </div>
          {showStats && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {/* XP Bar */}
              <div className="p-3 rounded-lg bg-cyber-purple/10 text-center">
                <Zap size={20} className="mx-auto mb-1 text-cyber-gold" />
                <p className="text-lg font-bold text-white">{xp}</p>
                <p className="text-xs text-gray-400">经验值 XP</p>
                <div className="w-full h-1.5 bg-gray-700 rounded-full mt-1">
                  <div className="h-full bg-cyber-gold rounded-full" style={{width:`${(xp%500)/5}%`}}/>
                </div>
              </div>
              {/* Level */}
              <div className="p-3 rounded-lg bg-cyber-purple/10 text-center">
                <Trophy size={20} className="mx-auto mb-1 text-cyber-gold" />
                <p className="text-lg font-bold text-white">Lv.{userLevel}</p>
                <p className="text-xs text-gray-400">当前等级</p>
              </div>
              {/* Streak */}
              <div className="p-3 rounded-lg bg-cyber-purple/10 text-center">
                <Flame size={20} className="mx-auto mb-1 text-cyber-red" />
                <p className="text-lg font-bold text-white">{completedDays.size}</p>
                <p className="text-xs text-gray-400">完成天数</p>
              </div>
              {/* Quiz Average */}
              <div className="p-3 rounded-lg bg-cyber-purple/10 text-center">
                <Target size={20} className="mx-auto mb-1 text-cyber-blue" />
                <p className="text-lg font-bold text-white">{quizAvg}%</p>
                <p className="text-xs text-gray-400">测验均分</p>
              </div>
              {/* Badges */}
              <div className="p-3 rounded-lg bg-cyber-purple/10 text-center">
                <Medal size={20} className="mx-auto mb-1 text-cyber-purple" />
                <p className="text-lg font-bold text-white">{Math.floor(xp/100)}</p>
                <p className="text-xs text-gray-400">徽章数</p>
              </div>
            </div>
          )}
          {/* Heatmap */}
          {showStats && (
            <div className="mt-3 flex items-center gap-1 justify-center">
              <span className="text-xs text-gray-500 mr-2">本周:</span>
              {streakHeatmap.map((val, i) => (
                <div key={i}
                  className={`w-6 h-6 rounded text-xs flex items-center justify-center ${
                    val > 3 ? 'bg-green-500 text-white' :
                    val > 1 ? 'bg-green-500/60 text-white' :
                    val > 0 ? 'bg-green-500/30 text-gray-300' :
                    'bg-gray-700 text-gray-500'
                  }`}
                  title={`${val} 次学习`}>
                  {['一','二','三','四','五','六','日'][i]}
                </div>
              ))}
            </div>
          )}
        </Card>
      </motion.div>

      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {Array.from({length:30}).map((_,i) => (
            <motion.div key={i}
              initial={{opacity:1,y:-50,x:Math.random()*window.innerWidth}}
              animate={{opacity:0,y:window.innerHeight+50,x:Math.random()*window.innerWidth}}
              transition={{duration:1.5+Math.random(),delay:Math.random()*0.5}}
              className="absolute w-2 h-2 rounded-full"
              style={{background:['#ffd700','#ff4444','#44ff88','#44aaff','#ff44ff'][i%5]}}/>
          ))}
        </div>
      )}

      {/* Level Up Modal */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setShowLevelUp(false)}>
            <motion.div initial={{scale:0.5}} animate={{scale:1}} exit={{scale:0.5}}
              className="bg-slate-900 border border-cyber-gold/30 rounded-2xl p-8 text-center max-w-sm mx-4" onClick={e=>e.stopPropagation()}>
              <Trophy size={64} className="mx-auto mb-4 text-cyber-gold" />
              <h2 className="font-orbitron text-2xl text-cyber-gold mb-2">🎉 升级了！</h2>
              <p className="text-white text-lg mb-1">恭喜达到 <span className="text-cyber-gold font-bold">Level {userLevel}</span></p>
              <p className="text-gray-400 text-sm mb-4">继续努力学习，解锁更多成就！</p>
              <Button onClick={() => setShowLevelUp(false)} className="!bg-yellow-500 !text-black hover:!bg-yellow-400">
                太棒了！
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      {day && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* 课程标题 */}
          <motion.div variants={itemVariants}>
            <Card>
              <h2 className="font-orbitron text-xl font-bold text-white mb-1">
                {day.title}
              </h2>
              <p className="text-sm text-gray-500 mb-4">{day.subtitle}</p>

              {/* 学习目标 */}
              <div className="mb-4">
                <h3 className={`text-sm font-medium ${color.main} mb-2 flex items-center gap-2`}>
                  <Target size={16} />
                  学习目标
                </h3>
                <div className="space-y-1">
                  {day.objectives.map((obj, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <span className={`${color.main} mt-0.5`}>▸</span>
                      <span>{obj}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 核心要点 */}
              <div className="bg-cyber-purple/5 rounded-lg p-4">
                <h3 className={`text-sm font-medium ${color.main} mb-3 flex items-center gap-2`}>
                  <BookOpen size={16} />
                  核心知识点
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {day.keyPoints.map((kp, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <span className="text-cyber-purple mt-0.5">★</span>
                      <span>{kp}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Tabs */}
          <motion.div variants={itemVariants} className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-2 min-w-max">
              {[
                { id: 'content', label: '课程内容', icon: BookOpen },
                { id: 'video', label: '视频教程', icon: Video },
                { id: 'code', label: '代码实战', icon: Code },
                { id: 'readings', label: '课内读物', icon: Library },
                { id: 'quiz', label: '随堂测验', icon: FileQuestion },
                { id: 'expert', label: '大神笔记', icon: Award },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all text-sm whitespace-nowrap
                    ${activeTab === tab.id
                      ? color.tabActive
                      : 'text-gray-400 hover:text-white hover:bg-cyber-purple/40'
                    }`}
                >
                  <tab.icon size={16} />
                  {tab.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* ===== Tab: 课程内容 ===== */}
          {activeTab === 'content' && (
            <>

          {/* 课程大纲（可折叠章节树） */}
          <motion.div variants={itemVariants}>
            <Card>
              <button
                onClick={() => setExpanded(expanded === 'outline' ? null : 'outline')}
                className="flex items-center justify-between w-full mb-2"
              >
                <h3 className={`text-sm font-medium ${color.main} flex items-center gap-2`}>
                  <BookOpen size={16} />
                  课程大纲
                </h3>
                {expanded === 'outline' ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
              </button>
              {expanded === 'outline' && (
                <div className="space-y-2 mt-3 border-l-2 border-cyber-purple/30 pl-4">
                  {(() => {
                    const content = mdContent || day.content;
                    const lines = content.split(/\n/);
                    const outline: { level: number; title: string; }[] = [];
                    lines.forEach(line => {
                      const m = line.match(/^(#{2,4})\s+(.+)/);
                      if (m) {
                        outline.push({ level: m[1].length, title: m[2].replace(/[*#]+/g, '').trim() });
                      }
                    });
                    if (outline.length === 0) {
                      // Fallback: use objectives as outline
                      day.objectives.forEach(obj => outline.push({ level: 2, title: obj }));
                    }
                    return outline.map((item, i) => (
                      <div key={i} className="flex items-start gap-2 group cursor-pointer hover:text-cyber-green transition-colors"
                        onClick={() => {
                          setExpanded('content');
                          setTimeout(() => {
                            const el = document.querySelector(`[data-heading="${CSS.escape(item.title)}"]`);
                            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }, 100);
                        }}>
                        <span className="text-cyber-purple mt-0.5 text-xs">
                          {item.level === 2 ? '●' : item.level === 3 ? '○' : '·'}
                        </span>
                        <span className={`text-sm ${item.level === 2 ? 'text-gray-200 font-medium' : item.level === 3 ? 'text-gray-400' : 'text-gray-500'}`}
                          style={{ paddingLeft: (item.level - 2) * 16 }}>
                          {item.title}
                        </span>
                      </div>
                    ));
                  })()}
                </div>
              )}
              {expanded !== 'outline' && (
                <div className="text-xs text-gray-500 italic">点击展开查看课程大纲</div>
              )}
            </Card>
          </motion.div>

          {/* 课程内容 */}
          <motion.div variants={itemVariants}>
            <Card>
              <button
                onClick={() => setExpanded(expanded === 'content' ? null : 'content')}
                className="flex items-center justify-between w-full mb-3"
              >
                <h3 className={`text-sm font-medium ${color.main} flex items-center gap-2`}>
                  <BookOpen size={16} />
                  课程内容
                </h3>
                {expanded === 'content' ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
              </button>
              {expanded === 'content' && (
                <div className="prose prose-invert prose-sm max-w-none text-gray-300 leading-relaxed">
                  {mdLoading && (
                    <div className="text-sm text-gray-400 italic">正在加载课程内容...</div>
                  )}
                  {!mdLoading && mdContent && (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{mdContent}</ReactMarkdown>
                  )}
                  {!mdLoading && !mdContent && (
                    <div
                      className="prose prose-invert prose-sm max-w-none text-gray-300 whitespace-pre-wrap leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: day.content.replace(/\n/g, '<br/>').replace(/### /g, '<h4 class="text-cyber-purple font-medium mt-3 mb-2">').replace(/## /g, '<h3 class="text-white font-medium mt-4 mb-2">').replace(/\*\*(.*?)\*\*/g, '<strong class="text-cyber-green">$1</strong>').replace(/`([^`]+)`/g, '<code class="bg-cyber-purple/20 text-cyber-green px-1 py-0.5 rounded text-xs">$1</code>').replace(/```[\s\S]*?```/g, (m) => '<pre class="bg-cyber-black/50 border border-cyber-purple/20 rounded p-3 text-xs overflow-x-auto my-2"><code>' + m.replace(/```\w*\n?/g, '').replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</code></pre>') }}
                    />
                  )}
                </div>
              )}
              {expanded !== 'content' && (
                <div className="text-xs text-gray-500 italic">点击展开查看课程内容</div>
              )}
            </Card>
          </motion.div>
            </>
          )}

          {/* ===== Tab: 视频教程 ===== */}
          {activeTab === 'video' && (
            <div className="space-y-4">
              <motion.div variants={itemVariants}>
                <Card>
                  <div className="flex items-center gap-2 mb-4">
                    <Video size={18} className={color.main} />
                    <span className={`font-medium ${color.main}`}>视频教程</span>
                    <span className="text-xs text-gray-500">Day {currentDay} · {day.title}</span>
                  </div>

                  {videoLoading && (
                    <div className="relative w-full rounded-lg bg-gray-800/40 border border-gray-700/30" style={{ paddingBottom: '56.25%' }}>
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400 gap-2">
                        <RefreshCw size={20} className="animate-spin" />
                        <span>正在 Bilibili 搜索相关视频...</span>
                      </div>
                    </div>
                  )}
                  {bilibiliBvid && !videoLoading && (
                    <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                      <iframe
                        src={`https://player.bilibili.com/player.html?bvid=${bilibiliBvid}&page=1&high_quality=1&autoplay=0`}
                        className="absolute inset-0 w-full h-full rounded-lg border border-gray-700/30"
                        allowFullScreen
                        title={bilibiliVideoTitle || `Day ${currentDay} 视频教程`}
                      />
                    </div>
                  )}
                  {!bilibiliBvid && !videoLoading && (
                    <div className="relative w-full rounded-lg bg-gray-800/30 border border-gray-700/30" style={{ paddingBottom: '56.25%' }}>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 gap-3">
                        <Play size={36} className="text-gray-600" />
                        <span className="text-sm">暂未找到匹配视频，请使用下方搜索</span>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <a
                      href={`https://search.bilibili.com/all?keyword=${encodeURIComponent(day.title + ' 网络安全')}&order=click`}
                      target="_blank" rel="noopener noreferrer"
                      className="block p-3 rounded-lg bg-gradient-to-br from-pink-500/10 to-blue-500/10 border border-pink-500/20 hover:border-pink-500/50 transition-all group"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center">
                          <Play size={16} className="text-pink-400" />
                        </div>
                        <div>
                          <h4 className="font-medium text-white text-sm group-hover:text-pink-300">Bilibili 搜索</h4>
                          <p className="text-xs text-gray-500">搜索更多相关视频</p>
                        </div>
                      </div>
                    </a>
                    <a
                      href={`https://www.youtube.com/results?search_query=${encodeURIComponent(day.title + ' cybersecurity tutorial')}`}
                      target="_blank" rel="noopener noreferrer"
                      className="block p-3 rounded-lg bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/20 hover:border-red-500/50 transition-all group"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
                          <Play size={16} className="text-red-400" />
                        </div>
                        <div>
                          <h4 className="font-medium text-white text-sm group-hover:text-red-300">YouTube 搜索</h4>
                          <p className="text-xs text-gray-500">搜索英文教程</p>
                        </div>
                      </div>
                    </a>
                  </div>
                </Card>
              </motion.div>
            </div>
          )}

          {/* ===== Tab: 代码实战 ===== */}
          {activeTab === 'code' && (
            <>

          {/* 代码示例 */}
          <motion.div variants={itemVariants}>
            <Card>
              <h3 className={`text-sm font-medium ${color.main} mb-3 flex items-center gap-2`}>
                <Terminal size={16} />
                代码示例
                {effectiveCodeExamples.length > 0 && (
                  <span className="text-xs text-gray-500 font-normal ml-1">
                    (共{effectiveCodeExamples.length}个)
                  </span>
                )}
              </h3>
              {effectiveCodeExamples.length > 0 ? (
                <div className="space-y-4">
                  {effectiveCodeExamples.map((example, i) => (
                    <div key={i} className="border border-cyber-purple/20 rounded-lg overflow-hidden">
                      <div className="flex items-center justify-between px-3 py-2 bg-cyber-purple/10 border-b border-cyber-purple/20">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-gray-300">{example.title}</span>
                          <span className="text-xs px-2 py-0.5 rounded bg-cyber-green/20 text-cyber-green">
                            {example.language}
                          </span>
                        </div>
                        <button
                          onClick={() => copyToClipboard(example.code, `code-${i}`)}
                          className="flex items-center gap-1 text-xs text-gray-400 hover:text-cyber-green transition-colors"
                        >
                          {copiedCmd === `code-${i}` ? <Check size={14} /> : <Copy size={14} />}
                          {copiedCmd === `code-${i}` ? '已复制' : '复制'}
                        </button>
                      </div>
                      <pre className="bg-cyber-black/50 p-4 text-xs overflow-x-auto">
                        <code className="text-gray-300 font-mono">{example.code}</code>
                      </pre>
                      <div className="px-3 py-2 bg-cyber-purple/5 border-t border-cyber-purple/20">
                        <p className="text-xs text-gray-400">
                          <span className="text-cyber-green mr-1">💡</span>
                          {example.explanation}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Terminal size={32} className="mx-auto mb-3 opacity-30" />
                  <p className="text-sm">本日暂无代码示例</p>
                  <p className="text-xs mt-1">可使用下方代码编辑器自行练习</p>
                </div>
              )}
            </Card>
          </motion.div>

          {/* Monaco 代码编辑器 */}
          <motion.div variants={itemVariants}>
            <Card className={color.cardBorder}>
              <div className="flex items-center justify-between mb-3">
                <h3 className={`text-sm font-medium ${color.main} flex items-center gap-2`}>
                  <Code size={16} />
                  代码编辑器
                </h3>
                <div className="flex items-center gap-2">
                  <select value={editorLang} onChange={e => setEditorLang(e.target.value)}
                    className="text-xs px-2 py-1 bg-cyber-black/50 border border-gray-700 rounded text-gray-300">
                    <option value="python">Python</option>
                    <option value="javascript">JavaScript</option>
                    <option value="java">Java</option>
                    <option value="bash">Bash</option>
                    <option value="sql">SQL</option>
                  </select>
                </div>
              </div>
              <div className="relative border border-gray-700 rounded-lg overflow-hidden" style={{ height: 280 }}>
                <Editor
                  language={editorLang === 'bash' ? 'shell' : editorLang === 'sql' ? 'sql' : editorLang}
                  value={editorCode}
                  onChange={(val) => setEditorCode(val || '')}
                  theme="vs-dark"
                  options={{
                    fontSize: 13,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    lineNumbers: 'on',
                    tabSize: 2,
                    automaticLayout: true,
                  }}
                  onMount={(editor, monaco) => {
                    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
                      handleRunCode(editor.getValue(), editorLang);
                    });
                  }}
                  loading={<div className="flex items-center justify-center h-full text-gray-500 text-sm">加载编辑器...</div>}
                />
                <div className="absolute bottom-2 right-2 flex gap-2">
                  <button
                    onClick={() => handleRunCode(editorCode, editorLang)}
                    disabled={codeRunning || !editorCode.trim()}
                    className={`px-3 py-1 rounded text-xs font-medium flex items-center gap-1 ${!editorCode.trim() ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-cyber-green text-black hover:bg-emerald-400'}`}
                  >
                    {codeRunning ? <RefreshCw size={12} className="animate-spin"/> : <Play size={12}/>}
                    运行
                  </button>
                  <button onClick={() => setEditorCode('')}
                    className="px-2 py-1 rounded text-xs text-gray-400 hover:text-white bg-gray-700/50">
                    <RotateCcw size={12}/>
                  </button>
                </div>
              </div>
              {codeOutput && (
                <pre className="mt-3 p-3 bg-black/70 rounded-lg text-xs text-green-400 overflow-x-auto font-mono whitespace-pre-wrap max-h-48 overflow-y-auto">
                  {codeOutput}
                </pre>
              )}
              <p className="text-xs text-gray-500 mt-2">💡 提示: 按 Ctrl+Enter 快速运行代码 | 支持 Python / JavaScript / Java（Bash 和 SQL 建议使用本地终端）</p>
            </Card>
          </motion.div>

          {/* 实战思维训练 —— 场景模拟 */}
          {extractedFromMd.scenarioTraining.length > 0 && (
            <motion.div variants={itemVariants}>
              <Card className="bg-gradient-to-br from-cyber-red/5 to-cyber-gold/5 border-cyber-gold/20">
                <h3 className="text-sm font-medium text-cyber-gold mb-3 flex items-center gap-2">
                  <Shield size={16} />
                  🎯 实战思维训练 —— "如果是你，你怎么防？"
                </h3>
                <div className="space-y-4">
                  {extractedFromMd.scenarioTraining.map((sc, si) => (
                    <div key={si} className="p-3 rounded-lg bg-cyber-black/30 border border-cyber-gold/10">
                      <p className="text-sm text-white mb-3">
                        <span className="text-cyber-red font-bold">⚠ 场景：</span>
                        {sc.scenario}
                      </p>
                      <div className="space-y-2">
                        {sc.layers.map((layer, li) => {
                          const icons = ['🛡️', '🔍', '🚨', '📊'];
                          const colors = ['border-cyber-blue/30 bg-cyber-blue/5', 'border-cyber-gold/30 bg-cyber-gold/5', 'border-cyber-red/30 bg-cyber-red/5', 'border-cyber-purple/30 bg-cyber-purple/5'];
                          return (
                            <div key={li} className={`p-2 rounded border ${colors[li % 4]}`}>
                              <span className="text-xs text-gray-300">{icons[li % 4]} {layer}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {/* 蓝队条件反射训练 */}
          {extractedFromMd.conditionedResponse.length > 0 && (
            <motion.div variants={itemVariants}>
              <Card className="bg-gradient-to-br from-cyber-green/5 to-cyber-blue/5 border-cyber-green/20">
                <h3 className="text-sm font-medium text-cyber-green mb-3 flex items-center gap-2">
                  <Eye size={16} />
                  ⚡ 蓝队条件反射训练 —— "看到现象 → 瞬间反应"
                </h3>
                <div className="space-y-2">
                  {extractedFromMd.conditionedResponse.map((row, ri) => (
                    <div key={ri} className="p-3 rounded-lg bg-cyber-black/30 border border-cyber-green/10">
                      <div className="flex items-start gap-3 flex-wrap text-xs">
                        <div className="flex-1 min-w-[120px]">
                          <span className="text-cyber-red font-medium">🔴 现象:</span>
                          <span className="text-gray-300 ml-1">{row.phenomenon}</span>
                        </div>
                        <span className="text-gray-500 self-center">→</span>
                        <div className="flex-1 min-w-[100px]">
                          <span className="text-cyber-gold font-medium">💡 联想:</span>
                          <span className="text-gray-300 ml-1">{row.association}</span>
                        </div>
                        <span className="text-gray-500 self-center">→</span>
                        <div className="flex-1 min-w-[150px]">
                          <span className="text-cyber-green font-medium">✅ 动作:</span>
                          <span className="text-gray-300 ml-1">{row.action}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {/* 编程练习 —— 从代码块生成多道实战题目 */}
          {effectiveCodeExamples.length > 0 && (() => {
            // 从代码块生成多道实战练习题
            const exercises = effectiveCodeExamples.slice(0, 8).map((ex, i) => {
              const tasks = [
                `阅读上述「${ex.title}」中的 ${ex.language} 代码，用自己的话解释每一行/每一步在做什么`,
                `将上述 ${ex.language} 代码修改为支持${i % 2 === 0 ? '错误处理' : '日志记录'}的版本`,
                `基于上述示例，写出一个类似功能的代码片段，但将${i % 3 === 0 ? '输入参数' : i % 3 === 1 ? '输出格式' : '目标地址'}改为你自己的`,
                `找出上述代码中可能存在的${i % 2 === 0 ? '安全风险' : '性能瓶颈'}，并提出改进方案`,
              ];
              const difficulty = i < 3 ? '⭐' : i < 6 ? '⭐⭐' : '⭐⭐⭐';
              return {
                id: i,
                title: `练习 ${i + 1}：${ex.title}`,
                task: tasks[i % tasks.length],
                hint: ex.code.length > 200 ? ex.code.slice(0, 200) + '\n...' : ex.code,
                difficulty,
                xp: [5, 8, 10, 12, 15, 15, 18, 20][i] || 10,
                language: ex.language,
              };
            });
            return (
            <motion.div variants={itemVariants}>
              <Card className="bg-gradient-to-br from-cyber-blue/5 to-cyber-purple/5 border-cyber-blue/20">
                <h3 className={`text-sm font-medium text-cyber-blue mb-3 flex items-center gap-2`}>
                  <Target size={16} />
                  编程练习
                  <span className="text-xs text-gray-500 font-normal ml-1">(共{exercises.length}道)</span>
                </h3>
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                  {exercises.map((task, idx) => {
                    const key = `ex-${idx}`;
                    const done = exerciseResult === 'correct' && Number(exerciseAnswer) === idx;
                    const doneClass = done ? 'border-cyber-green/40 bg-cyber-green/5' : '';
                    return (
                      <div key={key} className={`p-3 rounded-lg bg-cyber-black/50 border border-cyber-blue/10 ${doneClass}`}>
                        <div className="flex items-start justify-between mb-2">
                          <p className="text-sm text-white flex-1 mr-3">
                            <span className="text-cyber-blue font-bold mr-2">#{idx + 1}</span>
                            {task.task}
                          </p>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-xs px-2 py-0.5 rounded bg-cyber-blue/20 text-cyber-blue">{task.difficulty}</span>
                            <span className="text-xs px-2 py-0.5 rounded bg-cyber-green/20 text-cyber-green">+{task.xp} XP</span>
                          </div>
                        </div>
                        <details className="group">
                          <summary className="text-xs text-gray-500 cursor-pointer hover:text-cyber-gold transition-colors select-none">
                            💡 查看参考代码
                          </summary>
                          <pre className="mt-2 p-2 bg-cyber-black/70 rounded text-xs text-green-400 font-mono overflow-x-auto max-h-32 overflow-y-auto whitespace-pre-wrap">
                            {task.hint}
                          </pre>
                        </details>
                        <textarea
                          placeholder={`在此编写你的 ${task.language} 答案...`}
                          className="w-full h-16 mt-2 bg-cyber-black/70 border border-gray-700 rounded p-2 text-xs text-green-400 font-mono outline-none focus:border-cyber-blue resize-y"
                          onFocus={() => {
                            setExerciseAnswer(String(idx));
                            setExerciseResult(null);
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
                <div className="flex gap-2 mt-4 pt-3 border-t border-cyber-blue/10">
                  <Button onClick={() => {
                    if (exerciseAnswer && exerciseAnswer.trim().length > 0) {
                      setExerciseResult('correct');
                      const idx = Number(exerciseAnswer);
                      if (!isNaN(idx) && idx < exercises.length) {
                        addXp(exercises[idx].xp);
                      }
                    } else {
                      setExerciseResult('wrong');
                    }
                  }}>
                    提交当前答案
                  </Button>
                  <Button variant="outline" onClick={() => {
                    setExerciseAnswer('');
                    setExerciseResult(null);
                  }}>
                    全部清空
                  </Button>
                </div>
                {exerciseResult === 'correct' && (
                  <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}
                    className="mt-3 p-3 rounded-lg bg-green-500/10 border border-green-500/30 flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-400"/>
                    <span className="text-sm text-green-400">✅ 太棒了！继续挑战下一题！</span>
                  </motion.div>
                )}
                {exerciseResult === 'wrong' && (
                  <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}
                    className="mt-3 p-3 rounded-lg bg-cyber-gold/5 border border-cyber-gold/20 flex items-center gap-2">
                    <AlertCircle size={16} className="text-cyber-gold"/>
                    <span className="text-sm text-gray-300">💡 请在任意题目中输入答案后再提交</span>
                  </motion.div>
                )}
              </Card>
            </motion.div>
            );
          })()}
            </>
          )}

          {/* 推荐工具 */}
          {day.recommendedTools && day.recommendedTools.length > 0 && (
            <motion.div variants={itemVariants}>
              <Card>
                <h3 className={`text-sm font-medium ${color.main} mb-3 flex items-center gap-2`}>
                  <Wrench size={16} />
                  推荐工具
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {day.recommendedTools.map((tool, i) => (
                    <a
                      key={i}
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-3 p-3 rounded-lg bg-cyber-purple/10 border border-cyber-purple/20 hover:border-cyber-purple/40 transition-colors group"
                    >
                      <Terminal size={18} className={`${color.main} mt-0.5`} />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-white group-hover:text-cyber-green transition-colors">
                          {tool.name}
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">{tool.description}</div>
                      </div>
                      <ExternalLink size={14} className="text-gray-500 group-hover:text-cyber-green flex-shrink-0" />
                    </a>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {/* 靶场环境 */}
          {day.labEnvironment && day.labEnvironment.length > 0 && (
            <motion.div variants={itemVariants}>
              <Card className={color.cardBorder}>
                <h3 className={`text-sm font-medium ${color.main} mb-3 flex items-center gap-2`}>
                  <Server size={16} />
                  实验靶场
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {day.labEnvironment.map((lab, i) => (
                    <div
                      key={i}
                      className={`
                        block p-4 rounded-lg border transition-all
                        ${lab.type === 'docker'
                          ? 'bg-cyber-green/5 border-cyber-green/20 hover:border-cyber-green/40'
                          : lab.type === 'online'
                            ? 'bg-cyber-blue/5 border-cyber-blue/20 hover:border-cyber-blue/40'
                            : 'bg-cyber-purple/5 border-cyber-purple/20 hover:border-cyber-purple/40'
                        }
                      `}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`font-medium text-sm ${color.main}`}>
                          {lab.name}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          lab.type === 'docker' ? 'bg-cyber-green/20 text-cyber-green' :
                          lab.type === 'online' ? 'bg-cyber-blue/20 text-cyber-blue' :
                          'bg-[#6b5b95]/20 text-gray-300'
                        }`}>
                          {lab.type === 'docker' ? 'Docker' : lab.type === 'online' ? '在线' : '本地'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mb-2">{lab.description}</p>
                      
                      {lab.setup && (
                        <div className="mb-2 p-2 bg-cyber-black/30 rounded text-xs">
                          <p className="text-gray-400 mb-1">📋 搭建步骤：</p>
                          <pre className="text-gray-300 whitespace-pre-wrap font-mono">{lab.setup}</pre>
                        </div>
                      )}
                      
                      {lab.expectedOutput && (
                        <div className="mb-2 p-2 bg-cyber-green/10 rounded text-xs">
                          <p className="text-cyber-green mb-1">✅ 预期效果：</p>
                          <span className="text-gray-300">{lab.expectedOutput}</span>
                        </div>
                      )}
                      
                      <a
                        href={lab.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-gray-500 hover:text-cyber-green transition-colors"
                      >
                        <ExternalLink size={12} />
                        访问
                      </a>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {/* 学习资源 */}
          {effectiveResources.length > 0 && (
            <motion.div variants={itemVariants}>
              <Card>
                <h3 className={`text-sm font-medium ${color.main} mb-3 flex items-center gap-2`}>
                  <BookOpen size={16} />
                  学习资源
                  {extractedFromMd.extraLinks.length > 0 && (
                    <span className="text-xs text-gray-500 font-normal ml-1">
                      (含{extractedFromMd.extraLinks.length}个延伸推荐)
                    </span>
                  )}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {effectiveResources.map((resource, i) => (
                    <a
                      key={i}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg bg-cyber-purple/10 border border-cyber-purple/20 hover:border-cyber-purple/40 transition-colors group"
                    >
                      <div className={`w-8 h-8 rounded flex items-center justify-center ${
                        resource.type === 'article' ? 'bg-cyber-blue/20' :
                        resource.type === 'video' ? 'bg-cyber-red/20' :
                        'bg-cyber-green/20'
                      }`}>
                        {resource.type === 'article' ? (
                          <BookOpen size={16} className="text-cyber-blue" />
                        ) : resource.type === 'video' ? (
                          <Play size={16} className="text-cyber-red" />
                        ) : (
                          <Star size={16} className="text-cyber-green" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-white group-hover:text-cyber-green transition-colors">
                          {resource.name}
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">
                          {resource.type === 'article' ? '文章' : resource.type === 'video' ? '视频' : '书籍'}
                        </div>
                      </div>
                      <ExternalLink size={14} className="text-gray-500 group-hover:text-cyber-green flex-shrink-0" />
                    </a>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {/* ===== Tab: 课内读物 ===== */}
          {activeTab === 'readings' && (
            <>
              <motion.div variants={itemVariants}>
                <Card>
                  <h3 className={`text-sm font-medium ${color.main} mb-4 flex items-center gap-2`}>
                    <Library size={16} />
                    课内读物
                    <span className="text-xs text-gray-500 font-normal ml-1">
                      精选{readings.length}篇
                    </span>
                  </h3>
                  {readingsLoading ? (
                    <div className="text-center py-8 text-gray-400">
                      <RefreshCw size={20} className="mx-auto mb-2 animate-spin" />
                      <p className="text-sm">加载课内读物中...</p>
                    </div>
                  ) : readings.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <BookOpen size={28} className="mx-auto mb-2 opacity-50" />
                      <p className="text-sm">暂无该课程的课内读物</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {readings.map(r => (
                        <div
                          key={r.id}
                          className="bg-cyber-purple/10 border border-cyber-purple/20 rounded-lg p-4 hover:border-cyber-purple/40 transition-colors group"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="text-sm font-medium text-white group-hover:text-cyber-green transition-colors line-clamp-2 flex-1 mr-2">
                              {r.title}
                            </h4>
                            <Badge
                              className={`text-[10px] px-1.5 py-0.5 whitespace-nowrap ${
                                r.difficulty === '入门' ? 'bg-cyber-green/20 text-cyber-green border-cyber-green/30' :
                                r.difficulty === '进阶' ? 'bg-cyber-blue/20 text-cyber-blue border-cyber-blue/30' :
                                'bg-cyber-gold/20 text-cyber-gold border-cyber-gold/30'
                              }`}
                            >
                              {r.difficulty}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-400 mb-3 line-clamp-2">
                            {r.summary}
                          </p>
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {r.tags.slice(0, 3).map((tag, i) => (
                              <span
                                key={i}
                                className="text-[10px] px-1.5 py-0.5 rounded bg-cyber-purple/20 text-gray-400"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <div className="flex items-center gap-3">
                              <span className="flex items-center gap-1">
                                <Clock size={12} />
                                {r.readMinutes}分钟
                              </span>
                              <span className="flex items-center gap-1">
                                <User size={12} />
                                {r.author}
                              </span>
                            </div>
                            <button
                              onClick={() => navigate(`/resources/${r.id}`)}
                              className="flex items-center gap-1 text-cyber-green hover:text-cyber-green/80 font-medium transition-colors"
                            >
                              阅读全文
                              <ExternalLink size={12} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </motion.div>
            </>
          )}

          {/* ===== Tab: 随堂测验 ===== */}
          {activeTab === 'quiz' && allQuizQuestions.length > 0 && (
            <>

          {/* 随堂测验 */}
          {allQuizQuestions.length > 0 && (
            <motion.div variants={itemVariants}>
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-sm font-medium ${color.main} flex items-center gap-2`}>
                    <Target size={16} />
                    随堂测验
                    {wrongBookCount > 0 && (
                      <span className="text-xs px-2 py-0.5 rounded bg-cyber-red/20 text-cyber-red font-normal ml-1">
                        含{wrongBookCount}道错题复习
                      </span>
                    )}
                    {mdGenCount > 0 && (
                      <span className="text-xs px-2 py-0.5 rounded bg-cyber-blue/20 text-cyber-blue font-normal ml-1">
                        +{mdGenCount}道扩展
                      </span>
                    )}
                  </h3>
                  <div className="flex items-center gap-3">
                    {/* 全部展开 / 逐题作答 切换 */}
                    <button
                      onClick={() => {
                        setQuizFullyExpanded(!quizFullyExpanded);
                        setExpandedAnswers({});
                        setExpandedShowAnswer({});
                      }}
                      className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                        quizFullyExpanded
                          ? 'bg-cyber-green/15 text-cyber-green border-cyber-green/30'
                          : 'bg-cyber-purple/10 text-gray-400 border-cyber-purple/20 hover:text-gray-200'
                      }`}
                    >
                      {quizFullyExpanded ? '全部展开中' : '逐题作答'}
                    </button>
                    {/* 30秒计时器 */}
                    {!quizFullyExpanded && (
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold ${
                      quizTimer <= 10 ? 'bg-red-500/20 text-red-400 animate-pulse' :
                      quizTimer <= 20 ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-cyber-green/20 text-cyber-green'
                    }`}>
                      <Clock size={13} />
                      {quizTimer}s
                    </div>
                    )}
                    {!quizFullyExpanded && (
                    <span className="text-xs text-gray-400">
                      {quiz.currentIndex + 1} / {allQuizQuestions.length}
                    </span>
                    )}
                  </div>
                </div>
                
                {/* ─── 全部展开模式：一次性显示所有题目 ─── */}
                {quizFullyExpanded ? (
                  <div className="space-y-6">
                    {allQuizQuestions.map((rawQ, qIdx) => {
                      const question: QuizQuestion = {
                        ...rawQ,
                        type: rawQ.type || (rawQ.options && rawQ.options.length > 0 ? 'single' : 'fill'),
                      };
                      const isWrongBookQ = quizKeyMap[qIdx] && wrongQuestionBook.entries.some(e => e.key === quizKeyMap[qIdx] && e.consecutiveCorrect < 3);
                      const isMdGen = String(rawQ.id || '').startsWith('mdgen_');
                      const userAnswer = expandedAnswers[qIdx];
                      const showAns = !!expandedShowAnswer[qIdx];
                      const isCorrect = showAns ? checkQuizAnswer(question, userAnswer) : null;
                      const handleExpandAnswer = (answer: QuizAnswer) => {
                        setExpandedAnswers(prev => ({ ...prev, [qIdx]: answer }));
                        setExpandedShowAnswer(prev => ({ ...prev, [qIdx]: true }));
                        const qKey = quizKeyMap[qIdx] || `${planId}_${currentDay}_q${qIdx}`;
                        wrongQuestionBook.recordAnswer(qKey, question, planId!, currentDay, qIdx, checkQuizAnswer(question, answer));
                      };
                      const handleExpandMultiToggle = (oi: number) => {
                        const cur = expandedAnswers[qIdx];
                        const arr = Array.isArray(cur) ? cur : [];
                        const ns = arr.includes(oi) ? arr.filter(i => i !== oi) : [...arr, oi].sort((a, b) => a - b);
                        setExpandedAnswers(prev => ({ ...prev, [qIdx]: ns }));
                      };
                      return (
                        <motion.div
                          key={qIdx}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: qIdx * 0.03 }}
                          className="p-4 rounded-xl bg-cyber-purple/5 border border-cyber-purple/15"
                        >
                          {/* 题号 + 标签 */}
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-xs font-bold px-2 py-0.5 rounded bg-cyber-purple/30 text-gray-300">
                              第{qIdx + 1}题
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded ${
                              question.type === 'single' ? 'bg-cyber-blue/20 text-cyber-blue' :
                              question.type === 'multiple' ? 'bg-cyber-green/20 text-cyber-green' :
                              question.type === 'boolean' ? 'bg-cyber-gold/20 text-cyber-gold' :
                              'bg-[#6b5b95]/20 text-gray-300'
                            }`}>
                              {question.type === 'single' ? '单选' :
                               question.type === 'multiple' ? '多选' :
                               question.type === 'boolean' ? '判断' : '填空'}
                            </span>
                            {isWrongBookQ && <span className="text-xs px-2 py-0.5 rounded bg-cyber-red/20 text-cyber-red">错题复习</span>}
                            {isMdGen && <span className="text-xs px-2 py-0.5 rounded bg-cyber-blue/20 text-cyber-blue">扩展题</span>}
                          </div>
                          {/* 题目 */}
                          <p className="text-sm text-white font-medium leading-relaxed mb-3">{question.question}</p>
                          {/* 选项 */}
                          {question.options && (question.type === 'single' || question.type === 'boolean' || question.type === 'multiple') && (
                            <div className="space-y-1.5 mb-3">
                              {question.options.map((opt, i) => {
                                const isSelected = question.type === 'multiple'
                                  ? (Array.isArray(userAnswer) && userAnswer.includes(i))
                                  : userAnswer === i;
                                let cls = color.optionDefault;
                                if (showAns) {
                                  const isCorrectOption = question.type === 'multiple'
                                    ? (question.correctIndices || []).includes(i)
                                    : i === question.correctIndex;
                                  if (isCorrectOption) cls = color.optionCorrect;
                                  else if (isSelected) cls = color.optionWrong;
                                  else cls = color.optionDim;
                                }
                                return (
                                  <button
                                    key={i}
                                    onClick={() => {
                                      if (showAns) return;
                                      if (question.type === 'multiple') {
                                        handleExpandMultiToggle(i);
                                      } else {
                                        handleExpandAnswer(i);
                                      }
                                    }}
                                    disabled={showAns}
                                    className={`w-full text-left px-3 py-2 rounded-lg border transition-all text-sm ${cls}`}
                                  >
                                    <span className="font-mono mr-2 text-gray-400">{String.fromCharCode(65 + i)}.</span>
                                    <span className="text-gray-200">{opt}</span>
                                    {question.type === 'multiple' && !showAns && (
                                      <span className={`ml-auto text-xs ${isSelected ? 'text-cyber-green' : 'text-gray-500'}`}>
                                        {isSelected ? '✓' : '○'}
                                      </span>
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                          {/* 填空题 */}
                          {question.type === 'fill' && !showAns && (
                            <div className="flex gap-2 mb-3">
                              <input
                                type="text"
                                value={String(userAnswer || '')}
                                onChange={(e) => setExpandedAnswers(prev => ({ ...prev, [qIdx]: e.target.value }))}
                                onKeyDown={(e) => { if (e.key === 'Enter') handleExpandAnswer(userAnswer ?? ''); }}
                                className="flex-1 px-3 py-2 bg-cyber-purple/10 border border-cyber-purple/30 rounded-lg text-white text-sm outline-none focus:border-cyber-green"
                                placeholder="请输入答案..."
                              />
                              <button
                                onClick={() => handleExpandAnswer(userAnswer ?? '')}
                                className={`px-4 py-2 rounded-lg text-sm ${color.btnDefault} transition-colors`}
                              >
                                提交
                              </button>
                            </div>
                          )}
                          {/* 多选提交按钮 */}
                          {question.type === 'multiple' && !showAns && (
                            <button
                              onClick={() => handleExpandAnswer(userAnswer as number[] || [])}
                              className={`w-full py-1.5 rounded-lg text-sm mb-3 ${color.btnDefault} transition-colors`}
                            >
                              提交答案
                            </button>
                          )}
                          {/* 答案解析 */}
                          {showAns && (
                            <motion.div
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="p-3 rounded-lg bg-cyber-purple/10 border border-cyber-purple/20"
                            >
                              <div className={`flex items-center gap-1.5 mb-1.5 ${isCorrect ? 'text-cyber-green' : 'text-cyber-red'}`}>
                                {isCorrect ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
                                <span className="font-medium text-xs">{isCorrect ? '✓ 正确' : '✗ 错误'}</span>
                              </div>
                              {question.type === 'fill' && question.correctAnswer && (
                                <div className="text-xs text-cyber-green mb-1">
                                  <span className="text-gray-400">正确答案：</span>{question.correctAnswer}
                                </div>
                              )}
                              <p className="text-xs text-gray-300 leading-relaxed">{question.explanation}</p>
                            </motion.div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                ) :
                  /* ─── 逐题模式：一题一题作答 ─── */
                  allQuizQuestions[quiz.currentIndex] && (() => {
                  const questionIndexInQuiz = quiz.currentIndex;
                  const isWrongBookQ = quizKeyMap[questionIndexInQuiz] && wrongQuestionBook.entries.some(e => e.key === quizKeyMap[questionIndexInQuiz] && e.consecutiveCorrect < 3);
                  const wbEntry = isWrongBookQ ? wrongQuestionBook.entries.find(e => e.key === quizKeyMap[questionIndexInQuiz]) : undefined;
                  const rawQ = allQuizQuestions[quiz.currentIndex] as QuizQuestion;
                  const question: QuizQuestion = {
                    ...rawQ,
                    type: rawQ.type || (rawQ.options && rawQ.options.length > 0 ? 'single' : 'fill'),
                  };
                  const userAnswer = quiz.answers[quiz.currentIndex];
                  const isMdGen = String(rawQ.id || '').startsWith('mdgen_');
                  
                  const isCorrect2 = quiz.showAnswer
                    ? checkQuizAnswer(question, userAnswer)
                    : null;
                  
                  return (
                    <div className="space-y-4">
                      {/* 错题/自动生成题标记 */}
                      {isWrongBookQ && wbEntry && (
                        <div className="flex items-center gap-2 px-2 py-1 rounded bg-cyber-red/10 border border-cyber-red/20 text-xs text-cyber-red">
                          <AlertCircle size={13} />
                          <span>错题复习 · 已连续答对 {wbEntry.consecutiveCorrect}/3 次</span>
                          <span className="text-gray-500">（连续答对3次后移出错题本）</span>
                        </div>
                      )}
                      {isMdGen && (
                        <div className="flex items-center gap-2 px-2 py-1 rounded bg-cyber-blue/10 border border-cyber-blue/20 text-xs text-cyber-blue">
                          <Zap size={13} />
                          <span>扩展题 · 从课程内容自动生成</span>
                        </div>
                      )}
                      <div className="flex items-start gap-2">
                        <span className={`text-xs px-2 py-1 rounded mr-2 ${
                          question.type === 'single' ? 'bg-cyber-blue/20 text-cyber-blue' :
                          question.type === 'multiple' ? 'bg-cyber-green/20 text-cyber-green' :
                          question.type === 'boolean' ? 'bg-cyber-gold/20 text-cyber-gold' :
                          'bg-[#6b5b95]/20 text-gray-300'
                        }`}>
                          {question.type === 'single' ? '单选' :
                           question.type === 'multiple' ? '多选' :
                           question.type === 'boolean' ? '判断' : '填空'}
                        </span>
                        <p className="text-sm text-white font-medium leading-relaxed flex-1">
                          {question.question}
                        </p>
                      </div>
                      
                      {/* 选择题选项 */}
                      {question.options && (question.type === 'single' || question.type === 'boolean' || question.type === 'multiple') && (
                        <div className="space-y-2">
                          {question.options.map((opt, i) => {
                            const isSelected = question.type === 'multiple' 
                              ? (Array.isArray(userAnswer) && userAnswer.includes(i))
                              : userAnswer === i;
                            
                            let cls = color.optionDefault;
                            if (quiz.showAnswer) {
                              const isCorrectOption = question.type === 'multiple' 
                                ? (question.correctIndices || []).includes(i)
                                : i === question.correctIndex;
                              
                              if (isCorrectOption) cls = color.optionCorrect;
                              else if (isSelected) cls = color.optionWrong;
                              else cls = color.optionDim;
                            }
                            
                            return (
                              <button
                                key={i}
                                onClick={() => {
                                  if (!quiz.showAnswer) {
                                    if (question.type === 'multiple') {
                                      handleMultipleSelect(i);
                                    } else {
                                      handleQuizAnswer(i);
                                    }
                                  }
                                }}
                                disabled={quiz.showAnswer}
                                className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${cls}`}
                              >
                                <span className="text-sm font-mono mr-2 text-gray-400">
                                  {String.fromCharCode(65 + i)}.
                                </span>
                                <span className="text-sm text-gray-200">{opt}</span>
                                {question.type === 'multiple' && !quiz.showAnswer && (
                                  <span className={`ml-auto text-xs ${isSelected ? 'text-cyber-green' : 'text-gray-500'}`}>
                                    {isSelected ? '✓' : '○'}
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                      
                      {/* 填空题输入框 */}
                      {question.type === 'fill' && (
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={String(userAnswer || '')}
                            onChange={(e) => {
                              quiz.setCurrentAnswer(e.target.value);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !quiz.showAnswer) {
                                handleQuizAnswer((userAnswer as string) || '');
                              }
                            }}
                            disabled={quiz.showAnswer}
                            className="w-full px-4 py-3 bg-cyber-purple/10 border border-cyber-purple/30 rounded-lg text-white text-sm outline-none focus:border-cyber-green"
                            placeholder="请输入答案..."
                          />
                          {!quiz.showAnswer && (
                            <button
                              onClick={() => handleQuizAnswer((userAnswer as string) || '')}
                              className={`w-full py-2 rounded-lg ${color.btnDefault} transition-colors`}
                            >
                              提交答案
                            </button>
                          )}
                        </div>
                      )}
                      
                      {/* 提交按钮（多选） */}
                      {question.type === 'multiple' && !quiz.showAnswer && (
                        <button
                          onClick={() => handleQuizAnswer(userAnswer as number[] || [])}
                          className={`w-full py-2 rounded-lg ${color.btnDefault} transition-colors`}
                        >
                          提交答案
                        </button>
                      )}
                      
                      {/* 答案解析 */}
                      {quiz.showAnswer && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 rounded-lg bg-cyber-purple/10 border border-cyber-purple/20"
                        >
                          <div className={`flex items-center gap-2 mb-2 ${isCorrect2 ? 'text-cyber-green' : 'text-cyber-red'}`}>
                            {isCorrect2 ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
                            <span className="font-medium text-sm">
                              {isCorrect2 ? '回答正确！' : '回答错误'}
                            </span>
                          </div>
                          {question.type === 'fill' && question.correctAnswer && (
                            <div className="text-sm text-cyber-green mb-2">
                              <span className="text-gray-400">正确答案：</span>{question.correctAnswer}
                            </div>
                          )}
                          <p className="text-sm text-gray-300 leading-relaxed">{question.explanation}</p>
                        </motion.div>
                      )}
                      
                      {/* 下一题按钮 */}
                      {quiz.showAnswer && (
                        <button
                          onClick={nextQuestion}
                          className={`w-full py-2 rounded-lg ${color.btnDefault} transition-colors`}
                        >
                          {quiz.isLastQuestion ? '完成测验' : '下一题'}
                        </button>
                      )}
                    </div>
                  );
                })()}
              </Card>
            </motion.div>
          )}
          {extractedFromMd.acceptanceChecklist.length > 0 && (
            <motion.div variants={itemVariants}>
              <Card className="bg-gradient-to-br from-cyber-green/5 to-cyber-purple/5 border-cyber-green/20">
                <h3 className="text-sm font-medium text-cyber-green mb-3 flex items-center gap-2">
                  <CheckCircle size={16} />
                  ✅ 验收自检清单
                </h3>
                <div className="space-y-1.5">
                  {extractedFromMd.acceptanceChecklist.map((item, i) => (
                    <label key={i} className="flex items-start gap-3 p-2 rounded hover:bg-cyber-green/5 cursor-pointer transition-colors">
                      <input type="checkbox" className="mt-1 accent-cyber-green" />
                      <span className="text-sm text-gray-300">{item}</span>
                    </label>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {/* 学习效果自检（从 .md 中提取） */}
          {extractedFromMd.selfCheckQuestions.length > 0 && (
            <motion.div variants={itemVariants}>
              <Card>
                <h3 className="text-sm font-medium text-cyber-gold mb-3 flex items-center gap-2">
                  <Target size={16} />
                  📈 学习效果自检
                </h3>
                <div className="space-y-3">
                  {extractedFromMd.selfCheckQuestions.map((q, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-cyber-purple/10">
                      <span className="text-cyber-gold font-bold text-sm mt-0.5">{i + 1}.</span>
                      <span className="text-sm text-gray-300">{q}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {/* 面试高频题（从 .md 中提取） */}
          {extractedFromMd.interviewQA.length > 0 && (
            <motion.div variants={itemVariants}>
              <Card className="bg-gradient-to-br from-cyber-red/5 to-cyber-purple/5 border-cyber-red/20">
                <h3 className="text-sm font-medium text-cyber-red mb-3 flex items-center gap-2">
                  <Award size={16} />
                  🎯 蓝队面试高频题
                </h3>
                <div className="space-y-4">
                  {extractedFromMd.interviewQA.map((item, i) => {
                    const isExpanded = expandedQA.has(i);
                    return (
                      <div key={i} className="p-3 rounded-lg bg-cyber-black/30 border border-cyber-red/10">
                        <button
                          onClick={() => {
                            const next = new Set(expandedQA);
                            isExpanded ? next.delete(i) : next.add(i);
                            setExpandedQA(next);
                          }}
                          className="flex items-start gap-2 w-full text-left group"
                        >
                          <span className="text-cyber-red text-sm font-medium mt-0.5 group-hover:text-white transition-colors">
                            Q{i + 1}:
                          </span>
                          <span className="text-sm text-white flex-1">{item.q}</span>
                          <ChevronDown
                            size={16}
                            className={`text-gray-400 mt-0.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                          />
                        </button>
                        {isExpanded && (
                          <div className="mt-3 p-3 rounded bg-cyber-red/5 border border-cyber-red/10 text-sm text-gray-300 leading-relaxed whitespace-pre-line">
                            {item.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Card>
            </motion.div>
          )}
            </>
          )}

          {activeTab === 'quiz' && allQuizQuestions.length === 0 && (
            <motion.div variants={itemVariants}>
              <Card>
                <h3 className={`text-sm font-medium ${color.main} mb-3 flex items-center gap-2`}>
                  <FileQuestion size={16} />
                  随堂测验
                </h3>
                <div className="text-center py-8 text-gray-500">
                  <FileQuestion size={32} className="mx-auto mb-3 opacity-30" />
                  <p className="text-sm">本日暂无测验题目</p>
                  <p className="text-xs mt-1">请先阅读课程内容后再来测验</p>
                </div>
              </Card>
            </motion.div>
          )}

          {/* ===== Tab: 大神笔记 ===== */}
          {activeTab === 'expert' && (
            <>
              <motion.div variants={itemVariants}>
                <Card className="bg-gradient-to-br from-cyber-gold/5 to-cyber-purple/5 border-cyber-gold/20">
                  <h3 className="text-sm font-medium text-cyber-gold mb-3 flex items-center gap-2">
                    <Award size={16} />
                    大神笔记
                  </h3>
                  {day.expertNotes && day.expertNotes.length > 0 ? (
                    <div className="space-y-4">
                      {day.expertNotes.map((note, i) => (
                        <div key={i} className="p-4 rounded-lg bg-cyber-black/30 border border-cyber-gold/10">
                          <div className="flex items-center gap-2 mb-2">
                            <User size={14} className="text-cyber-gold" />
                            <span className="text-sm font-medium text-cyber-gold">{note.author}</span>
                            <span className="text-xs text-gray-500">·</span>
                            <span className="text-xs text-gray-400">{note.title}</span>
                          </div>
                          <p className="text-sm text-gray-300 leading-relaxed">{note.content}</p>
                          {note.url && (
                            <a
                              href={note.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 mt-2 text-xs text-cyber-gold hover:text-cyber-green transition-colors"
                            >
                              <ExternalLink size={12} />
                              查看原文
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Award size={32} className="mx-auto mb-3 opacity-30" />
                      <p className="text-sm">本日暂无大神笔记</p>
                      <p className="text-xs mt-1">更多专家内容持续更新中</p>
                    </div>
                  )}
                </Card>
              </motion.div>
            </>
          )}

          {/* 错题本入口 */}
          {wrongQuestionBook.entries.length > 0 && (
            <motion.div variants={itemVariants}>
              <Card className="bg-cyber-red/5 border-cyber-red/20">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-cyber-red flex items-center gap-2">
                    <AlertCircle size={16} />
                    错题本
                    <Badge className="bg-cyber-red/20 text-cyber-red">{wrongQuestionBook.entries.length}道错题</Badge>
                  </h3>
                  <span className="text-xs text-gray-500">连续答对3次可移除</span>
                </div>
                <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
                  {wrongQuestionBook.entries.slice(0, 5).map((entry, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded bg-cyber-black/30">
                      <div className="text-xs">
                        <span className="text-cyber-green">第{entry.day}天</span>
                        <span className="text-gray-500">· 题{entry.questionIndex + 1}</span>
                      </div>
                      <span className="text-xs text-gray-400">
                        连续答对 {entry.consecutiveCorrect}/3
                      </span>
                    </div>
                  ))}
                  {wrongQuestionBook.entries.length > 5 && (
                    <div className="text-center text-xs text-gray-500 py-1">
                      还有 {wrongQuestionBook.entries.length - 5} 道错题...
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <Card>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-cyber-green flex items-center gap-2">
                    📝 学习笔记
                  </h3>
                  <span className="text-xs text-gray-500">
                    {noteSavedAt ? '已保存' : '自动保存'}
                  </span>
                </div>
                <MilkdownEditor
                  value={note}
                  onChange={handleNoteChange}
                  ready={noteReady}
                  placeholder="记录学习心得、疑问、重点…"
                />
                <div className="mt-2 text-xs text-gray-500 flex items-center justify-between">
                  <span>共 {note.length} 字 · 第{currentDay}天笔记</span>
                  <span className="text-gray-600">✏️ 所见即所得 · 按 / 唤出命令面板</span>
                </div>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Pomodoro />
            </motion.div>
          </div>

          {/* 导航按钮 */}
          <motion.div variants={itemVariants} className="flex items-center justify-between">
            <Button
              onClick={() => { setCurrentDay(Math.max(1, currentDay - 1)); }}
              disabled={currentDay === 1}
              variant="outline"
            >
              <ArrowLeft size={16} />
              上一天
            </Button>
            <span className="text-sm text-gray-400">
              第 {currentDay} 天 / 共 {plan.totalDays} 天
            </span>
            <Button
              onClick={() => {
                if (currentDay < plan.totalDays) {
                  setCurrentDay(currentDay + 1);
                }
              }}
              disabled={currentDay === plan.totalDays}
              variant="outline"
            >
              下一天
              <ArrowRight size={16} />
            </Button>
          </motion.div>

          {/* Keyboard shortcuts hint */}
          <motion.div variants={itemVariants} className="flex items-center justify-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Keyboard size={12} />
              <kbd className="px-1.5 py-0.5 bg-cyber-purple/30 rounded text-gray-400">←</kbd>
              上一天
            </span>
            <span className="flex items-center gap-1">
              <Keyboard size={12} />
              <kbd className="px-1.5 py-0.5 bg-cyber-purple/30 rounded text-gray-400">→</kbd>
              下一天
            </span>
            <span className="flex items-center gap-1">
              <Keyboard size={12} />
              <kbd className="px-1.5 py-0.5 bg-cyber-purple/30 rounded text-gray-400">Ctrl+Enter</kbd>
              运行代码
            </span>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default CyberDailyLearning;
