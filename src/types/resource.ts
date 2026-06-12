export interface Resource {
  id: string;
  category: string;
  title: string;
  summary: string;
  tags: string[];
  difficulty: '入门' | '进阶' | '精通';
  readMinutes: number;
  updatedAt: string;
  contentPath: string;
  author: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

export const difficultyColors: Record<string, string> = {
  '入门': '#00ff88',
  '进阶': '#00d4ff',
  '精通': '#ffd700',
};

export const categoryNames: Record<string, string> = {
  'penetration': '渗透测试',
  'vuln': '漏洞分析',
  'codeaudit': '代码审计',
  'djbh': '等级保护',
  'ctf': 'CTF竞赛',
  'cloud': '云安全',
  'mobile': '移动安全',
  'reverse': '逆向工程',
  'data-security': '数据安全',
  'incident': '应急响应',
  'intel': '威胁情报',
  'soc': '安全运营',
  'tools': '工具指南',
  'knowledge': '基础知识',
  'ai-security': 'AI安全',
  'supply-chain': '供应链安全',
  'ics-iot': 'ICS/IoT安全',
  'web3': 'Web3安全',
  'v2x': '车联网安全',
  'zero-trust': '零信任',
  'crypto-compliance': '密码合规',
  'hw': '护网行动',
};