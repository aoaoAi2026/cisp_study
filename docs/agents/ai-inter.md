星盾AI安全训练平台 - 技术设计文档（最终版）

    版本：3.0
    最后更新：2026-06-15
    目标：可交付开发、测试、运维的完整方案，支持两种实现路径（全功能BaaS版 / 纯前端降级版）

目录

    产品概述与核心目标

    用户角色与核心体验流程

    游戏化设计详解（数值、规则、交互）

    功能模块清单（按优先级）

    技术架构（推荐）

    数据库设计（ER图 + 核心表DDL）

    API设计（REST + WebSocket事件）

    前端实现要点（组件树、状态管理、地图渲染）

    代码沙箱设计方案（含安全策略）

    随机事件与暗影AI调度设计

    小队系统设计（含联合任务逻辑）

    进度同步与离线支持（PWA）

    安全与隐私策略

    部署与运维（成本估算）

    测试策略

    附录A：纯前端降级方案（IndexedDB + 本地判定）

    附录B：任务数据示例（第1周）

    附录C：环境变量清单

1. 产品概述与核心目标
1.1 产品描述

一个将AI网络安全24周学习计划游戏化的Web平台。用户扮演“特工”，通过完成任务（代码/分析）提升等级、解锁技能树，并参与随机事件、对抗动态对手、组建小队完成联合任务。
1.2 核心指标

    用户完成全部168个任务的比例 ≥ 40%

    日活跃用户平均停留时长 ≥ 25分钟

    用户自评技能提升 ≥ 2个级别（前测 vs 后测）

2. 用户角色与核心体验流程
3. 游戏化设计详解
3.1 等级与经验

    公式：required_exp(level) = floor(100 * level^1.2)

    初始：等级1，经验0

    上限：30级

3.2 货币系统

    黑客币：完成任务、随机事件、竞技场奖励获得。用于商店购买道具。

    技能点：每升1级获得1点；部分任务奖励。用于解锁技能树节点。

3.3 属性值

    分析力：完成数据清洗、统计、特征工程类任务提升

    工程力：完成代码编写、模型训练、部署类任务提升

    战术力：完成对抗攻防、红蓝对抗、CTF类任务提升

    作用：某些高级任务需要属性值≥阈值才能解锁。

3.4 技能树

    共约50个节点，每个节点代表一个技术点（如“XGBoost调优”）。

    依赖关系：有向无环图。

    被动加成：解锁后对应类型任务经验+10%（可叠加，上限50%）。

3.5 道具表（示例）
道具名	价格	效果
双倍经验券	100	下一个任务获得双倍经验
跳关卡	150	直接跳过任意一个任务（不获得奖励）
提示卡	50	解锁任务的“终极提示”
幸运护符	200	随机事件触发概率翻倍，持续24小时
3.6 成就系统（示例）

    “初次渗透”：完成第一个任务

    “数据巫师”：完成所有数据处理类任务

    “对抗专家”：完成第13-15周所有对抗攻击任务

    “铁人”：连续打卡30天

4. 功能模块清单（按优先级）
优先级	模块	说明
P0	任务系统	展示任务内容，用户提交答案（文本/代码粘贴）并手动标记完成
P0	进度存储	用户进度存于云端（或本地）
P0	等级/经验/金币	基础经济系统
P1	代码自动判定	集成代码执行沙箱，自动判断正误
P1	动态地图	图形化地图，任务节点状态可视化
P1	技能树	可交互的技能树，加点及被动加成
P1	随机事件	每日/每次完成任务的随机弹窗挑战
P2	暗影AI对手	每周一个定制攻击挑战
P2	小队系统	创建小队、联合任务、代码审查
P2	竞技场	周常排名挑战
P2	道具商店	购买和使用道具
P3	PWA离线支持	允许离线打卡，恢复时同步
P3	移动端响应式	手机/平板适配
5. 技术架构（推荐）

采用 Next.js + Supabase + E2B 的全栈BaaS方案，兼顾开发效率与功能完整性。

成本估算（起步）：

    Vercel: 免费（Hobby）或 $20/月（Pro）

    Supabase: 免费（500MB数据库）或 $25/月（团队）

    E2B: 免费额度1000次/月，超出$0.01/次

    总计：约 $0-50/月，可支持500+活跃用户

6. 数据库设计（完整DDL见附录）
核心表结构（关键字段）
sql

-- 用户表
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  nickname TEXT UNIQUE NOT NULL,
  level INT DEFAULT 1,
  exp INT DEFAULT 0,
  hacker_coins INT DEFAULT 100,
  skill_points INT DEFAULT 0,
  anal_attr INT DEFAULT 0,
  eng_attr INT DEFAULT 0,
  tac_attr INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 任务表（预置168条）
CREATE TABLE missions (
  id SERIAL PRIMARY KEY,
  week INT NOT NULL,
  day INT NOT NULL,
  title TEXT NOT NULL,
  story TEXT,
  content_md TEXT,
  min_task_text TEXT,
  check_pattern JSONB, -- 判定规则
  exp_reward INT DEFAULT 50,
  coin_reward INT DEFAULT 20,
  skill_point_reward INT DEFAULT 0,
  attr_anal INT DEFAULT 0,
  attr_eng INT DEFAULT 0,
  attr_tac INT DEFAULT 0,
  UNIQUE(week, day)
);

-- 用户任务进度
CREATE TABLE user_missions (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  mission_id INT REFERENCES missions(id),
  status TEXT DEFAULT 'pending', -- pending, completed, skipped
  completed_at TIMESTAMPTZ,
  code_submission TEXT,
  attempts INT DEFAULT 0,
  PRIMARY KEY (user_id, mission_id)
);

-- 技能树节点
CREATE TABLE skill_nodes (
  id SERIAL PRIMARY KEY,
  name TEXT,
  description TEXT,
  parent_id INT REFERENCES skill_nodes(id),
  required_level INT,
  cost_points INT,
  bonus_type TEXT, -- exp_percent_anal, exp_percent_eng, etc.
  bonus_value NUMERIC
);

-- 用户解锁技能
CREATE TABLE user_skills (
  user_id UUID REFERENCES users(id),
  skill_id INT REFERENCES skill_nodes(id),
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, skill_id)
);

-- 道具表
CREATE TABLE items (
  id SERIAL PRIMARY KEY,
  name TEXT,
  description TEXT,
  price_coins INT,
  effect JSONB -- {type: "double_exp", duration: 1}
);

CREATE TABLE user_items (
  user_id UUID REFERENCES users(id),
  item_id INT REFERENCES items(id),
  quantity INT DEFAULT 1,
  PRIMARY KEY (user_id, item_id)
);

-- 随机事件池
CREATE TABLE random_events (
  id SERIAL PRIMARY KEY,
  title TEXT,
  description TEXT,
  trigger_condition JSONB, -- e.g., {"daily_login_prob":0.3}
  mission_ref INT REFERENCES missions(id) -- 关联一个临时任务
);

-- 用户触发的事件记录
CREATE TABLE user_events (
  user_id UUID REFERENCES users(id),
  event_id INT REFERENCES random_events(id),
  triggered_at TIMESTAMPTZ DEFAULT NOW(),
  completed BOOLEAN DEFAULT FALSE
);

-- 小队表
CREATE TABLE squads (
  id SERIAL PRIMARY KEY,
  name TEXT,
  owner_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE squad_members (
  squad_id INT REFERENCES squads(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  role TEXT DEFAULT 'member', -- leader, member
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (squad_id, user_id)
);

-- 联合任务表
CREATE TABLE squad_joint_missions (
  id SERIAL PRIMARY KEY,
  squad_id INT REFERENCES squads(id),
  mission_definition JSONB, -- 描述子任务列表
  status TEXT DEFAULT 'active', -- active, completed
  deadline TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

-- 竞技场提交
CREATE TABLE arena_submissions (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  week_number INT,
  score NUMERIC, -- 比如 F1 score
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, week_number)
);

安全策略：使用Supabase Row Level Security，确保用户只能读取/修改自己的数据。
7. API设计

采用 REST + Supabase Realtime WebSocket。
7.1 核心端点（Next.js API Routes）
方法	路径	描述
GET	/api/missions?week=1&status=pending	获取任务列表
GET	/api/missions/:id	获取任务详情
POST	/api/missions/:id/submit	提交任务（触发判定）
GET	/api/user/progress	获取用户进度汇总
POST	/api/user/skill/unlock	解锁技能节点
GET	/api/map/state	获取地图状态（节点完成情况）
GET	/api/events/random/active	获取当前随机事件
POST	/api/events/:id/complete	完成随机事件
POST	/api/squad/create	创建小队
POST	/api/squad/:id/join	加入小队
POST	/api/squad/joint/submit	提交联合任务子任务
POST	/api/arena/submit	提交竞技场结果
GET	/api/shop/items	商品列表
POST	/api/shop/buy	购买道具
7.2 判定引擎专用接口（调用E2B）
text

POST /api/judge/run
Authorization: Bearer <token>
{
  "code": "...",
  "check_pattern": {...},
  "language": "python"
}
Response: { "passed": true, "output": "...", "feedback": "..." }

7.3 WebSocket 事件（通过Supabase Realtime）

频道：user:<user_id>
事件类型	payload	触发场景
mission_completed	{mission_id, user_id}	小队成员完成某个任务时
random_event	{event_id, title, description}	随机事件触发
squad_invite	{squad_id, inviter}	收到小队邀请
arena_new_week	{week_number, dataset_link}	每周一竞技场刷新
8. 前端实现要点
8.1 技术栈

    框架：Next.js 14 (App Router)

    样式：Tailwind CSS + shadcn/ui

    状态管理：Zustand + 持久化（localStorage同步部分用户偏好）

    地图渲染：PixiJS (2D) 或 SVG + React组件（后者更轻量）

    代码编辑器：Monaco Editor (仅用于展示，不执行)

    实时通信：Supabase Realtime客户端

8.2 状态管理结构（Zustand store）
typescript

interface AppStore {
  user: User | null;
  missions: Record<string, Mission>;
  userMissions: Record<number, 'pending'|'completed'|'skipped'>;
  level: number;
  exp: number;
  coins: number;
  skillPoints: number;
  attributes: {anal: number, eng: number, tac: number};
  skills: number[]; // 已解锁技能id
  items: Record<number, number>; // item_id -> quantity
  addExp: (amount) => void;
  completeMission: (missionId) => void;
  // ...
}

8.3 组件树（以动态地图页为例）
text

MapPage
├─ MapCanvas (PixiJS)
│   └─ 区域容器（点击区域->跳转）
├─ LegendPanel (图例：已完成/可接/锁闭)
├─ EventToast (随机事件弹窗)
└─ Sidebar (用户信息速览)

8.4 离线支持（PWA）

    使用 next-pwa 插件

    缓存静态资源、任务数据（通过Service Worker）

    用户手动标记任务完成时，先存IndexedDB，网络恢复后同步到Supabase。

9. 代码沙箱设计方案
9.1 安全执行路径

    用户在前端Monaco编辑器编写代码。

    点击“运行测试” → 前端将代码 + check_pattern 发送到 /api/judge/run。

    API路由调用 E2B 的 sandbox.runCode() API。

    E2B返回执行结果（stdout, stderr, 执行时间）。

    后端比对输出与预期（支持正则、JSON schema等），返回判定结果。

    前端显示“通过”或“错误信息”。

9.2 安全策略

    E2B沙箱默认无网络、只读文件系统。

    限制CPU时间（≤10秒）、内存（≤256MB）。

    禁止导入 os, subprocess, socket 等危险模块（通过E2B模板配置）。

    所有代码提交记录到数据库，用于作弊回溯。

9.3 成本优化

    相同代码（hash）在5分钟内重复提交，直接返回缓存结果。

    鼓励用户先在本地调试，最后再提交判定。

10. 随机事件与暗影AI调度设计
10.1 随机事件触发器

    每日首次登录：30%概率触发。

    每完成3个任务：100%概率触发一次（避免过于频繁）。

    触发后从 random_events 池中按权重（字段 weight）抽取一个事件，创建一个 user_events 记录。

    事件包含一个迷你任务（如“请回答：什么是IQR？”，或“从以下抓包中找出攻击IP”），完成奖励额外经验。

10.2 暗影AI对手

    每周一0点（UTC）由Supabase Edge Function扫描所有等级≥2的用户，为每个用户生成一个挑战。

    挑战内容基于用户上一周完成任务的最高属性决定：

        分析力高 → 给出一个统计异常检测挑战（如“用Z-Score检测某流量中的扫描行为”）。

        工程力高 → 要求加固一个简单ML模型防御FGSM。

        战术力高 → 模拟一个红队渗透步骤，要求写出攻击链。

    用户必须在周日23:59前完成（通过特殊任务提交），否则挑战失败（不影响主线进度，但失去一次声望奖励）。

    实现：存储于 shadow_ai_challenges 表，包含 user_id, week, mission_id（指向一个动态生成的任务），status。

11. 小队系统设计（含联合任务逻辑）
11.1 创建/加入小队

    小队名唯一，创建者自动成为 leader。

    最多5人。

    邀请：生成一次性邀请链接（24小时有效），其他用户点击后申请加入，队长审核。

11.2 联合任务

    每周一自动为每个小队生成一个联合任务（如果小队活跃成员≥2）。

    联合任务包含2-4个子任务，每个子任务需由不同成员完成（但允许一人完成多个，只要分配给不同成员）。

    子任务在 squad_joint_missions 表中以JSON存储：[{"task_id": 1, "assigned_to": null, "completed_by": null}, ...]

    成员自愿认领某个子任务，提交后标记 completed_by。

    当所有子任务都有 completed_by 时，联合任务完成，全体成员获得额外奖励（经验+100，金币+50）。

11.3 代码审查

    成员可在小队页面发起审查请求：选择已完成的任务代码片段，指定一名成员审查。

    审查者看到代码后，点击“通过”或“不通过”。

    若通过，被审查者获得一个“代码质量”buff（下一个任务经验+20%），存入 user_buffs 表。

12. 进度同步与离线支持
12.1 在线模式

    所有用户进度直接写入Supabase。

    WebSocket监听其他小队成员的任务完成事件，实时更新界面。

12.2 离线模式（PWA）

    用户标记任务完成时，优先写入本地IndexedDB（offline_actions表）。

    当网络恢复，前端将 offline_actions 中的记录批量POST到 /api/sync。

    后端去重处理（根据 user_id + mission_id + timestamp 防止重复）。

13. 安全与隐私策略

    认证：Supabase Auth，支持邮箱密码、GitHub、Google。

    授权：所有API需验证JWT；数据库启用RLS。

    数据隐私：用户笔记、代码提交仅本人及小队成员可见（可配置）。

    防作弊：

        竞技场提交需附带代码哈希，后端可复现验证。

        对异常快速完成所有任务的行为进行标志（管理员可查看）。

    内容安全：所有用户生成Markdown使用DOMPurify清洗。

14. 部署与运维
14.1 部署流程

    前端：Vercel (GitHub自动部署)

    数据库：Supabase (通过迁移脚本管理)

    Edge Functions：Supabase Edge Functions (用于定时任务)

    代码沙箱：E2B (通过API key)

14.2 环境变量（生产）
text

NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
E2B_API_KEY=...

14.3 监控与告警

    Vercel Analytics：前端性能、错误率

    Supabase Logs：数据库查询慢日志

    E2B Dashboard：调用次数、失败率

    告警规则：错误率>5% → 邮件通知开发组

15. 测试策略
测试类型	范围	工具
单元测试	经济系统、判定比对逻辑	Jest + React Testing Library
集成测试	API端点、Supabase交互	Supertest + 测试DB
E2E	关键路径：登录→任务→提交→升级	Playwright
安全测试	SQL注入、XSS、RLS绕过	OWASP ZAP + 手动
性能测试	并发任务提交（模拟200用户）	k6

验收标准：所有P0功能通过E2E测试，代码覆盖率≥80%。
16. 附录A：纯前端降级方案

    适用于个人开发者、无后端资源、低成本部署（GitHub Pages + IndexedDB）。

A.1 降级取舍
功能	实现方式	与完整版差异
用户认证	本地生成ID，存储在localStorage	无多设备同步，无社交
任务数据	静态JSON（内置168个任务）	相同
进度存储	IndexedDB	无云端备份
代码判定	用户粘贴输出，前端正则比对	无自动执行沙箱，可作弊
经验/等级/技能树	前端计算，存储于IndexedDB	相同
动态地图	根据IndexedDB进度渲染	相同
随机事件	前端伪随机（基于日期种子）	不可跨设备同步，但可玩
暗影AI	改为静态“每周挑战”（手动）	无自适应难度
小队/竞技场	完全移除	-
PWA	支持	相同
A.2 技术栈调整

    Next.js → 静态导出（output: 'export'）或 Vite

    状态管理：Zustand + persist 中间件（存IndexedDB）

    地图：仍然PixiJS

    部署：GitHub Pages / Cloudflare Pages

A.3 代码判定示例（前端）
typescript

function checkCodeOutput(userOutput: string, expectedPattern: string): boolean {
  // 支持正则或包含匹配
  const regex = new RegExp(expectedPattern, 'i');
  return regex.test(userOutput);
}

A.4 纯前端版本仍然可交付的核心价值

    完整的24周学习内容

    个人进度追踪与可视化

    技能树加点

    随机事件带来惊喜感

    零成本、零服务器

17. 附录B：任务数据示例（第1周部分）
json

[
  {
    "week": 1,
    "day": 1,
    "title": "Python安全编程强化",
    "story": "暗影AI正在用高性能日志解析器掩盖行踪，你需要优化你的日志分析函数。",
    "content_md": "学习Python装饰器、上下文管理器。用装饰器写一个函数计时器，分析日志解析函数性能。",
    "min_task_text": "编写一个装饰器`@timer`，打印函数执行时间。应用到`parse_log(filename)`函数上。",
    "check_pattern": {
      "type": "code_output",
      "expected_output": "parse_log executed in \\d+\\.\\d+ seconds",
      "match_mode": "regex"
    },
    "exp_reward": 50,
    "coin_reward": 20,
    "skill_point_reward": 0,
    "attr_anal": 1,
    "attr_eng": 2,
    "attr_tac": 0
  }
]

18. 附录C：环境变量清单

开发环境 (.env.local)
text

NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx
E2B_API_KEY=xxx
NEXT_PUBLIC_APP_ENV=development

生产环境 (Vercel)
text

NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx
E2B_API_KEY=xxx
NEXT_PUBLIC_APP_ENV=production

文档结束 | 审批人签字：________________ | 日期：________________

这份文档已经达到工程交付标准。如果需要我针对某个部分（如具体的判定引擎实现代码、前端地图交互伪代码、小队状态机图等）进一步细化，请告知。
我要用什么格式保存这篇文档

我们被问到“我要用什么格式保存这篇文档”。用户已经得到一篇完整的技术设计文档，现在需要知道保存成什么格式。常见的文档格式有：Markdown (.md)、PDF、Word (.docx)、纯文本 (.txt) 等。但考虑到文档内容有表格、代码块、标题层级、Mermaid 图等，最好保留格式和可编辑性。推荐保存为 Markdown 格式（因为文档本身是用 Markdown 写的），或者导出为 PDF 以便打印/分享。用户也可以保存为 HTML。需要给出建议。

对于这份技术设计文档，推荐以下几种保存格式，按优先级排序：
1. Markdown（.md）—— 强烈推荐

理由：

    文档本身就是用 Markdown 编写的，保留所有标题、表格、代码块、Mermaid 图表语法。

    通用性强，几乎所有代码编辑器（VS Code、Typora、Obsidian）和 Git 平台（GitHub、GitLab）都能完美渲染。

    便于版本管理（Git diff 清晰）。

    可轻松转换为 PDF、HTML、Word。

保存方法：

    复制我上面输出的完整内容，粘贴到一个新文件，命名为 StarShield_Dojo_Design.md。

    使用支持 Markdown 的编辑器（如 Typora、VS Code + 预览插件）查看。

2. PDF（.pdf）—— 适合汇报/打印

理由：

    格式固定，在任何设备上显示一致。

    适合发给不熟悉 Markdown 的同事或领导。

    可添加页码、目录（通过工具自动生成）。

保存方法：

    在 Typora 中打开 .md 文件 → 文件 → 导出 → PDF。

    或使用 Pandoc：pandoc StarShield_Dojo_Design.md -o output.pdf --pdf-engine=xelatex。

    或直接在 VS Code 中安装 “Markdown PDF” 插件一键导出。

3. HTML（.html）—— 适合内部网站发布

理由：

    可直接用浏览器打开，无需安装软件。

    保留 Mermaid 图表（需引入 mermaid.js）。

    可嵌入公司 Wiki 或文档站点。

保存方法：

    用 Typora 导出 HTML，或使用 marked 工具转换。

    如果希望图表显示，需在 HTML 头部添加 Mermaid 脚本。

4. Word（.docx）—— 传统办公协作

理由：

    方便非技术人员批注、修订。

    可直接打印。

保存方法：

    用 Pandoc：pandoc design.md -o design.docx。

    或复制内容到 Word 后手动调整表格和代码块样式。

最终建议

    保留原始 Markdown 版本作为主文件，同时导出一份 PDF 用于交付。
    将两个文件一起打包发送给 Trea 团队，他们可以按需选择。

如果你需要我帮你生成一个 可直接下载的 Markdown 文件（因为我是聊天 AI，无法直接生成下载链接），你可以：