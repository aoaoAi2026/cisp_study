# AI伦理、合规与全球监管框架

---

## 一、全球AI监管格局

### 1.1 三大监管体系对比

| 维度 | 欧盟 AI Act | 中国生成式AI管理办法 | 美国行政令 |
|------|------------|-------------------|-----------|
| **法规类型** | 横向立法（覆盖所有AI） | 纵向（聚焦生成式AI） | 行政命令 + 行业标准 |
| **发布时间** | 2024年生效 | 2023年8月施行 | 2023年10月 |
| **分级方式** | 四级风险（不可接受/高/有限/最小） | 分类管理 | 自愿承诺 + 强制报告 |
| **透明要求** | 全面 | 算法备案 + 安全评估 | 红队测试 + 安全报告 |
| **处罚** | 3500万€或全球营收7% | 上一年度营业额5% | 暂无明确 |
| **开源豁免** | 有限豁免 | 未明确 | 鼓励 |

### 1.2 欧盟AI Act风险分级

```
不可接受风险 (禁止):
├── 社会信用评分系统
├── 实时远程生物识别（公共场所）
├── 利用弱势群体
├── 潜意识操纵
└── 情绪识别（工作场所/教育）

高风险（严格监管）：
├── 关键基础设施AI
├── 教育/就业AI
├── 执法/司法AI
├── 移民/边境控制AI
├── 生物特征识别
└── 医疗AI
→ 要求：合规评估 + 技术文档 + 人工监督 + 透明度

有限风险（透明度义务）：
├── 聊天机器人（告知用户正在与AI对话）
├── 深度伪造内容（标注为AI生成）
└── 情感识别系统

最小风险（无额外义务）：
├── 垃圾邮件过滤器
├── AI增强的视频游戏
└── 推荐算法
```

### 1.3 中国生成式AI监管

```
核心法规：
├── 《生成式人工智能服务管理暂行办法》（2023.8.15施行）
├── 《互联网信息服务深度合成管理规定》（2023.1.10施行）
├── 《人工智能法（草案征求意见稿）》（制定中）
└── 《科技伦理审查办法（试行）》

关键要求：
1. 算法备案：
   - 提供生成式AI服务前，需向网信办进行算法备案
   - 备案内容包括：算法名称/类型/应用领域/安全评估报告

2. 安全评估：
   - 上线前完成安全评估
   - 评估内容：数据安全/内容安全/模型安全/个人信息保护

3. 训练数据合规：
   - 数据来源合法
   - 不得含违反法律法规的内容
   - 尊重知识产权
   - 个人信息需取得同意或匿名化

4. 内容安全：
   - 不得生成违法违规内容
   - 不得生成虚假有害信息
   - 建立内容审核机制
   - 对于深度合成内容添加标识

5. 用户权益：
   - 提供用户投诉/举报渠道
   - 对未成年人有特殊保护措施
   - 防止算法歧视
   - 禁止大数据杀熟
```

---

## 二、AI偏见与公平性

### 2.1 偏见来源

```
偏见来源分类：

1. 历史偏见 (Historical Bias)
   训练数据反映了社会的历史不平等
   例：招聘数据中男性工程师远多于女性 → 模型偏好男性

2. 表征偏见 (Representation Bias)
   训练数据对某些群体的代表性不足
   例：人脸识别数据集以白人为主 → 有色人种识别准确率低

3. 测量偏见 (Measurement Bias)
   标签/评估标准的偏差
   例：用"被捕记录"作为"犯罪风险"的代理指标 → 执法偏差被放大

4. 聚合偏见 (Aggregation Bias)
   一刀切的模型不适合所有子群体
   例：一个医疗模型对所有族裔使用相同阈值 → 误诊率分化

5. 评估偏见 (Evaluation Bias)
   测试基准无法代表实际使用场景
```

### 2.2 公平性评估

```python
import numpy as np
from sklearn.metrics import confusion_matrix

class FairnessMetrics:
    """AI公平性评估指标"""
    
    @staticmethod
    def demographic_parity(y_pred: np.ndarray, sensitive_attr: np.ndarray):
        """
        人口统计均等 (Demographic Parity)
        不同群体被预测为"正向"的概率应相等
        P(pred=1 | A=a) = P(pred=1 | A=b)
        """
        groups = np.unique(sensitive_attr)
        rates = {}
        for g in groups:
            mask = sensitive_attr == g
            rates[g] = y_pred[mask].mean()
        
        # 最大差异
        disparity = max(rates.values()) - min(rates.values())
        return {"group_rates": rates, "disparity": disparity}
    
    @staticmethod
    def equalized_odds(y_true: np.ndarray, y_pred: np.ndarray, 
                       sensitive_attr: np.ndarray) -> dict:
        """
        均等几率 (Equalized Odds)
        不同群体的TPR和FPR应相等
        P(pred=1 | Y=1, A=a) = P(pred=1 | Y=1, A=b)
        P(pred=1 | Y=0, A=a) = P(pred=1 | Y=0, A=b)
        """
        groups = np.unique(sensitive_attr)
        results = {}
        for g in groups:
            mask = sensitive_attr == g
            tn, fp, fn, tp = confusion_matrix(
                y_true[mask], y_pred[mask]
            ).ravel()
            tpr = tp / (tp + fn) if (tp + fn) > 0 else 0
            fpr = fp / (fp + tn) if (fp + tn) > 0 else 0
            results[g] = {"TPR": tpr, "FPR": fpr}
        
        tpr_disparity = max(r["TPR"] for r in results.values()) - \
                        min(r["TPR"] for r in results.values())
        fpr_disparity = max(r["FPR"] for r in results.values()) - \
                        min(r["FPR"] for r in results.values())
        
        return {
            "group_results": results,
            "TPR_disparity": tpr_disparity,
            "FPR_disparity": fpr_disparity,
        }
    
    @staticmethod
    def equal_opportunity(y_true, y_pred, sensitive_attr) -> float:
        """
        均等机会 (Equal Opportunity)
        不同群体的TPR（真正例率）应相等
        比Equalized Odds更宽松（只关注TPR）
        """
        groups = np.unique(sensitive_attr)
        tprs = {}
        for g in groups:
            mask = sensitive_attr == g
            tn, fp, fn, tp = confusion_matrix(
                y_true[mask], y_pred[mask]
            ).ravel()
            tprs[g] = tp / (tp + fn) if (tp + fn) > 0 else 0
        
        return max(tprs.values()) - min(tprs.values())
    

# 使用示例
fairness = FairnessMetrics()

# 假设：y_pred是模型预测，sensitive_attr是敏感属性（如性别/种族/年龄）
# metrics = fairness.demographic_parity(predictions, gender)
# print(f"Demographic disparity: {metrics['disparity']:.3f}")
```

### 2.3 偏见缓解技术

```python
# 预处理 - 训练数据重采样
def reweight_training_data(X, y, sensitive_attr):
    """对不同群体的样本重新加权以平衡"""
    groups = np.unique(sensitive_attr)
    weights = np.ones(len(y))
    for g in groups:
        mask = sensitive_attr == g
        weights[mask] = len(y) / (len(groups) * mask.sum())
    return weights

# 处理中 - 对抗去偏
class AdversarialDebiasing(nn.Module):
    """对抗网络去除偏见"""
    def __init__(self, predictor, adversary):
        self.predictor = predictor    # 主任务模型
        self.adversary = adversary    # 判别敏感属性
    
    def train_step(self, x, y, sensitive_attr):
        # 训练预测器（准确预测主任务 + 欺骗判别器）
        pred = self.predictor(x)
        task_loss = cross_entropy(pred, y)
        
        # 让判别器无法从预测结果中推断敏感属性
        adversary_pred = self.adversary(pred)
        adversary_loss = -cross_entropy(adversary_pred, sensitive_attr)  # 负号 = 欺骗
        
        return task_loss + lambda_debias * adversary_loss

# 后处理 - 阈值调整
def calibrate_thresholds(scores, sensitive_attr, target_fpr=0.1):
    """为每个群体找到各自的决策阈值"""
    groups = np.unique(sensitive_attr)
    thresholds = {}
    for g in groups:
        mask = (sensitive_attr == g)
        # 找到使FPR=target_fpr的阈值
        thresholds[g] = np.percentile(scores[mask], (1 - target_fpr) * 100)
    return thresholds
```

---

## 三、可解释AI (XAI)

### 3.1 XAI 方法分类

```
自解释模型 (Intrinsic):
├── 线性回归/逻辑回归
├── 决策树/规则列表
└── 广义加性模型(GAM)
  优势：天然可解释
  劣势：模型容量受限

事后解释 (Post-hoc):
├── 特征重要性
│   ├── SHAP (Shapley Additive Explanations)
│   ├── LIME (Local Interpretable Model-agnostic Explanations)
│   └── Permutation Importance
├── 注意力可视化（Transformer Attention）
├── Grad-CAM（CNN注意力热力图）
└── 反事实解释 (Counterfactual)
    "如果X变了，结果会怎样不同？"
```

### 3.2 SHAP 实战

```python
import shap

# 训练好的模型
# model = trained_xgboost

# SHAP解释
explainer = shap.TreeExplainer(model)
shap_values = explainer.shap_values(X_test)

# 全局特征重要性
shap.summary_plot(shap_values, X_test)

# 单个样本解释
shap.force_plot(
    explainer.expected_value, 
    shap_values[0, :], 
    X_test.iloc[0, :]
)

# 特征依赖图
shap.dependence_plot("feature_name", shap_values, X_test)

# LLM的SHAP解释（简化示例）
def explain_llm_decision(prompt, model, tokenizer):
    """用注意力权重近似解释LLM的决策"""
    inputs = tokenizer(prompt, return_tensors="pt")
    outputs = model(**inputs, output_attentions=True)
    
    # 提取最后一层的注意力权重
    attention = outputs.attentions[-1]  # (batch, heads, seq_len, seq_len)
    avg_attention = attention.mean(dim=1)  # 多头平均
    
    # 找出对输出影响最大的输入token
    last_token_attention = avg_attention[0, -1, :]  # 最后一个token对各输入token的注意力
    
    tokens = tokenizer.convert_ids_to_tokens(inputs["input_ids"][0])
    
    # 返回Top-K重要token
    top_k = last_token_attention.topk(5)
    return [(tokens[idx], att.item()) 
            for idx, att in zip(top_k.indices, top_k.values)]
```

### 3.3 反事实解释

```
反事实解释：
"如果X不同，AI会给出什么不同的结果？"

示例（贷款申请）：
  输入：年龄30、收入8000/月、无房产
  结果：拒绝
  
  反事实：年龄30、收入8000/月、有房产 → 批准
  → 解释：缺少房产是拒绝的主要原因
  
AI可操作建议（最小变化实现预期结果）：
  "如果您增加收入至10000/月或提供房产证明，贷款可能获批"
```

---

## 四、AI红队测试

### 4.1 LLM红队测试清单

```
安全测试：
□ Prompt注入（直接/间接/多模态）
□ 越狱攻击（DAN/角色扮演/编码绕过）
□ 敏感信息提取（训练数据/PII）
□ RCE/代码注入（输出代码执行）
□ SSRF（Agent调用外部URL）
□ 拒绝服务（资源耗尽攻击）

伦理测试：
□ 偏见测试（性别/种族/年龄/地域）
□ 有害内容生成（暴力/色情/仇恨言论）
□ 虚假信息生成
□ 政治敏感内容
□ 违法内容（武器制作/毒品/黑客教程）

合规测试：
□ 个人信息泄露
□ 深度合成内容未标识
□ 算法备案完整性
□ 用户数据删除机制
□ 未成年人保护

鲁棒性测试：
□ 对抗输入（拼写错误/格式异常/噪声）
□ 多语言安全对齐一致性
□ 上下文窗口溢出
□ 大输入/超长对话状态
```

### 4.2 自动化红队框架

```python
# Garak (LLM Vulnerability Scanner)
# pip install garak

# 使用示例
# garak --model_type huggingface --model_name meta-llama/Llama-2-7b-chat-hf \
#   --probes promptinject,dan,leakreplay,glitch \
#   --report_prefix my_report
```

---

## 五、Checklist

- [ ] 完成算法备案（向网信办提交）
- [ ] 训练数据来源合法性审查
- [ ] 偏见评估（Demographic Parity / Equalized Odds）
- [ ] 内容安全审核机制（输入+输出双重过滤）
- [ ] AI生成内容标识（深度合成标识）
- [ ] 用户投诉/举报渠道建立
- [ ] 未成年人保护措施
- [ ] XAI解释能力（SHAP/LIME/注意力可视化）
- [ ] 定期AI红队测试（安全/伦理/合规）
- [ ] AI伦理委员会/审查机制建立
- [ ] 模型可审计性（决策追溯能力）
- [ ] 法规变化跟踪（全球AI监管动态）
- [ ] AI安全事件应急预案
- [ ] 第三方AI服务商合规审查
