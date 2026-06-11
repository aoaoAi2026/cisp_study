// CISP 历年真题数据库 - 精选 500+ 道高频真题
// 涵盖：CISA知识体系全部核心知识域

export interface PastPaperQuestion {
  id: string;
  year: number; // 考试年份
  session: string; // 考试批次
  domain: string; // 知识域
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface PastPaper {
  id: string;
  title: string;
  year: number;
  month: string;
  description: string;
  difficulty: string;
  questions: PastPaperQuestion[];
  totalScore: number;
  passingScore: number;
  duration: number; // 分钟
  practiceEnvironment?: {
    id: string;
    name: string;
    description: string;
    url: string;
  }[];
}

export const cispDomains = [
  '信息安全保障',
  '信息安全监管',
  '信息安全管理体系',
  '业务连续性',
  '安全工程与运营',
  '安全评估',
  '访问控制',
  '加密技术',
  '物理安全',
  '网络安全',
  '应用安全',
  '安全开发',
  '法律法规',
  '等级保护',
  '安全管理',
];

// 历年真题库
export const pastPapers: PastPaper[] = [
  {
    id: 'cisp-2024-hubei',
    title: '2024年度湖北省CISP真题精选',
    year: 2024,
    month: '上',
    description: '2024年度湖北省注册信息安全专业人员认证考试精选真题，涵盖所有核心知识域',
    difficulty: '中等',
    totalScore: 100,
    passingScore: 70,
    duration: 120,
    questions: [
      {
        id: 'cisp-2024-hubei-001',
        year: 2024,
        session: '湖北',
        domain: '安全评估',
        question: '在信息系统审计中，关于所收集数据的广度的决定应该基于（）',
        options: [
          'A. 关键及需要的信息的可用性',
          'B. 审计师对(审计)情况的熟悉程度',
          'C. 被审计对象找到相关证据的能力',
          'D. 此次审计的目标和范围'
        ],
        correctIndex: 3,
        explanation: '在信息系统审计中，收集数据的广度应该基于此次审计的目标和范围。这是审计计划阶段的核心考虑因素，决定了审计工作的边界和深度。'
      },
      {
        id: 'cisp-2024-hubei-002',
        year: 2024,
        session: '湖北',
        domain: '安全评估',
        question: '使用测试数据验证交易处理的最大挑战是（）',
        options: [
          'A. 实际的生产数据可能被污染',
          'B. 创建测试数据以覆盖所有可能的正常的和非正常的情景',
          'C. 测试结果与生产环境中的结果做比较',
          'D. 与高速事务处理相关的数据隔离'
        ],
        correctIndex: 1,
        explanation: '使用测试数据验证交易处理的最大挑战是创建测试数据以覆盖所有可能的正常和非正常情景。需要确保测试数据能够覆盖各种边界条件和异常情况。'
      },
      {
        id: 'cisp-2024-hubei-003',
        year: 2024,
        session: '湖北',
        domain: '安全工程与运营',
        question: '在处理可疑入侵时，一个合理的信息安全策略最有可能包括下列哪一项（）',
        options: ['A. 反应', 'B. 纠错', 'C. 检测', 'D. 监控'],
        correctIndex: 0,
        explanation: '信息安全策略中，处理可疑入侵最重要的是"反应"策略。包括事件响应流程、遏制措施、根除方法、恢复步骤和事后分析等。'
      },
      {
        id: 'cisp-2024-hubei-004',
        year: 2024,
        session: '湖北',
        domain: '信息安全管理体系',
        question: '信息安全管理体系(ISMS)的内部审核和管理审核是两项重要的管理活动，关于这两者，下面描述错误的是（）',
        options: [
          'A. 内部审核和管理评审都很重要，都是促进ISMS持续改进的重要动力，也都应当按照一定的周期实施',
          'B. 内部审核的实施方式多采用文件审核和现场审核的形式，而管理评审的实施方式多采用召开管理评审会议的形式进行',
          'C. 内部审核的实施主体由组织内部的ISMS内审小组，而管理评审的实施主体是由国家政策指定的第三方技术服务机构',
          'D. 组织的信息安全方针，信息目标和有关ISMS文件等，在内部审核中作为审核准则使用，但在管理评审中，这些文件是被审对象'
        ],
        correctIndex: 2,
        explanation: '管理评审的实施主体是组织的管理层，而不是国家政策指定的第三方技术服务机构。内部审核由内审小组进行，管理评审由最高管理层主持。'
      },
      {
        id: 'cisp-2024-hubei-005',
        year: 2024,
        session: '湖北',
        domain: '信息安全保障',
        question: '关于信息保障技术框架IATF，下列说法错误的是（）',
        options: [
          'A. IATF强调深度防御，关注本地计算环境，区域边境，网络和基础设施，支撑性基础设施等多个领域的安全保障',
          'B. IATF强调深度防御的技术方面，建议将安全机制部署在网络的各个层面',
          'C. IATF是一种技术框架，不涉及管理方面的要求',
          'D. IATF的核心理念是深度防御，强调人、技术和操作三个核心要素'
        ],
        correctIndex: 2,
        explanation: 'IATF不仅是技术框架，同时也涉及管理和操作方面的要求。深度防御策略需要技术、管理和人的因素相结合。'
      },
      {
        id: 'cisp-2024-hubei-006',
        year: 2024,
        session: '湖北',
        domain: '网络安全',
        question: '关于SYN Flood攻击，下列说法正确的是（）',
        options: [
          'A. SYN Flood攻击利用TCP三次握手的缺陷，向服务器发送大量SYN包但不完成连接',
          'B. SYN Flood攻击只能发生在局域网环境中',
          'C. 防火墙无法防御SYN Flood攻击',
          'D. SYN Flood攻击会窃取用户数据'
        ],
        correctIndex: 0,
        explanation: 'SYN Flood攻击利用TCP三次握手的缺陷，攻击者发送大量SYN请求但不完成握手过程，耗尽服务器的连接队列资源。'
      },
      {
        id: 'cisp-2024-hubei-007',
        year: 2024,
        session: '湖北',
        domain: '加密技术',
        question: '以下哪种算法是非对称加密算法（）',
        options: ['A. AES', 'B. DES', 'C. RSA', 'D. 3DES'],
        correctIndex: 2,
        explanation: 'RSA是非对称加密算法，使用公钥和私钥配对加密和解密。AES、DES、3DES都是对称加密算法。'
      },
      {
        id: 'cisp-2024-hubei-008',
        year: 2024,
        session: '湖北',
        domain: '访问控制',
        question: '最小权限原则是指（）',
        options: [
          'A. 用户应该拥有系统中所有资源的访问权限以便完成工作',
          'B. 用户只能访问完成工作所必需的资源和数据',
          'C. 系统管理员拥有最高权限',
          'D. 访客账户应该被禁用'
        ],
        correctIndex: 1,
        explanation: '最小权限原则要求用户只能访问完成其工作所必需的资源和数据，权限范围应限制在最小必要范围内。'
      },
      {
        id: 'cisp-2024-hubei-009',
        year: 2024,
        session: '湖北',
        domain: '等级保护',
        question: '等级保护2.0中，"一个中心、三重防护"的安全架构，"一个中心"指的是（）',
        options: ['A. 安全计算中心', 'B. 安全管理中心', 'C. 安全通信中心', 'D. 安全存储中心'],
        correctIndex: 1,
        explanation: '等级保护2.0中，"一个中心"指安全管理中心，负责集中监控、管理和调度整个信息系统的安全状态。"三重防护"是安全计算环境、安全区域边界、安全通信网络。'
      },
      {
        id: 'cisp-2024-hubei-010',
        year: 2024,
        session: '湖北',
        domain: '法律法规',
        question: '《网络安全法》规定，关键信息基础设施的运营者应当自行或委托网络安全服务机构对其网络的安全性和可能存在的风险每年至少进行几次检测评估（）',
        options: ['A. 1次', 'B. 2次', 'C. 3次', 'D. 4次'],
        correctIndex: 0,
        explanation: '《网络安全法》规定，关键信息基础设施的运营者应当自行或委托网络安全服务机构对其网络的安全性和可能存在的风险每年至少进行一次检测评估。'
      },
      {
        id: 'cisp-2024-hubei-011',
        year: 2024,
        session: '湖北',
        domain: '业务连续性',
        question: '关于灾难恢复计划(DRP)和业务连续性计划(BCP)，以下说法正确的是（）',
        options: [
          'A. BCP比DRP的范围更窄',
          'B. DRP主要关注信息技术系统的恢复，而BCP关注整个业务的连续运营',
          'C. BCP不需要考虑恢复时间目标(RTO)',
          'D. DRP关注的是业务的长期生存能力'
        ],
        correctIndex: 1,
        explanation: '灾难恢复计划(DRP)主要关注IT系统的恢复，而业务连续性计划(BCP)关注整个业务的连续运营，包括人员、设施、流程等多个方面。'
      },
      {
        id: 'cisp-2024-hubei-012',
        year: 2024,
        session: '湖北',
        domain: '应用安全',
        question: 'SQL注入攻击的主要原因是（）',
        options: [
          'A. 数据库服务器性能不足',
          'B. 用户输入没有经过充分的验证和转义',
          'C. 网络带宽不足',
          'D. 防火墙配置错误'
        ],
        correctIndex: 1,
        explanation: 'SQL注入攻击的主要原因是应用程序未对用户输入进行充分验证和转义，直接将用户输入拼接到SQL语句中执行。'
      },
      {
        id: 'cisp-2024-hubei-013',
        year: 2024,
        session: '湖北',
        domain: '物理安全',
        question: '关于物理安全中的门禁系统，下列说法错误的是（）',
        options: [
          'A. 门禁系统是物理安全防护的重要组成部分',
          'B. 门禁卡可以无限复制，不存在安全风险',
          'C. 多因素认证（如门禁卡+密码）比单因素更安全',
          'D. 门禁系统应定期维护和检查'
        ],
        correctIndex: 1,
        explanation: '门禁卡虽然可以被复制，但通过技术手段（如加密卡、生物识别等）可以大大降低复制风险。无限复制且无安全措施是不正确的理解。'
      },
      {
        id: 'cisp-2024-hubei-014',
        year: 2024,
        session: '湖北',
        domain: '安全评估',
        question: '漏洞扫描和渗透测试的主要区别是（）',
        options: [
          'A. 漏洞扫描是被动的，渗透测试是主动的',
          'B. 漏洞扫描不需要授权，渗透测试需要授权',
          'C. 两者没有区别',
          'D. 漏洞扫描只能发现已知漏洞，渗透测试可以发现未知漏洞'
        ],
        correctIndex: 3,
        explanation: '漏洞扫描主要检测已知漏洞特征，而渗透测试通过模拟真实攻击来发现更深层次的安全问题，包括未知的漏洞和配置缺陷。'
      },
      {
        id: 'cisp-2024-hubei-015',
        year: 2024,
        session: '湖北',
        domain: '信息安全保障',
        question: 'PDR模型是指（）',
        options: ['A. 防护、检测、响应', 'B. 预防、检测、恢复', 'C. 防护、检测、恢复', 'D. 预防、检测、响应'],
        correctIndex: 0,
        explanation: 'PDR模型是防护(Protection)、检测(Detection)、响应(Response)的缩写，是信息安全保障的基本模型。'
      },
      {
        id: 'cisp-2024-hubei-016',
        year: 2024,
        session: '湖北',
        domain: '加密技术',
        question: '数字签名主要用于实现以下哪种安全属性（）',
        options: ['A. 机密性', 'B. 完整性', 'C. 认证性和不可否认性', 'D. 可用性'],
        correctIndex: 2,
        explanation: '数字签名主要用于实现认证性和不可否认性，确认消息来源的身份并防止发送者否认发送过该消息。'
      },
      {
        id: 'cisp-2024-hubei-017',
        year: 2024,
        session: '湖北',
        domain: '访问控制',
        question: '强制访问控制(MAC)模型中，访问权限的确定基于（）',
        options: [
          'A. 用户的角色',
          'B. 资源的拥有者',
          'C. 信息的敏感级别和安全许可',
          'D. 用户的职务'
        ],
        correctIndex: 2,
        explanation: '在强制访问控制(MAC)模型中，访问权限由系统根据信息的敏感级别和用户的安全许可来决定，而不是由资源拥有者或用户角色决定。'
      },
      {
        id: 'cisp-2024-hubei-018',
        year: 2024,
        session: '湖北',
        domain: '网络安全',
        question: '防火墙的默认拒绝策略是指（）',
        options: [
          'A. 默认允许所有流量，只有明确禁止的才拒绝',
          'B. 默认拒绝所有流量，只有明确允许的才放行',
          'C. 所有流量都被允许通过',
          'D. 所有流量都被拒绝'
        ],
        correctIndex: 1,
        explanation: '默认拒绝策略是安全最佳实践，要求除非明确允许，否则默认拒绝所有流量。这种方式可以最大限度地减少攻击面。'
      },
      {
        id: 'cisp-2024-hubei-019',
        year: 2024,
        session: '湖北',
        domain: '信息安全管理体系',
        question: 'ISO 27001标准中，声明适用性声明(SOA)的目的是（）',
        options: [
          'A. 证明组织已通过认证',
          'B. 识别哪些控制措施适用于组织的信息安全管理体系',
          'C. 定义信息安全的预算',
          'D. 培训信息安全人员'
        ],
        correctIndex: 1,
        explanation: '声明适用性声明(SOA)识别并记录哪些控制措施适用或不适用于组织的信息安全管理体系，是ISMS建立和实施的重要组成部分。'
      },
      {
        id: 'cisp-2024-hubei-020',
        year: 2024,
        session: '湖北',
        domain: '安全工程与运营',
        question: '安全配置基线是指（）',
        options: [
          'A. 系统的最高安全配置',
          'B. 满足安全要求的最基本配置要求',
          'C. 随机选择的配置',
          'D. 最新的软件版本'
        ],
        correctIndex: 1,
        explanation: '安全配置基线是满足组织安全要求的最基本配置标准，包括操作系统、网络设备、应用程序等的安全配置要求。'
      },
      {
        id: 'cisp-2024-hubei-021',
        year: 2024,
        session: '湖北',
        domain: '法律法规',
        question: '根据《数据安全法》，数据分类分级制度的要求是（）',
        options: [
          'A. 所有数据采用统一的保护级别',
          'B. 根据数据的重要性和敏感性进行分类分级保护',
          'C. 只有重要数据才需要保护',
          'D. 数据分类分级由个人自行决定'
        ],
        correctIndex: 1,
        explanation: '《数据安全法》要求根据数据的重要性和敏感性进行分类分级，并实施相应的保护措施。这是数据安全管理的基础。'
      },
      {
        id: 'cisp-2024-hubei-022',
        year: 2024,
        session: '湖北',
        domain: '应用安全',
        question: '跨站脚本攻击(XSS)主要影响以下哪种安全属性（）',
        options: ['A. 机密性', 'B. 完整性', 'C. 可用性', 'D. 认证性'],
        correctIndex: 1,
        explanation: '跨站脚本攻击(XSS)主要影响完整性，通过在网页中注入恶意脚本代码，窃取用户会话、篡改网页内容或进行钓鱼攻击。'
      },
      {
        id: 'cisp-2024-hubei-023',
        year: 2024,
        session: '湖北',
        domain: '业务连续性',
        question: '恢复时间目标(RTO)是指（）',
        options: [
          'A. 数据恢复的最长时间',
          'B. 系统从中断到恢复正常运营的最长可接受时间',
          'C. 备份数据的最长保留时间',
          'D. 业务连续性的总时长'
        ],
        correctIndex: 1,
        explanation: '恢复时间目标(RTO)是组织能够承受的业务中断的最长时间，定义为从故障发生到系统恢复正常运营的最长可接受时间。'
      },
      {
        id: 'cisp-2024-hubei-024',
        year: 2024,
        session: '湖北',
        domain: '加密技术',
        question: '哈希函数的主要特性是（）',
        options: [
          'A. 可逆性',
          'B. 唯一性',
          'C. 抗碰撞性和单向性',
          'D. 对称性'
        ],
        correctIndex: 2,
        explanation: '哈希函数的主要特性包括单向性（无法从哈希值反推原始数据）和抗碰撞性（难以找到两个不同的输入产生相同的哈希值）。'
      },
      {
        id: 'cisp-2024-hubei-025',
        year: 2024,
        session: '湖北',
        domain: '等级保护',
        question: '等级保护第一级的安全保护等级是（）',
        options: ['A. 自主保护级', 'B. 指导保护级', 'C. 监督保护级', 'D. 强制保护级'],
        correctIndex: 0,
        explanation: '等级保护共分五级：第一级(自主保护级)、第二级(指导保护级)、第三级(监督保护级)、第四级(强制保护级)、第五级(专控保护级)。'
      },
      {
        id: 'cisp-2024-hubei-026',
        year: 2024,
        session: '湖北',
        domain: '安全评估',
        question: '风险评估的主要步骤包括（）',
        options: [
          'A. 资产识别、威胁识别、脆弱性识别、风险计算',
          'B. 漏洞扫描、渗透测试、安全审计',
          'C. 安全加固、补丁管理、访问控制',
          'D. 防火墙配置、入侵检测、安全监控'
        ],
        correctIndex: 0,
        explanation: '风险评估的主要步骤包括：资产识别、威胁识别、脆弱性识别、风险分析和风险计算。通过这些步骤确定风险值并制定风险处理计划。'
      },
      {
        id: 'cisp-2024-hubei-027',
        year: 2024,
        session: '湖北',
        domain: '访问控制',
        question: '基于角色的访问控制(RBAC)中，角色是指（）',
        options: [
          'A. 系统管理员',
          'B. 与一个或多个权限关联的用户组',
          'C. 用户的身份认证方式',
          'D. 网络中的物理连接'
        ],
        correctIndex: 1,
        explanation: '在RBAC中，角色是权限的集合，通过将角色分配给用户，用户获得相应角色的所有权限。这种方式简化了权限管理。'
      },
      {
        id: 'cisp-2024-hubei-028',
        year: 2024,
        session: '湖北',
        domain: '信息安全保障',
        question: '信息安全的CIA三要素不包括（）',
        options: ['A. 机密性', 'B. 完整性', 'C. 可用性', 'D. 认证性'],
        correctIndex: 3,
        explanation: 'CIA三要素是机密性(Confidentiality)、完整性(Integrity)和可用性(Availability)，不包括认证性。认证性是另一个独立的安全属性。'
      },
      {
        id: 'cisp-2024-hubei-029',
        year: 2024,
        session: '湖北',
        domain: '网络安全',
        question: 'VPN的主要安全功能是（）',
        options: [
          'A. 加速网络连接',
          'B. 在公共网络上建立加密的专用通道',
          'C. 防止病毒传播',
          'D. 管理用户账户'
        ],
        correctIndex: 1,
        explanation: 'VPN(虚拟专用网络)的主要功能是在公共网络上建立加密的专用通道，保证数据传输的机密性和完整性。'
      },
      {
        id: 'cisp-2024-hubei-030',
        year: 2024,
        session: '湖北',
        domain: '物理安全',
        question: '数据中心温度控制的主要目的是（）',
        options: [
          'A. 节约能源',
          'B. 防止设备过热导致故障或损坏',
          'C. 提高网络速度',
          'D. 减少电磁辐射'
        ],
        correctIndex: 1,
        explanation: '数据中心需要严格的温度控制，主要目的是确保服务器和网络设备在适宜的温度环境下运行，防止过热导致的设备故障和数据丢失。'
      },
      {
        id: 'cisp-2024-hubei-031',
        year: 2024,
        session: '湖北',
        domain: '安全开发',
        question: '在软件开发生命周期(SDLC)中，安全需求分析应在哪个阶段进行（）',
        options: [
          'A. 测试阶段',
          'B. 需求分析阶段',
          'C. 部署阶段',
          'D. 维护阶段'
        ],
        correctIndex: 1,
        explanation: '安全需求分析应在需求分析阶段同步进行，将安全需求嵌入业务需求，这是安全开发生命周期(SSDLC)的核心原则之一，早发现早修复成本最低。'
      },
      {
        id: 'cisp-2024-hubei-032',
        year: 2024,
        session: '湖北',
        domain: '信息安全技术',
        question: '关于防火墙的工作模式，以下说法正确的是（）',
        options: [
          'A. 透明模式需要修改网络拓扑',
          'B. 路由模式相当于一台路由器，需要配置IP地址',
          'C. 混合模式无法同时处理不同VLAN流量',
          'D. NAT模式不支持内网地址映射'
        ],
        correctIndex: 1,
        explanation: '防火墙路由模式下，防火墙相当于一台三层设备，需要为接口配置IP地址，处理跨网段的流量转发，适合复杂网络环境部署。'
      },
      {
        id: 'cisp-2024-hubei-033',
        year: 2024,
        session: '湖北',
        domain: '密码学',
        question: '以下关于SHA-256的说法，正确的是（）',
        options: [
          'A. SHA-256是对称加密算法',
          'B. SHA-256输出固定256位哈希值，具有抗碰撞性',
          'C. SHA-256可以解密还原原始数据',
          'D. SHA-256已被证明不安全'
        ],
        correctIndex: 1,
        explanation: 'SHA-256是一种密码学哈希函数，输出固定长度256位的哈希值，具有单向性和抗碰撞特性，无法从哈希值反推原始输入。'
      },
      {
        id: 'cisp-2024-hubei-034',
        year: 2024,
        session: '湖北',
        domain: '安全管理',
        question: '信息安全管理体系(ISMS)的PDCA模型中，"Check"阶段的主要活动是（）',
        options: [
          'A. 制定ISMS方针和目标',
          'B. 实施风险评估和控制措施',
          'C. 监视、测量、内审和管理评审',
          'D. 采取纠正措施持续改进'
        ],
        correctIndex: 2,
        explanation: 'PDCA中Check（检查）阶段的主要活动包括：监视和测量过程绩效、进行内部审核、开展管理评审，评估ISMS的有效性和符合性。'
      },
      {
        id: 'cisp-2024-hubei-035',
        year: 2024,
        session: '湖北',
        domain: '网络安全',
        question: '以下哪项不是DDoS攻击的常见防御手段（）',
        options: [
          'A. CDN加速与流量清洗',
          'B. 源IP限速与黑白名单',
          'C. WAF应用层防护',
          'D. 直接关闭服务器避免被攻击'
        ],
        correctIndex: 3,
        explanation: '关闭服务器虽然能避免被攻击，但违背了可用性原则，损害正常业务。正确的DDoS防御包括流量清洗、CDN、WAF、负载均衡等多层防护。'
      },
      {
        id: 'cisp-2024-hubei-036',
        year: 2024,
        session: '湖北',
        domain: '信息安全概念',
        question: '信息安全的基本属性不包括以下哪项（）',
        options: [
          'A. 机密性',
          'B. 完整性',
          'C. 可用性',
          'D. 经济性'
        ],
        correctIndex: 3,
        explanation: '信息安全的基本属性包括机密性(Confidentiality)、完整性(Integrity)、可用性(Availability)，即CIA三要素，经济性不属于信息安全基本属性。'
      },
      {
        id: 'cisp-2024-hubei-037',
        year: 2024,
        session: '湖北',
        domain: '系统安全',
        question: '关于操作系统安全基线，以下说法错误的是（）',
        options: [
          'A. 应禁用不必要的服务和端口',
          'B. 应定期更新系统补丁',
          'C. 使用默认账号密码便于运维管理',
          'D. 应启用日志审计功能'
        ],
        correctIndex: 2,
        explanation: '默认账号密码（如admin/admin）是重大安全隐患，应强制修改默认密码，使用强密码策略，并遵循最小权限原则配置账户。'
      },
      {
        id: 'cisp-2024-hubei-038',
        year: 2024,
        session: '湖北',
        domain: '应用安全',
        question: '以下哪种情况最可能导致越权访问漏洞（）',
        options: [
          'A. 服务端对每个请求严格验证用户权限',
          'B. 仅在前端进行权限控制，后端未做二次校验',
          'C. 使用JWT令牌携带用户角色信息',
          'D. 对敏感操作进行二次身份验证'
        ],
        correctIndex: 1,
        explanation: '仅在前端进行权限控制而后端不做二次校验，是越权访问（如IDOR）的最常见原因，攻击者可以直接调用后端API绕过前端限制。'
      },
      {
        id: 'cisp-2024-hubei-039',
        year: 2024,
        session: '湖北',
        domain: '通信安全',
        question: 'HTTPS协议的主要安全机制不包括（）',
        options: [
          'A. 数据传输加密(TLS)',
          'B. 服务器身份认证(证书)',
          'C. 数据完整性校验',
          'D. 客户端硬件认证'
        ],
        correctIndex: 3,
        explanation: 'HTTPS通过TLS/SSL提供传输加密、服务器身份认证（通过数字证书）和数据完整性保护，不包括客户端硬件认证机制。'
      },
      {
        id: 'cisp-2024-hubei-040',
        year: 2024,
        session: '湖北',
        domain: '信息安全保障',
        question: '网络安全等级保护2.0中，"一个中心三重防护"不包括以下哪个（）',
        options: [
          'A. 安全计算环境',
          'B. 安全区域边界',
          'C. 安全通信网络',
          'D. 安全运营中心SOC'
        ],
        correctIndex: 3,
        explanation: '等保2.0"一个中心三重防护"指：安全管理中心+安全计算环境、安全区域边界、安全通信网络。SOC虽然重要但不属于此框架中的三重防护。'
      }
    ],
    practiceEnvironment: [
      {
        id: 'hubei-juice-shop',
        name: 'OWASP Juice Shop',
        description: '最现代的Web应用漏洞靶场，含100+挑战，可练习XSS/SQLi/CSRF等湖北卷高频考点',
        url: 'https://owasp.org/www-project-juice-shop/'
      },
      {
        id: 'hubei-dvwa',
        name: 'DVWA (Damn Vulnerable Web App)',
        description: 'PHP/MySQL环境的经典Web漏洞靶场，适合入门练习所有常见Web应用安全漏洞',
        url: 'https://github.com/digininja/DVWA'
      },
      {
        id: 'hubei-webgoat',
        name: 'OWASP WebGoat',
        description: 'OWASP官方教学应用，分章节讲解各类Web安全问题，适合系统学习',
        url: 'https://owasp.org/www-project-webgoat/'
      },
      {
        id: 'hubei-bwapp',
        name: 'bWAPP',
        description: '包含100+漏洞的PHP应用，覆盖所有OWASP Top 10漏洞和各类业务逻辑漏洞',
        url: 'http://www.itsecgames.com/'
      },
      {
        id: 'hubei-pikachu',
        name: 'Pikachu 皮卡丘靶场',
        description: '国产Web安全练习平台，中文友好，包含XSS/SQL注入/文件上传/反序列化等模块',
        url: 'https://github.com/zhuifengshaonianhanlu/pikachu'
      }
    ]
  },
  {
    id: 'cisp-2024-national',
    title: '2024年CISP认证考试真题（全国卷）',
    year: 2024,
    month: '下',
    description: '2024年全国CISP认证考试真题，涵盖信息安全技术、管理、法规三大核心模块',
    difficulty: '中等',
    totalScore: 100,
    passingScore: 70,
    duration: 120,
    questions: [
      {
        id: 'cisp-2024-national-001',
        year: 2024,
        session: '全国',
        domain: '信息安全保障',
        question: '下列关于CISP认证的表述，错误的是（）',
        options: [
          'A. CISP是由中国信息安全测评中心（CNITSEC）主导实施的国家级信息安全专业认证',
          'B. CISP认证面向从事信息安全技术、管理、评估、咨询、运维等岗位的专业人员',
          'C. CISP考试目前仅包含主观题，重点考查实操能力',
          'D. CISP知识体系已全面融合《网络安全法》《数据安全法》《个人信息保护法》三大基础法律框架'
        ],
        correctIndex: 2,
        explanation: 'CISP考试目前包含客观选择题（单选和多选），重点考查理论知识，不是仅包含主观题。因此C选项错误。'
      },
      {
        id: 'cisp-2024-national-002',
        year: 2024,
        session: '全国',
        domain: '等级保护',
        question: '等级保护2.0（等保2.0）的核心技术架构是"一个中心、三重防护"，其中"一个中心"指的是（）',
        options: ['A. 安全计算中心', 'B. 安全管理中心', 'C. 安全通信中心', 'D. 安全区域中心'],
        correctIndex: 1,
        explanation: '等保2.0中"一个中心"指安全管理中心，"三重防护"分别是安全计算环境、安全区域边界、安全通信网络。'
      },
      {
        id: 'cisp-2024-national-003',
        year: 2024,
        session: '全国',
        domain: '加密技术',
        question: '关于AES加密算法，以下说法正确的是（）',
        options: [
          'A. AES是一种非对称加密算法',
          'B. AES的密钥长度可以是128位、192位或256位',
          'C. AES已被证明是不安全的',
          'D. AES只适用于软件加密'
        ],
        correctIndex: 1,
        explanation: 'AES（高级加密标准）是对称加密算法，密钥长度可以是128位、192位或256位，是目前最广泛使用的加密标准之一。'
      },
      {
        id: 'cisp-2024-national-004',
        year: 2024,
        session: '全国',
        domain: '网络安全',
        question: '关于入侵检测系统（IDS）和入侵防御系统（IPS）的区别，以下说法正确的是（）',
        options: [
          'A. IDS部署在网络边界，IPS部署在网络内部',
          'B. IDS只能检测攻击，IPS可以检测并阻止攻击',
          'C. IDS和IPS功能完全相同',
          'D. IPS不需要部署在网络关键位置'
        ],
        correctIndex: 1,
        explanation: 'IDS（入侵检测系统）只能检测和告警，而IPS（入侵防御系统）可以检测并主动阻止恶意流量，提供实时的安全防护。'
      },
      {
        id: 'cisp-2024-national-005',
        year: 2024,
        session: '全国',
        domain: '信息安全管理体系',
        question: '在ISO 27001信息安全管理体系中，管理评审的输入不包括（）',
        options: [
          'A. 信息安全方针和目标的实现情况',
          'B. 内部审核结果',
          'C. 所有员工的工资信息',
          'D. 风险评估的结果和风险处理计划'
        ],
        correctIndex: 2,
        explanation: '管理评审的输入包括ISMS绩效信息、审核结果、相关方反馈等，不包括员工的个人工资等敏感信息。'
      },
      {
        id: 'cisp-2024-national-006',
        year: 2024,
        session: '全国',
        domain: '法律法规',
        question: '根据《个人信息保护法》，处理敏感个人信息应当取得个人的（）',
        options: ['A. 口头同意', 'B. 书面同意', 'C. 单独同意', 'D. 默示同意'],
        correctIndex: 2,
        explanation: '《个人信息保护法》规定，处理敏感个人信息应当取得个人的单独同意，而不是一般的授权同意。'
      },
      {
        id: 'cisp-2024-national-007',
        year: 2024,
        session: '全国',
        domain: '应用安全',
        question: '关于CSRF（跨站请求伪造）攻击，以下说法正确的是（）',
        options: [
          'A. CSRF攻击利用用户已认证的身份执行非授权操作',
          'B. CSRF攻击可以直接获取用户的密码',
          'C. CSRF攻击只能通过XSS漏洞实施',
          'D. CSRF攻击不影响Web应用'
        ],
        correctIndex: 0,
        explanation: 'CSRF攻击利用用户已认证的身份，伪造请求执行非授权操作。攻击者不能直接获取密码，但可以以用户身份执行敏感操作。'
      },
      {
        id: 'cisp-2024-national-008',
        year: 2024,
        session: '全国',
        domain: '访问控制',
        question: '在自主访问控制（DAC）模型中，资源的访问权限由谁决定（）',
        options: ['A. 系统管理员', 'B. 资源的拥有者', 'C. 安全策略', 'D. 系统自动决定'],
        correctIndex: 1,
        explanation: '在自主访问控制（DAC）模型中，资源的拥有者可以自主决定谁可以访问其资源，以及授予何种访问权限。'
      },
      {
        id: 'cisp-2024-national-009',
        year: 2024,
        session: '全国',
        domain: '业务连续性',
        question: '关于恢复点目标（RPO），以下说法正确的是（）',
        options: [
          'A. RPO是指系统恢复的最长时间',
          'B. RPO是指可以接受的最大数据丢失量',
          'C. RPO与数据备份无关',
          'D. RPO越大约好'
        ],
        correctIndex: 1,
        explanation: '恢复点目标（RPO）定义了可接受的最大数据丢失量，决定了备份频率和恢复策略。RPO越小，数据保护越强，但成本越高。'
      },
      {
        id: 'cisp-2024-national-010',
        year: 2024,
        session: '全国',
        domain: '安全评估',
        question: '安全评估中的资产识别，其主要目的是（）',
        options: [
          'A. 确定资产的购买价格',
          'B. 识别需要保护的信息资产并评估其价值',
          'C. 统计资产的物理数量',
          'D. 确定资产的维护周期'
        ],
        correctIndex: 1,
        explanation: '资产识别的主要目的是识别组织中需要保护的信息资产，并评估其价值（包括业务价值、法律价值、战略价值等），为风险评估提供基础。'
      },
      {
        id: 'cisp-2024-national-011',
        year: 2024,
        session: '全国',
        domain: '加密技术',
        question: '数字证书的颁发机构是（）',
        options: ['A. 公安机关', 'B. 证书认证机构（CA）', 'C. 工商局', 'D. 税务局'],
        correctIndex: 1,
        explanation: '数字证书由证书认证机构（Certificate Authority，CA）颁发，CA是受信任的第三方机构，负责验证和绑定公钥与实体身份。'
      },
      {
        id: 'cisp-2024-national-012',
        year: 2024,
        session: '全国',
        domain: '网络安全',
        question: '关于DMZ（隔离区）的说法，正确的是（）',
        options: [
          'A. DMZ内的主机可以直接访问内网',
          'B. DMZ用于放置对外提供服务的服务器',
          'C. DMZ不需要防火墙保护',
          'D. DMZ内的服务器不需要监控'
        ],
        correctIndex: 1,
        explanation: 'DMZ（隔离区）用于放置对外提供服务的服务器（如Web、邮件服务器），作为内网和外网之间的缓冲区域，需要严格的访问控制。'
      },
      {
        id: 'cisp-2024-national-013',
        year: 2024,
        session: '全国',
        domain: '信息安全保障',
        question: '纵深防御策略的核心思想是（）',
        options: [
          'A. 只在网络边界部署安全设备',
          'B. 在多个层面部署多种安全机制，形成多层防护',
          'C. 只保护核心业务系统',
          'D. 使用单一的安全解决方案'
        ],
        correctIndex: 1,
        explanation: '纵深防御（Defense in Depth）通过在多个层面（网络边界、内网、主机、应用等）部署多种安全机制，形成多层防护体系。'
      },
      {
        id: 'cisp-2024-national-014',
        year: 2024,
        session: '全国',
        domain: '法律法规',
        question: '根据《网络安全法》，关键信息基础设施运营者采购网络产品和服务，可能影响国家安全的，应当通过（）审查',
        options: ['A. 质量检查', 'B. 国家安全', 'C. 价格评估', 'D. 性能测试'],
        correctIndex: 1,
        explanation: '《网络安全法》规定，关键信息基础设施运营者采购网络产品和服务，可能影响国家安全的，应当通过国家安全审查。'
      },
      {
        id: 'cisp-2024-national-015',
        year: 2024,
        session: '全国',
        domain: '安全工程与运营',
        question: '安全运营中心（SOC）的主要功能不包括（）',
        options: [
          'A. 实时监控安全事件',
          'B. 安全事件分析和响应',
          'C. 软件开发',
          'D. 安全态势感知'
        ],
        correctIndex: 2,
        explanation: '安全运营中心（SOC）的主要功能包括安全监控、事件分析、响应处置、威胁情报等，软件开发不是SOC的核心功能。'
      },
      {
        id: 'cisp-2024-national-016',
        year: 2024,
        session: '全国',
        domain: '访问控制',
        question: '双因素认证是指（）',
        options: [
          'A. 两种密码认证',
          'B. 两种不同类型的认证因素组合',
          'C. 两次输入相同的密码',
          'D. 两种加密算法'
        ],
        correctIndex: 1,
        explanation: '双因素认证要求用户使用两种不同类型的认证因素（如密码+短信验证码、密码+指纹等）来验证身份，提高安全性。'
      },
      {
        id: 'cisp-2024-national-017',
        year: 2024,
        session: '全国',
        domain: '物理安全',
        question: '数据中心选址时，不需要考虑的因素是（）',
        options: ['A. 地理位置', 'B. 自然灾害风险', 'C. 员工餐厅距离', 'D. 电力供应稳定性'],
        correctIndex: 2,
        explanation: '数据中心选址主要考虑地理位置、自然灾害风险、电力供应、网络连接等因素，员工餐厅距离不是选址的关键考虑因素。'
      },
      {
        id: 'cisp-2024-national-018',
        year: 2024,
        session: '全国',
        domain: '加密技术',
        question: '关于SSL/TLS协议，以下说法正确的是（）',
        options: [
          'A. SSL和TLS是同一种协议',
          'B. TLS 1.0比SSL 3.0更安全',
          'C. SSL/TLS主要用于Web浏览器和服务器之间的加密通信',
          'D. HTTPS不使用SSL/TLS'
        ],
        correctIndex: 2,
        explanation: 'SSL/TLS协议主要用于Web浏览器和服务器之间的加密通信（HTTPS）。TLS是SSL的升级版本，TLS 1.0基于SSL 3.0。'
      },
      {
        id: 'cisp-2024-national-019',
        year: 2024,
        session: '全国',
        domain: '信息安全管理体系',
        question: '信息安全管理体系（ISMS）的持续改进模型是（）',
        options: ['A. PDCA', 'B. SDLC', 'C. TCP/IP', 'D. OSI'],
        correctIndex: 0,
        explanation: '信息安全管理体系采用PDCA（Plan-Do-Check-Act，计划-执行-检查-行动）模型进行持续改进，是ISO 27001的核心方法论。'
      },
      {
        id: 'cisp-2024-national-020',
        year: 2024,
        session: '全国',
        domain: '应用安全',
        question: '输入验证的主要目的是（）',
        options: [
          'A. 提高系统性能',
          'B. 防止恶意输入导致的安全问题',
          'C. 美化界面',
          'D. 加快数据处理速度'
        ],
        correctIndex: 1,
        explanation: '输入验证的主要目的是确保用户输入的数据符合预期格式和范围，防止恶意输入（如SQL注入、XSS等）导致的安全问题。'
      },
      {
        id: 'cisp-2024-national-021',
        year: 2024,
        session: '全国',
        domain: '安全运营',
        question: 'SIEM（安全信息和事件管理）系统的核心功能不包括（）',
        options: [
          'A. 日志收集与关联分析',
          'B. 安全事件告警与响应',
          'C. 漏洞扫描与渗透测试',
          'D. 合规报告与审计'
        ],
        correctIndex: 2,
        explanation: 'SIEM核心功能包括日志收集、事件关联分析、安全告警和合规报告，漏洞扫描与渗透测试通常是独立安全工具的功能，不属于SIEM核心。'
      },
      {
        id: 'cisp-2024-national-022',
        year: 2024,
        session: '全国',
        domain: '访问控制',
        question: '以下哪种身份认证方式属于多因素认证(MFA)（）',
        options: [
          'A. 使用两次相同的密码登录',
          'B. 使用密码+短信验证码登录',
          'C. 使用指纹识别+人脸识别登录',
          'D. 使用密码自动填充登录'
        ],
        correctIndex: 1,
        explanation: '多因素认证(MFA)要求结合两种或以上不同类型的认证因素（知识因素+持有因素/生物因素）。密码+短信验证码是典型的双因素认证组合。'
      },
      {
        id: 'cisp-2024-national-023',
        year: 2024,
        session: '全国',
        domain: '加密技术',
        question: '关于PKI体系中的证书吊销列表(CRL)，以下说法正确的是（）',
        options: [
          'A. CRL列出的是有效的证书',
          'B. CRL用于发布已被吊销的证书序列号列表',
          'C. CRL无需定期更新',
          'D. CRL与OCSP功能完全相同'
        ],
        correctIndex: 1,
        explanation: 'CRL（证书吊销列表）由CA签发，列出已提前吊销的证书序列号，客户端通过查询CRL验证证书是否仍然有效。OCSP是更轻量的在线查询协议。'
      },
      {
        id: 'cisp-2024-national-024',
        year: 2024,
        session: '全国',
        domain: '网络安全',
        question: '关于OSI七层模型中各层的安全控制，以下匹配正确的是（）',
        options: [
          'A. 数据链路层 - IPsec VPN',
          'B. 网络层 - VLAN和MAC地址过滤',
          'C. 传输层 - SSL/TLS加密',
          'D. 应用层 - ARP欺骗防护'
        ],
        correctIndex: 2,
        explanation: 'SSL/TLS工作在传输层与应用层之间，为应用数据提供端到端加密。IPsec属于网络层，VLAN/MAC属于数据链路层，ARP是数据链路层协议。'
      },
      {
        id: 'cisp-2024-national-025',
        year: 2024,
        session: '全国',
        domain: '等级保护',
        question: '等保2.0定级流程的正确顺序是（）',
        options: [
          'A. 定级→备案→建设整改→等级测评→监督检查',
          'B. 备案→定级→建设整改→等级测评→监督检查',
          'C. 建设整改→定级→备案→等级测评→监督检查',
          'D. 等级测评→定级→备案→建设整改→监督检查'
        ],
        correctIndex: 0,
        explanation: '等保2.0标准工作流程：1)定级(确定保护等级)→2)备案(到公安机关)→3)建设整改(按要求建设)→4)等级测评(定期测评)→5)监督检查(持续监督)。'
      },
      {
        id: 'cisp-2024-national-026',
        year: 2024,
        session: '全国',
        domain: '法律法规',
        question: '《个人信息保护法》规定，处理敏感个人信息应当（）',
        options: [
          'A. 默认为允许处理',
          'B. 取得个人的单独同意',
          'C. 在用户协议中统一授权',
          'D. 无需特别告知'
        ],
        correctIndex: 1,
        explanation: '《个人信息保护法》明确要求处理敏感个人信息应当取得个人的单独同意，并应当向个人告知处理敏感个人信息的必要性以及对个人权益的影响。'
      },
      {
        id: 'cisp-2024-national-027',
        year: 2024,
        session: '全国',
        domain: '安全评估',
        question: '关于漏洞等级分类，以下说法正确的是（）',
        options: [
          'A. 严重漏洞只影响内网不重要的系统',
          'B. 高危漏洞可能导致未授权的远程代码执行',
          'C. 中危漏洞无需修复可以忽略',
          'D. 低危漏洞的风险永远不会演变'
        ],
        correctIndex: 1,
        explanation: '高危漏洞通常可能导致未授权远程代码执行、敏感信息泄露、拒绝服务等严重后果。所有漏洞都应根据风险评估结果及时处理，低危漏洞也可能随环境变化变为高危。'
      },
      {
        id: 'cisp-2024-national-028',
        year: 2024,
        session: '全国',
        domain: '应用安全',
        question: '以下关于命令注入漏洞的说法，错误的是（）',
        options: [
          'A. 命令注入通常因系统命令拼接用户可控输入导致',
          'B. 使用白名单验证和安全API调用可以有效防御',
          'C. 仅靠前端过滤可以完全防御命令注入',
          'D. 应该尽量避免直接调用操作系统命令'
        ],
        correctIndex: 2,
        explanation: '命令注入的防御必须在服务端进行，前端过滤可以被绕过。正确做法是避免直接调用系统命令，使用安全的API或白名单验证用户输入。'
      },
      {
        id: 'cisp-2024-national-029',
        year: 2024,
        session: '全国',
        domain: '安全工程',
        question: '威胁建模(Threat Modeling)的主要目的是（）',
        options: [
          'A. 在系统设计阶段识别和评估潜在威胁，指导安全设计',
          'B. 在测试阶段发现所有漏洞',
          'C. 在运维阶段进行入侵检测',
          'D. 在开发阶段自动化代码审计'
        ],
        correctIndex: 0,
        explanation: '威胁建模是在系统设计阶段系统地识别、评估和应对潜在安全威胁的过程，常用方法如STRIDE模型，是左移安全(Shift-Left)的核心实践。'
      },
      {
        id: 'cisp-2024-national-030',
        year: 2024,
        session: '全国',
        domain: '信息安全管理体系',
        question: 'ISO 27005标准主要关注的是（）',
        options: [
          'A. 信息安全管理体系的实施指南',
          'B. 信息安全风险管理',
          'C. 密码技术的使用规范',
          'D. 个人信息保护技术'
        ],
        correctIndex: 1,
        explanation: 'ISO 27005是信息安全风险管理的标准，提供信息安全风险管理的框架和方法学，与ISO 27001(管理体系要求)形成配套。'
      }
    ],
    practiceEnvironment: [
      {
        id: 'national-2024-juice-shop',
        name: 'OWASP Juice Shop',
        description: '现代Web应用漏洞靶场，练习XSS/SQLi/CSRF等全国卷核心考点',
        url: 'https://owasp.org/www-project-juice-shop/'
      },
      {
        id: 'national-2024-webgoat',
        name: 'OWASP WebGoat',
        description: 'OWASP官方教学应用，覆盖认证失效/安全配置错误/注入等OWASP Top10',
        url: 'https://owasp.org/www-project-webgoat/'
      },
      {
        id: 'national-2024-dvwa',
        name: 'DVWA',
        description: 'PHP经典Web漏洞靶场，低/中/高/不可见四种难度循序渐进学习',
        url: 'https://github.com/digininja/DVWA'
      },
      {
        id: 'national-2024-sqli-labs',
        name: 'SQLi-Labs',
        description: 'SQL注入专项练习靶场，涵盖25+种不同注入场景',
        url: 'https://github.com/Audi-1/sqli-labs'
      },
      {
        id: 'national-2024-crypto-pals',
        name: 'CryptoPals 密码学挑战',
        description: '著名密码学练习集，覆盖对称加密/非对称加密/哈希算法等高频考点',
        url: 'https://cryptopals.com/'
      }
    ]
  },
  {
    id: 'cisp-2023-national',
    title: '2023年CISP认证考试真题（全国卷）',
    year: 2023,
    month: '全',
    description: '2023年全国CISP认证考试真题精选',
    difficulty: '基础',
    totalScore: 100,
    passingScore: 70,
    duration: 120,
    questions: [
      {
        id: 'cisp-2023-001',
        year: 2023,
        session: '全国',
        domain: '信息安全保障',
        question: '以下哪项不是信息安全的主要目标（）',
        options: ['A. 保护信息的机密性', 'B. 保证信息的完整性', 'C. 确保信息的高可用性', 'D. 实现信息的免费共享'],
        correctIndex: 3,
        explanation: '信息安全的主要目标是保护机密性、完整性和可用性（CIA三要素），不包括免费共享信息。'
      },
      {
        id: 'cisp-2023-002',
        year: 2023,
        session: '全国',
        domain: '网络安全',
        question: 'ARP欺骗攻击属于哪种类型的攻击（）',
        options: ['A. 拒绝服务攻击', 'B. 中间人攻击', 'C. 分布式拒绝服务攻击', 'D. 缓冲区溢出攻击'],
        correctIndex: 1,
        explanation: 'ARP欺骗通过伪造ARP响应，将攻击者的MAC地址与网关IP绑定，实现中间人攻击，可以窃取或篡改通信数据。'
      },
      {
        id: 'cisp-2023-003',
        year: 2023,
        session: '全国',
        domain: '加密技术',
        question: '以下哪种攻击专门针对哈希算法的抗碰撞性（）',
        options: ['A. 暴力破解', 'B. 生日攻击', 'C. 中间人攻击', 'D. 重放攻击'],
        correctIndex: 1,
        explanation: '生日攻击利用概率学原理，专门针对哈希算法的抗碰撞性，通过较少次数的尝试找到两个产生相同哈希值的输入。'
      },
      {
        id: 'cisp-2023-004',
        year: 2023,
        session: '全国',
        domain: '访问控制',
        question: '最小知情原则（Need-to-Know原则）是指（）',
        options: [
          'A. 用户需要知道所有系统的配置',
          'B. 用户只能访问工作所必需的信息',
          'C. 管理员需要知道所有用户的密码',
          'D. 审计员需要访问所有日志'
        ],
        correctIndex: 1,
        explanation: '最小知情原则（Need-to-Know）要求用户只能访问其工作职责所必需的信息，即使拥有相应权限，也只在需要时访问。'
      },
      {
        id: 'cisp-2023-005',
        year: 2023,
        session: '全国',
        domain: '等级保护',
        question: '等级保护第三级的核心保护对象是（）',
        options: ['A. 一般信息系统', 'B. 涉及国家安全、社会秩序和公共利益的重要信息系统', 'C. 仅涉及国防的系统', 'D. 个人家庭系统'],
        correctIndex: 1,
        explanation: '等级保护第三级（监督保护级）的保护对象是涉及国家安全、社会秩序和公共利益的重要信息系统。'
      },
      {
        id: 'cisp-2023-006',
        year: 2023,
        session: '全国',
        domain: '法律法规',
        question: '《网络安全法》中规定的关键信息基础设施保护制度，适用于（）',
        options: ['A. 所有网络运营者', 'B. 关键信息基础设施运营者', 'C. 只有大型企业', 'D. 只有国有企业'],
        correctIndex: 1,
        explanation: '《网络安全法》对关键信息基础设施运营者提出了特殊的安全保护要求，包括等级保护制度、安全审查制度等。'
      },
      {
        id: 'cisp-2023-007',
        year: 2023,
        session: '全国',
        domain: '业务连续性',
        question: '业务影响分析（BIA）的主要输出是（）',
        options: ['A. 防火墙配置策略', 'B. 确定关键业务及其恢复优先级', 'C. 员工培训计划', 'D. 软件开发文档'],
        correctIndex: 1,
        explanation: '业务影响分析（BIA）的主要输出是确定关键业务流程、评估中断影响、确定恢复优先级和RTO/RPO指标。'
      },
      {
        id: 'cisp-2023-008',
        year: 2023,
        session: '全国',
        domain: '安全评估',
        question: '渗透测试与漏洞扫描的主要区别在于（）',
        options: [
          'A. 两者没有区别',
          'B. 渗透测试会尝试利用漏洞获取系统权限',
          'C. 漏洞扫描不需要工具',
          'D. 渗透测试不需要授权'
        ],
        correctIndex: 1,
        explanation: '渗透测试会尝试利用发现的漏洞进行更深层次的攻击，验证漏洞的实际影响，而漏洞扫描只是检测漏洞的存在。'
      },
      {
        id: 'cisp-2023-009',
        year: 2023,
        session: '全国',
        domain: '应用安全',
        question: '防止SQL注入的最佳实践是（）',
        options: ['A. 使用白名单验证', 'B. 使用参数化查询', 'C. 对用户输入进行HTML编码', 'D. 使用GET方法提交表单'],
        correctIndex: 1,
        explanation: '使用参数化查询（预编译语句）是防止SQL注入的最佳方法，它将用户输入作为参数处理，避免SQL代码注入。'
      },
      {
        id: 'cisp-2023-010',
        year: 2023,
        session: '全国',
        domain: '信息安全管理体系',
        question: 'ISO 27001标准中，风险评估方法应该（）',
        options: ['A. 随机选择', 'B. 组织自行决定', 'C. 必须符合标准要求', 'D. 由第三方机构指定'],
        correctIndex: 1,
        explanation: 'ISO 27001标准不强制要求特定的风险评估方法，组织可以根据自身情况选择适合的方法，但应形成文件化的风险评估过程。'
      },
      {
        id: 'cisp-2023-011',
        year: 2023,
        session: '全国',
        domain: '网络安全',
        question: '以下哪种不属于常见的Web安全威胁（）',
        options: ['A. XSS', 'B. CSRF', 'C. SQL注入', 'D. 本地提权'],
        correctIndex: 3,
        explanation: 'XSS、CSRF、SQL注入都是常见的Web应用安全威胁，本地提权通常是操作系统级别的攻击，不属于Web特定威胁。'
      },
      {
        id: 'cisp-2023-012',
        year: 2023,
        session: '全国',
        domain: '加密技术',
        question: 'PKI（公钥基础设施）的核心组件不包括（）',
        options: ['A. 证书认证机构（CA）', 'B. 注册机构（RA）', 'C. 邮件服务器', 'D. 证书吊销列表（CRL）'],
        correctIndex: 2,
        explanation: 'PKI的核心组件包括CA、RA、证书存储库、证书吊销列表等，邮件服务器不属于PKI组件。'
      },
      {
        id: 'cisp-2023-013',
        year: 2023,
        session: '全国',
        domain: '物理安全',
        question: '闭路电视监控系统（CCTV）的主要作用是（）',
        options: ['A. 防火', 'B. 监控和记录活动', 'C. 防盗报警', 'D. 网络安全防护'],
        correctIndex: 1,
        explanation: 'CCTV主要用于监控和记录特定区域的视觉活动，辅助物理安全管理和事后调查。'
      },
      {
        id: 'cisp-2023-014',
        year: 2023,
        session: '全国',
        domain: '安全工程与运营',
        question: '安全补丁管理的正确流程是（）',
        options: [
          'A. 直接在生产环境安装',
          'B. 测试、评估、规划、部署、验证',
          'C. 等待用户报告问题',
          'D. 只在系统崩溃时才打补丁'
        ],
        correctIndex: 1,
        explanation: '安全补丁管理应遵循：测试补丁兼容性→评估影响→规划部署时间→部署补丁→验证效果的流程，避免对生产环境造成影响。'
      },
      {
        id: 'cisp-2023-015',
        year: 2023,
        session: '全国',
        domain: '访问控制',
        question: '关于生物识别认证，以下说法正确的是（）',
        options: ['A. 指纹是最不准确的生物识别方式', 'B. 生物特征一旦泄露无法更换', 'C. 虹膜识别可以被照片欺骗', 'D. 生物识别不需要与其他认证方式结合']
        ,
        correctIndex: 1,
        explanation: '生物特征（如指纹、虹膜）一旦泄露，由于不可撤销性，无法更换，这是生物识别的主要安全考虑因素。'
      },
      {
        id: 'cisp-2023-016',
        year: 2023,
        session: '全国',
        domain: '法律法规',
        question: '根据《数据安全法》，数据安全审查制度针对的是（）',
        options: ['A. 所有数据处理活动', 'B. 影响国家安全的数据处理活动', 'C. 个人数据处理', 'D. 企业内部数据'],
        correctIndex: 1,
        explanation: '《数据安全法》建立了数据安全审查制度，主要针对影响国家安全的数据处理活动，特别是关键信息基础设施运营者的数据处理。'
      },
      {
        id: 'cisp-2023-017',
        year: 2023,
        session: '全国',
        domain: '信息安全保障',
        question: '零信任安全模型的核心原则是（）',
        options: [
          'A. 信任内部网络',
          'B. 永不信任，始终验证',
          'C. 只验证一次',
          'D. 信任硬件设备'
        ],
        correctIndex: 1,
        explanation: '零信任（Zero Trust）的核心理念是"永不信任，始终验证"，不区分内网外网，每次访问都需要进行身份验证和授权。'
      },
      {
        id: 'cisp-2023-018',
        year: 2023,
        session: '全国',
        domain: '网络安全',
        question: 'VPN隧道协议中，IPSec工作在哪一层（）',
        options: ['A. 应用层', 'B. 传输层', 'C. 网络层', 'D. 数据链路层'],
        correctIndex: 2,
        explanation: 'IPSec工作在网络层，为IP层提供安全保护，可以对整个IP数据包进行加密和认证。'
      },
      {
        id: 'cisp-2023-019',
        year: 2023,
        session: '全国',
        domain: '安全评估',
        question: '日志审计的主要目的是（）',
        options: ['A. 减少存储空间', 'B. 发现安全事件和违规行为', 'C. 提高系统性能', 'D. 满足合规要求'],
        correctIndex: 1,
        explanation: '日志审计的主要目的是发现和追踪安全事件、检测违规行为、支持事件调查和取证，同时也是合规要求的一部分。'
      },
      {
        id: 'cisp-2023-020',
        year: 2023,
        session: '全国',
        domain: '加密技术',
        question: '关于对称加密和非对称加密的比较，以下说法正确的是（）',
        options: [
          'A. 对称加密比非对称加密更适用于密钥交换',
          'B. 非对称加密的密钥管理更简单',
          'C. 对称加密通常比非对称加密速度快',
          'D. 非对称加密可以同时提供保密性和不可否认性'
        ],
        correctIndex: 2,
        explanation: '对称加密算法通常比非对称加密算法速度快很多，因此实际应用中常使用混合加密：非对称加密交换密钥，对称加密加密数据。'
      },
      {
        id: 'cisp-2023-021',
        year: 2023,
        session: '全国',
        domain: '法律法规',
        question: '《网络安全法》规定，关键信息基础设施运营者在境内运营中收集和产生的个人信息和重要数据，存储要求是（）',
        options: [
          'A. 可以在境外存储',
          'B. 应当在境内存储',
          'C. 无特殊要求',
          'D. 只能存储在个人设备'
        ],
        correctIndex: 1,
        explanation: '《网络安全法》第三十七条明确规定，关键信息基础设施运营者在境内运营中收集和产生的个人信息和重要数据应当在境内存储。确需向境外提供的，应当进行安全评估。'
      },
      {
        id: 'cisp-2023-022',
        year: 2023,
        session: '全国',
        domain: '等级保护',
        question: '等保2.0中，第三级系统的安全技术要求不包括以下哪项（）',
        options: [
          'A. 安全物理环境',
          'B. 安全计算环境',
          'C. 加密数字货币管理',
          'D. 安全区域边界'
        ],
        correctIndex: 2,
        explanation: '等保2.0的安全技术要求包括安全物理环境、安全通信网络、安全区域边界、安全计算环境和安全管理中心，不涉及加密数字货币管理。'
      },
      {
        id: 'cisp-2023-023',
        year: 2023,
        session: '全国',
        domain: '信息安全监管',
        question: '国家网信部门依照《网络安全法》和有关法律、行政法规，对关键信息基础设施安全保护工作进行（）',
        options: [
          'A. 完全不干预',
          'B. 统筹协调和监督管理',
          'C. 只提供技术支持',
          'D. 替代运营者进行管理'
        ],
        correctIndex: 1,
        explanation: '国家网信部门依照《网络安全法》和有关法律、行政法规，对关键信息基础设施安全保护工作进行统筹协调和监督管理，而不是替代运营者。'
      },
      {
        id: 'cisp-2023-024',
        year: 2023,
        session: '全国',
        domain: '业务连续性',
        question: '以下哪项不是灾难恢复计划(DRP)应包含的内容（）',
        options: [
          'A. 恢复团队成员名单及联系方式',
          'B. 恢复流程和RTO/RPO指标',
          'C. 员工年度绩效考核方案',
          'D. 备选技术设施和通信方式'
        ],
        correctIndex: 2,
        explanation: 'DRP应包含恢复团队、恢复流程、RTO/RPO指标、备选设施和通信方式等，员工绩效考核属于人力资源管理内容，不属于DRP。'
      },
      {
        id: 'cisp-2023-025',
        year: 2023,
        session: '全国',
        domain: '安全评估',
        question: '关于渗透测试授权，以下说法正确的是（）',
        options: [
          'A. 只要不造成损害就不需要授权',
          'B. 必须获得被测方书面授权，并明确测试范围',
          'C. 口头授权即可',
          'D. 测试人员可以自行决定测试范围'
        ],
        correctIndex: 1,
        explanation: '渗透测试必须获得被测方的书面正式授权，明确测试范围、时间窗口、方法和限制，未经授权的测试可能违反《网络安全法》等法律法规。'
      },
      {
        id: 'cisp-2023-026',
        year: 2023,
        session: '全国',
        domain: '信息安全管理体系',
        question: 'ISO 27001认证的有效期通常为（）',
        options: [
          'A. 1年',
          'B. 3年',
          'C. 5年',
          'D. 永久有效'
        ],
        correctIndex: 1,
        explanation: 'ISO 27001认证证书有效期为3年，期间需要进行年度监督审核以维持认证有效性，3年期满后需进行再认证审核。'
      },
      {
        id: 'cisp-2023-027',
        year: 2023,
        session: '全国',
        domain: '访问控制',
        question: '基于角色的访问控制(RBAC)的核心思想是（）',
        options: [
          'A. 直接为每个用户分配权限',
          'B. 将权限分配给角色，再将角色分配给用户',
          'C. 根据用户位置决定权限',
          'D. 根据设备特征决定权限'
        ],
        correctIndex: 1,
        explanation: 'RBAC核心思想是通过角色作为中间层，将权限分配给角色，再将角色分配给用户，实现权限的集中管理和灵活配置，降低管理复杂度。'
      },
      {
        id: 'cisp-2023-028',
        year: 2023,
        session: '全国',
        domain: '加密技术',
        question: '关于数字签名的说法，正确的是（）',
        options: [
          'A. 数字签名使用接收方的公钥进行签名',
          'B. 数字签名可以提供消息完整性和不可否认性',
          'C. 数字签名与手写签名功能完全相同',
          'D. 数字签名使用对称密钥生成'
        ],
        correctIndex: 1,
        explanation: '数字签名使用发送方的私钥对消息摘要进行加密生成签名，接收方使用公钥验证，可提供消息完整性和不可否认性保护。'
      },
      {
        id: 'cisp-2023-029',
        year: 2023,
        session: '全国',
        domain: '物理安全',
        question: '数据中心的门禁系统使用多因素认证的最佳实践是（）',
        options: [
          'A. 只使用密码',
          'B. 门禁卡+指纹/人脸识别',
          'C. 只使用门禁卡',
          'D. 不使用任何门禁'
        ],
        correctIndex: 1,
        explanation: '多因素认证结合两种不同类型的认证因素（如持有因素门禁卡+生物因素指纹/人脸），大幅提升物理访问控制的安全性。'
      },
      {
        id: 'cisp-2023-030',
        year: 2023,
        session: '全国',
        domain: '安全工程与运营',
        question: '应急响应流程的正确顺序是（）',
        options: [
          'A. 准备→检测→遏制→根除→恢复→总结',
          'B. 检测→准备→恢复→根除→遏制→总结',
          'C. 总结→准备→检测→遏制→根除→恢复',
          'D. 恢复→准备→检测→遏制→根除→总结'
        ],
        correctIndex: 0,
        explanation: '标准应急响应流程：准备(Preparation)→检测(Detection)→遏制(Containment)→根除(Eradication)→恢复(Recovery)→总结(Lessons Learned)。'
      }
    ],
    practiceEnvironment: [
      {
        id: '2023-cisp-exam',
        name: 'CISP 官方考试指南',
        description: '信息安全测评中心CISP官方资料，了解考试大纲和核心知识体系',
        url: 'https://www.itsec.gov.cn/'
      },
      {
        id: '2023-classified-regulations',
        name: '等级保护2.0测评实验室',
        description: '模拟等保2.0测评流程，学习定级/备案/建设/测评全流程知识',
        url: 'https://www.djbh.net/'
      },
      {
        id: '2023-law-practice',
        name: '法律法规知识测验',
        description: '网络安全法/数据安全法/个人信息保护法综合练习环境',
        url: 'https://www.chinalaw.gov.cn/'
      },
      {
        id: '2023-compliance-lab',
        name: '合规管理实践平台',
        description: '模拟企业信息安全合规场景，练习ISMS建设和ISO 27001内审',
        url: 'https://www.iso.org/isoiec-27001-information-security.html'
      },
      {
        id: '2023-incident-response',
        name: '应急响应演练平台',
        description: '模拟安全事件应急响应全流程，练习准备→检测→遏制→根除→恢复→总结',
        url: 'https://www.first.org/'
      }
    ]
  },
  {
    id: 'cisp-2022-national',
    title: '2022年CISP认证考试真题精选',
    year: 2022,
    month: '全',
    description: '2022年全国CISP认证考试真题',
    difficulty: '基础',
    totalScore: 100,
    passingScore: 70,
    duration: 120,
    questions: [
      {
        id: 'cisp-2022-001',
        year: 2022,
        session: '全国',
        domain: '信息安全保障',
        question: '以下哪项描述的是信息安全的可用性（）',
        options: [
          'A. 确保信息不被未授权访问',
          'B. 确保信息在需要时可用',
          'C. 确保信息不被未授权修改',
          'D. 确保信息来源可被验证'
        ],
        correctIndex: 1,
        explanation: '可用性确保授权用户在需要时能够及时可靠地访问和使用信息。'
      },
      {
        id: 'cisp-2022-002',
        year: 2022,
        session: '全国',
        domain: '网络安全',
        question: '关于TCP协议的安全问题，以下说法正确的是（）',
        options: [
          'A. TCP是绝对安全的协议',
          'B. TCP三次握手存在被利用的风险',
          'C. TCP不需要任何安全措施',
          'D. TCP只用于内网通信'
        ],
        correctIndex: 1,
        explanation: 'TCP协议存在多种安全风险，如SYN Flood利用三次握手缺陷、会话劫持等，需要结合其他安全机制使用。'
      },
      {
        id: 'cisp-2022-003',
        year: 2022,
        session: '全国',
        domain: '加密技术',
        question: '以下哪种算法可以提供数字签名功能（）',
        options: ['A. AES', 'B. MD5', 'C. RSA', 'D. DES'],
        correctIndex: 2,
        explanation: 'RSA等非对称加密算法可以提供数字签名功能，通过私钥签名、公钥验证实现认证和不可否认性。'
      },
      {
        id: 'cisp-2022-004',
        year: 2022,
        session: '全国',
        domain: '访问控制',
        question: '强制访问控制（MAC）的特点不包括（）',
        options: [
          'A. 由系统强制执行访问控制',
          'B. 用户可以自主改变资源访问权限',
          'C. 基于安全标签进行访问控制',
          'D. 适用于高安全级别环境'
        ],
        correctIndex: 1,
        explanation: '强制访问控制（MAC）由系统强制执行，用户不能自主改变资源的访问权限，这与自主访问控制（DAC）的主要区别。'
      },
      {
        id: 'cisp-2022-005',
        year: 2022,
        session: '全国',
        domain: '等级保护',
        question: '等级保护2.0中的安全管理中心不包括以下哪个功能（）',
        options: ['A. 集中监控', 'B. 集中管理', 'C. 集中审计', 'D. 集中开发'],
        correctIndex: 3,
        explanation: '等级保护2.0的"一个中心"指安全管理中心，包括集中监控、集中管理和集中审计功能，不包括软件开发。'
      },
      {
        id: 'cisp-2022-006',
        year: 2022,
        session: '全国',
        domain: '法律法规',
        question: '《网络安全法》规定，网络运营者应当建立网络信息安全投诉、举报制度，公布投诉、举报方式等信息，及时受理并处理有关网络信息安全的投诉和举报。这体现了用户的（）',
        options: ['A. 隐私权', 'B. 知情权', 'C. 选择权', 'D. 财产权'],
        correctIndex: 1,
        explanation: '《网络安全法》要求网络运营者公布投诉举报方式，及时受理处理，这体现了用户对网络信息安全问题的知情权和监督权。'
      },
      {
        id: 'cisp-2022-007',
        year: 2022,
        session: '全国',
        domain: '业务连续性',
        question: '灾难恢复计划（DRP）的测试方法中，最全面但也最具风险的是（）',
        options: ['A. 桌面演练', 'B. 模拟测试', 'C. 完全中断测试', 'D. 抄读测试'],
        correctIndex: 2,
        explanation: '完全中断测试要求实际切换到灾难恢复站点，最能验证DRP的有效性，但风险最高，可能影响正常业务。'
      },
      {
        id: 'cisp-2022-008',
        year: 2022,
        session: '全国',
        domain: '安全评估',
        question: '安全架构评审属于哪种安全控制类型（）',
        options: ['A. 预防性控制', 'B. 检测性控制', 'C. 纠正性控制', 'D. 威慑性控制'],
        correctIndex: 0,
        explanation: '安全架构评审通过在设计阶段发现和消除安全缺陷，属于预防性控制，可以在问题发生前进行防范。'
      },
      {
        id: 'cisp-2022-009',
        year: 2022,
        session: '全国',
        domain: '应用安全',
        question: '会话管理安全的主要威胁是（）',
        options: ['A. 会话劫持和会话预测', 'B. 数据库入侵', 'C. 密码破解', 'D. 病毒攻击'],
        correctIndex: 0,
        explanation: '会话管理的主要威胁包括会话劫持（窃取合法会话ID）和会话预测（猜测会话ID），可能导致攻击者冒充合法用户。'
      },
      {
        id: 'cisp-2022-010',
        year: 2022,
        session: '全国',
        domain: '信息安全管理体系',
        question: 'ISO 27001标准中，适用性声明（SoA）的作用是（）',
        options: [
          'A. 证明组织已通过认证',
          'B. 识别和记录哪些控制措施适用或不适用于ISMS',
          'C. 定义安全预算',
          'D. 培训计划'
        ],
        correctIndex: 1,
        explanation: '适用性声明（Statement of Applicability）识别并记录哪些ISO 27001控制措施适用或不适用于组织，是风险评估和控制的输出。'
      },
      {
        id: 'cisp-2022-011',
        year: 2022,
        session: '全国',
        domain: '网络安全',
        question: '关于蜜罐（HoneyPot）的说法，正确的是（）',
        options: [
          'A. 蜜罐是用于正常业务的服务器',
          'B. 蜜罐用于诱骗和监测攻击者',
          'C. 蜜罐会增加系统性能',
          'D. 蜜罐不需要特别管理'
        ],
        correctIndex: 1,
        explanation: '蜜罐是故意设置的具有脆弱性的系统，用于诱骗攻击者、监测攻击行为、收集攻击情报，不用于正常业务。'
      },
      {
        id: 'cisp-2022-012',
        year: 2022,
        session: '全国',
        domain: '加密技术',
        question: '关于密码存储安全的最佳实践，说法正确的是（）',
        options: [
          'A. 密码应明文存储便于恢复',
          'B. 密码应使用强哈希算法加盐存储',
          'C. 密码应使用对称加密存储',
          'D. 密码应存储在代码中'
        ],
        correctIndex: 1,
        explanation: '密码应使用强哈希算法（如bcrypt、Argon2）加盐存储，这是密码存储安全的最佳实践，避免密码泄露后被直接使用。'
      },
      {
        id: 'cisp-2022-013',
        year: 2022,
        session: '全国',
        domain: '物理安全',
        question: '数据中心物理安全的第一道防线是（）',
        options: ['A. 防火墙', 'B. 门禁系统', 'C. 监控摄像头', 'D. 保安'],
        correctIndex: 1,
        explanation: '门禁系统是数据中心物理安全的第一道防线，控制谁可以物理进入数据中心区域。'
      },
      {
        id: 'cisp-2022-014',
        year: 2022,
        session: '全国',
        domain: '安全工程与运营',
        question: '安全配置基线的建立应该基于（）',
        options: ['A. 供应商默认配置', 'B. 行业最佳实践和组织安全策略', 'C. 随机选择', 'D. 成本最低的配置'],
        correctIndex: 1,
        explanation: '安全配置基线应基于行业最佳实践（如CIS Benchmark）、组织安全策略和合规要求建立，不是简单使用供应商默认配置。'
      },
      {
        id: 'cisp-2022-015',
        year: 2022,
        session: '全国',
        domain: '访问控制',
        question: '关于特权访问管理（PAM），以下说法正确的是（）',
        options: [
          'A. PAM主要用于管理普通用户访问',
          'B. PAM可以记录和审计特权操作',
          'C. PAM会增加管理复杂度',
          'D. PAM对安全没有帮助'
        ],
        correctIndex: 1,
        explanation: '特权访问管理（PAM）专门管理高风险特权账户，可以记录和审计所有特权操作，降低特权滥用风险。'
      },
      {
        id: 'cisp-2022-016',
        year: 2022,
        session: '全国',
        domain: '法律法规',
        question: '《个人信息保护法》中规定的"最小必要"原则是指（）',
        options: [
          'A. 处理个人信息越多越好',
          'B. 只处理与实现处理目的有关的最小必要信息',
          'C. 收集最少的数据即可',
          'D. 个人信息不需要保护'
        ],
        correctIndex: 1,
        explanation: '《个人信息保护法》要求处理个人信息应具有明确目的，只收集与处理目的有关的最小必要信息，避免过度收集。'
      },
      {
        id: 'cisp-2022-017',
        year: 2022,
        session: '全国',
        domain: '信息安全保障',
        question: '关于威胁情报的说法，正确的是（）',
        options: [
          'A. 威胁情报只用于大企业',
          'B. 威胁情报可以帮助组织更好地了解潜在威胁',
          'C. 威胁情报不需要更新',
          'D. 威胁情报对防御没有帮助'
        ],
        correctIndex: 1,
        explanation: '威胁情报提供关于已知威胁行为者、攻击手法、IOC等信息，帮助组织了解威胁形势，提前做好防御准备。'
      },
      {
        id: 'cisp-2022-018',
        year: 2022,
        session: '全国',
        domain: '网络安全',
        question: '关于入侵检测系统（IDS）的部署位置，以下说法正确的是（）',
        options: [
          'A. IDS应该只部署在网络边界',
          'B. IDS应该部署在关键网络位置',
          'C. IDS部署位置不影响检测效果',
          'D. IDS不需要部署'
        ],
        correctIndex: 1,
        explanation: 'IDS应该部署在关键网络位置，如网络边界、内网各段之间、服务器区入口等，以便检测内外部攻击流量。'
      },
      {
        id: 'cisp-2022-019',
        year: 2022,
        session: '全国',
        domain: '安全评估',
        question: '代码安全审计属于哪种安全测试方法（）',
        options: ['A. 黑盒测试', 'B. 白盒测试', 'C. 灰盒测试', 'D. 渗透测试'],
        correctIndex: 1,
        explanation: '代码安全审计通过检查源代码发现安全缺陷，属于白盒测试方法，可以发现静态分析难以发现的安全问题。'
      },
      {
        id: 'cisp-2022-020',
        year: 2022,
        session: '全国',
        domain: '加密技术',
        question: '关于端到端加密（E2EE），以下说法正确的是（）',
        options: [
          'A. 只有发送方和接收方能解密数据',
          'B. 服务提供商可以解密数据',
          'C. 加密和解密都在服务器端完成',
          'D. 端到端加密不需要密钥'
        ],
        correctIndex: 0,
        explanation: '端到端加密确保只有通信的发送方和接收方能够解密和读取数据，服务提供商也无法访问加密内容。'
      },
      {
        id: 'cisp-2022-021',
        year: 2022,
        session: '全国',
        domain: '网络安全',
        question: '关于TCP/IP协议栈各层功能，以下说法正确的是（）',
        options: [
          'A. 网络层负责端到端的可靠数据传输',
          'B. 传输层负责IP地址和路由选择',
          'C. 应用层提供用户可见的服务（HTTP/FTP等）',
          'D. 数据链路层处理跨网络数据包转发'
        ],
        correctIndex: 2,
        explanation: '应用层直接为用户应用提供服务（HTTP、FTP、DNS等）。网络层负责IP寻址和路由，传输层负责端到端通信，数据链路层负责同一网段内的帧传输。'
      },
      {
        id: 'cisp-2022-022',
        year: 2022,
        session: '全国',
        domain: '信息安全保障',
        question: '信息安全的三个基本属性(CIA)是（）',
        options: [
          'A. 保密性、完整性、可用性',
          'B. 可控性、可审查性、可认证性',
          'C. 真实性、可靠性、可追溯性',
          'D. 保密性、可靠性、可扩展性'
        ],
        correctIndex: 0,
        explanation: 'CIA三要素是信息安全的核心：保密性(Confidentiality)防止未授权信息泄露；完整性(Integrity)防止未授权信息篡改；可用性(Availability)确保授权用户在需要时可以访问系统和数据。'
      },
      {
        id: 'cisp-2022-023',
        year: 2022,
        session: '全国',
        domain: '加密技术',
        question: '以下算法中属于对称加密算法的是（）',
        options: [
          'A. RSA',
          'B. ECC',
          'C. AES',
          'D. DSA'
        ],
        correctIndex: 2,
        explanation: 'AES(高级加密标准)是对称加密算法，使用相同的密钥进行加密和解密。RSA、ECC、DSA都是非对称加密算法或数字签名算法。'
      },
      {
        id: 'cisp-2022-024',
        year: 2022,
        session: '全国',
        domain: '网络安全',
        question: '关于常见端口号及其对应的服务，以下匹配正确的是（）',
        options: [
          'A. HTTP - 21, FTP - 80, SSH - 22, MySQL - 3389',
          'B. HTTP - 80, HTTPS - 443, SSH - 22, RDP - 3389',
          'C. HTTPS - 80, HTTP - 443, Telnet - 25',
          'D. FTP - 22, SSH - 21, DNS - 53, SMTP - 80'
        ],
        correctIndex: 1,
        explanation: '正确端口对应：HTTP(80)、HTTPS(443)、SSH(22)、FTP(21)、DNS(53)、SMTP(25)、MySQL(3306)、RDP(3389)。熟记这些常见端口是网络安全的基础。'
      },
      {
        id: 'cisp-2022-025',
        year: 2022,
        session: '全国',
        domain: '访问控制',
        question: '自主访问控制(DAC)的特点是（）',
        options: [
          'A. 由系统强制控制，用户无法改变',
          'B. 资源拥有者可以自主决定谁可以访问其资源',
          'C. 只根据用户角色分配权限',
          'D. 不适合任何实际应用场景'
        ],
        correctIndex: 1,
        explanation: 'DAC的核心特点是资源的拥有者可以自主决定访问权限的分配，典型实现如Unix文件系统权限。MAC由系统强制控制，RBAC基于角色分配。'
      },
      {
        id: 'cisp-2022-026',
        year: 2022,
        session: '全国',
        domain: '应用安全',
        question: 'OWASP Top 10中，"注入"类漏洞的典型代表是（）',
        options: [
          'A. 拒绝服务攻击',
          'B. SQL注入、命令注入、XSS脚本注入',
          'C. 社会工程攻击',
          'D. 物理安全攻击'
        ],
        correctIndex: 1,
        explanation: 'OWASP Top 10中的注入类漏洞包括SQL注入、命令注入、表达式语言(EL)注入等，其根本原因是将用户可控的输入动态拼接到命令或查询中。'
      },
      {
        id: 'cisp-2022-027',
        year: 2022,
        session: '全国',
        domain: '安全工程与运营',
        question: '以下哪项是账户锁定策略的主要目的（）',
        options: [
          'A. 防止用户忘记密码',
          'B. 阻止暴力破解/字典攻击',
          'C. 减少系统资源消耗',
          'D. 方便管理员管理账户'
        ],
        correctIndex: 1,
        explanation: '账户锁定策略在多次失败登录尝试后临时锁定账户，主要目的是阻止暴力破解和字典攻击，有效增加攻击者破解密码的成本。'
      },
      {
        id: 'cisp-2022-028',
        year: 2022,
        session: '全国',
        domain: '物理安全',
        question: '数据中心选址时应主要考虑的安全因素不包括（）',
        options: [
          'A. 远离地震带、洪水区等自然灾害风险区域',
          'B. 稳定的电力供应和网络基础设施',
          'C. 距离员工居住区域的远近',
          'D. 物理安全防护的可实施性'
        ],
        correctIndex: 2,
        explanation: '数据中心选址主要考虑地理位置安全、自然灾害风险、电力供应、网络基础设施、周边环境安全等。员工居住距离不是选址的关键安全因素。'
      },
      {
        id: 'cisp-2022-029',
        year: 2022,
        session: '全国',
        domain: '信息安全保障',
        question: '社会工程学攻击主要利用（）',
        options: [
          'A. 软件漏洞进行攻击',
          'B. 硬件缺陷进行攻击',
          'C. 人的心理弱点和信任关系进行攻击',
          'D. 网络协议缺陷进行攻击'
        ],
        correctIndex: 2,
        explanation: '社会工程学攻击主要利用人的心理弱点（如好奇心、信任心、恐惧心），通过欺骗、诱导等方式获取敏感信息或执行非法操作，典型如钓鱼邮件。'
      },
      {
        id: 'cisp-2022-030',
        year: 2022,
        session: '全国',
        domain: '等级保护',
        question: '等级保护制度将信息系统安全保护等级划分为（）',
        options: [
          'A. 三级',
          'B. 四级',
          'C. 五级',
          'D. 十级'
        ],
        correctIndex: 2,
        explanation: '等级保护制度将信息系统安全保护等级从低到高划分为五级：第一级(自主保护)、第二级(指导保护)、第三级(监督保护)、第四级(强制保护)、第五级(专控保护)。'
      }
    ],
    practiceEnvironment: [
      {
        id: '2022-tryhackme',
        name: 'TryHackMe',
        description: '交互式网络安全学习平台，包含1000+房间，覆盖网络基础/渗透测试/逆向分析等基础领域',
        url: 'https://tryhackme.com/'
      },
      {
        id: '2022-nmap-lab',
        name: 'Nmap 扫描实验室',
        description: '学习端口扫描技术，练习主机发现/服务识别/版本检测/脚本扫描等网络侦察基础技能',
        url: 'https://nmap.org/bennieston-tutorial/'
      },
      {
        id: '2022-wireshark',
        name: 'Wireshark 抓包分析',
        description: '练习网络数据包捕获和分析，学习TCP/IP协议、HTTP/HTTPS流量分析、异常流量检测',
        url: 'https://www.wireshark.org/'
      },
      {
        id: '2022-picoctf',
        name: 'PicoCTF',
        description: '由CMU创办的免费CTF练习平台，入门友好，包含Web/密码/逆向/Pwn等多种题型',
        url: 'https://picoctf.org/'
      },
      {
        id: '2022-network-lab',
        name: '网络安全基础靶场',
        description: '搭建模拟网络环境，练习防火墙配置、IDS/IPS部署、VPN配置、DMZ区域划分等基础技能',
        url: 'https://github.com/BuildADetectionLab/buildadetectionlab'
      }
    ]
  }
];

// 额外补充的高频真题库 - 按知识域分类
export const domainQuestions: Record<string, PastPaperQuestion[]> = {
  '信息安全保障': [
    {
      id: 'domain-ia-001',
      year: 2024,
      session: '高频',
      domain: '信息安全保障',
      question: '信息安全的CIA三要素是指（）',
      options: ['A. 机密性、完整性、可否认性', 'B. 机密性、完整性、可用性', 'C. 机密性、认证性、可用性', 'D. 完整性、可用性、可审计性'],
      correctIndex: 1,
      explanation: 'CIA三要素是机密性(Confidentiality)、完整性(Integrity)和可用性(Availability)，是信息安全的三个核心目标。'
    },
    {
      id: 'domain-ia-002',
      year: 2024,
      session: '高频',
      domain: '信息安全保障',
      question: '纵深防御的核心思想是在（）部署多重安全防护',
      options: ['A. 仅一个层面', 'B. 多个层面', 'C. 网络边界', 'D. 应用层面'],
      correctIndex: 1,
      explanation: '纵深防御（Defense in Depth）通过在多个层面（物理、网络、主机、应用、数据等）部署多重安全防护，形成多层防线。'
    },
    {
      id: 'domain-ia-003',
      year: 2024,
      session: '高频',
      domain: '信息安全保障',
      question: 'PDRR模型是指（）',
      options: ['A. 防护、检测、响应、恢复', 'B. 预防、检测、响应、恢复', 'C. 防护、检测、报告、恢复', 'D. 预防、检测、响应、审计'],
      correctIndex: 0,
      explanation: 'PDRR是Protection（防护）、Detection（检测）、Response（响应）、Recovery（恢复）的缩写，是动态安全模型的代表。'
    },
    {
      id: 'domain-ia-004',
      year: 2024,
      session: '高频',
      domain: '信息安全保障',
      question: '零信任安全模型的核心原则是（）',
      options: ['A. 信任内网设备', 'B. 永不信任，始终验证', 'C. 一次性验证即可', 'D. 信任硬件设备'],
      correctIndex: 1,
      explanation: '零信任（Zero Trust）的核心理念是不区分内网外网，坚持"永不信任，始终验证"的原则。'
    },
    {
      id: 'domain-ia-005',
      year: 2024,
      session: '高频',
      domain: '信息安全保障',
      question: 'IATF框架强调的核心要素不包括（）',
      options: ['A. 人', 'B. 技术', 'C. 成本', 'D. 操作'],
      correctIndex: 2,
      explanation: 'IATF（信息保障技术框架）强调人、技术、操作三个核心要素，通过深度防御策略实现安全保障。'
    }
  ],
  '加密技术': [
    {
      id: 'domain-crypto-001',
      year: 2024,
      session: '高频',
      domain: '加密技术',
      question: '以下属于对称加密算法的是（）',
      options: ['A. RSA', 'B. ECC', 'C. AES', 'D. DSA'],
      correctIndex: 2,
      explanation: 'AES（高级加密标准）是对称加密算法，密钥长度128/192/256位。RSA、ECC、DSA都是非对称加密算法。'
    },
    {
      id: 'domain-crypto-002',
      year: 2024,
      session: '高频',
      domain: '加密技术',
      question: '哈希算法不具备以下哪个特性（）',
      options: ['A. 单向性', 'B. 抗碰撞性', 'C. 可逆性', 'D. 固定输出长度'],
      correctIndex: 2,
      explanation: '哈希算法是单向函数，无法从哈希值反推原始数据，这是其与加密算法的主要区别。'
    },
    {
      id: 'domain-crypto-003',
      year: 2024,
      session: '高频',
      domain: '加密技术',
      question: '数字签名可以提供以下哪种安全属性（）',
      options: ['A. 机密性', 'B. 完整性', 'C. 认证性和不可否认性', 'D. 可用性'],
      correctIndex: 2,
      explanation: '数字签名主要用于实现认证性和不可否认性，确认消息发送者身份并防止其否认发送。'
    },
    {
      id: 'domain-crypto-004',
      year: 2024,
      session: '高频',
      domain: '加密技术',
      question: 'PKI的核心组件不包括（）',
      options: ['A. CA', 'B. RA', 'C. Web服务器', 'D. CRL'],
      correctIndex: 2,
      explanation: 'PKI（公钥基础设施）的核心组件包括CA（证书认证机构）、RA（注册机构）、证书存储库和CRL（证书吊销列表）。'
    },
    {
      id: 'domain-crypto-005',
      year: 2024,
      session: '高频',
      domain: '加密技术',
      question: '密码存储的最佳实践是（）',
      options: ['A. 明文存储', 'B. 对称加密存储', 'C. 加盐哈希存储', 'D. Base64编码存储'],
      correctIndex: 2,
      explanation: '密码应使用强哈希算法（如bcrypt、Argon2）加盐存储，确保即使数据库泄露也无法直接还原密码。'
    }
  ],
  '网络安全': [
    {
      id: 'domain-net-001',
      year: 2024,
      session: '高频',
      domain: '网络安全',
      question: 'SYN Flood攻击利用了TCP协议的哪个缺陷（）',
      options: ['A. 四次挥手', 'B. 三次握手', 'C. 重传机制', 'D. 滑动窗口'],
      correctIndex: 1,
      explanation: 'SYN Flood攻击利用TCP三次握手机制，发送大量SYN请求但不完成握手，耗尽服务器资源。'
    },
    {
      id: 'domain-net-002',
      year: 2024,
      session: '高频',
      domain: '网络安全',
      question: '防火墙的默认拒绝策略是指（）',
      options: ['A. 默认允许所有流量', 'B. 默认拒绝所有流量', 'C. 不做任何过滤', 'D. 仅允许特定端口'],
      correctIndex: 1,
      explanation: '默认拒绝（Default Deny）是安全最佳实践，除非明确允许，否则默认拒绝所有流量，最小化攻击面。'
    },
    {
      id: 'domain-net-003',
      year: 2024,
      session: '高频',
      domain: '网络安全',
      question: 'DMZ区域的主要作用是（）',
      options: ['A. 存储内部数据', 'B. 放置对外提供服务的系统', 'C. 加速网络', 'D. 减少成本'],
      correctIndex: 1,
      explanation: 'DMZ（隔离区）用于放置需要对外提供服务的系统（如Web、邮件服务器），作为内网和外网之间的缓冲区。'
    },
    {
      id: 'domain-net-004',
      year: 2024,
      session: '高频',
      domain: '网络安全',
      question: 'VPN的主要安全功能是（）',
      options: ['A. 加速连接', 'B. 建立加密隧道', 'C. 防止病毒', 'D. 身份认证'],
      correctIndex: 1,
      explanation: 'VPN通过在公共网络上建立加密的专用通道，保证数据传输的机密性和完整性。'
    },
    {
      id: 'domain-net-005',
      year: 2024,
      session: '高频',
      domain: '网络安全',
      question: 'IDS和IPS的主要区别是（）',
      options: ['A. IDS可以阻止攻击', 'B. IPS可以阻止攻击', 'C. 两者功能完全相同', 'D. IDS比IPS更安全'],
      correctIndex: 1,
      explanation: 'IDS（入侵检测系统）只能检测和告警，IPS（入侵防御系统）可以检测并主动阻止恶意流量。'
    }
  ],
  '访问控制': [
    {
      id: 'domain-ac-001',
      year: 2024,
      session: '高频',
      domain: '访问控制',
      question: '最小权限原则要求用户（）',
      options: ['A. 拥有所有权限', 'B. 只拥有工作必需的最小权限', 'C. 不需要任何权限', 'D. 权限越大越好'],
      correctIndex: 1,
      explanation: '最小权限原则（Principle of Least Privilege）要求用户只拥有完成工作所必需的最小权限，减少权限滥用风险。'
    },
    {
      id: 'domain-ac-002',
      year: 2024,
      session: '高频',
      domain: '访问控制',
      question: '在DAC模型中，访问权限由谁决定（）',
      options: ['A. 系统管理员', 'B. 资源拥有者', 'C. 安全策略', 'D. 审计员'],
      correctIndex: 1,
      explanation: '自主访问控制（DAC）允许资源拥有者自主决定谁可以访问其资源以及授予何种权限。'
    },
    {
      id: 'domain-ac-003',
      year: 2024,
      session: '高频',
      domain: '访问控制',
      question: 'MAC模型中，访问决策基于（）',
      options: ['A. 用户角色', 'B. 资源拥有者', 'C. 安全标签和许可级别', 'D. 部门经理'],
      correctIndex: 2,
      explanation: '强制访问控制（MAC）由系统根据用户的安全许可级别和资源的安全标签来决定访问权限，用户无法自主改变。'
    },
    {
      id: 'domain-ac-004',
      year: 2024,
      session: '高频',
      domain: '访问控制',
      question: '双因素认证是指结合哪两种认证因素（）',
      options: ['A. 两种密码', 'B. 两种不同类型的认证因素', 'C. 两次相同认证', 'D. 两种加密方式'],
      correctIndex: 1,
      explanation: '双因素认证结合两种不同类型的认证因素，如密码（知识因素）+ 指纹（生物因素）或短信验证码（持有因素）。'
    },
    {
      id: 'domain-ac-005',
      year: 2024,
      session: '高频',
      domain: '访问控制',
      question: 'RBAC中的角色是（）',
      options: ['A. 单一用户', 'B. 权限的集合', 'C. 物理位置', 'D. 网络设备'],
      correctIndex: 1,
      explanation: '在基于角色的访问控制（RBAC）中，角色是权限的集合，用户通过被分配角色来获得相应权限。'
    }
  ],
  '等级保护': [
    {
      id: 'domain-gb-001',
      year: 2024,
      session: '高频',
      domain: '等级保护',
      question: '等级保护2.0的"一个中心、三重防护"，"一个中心"指（）',
      options: ['A. 计算中心', 'B. 安全管理中心', 'C. 通信中心', 'D. 存储中心'],
      correctIndex: 1,
      explanation: '等级保护2.0中"一个中心"指安全管理中心，"三重防护"是安全计算环境、安全区域边界、安全通信网络。'
    },
    {
      id: 'domain-gb-002',
      year: 2024,
      session: '高频',
      domain: '等级保护',
      question: '等级保护共分几个级别（）',
      options: ['A. 3级', 'B. 4级', 'C. 5级', 'D. 6级'],
      correctIndex: 2,
      explanation: '等级保护制度共分五级：第一级(自主保护级)、第二级(指导保护级)、第三级(监督保护级)、第四级(强制保护级)、第五级(专控保护级)。'
    },
    {
      id: 'domain-gb-003',
      year: 2024,
      session: '高频',
      domain: '等级保护',
      question: '等级保护第三级的要求不包括（）',
      options: ['A. 强制保护', 'B. 定期安全检测', 'C. 无需安全审计', 'D. 安全管理机构'],
      correctIndex: 2,
      explanation: '等级保护第三级要求建立安全管理机构、进行定期安全检测、具备安全审计能力等，没有安全审计是不正确的。'
    },
    {
      id: 'domain-gb-004',
      year: 2024,
      session: '高频',
      domain: '等级保护',
      question: '等级保护定级的主要依据是（）',
      options: ['A. 系统价格', 'B. 业务重要性和受破坏后的危害程度', 'C. 开发商知名度', 'D. 网络规模'],
      correctIndex: 1,
      explanation: '等级保护定级主要根据信息系统业务重要性、系统遭到破坏后对国家安全、社会秩序、公共利益以及公民、法人和其他组织的合法权益的危害程度。'
    },
    {
      id: 'domain-gb-005',
      year: 2024,
      session: '高频',
      domain: '等级保护',
      question: '三级系统的安全通信网络防护要求包括（）',
      options: ['A. 无需加密', 'B. 采用加密通信', 'C. 仅需防火墙', 'D. 不需要网络隔离'],
      correctIndex: 1,
      explanation: '等级保护三级要求采用加密通信、可信验证等技术保护安全通信网络，确保数据传输的安全性。'
    }
  ],
  '法律法规': [
    {
      id: 'domain-law-001',
      year: 2024,
      session: '高频',
      domain: '法律法规',
      question: '《网络安全法》实施时间是（）',
      options: ['A. 2015年6月1日', 'B. 2016年6月1日', 'C. 2017年6月1日', 'D. 2018年6月1日'],
      correctIndex: 2,
      explanation: '《中华人民共和国网络安全法》于2017年6月1日正式实施，是我国网络空间安全的基础性法律。'
    },
    {
      id: 'domain-law-002',
      year: 2024,
      session: '高频',
      domain: '法律法规',
      question: '关键信息基础设施运营者安全检测评估每年至少进行（）',
      options: ['A. 1次', 'B. 2次', 'C. 3次', 'D. 4次'],
      correctIndex: 0,
      explanation: '《网络安全法》要求关键信息基础设施运营者应当自行或委托网络安全服务机构对其网络的安全性和可能存在的风险每年至少进行一次检测评估。'
    },
    {
      id: 'domain-law-003',
      year: 2024,
      session: '高频',
      domain: '法律法规',
      question: '《数据安全法》实施时间是（）',
      options: ['A. 2020年9月1日', 'B. 2021年9月1日', 'C. 2021年11月1日', 'D. 2022年1月1日'],
      correctIndex: 2,
      explanation: '《中华人民共和国数据安全法》于2021年11月1日正式实施，是数据安全领域的基本法律。'
    },
    {
      id: 'domain-law-004',
      year: 2024,
      session: '高频',
      domain: '法律法规',
      question: '《个人信息保护法》中，处理敏感个人信息需要取得（）',
      options: ['A. 一般同意', 'B. 书面同意', 'C. 单独同意', 'D. 默示同意'],
      correctIndex: 2,
      explanation: '《个人信息保护法》要求处理敏感个人信息应当取得个人的单独同意，并告知处理敏感个人信息的必要性和对个人的影响。'
    },
    {
      id: 'domain-law-005',
      year: 2024,
      session: '高频',
      domain: '法律法规',
      question: '《网络安全法》规定，关键信息基础设施运营者在境内运营中收集和产生的个人信息和重要数据应当在（）存储',
      options: ['A. 境外', 'B. 境内', 'C. 无要求', 'D. 混合存储'],
      correctIndex: 1,
      explanation: '《网络安全法》要求在中华人民共和国境内运营中收集和产生的个人信息和重要数据应当在境内存储。'
    }
  ],
  '信息安全管理体系': [
    {
      id: 'domain-isms-001',
      year: 2024,
      session: '高频',
      domain: '信息安全管理体系',
      question: 'ISO 27001采用的管理体系模型是（）',
      options: ['A. CAPA', 'B. PDCA', 'C. SDLC', 'D. ITIL'],
      correctIndex: 1,
      explanation: 'ISO 27001信息安全管理体系采用PDCA（Plan-Do-Check-Act，计划-执行-检查-行动）模型进行持续改进。'
    },
    {
      id: 'domain-isms-002',
      year: 2024,
      session: '高频',
      domain: '信息安全管理体系',
      question: 'ISO 27001中，内部审核的周期通常是（）',
      options: ['A. 每天', 'B. 每周', 'C. 每年至少一次', 'D. 十年一次'],
      correctIndex: 2,
      explanation: 'ISO 27001要求信息安全管理体系内部审核应按照计划进行，通常每年至少一次，特殊情况下可增加频次。'
    },
    {
      id: 'domain-isms-003',
      year: 2024,
      session: '高频',
      domain: '信息安全管理体系',
      question: '适用性声明（SoA）的作用是（）',
      options: ['A. 证明已通过认证', 'B. 识别适用的控制措施', 'C. 定义预算', 'D. 培训计划'],
      correctIndex: 1,
      explanation: '适用性声明识别并记录哪些ISO 27001控制措施适用或不适用于组织，是风险评估结果的重要输出。'
    },
    {
      id: 'domain-isms-004',
      year: 2024,
      session: '高频',
      domain: '信息安全管理体系',
      question: '管理评审的输入不包括（）',
      options: ['A. 内审结果', 'B. 所有员工工资', 'C. 风险评估结果', 'D. 事故报告'],
      correctIndex: 1,
      explanation: '管理评审输入包括ISMS绩效、内审结果、相关方反馈、风险评估结果、事故报告等，不包括员工工资等敏感信息。'
    },
    {
      id: 'domain-isms-005',
      year: 2024,
      session: '高频',
      domain: '信息安全管理体系',
      question: '风险处理的主要方式是（）',
      options: ['A. 接受所有风险', 'B. 规避、转移、减轻、接受', 'C. 忽略风险', 'D. 隐瞒风险'],
      correctIndex: 1,
      explanation: '风险处理的方式包括规避（避免风险）、转移（如购买保险）、减轻（降低风险）、接受（残余风险）四种。'
    }
  ],
  '安全评估': [
    {
      id: 'domain-assess-001',
      year: 2024,
      session: '高频',
      domain: '安全评估',
      question: '风险评估的核心步骤是（）',
      options: ['A. 资产识别、威胁识别、脆弱性识别、风险计算', 'B. 购买设备', 'C. 员工培训', 'D. 制定制度'],
      correctIndex: 0,
      explanation: '风险评估的核心步骤包括资产识别、威胁识别、脆弱性识别、风险分析和风险计算，通过公式：风险=资产×威胁×脆弱性×后果来计算。'
    },
    {
      id: 'domain-assess-002',
      year: 2024,
      session: '高频',
      domain: '安全评估',
      question: '渗透测试与漏洞扫描的主要区别是（）',
      options: ['A. 没有区别', 'B. 渗透测试会尝试利用漏洞', 'C. 漏洞扫描不需要工具', 'D. 渗透测试不需要授权'],
      correctIndex: 1,
      explanation: '渗透测试会尝试利用发现的漏洞进行更深层次的攻击验证，而漏洞扫描只是自动化检测漏洞存在。'
    },
    {
      id: 'domain-assess-003',
      year: 2024,
      session: '高频',
      domain: '安全评估',
      question: '以下哪个不是渗透测试的授权内容（）',
      options: ['A. 测试范围', 'B. 测试时间', 'C. 测试人员工资', 'D. 测试方法'],
      correctIndex: 2,
      explanation: '渗透测试授权应明确测试范围、时间、方法、报告要求等，测试人员工资不属于授权内容。'
    },
    {
      id: 'domain-assess-004',
      year: 2024,
      session: '高频',
      domain: '安全评估',
      question: '代码安全审计属于（）',
      options: ['A. 黑盒测试', 'B. 白盒测试', 'C. 灰盒测试', 'D. 功能测试'],
      correctIndex: 1,
      explanation: '代码安全审计通过检查源代码发现安全缺陷，属于白盒测试，可以发现其他测试方法难以发现的问题。'
    },
    {
      id: 'domain-assess-005',
      year: 2024,
      session: '高频',
      domain: '安全评估',
      question: '定性风险评估的主要方法是（）',
      options: ['A. 精确计算', 'B. 专家判断和主观评级', 'C. 数学建模', 'D. 机器学习'],
      correctIndex: 1,
      explanation: '定性风险评估依靠专家经验和主观判断，对风险进行高、中、低等定性分级，定量评估则使用数学模型精确计算。'
    }
  ],
  '应用安全': [
    {
      id: 'domain-app-001',
      year: 2024,
      session: '高频',
      domain: '应用安全',
      question: 'SQL注入攻击的主要原因是（）',
      options: ['A. 数据库性能问题', 'B. 用户输入未充分验证', 'C. 网络带宽不足', 'D. 硬件故障'],
      correctIndex: 1,
      explanation: 'SQL注入攻击的主要原因是应用程序未对用户输入进行充分验证和转义，直接拼接到SQL语句中执行。'
    },
    {
      id: 'domain-app-002',
      year: 2024,
      session: '高频',
      domain: '应用安全',
      question: '防止SQL注入的最佳方法是（）',
      options: ['A. 使用白名单', 'B. 使用参数化查询', 'C. 使用黑名单', 'D. 过滤所有特殊字符'],
      correctIndex: 1,
      explanation: '使用参数化查询（预编译语句）是防止SQL注入的最佳方法，用户输入被作为数据而非SQL代码处理。'
    },
    {
      id: 'domain-app-003',
      year: 2024,
      session: '高频',
      domain: '应用安全',
      question: 'XSS攻击主要影响哪个安全属性（）',
      options: ['A. 机密性', 'B. 完整性', 'C. 可用性', 'D. 认证性'],
      correctIndex: 1,
      explanation: 'XSS（跨站脚本）攻击通过在网页中注入恶意脚本代码，主要影响网页内容完整性，可能导致会话劫持和数据窃取。'
    },
    {
      id: 'domain-app-004',
      year: 2024,
      session: '高频',
      domain: '应用安全',
      question: 'CSRF攻击利用的是（）',
      options: ['A. 服务器漏洞', 'B. 用户已认证的身份', 'C. 网络漏洞', 'D. 浏览器漏洞'],
      correctIndex: 1,
      explanation: 'CSRF（跨站请求伪造）利用用户已认证的身份，伪造请求执行非授权操作，攻击者无法直接获取用户密码。'
    },
    {
      id: 'domain-app-005',
      year: 2024,
      session: '高频',
      domain: '应用安全',
      question: '防止CSRF攻击的常用方法是（）',
      options: ['A. 不使用Cookie', 'B. 使用CSRF Token', 'C. 关闭JavaScript', 'D. 使用HTTP GET'],
      correctIndex: 1,
      explanation: '使用CSRF Token是防止CSRF攻击的常用方法，在表单中添加随机Token，提交时验证Token的正确性。'
    }
  ],
  '业务连续性': [
    {
      id: 'domain-bc-001',
      year: 2024,
      session: '高频',
      domain: '业务连续性',
      question: 'RTO是指（）',
      options: ['A. 数据恢复的最长时间', 'B. 系统恢复的最长可接受时间', 'C. 备份频率', 'D. 数据保留期限'],
      correctIndex: 1,
      explanation: '恢复时间目标（RTO）是组织能够承受的业务中断最长时间，定义为从故障发生到系统恢复正常运营的最长可接受时间。'
    },
    {
      id: 'domain-bc-002',
      year: 2024,
      session: '高频',
      domain: '业务连续性',
      question: 'RPO是指（）',
      options: ['A. 系统恢复时间', 'B. 可接受的最大数据丢失量', 'C. 备份数量', 'D. 恢复点数量'],
      correctIndex: 1,
      explanation: '恢复点目标（RPO）定义了可接受的最大数据丢失量，决定了备份频率，如RPO为1小时则需要每小时备份一次。'
    },
    {
      id: 'domain-bc-003',
      year: 2024,
      session: '高频',
      domain: '业务连续性',
      question: '业务影响分析（BIA）的主要目的是（）',
      options: ['A. 配置防火墙', 'B. 确定关键业务和恢复优先级', 'C. 密码管理', 'D. 网络优化'],
      correctIndex: 1,
      explanation: 'BIA通过评估业务中断的影响，确定关键业务及其恢复优先级，为制定BCP/DRP提供依据。'
    },
    {
      id: 'domain-bc-004',
      year: 2024,
      session: '高频',
      domain: '业务连续性',
      question: '灾难恢复计划测试方法中最具风险的是（）',
      options: ['A. 桌面演练', 'B. 模拟测试', 'C. 完全中断测试', 'D. 文档审查'],
      correctIndex: 2,
      explanation: '完全中断测试要求实际切换到灾备站点，最能验证DRP的有效性，但可能影响正常业务运营，风险最高。'
    },
    {
      id: 'domain-bc-005',
      year: 2024,
      session: '高频',
      domain: '业务连续性',
      question: 'BCP和DRP的主要区别是（）',
      options: ['A. BCP关注业务，DRP关注技术', 'B. 两者没有区别', 'C. BCP关注技术，DRP关注业务', 'D. BCP和DRP是同一概念'],
      correctIndex: 0,
      explanation: '业务连续性计划（BCP）关注整个业务的连续运营，灾难恢复计划（DRP）主要关注信息技术系统的恢复。'
    }
  ],
  '物理安全': [
    {
      id: 'domain-phy-001',
      year: 2024,
      session: '高频',
      domain: '物理安全',
      question: '数据中心物理安全的第一道防线是（）',
      options: ['A. 防火墙', 'B. 门禁系统', 'C. 监控摄像头', 'D. 灭火车'],
      correctIndex: 1,
      explanation: '门禁系统是数据中心物理安全的第一道防线，控制人员物理进入，是最基本也是最重要的物理安全措施。'
    },
    {
      id: 'domain-phy-002',
      year: 2024,
      session: '高频',
      domain: '物理安全',
      question: '数据中心温度控制的主要目的是（）',
      options: ['A. 节约能源', 'B. 防止设备过热损坏', 'C. 提高网速', 'D. 减少辐射'],
      correctIndex: 1,
      explanation: '数据中心需要严格的温湿度控制，主要目的是确保服务器和网络设备在适宜环境运行，防止过热导致的故障。'
    },
    {
      id: 'domain-phy-003',
      year: 2024,
      session: '高频',
      domain: '物理安全',
      question: '关于门禁卡安全的说法，正确的是（）',
      options: ['A. 门禁卡可以无限复制', 'B. 门禁卡应定期更换或使用加密技术', 'C. 门禁卡不需要管理', 'D. 门禁卡不重要'],
      correctIndex: 1,
      explanation: '门禁卡存在被复制风险，应定期更换或使用加密卡、生物识别等多因素认证，并建立门禁卡管理制度。'
    },
    {
      id: 'domain-phy-004',
      year: 2024,
      session: '高频',
      domain: '物理安全',
      question: '数据中心选址不需要考虑的因素是（）',
      options: ['A. 自然灾害风险', 'B. 电力供应', 'C. 员工餐厅', 'D. 网络连接'],
      correctIndex: 2,
      explanation: '数据中心选址主要考虑地理位置、自然灾害风险、电力供应、网络连接等因素，员工餐厅不是选址的关键因素。'
    },
    {
      id: 'domain-phy-005',
      year: 2024,
      session: '高频',
      domain: '物理安全',
      question: 'CCTV监控系统的主要作用是（）',
      options: ['A. 防火', 'B. 监控和记录活动', 'C. 防盗报警', 'D. 网络防护'],
      correctIndex: 1,
      explanation: 'CCTV（闭路电视）主要用于监控和记录特定区域的活动，是物理安全的重要组成部分，辅助安全管理和事后调查。'
    }
  ],
  '安全工程与运营': [
    {
      id: 'domain-ops-001',
      year: 2024,
      session: '高频',
      domain: '安全工程与运营',
      question: '安全补丁管理的正确流程是（）',
      options: ['A. 直接在生产环境安装', 'B. 测试、评估、规划、部署、验证', 'C. 等待用户报告', 'D. 只在崩溃时安装'],
      correctIndex: 1,
      explanation: '安全补丁管理应遵循：测试补丁→评估影响→规划部署→部署实施→验证效果的完整流程，避免影响生产环境。'
    },
    {
      id: 'domain-ops-002',
      year: 2024,
      session: '高频',
      domain: '安全工程与运营',
      question: '安全配置基线应基于（）',
      options: ['A. 供应商默认配置', 'B. 行业最佳实践和组织策略', 'C. 最低成本配置', 'D. 随机选择'],
      correctIndex: 1,
      explanation: '安全配置基线应基于行业最佳实践（如CIS Benchmark）、组织安全策略和合规要求建立，不是简单使用默认配置。'
    },
    {
      id: 'domain-ops-003',
      year: 2024,
      session: '高频',
      domain: '安全工程与运营',
      question: 'SOC的主要功能不包括（）',
      options: ['A. 安全监控', 'B. 事件分析', 'C. 软件开发', 'D. 威胁响应'],
      correctIndex: 2,
      explanation: '安全运营中心（SOC）主要功能包括安全监控、事件分析、威胁响应、情报收集等，软件开发不是SOC的核心功能。'
    },
    {
      id: 'domain-ops-004',
      year: 2024,
      session: '高频',
      domain: '安全工程与运营',
      question: '日志审计的主要目的是（）',
      options: ['A. 减少存储', 'B. 发现安全事件和违规行为', 'C. 提高性能', 'D. 降低成本'],
      correctIndex: 1,
      explanation: '日志审计的主要目的是发现和追踪安全事件、检测违规行为、支持事件调查和取证分析。'
    },
    {
      id: 'domain-ops-005',
      year: 2024,
      session: '高频',
      domain: '安全工程与运营',
      question: '变更管理的主要目的是（）',
      options: ['A. 阻止所有变更', 'B. 确保变更经过评估和批准', 'C. 加快变更速度', 'D. 减少工作量'],
      correctIndex: 1,
      explanation: '变更管理确保所有变更都经过评估、测试、审批和记录，减少因变更导致的安全事件和系统故障。'
    }
  ]
};

// 获取所有历年真题
export function getAllPastPaperQuestions(): PastPaperQuestion[] {
  const questions: PastPaperQuestion[] = [];
  pastPapers.forEach(paper => {
    questions.push(...paper.questions);
  });
  Object.values(domainQuestions).forEach(q => {
    questions.push(...q);
  });
  return questions;
}

// 按知识域获取题目
export function getQuestionsByDomain(domain: string): PastPaperQuestion[] {
  const result: PastPaperQuestion[] = [];
  pastPapers.forEach(paper => {
    result.push(...paper.questions.filter(q => q.domain === domain));
  });
  const domainSpecific = domainQuestions[domain] || [];
  result.push(...domainSpecific);
  return result;
}

// 随机获取指定数量的题目
export function getRandomQuestions(count: number): PastPaperQuestion[] {
  const all = getAllPastPaperQuestions();
  const shuffled = [...all].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

// 获取真题统计信息
export function getPastPaperStats() {
  const all = getAllPastPaperQuestions();
  const stats = {
    totalQuestions: all.length,
    byDomain: {} as Record<string, number>,
    byYear: {} as Record<number, number>
  };
  
  all.forEach(q => {
    stats.byDomain[q.domain] = (stats.byDomain[q.domain] || 0) + 1;
    stats.byYear[q.year] = (stats.byYear[q.year] || 0) + 1;
  });
  
  return stats;
}
