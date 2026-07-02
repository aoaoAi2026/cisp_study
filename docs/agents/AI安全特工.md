AI安全特工：单人开发版 · 最终完善技术设计文档

    版本：3.0 · 完整交付版
    目标读者：Trea（AI编程助手）及开发者
    核心原则：单人可开发、免费部署、游戏化学习、严格对齐24周AI网络安全学习计划
    文档用途：Trea可据此生成完整代码，开发者可对照实现

目录

    项目概述与核心目标

    技术栈（极简）

    功能模块与优先级

    数据库设计（Supabase DDL + RLS）

    API设计（Next.js API Routes）

    前端设计

        6.1 页面路由

        6.2 状态管理（Zustand完整代码）

        6.3 关键组件完整代码

            任务详情页

            任务判定组件

            动态地图组件

            技能树组件

            随机事件组件

        6.4 工具函数

    游戏化数值系统（经验、等级、技能树、道具、成就）

    24周学习计划任务数据生成指南

        8.1 数据格式

        8.2 自动生成脚本（Node.js）

        8.3 前3周示例数据（供Trea理解结构）

    开发路线图（7周详细任务）

    部署到Vercel + Supabase（含环境变量、构建脚本）

    如何与Trea协作（典型提示词模板）

    常见问题与解决方案

    附录：放弃功能清单

1. 项目概述与核心目标

项目名称：AI安全特工 · 星盾训练营（单人版）

目标：将24周AI网络安全学习计划转化为一个角色扮演+任务闯关的Web应用。用户扮演“特工”，通过完成168个与学习计划严格对应的任务，获取经验、升级、解锁技能树，并在游戏化激励下坚持学习。

成功指标：

    用户完成全部168个任务的比例 ≥ 40%

    日活跃用户平均停留时长 ≥ 25分钟

    用户技能自评提升 ≥ 2级（前测→后测）

技术约束：单人开发，一台电脑，无需后端代码执行沙箱，无需多人实时通信，所有数据可存本地或Supabase免费层。
2. 技术栈（极简）
用途	技术	说明
前端框架	Next.js 14 (App Router) + TypeScript	全栈一体化，支持API路由
UI样式	Tailwind CSS + shadcn/ui	快速构建暗色主题组件
状态管理	Zustand + persist (localStorage)	进度本地存储，可选同步Supabase
数据库/认证	Supabase (PostgreSQL + Auth)	免费层，用于用户管理和云端备份
地图渲染	SVG + React 或简单Canvas	轻量，无需Three.js
任务数据存储	本地JSON文件（从下方脚本生成）	避免数据库查询，直接打包进代码
任务判定	纯前端正则比对（用户粘贴输出）	无需沙箱
随机事件	前端伪随机（基于日期种子）	无后端调度
部署	Vercel (免费) + Supabase (免费)	一键部署
3. 功能模块与优先级
P0（MVP，必须完成）

    用户注册/登录（Supabase Auth）

    任务列表（按周分组，可展开/折叠）

    任务详情页（展示剧情、学习内容）

    用户提交答案（文本框粘贴输出） + 前端正则判定

    任务状态管理（pending/completed/skipped）

    等级、经验、黑客币基础数值系统

    进度持久化到IndexedDB和Supabase

P1（游戏化核心）

    动态地图（网格化，任务节点颜色代表状态）

    技能树（至少10个关键技能，支持加点）

    随机事件（每日/完成任务后触发）

    道具商店（双倍经验券、跳关卡、提示卡）

    成就徽章（基于任务完成数等自动发放）

P2（沉浸与留存）

    阵营选择（红队/蓝队），影响界面文案和技能树外观

    暗影AI每周挑战（预置24个静态挑战）

    向导-7虚拟助手（固定对话树，提供提示）

    个人仪表盘（技能雷达图、完成率、学习统计）

    PWA支持（可安装到手机，离线打卡）

4. 数据库设计（Supabase DDL）

以下SQL语句需在Supabase SQL编辑器中执行。所有表启用Row Level Security。
sql

-- 扩展用户信息（关联auth.users）
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nickname TEXT UNIQUE,
  avatar_url TEXT,
  level INT DEFAULT 1,
  exp INT DEFAULT 0,
  hacker_coins INT DEFAULT 100,
  skill_points INT DEFAULT 0,
  faction TEXT DEFAULT 'blue',      -- 'blue' 或 'red'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 任务进度（mission_id 对应下方JSON中的id）
CREATE TABLE public.user_missions (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  mission_id INT NOT NULL,
  status TEXT DEFAULT 'pending',    -- 'pending', 'completed', 'skipped'
  completed_at TIMESTAMPTZ,
  code_submission TEXT,
  PRIMARY KEY (user_id, mission_id)
);

-- 用户解锁的技能
CREATE TABLE public.user_skills (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  skill_id VARCHAR(50) NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, skill_id)
);

-- 用户道具库存
CREATE TABLE public.user_items (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  item_id VARCHAR(50) NOT NULL,
  quantity INT DEFAULT 1,
  PRIMARY KEY (user_id, item_id)
);

-- 安全审计日志（可选）
CREATE TABLE public.audit_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id),
  action TEXT,
  details JSONB,
  ip INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS 策略：用户只能访问自己的数据
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

ALTER TABLE public.user_missions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own missions" ON public.user_missions
  USING (user_id = auth.uid());

-- 其他表类似，省略...

5. API设计（Next.js API Routes）

所有API路由位于 app/api/ 下，采用REST风格，返回JSON。
方法	路径	功能	说明
GET	/api/missions	获取所有任务	直接返回本地JSON（静态文件读取）
GET	/api/user/progress	获取当前用户进度	从Supabase查询user_missions
POST	/api/user/progress	更新任务状态	验证任务是否可完成，计算奖励，写入数据库
POST	/api/user/skill/unlock	解锁技能	检查技能点，更新user_skills
POST	/api/user/buy-item	购买道具	扣减黑客币，增加user_items
POST	/api/user/use-item	使用道具	减库存，返回效果（前端应用）

示例：POST /api/user/progress 请求体
json

{
  "missionId": 38,
  "status": "completed",
  "codeSubmission": "execution time: 1.23 seconds"
}

响应：
json

{
  "success": true,
  "expGained": 50,
  "coinGained": 20,
  "newLevel": 2,
  "newExp": 150,
  "newCoins": 120
}

实现要点：

    使用 @supabase/ssr 或 @supabase/auth-helpers-nextjs 获取当前用户session。

    更新任务前检查任务是否已完成（防止重复奖励）。

    经验值计算使用公式：expForNextLevel(level)，超过则升级，升级时增加技能点。

6. 前端设计
6.1 页面路由（Next.js App Router结构）
text

app/
├── page.tsx                     # 首页（未登录引导）
├── dashboard/
│   └── page.tsx                 # 特工仪表盘
├── map/
│   └── page.tsx                 # 动态地图（网格）
├── mission/[week]/[day]/
│   └── page.tsx                 # 任务详情（动态路由）
├── skills/
│   └── page.tsx                 # 技能树
├── shop/
│   └── page.tsx                 # 商店
├── profile/
│   └── page.tsx                 # 个人档案+统计
├── api/                         # API路由（上一节）
├── components/                  # 可复用组件
├── stores/                      # Zustand stores
├── data/
│   └── missions.json            # 168个任务数据（由脚本生成）
├── lib/
│   ├── supabaseClient.ts        # Supabase客户端
│   ├── missionChecker.ts        # 任务判定函数
│   ├── gameUtils.ts             # 经验计算、等级计算等
│   └── randomEvents.ts          # 随机事件池及触发器
└── public/                      # 静态资源

6.2 状态管理（Zustand完整代码）

创建 stores/userStore.ts：
typescript

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabaseClient';

interface UserProfile {
  id: string;
  nickname: string;
  level: number;
  exp: number;
  hacker_coins: number;
  skill_points: number;
  faction: 'blue' | 'red';
}

interface UserStore {
  profile: UserProfile | null;
  missionsStatus: Record<number, 'pending' | 'completed' | 'skipped'>;
  skills: string[];          // 已解锁的skill_id列表
  items: Record<string, number>; // item_id -> 数量
  isLoading: boolean;
  
  // 方法
  setProfile: (profile: UserProfile) => void;
  completeMission: (missionId: number, userOutput: string) => Promise<boolean>;
  unlockSkill: (skillId: string, cost: number) => Promise<boolean>;
  buyItem: (itemId: string, price: number) => Promise<boolean>;
  useItem: (itemId: string) => boolean;
  syncFromCloud: () => Promise<void>;
  syncToCloud: () => Promise<void>;
  addExp: (amount: number, missionId?: number) => Promise<void>;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      profile: null,
      missionsStatus: {},
      skills: [],
      items: {},
      isLoading: false,
      
      setProfile: (profile) => set({ profile }),
      
      addExp: async (amount, missionId) => {
        const { profile, missionsStatus } = get();
        if (!profile) return;
        
        // 计算技能加成（如果有对应技能）
        let bonus = 1;
        // 这里可以根据mission类型和已解锁技能计算bonus，简化版略
        
        const gained = Math.floor(amount * bonus);
        let newExp = profile.exp + gained;
        let newLevel = profile.level;
        let newSkillPoints = profile.skill_points;
        
        // 升级逻辑
        const expNeeded = (level: number) => Math.floor(100 * Math.pow(level, 1.2));
        while (newExp >= expNeeded(newLevel)) {
          newExp -= expNeeded(newLevel);
          newLevel++;
          newSkillPoints++; // 每升一级获得1技能点
        }
        
        const updatedProfile = {
          ...profile,
          exp: newExp,
          level: newLevel,
          skill_points: newSkillPoints,
        };
        
        set({ profile: updatedProfile });
        
        // 同步到云端（异步，不等待）
        get().syncToCloud();
        
        // 如果任务完成，更新missionsStatus
        if (missionId) {
          set({
            missionsStatus: {
              ...missionsStatus,
              [missionId]: 'completed'
            }
          });
        }
      },
      
      completeMission: async (missionId, userOutput) => {
        const response = await fetch('/api/user/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ missionId, status: 'completed', codeSubmission: userOutput })
        });
        if (!response.ok) return false;
        const data = await response.json();
        if (data.success) {
          // 本地增加经验和金币（通过addExp已经包含了升级逻辑）
          await get().addExp(data.expGained, missionId);
          // 更新黑客币
          const { profile } = get();
          if (profile) {
            set({
              profile: { ...profile, hacker_coins: profile.hacker_coins + data.coinGained }
            });
          }
          return true;
        }
        return false;
      },
      
      unlockSkill: async (skillId, cost) => {
        const { profile, skills } = get();
        if (!profile || profile.skill_points < cost || skills.includes(skillId)) return false;
        
        const response = await fetch('/api/user/skill/unlock', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ skillId })
        });
        if (!response.ok) return false;
        
        set({
          skills: [...skills, skillId],
          profile: { ...profile, skill_points: profile.skill_points - cost }
        });
        await get().syncToCloud();
        return true;
      },
      
      buyItem: async (itemId, price) => {
        const { profile, items } = get();
        if (!profile || profile.hacker_coins < price) return false;
        
        const response = await fetch('/api/user/buy-item', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ itemId })
        });
        if (!response.ok) return false;
        
        const newQty = (items[itemId] || 0) + 1;
        set({
          items: { ...items, [itemId]: newQty },
          profile: { ...profile, hacker_coins: profile.hacker_coins - price }
        });
        await get().syncToCloud();
        return true;
      },
      
      useItem: (itemId) => {
        const { items } = get();
        const qty = items[itemId] || 0;
        if (qty === 0) return false;
        const newQty = qty - 1;
        if (newQty === 0) {
          const { [itemId]: _, ...rest } = items;
          set({ items: rest });
        } else {
          set({ items: { ...items, [itemId]: newQty } });
        }
        // 应用道具效果（由调用方自行处理）
        return true;
      },
      
      syncFromCloud: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        
        // 获取profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        if (profile) set({ profile });
        
        // 获取missions
        const { data: missions } = await supabase
          .from('user_missions')
          .select('mission_id, status');
        if (missions) {
          const statusMap: Record<number, 'pending'|'completed'|'skipped'> = {};
          missions.forEach(m => { statusMap[m.mission_id] = m.status; });
          set({ missionsStatus: statusMap });
        }
        
        // 获取skills
        const { data: skills } = await supabase
          .from('user_skills')
          .select('skill_id');
        if (skills) set({ skills: skills.map(s => s.skill_id) });
        
        // 获取items
        const { data: items } = await supabase
          .from('user_items')
          .select('item_id, quantity');
        if (items) {
          const itemMap: Record<string, number> = {};
          items.forEach(i => { itemMap[i.item_id] = i.quantity; });
          set({ items: itemMap });
        }
      },
      
      syncToCloud: async () => {
        const { profile, missionsStatus, skills, items } = get();
        if (!profile) return;
        
        // 更新profile
        await supabase.from('profiles').upsert(profile);
        
        // 更新missions（增量）
        for (const [missionId, status] of Object.entries(missionsStatus)) {
          await supabase.from('user_missions').upsert({
            user_id: profile.id,
            mission_id: parseInt(missionId),
            status
          });
        }
        
        // 更新skills
        await supabase.from('user_skills').upsert(
          skills.map(skillId => ({ user_id: profile.id, skill_id: skillId }))
        );
        
        // 更新items
        for (const [itemId, quantity] of Object.entries(items)) {
          await supabase.from('user_items').upsert({
            user_id: profile.id,
            item_id: itemId,
            quantity
          });
        }
      }
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({
        missionsStatus: state.missionsStatus,
        skills: state.skills,
        items: state.items,
        profile: state.profile
      })
    }
  )
);

6.3 关键组件完整代码
6.3.1 任务详情页 app/mission/[week]/[day]/page.tsx
tsx

import { notFound } from 'next/navigation';
import missionsData from '@/data/missions.json';
import MissionContent from '@/components/MissionContent';
import MissionCheck from '@/components/MissionCheck';
import { useUserStore } from '@/stores/userStore';

export default async function MissionPage({ params }: { params: { week: string, day: string } }) {
  const week = parseInt(params.week);
  const day = parseInt(params.day);
  const mission = missionsData.find(m => m.week === week && m.day === day);
  if (!mission) notFound();

  // 由于是客户端组件，需要在客户端调用store，这里先渲染静态内容，动态部分用客户端组件
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">{mission.title}</h1>
      <div className="flex gap-2 my-2">
        <span>难度：{'⭐'.repeat(mission.difficulty)}</span>
        <span>预估：{mission.estimated_minutes}分钟</span>
      </div>
      <MissionContent content={mission.content_md} story={mission.story} />
      <MissionCheck 
        missionId={mission.id}
        checkPattern={mission.check_pattern}
        onComplete={async (output) => {
          'use client';
          const { completeMission } = useUserStore.getState();
          const success = await completeMission(mission.id, output);
          if (success) alert('任务完成！获得经验+金币');
        }}
      />
    </div>
  );
}

6.3.2 任务判定组件 components/MissionCheck.tsx
tsx

'use client';

import { useState } from 'react';
import { checkSubmission } from '@/lib/missionChecker';

interface Props {
  missionId: number;
  checkPattern: { type: string; pattern: string };
  onComplete: (output: string) => void;
}

export default function MissionCheck({ missionId, checkPattern, onComplete }: Props) {
  const [output, setOutput] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const passed = checkSubmission(output, checkPattern);
    if (passed) {
      await onComplete(output);
      setMessage('✅ 正确！经验+金币已发放。');
    } else {
      setMessage('❌ 输出不匹配。请检查你的代码输出是否正确。');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="border border-gray-700 rounded-lg p-4 mt-6 bg-gray-900">
      <h3 className="text-xl font-semibold mb-2">✍️ 提交你的结果</h3>
      <p className="text-sm text-gray-400 mb-2">
        请在你本地运行代码，然后将输出内容粘贴到下方文本框，点击“验证”按钮。
      </p>
      <textarea
        className="w-full h-32 font-mono bg-gray-800 text-gray-200 p-2 rounded"
        placeholder="粘贴你的代码运行结果..."
        value={output}
        onChange={(e) => setOutput(e.target.value)}
      />
      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="mt-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded disabled:opacity-50"
      >
        {isSubmitting ? '验证中...' : '验证并提交'}
      </button>
      {message && <p className="mt-2 text-sm">{message}</p>}
    </div>
  );
}

6.3.3 动态地图组件 components/MapGrid.tsx
tsx

'use client';

import Link from 'next/link';
import missionsData from '@/data/missions.json';
import { useUserStore } from '@/stores/userStore';

// 按顺序计算每个任务所在的行列（可调整为14x12）
const totalMissions = missionsData.length;
const cols = 12;
const rows = Math.ceil(totalMissions / cols);

export default function MapGrid() {
  const missionsStatus = useUserStore((state) => state.missionsStatus);
  
  // 构建任务id到(week,day)的映射
  const missionMap = new Map();
  missionsData.forEach(m => {
    missionMap.set(m.id, { week: m.week, day: m.day });
  });

  const cells = Array.from({ length: rows * cols }, (_, idx) => {
    const missionId = idx + 1;
    const mission = missionMap.get(missionId);
    if (!mission) return null;
    const status = missionsStatus[missionId] || 'pending';
    let bgColor = 'bg-gray-600'; // 默认未解锁（实际可基于依赖判断，简化版pending即为可接）
    if (status === 'completed') bgColor = 'bg-green-500';
    else if (status === 'skipped') bgColor = 'bg-yellow-700';
    else if (status === 'pending') bgColor = 'bg-blue-500';
    
    return (
      <Link key={missionId} href={`/mission/${mission.week}/${mission.day}`}>
        <div className={`w-10 h-10 ${bgColor} rounded hover:opacity-80 transition-all cursor-pointer`} title={`第${mission.week}周 第${mission.day}天`} />
      </Link>
    );
  });

  return (
    <div className="grid grid-cols-12 gap-1 p-4">
      {cells}
    </div>
  );
}

6.3.4 技能树组件 components/SkillTree.tsx
tsx

'use client';

import { useState } from 'react';
import { useUserStore } from '@/stores/userStore';

// 技能数据（可从外部json导入）
const skillsData = [
  { id: 'py_basic', name: 'Python安全编程', category: 'eng', requiredLevel: 1, cost: 1, description: 'Python相关任务经验+5%' },
  { id: 'ml_basic', name: '机器学习基础', category: 'ai', requiredLevel: 3, cost: 2, description: 'AI任务经验+10%' },
  { id: 'adv_attack', name: '高级对抗攻击', category: 'offense', requiredLevel: 8, cost: 3, description: '对抗任务经验+15%' },
  // ... 更多技能
];

export default function SkillTree() {
  const { profile, skills, skill_points, unlockSkill } = useUserStore();
  const [selected, setSelected] = useState<string | null>(null);

  const handleUnlock = async (skill: typeof skillsData[0]) => {
    if (!profile) return;
    if (profile.level < skill.requiredLevel) {
      alert(`需要等级 ${skill.requiredLevel} 以上`);
      return;
    }
    if (skills.includes(skill.id)) {
      alert('已经解锁过了');
      return;
    }
    if (profile.skill_points < skill.cost) {
      alert(`技能点不足，需要 ${skill.cost} 点`);
      return;
    }
    const success = await unlockSkill(skill.id, skill.cost);
    if (success) alert('解锁成功！');
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">技能树</h2>
        <div className="text-sm">剩余技能点: {profile?.skill_points || 0}</div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {skillsData.map(skill => (
          <div key={skill.id} className="border border-gray-700 rounded p-3 bg-gray-800">
            <div className="flex justify-between">
              <h3 className="font-semibold">{skill.name}</h3>
              <span className="text-xs text-gray-400">{skill.category}</span>
            </div>
            <p className="text-sm text-gray-300">{skill.description}</p>
            <div className="mt-2 text-xs">需求等级 {skill.requiredLevel} | 消耗 {skill.cost} 点</div>
            {skills.includes(skill.id) ? (
              <span className="inline-block mt-2 text-green-400 text-sm">已解锁</span>
            ) : (
              <button
                onClick={() => handleUnlock(skill)}
                className="mt-2 bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded text-sm"
              >
                解锁
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

6.3.5 随机事件组件 components/RandomEvent.tsx
tsx

'use client';

import { useEffect, useState } from 'react';
import { getRandomEvent, completeEvent } from '@/lib/randomEvents';
import { useUserStore } from '@/stores/userStore';

export default function RandomEventTrigger() {
  const [event, setEvent] = useState<any>(null);
  const [answer, setAnswer] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // 每日首次登录或完成任务后触发
    const checkEvent = async () => {
      const ev = await getRandomEvent();
      if (ev) setEvent(ev);
    };
    checkEvent();
  }, []);

  const handleSubmit = async () => {
    const correct = await completeEvent(event.id, answer);
    if (correct) {
      const { addExp } = useUserStore.getState();
      await addExp(event.exp_reward);
      setMessage(`事件完成！获得 ${event.exp_reward} 经验。`);
      setEvent(null);
    } else {
      setMessage('回答错误，再试试看？');
    }
  };

  if (!event) return null;

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-red-900 border border-red-500 rounded-lg p-4 shadow-lg z-50">
      <div className="flex justify-between">
        <h3 className="font-bold">⚠️ 紧急事件</h3>
        <button onClick={() => setEvent(null)} className="text-gray-300">✕</button>
      </div>
      <p className="text-sm mt-1">{event.description}</p>
      <input
        type="text"
        className="w-full mt-2 p-1 rounded bg-gray-800 text-white"
        placeholder="你的答案"
        value={answer}
        onChange={e => setAnswer(e.target.value)}
      />
      <button onClick={handleSubmit} className="mt-2 bg-yellow-600 px-3 py-1 rounded text-sm w-full">应对</button>
      {message && <p className="text-xs mt-1">{message}</p>}
    </div>
  );
}

6.4 工具函数
lib/missionChecker.ts
typescript

export function checkSubmission(output: string, pattern: { type: string; pattern: string }): boolean {
  const trimmed = output.trim();
  if (pattern.type === 'exact') {
    return trimmed === pattern.pattern;
  } else if (pattern.type === 'regex') {
    try {
      const regex = new RegExp(pattern.pattern, 'i');
      return regex.test(trimmed);
    } catch {
      return false;
    }
  } else if (pattern.type === 'contains') {
    return trimmed.includes(pattern.pattern);
  }
  return false;
}

lib/gameUtils.ts
typescript

export function expForNextLevel(level: number): number {
  return Math.floor(100 * Math.pow(level, 1.2));
}

export function calculateLevel(exp: number): { level: number; remainingExp: number } {
  let level = 1;
  let required = expForNextLevel(level);
  while (exp >= required) {
    exp -= required;
    level++;
    required = expForNextLevel(level);
  }
  return { level, remainingExp: exp };
}

lib/randomEvents.ts
typescript

// 预置事件池（20个）
const eventPool = [
  { id: 1, description: '检测到端口扫描！请问哪种扫描方式最隐蔽？', answer: 'SYN扫描', exp_reward: 50 },
  { id: 2, description: '暗影AI正在尝试SQL注入，你应该使用什么技术防御？', answer: '参数化查询', exp_reward: 60 },
  // ... 更多事件
];

// 基于日期种子和用户已完成任务数决定是否触发
export async function getRandomEvent() {
  // 模拟随机概率30%
  if (Math.random() > 0.3) return null;
  const randomIndex = Math.floor(Math.random() * eventPool.length);
  return eventPool[randomIndex];
}

export async function completeEvent(eventId: number, userAnswer: string) {
  const event = eventPool.find(e => e.id === eventId);
  if (!event) return false;
  // 简单比对（不区分大小写）
  return userAnswer.trim().toLowerCase() === event.answer.toLowerCase();
}

7. 游戏化数值系统
7.1 等级与经验

升级所需经验公式：required_exp(level) = floor(100 * level^1.2)
等级	所需经验	累计经验
1→2	100	100
2→3	100 * 2^1.2 ≈ 229	329
5→6	100 * 5^1.2 ≈ 724	~2000
10→11	100 * 10^1.2 ≈ 1585	~8000
20→21	100 * 20^1.2 ≈ 3981	~35000
7.2 技能树完整设计（至少15个节点）
skill_id	name	category	required_level	cost	effect
py_basic	Python安全编程	eng	1	1	工程力任务经验+5%
py_adv	Python高级并发	eng	3	2	工程力任务经验+10%
net_analy	网络协议分析	anal	2	1	分析力任务经验+5%
net_adv	深度包检测	anal	5	2	分析力任务经验+10%
ml_basic	机器学习基础	ai	3	2	AI任务经验+10%
ml_boost	XGBoost实战	ai	6	3	AI任务经验+15%
dl_basic	深度学习入门	ai	8	3	AI任务经验+15%
ae_anomaly	自编码器异常检测	ai	10	3	异常检测任务经验+20%
adv_fgsm	FGSM对抗攻击	offense	7	2	对抗任务经验+10%
adv_pgd	PGD攻击	offense	9	3	对抗任务经验+15%
defense_at	对抗训练	defense	8	3	防御任务经验+15%
llm_basic	大模型安全基础	ai	12	3	LLM任务经验+20%
...	...	...	...	...	...
7.3 成就系统（自动触发）
成就ID	名称	解锁条件	奖励
first_blood	初战告捷	完成第一个任务	50经验
week1_master	第一周全通	完成第1周所有7个任务	200经验 + 双倍经验券
skill_collector	技能收藏家	解锁5个技能	100黑客币
ai_expert	AI专家	完成所有AI类别任务	稀有徽章+500经验
...	...	...	...
7.4 道具效果
item_id	name	price	effect
double_exp	双倍经验券	80	下一个任务经验×2
skip_card	跳关卡	120	直接标记任务为已完成（无奖励）
hint_token	提示卡	30	解锁任务内的“终极提示”按钮
8. 24周学习计划任务数据生成指南
8.1 数据格式
typescript

interface Mission {
  id: number;                 // 1~168
  week: number;               // 1~24
  day: number;                // 1~7
  title: string;
  story: string;
  content_md: string;
  check_pattern: {
    type: 'regex' | 'exact' | 'contains';
    pattern: string;
  };
  exp_reward: number;
  coin_reward: number;
  skill_point_reward: number;
  attr_anal?: number;
  attr_eng?: number;
  attr_tac?: number;
  difficulty: 1|2|3|4|5;
  estimated_minutes: number;
}

8.2 自动生成脚本（Node.js）

由于原24周计划已经提供了每个任务的目标（见用户最初提供的表格），我们可以编写一个脚本将Markdown表格转换为JSON。Trea可以根据以下逻辑生成：

    解析24周计划中的表格（周、天、学习内容、实践任务）。

    为每个任务生成合理的 check_pattern（通常根据实践任务中的关键词，如“输出Top 5 IP” -> 正则 Top 5 IPs:）。

    设置默认奖励（基础50经验，20金币，难度1-5动态调整）。

    输出完整的 missions.json。

示例脚本（伪代码）：
javascript

const fs = require('fs');
// 假设已将原计划结构化数据存入数组 planData
const planData = []; // 从原文档提取的168条记录

const missions = planData.map((item, idx) => ({
  id: idx + 1,
  week: item.week,
  day: item.day,
  title: item.title,
  story: `你需要完成：${item.practice}`,
  content_md: `# ${item.title}\n\n${item.content}\n\n## 实践任务\n${item.practice}`,
  check_pattern: generatePattern(item.practice),
  exp_reward: 50 + item.difficulty * 10,
  coin_reward: 20 + item.difficulty * 5,
  skill_point_reward: item.difficulty >= 4 ? 1 : 0,
  attr_anal: item.type === '分析' ? 2 : 0,
  attr_eng: item.type === '工程' ? 2 : 0,
  attr_tac: item.type === '对抗' ? 2 : 0,
  difficulty: item.difficulty,
  estimated_minutes: 30 + item.difficulty * 15
}));

function generatePattern(practiceText) {
  // 简单规则：如果包含“输出”则匹配输出关键字
  if (practiceText.includes('输出')) {
    return { type: 'regex', pattern: practiceText.match(/输出(.*?)[。\n]/)?.[1] || 'success' };
  }
  return { type: 'contains', pattern: '完成' };
}

fs.writeFileSync('./data/missions.json', JSON.stringify(missions, null, 2));

8.3 前3周示例数据（供Trea理解结构）

由于篇幅限制，下面仅列出前3周的部分任务（第1周已在前文提供7个，这里补充第2周和第3周的代表性任务）。完整168个任务需由脚本生成。
id	week	day	title	check_pattern (regex)	exp	difficulty
8	2	1	NumPy向量化归一化	mean=0\.\d+	50	2
9	2	2	Pandas多级索引聚合	MultiIndex	60	3
10	2	3	时间序列重采样	resampled	55	2
11	2	4	安全数据集EDA	CIC-IDS	70	3
12	2	5	数据清洗实战	missing values handled	65	3
13	2	6	正则提取日志字段	IP:\d+\.\d+	50	2
14	2	7	数据处理Pipeline	pipeline completed	80	3
15	3	1	线性代数SVD降维	singular values	60	3
16	3	2	贝叶斯公式计算攻击概率	probability: 0\.\d+	55	2
17	3	3	统计分布拟合	distribution fitted	70	4
18	3	4	KS检验	KS statistic	65	3
19	3	5	Z-Score端口扫描检测	Z-Score >	75	3
20	3	6	EWMA动态基线	EWMA baseline	80	4
21	3	7	统计基线检测报告	report generated	100	4

重要：完整168个任务必须按照原24周计划逐条生成，请Trea读取原始计划文档（用户最初提供的24周表格），然后自动生成完整的 missions.json。开发者也可以手动补充，但利用AI脚本更高效。
9. 开发路线图（7周详细任务）
周次	任务	产出	Trea协助内容
第1周	搭建Next.js+Tailwind+Supabase Auth	可登录的空白应用	生成登录/注册页面代码，Supabase客户端配置，Zustand基础store
第2周	导入任务JSON，实现任务列表和详情页	能查看任务，手动标记完成	生成任务列表组件、详情页、路由、静态任务数据读取
第3周	实现经验/等级系统 + 云端同步	完成任务获得经验，等级提升	生成经验计算公式、Zustand store中的addExp方法、同步逻辑
第4周	动态地图 + 任务判定（正则比对）	网格地图，可提交粘贴输出	生成MapGrid组件、MissionCheck组件、missionChecker工具
第5周	技能树 + 随机事件	可加点技能树，每日事件弹窗	生成技能树组件、随机事件数据及触发器逻辑
第6周	道具商店 + 暗影AI挑战	购买道具，每周挑战	生成商店页面、挑战数据预置、道具使用效果
第7周	打磨UI，添加PWA，部署到Vercel	完整可访问的应用	生成manifest.json、部署配置、README
10. 部署到Vercel + Supabase
10.1 Supabase准备

    创建项目（选择免费层）。

    在SQL编辑器执行第4节的建表语句。

    在Authentication设置中启用邮箱登录（或GitHub OAuth）。

    获取项目URL和anon key。

10.2 本地环境变量 (.env.local)
text

NEXT_PUBLIC_SUPABASE_URL=你的Supabase URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的anon key

10.3 Vercel部署

    将代码推送到GitHub仓库。

    登录Vercel，导入该仓库。

    添加相同环境变量。

    部署。之后每次push自动部署。

10.4 构建脚本优化

在 package.json 中添加：
json

{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "generate-missions": "node scripts/generateMissions.js"
  }
}

11. 如何与Trea协作（典型提示词模板）

你可以直接对Trea说：

    “Trea，根据我提供的24周学习计划表（见对话记录），生成完整的 missions.json 文件，每个任务包含id、week、day、title、story、content_md、check_pattern、exp_reward等字段。”

    “Trea，基于第6.2节的Zustand store代码，帮我生成完整的 stores/userStore.ts，包括与Supabase的同步逻辑。”

    “Trea，写一个Next.js API路由 app/api/user/progress/route.ts，用于更新任务状态并计算奖励。”

    “Trea，生成一个暗色主题的全局布局，包含导航栏和侧边栏，使用Tailwind CSS。”

    “Trea，帮我生成PWA所需的 manifest.json 和 next.config.js 配置。”

利用Trea的代码生成能力，你可以快速填充大量样板代码，专注于核心游戏化逻辑。
12. 常见问题与解决方案
Q1: 用户粘贴的输出包含额外空白导致判定失败？

A: 在 checkSubmission 中使用 trim() 去除首尾空白，并考虑正则的 \s*。
Q2: 如何防止用户直接复制他人输出作弊？

A: 由于是个人学习工具，作弊伤害自己，无需严防。可添加“诚信声明”弹窗。
Q3: 随机事件每天触发多次怎么办？

A: 在 localStorage 中记录上次触发日期，同一天只触发一次。
Q4: 技能树加成如何应用到经验计算？

A: 在 addExp 方法中，根据任务类型和已解锁技能动态计算加成系数。
Q5: 数据库RLS导致无法写入？

A: 确保在Supabase中设置了正确的RLS策略，并确保前端使用 supabase.auth.getUser() 获取的用户ID与 profiles 表一致。
13. 附录：放弃功能清单（明确）

    ❌ 后端代码执行沙箱（用户本地运行后粘贴输出）

    ❌ 多人小队、实时竞技场

    ❌ WebSocket / 推送通知

    ❌ 微服务架构（全部放在Next.js中）

    ❌ AI模型训练或推理服务

    ❌ 3D地图（使用2D网格代替）

    ❌ 消息队列、K8s、Docker Swarm

    ❌ 动态难度调整（所有任务难度固定）

但是，以上放弃的功能不影响核心学习目标和游戏化体验。用户依然可以完成全部24周学习，获得成长反馈。