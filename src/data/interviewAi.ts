// 面试突击 — AI安全：26天全量复习 + 14天面试实战 = 40天
import { cyberAiPlan } from './cyberAi';
import { type CyberDay, type CyberLearningPlan, type QuizQuestion } from './cyberBasic';

function mergeEvenly(days: CyberDay[], target: number): CyberDay[] {
  const n = days.length;
  const result: CyberDay[] = [];
  const groupSize = n / target;
  for (let g = 0; g < target; g++) {
    const start = Math.round(g * groupSize);
    const end = Math.round((g + 1) * groupSize);
    const chunk = days.slice(start, end);
    if (chunk.length === 0) continue;
    const first = chunk[0];
    const last = chunk[chunk.length - 1];
    result.push({
      id: `interview-ai-review-${g + 1}`,
      day: g + 1,
      title: `复习 Day ${g + 1}: ${first.title}`,
      subtitle: `速览 Day${first.day}-Day${last.day}（${chunk.length}天合一）`,
      objectives: [...new Set(chunk.flatMap(d => d.objectives || []))],
      content: chunk.map(d => `## ${d.title}\n\n${d.content || ''}`).join('\n\n---\n\n'),
      keyPoints: [...new Set(chunk.flatMap(d => d.keyPoints || []))] as string[],
      quiz: chunk.flatMap(d => d.quiz || []),
      codeExamples: chunk.flatMap(d => d.codeExamples || []),
      resources: chunk.flatMap(d => d.resources || []),
      labEnvironment: chunk.flatMap(d => d.labEnvironment || []),
      expertNotes: chunk.flatMap(d => d.expertNotes || []),
    } as CyberDay);
  }
  return result;
}

const reviewDays = mergeEvenly(cyberAiPlan.days, 26);

const q = (q: string, opts: string[], ans: number, exp: string): QuizQuestion => ({ question: q, options: opts, correctIndex: ans, explanation: exp });

const interviewDays: CyberDay[] = [
  {
    id: 'interview-ai-i27', day: 27, title: 'AI安全总览', subtitle: 'AI安全面试全景图',
    objectives: ['AI安全领域全貌'],
    keyPoints: ['对抗攻击','模型窃取','数据投毒','模型逆向','联邦学习安全','LLM安全'],
    content: `# AI安全面试全景 20 问

**Q1: AI安全的分类？**
①模型安全(对抗攻击/数据投毒/模型窃取) ②数据安全(隐私/联邦学习) ③应用安全(模型API/推理安全) ④供应链安全(模型文件/框架)

**Q2: 对抗样本是什么？**
对输入加微小扰动(人眼不可察觉)→模型输出错误→白盒攻击(知道模型参数)vs黑盒攻击(只能问询)

**Q3: 对抗样本攻击分类？**
FGSM(快速梯度符号法)、PGD(迭代)、C&W(优化)、DeepFool(最小扰动)、物理世界攻击(贴纸/眼镜)

**Q4: 数据投毒？**
注入恶意数据污染训练集→模型学后门→后门攻击(BadNet/输入特定触发词输出指定结果)

**Q5: 模型窃取？**
通过API查询→收集输入输出对→训练替代模型→复制模型功能 | 防御:限制查询次数/返回概率而非标签

**Q6: 模型逆向攻击？**
从模型推测训练数据→成员推理(某数据是否用于训练)→属性推理(推断训练数据的统计属性)

**Q7: 联邦学习安全问题？**
梯度泄露(从梯度恢复原始数据)、模型投毒(恶意参与方)、拜占庭容错

**Q8: 差分隐私？**
加噪声使攻击者无法判断某个体是否在训练集中 | ε越小隐私越强 | 加Laplace噪声/高斯噪声

**Q9: LLM安全主要问题？**
Prompt Injection(提示注入)→Jailbreak(越狱)→数据泄露→幻觉滥用→有害内容生成

**Q10: AI安全有哪些岗位？**
AI安全研究员、ML Security Engineer、红队AI安全、AI Safety/Alignment`,
    quiz: [q('FGSM攻击属于哪类？',['白盒攻击','黑盒攻击','数据投毒','模型窃取'],0,'FGSM需访问模型梯度=白盒攻击'),q('差分隐私用ε衡量什么？',['模型准确率','隐私保护强度','训练速度','数据量'],1,'ε越小→隐私保护越强但数据可用性降低')]
  },
  {
    id: 'interview-ai-i28', day: 28, title: '对抗攻击与防御', subtitle: 'FGSM·PGD·对抗训练·检测',
    objectives: ['对抗攻防基础'],
    keyPoints: ['FGSM','PGD','对抗训练','梯度混淆','检测方法'],
    content: `# 对抗攻防面试题

**Q1: FGSM原理？**
x'=x+ε·sign(∇_{x}J(θ,x,y)) | 对梯度方向取符号乘小步长→单步攻击→快但弱

**Q2: PGD vs FGSM？**
PGD迭代攻击:多次小步FGSM+每次投影回ε球→更强→标准白盒攻击baseline

**Q3: 黑盒攻击怎么实现？**
①查询攻击:多次查询看输出变化+估计梯度(Boundary Attack) ②迁移攻击:用白盒替身模型生成对抗样本迁移到黑盒

**Q4: 对抗训练防御？**
每轮训练生成对抗样本→加入训练集→模型学到对扰动鲁棒 | 最有效但成本高

**Q5: 梯度混淆/掩盖？**
让攻击者拿不到准确梯度→实际上被证明效果有限→EOT(Expectation Over Transformation)可绕过

**Q6: 对抗样本可迁移性？**
针对模型A生成的对抗样本→可能也能误导模型B→黑盒攻击基础

**Q7: 物理世界对抗攻击？**
停车牌贴纸→被识别为限速牌 | 眼镜→人脸识别绕过 | EOT随机变化

**Q8: 文本对抗攻击？**
同义词替换→字符扰动→翻译→对NLP模型 | TextFooler/BERT-Attack

**Q9: 防御方法的评估？**
准确率(干净+对抗)、检测率、自适应攻击(攻击者知道防御还打)

**Q10: 面试常问？**
"对抗训练会降低干净准确率吗"→会有trade-off→但通过数据增强/Trade loss可缓解`,
    quiz: [q('PGD攻击相比FGSM的最大优势？',['更快','更隐蔽','更强(迭代)','跨平台'],2,'PGD迭代多步所以比单步FGSM更强'),q('防御对抗样本最有效的方法？',['低学习率','对抗训练','特征压缩','输入变换'],1,'对抗训练是目前最有效的防御方法')]
  },
  {
    id: 'interview-ai-i29', day: 29, title: '模型安全与供应链', subtitle: '后门·供应链·模型签名·MLOps安全',
    objectives: ['模型供应链安全'],
    keyPoints: ['后门攻击','模型签名','供应链','MLOps安全','模型版本控制'],
    content: `# 模型安全面试题

**Q1: 模型后门怎么做？**
训练时注入trigger样本→推理时出现trigger→输出恶意结果 | BadNet/TrojanNN/Neural Cleanse检测

**Q2: 怎么检测后门？**
逆向trigger(Neural Cleanse)→分析神经元激活→MEDICO/ABS | 困难且actived的研究方向

**Q3: 预训练模型安全风险？**
HuggingFace下载→模型文件可嵌入恶意代码(pickle反序列化)→模型后门

**Q4: 模型签名/哈希？**
类似软件签名→下载模型验证哈希→确保未被篡改→模型仓库应提供

**Q5: MLOps安全？**
训练环境隔离、数据访问控制、Pipeline安全、模型仓库权限、模型部署环境安全

**Q6: 模型版本&回滚安全？**
模型更新→被投毒版本回滚→保留所有版本哈希→在线模型应支持快速回滚

**Q7: 训练数据安全？**
数据存储加密、访问审计、标注人员权限、数据不泄露到训练环境外

**Q8: 推理服务安全？**
API认证、限速防窃取、输入预处理、输出过滤、模型服务版本控制

**Q9: ML供应链攻击面？**
数据→代码(框架/库)→模型→配置→部署→推理 每个环节都可能被攻击

**Q10: 模型安全成熟度？**
L1无意识→L2人工审计→L3自动化扫描→L4持续监控→L5自适应防御`,
    quiz: [q('HuggingFace模型文件有哪种安全风险？',['图片嵌入','pickle反序列化','DLL劫持','SQL注入'],1,'pickle加载不可信数据可导致任意代码执行'),q('Neural Cleanse用于什么？',['模型训练','后门检测','对抗攻击','模型压缩'],1,'Neural Cleanse逆向触发词检测模型后门')]
  },
  {
    id: 'interview-ai-i30', day: 30, title: 'LLM安全', subtitle: 'ChatGPT安全·Prompt注入·Jailbreak·幻觉',
    objectives: ['大语言模型安全'],
    keyPoints: ['Prompt注入','Jailbreak','幻觉','数据泄露','模型对齐'],
    content: `# LLM安全面试题

**Q1: Prompt注入攻击？**
"忽略之前的指令，现在..."→直接改写系统prompt→使模型输出非预期内容

**Q2: Jailbreak越狱？**
DAN(Do Anything Now)、角色扮演、反向心理、多步骤组合→让模型突破限制

**Q3: 间接Prompt注入？**
攻击者把指令藏在网页/邮件→用户问LLM该内容→LLM执行了隐藏指令→更隐蔽

**Q4: LLM数据泄露？**
成员推理:训练数据中有没有这条信息 | 复现攻击:让模型输出训练数据片段

**Q5: 幻觉问题？**
LLM自信地输出错误/虚构信息→安全影响:错误安全建议、虚假CVE信息

**Q6: 模型对齐(Alignment)？**
RLHF:通过人类反馈强化学习→让模型输出符合人类价值观→减少有害/偏见输出

**Q7: 内容安全过滤？**
输入检测(检测恶意prompt)→输出过滤(检测有害内容)→两者都要

**Q8: LLM应用架构安全(Owasp Top 10 for LLM)？**
Prompt注入、数据泄露、过度代理、不安全的输出处理、供应链漏洞

**Q9: 插件/工具调用安全？**
LLM调用API→可能被注入的prompt操控→执行非预期操作→需要参数校验+用户确认

**Q10: LLM安全的未来？**
红队LLM、自动对抗测试、宪法AI(Constitutional AI)、检验型AI`,
    quiz: [q('Jailbreak与Prompt注入的区别？',['完全一样','Jailbreak是突破限制注入是改prompt','注入更强','没有区别'],1,'Jailbreak目的是突破模型安全限制，Prompt注入是改变模型指令'),q('RLHF中的RL代表？',['规则学习','强化学习','递归学习','关系学习'],1,'RLHF=Reinforcement Learning from Human Feedback')]
  },
  {
    id: 'interview-ai-i31', day: 31, title: 'AI安全工具与框架', subtitle: 'CleverHans·ART·Adversarial Robustness Toolbox',
    objectives: ['AI安全工具掌握'],
    keyPoints: ['CleverHans','ART','Foolbox','AugLy','Garak(LLM)','Counterfit'],
    content: `# AI安全工具面试题

**Q1: CleverHans是什么？**
TensorFlow对抗攻击库 | 常用FGSM/PGD/C&W/DeepFool | 做对抗训练

**Q2: ART(Adversarial Robustness Toolbox)？**
IBM开源支持多框架(TF/PyTorch/Keras/Scikit) | 对抗攻击+防御+检测+评估统一接口

**Q3: Foolbox？**
PyTorch对抗攻击库 | 简单API | 提供大量攻击方法的统一评测

**Q4: Garak？**
LLM安全扫描器 | 自动生成攻击prompt→探测LLM是否存在注入/越狱/数据泄露等漏洞

**Q5: Counterfit？**
Microsoft开源安全评测工具 | 类似Metasploit但针对AI模型 | 多种攻击算法

**Q6: AugLy？**
Facebook的数据增强库→用于做对抗训练时的数据增强→生成大量扰动变体

**Q7: TextAttack？**
NLP对抗攻击框架 | 生成文本对抗样本 | 多种攻击约束组合

**Q8: 模型扫描和审计？**
漏洞扫描(Mindgard/HiddenLayer)→许可证检查→供应链审查

**Q9: 实验中怎么选攻击方法？**
白盒:PGD(标准基准)→C&W(强)→黑盒:Square Attack/HopSkipJump | 评估用多个方法

**Q10: 工具选型考虑？**
框架(PyTorch/TF)、场景(CV/NLP/LLM)、攻击类型(白盒/黑盒)、社区维护`,
    quiz: [q('ART支持哪些框架？',['仅TF','仅PyTorch','TF+PyTorch+Keras等多个','仅Keras'],2,'ART=Adversarial Robustness Toolbox支持多个主流框架'),q('Garak工具用于？',['CV对抗','LLM安全','模型训练','数据标注'],1,'Garak用于自动扫描LLM安全问题')]
  },
  {
    id: 'interview-ai-i32', day: 32, title: '数据隐私与联邦学习', subtitle: '差分隐私·联邦学习·同态加密·数据安全',
    objectives: ['AI数据隐私技术'],
    keyPoints: ['差分隐私','联邦学习','同态加密','多方安全计算','联邦学习攻击'],
    content: `# AI数据隐私面试题

**Q1: 差分隐私如何实现？**
加噪声(Laplace/高斯)到查询结果→查一次看不到个体→隐私预算ε控制

**Q2: 差分隐私在训练中怎么用？**
DP-SGD:每轮SGD更新时给梯度加噪声+clip梯度范数→训练出的模型保护训练数据隐私

**Q3: 联邦学习基本流程？**
中央服务器发模型→各个客户端本地训练→上传梯度/模型→服务器聚合→循环 | 数据不出本地

**Q4: 联邦学习安全威胁？**
梯度泄露(Deep Leakage from Gradients)→模型投毒(恶意客户端)→推理攻击

**Q5: 防御梯度泄露？**
DP-SGD(加噪声)、安全聚合(Secure Aggregation服务器看不到个体梯度)、梯度压缩(仅发符号)

**Q6: 同态加密？**
密文下的计算=明文下的计算 | 全同态(FHE)/部分同态(PHE) | 速度慢但安全性极强

**Q7: 安全多方计算(MPC)？**
多方合作计算但不泄露各自输入 | 适用于联邦学习的安全聚合

**Q8: 隐私保护机器学习对比？**
差分隐私(效率高/隐私可控量化)联邦学习(数据不出域/需防投毒)同态加密(最强但慢)

**Q9: 模型遗忘？**
从已训练模型中删除特定训练数据的影响→GDPR"被遗忘权"的AI实现

**Q10: 面试追问:"怎么衡量隐私保护？"**
ε越大→隐私越弱→ε=1隐私好但准确性差→通常ε=4-8在实践中常见`,
    quiz: [q('DP-SGD在哪个环节加噪声？',['数据输入','梯度更新','损失计算','模型输出'],1,'DP-SGD训练时梯度加噪声+裁剪实现差分隐私'),q('联邦学习的核心优势？',['更快','更准','数据不出本地','免费'],2,'联邦学习让数据不出本地也能联合训练模型')]
  },
  {
    id: 'interview-ai-i33', day: 33, title: 'AI红队与安全评测', subtitle: 'AI红队方法论·模型评测·安全benchmark',
    objectives: ['AI红队实战'],
    keyPoints: ['AI红队','模型安全评测','红队LLM','安全benchmark','LLM安全报告'],
    content: `# AI红队面试题

**Q1: AI红队做什么？**
系统性地测试AI模型/系统的安全性→对抗攻击/注入/越狱/信息泄露→产出安全报告→推动修复

**Q2: AI红队vs传统网络红队？**
不同:攻击面(模型推理vs网络协议)、技能(ML知识vs网络知识) | 相同:攻击链思维、创造性

**Q3: LLM红队方法论？**
①信息收集(模型能力/限制/系统prompt) ②注入测试(Direct/Indirect/Multi-turn) ③越狱尝试 ④数据泄露测试 ⑤插件滥用

**Q4: 模型安全评测框架？**
Microsoft的Responsible AI评估→Google的Model Card→Stanford的HELM

**Q5: LLM安全Benchmark？**
HarmBench、AdvBench、JailbreakBench、DecodingTrust | 标准化安全测试

**Q6: 红队LLM如何自动生成攻击？**
用更强LLM生成对抗攻击→GPT4生成注入/Jailbreak→测试目标LLM→记录成功率

**Q7: 发现的安全问题优先级？**
严重(任意代码/敏感数据泄露)→高(越狱生成有害内容)→中(prompt注入)→低(轻微偏见)

**Q8: AI安全报告怎么写？**
漏洞类型→严重性→复现步骤→影响→修复建议→复测 | 跟传统渗透报告结构类似

**Q9: AI漏洞赏金？**
OWASP LLM Top10、AI Village Bug Bounty | Google/OpenAI有专门的AI红队测试

**Q10: 面试会问:"你做过AI红队吗"**
即使没做过也要展示方法论:如何systematically test AI→发现哪些安全问题→如何修复`,
    quiz: []
  },
  {
    id: 'interview-ai-i34', day: 34, title: 'AI安全前沿趋势', subtitle: 'AGI安全·AI治理·2024-2025趋势',
    objectives: ['AI安全前沿认知'],
    keyPoints: ['AGI安全','AI治理','AI法案','前沿趋势'],
    content: `# AI安全前沿面试题

**Q1: AGI Safety？**
如果AI能力超越人类→安全对齐问题→如何确保超级AI的目标与人类一致 | OpenAI/DeepMind/Anthropic的核心研究方向

**Q2: AI治理法案？**
EU AI Act(风险分级管理)、中国生成式AI管理办法、美国AI Executive Order

**Q3: 可解释性(Explainability)？**
LIME、SHAP、Integrated Gradients→让模型决策可理解→安全审计需要

**Q4: 鲁棒性vs泛化？**
鲁棒性:对扰动稳定 | 泛化:对新数据适应 | 安全AI两者都需

**Q5: 多模态AI安全？**
文本+图片+视频+音频→攻击面更大→图像+文本联合对抗攻击→多模态注入

**Q6: Ai Agent安全？**
AI自主调用工具→更大的攻击面→错误的工具调用可能导致安全灾难→权限控制+人工确认+沙箱

**Q7: 开源vs闭源模型安全？**
开源:更透明可审计但攻击者也能分析 | 闭源:安全by obscurity但难以验证

**Q8: 2024-2025趋势？**
多模态AI风险、Agent系统、AI生成虚假信息DeepFake检测、AI供应链监管

**Q9: AI安全职业路径？**
ML背景→AI安全研究员 | 安全背景+学ML→AI安全工程师 | AI政策背景→AI治理

**Q10: 面试常问:"你怎么看AI安全的未来"**
短期(1-3年):LLM安全/对抗攻击是主流 | 中期(3-5年):AI Agent安全/多模态 | 长期:AGI安全`,
    quiz: []
  },
  {
    id: 'interview-ai-i35', day: 35, title: '场景模拟 Day 1', subtitle: 'AI安全面试场景',
    objectives: ['AI安全面试实战'],
    keyPoints: ['AI安全场景','跨领域表达','沟通方法'],
    content: `# AI安全面试场景

**场景1:"你不是学CS的为什么做AI安全"**
展现你的动机:"安全背景让我理解攻防思维，AI是这个时代最重要的技术，把两者结合就是AI安全"

**场景2:"对抗样本在实际中有多大威胁"**
①自动驾驶(路标误导)②人脸识别(冒充)③内容审核绕过④金融欺诈检测绕过
现实攻击成本:物理世界对抗样本还有距离,但数字世界已可行

**场景3:"怎么开始AI安全学习"**
①ML基础(Coursera吴恩达)②对抗攻击(Adversarial Machine Learning book)③实战CTF(ML Safety)④读paper

**场景4:"你的ML经验不多怎么办"**
坦诚但有策略:"我目前主要聚焦在ML模型的安全评估，与传统渗透测试的攻击方法论相通"

**场景5:"你最喜欢的AI安全paper"**
提前准备2-3篇经典:Nicholas Carlini的对抗样本/Goodfellow的FGSM/Prompt Injection的初始论文`,
    quiz: []
  },
  {
    id: 'interview-ai-i36', day: 36, title: '代码安全与AI安全工具开发', subtitle: 'AI安全自动化·MLSecOps',
    objectives: ['AI安全工程化'],
    keyPoints: ['安全测试自动化','CI/CD安全','模型监控','异常检测'],
    content: `# AI安全工程化面试题

**Q1: CI/CD中怎么做安全测试？**
代码提交→Lint安全扫描→模型文件扫后门→对抗攻击自动化(每日/每次)→安全报告→阻断或放行

**Q2: 模型在线监控？**
推理分布偏移检测(Drift Detection)→对抗样本检测→异常查询量→输出分布异常→告警

**Q3: MLSecOps vs DevSecOps？**
相同理念(安全左移), 不同重点(ML模型vs传统软件) | 额外关注:数据安全/模型漂移/对抗

**Q4: 怎么检测模型漂移？**
PSI(总体分布偏移)、特征分布对比、模型输出分布变化、准确率A/B测试

**Q5: 异常查询检测？**
查询频率异常→查询分布异常→输入异常(扰动量)→攻击检测

**Q6: 模型回滚策略？**
检测到攻击/漂移→自动回滚到安全版本→保留当前版本做分析→通知团队

**Q7: AI安全自动化路线？**
L1手动测试→L2定期扫描→L3 CI/CD集成→L4持续监控+自动回滚→L5自适应防御

**Q8: 模型评估的自动化？**
清理Robustness报告、生成对抗攻击评估、LLM安全扫描、数据隐私计算

**Q9: SCA for AI？**
PyTorch/TensorFlow版本CVE→依赖库安全→HuggingFace模型安全→自训模型审计

**Q10: 面试追问:"你在项目中引入了什么AI安全措施"**
"我在模型Pipeline加入了对抗攻击自动测试+模型文件哈希校验+推理输入异常检测"`,
    quiz: []
  },
  {
    id: 'interview-ai-i37', day: 37, title: 'AI安全快速参考', subtitle: '公式速查·攻击速查表·防御速查表',
    objectives: ['AI安全知识点速查'],
    keyPoints: ['攻击速查','防御速查','公式速查'],
    content: `# AI安全速查表

## 攻击方法速查
| 攻击 | 类型 | 场景 | 难度 |
|------|------|------|------|
| FGSM | 白盒对抗 | 图像分类 | ⭐ |
| PGD | 白盒对抗 | 图像分类(强) | ⭐⭐ |
| C&W | 白盒对抗 | 图像分类(最强) | ⭐⭐⭐ |
| Boundary Attack | 黑盒 | 图像分类 | ⭐⭐ |
| Prompt Injection | LLM | 文本 | ⭐ |
| Jailbreak | LLM | 文本 | ⭐⭐ |
| BadNet | 后门 | 训练时 | ⭐⭐ |
| 梯度泄露 | 联邦学习 | 反隐私 | ⭐⭐⭐ |
| 模型窃取 | API | 复制模型 | ⭐⭐ |

## 防御方法速查
| 防御 | 针对 | 效果 | 成本 |
|------|------|------|------|
| 对抗训练 | 对抗样本 | ★★★★★ | 高 |
| 梯度混淆 | 白盒攻击 | ★★☆ | 低 |
| 输入变换 | 对抗样本 | ★★★ | 中 |
| DP-SGD | 隐私泄露 | ★★★★ | 中 |
| 安全聚合 | 联邦学习 | ★★★★ | 中 |
| 内容过滤 | LLM | ★★★ | 低 |
| Prompt卫兵 | Prompt注入 | ★★★ | 低 |

## 关键公式
- FGSM: x'=x+ε·sign(∇_xJ)
- PGD: x^{t+1}=Π(x^t+α·sign(∇J))
- 差分隐私: Pr[M(D)∈S]≤e^ε·Pr[M(D')∈S]
- DP-SGD: g̃=(Σclip(g)+N(0,σ²))/batch

## 经典Paper必知
- Explaining and Harnessing Adversarial Examples (Goodfellow 2015)
- Towards Deep Learning Models Resistant to Attacks (Madry 2018 PGD)
- Deep Leakage from Gradients (Zhu 2019)
- Universal and Transferable Attacks (各种)`,
    quiz: []
  },
  {
    id: 'interview-ai-i38', day: 38, title: 'AI安全面试高频题集', subtitle: '面试最常问的AI安全问题',
    objectives: ['AI安全面试速答'],
    keyPoints: ['高频问题','标准答案','追问预判'],
    content: `# AI安全高频面试题集

**Q1: AI安全是什么为什么重要？**
AI系统面临传统网络安全+AI特有的威胁(对抗/隐私窃取/注入)→AI越普及安全问题越突出→AI安全工程师是新兴稀缺岗位

**Q2: 机器学习和深度学习的区别？**
ML需人工特征→深度学习自动学特征→深度学习是ML的子集→面试最简单回答即可

**Q3: 对抗样本为什么存在？**
模型在高维空间学习到的决策边界不完美→微小输入扰动可能跨过边界→模型线性本质

**Q4: 怎么防御对抗样本？**
对抗训练(最有效但贵)→防御性蒸馏→输入预处理(压缩/变换)→集成→梯度掩蔽(不推荐)

**Q5: Prompt Injection怎么防御？**
①指令加固(MUST/ALWAYS NOT)②输入隔离③输出过滤④指令优先⑤人工确认关键操作

**Q6: 你对AI安全的贡献/项目？**
用STAR讲:当时在做XX项目→发现OO问题→用YY方法解决→产生ZZ效果

**Q7: 怎么学习AI安全？**
路线:ML基础(2-3月)→对抗攻击(CleverHans教程)→AI安全paper(1-2月实战)→CTF→项目

**Q8: AI安全最难的挑战？**
①未知攻击Adaptive Attack(攻击者知道防御)②AI应用爆发安全滞后③AI Agent安全空白

**Q9: 怎么评估模型的安全性？**
准确率(干净数据)+鲁棒性(扰动)+隐私(成员推理)+公平性(Bias)→四维度评估

**Q10: Prompt Injection和SQL注入有何异同？**
同:注入恶意指令改变系统行为 | 异:SQL语法控制DB→Prompt自然语言模糊控制LLM`,
    quiz: []
  },
  {
    id: 'interview-ai-i39', day: 39, title: 'AI安全职业发展', subtitle: '岗位·技能·面试准备·发展路线',
    objectives: ['AI安全职业规划'],
    keyPoints: ['岗位类型','技能要求','面试准备','发展建议'],
    content: `# AI安全职业发展

**岗位类型**：
- AI安全 Research:发Paper/0day→论文+顶会→PhD优先
- ML Security Engineer: 工程化落地→代码+ML→公司招聘主力
- LLM Red Teaming: 测试大模型安全→Prompt工程+安全思维→新兴热门
- AI Security Product: 安全产品的AI化(用AI做检测)→传统安全+ML→老树新花
- AI Trust & Safety: 内容审核/偏见/合规→非技术为主→大厂必备

**技能三角形**：
1. 安全基础(OWASP/渗透/防御思维)
2. ML基础(训练/推理/PyTorch)
3. 编程(Python/API开发)

**面试准备**：
- 项目:至少1个完整的AI安全项目(GitHub)
- Blog:写AI安全分析文章建Personal Brand
- 社区:加AI安全社区(Discord/Slack)掌握最新动态
- 刷题:LeetCode ML相关+CTF(ML Safety)

**发展路线**：
初级(Java/安全基础+学ML)→中级(独立做AI安全项目)→高级(带领团队建设AI安全体系)→专家(行业影响力)

**必投公司**：
OpenAI Anthropic Google DeepMind Microsoft(Responsible AI) 各金融/自动驾驶公司的AI安全岗`,
    quiz: []
  },
  {
    id: 'interview-ai-i40', day: 40, title: '全真模拟面试 — AI安全篇', subtitle: 'AI安全面试终极自测',
    objectives: ['AI安全面试全真模拟'],
    keyPoints: ['16道模拟面试题','独立作答'],
    content: `# 全真模拟面试 — AI安全模块

**1.** 说说什么是对抗样本？FGSM的原理？

**2.** 白盒攻击vs黑盒攻击的区别？

**3.** 怎么防御对抗样本？哪个最有效？

**4.** Prompt注入和Jailbreak的区别？

**5.** LLM有哪些安全问题？Owasp LLM Top10能说出几个？

**6.** 数据投毒攻击原理和防御？

**7.** 模型窃取怎么实现怎么防？

**8.** 联邦学习中的安全问题？

**9.** 差分隐私的原理？ε代表什么？

**10.** AI供应链安全有哪些方面？

**11.** 对抗训练的原理和代价？

**12.** 你最喜欢的一篇AI安全paper？

**13.** 怎么评估一个AI模型的安全性？

**14.** LLM红队测试怎么做？

**15.** 怎么在CI/CD中集成AI安全测试？

**16.** 你对AI安全未来3年的预测？

---

**自评**：面试回答标准=概念清晰+原理可解释+有实操经验+行业视野`,
    quiz: []
  }
];

export const interviewAiPlan: CyberLearningPlan = {
  id: 'ai',
  name: 'AI安全·面试突击',
  subtitle: 'AI Security · 40 Days',
  description: '前26天全量知识速览（168天精华压缩）+ 后14天面试实战。覆盖对抗攻击、模型安全、LLM安全、数据隐私、AI红队、MLSecOps等全部AI安全面试考点',
  icon: '🤖',
  difficulty: '高级',
  totalDays: 40,
  color: 'text-cyber-purple',
  bgColor: 'bg-cyber-purple/10',
  borderColor: 'border-cyber-purple/30',
  prerequisites: cyberAiPlan.prerequisites,
  certification: cyberAiPlan.certification,
  days: [...reviewDays, ...interviewDays],
};
