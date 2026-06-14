#!/usr/bin/env python3
"""生成 cyberAi.ts 第1部分：import + week1 + week2"""
import json, os

OUT = r'E:\internal_safe\cisp1\cisp\src\data\cyberAi.ts'

def esc(s):
    return json.dumps(s, ensure_ascii=False)

def day_obj(d):
    lines = [f"  {{ id: {esc(d['id'])}, day: {d['day']}, title: {esc(d['title'])}, subtitle: {esc(d['subtitle'])},",
             f"    objectives: {json.dumps(d['objectives'], ensure_ascii=False)},",
             f"    content: {esc(d['content'])},",
             f"    keyPoints: {json.dumps(d['keyPoints'], ensure_ascii=False)},",
             f"    quiz: {json.dumps(d['quiz'], ensure_ascii=False)},",
             f"    codeExamples: {json.dumps(d['codeExamples'], ensure_ascii=False)},",
             f"    resources: {json.dumps(d['resources'], ensure_ascii=False)},",
             f"    recommendedTools: {json.dumps(d['recommendedTools'], ensure_ascii=False)},",
             f"    labEnvironment: {json.dumps(d['labEnvironment'], ensure_ascii=False)},",
             f"    expertNotes: {json.dumps(d['expertNotes'], ensure_ascii=False)} }}"]
    return '\n'.join(lines)

# ========= HELPERS =========
def quiz5(qs): return qs  # [q1,q2,q3,q4,q5]
def code1(t,l,c,e): return [{"title":t,"language":l,"code":c,"explanation":e}]
def res3(*rs): return [{"name":r[0],"url":r[1],"type":r[2]} for r in rs]
def tool3(*ts): return [{"name":t[0],"description":t[1],"url":t[2],"type":t[3]} for t in ts]
def lab1(n,d,u,t,s,eo): return [{"name":n,"description":d,"url":u,"type":t,"setup":s,"expectedOutput":eo}]
def note3(*ns): return [{"author":n[0],"title":n[1],"content":n[2]} for n in ns]
def n3w(n): return [{"author":n[i],"title":n[i+1],"content":n[i+2]} for i in range(0,len(n),3)]

# ============ DAY DATA ============

days = []

# Week 1: AI安全基础
week1 = [
    # Day 1
    dict(id='ai-1',day=1,title='AI安全概述与学习路线',subtitle='AI Security Overview',
         objectives=['理解AI安全定义','了解AI在安全中的应用','明确学习路线'],
         content='AI安全是人工智能与网络安全的交叉领域，涵盖AI赋能安全和AI自身安全两个维度。\n\n'
                 'AI赋能安全：用ML/DL技术检测入侵、识别恶意软件、分析威胁情报、自动化响应。\n\n'
                 'AI自身安全：对抗样本攻击、模型窃取、数据投毒、LLM Prompt注入、训练数据隐私泄露。\n\n'
                 '典型应用：IDS智能检测、恶意软件家族分类、异常行为分析(UEBA)、威胁情报自动化、安全Copilot。\n\n'
                 '30天路线：第1周-AI安全基础 → 第2周-经典ML安全 → 第3周-深度学习安全 → 第4周-对抗攻防与LLM安全 → 第5周-AI安全工程实战。',
         keyPoints=['AI安全=AI+安全交叉领域','AI赋能安全：用AI检测威胁','AI自身安全：对抗攻击/数据投毒','30天系统学习','每天4小时'],
         quiz=quiz5([
            {"question":"AI安全包含哪两个维度？","options":["A. AI赋能安全和AI自身安全","B. 网络安全和系统安全","C. 前端和后端","D. 硬件和软件"],"correctIndex":0,"explanation":"AI安全包含：用AI提升安全能力(AI for Security)，以及AI系统本身的安全问题(Security of AI)。"},
            {"question":"以下哪项属于AI自身安全问题？","options":["A. ML检测DDoS","B. 对抗样本欺骗分类器","C. NLP分析日志","D. 自动化渗透"],"correctIndex":1,"explanation":"对抗样本攻击AI模型，属于AI自身安全。其余是AI赋能安全。"},
            {"question":"UEBA代表什么？","options":["A. 统一加密备份","B. 用户实体行为分析","C. 超强加密算法","D. 统一端点保护"],"correctIndex":1,"explanation":"UEBA通过ML分析用户和设备行为，检测异常和内部威胁。"},
            {"question":"以下哪个不是AI安全的典型应用？","options":["A. 智能入侵检测","B. 恶意软件分类","C. 操作系统内核开发","D. 威胁情报自动化"],"correctIndex":2,"explanation":"操作系统内核开发不属于AI安全应用场景。"},
            {"question":"本计划适合哪类人群？","options":["A. 完全零基础","B. 有Python+网络基础的安全从业者","C. 初中生","D. 只懂硬件的工程师"],"correctIndex":1,"explanation":"需要Python编程和网络协议基础作为前置知识。"}]),
         codeExamples=code1('AI安全工具链','python',
            '# AI安全核心库\nimport sklearn  # 经典ML\nimport torch   # 深度学习\nimport pandas as pd  # 数据处理\n\nai_sec = {\n  "入侵检测": ["sklearn","PyTorch","LightGBM"],\n  "恶意软件": ["EMBER","LIEF","Malimg"],\n  "异常检测": ["IsolationForest","AutoEncoder"],\n  "对抗攻防": ["CleverHans","ART","Foolbox"],\n  "LLM安全": ["Garak","LangChain","PromptGuard"]\n}\nprint("=== AI安全工具链 ===")\nfor k,v in ai_sec.items():\n  print(f"{k}: {chr(124).join(v)}")',
            'AI安全领域核心Python库概览'),
         resources=res3(('MITRE ATLAS','https://atlas.mitre.org/','article'),('OWASP AI项目','https://owasp.org/www-project-ai-security/','article'),('AI安全全景图','https://www.freebuf.com/articles/es/356789.html','article')),
         recommendedTools=tool3(('JupyterLab','交互式数据科学','https://jupyter.org/','local'),('Anaconda','Python数据科学发行版','https://www.anaconda.com/','local'),('PyTorch','深度学习框架','https://pytorch.org/','local')),
         labEnvironment=lab1('AI安全环境','配置Python+PyTorch+数据集','https://www.kaggle.com/','local','1.安装Anaconda\n2.conda create -n aisec python=3.10\n3.pip install torch sklearn pandas matplotlib jupyter\n4.下载CIC-IDS2017\n5.验证环境','成功搭建AI安全实验环境'),
         expertNotes=n3w(['李智能','AI安全学习建议','AI安全最容易犯的错误是直接啃论文。建议从实战入手：先跑通IDS检测、恶意软件分类，理解数据流和模型流程，再回头看理论，事半功倍。',
                          '王算法','安全+ML的思维转变','安全人员转型AI安全最大挑战是思维转变。安全思维"找漏洞"，ML思维"找模式"。先接受ML的不确定性，理解误报/漏报的权衡。',
                          '张模型','PyTorch还是TF','安全领域推荐PyTorch：1)学术界主流 2)动态图调试友好 3)对抗攻击库原生支持。安全研究选PyTorch。'])),
    # Day 2
    dict(id='ai-2',day=2,title='Python数据科学生态',subtitle='Python Data Science',
         objectives=['掌握NumPy数组操作','理解Pandas核心API','学习数据处理pipeline'],
         content='NumPy和Pandas是AI安全数据处理的基石。\n\nNumPy核心：ndarray创建与操作、广播机制（不同形状运算）、向量化运算（避免Python循环）。\n\nPandas核心：DataFrame、数据筛选(loc/iloc)、分组聚合(groupby/agg)、透视表(pivot_table)。\n\n安全数据处理：chunksize分批读取大日志、fillna/dropna处理缺失值、to_datetime处理时间序列。\n\n向量化是关键：用内置函数替代for循环，处理百万级日志性能差异可达100倍。',
         keyPoints=['NumPy提供高性能数组运算','Pandas是安全数据处理核心','groupby用于日志聚合','向量化替代循环提升百倍性能','chunksize处理大数据集'],
         quiz=quiz5([
            {"question":"处理10GB以上安全日志的正确方式？","options":["A. pd.read_csv()","B. pd.read_csv(chunksize=100000)","C. 用Excel","D. 直接打印"],"correctIndex":1,"explanation":"chunksize分批读取，每次只加载指定行数到内存，避免OOM。"},
            {"question":"以下哪项是向量化运算？","options":["A. for循环","B. NumPy数组的data*2","C. list comprehension","D. while循环"],"correctIndex":1,"explanation":"NumPy向量化运算底层用C实现，速度远超Python循环。"},
            {"question":"Pandas中loc和iloc的区别？","options":["A. 完全相同","B. loc用标签,iloc用位置","C. loc更快","D. iloc只能用数字"],"correctIndex":1,"explanation":"loc基于label选取，iloc基于integer position选取。"},
            {"question":"NumPy广播的作用？","options":["A. 网络通信","B. 不同形状数组的算术运算","C. 加密","D. 文件传输"],"correctIndex":1,"explanation":"广播允许不同形状数组进行运算，自动扩展维度匹配。"},
            {"question":"处理安全日志缺失值的正确方式？","options":["A. 直接删除","B. 分析原因后选择填充或删除","C. 全部填0","D. 忽略"],"correctIndex":1,"explanation":"需分析缺失原因(设备未上报/采集失败)再决定策略。"}]),
         codeExamples=code1('安全日志Pandas分析','python',
            'import pandas as pd\nimport numpy as np\n\nnp.random.seed(42)\ndf = pd.DataFrame({\n  "timestamp": pd.date_range("2024-01-01", periods=1000, freq="1min"),\n  "src_ip": [f"192.168.{np.random.randint(1,255)}.{np.random.randint(1,255)}" for _ in range(1000)],\n  "dst_port": np.random.choice([22,80,443,3306],1000),\n  "protocol": np.random.choice(["TCP","UDP","ICMP"],1000,p=[0.7,0.2,0.1]),\n  "bytes": np.random.exponential(1000,1000).astype(int)\n})\nprint(f"Records: {len(df)}")\nprint(f"Protocols:\\n{df.protocol.value_counts()}")\nprint(f"Port Stats:\\n{df.groupby(\"dst_port\")[\"bytes\"].agg([\"sum\",\"mean\",\"count\"])}")',
            'Pandas安全日志：协议分布、端口流量统计'),
         resources=res3(('Pandas文档','https://pandas.pydata.org/docs/','article'),('NumPy快速入门','https://numpy.org/doc/stable/user/quickstart.html','article'),('Python数据科学手册','https://jakevdp.github.io/PythonDataScienceHandbook/','article')),
         recommendedTools=tool3(('Pandas','数据处理核心','https://pandas.pydata.org/','local'),('NumPy','科学计算基础','https://numpy.org/','local'),('Matplotlib','数据可视化','https://matplotlib.org/','local')),
         labEnvironment=lab1('Python数据处理','Pandas安全日志分析','https://www.kaggle.com/','local','1.安装pandas,numpy,matplotlib\n2.准备CIC-IDS CSV\n3.按协议聚合\n4.计算统计特征\n5.输出报告','掌握Pandas安全日志分析'),
         expertNotes=n3w(['李智能','Pandas性能优化','处理安全大数据技巧：1)category类型存协议(省70%内存) 2)eval/query加速过滤 3)避免链式索引(用loc) 4)能用agg就别循环。',
                          '王算法','窗口思维','做安全特征工程要养成"窗口思维"：按时间窗口聚合→提取统计量→构造比率特征。这些特征比原始数据更适合ML。',
                          '张模型','安全数据集格式','CIC-IDS等数据集用CSV格式。处理要点：1)列名可能有空格 2)标签列通常叫Label 3)时间戳需parse_dates 4)转Parquet更高效。'])),
    # Day 3
    dict(id='ai-3',day=3,title='安全数据可视化',subtitle='Data Visualization',
         objectives=['掌握matplotlib核心API','理解seaborn统计图表','学习Plotly交互图表'],
         content='数据可视化是安全分析发现问题的关键手段。\n\nmatplotlib：折线图(plot)、柱状图(bar)、散点图(scatter)、饼图(pie)、子图布局(subplots)。\n\nseaborn：分布图(histplot)、箱线图(boxplot)、热力图(heatmap)、小提琴图(violinplot)。\n\n安全场景：流量时序图发现DDoS、协议饼图看流量构成、热力图发现特征相关、箱线图标注异常值。\n\nPlotly：交互式图表支持缩放/悬停/筛选，适合安全仪表盘。',
         keyPoints=['matplotlib是绘图基础','seaborn更适合统计图表','Plotly支持交互分析','热力图发现相关关系','箱线图直观展示异常值'],
         quiz=quiz5([
            {"question":"检测DDoS最适合什么图？","options":["A. 饼图","B. 流量时序折线图","C. 散点图","D. 词云"],"correctIndex":1,"explanation":"DDoS导致流量突增，时序折线图直观展示异常峰值。"},
            {"question":"seaborn热力图的安全分析用途？","options":["A. 显示攻击时间","B. 特征间相关性","C. 网络拓扑","D. 显示日志"],"correctIndex":1,"explanation":"热力图用颜色深浅展示特征间相关系数，发现与攻击标签相关的特征。"},
            {"question":"箱线图在异常检测中的优势？","options":["A. 显示所有数据点","B. 直观展示四分位数和离群点","C. 只能画一个变量","D. 不适合大数据"],"correctIndex":1,"explanation":"箱线图展示中位数、四分位数和离群点，是异常检测的直观工具。"},
            {"question":"使用对数坐标的主因？","options":["A. 好看","B. 处理流量长尾分布","C. 省存储","D. 加速渲染"],"correctIndex":1,"explanation":"网络流量呈长尾分布，对数坐标让不同量级数据都可辨识。"},
            {"question":"分析协议分布最适合什么图？","options":["A. 饼图","B. 散点图","C. 箱线图","D. 热力图"],"correctIndex":0,"explanation":"饼图适合展示组成部分的比例关系，直观展示协议占比。"}]),
         codeExamples=code1('安全流量可视化','python',
            'import matplotlib.pyplot as plt\nimport seaborn as sns\nimport pandas as pd\nimport numpy as np\n\nnp.random.seed(0)\nn = 500\ndf = pd.DataFrame({\n  "bytes": np.concatenate([np.random.exponential(500,450), np.random.exponential(5000,50)]),\n  "label": ["Normal"]*450+["Attack"]*50,\n  "protocol": np.random.choice(["TCP","UDP"], n)\n})\nfig,axes=plt.subplots(2,2,figsize=(12,10))\nsns.histplot(data=df,x="bytes",hue="label",bins=50,ax=axes[0,0]); axes[0,0].set_title("Flow Size Distribution")\nsns.boxplot(data=df,x="label",y="bytes",ax=axes[0,1]); axes[0,1].set_title("Bytes by Label")\npc=df["protocol"].value_counts(); axes[1,0].pie(pc,labels=pc.index,autopct="%1.1f%%")\naxes[1,0].set_title("Protocol Distribution")\nprint("Charts generated")',
            '4合1安全数据可视化：分布/箱线/饼图覆盖常见分析场景'),
         resources=res3(('matplotlib教程','https://matplotlib.org/stable/tutorials/','article'),('seaborn图库','https://seaborn.pydata.org/examples/','article'),('Plotly仪表盘','https://plotly.com/python/','article')),
         recommendedTools=tool3(('Matplotlib','Python绑图','https://matplotlib.org/','local'),('Seaborn','统计可视化','https://seaborn.pydata.org/','local'),('Plotly','交互式可视化','https://plotly.com/python/','online')),
         labEnvironment=lab1('安全可视化实验','用Python可视化CIC-IDS','https://www.kaggle.com/','local','1.加载CIC-IDS数据\n2.绘制协议饼图\n3.绘制流量时序图\n4.特征相关性热力图\n5.箱线图标注异常','生成安全数据可视化报告'),
         expertNotes=n3w(['李智能','安全可视化配色','配色建议：正常=蓝/绿(安全色)，攻击=红/橙(警示色)，未知=灰色。一致配色让分析师快速判断严重程度。',
                          '王算法','Streamlit仪表盘','Jupyter适合探索，展示推荐Streamlit。几行代码把图表变成Web仪表盘，加筛选器和时间选择器。',
                          '张模型','对数坐标时机','安全数据通常幂律分布。线性坐标数据"挤在一起"，对数坐标清晰展示全量级分布。'])),
    # Day 4
    dict(id='ai-4',day=4,title='概率统计与贝叶斯检测',subtitle='Probability & Bayesian',
         objectives=['掌握贝叶斯定理','理解概率分布','学习统计假设检验'],
         content='概率统计是AI安全的基础数学工具。\n\n贝叶斯定理：P(A|B)=P(B|A)×P(A)/P(B)，用于计算给定观测下攻击的后验概率。\n\n安全应用：给定IP请求频率计算恶意扫描概率；给定文件熵计算恶意软件概率。\n\n常见分布：正态(流量大小)、泊松(单位时间告警数)、指数(攻击间隔)、幂律(IP请求分布)。\n\n假设检验：t检验比较正常/攻击均值差异、卡方检验分析特征与标签关联、KS检验判断分布是否相同。\n\n贝叶斯优势：可融合多源证据、天然处理不确定性、结合先验知识。',
         keyPoints=['贝叶斯定理是概率推理基础','后验概率融合先验和观测','假设检验发现统计显著差异','泊松分布建模告警频率','正态分布适合流量建模'],
         quiz=quiz5([
            {"question":"贝叶斯定理中P(H|E)称为？","options":["A. 先验","B. 后验","C. 似然","D. 边缘"],"correctIndex":1,"explanation":"P(H|E)是在观测E后假设H成立的概率，即后验概率(Posterior)。"},
            {"question":"单位时间告警数量最适合什么分布？","options":["A. 正态","B. 泊松","C. 均匀","D. 多项式"],"correctIndex":1,"explanation":"泊松分布描述单位时间随机事件次数，适合建模告警频率。"},
            {"question":"KS检验在安全分析中的用途？","options":["A. 测试两个分布是否相同","B. 测试特征相关","C. 测试样本均值","D. 测试模型准确率"],"correctIndex":0,"explanation":"KS检验判断两组数据是否同分布，可用于检测流量分布偏移。"},
            {"question":"贝叶斯检测相比阈值检测的优势？","options":["A. 更简单","B. 融合多源证据和先验知识","C. 不需要数据","D. 100%准确"],"correctIndex":1,"explanation":"贝叶斯可以融合IP信誉+请求频率+时间异常等多个证据源。"},
            {"question":"μ±3σ内包含数据的比例？","options":["A. 68%","B. 95%","C. 99.7%","D. 100%"],"correctIndex":2,"explanation":"3σ原则：正态分布中约99.7%数据在均值±3倍标准差范围内。"}]),
         codeExamples=code1('贝叶斯异常IP检测','python',
            'class BayesianDetector:\n  def __init__(self,prior=0.01):\n    self.prior=prior  # 1%的IP恶意\n  def detect(self,ip,req,hr):\n    p_mal=min(req/100,0.95); p_norm=max(0.01,(100-req)/100)\n    p_t_m=0.3 if hr<6 else 0.7; p_t_n=0.05 if hr<6 else 0.95\n    lr=(p_mal*p_t_m)/(p_norm*p_t_n)\n    post=(lr*self.prior)/(lr*self.prior+(1-self.prior))\n    return post\n\nd=BayesianDetector()\nfor ip,c,hr in [("192.168.1.1",3,14),("10.0.0.99",85,3)]:\n  r=d.detect(ip,c,hr)\n  print(f"{ip}: risk={r:.2%}")',
            '贝叶斯异常检测：融合请求频率和时间异常两个证据源'),
         resources=res3(('贝叶斯入门','https://seeing-theory.brown.edu/bayesian-inference/','article'),('统计学习基础','https://www.statlearning.com/','article'),('概率可视化','https://setosa.io/conditional/','article')),
         recommendedTools=tool3(('SciPy','科学计算','https://scipy.org/','local'),('PyMC','贝叶斯建模','https://www.pymc.io/','local'),('Statsmodels','统计模型','https://www.statsmodels.org/','local')),
         labEnvironment=lab1('贝叶斯检测实验','贝叶斯方法异常IP检测','https://www.kaggle.com/','local','1.收集Web日志\n2.提取IP频率和时间特征\n3.实现贝叶斯评分\n4.设定阈值告警\n5.对比阈值法','贝叶斯vs阈值法ROC对比'),
         expertNotes=n3w(['李智能','先验概率来源','先验可从历史统计(如1%告警真实)、行业报告(Verizon DBIR)或专家经验开始，随时间修正。',
                          '王算法','概率校准','安全检测概率输出常"过于自信"。用Platt Scaling校准，让0.8真正意味着80%置信度。',
                          '张模型','统计vs ML选择','数据<1000条&特征<5个→统计方法(Z-score/IQR)；数据>万条&特征几十个→ML方法明显占优。'])),
    # Day 5
    dict(id='ai-5',day=5,title='统计异常检测实战',subtitle='Statistical Anomaly Detection',
         objectives=['掌握Z-Score检测','理解IQR异常检测','学习自适应阈值'],
         content='统计异常检测是AI安全的入门实践，不依赖标签数据。\n\nZ-Score：z=(x-μ)/σ，|z|>3判断异常(3σ原则)。\n\nIQR：x<Q1-1.5×IQR或x>Q3+1.5×IQR为异常，比Z-Score更鲁棒。\n\nMAD：median(|x-median|)，对离群值极度鲁棒。\n\n自适应阈值：EWMA，EMA=α×当前值+(1-α)×上期EMA，α越大对新变化越敏感。\n\n实战：检测端口扫描(单IP多端口)、DDoS流量突增、异常时间登录。',
         keyPoints=['Z-Score偏离均值程度','IQR基于四分位数更鲁棒','MAD对离群值极度鲁棒','EWMA自适应动态阈值','统计方法不需要标注'],
         quiz=quiz5([
            {"question":"|z|>3判断异常的理论依据？","options":["A. 正态99.7%在3σ内","B. 经验法则","C. 行业规定","D. 没有依据"],"correctIndex":0,"explanation":"正态分布中约99.7%数据在μ±3σ内，超出仅0.3%高度可疑。"},
            {"question":"IQR相比Z-Score的优势？","options":["A. 计算更简单","B. 对偏态分布和离群点更鲁棒","C. 速度更快","D. 精度更高"],"correctIndex":1,"explanation":"IQR基于中位数和四分位数，不受极端值影响。"},
            {"question":"EWMA中α的作用？","options":["A. 置信区间","B. 新数据敏感度","C. 样本大小","D. 阈值大小"],"correctIndex":1,"explanation":"α越大基线对新变化越敏感，但也越容易误报(通常0.1-0.3)。"},
            {"question":"不适用统计异常检测的场景？","options":["A. DDoS","B. 端口扫描","C. 复杂多步APT","D. 异常登录"],"correctIndex":2,"explanation":"APT没有明显统计异常特征，需要行为分析和上下文关联。"},
            {"question":"MAD修正因子1.4826的作用？","options":["A. 使MAD与正态标准差一致","B. 加速计算","C. 随机选择","D. 减少内存"],"correctIndex":0,"explanation":"正态分布下MAD×1.4826可得标准差无偏估计。"}]),
         codeExamples=code1('三种异常检测对比','python',
            'import numpy as np\n\ndef zscore_detect(data,t=3):\n  z=(data-data.mean())/data.std()\n  return np.abs(z)>t\n\ndef iqr_detect(data,k=1.5):\n  q1,q3=np.percentile(data,[25,75])\n  iqr=q3-q1\n  return (data<q1-k*iqr)|(data>q3+k*iqr)\n\nnp.random.seed(42)\nd=np.random.normal(1000,200,100)\nd[10]=3000; d[50]=3500; d[80]=2500\nfor n,f in [("Z-Score",zscore_detect),("IQR",iqr_detect)]:\n  a=np.where(f(d))[0]\n  print(f"{n}: {len(a)} anomalies -> {a.tolist()}")',
            'Z-Score和IQR两种方法直接对比'),
         resources=res3(('异常检测综述','https://pyod.readthedocs.io/','article'),('PyOD异常检测库','https://pyod.readthedocs.io/','article'),('EWMA详解','https://www.itl.nist.gov/div898/handbook/','article')),
         recommendedTools=tool3(('PyOD','异常检测工具集','https://pyod.readthedocs.io/','local'),('NumPy','统计计算','https://numpy.org/','local'),('Scikit-learn','ML异常检测','https://scikit-learn.org/','local')),
         labEnvironment=lab1('异常检测实验','实现并对比多种检测方法','https://www.kaggle.com/','local','1.加载带标签数据\n2.实现Z-Score检测\n3.实现IQR检测\n4.实现EWMA\n5.绘制ROC对比','三种方法检出率和误报率对比'),
         expertNotes=n3w(['李智能','基线期选择','必须确保基线期数据不含攻击。选业务低谷期或人工去除已知攻击时段。',
                          '王算法','阈值优化','先用标注数据画ROC→根据可接受误报率选阈值→上线后持续监控调整。',
                          '张模型','统计方法适用场景','以下场景统计方法很好：1)单维度时序 2)规则模式明显 3)数据<1000条。简单有效可解释强。'])),
    # Day 6
    dict(id='ai-6',day=6,title='安全特征工程',subtitle='Feature Engineering',
         objectives=['理解特征提取思路','掌握流量特征构建','学习文本特征处理'],
         content='特征工程是AI安全模型效果的关键，好特征比复杂模型更重要。\n\n网络流量特征：包级(大小/间隔/标志)、流级(持续时间/字节数/速率)、聚合级(时间窗口内连接数/去重IP数)。\n\n统计特征：均值/标准差/最大/去重数/熵。\n\n比率特征：SYN/总包比、失败/登录比。比率天然归一化，对异常更敏感。\n\n文本特征：TF-IDF编码Web payload、n-gram对抗SQL注入变形。\n\n特征选择：删除低方差、高相关去重、互信息选Top-K。',
         keyPoints=['特征工程比算法选择更重要','流级别特征信息量最大','比率特征对异常更敏感','TF-IDF编码Web payload','特征选择防过拟合'],
         quiz=quiz5([
            {"question":"为什么推荐比率特征？","options":["A. 计算简单","B. 天然归一化不受总量影响","C. 不需要处理","D. 减少数据量"],"correctIndex":1,"explanation":"比率特征(SYN/总包比)天然归一化到0-1，对模式变化敏感。"},
            {"question":"TF-IDF在Web安全的用途？","options":["A. 加密流量","B. HTTP payload向量化","C. 图片分析","D. 音频处理"],"correctIndex":1,"explanation":"TF-IDF将文本payload转数值向量，用于SQL注入/XSS检测。"},
            {"question":"Flow Duration是什么级别特征？","options":["A. 包级","B. 流级","C. 会话级","D. 主机级"],"correctIndex":1,"explanation":"Flow Duration是流级特征(TCP连接持续时间)。"},
            {"question":"哪个是好安全特征？","options":["A. 用户ID","B. 过去5分钟登录失败次数","C. 服务器序列号","D. 时间戳原始值"],"correctIndex":1,"explanation":"窗口统计特征(5分钟内失败次数)对暴力破解检测非常有效。"},
            {"question":"为什么要删除高相关特征(r>0.95)？","options":["A. 省存储","B. 减少多重共线性和过拟合","C. 提高可读性","D. 加速训练"],"correctIndex":1,"explanation":"高相关特征提供冗余信息，导致模型不稳定和过拟合。"}]),
         codeExamples=code1('特征工程Pipeline','python',
            'import pandas as pd\nimport numpy as np\n\nnp.random.seed(42)\nn=1000\ndf=pd.DataFrame({\n  "dur":np.random.exponential(10,n), "bytes":np.random.exponential(500,n),\n  "pkts":np.random.poisson(20,n), "syn":np.random.poisson(3,n),\n  "port":np.random.choice([22,80,443,3306],n)\n})\ndf["bytes_pkt"]=df["bytes"]/(df["pkts"]+1)\ndf["syn_ratio"]=df["syn"]/(df["pkts"]+1)\ndf["byte_rate"]=df["bytes"]/(df["dur"]+0.001)\ndf["common"]=df["port"].isin([80,443]).astype(int)\nprint("New features: bytes_pkt, syn_ratio, byte_rate, common")\nprint(f"SYN ratio>0.5: {(df.syn_ratio>0.5).sum()}")',
            '从原始流数据生成衍生特征：比率/速率/布尔特征'),
         resources=res3(('Featuretools','https://www.featuretools.com/','article'),('CICFlowMeter','https://www.unb.ca/cic/research/applications.html','article'),('tsfresh时序特征','https://tsfresh.readthedocs.io/','article')),
         recommendedTools=tool3(('Featuretools','自动化特征工程','https://www.featuretools.com/','local'),('tsfresh','时序特征提取','https://tsfresh.readthedocs.io/','local'),('Scikit-learn','特征选择','https://scikit-learn.org/','local')),
         labEnvironment=lab1('特征工程实验','从CIC-IDS构建ML特征','https://www.kaggle.com/','local','1.加载CIC-IDS CSV\n2.分析原始列含义\n3.构造比率+统计特征\n4.计算特征与标签相关性\n5.选择Top-20特征','输出最优特征集'),
         expertNotes=n3w(['李智能','时间窗口选择','窗口大小最关键。太小(1秒)噪声大；太大(1小时)延迟高。建议从5分钟开始。',
                          '王算法','基础统计特征','最有效的往往是简单统计：去重IP数、连接失败率、新连接占比。计算快、可解释。',
                          '张模型','文本vs数值特征','短文本用TF-IDF，长文本用Word2Vec/BERT。TF-IDF易产生大量稀疏特征需配降维。'])),
    # Day 7
    dict(id='ai-7',day=7,title='第一周总结：安全数据Pipeline',subtitle='Week 1 Summary',
         objectives=['复盘本周学习','构建完整Pipeline','准备ML阶段'],
         content='本周建立了AI安全学习基础，从数据处理到特征工程再到统计检测。\n\n核心技能：\n1.Python数据科学生态(NumPy/Pandas/Matplotlib)\n2.概率统计与贝叶斯方法\n3.统计异常检测(Z-Score/IQR/EWMA)\n4.安全特征工程\n\n实战项目：安全数据Pipeline\n采集→Pandas清洗→特征提取→统计检测→可视化报告\n\n下阶段：ML分类(逻辑回归/决策树/随机森林/XGBoost)+异常检测(孤立森林/OC-SVM)',
         keyPoints=['掌握Pandas安全日志分析','理解贝叶斯概率推理','实现至少3种统计异常检测','构建特征工程Pipeline','建立AI安全学习框架'],
         quiz=quiz5([
            {"question":"本周未学的方法？","options":["A. Z-Score","B. IQR","C. 孤立森林","D. EWMA"],"correctIndex":2,"explanation":"孤立森林是下周ML方法，本周重点是统计方法。"},
            {"question":"比率特征的优势？","options":["A. 更快","B. 天然归一化不受总量影响","C. 更精确","D. 省内存"],"correctIndex":1,"explanation":"比率天然归一化，不受流量总量变化影响，泛化能力强。"},
            {"question":"贝叶斯检测最大价值？","options":["A. 100%准确","B. 融合多源证据给综合风险概率","C. 不需要数据","D. 简单"],"correctIndex":1,"explanation":"核心价值是融合多个弱证据源给出统一后验概率。"},
            {"question":"安全特征工程最关键参数？","options":["A. 特征名称","B. 时间窗口大小","C. 特征数量","D. 内存"],"correctIndex":1,"explanation":"时间窗口决定特征的时效性和稳定性。"},
            {"question":"统计检测最适合？","options":["A. 多维复杂异常","B. 单维时序/数据量小","C. 图像异常","D. 文本异常"],"correctIndex":1,"explanation":"统计方法最适合单维/少数维度且数据量小的场景，简单高效。"}]),
         codeExamples=code1('安全数据Pipeline','python',
            'import pandas as pd\nimport numpy as np\n\nclass SecurityPipeline:\n  def __init__(self): self.df=None; self.stats={}\n  def load(self,path): self.df=pd.read_csv(path); return self\n  def clean(self):\n    self.df=self.df.dropna(axis=1,how="all").fillna(0).drop_duplicates(); return self\n  def engineer(self):\n    if "Flow Duration" in self.df.columns:\n      self.df["byte_rate"]=self.df.get("Flow Bytes/s",0)/(self.df["Flow Duration"]+0.001)\n    return self\n  def detect(self,col):\n    d=self.df[col].values; z=(d-d.mean())/d.std(); n=(np.abs(z)>3).sum()\n    self.stats[col]=n; return self\n  def report(self): [print(f"{k}: {v} anomalies") for k,v in self.stats.items()]',
            '端到端安全数据Pipeline：加载→清洗→特征→检测→报告'),
         resources=res3(('sklearn Pipeline','https://scikit-learn.org/stable/modules/compose.html','article'),('安全数据科学','https://www.freebuf.com/articles/es/345672.html','article'),('MITRE ATT&CK','https://attack.mitre.org/datasources/','article')),
         recommendedTools=tool3(('JupyterLab','交互分析','https://jupyter.org/','local'),('Streamlit','快速仪表盘','https://streamlit.io/','local'),('Scikit-learn','ML工具集','https://scikit-learn.org/','local')),
         labEnvironment=lab1('Pipeline集成实验','端到端安全数据处理','https://www.kaggle.com/','local','1.整合本周代码\n2.构建统一Pipeline\n3.加载CIC-IDS测试\n4.输出统计检测报告\n5.整理至GitHub','安全数据Pipeline就绪'),
         expertNotes=n3w(['李智能','本周收获','最重要的是建立"数据思维"。安全分析从海量数据中发现模式。Python+Pandas+可视化是核心工具。',
                          '王算法','下阶段准备','进入ML前确认：1)Python+Pandas熟练 2)理解概率统计基础。不熟练多花时间巩固。',
                          '张模型','统计到ML过渡','统计判断"是不是异常"，ML判断"属于哪类攻击"。下周让模型自动学习模式，不再靠人工阈值。'])),
]

days.extend(week1)

# Week 2
week2 = [
    # Day 8
    dict(id='ai-8',day=8,title='机器学习概述与数据准备',subtitle='ML Overview & Data Prep',
         objectives=['理解监督/无监督学习','掌握sklearn Pipeline','学习数据划分'],
         content='机器学习是AI安全的核心技术。\n\n学习范式：监督学习(有标签分类/回归)、无监督学习(无标签聚类/异常检测)、半监督学习(少量标签+大量无标签)。\n\nsklearn Pipeline：统一预处理和模型训练接口，确保训练预测使用相同预处理。\n\n数据划分：训练集60-70%、验证集15-20%、测试集15-20%。安全数据需按时间顺序划分。\n\n类别不平衡：攻击样本远少于正常(1:100到1:10000)，需要特殊处理策略。',
         keyPoints=['监督学习需标注数据','无监督发现未知模式','sklearn Pipeline统一预处理','时间序列按时间划分','类别不平衡是常态'],
         quiz=quiz5([
            {"question":"安全数据划分最重要原则？","options":["A. 随机","B. 按时间顺序","C. 按IP","D. 按大小"],"correctIndex":1,"explanation":"时间序列数据，用未来训练预测过去产生数据泄漏。"},
            {"question":"sklearn Pipeline优势？","options":["A. 快","B. 保证训练预测相同预处理","C. 自动选模型","D. 免费"],"correctIndex":1,"explanation":"Pipeline封装预处理和训练，确保数据经过完全相同的转换。"},
            {"question":"发现未知攻击最适合？","options":["A. 监督学习","B. 无监督学习","C. 回归","D. 强化学习"],"correctIndex":1,"explanation":"无监督不需标签，可发现数据中未知的异常模式。"},
            {"question":"不平衡典型比例？","options":["A. 50:50","B. 99:1(正常:攻击)","C. 60:40","D. 30:70"],"correctIndex":1,"explanation":"现实中绝大多数流量正常，攻击仅0.1%-1%。"},
            {"question":"半监督学习优势？","options":["A. 不需数据","B. 少量标注+大量无标注","C. 100%准确","D. 最快"],"correctIndex":1,"explanation":"安全标注成本极高，半监督用少量标签引导+大量无标签数据很实用。"}]),
         codeExamples=code1('ML数据准备Pipeline','python',
            'import numpy as np\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.pipeline import Pipeline\nfrom sklearn.ensemble import RandomForestClassifier\n\nnp.random.seed(42)\nX=np.random.randn(5000,6); y=(np.random.random(5000)<0.05).astype(int)\nX_tr,X_te,y_tr,y_te=train_test_split(X,y,test_size=0.2,stratify=y)\npipeline=Pipeline([("scaler",StandardScaler()),("clf",RandomForestClassifier(n_estimators=100))])\npipeline.fit(X_tr,y_tr)\nprint(f"Baseline: {pipeline.score(X_te,y_te):.2%}")',
            'sklearn Pipeline从划分到训练的完整流程'),
         resources=res3(('sklearn教程','https://scikit-learn.org/stable/tutorial/','article'),('ML实战书','https://github.com/ageron/handson-ml3','book'),('吴恩达ML课程','https://www.coursera.org/learn/machine-learning','video')),
         recommendedTools=tool3(('Scikit-learn','经典ML库','https://scikit-learn.org/','local'),('imbalanced-learn','不平衡处理','https://imbalanced-learn.org/','local'),('Pandas','数据处理','https://pandas.pydata.org/','local')),
         labEnvironment=lab1('ML环境搭建','sklearn+imblearn环境','https://scikit-learn.org/','local','1.pip install scikit-learn imbalanced-learn\n2.在CIC-IDS建立Pipeline\n3.按时间划分\n4.训练RF基线\n5.评估不平衡表现','完成ML环境，跑通第一个分类器'),
         expertNotes=n3w(['李智能','数据泄漏陷阱','常见泄漏：1)非独立样本随机划分 2)先标准化再划分 3)用未来特征预测。测试集训练时完全不可见。',
                          '王算法','别只看准确率','不平衡数据上99%准确率可能毫无意义！安全ML必须看Recall、Precision、F1、ROC-AUC、误报率。',
                          '张模型','先跑基线','永远先跑简单基线(逻辑回归)。如果简单模型已很好，复杂模型就过度工程化了。'])),
    # Day 9
    dict(id='ai-9',day=9,title='逻辑回归与SVM分类',subtitle='Logistic Regression & SVM',
         objectives=['理解逻辑回归','掌握SVM核技巧','学习评估指标'],
         content='逻辑回归和SVM是经典实用的分类算法。\n\n逻辑回归：Sigmoid函数将输出映射到(0,1)，可解释为攻击概率。优点：快、可解释、直接输出概率。\n\nSVM：寻找最大化分类间隔的超平面。RBF核映射到高维空间。适合高维安全特征。\n\n评估指标：Accuracy/Precision/Recall/F1/ROC-AUC。安全场景Recall(检出率)通常比Precision更重要。\n\n场景选择：LR适合实时检测(快+概率)，SVM适合离线批处理(精度高)。',
         keyPoints=['逻辑回归输出可解释概率','SVM核函数处理非线性','Recall优先于Precision','RBF核最常用','ROC-AUC评估区分能力'],
         quiz=quiz5([
            {"question":"Sigmoid函数的作用？","options":["A. 加速","B. 将实数映射到(0,1)概率","C. 省内存","D. 选特征"],"correctIndex":1,"explanation":"Sigmoid σ(z)=1/(1+e^{-z})将线性输出压缩到0-1。"},
            {"question":"IDS中为什么Recall更重要？","options":["A. 漏掉攻击比多误报更严重","B. 计算简单","C. 没有原因","D. 省资源"],"correctIndex":0,"explanation":"漏掉真实攻击(低Recall)的后果比多误报(低Precision)严重得多。"},
            {"question":"F1=0.9意味着？","options":["A. 准确率90%","B. P和R都高且平衡","C. 90%特征用了","D. 训练90%"],"correctIndex":1,"explanation":"F1是P和R的调和平均，0.9说明两者都在高水平且平衡。"},
            {"question":"LR相比SVM的关键优势？","options":["A. 更准","B. 直接输出风险评分","C. 参数少","D. 自动特征选择"],"correctIndex":1,"explanation":"逻辑回归直接输出0-1概率，天然适合做风险评分。"},
            {"question":"SVM gamma增大会？","options":["A. 边界更平滑","B. 边界更复杂/过拟合","C. 训练更快","D. 一定更准"],"correctIndex":1,"explanation":"gamma越大单个样本影响范围越小，决策边界更复杂容易过拟合。"}]),
         codeExamples=code1('LR vs SVM 安全对比','python',
            'import numpy as np\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.svm import SVC\nfrom sklearn.metrics import roc_auc_score\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.preprocessing import StandardScaler\n\nnp.random.seed(42)\nX=np.random.randn(2000,10)\nX[:,0]+=(np.random.random(2000)<0.1)*3\nX[:,1]+=(np.random.random(2000)<0.1)*2\ny=(np.abs(X[:,0]+X[:,1])>2).astype(int)\nX_tr,X_te,y_tr,y_te=train_test_split(X,y,test_size=0.3)\ns=StandardScaler(); X_tr_s=s.fit_transform(X_tr); X_te_s=s.transform(X_te)\nfor n,m in [("LR",LogisticRegression(max_iter=1000)),("SVM",SVC(probability=True))]:\n  m.fit(X_tr_s,y_tr)\n  auc=roc_auc_score(y_te,m.predict_proba(X_te_s)[:,1])\n  print(f"{n}: AUC={auc:.3f}")',
            '逻辑回归和SVM在安全分类任务上的完整对比'),
         resources=res3(('SVM可视化','https://scikit-learn.org/stable/auto_examples/svm/','article'),('评估指标大全','https://scikit-learn.org/stable/modules/model_evaluation.html','article'),('安全ML评估','https://www.freebuf.com/articles/es/301234.html','article')),
         recommendedTools=tool3(('Scikit-learn','LR/SVM实现','https://scikit-learn.org/','local'),('Yellowbrick','ML可视化','https://www.scikit-yb.org/','local'),('Optuna','超参优化','https://optuna.org/','local')),
         labEnvironment=lab1('分类模型实战','LR/SVM在IDS上对比','https://www.kaggle.com/','local','1.加载CIC-IDS子集\n2.实现LR/SVM/RBF-SVM\n3.计算P/R/F1/AUC\n4.绘制ROC对比\n5.分析误报漏报','三种分类器详细对比报告'),
         expertNotes=n3w(['李智能','阈值移动','安全检测需调整阈值：低漏报→降阈值(0.3)；低误报→升阈值(0.7)。根据业务需求选择。',
                          '王算法','SVM定位','SVM在小样本高维场景表现优异适合恶意软件检测。大数据量时训练时间急剧增长，用GBDT。',
                          '张模型','准确率欺骗性','99.5%正常时永远预测"正常"就有99.5%准确率！所以必须看Recall和F1。'])),
    # Day 10
    dict(id='ai-10',day=10,title='决策树与随机森林',subtitle='Decision Tree & Random Forest',
         objectives=['理解决策树原理','掌握RF Bagging','学习特征重要性'],
         content='树模型是安全领域应用最广的ML算法。\n\n决策树：递归分裂特征空间。分裂标准：信息增益(ID3)或基尼系数(CART)。优点：完全可解释。缺点：容易过拟合。\n\n随机森林：Bagging(自助采样)+随机特征选择构建多棵树投票。OOB可用作免费验证集。\n\n特征重要性：随机森林天然输出每个特征对分类的贡献度。\n\n超参数：n_estimators(100-500)、max_depth(5-15防过拟合)。',
         keyPoints=['决策树完全可解释','信息增益/基尼系数是标准','RF Bagging减少方差','OOB=免费验证集','特征重要性帮助理解'],
         quiz=quiz5([
            {"question":"Bagging的作用？","options":["A. 加速","B. 降方差提高泛化","C. 省内存","D. 自动特征选择"],"correctIndex":1,"explanation":"Bagging通过训练多个不同模型投票，降低方差提高泛化能力。"},
            {"question":"OOB样本的作用？","options":["A. 测试集","B. 免费无偏验证集","C. 训练数据","D. 特征选择"],"correctIndex":1,"explanation":"每棵树只用约63%数据，剩37%OOB可用作免费验证。"},
            {"question":"max_depth=5的作用？","options":["A. 加速","B. 防止过拟合","C. 增加复杂度","D. 减少特征"],"correctIndex":1,"explanation":"限制深度是剪枝方式，防树长太深记住噪声(过拟合)。"},
            {"question":"源端口特征重要性第一说明？","options":["A. 模型有问题","B. 攻击用了特定端口","C. 特征失误","D. 数据错误"],"correctIndex":1,"explanation":"某些攻击偏好特定端口，特征重要性验证模型学到了合理模式。"},
            {"question":"n_estimators=1时RF会？","options":["A. 退化为单棵决策树","B. 更快更好","C. 自动最优","D. 报错"],"correctIndex":0,"explanation":"只有一棵树，失去集成学习方差降低优势。"}]),
         codeExamples=code1('RF入侵检测','python',
            'import numpy as np, pandas as pd\nfrom sklearn.ensemble import RandomForestClassifier\nfrom sklearn.model_selection import train_test_split\n\nnp.random.seed(42); n=5000\nX=pd.DataFrame({"dur":np.random.exponential(10,n),"bytes":np.random.exponential(500,n),"pkts":np.random.poisson(20,n),"syn":np.random.binomial(1,0.3,n),"port":np.random.choice([22,80,443,8080],n)})\ny=((X.syn==1)&(X.pkts>30)).astype(int)\nX_tr,X_te,y_tr,y_te=train_test_split(X,y,test_size=0.3)\nrf=RandomForestClassifier(n_estimators=100,max_depth=10,random_state=42,oob_score=True)\nrf.fit(X_tr,y_tr)\nimp=pd.DataFrame({"f":X.columns,"imp":rf.feature_importances_}).sort_values("imp",ascending=False)\nprint(f"OOB:{rf.oob_score_:.3f} Test:{rf.score(X_te,y_te):.3f}")\nfor _,r in imp.iterrows(): print(f"  {r.f}: {r.imp:.4f}")',
            'RF在IDS上的训练评估和特征重要性分析'),
         resources=res3(('决策树可视化','https://scikit-learn.org/stable/modules/tree.html','article'),('RF原论文','https://link.springer.com/article/10.1023/A:1010933404324','article'),('特征重要性','https://scikit-learn.org/stable/auto_examples/ensemble/plot_forest_importances.html','article')),
         recommendedTools=tool3(('Scikit-learn','树模型','https://scikit-learn.org/','local'),('dtreeviz','决策树可视化','https://github.com/parrt/dtreeviz','local'),('Graphviz','树结构绘图','https://graphviz.org/','local')),
         labEnvironment=lab1('RF IDS实验','RF在CIC-IDS多分类','https://www.kaggle.com/','local','1.加载CIC-IDS\n2.RF多分类\n3.分析特征重要性TOP10\n4.调优n_est/max_depth\n5.输出混淆矩阵','RF分类报告+特征重要性可视化'),
         expertNotes=n3w(['李智能','防过拟合','解决：1)限制max_depth(3-10) 2)min_samples_split(20-50) 3)min_samples_leaf。RF天然抗过拟合。',
                          '王算法','特征重要性校准','RF特征重要性对高基数类别特征有偏向。用Permutation Importance打乱每个特征看性能下降。',
                          '张模型','RF参数建议','推荐：n=200+、depth=10-15、class_weight=balanced(自动处理不平衡)、oob_score=True。'])),
]

days.extend(week2)

# ============ WRITE PART 1 ============
with open(OUT, 'w', encoding='utf-8') as f:
    f.write('''// AI网络安全学习计划（30天）
import { CyberLearningPlan, CyberDay } from './cyberBasic';

const week1: CyberDay[] = [
''')
    for i, d in enumerate(week1):
        f.write(day_obj(d))
        if i < len(week1) - 1:
            f.write(',\n')
        else:
            f.write('\n];\n\n')

    f.write('const week2: CyberDay[] = [\n')
    for i, d in enumerate(week2):
        f.write(day_obj(d))
        if i < len(week2) - 1:
            f.write(',\n')
        else:
            f.write('\n];\n\n')

    f.write('// PART1_COMPLETE_MARKER\n')

print(f'Part1 done: week1({len(week1)}) + week2({len(week2)}) = {len(week1)+len(week2)} days')
