# 数据脱敏与匿名化技术实战

---

## 一、概念辨析

```
脱敏（Data Masking/Desensitization）:
  通过对敏感数据进行变形，使其在非生产环境中保持业务可用性的同时，保护隐私。
  → 可逆或不可逆，保留原始数据格式特征

匿名化（Anonymization）:
  使个人信息经过处理后无法识别特定自然人且不能复原的过程（《个保法》第七十三条）。
  → 不可逆，处理后不再属于个人信息

假名化（Pseudonymization）:
  将标识符替换为假名或代号，可通过额外信息还原。
  → 可逆，仍是个人信息处理的一种安全措施
```

---

## 二、脱敏技术分类

### 2.1 按时机分类

| 类型 | 说明 | 适用场景 |
|------|------|----------|
| **静态脱敏 (SDM)** | 对源数据进行脱敏后存入目标库 | 测试/开发/培训环境、数据外发 |
| **动态脱敏 (DDM)** | 查询时实时脱敏，不修改源数据 | 生产运维/BI查询/外包查询 |

### 2.2 按算法分类

#### 替换类算法

```
1. 固定值替换
   原始: 张三 13800138000
   脱敏: 用户A 00000000000
   用途: 快速测试环境

2. 查表映射
   原始: 张三 → ID_1001 → 脱敏后: 测试用户_A
   原始: 李四 → ID_1002 → 脱敏后: 测试用户_B
   用途: 保持数据关联性

3. 随机替换（字典）
   原始: 张三 → 字典随机抽取 → 李明
   原始: 北京市 → 字典随机抽取 → 上海市
   用途: 保持格式语义
```

#### 遮盖类算法

```python
# 字符遮盖/截断
def mask_phone(phone: str) -> str:
    """手机号脱敏: 138****8000"""
    return phone[:3] + "****" + phone[-4:]

def mask_idcard(idcard: str) -> str:
    """身份证脱敏: 320***********1234"""
    return idcard[:3] + "***********" + idcard[-4:]

def mask_name(name: str) -> str:
    """姓名脱敏: 张* 或 张**"""
    return name[0] + "*" * (len(name) - 1)

def mask_email(email: str) -> str:
    """邮箱脱敏: ab***@example.com"""
    local, domain = email.split("@")
    return local[:2] + "***@" + domain
```

#### 偏移/取整类算法

```sql
-- 日期偏移（±随机天数，保持时间序列特征）
SELECT 
    DATE_ADD(birth_date, INTERVAL FLOOR(RAND()*365-182) DAY) AS masked_date
FROM users;

-- 数值取整（工资取整到千位）
SELECT 
    ROUND(salary / 1000) * 1000 AS masked_salary
FROM payroll;

-- 数值范围化
SELECT 
    CASE 
        WHEN age < 18 THEN '0-18'
        WHEN age BETWEEN 18 AND 30 THEN '18-30'
        WHEN age BETWEEN 31 AND 50 THEN '31-50'
        ELSE '50+'
    END AS age_group
FROM users;
```

#### 加密类算法

```python
from Crypto.Cipher import AES
import hashlib

# 确定性加密（相同输入→相同输出，保留关联查询能力）
def deterministic_encrypt(data: str, key: bytes) -> str:
    """AES确定性加密，保留唯一性"""
    iv = hashlib.sha256(data.encode()).digest()[:16]
    cipher = AES.new(key, AES.MODE_CBC, iv)
    padded = data + (16 - len(data) % 16) * chr(16 - len(data) % 16)
    return cipher.encrypt(padded.encode()).hex()

# 保格式加密 (Format-Preserving Encryption, FPE)
# 加密后仍保持原始数据格式（如手机号加密后仍是11位数字）
# 常用算法：FF1/FF3（NIST SP 800-38G）
# 开源实现：Mysto/FFX-Python
```

#### 令牌化 (Tokenization)

```
原始: 6222021234567890（银行卡号）
  ↓ 发送到令牌库 (Token Vault)
令牌: TOK-2024-A1B2C3D4
  ↓ 使用时反向查询
仅在令牌库持有映射关系，业务系统只存储令牌
```

---

## 三、隐私保护模型

### 3.1 K-匿名 (K-Anonymity)

```
定义：数据集中每条记录至少与K-1条其他记录在准标识符上不可区分

示例：
原始数据（K=1，不满足匿名）：
| 年龄 | 性别 | 邮编   | 疾病   |
|------|------|--------|--------|
| 25   | 男   | 100081 | 感冒   |
| 28   | 男   | 100083 | 糖尿病 |

泛化后（K=2）：
| 年龄   | 性别 | 邮编  | 疾病   |
|--------|------|-------|--------|
| 20-30  | 男   | 100** | 感冒   |
| 20-30  | 男   | 100** | 糖尿病 |

局限：不能防止同质性攻击和背景知识攻击
```

### 3.2 L-多样性 (L-Diversity)

```
定义：每个K-匿名等价类中敏感属性至少有L个不同的值

示例（K=3, L=2）：
| 年龄   | 性别 | 疾病    |
|--------|------|---------|
| 20-30  | 男   | 感冒    |
| 20-30  | 男   | 高血压  | ← 敏感属性至少有2个不同值
| 20-30  | 男   | 骨折    |
```

### 3.3 差分隐私 (Differential Privacy)

```
核心思想：
在查询结果中加入精心校准的随机噪声，使得攻击者无法通过多次查询结果推断单条记录

数学定义：
算法M满足(ε, δ)-差分隐私，如果对任意相邻数据集D和D'及其任意输出子集S：
  Pr[M(D) ∈ S] ≤ e^ε × Pr[M(D') ∈ S] + δ

ε（隐私预算）：越小隐私保护越强，但数据可用性越低
  ε=0.1: 强隐私保护
  ε=1.0: 中等隐私保护
  ε=10: 弱隐私保护

噪声机制：
- 拉普拉斯机制（Laplace）：用于数值型查询
- 指数机制（Exponential）：用于非数值型查询
- 高斯机制（Gaussian）：用于多维数据
```

```python
import numpy as np

def laplace_mechanism(true_value: float, sensitivity: float, epsilon: float) -> float:
    """拉普拉斯差分隐私机制"""
    scale = sensitivity / epsilon
    noise = np.random.laplace(0, scale)
    return true_value + noise

# 示例：查询员工平均工资
true_avg_salary = 15000
sensitivity = 20000 / 1000  # 最大薪资差 / 记录数
epsilon = 0.5
dp_avg_salary = laplace_mechanism(true_avg_salary, sensitivity, epsilon)
print(f"真实值: {true_avg_salary}, DP结果: {dp_avg_salary}")
```

---

## 四、脱敏工具与平台对比

| 工具/平台 | 类型 | 特点 |
|-----------|------|------|
| **Delphix** | 商业 | 数据虚拟化+自动脱敏、快照数据管理 |
| **Informatica TDM** | 商业 | 企业级测试数据管理+脱敏 |
| **Solix CDP** | 商业 | 数据掩码+子集化+归档 |
| **阿里DataWorks** | 商业(云) | 集成数据脱敏+分类分级 |
| **腾讯云数据安全** | 商业(云) | DLP+脱敏+加密一体化 |
| **ShardingSphere MASK** | 开源 | 数据库中间件内置脱敏算法 |
| **DataMasker** | 开源 | Python脱敏框架 |
| **Anonypy** | 开源 | Python匿名化库(K-匿名/L-多样性) |

---

## 五、脱敏方案设计

### 5.1 数据导出脱敏流程

```
源生产库 → [数据抽取] → 脱敏引擎 → [脱敏后数据] → 目标环境
              ↓            ↓              ↓
          全量/增量     规则引擎      测试库/开发库/分析平台
                       ├ 正则匹配
                       ├ 字段类型
                       ├ 血缘标签
                       └ 自定义脚本
```

### 5.2 SQL代理动态脱敏

```sql
-- 基于视图的动态脱敏
CREATE VIEW v_customer_masked AS
SELECT 
    id,
    CONCAT(LEFT(name, 1), '**') AS name,
    CONCAT(LEFT(phone, 3), '****', RIGHT(phone, 4)) AS phone,
    CONCAT(LEFT(email, 2), '***@', SUBSTRING_INDEX(email, '@', -1)) AS email
FROM customer;

-- 基于策略的动态脱敏（ShardingSphere Proxy示例）
-- mask_phone:
--    phone字段 → 3位+****+4位
-- mask_email:
--    email字段 → 前2位+***+域名
```

### 5.3 脱敏验证

```python
def verify_masking(original: str, masked: str, rule: str) -> bool:
    """验证脱敏结果"""
    if rule == "phone":
        # 手机号：长度不变，中间4位被遮盖
        if len(masked) != len(original): return False
        if original[:3] != masked[:3]: return False
        if original[-4:] != masked[-4:]: return False
        return "*" in masked
    
    if rule == "idcard":
        # 身份证号：长度不变，中间位遮盖
        return len(masked) == len(original) and "*" in masked
    
    if rule == "name":
        # 姓名：首字保留，其余遮盖
        return masked[0] == original[0] and len(masked) == len(original)
    
    if rule == "irreversible":
        # 不可逆：禁止从脱敏数据推导原始数据
        # 通过统计测试（分布差异、关联差异等）
        pass
    
    return True
```

---

## 六、实施 Checklist

- [ ] 梳理数据资产中的敏感字段清单
- [ ] 确定各字段的脱敏策略（不可逆/可逆/遮盖/替换/加密）
- [ ] 评估脱敏对业务的影响（测试环境/分析场景/数据外发）
- [ ] 选择脱敏工具/平台（静态/动态）
- [ ] 制定脱敏规则（字段级+正则级）
- [ ] 实施脱敏脚本/配置
- [ ] 脱敏结果验证（自动+人工抽查）
- [ ] 建立脱敏审批流程
- [ ] 定级定策关联（数据分级→脱敏策略）
- [ ] 定期审计脱敏效果
