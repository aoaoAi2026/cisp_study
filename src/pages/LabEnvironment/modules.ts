import { Bug, Database, Flag, Key, Wrench, Globe, FileCode, Globe2, Shield, FileSearch, Brain } from 'lucide-react';
import React from 'react';
import type { LabModule } from './types';

export const LAB_MODULES: LabModule[] = [
  {
    id: 'xss', name: 'XSS沙箱', icon: React.createElement(Bug, { size: 28 }),
    description: '3级难度交互式XSS攻击实验室，支持DOM注入和反射型攻击',
    color: '#ff4444', bgColor: 'bg-red-500/10', borderColor: 'border-red-500/30', difficulty: '困难'
  },
  {
    id: 'sqli', name: 'SQL注入', icon: React.createElement(Database, { size: 28 }),
    description: '联合查询/盲注/报错注入模拟，可视化SQL执行过程',
    color: '#ff8800', bgColor: 'bg-orange-500/10', borderColor: 'border-orange-500/30', difficulty: '困难'
  },
  {
    id: 'ctf', name: 'CTF挑战', icon: React.createElement(Flag, { size: 28 }),
    description: '10关夺旗挑战，Web/密码学/杂项/逆向四大分类',
    color: '#ffd700', bgColor: 'bg-yellow-500/10', borderColor: 'border-yellow-500/30', difficulty: '困难'
  },
  {
    id: 'password', name: '密码破解', icon: React.createElement(Key, { size: 28 }),
    description: '字典攻击/暴力破解/彩虹表，Hash识别与破解',
    color: '#ff44ff', bgColor: 'bg-purple-500/10', borderColor: 'border-purple-500/30', difficulty: '中等'
  },
  {
    id: 'crypto', name: '密码学工具', icon: React.createElement(Wrench, { size: 28 }),
    description: 'AES/RSA加解密、编码转换、JWT调试、Hash计算',
    color: '#44aaff', bgColor: 'bg-blue-500/10', borderColor: 'border-blue-500/30', difficulty: '中等'
  },
  {
    id: 'network', name: '网络攻击可视化', icon: React.createElement(Globe, { size: 28 }),
    description: 'ARP欺骗/DNS劫持/中间人/SYN Flood动画演示',
    color: '#44ff88', bgColor: 'bg-green-500/10', borderColor: 'border-green-500/30', difficulty: '中等'
  },
  {
    id: 'vulncode', name: '漏洞代码对比', icon: React.createElement(FileCode, { size: 28 }),
    description: 'Monaco编辑器中对比不安全代码与安全修复(8场景)',
    color: '#ffaa00', bgColor: 'bg-amber-500/10', borderColor: 'border-amber-500/30', difficulty: '简单'
  },
  {
    id: 'burp', name: 'Burp模拟器', icon: React.createElement(Globe2, { size: 28 }),
    description: 'HTTP请求编辑/拦截/重放，Burp Suite风格代理模拟',
    color: '#ff6600', bgColor: 'bg-orange-600/10', borderColor: 'border-orange-600/30', difficulty: '中等'
  },
  {
    id: 'waf', name: 'WAF规则构建', icon: React.createElement(Shield, { size: 28 }),
    description: '10关挑战，编写正则规则拦截攻击payload',
    color: '#00ccff', bgColor: 'bg-cyan-500/10', borderColor: 'border-cyan-500/30', difficulty: '中等'
  },
  {
    id: 'log', name: '日志分析', icon: React.createElement(FileSearch, { size: 28 }),
    description: '分析Nginx/SSH日志识别攻击行为，标注可疑记录',
    color: '#88ff44', bgColor: 'bg-lime-500/10', borderColor: 'border-lime-500/30', difficulty: '中等'
  },
  {
    id: 'logic', name: '逻辑漏洞', icon: React.createElement(Brain, { size: 28 }),
    description: '价格篡改/优惠券滥用/越权/步骤绕过/竞态条件',
    color: '#ff6688', bgColor: 'bg-pink-500/10', borderColor: 'border-pink-500/30', difficulty: '中等'
  },
];
