const allDays: any[] = [];
const weekToolMap: Record<number, any> = {};
const dayExpertNotes: Record<number, any> = {};
allDays.push({
allDays.push({
  id:'day-35',day:35,week:5,title:'数字签名与 PKI 体系：从签名原理到信任模型（加密技术）',
  objectives:['数字签名原理','签名流程与验证','PKI 体系架构'],
  content:'# 数字签名与 PKI 体系：从签名原理到信任模型\n## 一、数字签名原理\n```\n数字签名 = 用私钥加密消息的哈希\n为什么这样设计？\n1. 先哈希再签名（不是直接签名消息）\n   ├── 签名算法（RSA/ECDSA）很慢\n   ├── 消息可能很大（GB级文件）\n   └── → 先哈希 → 得到固定长度的摘要 → 签名摘要\n2. 签名 = 用签名者的私钥加密哈希值\n   Sign(M) = Encrypt(Hash(M), PrivateKey)\n   验证 = 用签名者的公钥解密签名 → 得到哈希\n         = 重新计算 Hash(M)\n         → 两个哈希是否相同？\n```\n### 数字签名的三个属性\n```\n数字签名提供的安全属性：\n1. 完整性 (Integrity)\n   签名的文档被篡改 → 哈希改变 → 验证失败\n2. 认证性 (Authentication)\n   签名用私钥生成 → 只有私钥持有者能产生有效签名\n   验证通过 = 确认签名者的身份\n3. 不可否认性 (Non-repudiation)\n   签名者不能否认自己签过名\n   → 因为签名需要签名者的私钥（只有他有）\n   → 法律证据\n数字签名 vs 纸质签名：\n├── 纸质签名：签名每次都相同 → 容易被模仿\n└── 数字签名：签名 = 对消息哈希的私钥加密\n    → 不同消息的签名不同！无法从一个签名伪造另一个\n```\n---\n## 二、签名流程与验证\n```\n数字签名的完整流程：\n签名方 (Alice)：                     验证方 (Bob)：\n文档 M                               \n  │                                  \n  ▼                                  \nHash(M) → 256位摘要                  \n  │                                  \n  ▼                                  \n用 Alice私钥 加密摘要                 \n  │                                  \n  ▼                                  \n数字签名 S                          收到 M + S\n  │                                    │\n  ├─────────────────────────────→     │\n  │ M + S                             │\n  │                                    ▼\n  │                              验证过程：\n  │                              1. 用 Alice公钥 解密 S → 得到 摘要1\n  │                              2. 计算 Hash(M) → 得到 摘要2\n  │                              3. 比对 摘要1 == 摘要2？\n  │                                 │          │\n  │                               相同≠       不同≠\n  │                                 │          │\n  │                               ✅通过       ❌拒绝\n  │                              (完整性OK)  (被篡改/假签名)\n```\n---\n## 三、PKI 体系架构\n### PKI 组成部分\n```\nPKI (Public Key Infrastructure) =\n一个由策略、程序、硬件、软件和人员组成的体系，\n用于创建、管理、分发、使用、存储和撤销数字证书。\nPKI 的五个核心组件：\n1. CA (Certificate Authority) 证书认证中心\n   ├── 签发证书\n   ├── 撤销证书 (CRL/OCSP)\n   └── 信任的起点 (Root CA)\n2. RA (Registration Authority) 注册机构\n   ├── 验证证书申请者的身份\n   └── 不签发证书，只做身份核实\n3. 证书库 (Certificate Repository)\n   ├── 存储已签发的证书\n   └── LDAP/HTTP 公开可查\n4. 证书撤销 (CRL/OCSP)',
  codeExample:{language:'python',code:`print("=== 数字签名与PKI ===\n")
print("数字签名=用私钥加密消息的哈希值")
print("签名流程: Hash(M) → 私钥加密 → 签名值\n")
print("签名提供三个属性:")
print("  1. 完整性: 篡改后验证失败")
print("  2. 认证性: 只有私钥持有者能签")
print("  3. 不可否认性: 签名者不能抵赖\n")
print("PKI信任模型:")
print("  CA签发 → 证书链验证 → 信任锚")
print("  CRL(吊销列表) + OCSP(在线查询)")
print("  证书=X.509=公钥+身份+CA签名\n")
print("RSA PKCS#1v2.2 ≥ 2048位")
print("ECDSA: 256位密钥=128位安全强度")`,description:'数字签名原理与PKI体系'},  quiz:[{"id":"q35-1","question":"CVSS评分中7.0-8.9属于什么级别？","options":["低危", "中危", "高危", "严重"],"correctIndex":2,"explanation":"7.0-8.9=高危。"},{"id":"q35-2","question":"SQL注入中基于SLEEP函数的叫？","options":["联合查询", "时间盲注", "布尔盲注", "报错注入"],"correctIndex":1,"explanation":"通过SLEEP函数观察响应时间。"},{"id":"q35-3","question":"XSS中CSP主要用于？","options":["加速加载", "限制可执行的脚本来源", "优化SEO", "压缩代码"],"correctIndex":1,"explanation":"CSP指定哪些来源的脚本可以执行。"},{"id":"q35-4","question":"以下哪个不是Web安全漏洞？","options":["SQL注入", "XSS", "CSRF", "ARP欺骗"],"correctIndex":3,"explanation":"ARP欺骗是网络层攻击。"},{"id":"q35-5","question":"漏洞管理中CVSS Score的最大作用是？","options":["唯一标识漏洞", "评定漏洞严重程度", "描述漏洞详情", "提供修复补丁"],"correctIndex":1,"explanation":"CVSS用于评定漏洞严重性(0-10)。"}],
  recommendedTools:weekToolMap[6]?.tools||[],labEnvironments:weekToolMap[6]?.labs||[],expertNotes:dayExpertNotes[35]||[],
});
export const learningData = allDays;