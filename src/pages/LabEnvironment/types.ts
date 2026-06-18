import type React from 'react';

export interface LabModule {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
  difficulty: string;
}

export interface CTFChallenge {
  id: number;
  title: string;
  category: 'web' | 'crypto' | 'misc' | 're';
  description: string;
  flag: string;
  hint: string;
  points: number;
}

/** 模块知识面板数据 */
export interface ModuleKnowledge {
  /** 攻击原理 */
  theory: string;
  /** 常见攻击向量 */
  vectors: string[];
  /** 防御策略 */
  defenses: string[];
  /** 相关CVE */
  cves: string[];
  /** CISP考点 */
  cispPoints: string[];
  /** 推荐工具 */
  tools: string[];
}
