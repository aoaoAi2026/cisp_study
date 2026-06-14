#!/usr/bin/env python3
"""生成 cyberAi.ts - AI网络安全30天学习计划"""
import json, textwrap

def esc(s):
    """转义TS字符串中的特殊字符"""
    return json.dumps(s, ensure_ascii=False)

def make_day(id, day, title, subtitle, objectives, content, key_points, quiz, code, resources, tools, lab, notes):
    """生成单日CyberDay对象"""
    parts = [
        f"  {{ id: '{id}', day: {day}, title: {esc(title)}, subtitle: {esc(subtitle)},",
        f"    objectives: {json.dumps(objectives, ensure_ascii=False)},",
        f"    content: {esc(content)},",
        f"    keyPoints: {json.dumps(key_points, ensure_ascii=False)},",
        f"    quiz: {json.dumps(quiz, ensure_ascii=False)},",
        f"    codeExamples: {json.dumps(code, ensure_ascii=False)},",
        f"    resources: {json.dumps(resources, ensure_ascii=False)},",
        f"    recommendedTools: {json.dumps(tools, ensure_ascii=False)},",
        f"    labEnvironment: {json.dumps(lab, ensure_ascii=False)},",
        f"    expertNotes: {json.dumps(notes, ensure_ascii=False)} }}",
    ]
    return "\n".join(parts)

# ============ 内容数据 ============

WEEKS = []

# ===================== WEEK 1 =====================
week1_days = []

# Day 1
week1_days.append(make_day('ai-1', 1, 'AI安全概述与学习路线', 'AI Security Overview',
    ['理解AI安全定义', '了解AI在安全中的应用', '明确学习路线'],
    'AI安全是人工智能与网络安全的交叉领域，涵盖AI赋能安全和AI自身安全两个维度。\n\n'
    'AI赋能安全：用机器学习/深度学习技术检测入侵、识别恶意软件、分析威胁情报、自动化响应。\n\n'
    'AI自身安全：对抗样本攻击、模型窃取、数据投毒、大模型Prompt注入、训练数据隐私泄露。\n\n'
    '典型应用场景：IDS/IPS智能检测、恶意软件家族分类、异常行为分析(UEBA)、威胁情报自动化、安全Copilot。\n\n'
    '30天学习路线：第1周-AI安全基础/数据处理 → 第2周-经典ML安全应用 → 第3周-深度学习安全 → 第4周-对抗攻防与LLM安全 → 第5周-AI安全工程实战。',
    ['AI安全是AI+安全的交叉领域', 'AI赋能安全：用AI检测威胁', 'AI自身安全：对抗攻击/数据投毒', '从ML基础到LLM安全完整链路', '每天4小时，30天系统学习'],
    [
        {"question":"AI安全包含哪两个维度？","options":["A. AI赋能安全和AI自身安全","B. 网络安全和系统安全","C. 前端和后端","D. 硬件和软件"],"correctIndex":0,"explanation":"AI安全包含两个维度：用AI技术提升安全能力(AI for Security)，以及AI系统本身的安全问题(Security of AI)。"},
        {"question":"以下哪个属于AI自身安全问题？","options":["A. 用ML检测DDoS","B. 对抗样本欺骗分类器","C. 用NLP分析日志","D. 自动化渗透测试"],"correctIndex":1,"explanation":"对抗样本是攻击ML模型的方法，属于AI自身安全(Security of AI)。选项A/C/D都是AI赋能安全的场景。"},
        {"question":"UEBA在AI安全中代表什么？","options":["A. 统一加密备份架构","B. 用户实体行为分析","C. 超强加密算法","D. 统一端点保护"],"correctIndex":1,"explanation":"UEBA=User and Entity Behavior Analytics，通过ML分析用户和设备行为，检测异常和内部威胁。"},
        {"question":"以下哪个不是AI在安全中的典型应用？","options":["A. 智能入侵检测","B. 恶意软件分类","C. 操作系统内核开发","D. 威胁情报自动化"],"correctIndex":2,"explanation":"操作系统内核开发属于系统开发领域，不是AI安全的典型应用。"},
        {"question":"本学习计划适合以下哪类人群？","options":["A. 完全零基础","B. 有Python+网络基础的安全从业者","C. 初中生","D. 只懂硬件的工程师"],"correctIndex":1,"explanation":"AI安全学习需要Python编程和网络协议基础作为前置知识。"}
    ],
    [{"title":"AI安全工具链概览","language":"python","code":"# AI安全常用库一览\nimport sklearn  # 经典ML: RF/XGBoost/SVM\nimport torch   # 深度学习: CNN/RNN/Transformer\nimport pandas as pd  # 数据处理\n\n# 安全场景分类\nai_sec = {\n    '入侵检测': ['sklearn', 'PyTorch', 'LightGBM'],\n    '恶意软件': ['EMBER', 'LIEF', 'Malimg'],\n    '异常检测': ['IsolationForest', 'AutoEncoder', 'OC-SVM'],\n    '对抗攻防': ['CleverHans', 'ART', 'Foolbox'],\n    'LLM安全': ['Garak', 'LangChain', 'PromptGuard'],\n    'MLOps': ['MLflow', 'FastAPI', 'Docker']\n}\nprint('=== AI安全工具链 ===')\nfor k,v in ai_sec.items():\n    print(f'{k}: {\" | \".join(v)}')","explanation":"AI安全领域核心Python库和工具概览"}],
    [{"name":"MITRE ATLAS框架","url":"https://atlas.mitre.org/","type":"article"},{"name":"AI安全全景图","url":"https://www.freebuf.com/articles/es/356789.html","type":"article"},{"name":"OWASP AI安全项目","url":"https://owasp.org/www-project-ai-security/","type":"article"}],
    [{"name":"JupyterLab","description":"交互式数据科学环境","url":"https://jupyter.org/","type":"local"},{"name":"Anaconda","description":"Python数据科学发行版","url":"https://www.anaconda.com/","type":"local"},{"name":"PyTorch","description":"深度学习框架","url":"https://pytorch.org/","type":"local"}],
    [{"name":"AI安全环境搭建","description":"配置Python+PyTorch+安全数据集","url":"https://www.kaggle.com/","type":"local","setup":"1. 安装Anaconda\n2. 创建虚拟环境: conda create -n aisec python=3.10\n3. 安装核心库: pip install torch sklearn pandas matplotlib jupyter\n4. 下载CIC-IDS2017数据集\n5. 验证环境","expectedOutput":"成功搭建AI安全实验环境"}],
    [{"author":"李智能","title":"AI安全学习建议","content":"AI安全学习最容易犯的错误是直接啃论文。建议从实战入手：先跑通几个经典项目（IDS检测、恶意软件分类），理解数据流和模型流程，再回过头看理论，事半功倍。"},
     {"author":"王算法","title":"安全+ML的思维转变","content":"传统安全人员转型AI安全最大的挑战是思维转变。安全思维是'找漏洞'，ML思维是'找模式'。建议先接受ML的不确定性（没有100%准确率），理解误报/漏报的权衡。"},
     {"author":"张模型","title":"选PyTorch还是TensorFlow","content":"安全领域推荐PyTorch。理由：1)学术界主流 2)调试友好(动态图) 3)对抗攻击库(ART/CleverHans)原生支持。安全研究更适合PyTorch。"}]
))

# Day 2
week1_days.append(make_day('ai-2', 2, 'Python数据科学生态', 'Python Data Science',
    ['掌握NumPy数组操作', '理解Pandas核心API', '学习数据处理pipeline'],
    'NumPy和Pandas是AI安全数据处理的基石。\n\nNumPy核心：ndarray创建与操作、广播机制（不同形状数组运算）、向量化运算（避免Python循环）。\n\nPandas核心：Series和DataFrame、数据筛选（loc/iloc/query）、分组聚合（groupby/agg）。\n\n安全数据处理技巧：处理大量CSV日志（chunksize分批读取）、处理缺失值（fillna/dropna）、时间序列处理（to_datetime/resample）。\n\n向量化是性能关键：用NumPy/Pandas内置函数替代Python for循环，处理百万级安全日志时性能差异可达100倍。',
    ['NumPy提供高性能数组运算', 'Pandas是安全数据处理核心', 'groupby用于日志聚合分析', '向量化替代循环提升百倍性能', 'chunksize处理大数据集'],
    [
        {"question":"处理10GB以上安全日志的正确方式是什么？","options":["A. pd.read_csv('log.csv')","B. pd.read_csv('log.csv', chunksize=100000)","C. 用Excel打开","D. 直接打印"],"correctIndex":1,"explanation":"chunksize参数分批读取大文件，每次只加载指定行数到内存，避免OOM。"},
        {"question":"以下哪个操作是向量化的？","options":["A. for x in data: result.append(x*2)","B. data * 2 (NumPy数组)","C. list comprehension","D. while循环"],"correctIndex":1,"explanation":"NumPy数组的data*2是向量化运算，底层用C实现，速度快于Python循环。"},
        {"question":"Pandas中loc和iloc的区别是什么？","options":["A. 完全相同","B. loc用标签索引，iloc用位置索引","C. loc更快","D. iloc只能用数字"],"correctIndex":1,"explanation":"loc基于标签(label)选取，iloc基于整数位置(integer position)选取。"},
        {"question":"NumPy广播(broadcasting)的作用是什么？","options":["A. 网络通信","B. 不同形状数组之间的算术运算","C. 数据加密","D. 文件传输"],"correctIndex":1,"explanation":"广播机制允许不同形状的NumPy数组进行算术运算，自动扩展维度匹配。"},
        {"question":"处理安全日志缺失值的正确方式是？","options":["A. 直接删除所有含NaN的行","B. 分析缺失原因后选择填充或删除","C. 全部填0","D. 忽略不管"],"correctIndex":1,"explanation":"缺失值需要分析原因(设备未上报/采集失败/正常缺失)，再决定处理策略。"}
    ],
    [{"title":"安全日志Pandas分析","language":"python","code":"import pandas as pd\nimport numpy as np\n\n# 模拟安全日志\nnp.random.seed(42)\ndata = {\n    'timestamp': pd.date_range('2024-01-01', periods=1000, freq='1min'),\n    'src_ip': [f'192.168.{np.random.randint(1,255)}.{np.random.randint(1,255)}' for _ in range(1000)],\n    'dst_port': np.random.choice([22,80,443,3306,8080], 1000),\n    'protocol': np.random.choice(['TCP','UDP','ICMP'], 1000, p=[0.7,0.2,0.1]),\n    'bytes': np.random.exponential(1000, 1000).astype(int)\n}\ndf = pd.DataFrame(data)\nprint('=== 安全日志分析 ===')\nprint(f'总记录: {len(df)}')\nprint(f'协议分布:\\n{df[\"protocol\"].value_counts()}')\nprint(f'端口流量统计:\\n{df.groupby(\"dst_port\")[\"bytes\"].agg([\"sum\",\"mean\",\"count\"])}')","explanation":"使用Pandas进行安全日志的协议分布、流量统计和TOP IP分析"}],
    [{"name":"Pandas官方文档","url":"https://pandas.pydata.org/docs/","type":"article"},{"name":"NumPy快速入门","url":"https://numpy.org/doc/stable/user/quickstart.html","type":"article"},{"name":"Python数据科学手册","url":"https://jakevdp.github.io/PythonDataScienceHandbook/","type":"article"}],
    [{"name":"Pandas","description":"数据处理核心库","url":"https://pandas.pydata.org/","type":"local"},{"name":"NumPy","description":"科学计算基础库","url":"https://numpy.org/","type":"local"},{"name":"Matplotlib","description":"数据可视化库","url":"https://matplotlib.org/","type":"local"}],
    [{"name":"Python数据处理实验","description":"Pandas安全日志分析","url":"https://www.kaggle.com/","type":"local","setup":"1. 安装pandas,numpy,matplotlib\n2. 准备CIC-IDS数据集CSV\n3. 用pandas加载并按协议聚合\n4. 计算流量统计特征\n5. 输出分析报告","expectedOutput":"掌握Pandas安全日志分析基本操作"}],
    [{"author":"李智能","title":"Pandas性能优化技巧","content":"处理安全大数据时注意：1)用category类型存协议/端口(省70%内存) 2)用eval/query加速过滤 3)避免链式索引(用loc) 4)能用agg就别循环。"},
     {"author":"王算法","title":"安全数据的特征工程思维","content":"用Pandas做安全特征工程时，要养成'窗口思维'：按时间窗口聚合→提取统计量(mean/std/max)→构造比率特征。这些特征比原始数据更适合ML。"},
     {"author":"张模型","title":"常见安全数据集格式处理","content":"CIC-IDS/UNSW-NB15等通常用CSV格式。处理要点：1)列名可能有空格 2)标签列通常叫Label 3)时间戳需parse_dates 4)转Parquet格式更高效。"}]
))

# Day 3
week1_days.append(make_day('ai-3', 3, '安全数据可视化', 'Security Data Visualization',
    ['掌握matplotlib核心API', '理解seaborn统计图表', '学习Plotly交互图表'],
    '数据可视化是安全分析中发现问题的重要手段。\n\nmatplotlib基础：折线图（plot）、柱状图（bar）、散点图（scatter）、饼图（pie）、子图布局（subplots）。\n\nseaborn进阶：分布图（histplot/kdeplot）、箱线图（boxplot）、热力图（heatmap）、小提琴图（violinplot）。\n\n安全分析场景：流量时序图发现DDoS波形、协议分布饼图了解流量构成、端口热力图发现异常扫描、箱线图检测流量异常值。\n\nPlotly交互图表：支持缩放/悬停/筛选，适合构建安全分析仪表盘。',
    ['matplotlib是Python绘图基础', 'seaborn更适合统计图表', 'Plotly支持交互式分析', '热力图发现相关关系', '箱线图直观展示异常值'],
    [
        {"question":"检测DDoS攻击最适合用什么图？","options":["A. 饼图","B. 流量时序折线图","C. 散点图","D. 词云"],"correctIndex":1,"explanation":"DDoS会导致流量突增，时序折线图能直观展示流量随时间的变化和异常峰值。"},
        {"question":"seaborn热力图在安全分析中的典型用途是什么？","options":["A. 显示攻击时间","B. 展示特征之间的相关性","C. 绘制网络拓扑","D. 显示日志文本"],"correctIndex":1,"explanation":"热力图用颜色深浅展示特征间的相关系数，帮助发现哪些特征与攻击标签高度相关。"},
        {"question":"箱线图在异常检测中的优势是什么？","options":["A. 显示所有数据点","B. 直观展示四分位数和离群点","C. 只能画一个变量","D. 不适合大数据"],"correctIndex":1,"explanation":"箱线图展示中位数、四分位数和离群点(1.5*IQR以外的点)，是异常检测的直观工具。"},
        {"question":"安全可视化中使用对数坐标的主要原因？","options":["A. 更好看","B. 处理流量数据的长尾分布","C. 节省存储","D. 加速渲染"],"correctIndex":1,"explanation":"网络流量数据呈长尾分布，对数坐标让不同量级的数据都可辨识。"},
        {"question":"分析协议分布最适合用什么图？","options":["A. 饼图","B. 散点图","C. 箱线图","D. 热力图"],"correctIndex":0,"explanation":"饼图适合展示组成部分的比例关系，可以直观看到TCP/UDP/ICMP等协议的流量占比。"}
    ],
    [{"title":"安全流量可视化","language":"python","code":"import matplotlib.pyplot as plt\nimport seaborn as sns\nimport pandas as pd\nimport numpy as np\n\nnp.random.seed(0)\nn = 500\ndf = pd.DataFrame({\n    'bytes': np.concatenate([np.random.exponential(500,450), np.random.exponential(5000,50)]),\n    'label': ['Normal']*450+['Attack']*50,\n    'protocol': np.random.choice(['TCP','UDP'], n)\n})\n\nfig, axes = plt.subplots(2, 2, figsize=(12, 10))\nsns.histplot(data=df, x='bytes', hue='label', bins=50, ax=axes[0,0])\naxes[0,0].set_title('Flow Size Distribution')\nsns.boxplot(data=df, x='label', y='bytes', ax=axes[0,1])\naxes[0,1].set_title('Bytes by Label')\nprotocol_counts = df['protocol'].value_counts()\naxes[1,0].pie(protocol_counts, labels=protocol_counts.index, autopct='%1.1f%%')\naxes[1,0].set_title('Protocol Distribution')\nprint('图表已生成')","explanation":"安全数据可视化：分布/箱线/饼图/时序，覆盖常见分析场景"}],
    [{"name":"matplotlib官方教程","url":"https://matplotlib.org/stable/tutorials/","type":"article"},{"name":"seaborn图库","url":"https://seaborn.pydata.org/examples/","type":"article"},{"name":"Plotly安全仪表盘","url":"https://plotly.com/python/","type":"article"}],
    [{"name":"Matplotlib","description":"Python基础绑图","url":"https://matplotlib.org/","type":"local"},{"name":"Seaborn","description":"统计数据可视化","url":"https://seaborn.pydata.org/","type":"local"},{"name":"Plotly","description":"交互式可视化","url":"https://plotly.com/python/","type":"online"}],
    [{"name":"安全可视化实验","description":"用Python可视化CIC-IDS数据","url":"https://www.kaggle.com/","type":"local","setup":"1. 加载CIC-IDS数据集\n2. 绘制协议分布饼图\n3. 绘制流量时序折线图\n4. 绘制特征相关性热力图\n5. 用箱线图标注异常","expectedOutput":"生成完整的安全数据可视化分析报告"}],
    [{"author":"李智能","title":"安全可视化的配色方案","content":"安全可视化配色建议：正常流量用蓝色/绿色(安全色)，攻击流量用红色/橙色(警示色)，未知流量用灰色。一致的配色让分析师快速判断告警严重程度。"},
     {"author":"王算法","title":"Streamlit快速搭建安全仪表盘","content":"Jupyter适合探索分析，但要展示推荐用Streamlit。几行代码就能把matplotlib图表变成Web仪表盘，还能加筛选器和时间选择器。"},
     {"author":"张模型","title":"什么时候用对数坐标","content":"安全数据(logs/traffic)通常符合幂律分布：大量小事件+少量大事件。线性坐标会让数据'挤在一起'，对数坐标清晰展示全量级分布。"}]
))

# Day 4
week1_days.append(make_day('ai-4', 4, '概率统计与贝叶斯检测', 'Probability & Bayesian Detection',
    ['掌握贝叶斯定理', '理解概率分布', '学习统计假设检验'],
    '概率统计是AI安全的基础数学工具。\n\n贝叶斯定理：P(A|B) = P(B|A)×P(A) / P(B)，用于计算给定观测数据下攻击发生的后验概率。\n\n安全场景应用：给定一个IP的请求频率，计算它是恶意扫描的概率；给定一个文件的字节熵，计算它是压缩/加密恶意软件的概率。\n\n常见概率分布：正态分布（流量大小）、泊松分布（单位时间告警数）、指数分布（攻击间隔时间）、幂律分布（IP请求分布）。\n\n假设检验：t检验比较正常和攻击流量的均值差异、卡方检验分析分类特征与标签的关联。\n\n贝叶斯检测优势：1)可融合多源证据 2)天然处理不确定性 3)可结合先验知识。',
    ['贝叶斯定理是概率推理基础', '后验概率融合先验和观测', '假设检验发现统计显著差异', '泊松分布适合建模告警频率', '正态分布适合流量建模'],
    [
        {"question":"贝叶斯定理中P(H|E)称为什么？","options":["A. 先验概率","B. 后验概率","C. 似然概率","D. 边缘概率"],"correctIndex":1,"explanation":"P(H|E)是在观测到证据E后，假设H成立的概率，称为后验概率(Posterior)。"},
        {"question":"以下哪个分布最适合建模'单位时间内安全告警数量'？","options":["A. 正态分布","B. 泊松分布","C. 均匀分布","D. 多项式分布"],"correctIndex":1,"explanation":"泊松分布描述单位时间内随机事件发生的次数，适合建模告警频率。"},
        {"question":"KS检验在安全分析中的用途是什么？","options":["A. 测试两个分布是否相同","B. 测试特征是否相关","C. 测试样本均值","D. 测试模型准确率"],"correctIndex":0,"explanation":"Kolmogorov-Smirnov检验用于判断两组数据是否来自同一分布，可用于检测流量分布偏移。"},
        {"question":"贝叶斯检测相比阈值检测的优势？","options":["A. 更简单","B. 可以融合多源证据和先验知识","C. 不需要数据","D. 100%准确"],"correctIndex":1,"explanation":"贝叶斯方法可以融合多个检测源的概率(如同时考虑IP信誉+请求频率+时间异常)。"},
        {"question":"正态分布中数据落在μ±3σ内的比例约为？","options":["A. 68%","B. 95%","C. 99.7%","D. 100%"],"correctIndex":2,"explanation":"3σ原则：正态分布中约99.7%数据在均值±3倍标准差范围内，超出此范围的数据高度可疑。"}
    ],
    [{"title":"贝叶斯异常IP检测","language":"python","code":"# 贝叶斯异常IP检测\nclass BayesianDetector:\n    def __init__(self, prior=0.01):\n        self.prior = prior  # 先验：1%的IP恶意\n    def detect(self, ip, req_count, hour):\n        p_mal = min(req_count/100, 0.95)  # 恶意高频\n        p_norm = max(0.01, (100-req_count)/100)\n        p_time_mal = 0.3 if hour < 6 else 0.7  # 凌晨异常\n        p_time_norm = 0.05 if hour < 6 else 0.95\n        # 贝叶斯后验\n        lr = (p_mal*p_time_mal)/(p_norm*p_time_norm)\n        posterior = (lr*self.prior)/(lr*self.prior+(1-self.prior))\n        return posterior\n\ndet = BayesianDetector()\ntests = [('192.168.1.1',3,14),('10.0.0.99',85,3),('172.16.0.50',12,10)]\nfor ip,cnt,hr in tests:\n    r = det.detect(ip,cnt,hr)\n    print(f'{ip}: 风险={r:.2%} {\"⚠异常\" if r>0.5 else \"✓正常\"}')","explanation":"基于贝叶斯定理的异常IP检测，融合请求频率和时间异常两个证据源"}],
    [{"name":"贝叶斯方法入门","url":"https://seeing-theory.brown.edu/bayesian-inference/","type":"article"},{"name":"统计学习基础","url":"https://www.statlearning.com/","type":"article"},{"name":"概率论可视化教程","url":"https://setosa.io/conditional/","type":"article"}],
    [{"name":"SciPy","description":"科学计算与统计","url":"https://scipy.org/","type":"local"},{"name":"PyMC","description":"贝叶斯统计建模","url":"https://www.pymc.io/","type":"local"},{"name":"Statsmodels","description":"统计模型库","url":"https://www.statsmodels.org/","type":"local"}],
    [{"name":"贝叶斯检测实验","description":"贝叶斯方法异常IP检测","url":"https://www.kaggle.com/","type":"local","setup":"1. 收集Web服务器访问日志\n2. 提取IP请求频率和时间特征\n3. 实现贝叶斯风险评分\n4. 设定阈值告警\n5. 对比阈值法效果","expectedOutput":"贝叶斯检测器和阈值检测器的ROC对比"}],
    [{"author":"李智能","title":"先验概率从哪里来","content":"贝叶斯的先验概率不是拍脑袋的。可从历史数据统计(如历史上1%的告警是真实攻击)、行业报告(如Verizon DBIR)、或专家经验开始。逐步修正。"},
     {"author":"王算法","title":"安全场景的概率校准","content":"安全检测中概率输出往往'过于自信'或'过于保守'。建议用概率校准(Platt Scaling)修正模型输出的分数，让0.8真正意味着80%的置信度。"},
     {"author":"张模型","title":"统计vs ML在异常检测中的选择","content":"数据少于1000条、特征少于5个时，统计方法(Z-score/IQR)更好；数据上万条、特征几十个时，ML方法明显占优。根据数据规模选方法。"}]
))

# Day 5
week1_days.append(make_day('ai-5', 5, '统计异常检测实战', 'Statistical Anomaly Detection',
    ['掌握Z-Score检测', '理解IQR异常检测', '学习自适应阈值'],
    '统计异常检测是AI安全的入门实践，不依赖标签数据。\n\nZ-Score方法：z=(x-μ)/σ，|z|>3判断为异常（3σ原则）。\n\nIQR方法：Q1(25%)、Q3(75%)、IQR=Q3-Q1。x<Q1-1.5×IQR或x>Q3+1.5×IQR为异常。比Z-Score更鲁棒。\n\nMAD方法：median(|x-median|)，对离群值极度鲁棒。\n\n自适应阈值：EWMA(指数加权移动平均)，EMA=α×当前值+(1-α)×上期EMA。\n\n实战：用这些方法检测端口扫描、DDoS流量突增、异常时间登录。',
    ['Z-Score检测偏离均值程度', 'IQR基于四分位数更鲁棒', 'MAD对离群值极度鲁棒', 'EWMA实现自适应动态阈值', '统计方法不需要标注数据'],
    [
        {"question":"Z-Score方法中|z|>3判断为异常的理论依据是什么？","options":["A. 正态分布99.7%数据在3σ内","B. 经验法则","C. 行业规定","D. 没有依据"],"correctIndex":0,"explanation":"正态分布中约99.7%的数据落在μ±3σ范围内，超出此范围的仅有0.3%，高度可疑。"},
        {"question":"IQR方法相比Z-Score的主要优势是什么？","options":["A. 计算更简单","B. 对偏态分布和离群点更鲁棒","C. 速度更快","D. 精度更高"],"correctIndex":1,"explanation":"IQR基于中位数和四分位数，不受极端值影响，对非正态/偏态分布更鲁棒。"},
        {"question":"EWMA中α参数的作用是什么？","options":["A. 控制置信区间","B. 控制对新数据的敏感度","C. 控制样本大小","D. 控制阈值大小"],"correctIndex":1,"explanation":"α(通常0.1-0.3)控制近期数据权重。α越大，基线对新变化越敏感。"},
        {"question":"以下哪个场景不适合用统计异常检测？","options":["A. DDoS流量突增","B. 端口扫描","C. 单个复杂多步APT攻击","D. 异常时间登录"],"correctIndex":2,"explanation":"APT攻击通常没有明显的统计异常特征，需要行为分析和上下文关联。"},
        {"question":"MAD中的修正因子1.4826的作用是什么？","options":["A. 使MAD与正态分布的标准差一致","B. 加速计算","C. 随机选择","D. 减少内存"],"correctIndex":0,"explanation":"在正态分布下，MAD×1.4826可得到标准差的无偏估计，直接使用3σ判定规则。"}
    ],
    [{"title":"三种异常检测方法对比","language":"python","code":"import numpy as np\n\ndef zscore_detect(data, threshold=3):\n    z = (data - data.mean()) / data.std()\n    return np.abs(z) > threshold\n\ndef iqr_detect(data, k=1.5):\n    q1, q3 = np.percentile(data, [25, 75])\n    iqr = q3 - q1\n    return (data < q1-k*iqr) | (data > q3+k*iqr)\n\ndef mad_detect(data, threshold=3):\n    median = np.median(data)\n    mad = np.median(np.abs(data - median))\n    z = 0.6745 * (data - median) / mad\n    return np.abs(z) > threshold\n\nnp.random.seed(42)\ntraffic = np.random.normal(1000, 200, 100)\ntraffic[10] = 3000; traffic[50] = 3500; traffic[80] = 2500\nprint('=== 异常检测对比 ===')\nfor n,f in [('Z-Score',zscore_detect),('IQR',iqr_detect),('MAD',mad_detect)]:\n    a = np.where(f(traffic))[0]\n    print(f'{n}: {len(a)}个异常 -> {a.tolist()}')","explanation":"Z-Score/IQR/MAD三种统计异常检测方法实现与对比"}],
    [{"name":"异常检测综述","url":"https://www.analyticsvidhya.com/blog/2019/02/outlier-detection-python-pyod/","type":"article"},{"name":"PyOD异常检测库","url":"https://pyod.readthedocs.io/","type":"article"},{"name":"EWMA方法详解","url":"https://www.itl.nist.gov/div898/handbook/pmc/section3/pmc324.htm","type":"article"}],
    [{"name":"PyOD","description":"Python异常检测工具集","url":"https://pyod.readthedocs.io/","type":"local"},{"name":"NumPy","description":"统计计算基础","url":"https://numpy.org/","type":"local"},{"name":"Scikit-learn","description":"ML异常检测算法","url":"https://scikit-learn.org/","type":"local"}],
    [{"name":"异常检测实验","description":"实现并对比多种异常检测方法","url":"https://www.kaggle.com/","type":"local","setup":"1. 生成/加载带标签的数据\n2. 实现Z-Score检测器\n3. 实现IQR检测器\n4. 实现EWMA自适应阈值\n5. 绘制ROC曲线对比","expectedOutput":"三种方法在相同数据上的检出率和误报率对比"}],
    [{"author":"李智能","title":"统计检测的'基线期'选择","content":"必须确保基线期数据不包含攻击。建议选业务低谷期的历史数据，或通过人工标注去除已知攻击时段。"},
     {"author":"王算法","title":"告警阈值不是拍脑袋","content":"实际业务中需根据ROC曲线选最优阈值。先用标注数据画ROC→根据可接受误报率选阈值→上线后持续调整。"},
     {"author":"张模型","title":"什么时候统计方法就够了","content":"以下场景统计方法就很好：1)单维度时间序列 2)规则模式明显的异常 3)数据量少(<1000条)。简单有效，可解释性还强。"}]
))

# Day 6
week1_days.append(make_day('ai-6', 6, '安全特征工程', 'Security Feature Engineering',
    ['理解特征提取思路', '掌握流量特征构建', '学习文本特征处理'],
    '特征工程是AI安全模型效果的关键，好的特征比复杂模型更重要。\n\n网络流量特征：包级别（包大小、间隔、标志位）、流级别（持续时间、字节数/包数）、聚合级别（时间窗口内连接数、去重IP数）。\n\n统计特征：均值/标准差/最大值/去重数/熵/偏度。\n\n比率特征：SYN/总包比、失败/总登录比、上行/下行比。比率特征对异常更敏感。\n\n文本特征：TF-IDF（对Web payload编码）、Character n-gram（对抗SQL注入变形）。\n\n特征选择：删除低方差特征、高相关系数特征去重、互信息选Top-K。',
    ['特征工程比算法选择更重要', '流级别特征比包级别更有信息量', '比率特征对异常更敏感', 'TF-IDF编码Web payload', '特征选择防止过拟合和维度灾难'],
    [
        {"question":"特征工程中为什么推荐使用比率特征？","options":["A. 计算简单","B. 比率对异常更敏感且尺度归一化","C. 不需要处理","D. 减少数据量"],"correctIndex":1,"explanation":"比率特征(如SYN/总包比)天然归一化到0-1区间，不受流量总量影响，对模式变化非常敏感。"},
        {"question":"TF-IDF在Web安全中的典型用途是什么？","options":["A. 加密流量","B. 将HTTP payload向量化","C. 分析图片","D. 处理音频"],"correctIndex":1,"explanation":"TF-IDF将文本(payload)转为数值向量，可用于SQL注入/XSS等文本型攻击的特征编码。"},
        {"question":"CIC-IDS中的'Flow Duration'是什么级别的特征？","options":["A. 包级别","B. 流级别","C. 会话级别","D. 主机级别"],"correctIndex":1,"explanation":"Flow Duration是流级别特征，表示从TCP三次握手开始到FIN/RST结束的持续时间。"},
        {"question":"以下哪个是好的安全特征？","options":["A. 用户ID","B. 过去5分钟内登录失败次数","C. 服务器序列号","D. 时间戳原始值"],"correctIndex":1,"explanation":"过去5分钟登录失败次数是典型的统计窗口特征，对暴力破解检测非常有效。"},
        {"question":"特征选择中删除高相关特征(r>0.95)的主因？","options":["A. 节省存储","B. 减少多重共线性和过拟合风险","C. 提高可读性","D. 加速训练"],"correctIndex":1,"explanation":"高度相关特征提供冗余信息，会导致模型不稳定和过拟合，删除其中一个即可。"}
    ],
    [{"title":"安全特征工程Pipeline","language":"python","code":"import pandas as pd\nimport numpy as np\n\nnp.random.seed(42)\nn = 1000\ndf = pd.DataFrame({\n    'duration': np.random.exponential(10, n),\n    'src_bytes': np.random.exponential(500, n),\n    'total_pkts': np.random.poisson(20, n),\n    'syn_count': np.random.poisson(3, n),\n    'dst_port': np.random.choice([22,80,443,3306], n),\n})\ndf['bytes_per_pkt'] = (df['src_bytes']) / (df['total_pkts']+1)\ndf['syn_ratio'] = df['syn_count'] / (df['total_pkts']+1)\ndf['byte_rate'] = df['src_bytes'] / (df['duration']+0.001)\ndf['is_common'] = df['dst_port'].isin([80,443]).astype(int)\nprint('新增特征: bytes_per_pkt, syn_ratio, byte_rate, is_common')\nprint(f'SYN比率>0.5疑似扫描: {(df[\"syn_ratio\"]>0.5).sum()}')","explanation":"从原始流数据生成衍生特征：比率/速率/布尔特征"}],
    [{"name":"特征工程实战指南","url":"https://www.featuretools.com/","type":"article"},{"name":"CICFlowMeter特征文档","url":"https://www.unb.ca/cic/research/applications.html","type":"article"},{"name":"Featuretools自动化","url":"https://docs.featuretools.com/","type":"article"}],
    [{"name":"Featuretools","description":"自动化特征工程","url":"https://www.featuretools.com/","type":"local"},{"name":"tsfresh","description":"时序特征提取","url":"https://tsfresh.readthedocs.io/","type":"local"},{"name":"Scikit-learn","description":"特征选择与预处理","url":"https://scikit-learn.org/","type":"local"}],
    [{"name":"特征工程实验","description":"从CIC-IDS原始数据构建ML特征","url":"https://www.kaggle.com/","type":"local","setup":"1. 加载CIC-IDS原始CSV\n2. 分析原始列含义\n3. 构造比率特征和统计特征\n4. 计算特征与标签的相关性\n5. 选择Top-20特征","expectedOutput":"完成特征工程流程，输出最优特征集"}],
    [{"author":"李智能","title":"安全特征工程的'窗口'选择","content":"时间窗口大小是最关键参数。太小(1秒)噪声大；太大(1小时)延迟高。建议从5分钟开始实验，根据业务场景调整。"},
     {"author":"王算法","title":"别忽略基础统计特征","content":"最有效的往往是简单统计特征：过去N分钟的去重IP数、连接失败率、新连接占比。这些特征计算快、可解释、效果还好。"},
     {"author":"张模型","title":"文本特征vs数值特征","content":"Web安全有大量文本数据(URL/payload)。短文本用TF-IDF，长文本用Word2Vec/BERT。注意TF-IDF容易产生大量稀疏特征，需配合降维。"}]
))

# Day 7
week1_days.append(make_day('ai-7', 7, '第一周总结：安全数据Pipeline', 'Week 1 Summary',
    ['复盘本周学习', '构建完整Pipeline', '准备ML阶段'],
    '本周建立了AI安全学习的基础，从数据处理到特征工程再到统计检测。\n\n核心技能回顾：\n1. Python数据科学生态(NumPy/Pandas/Matplotlib)\n2. 概率统计与贝叶斯方法\n3. 统计异常检测(Z-Score/IQR/EWMA)\n4. 安全特征工程\n\n实践项目：搭建安全数据Pipeline\n数据采集→Pandas清洗→特征提取→统计检测→可视化报告\n\n下阶段预告：机器学习分类算法(逻辑回归/决策树/随机森林/XGBoost)+异常检测(孤立森林/OC-SVM/AE)',
    ['掌握Pandas安全日志分析', '理解贝叶斯概率推理', '实现至少3种统计异常检测', '构建完整特征工程Pipeline', '建立AI安全学习框架'],
    [
        {"question":"以下哪个不是本周学习的统计异常检测方法？","options":["A. Z-Score","B. IQR","C. 孤立森林","D. EWMA"],"correctIndex":2,"explanation":"孤立森林是下一周要学的ML异常检测方法，本周重点在统计方法。"},
        {"question":"比率特征相比绝对数值特征的主要优势？","options":["A. 计算更快","B. 天然归一化，不受总量波动影响","C. 更精确","D. 需要更少内存"],"correctIndex":1,"explanation":"比率特征天然归一化，不受流量总量变化影响，更具泛化能力。"},
        {"question":"贝叶斯检测的最大价值是什么？","options":["A. 100%准确","B. 融合多源证据给出综合风险概率","C. 不需要数据","D. 计算简单"],"correctIndex":1,"explanation":"贝叶斯方法的核心价值是融合多个弱证据源，给出统一的后验概率。"},
        {"question":"安全特征工程最关键的参数是什么？","options":["A. 特征名称","B. 时间窗口大小","C. 特征数量","D. 内存大小"],"correctIndex":1,"explanation":"时间窗口大小决定了特征的时效性和稳定性，是安全特征工程最重要的参数。"},
        {"question":"统计异常检测相比ML异常检测最适合什么场景？","options":["A. 多维度复杂异常","B. 单维度时序数据，数据量小","C. 图像异常检测","D. 文本异常检测"],"correctIndex":1,"explanation":"统计方法最适合单维度/少数维度且数据量小的场景，简单高效且可解释性强。"}
    ],
    [{"title":"完整安全数据Pipeline","language":"python","code":"class SecurityPipeline:\n    def __init__(self):\n        self.df = None\n        self.stats = {}\n    def load(self, csv_path):\n        self.df = pd.read_csv(csv_path)\n        return self\n    def clean(self):\n        self.df = self.df.dropna(axis=1, how='all').fillna(0).drop_duplicates()\n        return self\n    def engineer(self):\n        # 添加衍生特征\n        if 'Flow Duration' in self.df.columns:\n            self.df['byte_rate'] = self.df.get('Flow Bytes/s',0) / (self.df['Flow Duration']+0.001)\n        return self\n    def detect(self, col, method='zscore'):\n        data = self.df[col].values\n        z = (data-data.mean())/data.std()\n        n = (np.abs(z)>3).sum()\n        self.stats[col] = n\n        return self\n    def report(self):\n        for k,v in self.stats.items():\n            print(f'{k}: {v} anomalies')","explanation":"端到端安全数据Pipeline骨架：加载→清洗→特征→检测→报告"}],
    [{"name":"Scikit-learn Pipeline","url":"https://scikit-learn.org/stable/modules/compose.html","type":"article"},{"name":"安全数据科学方法论","url":"https://www.freebuf.com/articles/es/345672.html","type":"article"},{"name":"MITRE ATT&CK数据源","url":"https://attack.mitre.org/datasources/","type":"article"}],
    [{"name":"JupyterLab","description":"交互式分析环境","url":"https://jupyter.org/","type":"local"},{"name":"Streamlit","description":"快速仪表盘","url":"https://streamlit.io/","type":"local"},{"name":"Scikit-learn","description":"ML工具集","url":"https://scikit-learn.org/","type":"local"}],
    [{"name":"Pipeline集成实验","description":"端到端安全数据处理Pipeline","url":"https://www.kaggle.com/","type":"local","setup":"1. 整合本周所有代码\n2. 构建统一的Pipeline类\n3. 加载CIC-IDS数据测试\n4. 输出统计检测报告\n5. 整理代码至GitHub","expectedOutput":"完成安全数据Pipeline，为ML阶段准备就绪"}],
    [{"author":"李智能","title":"第一周学习的核心收获","content":"本周最重要的是建立了'数据思维'。安全分析不仅仅是找漏洞，更是从海量数据中发现模式。Python+Pandas+可视化是未来30天最核心的工具组合。"},
     {"author":"王算法","title":"下阶段准备","content":"进入ML阶段前确认两件事：1)Python+Pandas已经熟练 2)理解了概率统计基本概念。如果还不太熟练，这周多花时间巩固。"},
     {"author":"张模型","title":"从统计到ML的过渡","content":"统计方法解决了'这个点是不是异常'的问题，ML要解决'这个模式属于哪类攻击'的问题。下周让模型自动学习模式，不再依赖人工设定阈值。"}]
))

WEEKS.append(week1_days)

# ===================== WEEK 2 =====================
week2_days = []

# Day 8
week2_days.append(make_day('ai-8', 8, '机器学习概述与数据准备', 'ML Overview & Data Prep',
    ['理解监督/无监督学习', '掌握sklearn Pipeline', '学习数据划分策略'],
    '机器学习是AI安全的核心技术。\n\n学习范式：监督学习（有标签分类/回归）、无监督学习（无标签聚类/异常检测）、半监督学习（少量标签+大量无标签）。\n\nsklearn Pipeline：统一数据处理和模型训练接口，确保训练和预测使用相同预处理。\n\n数据划分：训练集(60-70%)、验证集(15-20%)、测试集(15-20%)。安全数据需按时间顺序划分。\n\n类别不平衡：攻击样本远少于正常样本（1:100到1:10000），需要特殊处理策略。',
    ['监督学习需要标注数据', '无监督学习发现未知模式', 'sklearn Pipeline统一预处理', '时间序列数据按时间划分', '类别不平衡是安全数据常态'],
    [
        {"question":"安全数据划分最重要的原则是什么？","options":["A. 随机划分","B. 按时间顺序划分","C. 按IP划分","D. 按文件大小划分"],"correctIndex":1,"explanation":"安全数据是时间序列，用未来数据训练来预测过去会产生'数据泄漏'。"},
        {"question":"sklearn Pipeline的核心优势是什么？","options":["A. 速度更快","B. 保证训练和预测使用相同的预处理步骤","C. 自动选择模型","D. 免费"],"correctIndex":1,"explanation":"Pipeline将预处理和模型训练封装，确保数据经过完全相同的转换。"},
        {"question":"以下哪种学习范式最适合'发现新型未知攻击'？","options":["A. 监督学习","B. 无监督学习","C. 回归分析","D. 强化学习"],"correctIndex":1,"explanation":"无监督学习不需要标签，可在无先验知识下发现数据中的异常模式=未知攻击。"},
        {"question":"安全数据中类别不平衡的典型比例？","options":["A. 50:50","B. 99:1(正常:攻击)","C. 60:40","D. 30:70"],"correctIndex":1,"explanation":"现实中绝大多数流量是正常的，攻击样本往往只占0.1%-1%。"},
        {"question":"半监督学习的优势是什么？","options":["A. 不需要数据","B. 利用少量标注+大量无标注数据","C. 100%准确","D. 最快"],"correctIndex":1,"explanation":"安全标注成本极高，半监督学习用少量标签引导+大量无标签数据，实用性强。"}
    ],
    [{"title":"ML数据准备Pipeline","language":"python","code":"import numpy as np\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.pipeline import Pipeline\nfrom sklearn.ensemble import RandomForestClassifier\n\nnp.random.seed(42)\nn = 5000\nX = np.random.randn(n, 6)\ny = (np.random.random(n) < 0.05).astype(int)  # 5%攻击\n\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, stratify=y)\nprint(f'Train: {len(X_train)} (atk={y_train.mean():.1%}) | Test: {len(X_test)} (atk={y_test.mean():.1%})')\n\npipeline = Pipeline([('scaler', StandardScaler()), ('clf', RandomForestClassifier(n_estimators=100))])\npipeline.fit(X_train, y_train)\nprint(f'Baseline accuracy: {pipeline.score(X_test, y_test):.2%}')","explanation":"sklearn Pipeline从数据划分到模型训练的完整流程"}],
    [{"name":"sklearn官方教程","url":"https://scikit-learn.org/stable/tutorial/","type":"article"},{"name":"机器学习实战","url":"https://github.com/ageron/handson-ml3","type":"book"},{"name":"吴恩达ML课程","url":"https://www.coursera.org/learn/machine-learning","type":"video"}],
    [{"name":"Scikit-learn","description":"经典ML一站式库","url":"https://scikit-learn.org/","type":"local"},{"name":"imbalanced-learn","description":"不平衡数据处理","url":"https://imbalanced-learn.org/","type":"local"},{"name":"Pandas","description":"数据处理基础","url":"https://pandas.pydata.org/","type":"local"}],
    [{"name":"ML环境搭建","description":"sklearn+imblearn环境","url":"https://scikit-learn.org/","type":"local","setup":"1. pip install scikit-learn imbalanced-learn\n2. 在CIC-IDS上建立Pipeline\n3. 按时间顺序划分数据\n4. 训练基线RF模型\n5. 评估在不平衡数据上的表现","expectedOutput":"完成ML实验环境搭建，跑通第一个分类模型"}],
    [{"author":"李智能","title":"安全ML的第一个陷阱：数据泄漏","content":"常见泄漏：1)对非独立样本随机划分 2)先标准化再划分 3)用未来特征预测过去。原则：测试集在训练时完全不可见。"},
     {"author":"王算法","title":"别只看准确率","content":"在不平衡数据上99%准确率可能毫无意义！安全ML必须关注：检出率(Recall)、精确率(Precision)、F1、ROC-AUC、误报率。"},
     {"author":"张模型","title":"先跑基线再优化","content":"永远先跑一个简单基线(如逻辑回归)，看看能达到什么水平。如果简单模型已经很好了，复杂模型就过度工程化了。"}]
))

# Day 9
week2_days.append(make_day('ai-9', 9, '逻辑回归与SVM分类', 'Logistic Regression & SVM',
    ['理解逻辑回归原理', '掌握SVM核技巧', '学习模型评估指标'],
    '逻辑回归和SVM是经典且实用的分类算法。\n\n逻辑回归：Sigmoid函数将输出映射到(0,1)，可解释为该样本是攻击的概率。优点：快、可解释、直接输出概率。\n\nSVM：寻找最大化分类间隔的超平面。RBF核将低维映射到高维空间。适合高维安全特征。\n\n评估指标：Accuracy、Precision、Recall、F1-Score、ROC-AUC。安全场景中Recall(检出率)通常比Precision更重要。\n\n安全场景选择：LR适合实时检测（快+概率输出），SVM适合离线批处理（精度高+高维友好）。',
    ['逻辑回归输出可解释概率', 'SVM通过核函数处理非线性', '安全场景Recall优先于Precision', 'RBF核是最常用的SVM核', 'ROC-AUC评估整体区分能力'],
    [
        {"question":"逻辑回归中Sigmoid函数的作用是什么？","options":["A. 加速计算","B. 将任意实数映射到(0,1)概率","C. 减少内存","D. 选择特征"],"correctIndex":1,"explanation":"Sigmoid σ(z)=1/(1+e^{-z})将线性输出压缩到0-1，输出可解释为概率。"},
        {"question":"在入侵检测中为什么Recall通常比Precision更重要？","options":["A. 检出攻击比误报一次更关键","B. 计算更简单","C. 没有原因","D. 节省资源"],"correctIndex":0,"explanation":"漏掉真实攻击(低Recall)的后果比多误报(低Precision)严重得多。安全场景优先保证检出率。"},
        {"question":"F1-Score=0.9意味着什么？","options":["A. 准确率90%","B. Precision和Recall都较高且平衡好","C. 90%特征被使用","D. 训练90%完成"],"correctIndex":1,"explanation":"F1是P和R的调和平均，0.9说明两者都在较高水平且平衡。"},
        {"question":"逻辑回归相比SVM在安全检测中的关键优势？","options":["A. 更准确","B. 直接输出概率分数(风险评分)","C. 更少参数","D. 自动特征选择"],"correctIndex":1,"explanation":"逻辑回归直接输出0-1概率，天然适合作为风险评分使用(如'85%可能是SQL注入')。"},
        {"question":"SVM的RBF核参数gamma越大，会导致什么？","options":["A. 决策边界更平滑","B. 决策边界更复杂(可能过拟合)","C. 训练更快","D. 准确率一定更高"],"correctIndex":1,"explanation":"gamma越大单个样本影响范围越小，决策边界更复杂，容易过拟合。"}
    ],
    [{"title":"LR vs SVM 安全分类对比","language":"python","code":"import numpy as np\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.svm import SVC\nfrom sklearn.metrics import classification_report, roc_auc_score\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.preprocessing import StandardScaler\n\nnp.random.seed(42)\nX = np.random.randn(2000, 10)\nX[:,0] += (np.random.random(2000)<0.1)*3; X[:,1] += (np.random.random(2000)<0.1)*2\ny = (np.abs(X[:,0]+X[:,1])>2).astype(int)\n\nX_train, X_test, y_train, y_test = train_test_split(X,y,test_size=0.3)\nscaler = StandardScaler()\nX_train_s = scaler.fit_transform(X_train); X_test_s = scaler.transform(X_test)\n\nfor name, model in [('LR',LogisticRegression(max_iter=1000)),('SVM-RBF',SVC(kernel='rbf',probability=True))]:\n    model.fit(X_train_s, y_train)\n    auc = roc_auc_score(y_test, model.predict_proba(X_test_s)[:,1])\n    print(f'{name}: AUC={auc:.3f}')","explanation":"逻辑回归和SVM在安全分类任务上的完整对比"}],
    [{"name":"SVM原理可视化","url":"https://scikit-learn.org/stable/auto_examples/svm/","type":"article"},{"name":"分类评估指标大全","url":"https://scikit-learn.org/stable/modules/model_evaluation.html","type":"article"},{"name":"安全ML评估实践","url":"https://www.freebuf.com/articles/es/301234.html","type":"article"}],
    [{"name":"Scikit-learn","description":"LR/SVM实现","url":"https://scikit-learn.org/","type":"local"},{"name":"Yellowbrick","description":"ML可视化诊断","url":"https://www.scikit-yb.org/","type":"local"},{"name":"Optuna","description":"超参自动优化","url":"https://optuna.org/","type":"local"}],
    [{"name":"分类模型实战","description":"LR/SVM在入侵检测上的对比","url":"https://www.kaggle.com/","type":"local","setup":"1. 加载CIC-IDS子集\n2. 实现LR/SVM/RBF-SVM\n3. 计算Precision/Recall/F1/AUC\n4. 绘制ROC曲线对比\n5. 分析误报/漏报根因","expectedOutput":"三种分类模型在IDS上的详细性能对比报告"}],
    [{"author":"李智能","title":"安全检测中的阈值移动","content":"逻辑回归输出概率后默认用0.5做阈值。安全场景中：追求低漏报→降阈值(0.3)；追求低误报→升阈值(0.7)。"},
     {"author":"王算法","title":"SVM在安全中的定位","content":"SVM在小样本高维场景表现优异，适合恶意软件检测。但数据量增大时训练时间急剧增长，大数据场景用GBDT。"},
     {"author":"张模型","title":"安全中'准确率'的欺骗性","content":"99.5%流量正常时一个永远预测'正常'的模型就有99.5%准确率！这就是为什么必须看Recall和F1。"}]
))

# Day 10
week2_days.append(make_day('ai-10', 10, '决策树与随机森林', 'Decision Tree & Random Forest',
    ['理解决策树分裂原理', '掌握随机森林Bagging', '学习特征重要性分析'],
    '树模型是安全领域应用最广的ML算法之一。\n\n决策树：通过递归分裂特征空间来分类。分裂标准：信息增益(ID3)或基尼系数(CART)。优点：完全可解释。缺点：容易过拟合。\n\n随机森林：Bagging(自助采样)+随机特征选择构建多棵决策树投票。OOB(Out-Of-Bag)可用作免费验证集。\n\n特征重要性：随机森林天然输出每个特征对分类的贡献度。\n\n超参数：n_estimators(100-500)、max_depth(5-15防过拟合)、min_samples_split(节点分裂最小样本数)。',
    ['决策树完全可解释', '信息增益/基尼系数是分裂标准', '随机森林Bagging减少方差', 'OOB误差=免费验证集', '特征重要性帮你理解模型'],
    [
        {"question":"随机森林中Bagging的作用是什么？","options":["A. 加速训练","B. 通过集成降低方差、提高泛化","C. 减少内存","D. 自动特征选择"],"correctIndex":1,"explanation":"Bagging通过训练多个不同模型并投票/平均，降低模型方差，提高泛化能力。"},
        {"question":"随机森林中OOB样本的作用是什么？","options":["A. 测试集","B. 免费的无偏验证集","C. 训练数据","D. 特征选择"],"correctIndex":1,"explanation":"每棵树只用约63%数据(Bootstrap)，剩余37%的OOB可用作免费验证。"},
        {"question":"决策树max_depth限制为5的作用？","options":["A. 加速训练","B. 防止过拟合","C. 增加复杂度","D. 减少特征"],"correctIndex":1,"explanation":"限制树最大深度是剪枝方式，防止树长太深记住噪声(过拟合)。"},
        {"question":"入侵检测中如果'源端口'特征重要性排名第一说明什么？","options":["A. 模型有问题","B. 攻击使用了特定端口","C. 特征工程失误","D. 数据错误"],"correctIndex":1,"explanation":"某些攻击确实偏好特定端口(如SSH爆破=22)，特征重要性验证模型学到了合理模式。"},
        {"question":"n_estimators=1时随机森林会怎样？","options":["A. 退化为单棵决策树","B. 更快更好","C. 自动选择最优","D. 报错"],"correctIndex":0,"explanation":"n_estimators=1意味着只有一棵树，失去集成学习的方差降低优势。"}
    ],
    [{"title":"随机森林入侵检测","language":"python","code":"import numpy as np\nimport pandas as pd\nfrom sklearn.ensemble import RandomForestClassifier\nfrom sklearn.model_selection import train_test_split\n\nnp.random.seed(42)\nn = 5000\nX = pd.DataFrame({\n    'duration': np.random.exponential(10,n), 'src_bytes': np.random.exponential(500,n),\n    'num_packets': np.random.poisson(20,n), 'syn_flag': np.random.binomial(1,0.3,n),\n    'dst_port': np.random.choice([22,80,443,8080], n),\n})\ny = ((X['syn_flag']==1)&(X['num_packets']>30)).astype(int)\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3)\nrf = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42, oob_score=True)\nrf.fit(X_train, y_train)\nimportance = pd.DataFrame({'f':X.columns,'imp':rf.feature_importances_}).sort_values('imp',ascending=False)\nprint(f'OOB: {rf.oob_score_:.3f} | Test: {rf.score(X_test, y_test):.3f}')\nfor _,r in importance.iterrows():\n    print(f'  {r[\"f\"]}: {r[\"imp\"]:.4f}')","explanation":"随机森林在IDS数据上的训练、评估和特征重要性分析"}],
    [{"name":"决策树可视化","url":"https://scikit-learn.org/stable/modules/tree.html","type":"article"},{"name":"随机森林原论文","url":"https://link.springer.com/article/10.1023/A:1010933404324","type":"article"},{"name":"特征重要性解释","url":"https://scikit-learn.org/stable/auto_examples/ensemble/plot_forest_importances.html","type":"article"}],
    [{"name":"Scikit-learn","description":"树模型实现","url":"https://scikit-learn.org/","type":"local"},{"name":"dtreeviz","description":"决策树可视化","url":"https://github.com/parrt/dtreeviz","type":"local"},{"name":"Graphviz","description":"树结构绘图","url":"https://graphviz.org/","type":"local"}],
    [{"name":"随机森林IDS实验","description":"RF在CIC-IDS上的多分类","url":"https://www.kaggle.com/","type":"local","setup":"1. 加载CIC-IDS数据集\n2. RF多分类\n3. 分析特征重要性TOP10\n4. 调优n_estimators/max_depth\n5. 输出混淆矩阵","expectedOutput":"RF模型分类报告+特征重要性可视化"}],
    [{"author":"李智能","title":"树模型为什么会过拟合","content":"解决：1)限制max_depth(3-10) 2)min_samples_split(20-50) 3)min_samples_leaf。RF通过Bagging天然抗过拟合。"},
     {"author":"王算法","title":"特征重要性不能全信","content":"RF特征重要性对高基数类别特征(如IP)会产生偏向。建议用Permutation Importance做校准，打乱每个特征看性能下降。"},
     {"author":"张模型","title":"安全场景RF参数建议","content":"推荐：n_estimators=200+、max_depth=10-15、class_weight='balanced'(自动处理不平衡)、oob_score=True(监控泛化)。"}]
))

print(f"Generated {sum(len(w) for w in WEEKS)} days so far...")
# Continue will be in part 2
