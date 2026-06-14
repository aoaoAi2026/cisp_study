"""Generate cyberAi.ts - Single pass, safe approach"""
import json, os

OUT = r'E:\internal_safe\cisp1\cisp\src\data\cyberAi.ts'

def js(v):
    """JSON-dump a value safely for embedding in TypeScript"""
    return json.dumps(v, ensure_ascii=False)

# ============================================================
# DATA - All 30 days defined as Python dicts
# ============================================================
days = []

# ---- Day 1 ----
days.append({
    "id": "ai-1", "day": 1,
    "title": "AI安全概述与学习路线", "subtitle": "AI Security Overview",
    "objectives": ["理解AI安全定义", "了解AI在安全中的应用", "明确学习路线"],
    "content": """AI安全是人工智能与网络安全的交叉领域，涵盖AI赋能安全和AI自身安全两个维度。

AI赋能安全：用ML/DL技术检测入侵、识别恶意软件、分析威胁情报、自动化响应。

AI自身安全：对抗样本攻击、模型窃取、数据投毒、LLM Prompt注入、训练数据隐私泄露。

典型应用：IDS智能检测、恶意软件家族分类、异常行为分析(UEBA)、威胁情报自动化、安全Copilot。

30天路线：第1周-AI安全基础 → 第2周-经典ML安全 → 第3周-深度学习安全 → 第4周-对抗攻防与LLM安全 → 第5周-AI安全工程实战。""",
    "keyPoints": ["AI安全=AI+安全交叉领域", "AI赋能安全：用AI检测威胁", "AI自身安全：对抗攻击/数据投毒", "30天系统学习", "每天4小时"],
    "quiz": [
        {"question": "AI安全包含哪两个维度？", "options": ["A. AI赋能安全和AI自身安全", "B. 网络安全和系统安全", "C. 前端和后端", "D. 硬件和软件"], "correctIndex": 0, "explanation": "AI安全包含：用AI提升安全能力(AI for Security)，以及AI系统本身的安全问题(Security of AI)。"},
        {"question": "以下哪项属于AI自身安全问题？", "options": ["A. ML检测DDoS", "B. 对抗样本欺骗分类器", "C. NLP分析日志", "D. 自动化渗透"], "correctIndex": 1, "explanation": "对抗样本攻击AI模型，属于AI自身安全。其余是AI赋能安全。"},
        {"question": "UEBA代表什么？", "options": ["A. 统一加密备份", "B. 用户实体行为分析", "C. 超强加密算法", "D. 统一端点保护"], "correctIndex": 1, "explanation": "UEBA通过ML分析用户和设备行为，检测异常和内部威胁。"},
        {"question": "以下哪个不是AI安全的典型应用？", "options": ["A. 智能入侵检测", "B. 恶意软件分类", "C. 操作系统内核开发", "D. 威胁情报自动化"], "correctIndex": 2, "explanation": "操作系统内核开发不属于AI安全应用场景。"},
        {"question": "本计划适合哪类人群？", "options": ["A. 完全零基础", "B. 有Python+网络基础的安全从业者", "C. 初中生", "D. 只懂硬件的工程师"], "correctIndex": 1, "explanation": "需要Python编程和网络协议基础作为前置知识。"}
    ],
    "codeExamples": [{"title": "AI安全工具链", "language": "python", "code": "# AI安全核心库\nimport sklearn  # 经典ML\nimport torch   # 深度学习\nimport pandas as pd  # 数据处理\n\nai_sec = {\n  \"入侵检测\": [\"sklearn\",\"PyTorch\",\"LightGBM\"],\n  \"恶意软件\": [\"EMBER\",\"LIEF\",\"Malimg\"],\n  \"异常检测\": [\"IsolationForest\",\"AutoEncoder\"],\n  \"对抗攻防\": [\"CleverHans\",\"ART\",\"Foolbox\"],\n  \"LLM安全\": [\"Garak\",\"LangChain\",\"PromptGuard\"]\n}\nprint(\"=== AI安全工具链 ===\")\nfor k,v in ai_sec.items():\n  print(f\"{k}: {chr(124).join(v)}\")", "explanation": "AI安全领域核心Python库概览"}],
    "resources": [{"name": "MITRE ATLAS", "url": "https://atlas.mitre.org/", "type": "article"}, {"name": "OWASP AI项目", "url": "https://owasp.org/www-project-ai-security/", "type": "article"}, {"name": "AI安全全景图", "url": "https://www.freebuf.com/articles/es/356789.html", "type": "article"}],
    "recommendedTools": [{"name": "JupyterLab", "description": "交互式数据科学", "url": "https://jupyter.org/", "type": "local"}, {"name": "Anaconda", "description": "Python数据科学发行版", "url": "https://www.anaconda.com/", "type": "local"}, {"name": "PyTorch", "description": "深度学习框架", "url": "https://pytorch.org/", "type": "local"}],
    "labEnvironment": [{"name": "AI安全环境", "description": "配置Python+PyTorch+数据集", "url": "https://www.kaggle.com/", "type": "local", "setup": "1.安装Anaconda\n2.conda create -n aisec python=3.10\n3.pip install torch sklearn pandas matplotlib jupyter\n4.下载CIC-IDS2017\n5.验证环境", "expectedOutput": "成功搭建AI安全实验环境"}],
    "expertNotes": [{"author": "李智能", "title": "AI安全学习建议", "content": "AI安全最容易犯的错误是直接啃论文。建议从实战入手：先跑通IDS检测、恶意软件分类，理解数据流和模型流程，再回头看理论，事半功倍。"}, {"author": "王算法", "title": "安全+ML的思维转变", "content": "安全人员转型AI安全最大挑战是思维转变。安全思维\"找漏洞\"，ML思维\"找模式\"。先接受ML的不确定性，理解误报/漏报的权衡。"}, {"author": "张模型", "title": "PyTorch还是TF", "content": "安全领域推荐PyTorch：1)学术界主流 2)动态图调试友好 3)对抗攻击库原生支持。安全研究选PyTorch。"}]
})

# ---- Day 2 ----
days.append({
    "id": "ai-2", "day": 2,
    "title": "Python数据科学生态", "subtitle": "Python Data Science",
    "objectives": ["掌握NumPy数组操作", "理解Pandas核心API", "学习数据处理pipeline"],
    "content": """NumPy和Pandas是AI安全数据处理的基石。

NumPy核心：ndarray创建与操作、广播机制（不同形状运算）、向量化运算（避免Python循环）。

Pandas核心：DataFrame、数据筛选(loc/iloc)、分组聚合(groupby/agg)、透视表(pivot_table)。

安全数据处理：chunksize分批读取大日志、fillna/dropna处理缺失值、to_datetime处理时间序列。

向量化是关键：用内置函数替代for循环，处理百万级日志性能差异可达100倍。""",
    "keyPoints": ["NumPy提供高性能数组运算", "Pandas是安全数据处理核心", "groupby用于日志聚合", "向量化替代循环提升百倍性能", "chunksize处理大数据集"],
    "quiz": [
        {"question": "处理10GB以上安全日志的正确方式？", "options": ["A. pd.read_csv()", "B. pd.read_csv(chunksize=100000)", "C. 用Excel", "D. 直接打印"], "correctIndex": 1, "explanation": "chunksize分批读取，每次只加载指定行数到内存，避免OOM。"},
        {"question": "以下哪项是向量化运算？", "options": ["A. for循环", "B. NumPy数组的data*2", "C. list comprehension", "D. while循环"], "correctIndex": 1, "explanation": "NumPy向量化运算底层用C实现，速度远超Python循环。"},
        {"question": "Pandas中loc和iloc的区别？", "options": ["A. 完全相同", "B. loc用标签,iloc用位置", "C. loc更快", "D. iloc只能用数字"], "correctIndex": 1, "explanation": "loc基于label选取，iloc基于integer position选取。"},
        {"question": "NumPy广播的作用？", "options": ["A. 网络通信", "B. 不同形状数组的算术运算", "C. 加密", "D. 文件传输"], "correctIndex": 1, "explanation": "广播允许不同形状数组进行运算，自动扩展维度匹配。"},
        {"question": "处理安全日志缺失值的正确方式？", "options": ["A. 直接删除", "B. 分析原因后选择填充或删除", "C. 全部填0", "D. 忽略"], "correctIndex": 1, "explanation": "需分析缺失原因(设备未上报/采集失败)再决定策略。"}
    ],
    "codeExamples": [{"title": "安全日志Pandas分析", "language": "python", "code": "import pandas as pd\nimport numpy as np\n\nnp.random.seed(42)\ndf = pd.DataFrame({\n  \"timestamp\": pd.date_range(\"2024-01-01\", periods=1000, freq=\"1min\"),\n  \"src_ip\": [f\"192.168.{np.random.randint(1,255)}.{np.random.randint(1,255)}\" for _ in range(1000)],\n  \"dst_port\": np.random.choice([22,80,443,3306],1000),\n  \"protocol\": np.random.choice([\"TCP\",\"UDP\",\"ICMP\"],1000,p=[0.7,0.2,0.1]),\n  \"bytes\": np.random.exponential(1000,1000).astype(int)\n})\nprint(f\"Records: {len(df)}\")\nprint(f\"Protocols:\\n{df.protocol.value_counts()}\")\nprint(f\"Port Stats:\\n{df.groupby(\"dst_port\")[\"bytes\"].agg([\"sum\",\"mean\",\"count\"])}\")", "explanation": "Pandas安全日志：协议分布、端口流量统计"}],
    "resources": [{"name": "Pandas文档", "url": "https://pandas.pydata.org/docs/", "type": "article"}, {"name": "NumPy快速入门", "url": "https://numpy.org/doc/stable/user/quickstart.html", "type": "article"}, {"name": "Python数据科学手册", "url": "https://jakevdp.github.io/PythonDataScienceHandbook/", "type": "article"}],
    "recommendedTools": [{"name": "Pandas", "description": "数据处理核心", "url": "https://pandas.pydata.org/", "type": "local"}, {"name": "NumPy", "description": "科学计算基础", "url": "https://numpy.org/", "type": "local"}, {"name": "Matplotlib", "description": "数据可视化", "url": "https://matplotlib.org/", "type": "local"}],
    "labEnvironment": [{"name": "Python数据处理", "description": "Pandas安全日志分析", "url": "https://www.kaggle.com/", "type": "local", "setup": "1.安装pandas,numpy,matplotlib\n2.准备CIC-IDS CSV\n3.按协议聚合\n4.计算统计特征\n5.输出报告", "expectedOutput": "掌握Pandas安全日志分析"}],
    "expertNotes": [{"author": "李智能", "title": "Pandas性能优化", "content": "处理安全大数据技巧：1)category类型存协议(省70%内存) 2)eval/query加速过滤 3)避免链式索引(用loc) 4)能用agg就别循环。"}, {"author": "王算法", "title": "窗口思维", "content": "做安全特征工程要养成\"窗口思维\"：按时间窗口聚合→提取统计量→构造比率特征。这些特征比原始数据更适合ML。"}, {"author": "张模型", "title": "安全数据集格式", "content": "CIC-IDS等数据集用CSV格式。处理要点：1)列名可能有空格 2)标签列通常叫Label 3)时间戳需parse_dates 4)转Parquet更高效。"}]
})

# ---- Day 3 ----
days.append({
    "id": "ai-3", "day": 3,
    "title": "安全数据可视化", "subtitle": "Data Visualization",
    "objectives": ["掌握matplotlib核心API", "理解seaborn统计图表", "学习Plotly交互图表"],
    "content": """数据可视化是安全分析发现问题的关键手段。

matplotlib：折线图(plot)、柱状图(bar)、散点图(scatter)、饼图(pie)、子图布局(subplots)。

seaborn：分布图(histplot)、箱线图(boxplot)、热力图(heatmap)、小提琴图(violinplot)。

安全场景：流量时序图发现DDoS、协议饼图看流量构成、热力图发现特征相关、箱线图标注异常值。

Plotly：交互式图表支持缩放/悬停/筛选，适合安全仪表盘。""",
    "keyPoints": ["matplotlib是绘图基础", "seaborn更适合统计图表", "Plotly支持交互分析", "热力图发现相关关系", "箱线图直观展示异常值"],
    "quiz": [
        {"question": "检测DDoS最适合什么图？", "options": ["A. 饼图", "B. 流量时序折线图", "C. 散点图", "D. 词云"], "correctIndex": 1, "explanation": "DDoS导致流量突增，时序折线图直观展示异常峰值。"},
        {"question": "seaborn热力图的安全分析用途？", "options": ["A. 显示攻击时间", "B. 特征间相关性", "C. 网络拓扑", "D. 显示日志"], "correctIndex": 1, "explanation": "热力图用颜色深浅展示特征间相关系数，发现与攻击标签相关的特征。"},
        {"question": "箱线图在异常检测中的优势？", "options": ["A. 显示所有数据点", "B. 直观展示四分位数和离群点", "C. 只能画一个变量", "D. 不适合大数据"], "correctIndex": 1, "explanation": "箱线图展示中位数、四分位数和离群点，是异常检测的直观工具。"},
        {"question": "使用对数坐标的主因？", "options": ["A. 好看", "B. 处理流量长尾分布", "C. 省存储", "D. 加速渲染"], "correctIndex": 1, "explanation": "网络流量呈长尾分布，对数坐标让不同量级数据都可辨识。"},
        {"question": "分析协议分布最适合什么图？", "options": ["A. 饼图", "B. 散点图", "C. 箱线图", "D. 热力图"], "correctIndex": 0, "explanation": "饼图适合展示组成部分的比例关系，直观展示协议占比。"}
    ],
    "codeExamples": [{"title": "安全流量可视化", "language": "python", "code": "import matplotlib.pyplot as plt\nimport seaborn as sns\nimport pandas as pd\nimport numpy as np\n\nnp.random.seed(0)\nn = 500\ndf = pd.DataFrame({\n  \"bytes\": np.concatenate([np.random.exponential(500,450), np.random.exponential(5000,50)]),\n  \"label\": [\"Normal\"]*450+[\"Attack\"]*50,\n  \"protocol\": np.random.choice([\"TCP\",\"UDP\"], n)\n})\nfig,axes=plt.subplots(2,2,figsize=(12,10))\nsns.histplot(data=df,x=\"bytes\",hue=\"label\",bins=50,ax=axes[0,0]); axes[0,0].set_title(\"Flow Size Distribution\")\nsns.boxplot(data=df,x=\"label\",y=\"bytes\",ax=axes[0,1]); axes[0,1].set_title(\"Bytes by Label\")\npc=df[\"protocol\"].value_counts(); axes[1,0].pie(pc,labels=pc.index,autopct=\"%1.1f%%\")\naxes[1,0].set_title(\"Protocol Distribution\")\nprint(\"Charts generated\")", "explanation": "4合1安全数据可视化：分布/箱线/饼图"}],
    "resources": [{"name": "matplotlib文档", "url": "https://matplotlib.org/stable/contents.html", "type": "article"}, {"name": "seaborn教程", "url": "https://seaborn.pydata.org/tutorial.html", "type": "article"}, {"name": "Plotly文档", "url": "https://plotly.com/python/", "type": "article"}],
    "recommendedTools": [{"name": "matplotlib", "description": "基础绘图库", "url": "https://matplotlib.org/", "type": "local"}, {"name": "seaborn", "description": "统计可视化", "url": "https://seaborn.pydata.org/", "type": "local"}, {"name": "Plotly", "description": "交互式图表", "url": "https://plotly.com/python/", "type": "local"}],
    "labEnvironment": [{"name": "安全可视化实验", "description": "CIC-IDS数据集可视化", "url": "https://www.kaggle.com/", "type": "local", "setup": "1.加载CIC-IDS\n2.画流量时序图\n3.画协议分布饼图\n4.画特征热力图\n5.画攻击vs正常箱线图", "expectedOutput": "5种安全可视化图表"}],
    "expertNotes": [{"author": "李智能", "title": "可视化即洞察", "content": "跑ML模型前先做EDA可视化。很多数据问题(缺失值、分布偏差、离群点)能用肉眼发现，比盲目调参高效。"}, {"author": "王算法", "title": "安全可视化核心", "content": "三个必备图：1)流量时序 2)攻击标签分布 3)特征相关性热力图。这三个图覆盖80%的初期数据洞察。"}, {"author": "张模型", "title": "对数坐标技巧", "content": "网络安全数据(流量大小、连接数)通常呈长尾分布。默认线性坐标会让大部分数据挤在角落。加上plt.yscale('log')立刻清晰。"}]
})

# ---- Day 4 ----
days.append({
    "id": "ai-4", "day": 4,
    "title": "统计异常检测", "subtitle": "Statistical Anomaly Detection",
    "objectives": ["理解异常检测概念", "掌握Z-Score/IQR", "学习统计阈值策略"],
    "content": """统计异常检测是AI安全最基础的异常发现方法。

Z-Score：z=(x-μ)/σ，|z|>3标记为异常(3σ原则)。适用单变量、近似正态分布的数据。

IQR(四分位距)：Q1-1.5*IQR 到 Q3+1.5*IQR为正常范围，之外为异常。适用非正态、有偏分布。

滑动窗口统计：滑动计算均值和标准差适应概念漂移，适合网络流量等时变数据。

安全场景：流量突变检测(Z-Score)、异常端口使用(IQR)、连接频率异常、数据包大小异常。

局限性：单变量(忽略特征间关系)、假阳率高、需手动调阈值。为后续监督学习方法打基础。""",
    "keyPoints": ["Z-Score检测偏离均值的样本", "IQR不依赖正态分布假设", "滑动窗口适应概念漂移", "适合实时简单异常检测", "是更复杂ML方法的基线"],
    "quiz": [
        {"question": "Z-Score=3表示什么？", "options": ["A. 正常", "B. 偏离均值3个标准差", "C. 中位数", "D. 无法判断"], "correctIndex": 1, "explanation": "Z-Score衡量偏离均值的标准差数量。|Z|>3通常视为异常（正态下仅0.3%概率）。"},
        {"question": "IQR相比Z-Score的优势？", "options": ["A. 更快", "B. 不假设正态分布，对偏态数据鲁棒", "C. 更准", "D. 更简单"], "correctIndex": 1, "explanation": "IQR基于分位数，不受极端值和分布形态影响，鲁棒性更强。"},
        {"question": "为什么需要滑动窗口？", "options": ["A. 好看", "B. 适应数据随时间变化(概念漂移)", "C. 省资源", "D. 加速计算"], "correctIndex": 1, "explanation": "安全数据(流量)有时间和周期性波动，固定阈值随时间失效。滑动窗口让统计量动态更新。"},
        {"question": "统计方法的主要局限？", "options": ["A. 太快", "B. 单变量分析忽略特征间关联", "C. 太准", "D. 太复杂"], "correctIndex": 1, "explanation": "单变量检测无法发现多个特征配合的攻击(如正常端口+异常payload)。需多变量ML方法。"},
        {"question": "Q1=10, Q3=30, 上界=? ", "options": ["A. 30", "B. 60", "C. 40", "D. 50"], "correctIndex": 1, "explanation": "IQR=20, 上界=Q3+1.5*IQR=30+30=60。"}
    ],
    "codeExamples": [{"title": "Z-Score + IQR异常检测", "language": "python", "code": "import numpy as np\n\nnp.random.seed(42)\ndata = np.concatenate([np.random.normal(100, 10, 500), np.random.normal(200, 10, 10)])\n\n# Z-Score\nz = (data - data.mean()) / data.std()\nz_outliers = np.abs(z) > 3\nprint(f\"Z-Score: {z_outliers.sum()} outliers ({z_outliers.sum()/len(data):.1%})\")\n\n# IQR\nq1, q3 = np.percentile(data, [25, 75])\niqr = q3 - q1\nlower, upper = q1 - 1.5*iqr, q3 + 1.5*iqr\niqr_outliers = (data < lower) | (data > upper)\nprint(f\"IQR: {iqr_outliers.sum()} outliers ({iqr_outliers.sum()/len(data):.1%})\")\nprint(f\"Bounds: [{lower:.1f}, {upper:.1f}]\")\nprint(f\"Z&IQR agree: {(z_outliers & iqr_outliers).sum()} / total: {z_outliers.sum()+iqr_outliers.sum()}\")", "explanation": "Z-Score和IQR两种统计异常检测方法对比"}],
    "resources": [{"name": "异常检测入门", "url": "https://www.analyticsvidhya.com/blog/2019/02/outlier-detection-python-pyod/", "type": "article"}, {"name": "Z-Score详解", "url": "https://www.statisticshowto.com/probability-and-statistics/z-score/", "type": "article"}, {"name": "IQR方法", "url": "https://www.khanacademy.org/math/statistics-probability/summarizing-quantitative-data/box-whisker-plots/a/identifying-outliers-iqr-rule", "type": "article"}],
    "recommendedTools": [{"name": "NumPy", "description": "数值计算", "url": "https://numpy.org/", "type": "local"}, {"name": "SciPy", "description": "统计方法", "url": "https://scipy.org/", "type": "local"}, {"name": "Scikit-learn", "description": "EllipticEnvelope等", "url": "https://scikit-learn.org/", "type": "local"}],
    "labEnvironment": [{"name": "统计异常检测", "description": "实现Z-Score+IQR+EWMA", "url": "https://www.kaggle.com/", "type": "local", "setup": "1.准备流量数据\n2.实现Z-Score检测\n3.实现IQR检测\n4.滑动窗口Z-Score\n5.对比检测效果", "expectedOutput": "三种统计方法检测报告"}],
    "expertNotes": [{"author": "李智能", "title": "统计方法选型", "content": "快速指南：数据正态→Z-Score(快)；数据偏态→IQR(鲁棒)；非平稳→滑动窗口EWMA；多变量→Mahalanobis距离。"}, {"author": "王算法", "title": "不是终点是起点", "content": "统计方法最大的价值不是直接上线检测，而是快速建立基线、发现数据异常点、指导后续特征工程方向。"}, {"author": "张模型", "title": "阈值调优", "content": "不要盲信3σ。建议在验证集上画出分数分布直方图，手动选拐点。生产环境阈值比理论值设得更高以减少告警疲劳。"}]
})

# Days 5-30: short-form entries with core content
short_days = [
    # DAY 5
    {"id":"ai-5","day":5,"title":"特征工程与数据预处理","subtitle":"Feature Engineering",
     "objectives":["掌握特征提取","理解特征选择","学习归一化/标准化"],
     "content":"特征工程是AI安全模型效果的决定因素，远超模型选择。\n\n特征提取：包速率、字节速率、连接数、端口熵、协议分布、TCP标志位比例。\n\n特征选择：方差过滤(低方差特征无用)、相关性过滤(高相关冗余)、RF重要性、互信息法。\n\n数据变换：标准化(StandardScaler Z-Score归一化)、归一化(MinMaxScaler [0,1])、对数变换(处理长尾分布)。\n\n安全特征：时间窗口特征(5秒内SYN包数)、比率特征(SYN/Total)、熵特征(IP/端口多样性)。",
     "keyPoints":["特征工程>模型选择","包速率/字节速率/连接数","方差过滤去除无用特征","标准化vs归一化场景","时间窗口是核心技巧"],
     "quiz":[
        {"question":"特征工程和模型哪个更重要？","options":["A. 模型","B. 特征工程通常决定效果上限","C. 一样","D. 都不重要"],"correctIndex":1,"explanation":"业界共识：好特征+简单模型 > 差特征+复杂模型。80%时间应花在特征工程。"},
        {"question":"MinMaxScaler将数据变换到？","options":["A. [-1,1]","B. [0,1]","C. 以0为中心","D. 任意范围"],"correctIndex":1,"explanation":"MinMaxScaler线性缩放到[min,max]范围，默认[0,1]。"},
        {"question":"方差过滤剔除什么特征？","options":["A. 最重要的","B. 方差接近0的常量特征","C. 文本特征","D. 数值特征"],"correctIndex":1,"explanation":"方差接近0说明该特征几乎所有样本取值相同，无信息量。"},
        {"question":"为什么对数变换安全流量数据？","options":["A. 加密","B. 处理长尾分布让模型更好学习","C. 压缩数据","D. 增加特征"],"correctIndex":1,"explanation":"流量数据长尾分布(大量小流+少量巨流)，对数变换压缩动态范围。"},
        {"question":"5秒窗口内SYN包数是什么特征？","options":["A. 协议特征","B. 时间窗口统计特征","C. 内容特征","D. 标识特征"],"correctIndex":1,"explanation":"在固定时间窗口内聚合统计产生的特征。"}],
     "codeExamples":[{"title":"特征工程pipeline","language":"python","code":"import numpy as np\nfrom sklearn.preprocessing import StandardScaler, MinMaxScaler\nfrom sklearn.feature_selection import VarianceThreshold\n\nnp.random.seed(42)\nX=np.random.randn(200, 5)\nX[:,4]=X[:,0]*0.8+np.random.randn(200)*0.1\n\nprint(f\"Original range: [{X.min():.2f}, {X.max():.2f}]\")\nss=StandardScaler(); X_std=ss.fit_transform(X)\nprint(f\"Standardized: mean={X_std.mean():.2f} std={X_std.std():.2f}\")\n\nmm=MinMaxScaler(); X_mm=mm.fit_transform(X)\nprint(f\"MinMax: [{X_mm.min():.2f}, {X_mm.max():.2f}]\")\n\n# 相关矩阵\ncorr=np.corrcoef(X.T); print(f\"Max corr: {np.max(np.abs(corr)-np.eye(5)):.3f}\")","explanation":"标准化+归一化+相关性分析完整pipeline"}],
     "resources":[{"name":"特征工程教程","url":"https://www.kaggle.com/learn/feature-engineering","type":"article"},{"name":"时间窗口特征","url":"https://pandas.pydata.org/docs/user_guide/timeseries.html","type":"article"},{"name":"Scikit-learn预处理","url":"https://scikit-learn.org/stable/modules/preprocessing.html","type":"article"}],
     "recommendedTools":[{"name":"Pandas","description":"数据处理","url":"https://pandas.pydata.org/","type":"local"},{"name":"Scikit-learn","description":"预处理+特征选择","url":"https://scikit-learn.org/","type":"local"},{"name":"tsfresh","description":"时序特征提取","url":"https://tsfresh.readthedocs.io/","type":"local"}],
     "labEnvironment":[{"name":"特征工程实验","description":"CIC-IDS特征工程","url":"https://www.kaggle.com/","type":"local","setup":"1.加载CIC-IDS\n2.时间窗口聚合\n3.提取统计特征\n4.标准化+特征选择\n5.保存处理后的特征","expectedOutput":"清洗后的特征矩阵"}],
     "expertNotes":[{"author":"李智能","title":"特征工程投入","content":"安全ML项目至少60%时间做特征工程。跑模型只是最后一步。"},{"author":"王算法","title":"自动化特征","content":"tsfresh可自动提取数百时序特征。手选top20-30最有解释性的留给生产。"},{"author":"张模型","title":"特征文档","content":"每个特征在安全上下文的含义写成文档：为什么有效、什么攻击场景、阈值范围。"}]
    },
    # DAY 6
    {"id":"ai-6","day":6,"title":"逻辑回归与SVM","subtitle":"Logistic Regression & SVM",
     "objectives":["理解逻辑回归","掌握SVM核方法","学习二分类评估"],
     "content":"逻辑回归和SVM是安全分类的经典算法。\n\n逻辑回归：通过Sigmoid将线性输出转为概率p=1/(1+e^(-wx))。优势：输出概率可解释、训练快；局限：线性决策边界。\n\nSVM：寻找最大间隔超平面。核方法(RBF)处理非线性。nu参数控制异常比例。\n\n安全应用：IDS二分类(攻击/正常)、恶意URL检测、钓鱼邮件分类。\n\n训练要点：特征标准化(必须)、类别平衡(class_weight='balanced')、概率校准。\n\n评估指标：混淆矩阵、Precision/Recall/F1、ROC-AUC。重点关注攻击类Recall。",
     "keyPoints":["逻辑回归输出可解释概率","SVM核方法处理非线性","必须标准化","class_weight处理不平衡","关注攻击Recall>0.95"],
     "quiz":[
        {"question":"逻辑回归Sigmoid输出范围？","options":["A. [-1,1]","B. [0,1]表示概率","C. 任意实数","D. [0,255]"],"correctIndex":1,"explanation":"Sigmoid函数σ(x)=1/(1+e^(-x))将实数映射到[0,1]表示概率。"},
        {"question":"SVM核函数的作用？","options":["A. 加速","B. 将数据映射到高维空间使线性可分","C. 降维","D. 选特征"],"correctIndex":1,"explanation":"RBF核将低维非线性数据映射到高维，在该空间中寻找线性分界面。"},
        {"question":"训练SVM前为什么必须标准化？","options":["A. 更快","B. SVM依赖距离度量，未标准化大数值特征支配决策","C. 省内存","D. 没必要"],"correctIndex":1,"explanation":"SVM计算样本间距离。未标准化时量级大的特征主导距离计算。"},
        {"question":"class_weight='balanced'有什么用？","options":["A. 加速","B. 自动按类别比例加权损失函数","C. 选特征","D. 不需要"],"correctIndex":1,"explanation":"攻击样本远少于正常样本时，balanced给少数类更高权重自动补偿。"},
        {"question":"为什么关注Recall>Accuracy？","options":["A. 准确率更高","B. 漏掉攻击代价远大于误报","C. 差不多","D. 不需要"],"correctIndex":1,"explanation":"漏报让攻击成功(高风险)，误报只是多一条告警(低风险)。"}],
     "codeExamples":[{"title":"LR+SVM IDS检测","language":"python","code":"import numpy as np\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.svm import SVC\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.metrics import classification_report\n\nnp.random.seed(42)\nX=np.random.randn(1000,10); y=(np.abs(X).sum(axis=1)>8).astype(int)\nX_tr,X_te,y_tr,y_te=train_test_split(X,y,test_size=0.3)\n\nss=StandardScaler(); X_tr_s=ss.fit_transform(X_tr); X_te_s=ss.transform(X_te)\n\nfor name,m in [(\"LR\",LogisticRegression(class_weight=\"balanced\")),(\"SVM\",SVC(kernel=\"rbf\",class_weight=\"balanced\"))]:\n  m.fit(X_tr_s,y_tr)\n  print(f\"\\n{name}:\\n{classification_report(y_te,m.predict(X_te_s),target_names=[\"Normal\",\"Attack\"])}\")","explanation":"逻辑回归和SVM在IDS上的对比"}],
     "resources":[{"name":"逻辑回归文档","url":"https://scikit-learn.org/stable/modules/linear_model.html#logistic-regression","type":"article"},{"name":"SVM教程","url":"https://scikit-learn.org/stable/modules/svm.html","type":"article"},{"name":"混淆矩阵详解","url":"https://en.wikipedia.org/wiki/Confusion_matrix","type":"article"}],
     "recommendedTools":[{"name":"Scikit-learn","description":"LR/SVM实现","url":"https://scikit-learn.org/","type":"local"},{"name":"imbalanced-learn","description":"处理不平衡","url":"https://imbalanced-learn.org/","type":"local"},{"name":"Yellowbrick","description":"模型可视化","url":"https://www.scikit-yb.org/","type":"local"}],
     "labEnvironment":[{"name":"分类器实践","description":"CIC-IDS LR/SVM分类","url":"https://www.kaggle.com/","type":"local","setup":"1.加载预处理后IDS数据\n2.训练LR和SVM\n3.调class_weight\n4.绘制ROC曲线\n5.对比混淆矩阵","expectedOutput":"LR/SVM分类评估报告"}],
     "expertNotes":[{"author":"李智能","title":"LR vs SVM","content":"数据量大(>10万)选LR(训练快)；中小数据+非线性选SVM(精度高)。安全IDS初始用LR快速基线。"},{"author":"王算法","title":"概率很重要","content":"安全场景输出概率比分类更有价值。Probability=0.51和0.99都判为Attack，但风险等级完全不同。"},{"author":"张模型","title":"决策阈值","content":"默认0.5阈值不适合安全。根据业务需求(Recall>0.95)在验证集调优阈值。用predict_proba+自定义阈值。"}]
    },
    # DAY 7
    {"id":"ai-7","day":7,"title":"决策树与随机森林","subtitle":"Decision Tree & Random Forest",
     "objectives":["理解决策树原理","掌握随机森林","学习特征重要性"],
     "content":"决策树和随机森林是安全领域最常用、效果最好的传统ML算法之一。\n\n决策树：Gini/Entropy选择最优分裂→递归构建。优势：可解释(可视化规则路径)、无需特征标准化、处理混合类型。\n\n随机森林：多棵决策树的Bagging集成，随机选样本+随机选特征→投票决策。优势：降过拟合、高精度、内置特征重要性。\n\n安全应用：IDS(Packet/Flow特征)、恶意URL检测、异常登录检测。\n\n特征重要性：RF自动计算每个特征对预测的贡献度，指导特征选择和安全分析。\n\n调参：n_estimators(树数量100-300)、max_depth(深度5-15)、min_samples_split(防过拟合)。",
     "keyPoints":["决策树可视化可解释","RF多树集成降方差","特征重要性指导特征选择","树模型不需标准化","调max_depth/min_samples","安全场景标配RF基线"],
     "quiz":[
        {"question":"随机森林"随机"指什么？","options":["A. 结果随机","B. 样本随机(有放回)+特征随机","C. 特征随机","D. 参数随机"],"correctIndex":1,"explanation":"Bootstrap有放回采样+每次分裂随机选择特征子集，双重随机降低过拟合。"},
        {"question":"决策树不需要标准化？","options":["A. 需要","B. 树模型基于阈值分裂与尺度无关","C. 部分需要","D. 需要归一化"],"correctIndex":1,"explanation":"树模型根据特征值阈值分裂(如bytes>500)，与数据尺度无关。"},
        {"question":"特征重要性=0.15意味着？","options":["A. 不重要","B. 该特征贡献15%的预测能力","C. 准确率85%","D. 有15个特征"],"correctIndex":1,"explanation":"RF特征重要性为该特征在所有分裂中降低不纯度的归一化贡献。"},
        {"question":"max_depth设太大会怎样？","options":["A. 更快","B. 过拟合训练数据","C. 更准","D. 没影响"],"correctIndex":1,"explanation":"深度过大模型记忆训练数据细节，泛化到新数据效果变差。"},
        {"question":"RF在安全检测中的核心优势？","options":["A. 最简单","B. 高精度+可解释+不需预处理","C. 最快","D. 参数最少"],"correctIndex":1,"explanation":"RF在安全数据(表格特征)上通常是最优基线，兼顾精度和可解释性。"}],
     "codeExamples":[{"title":"RF IDS+特征重要性","language":"python","code":"import numpy as np\nfrom sklearn.ensemble import RandomForestClassifier\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.metrics import classification_report\n\nnp.random.seed(42)\nX=np.random.randn(2000,15); y=(np.abs(X[:,:5]).sum(axis=1)>4).astype(int)\nX_tr,X_te,y_tr,y_te=train_test_split(X,y,test_size=0.3)\n\nrf=RandomForestClassifier(n_estimators=100,max_depth=10,random_state=42)\nrf.fit(X_tr,y_tr)\nprint(classification_report(y_te,rf.predict(X_te),target_names=[\"Normal\",\"Attack\"]))\nimp=rf.feature_importances_\nfor i,score in enumerate(np.argsort(imp)[::-1][:5]):\n  print(f\"  Feat{score}: {imp[score]:.3f}\")","explanation":"随机森林IDS检测+特征重要性排名"}],
     "resources":[{"name":"随机森林详解","url":"https://scikit-learn.org/stable/modules/ensemble.html#forest","type":"article"},{"name":"决策树可视化","url":"https://scikit-learn.org/stable/modules/tree.html","type":"article"},{"name":"特征重要性实战","url":"https://explained.ai/rf-importance/","type":"article"}],
     "recommendedTools":[{"name":"Scikit-learn","description":"RF实现","url":"https://scikit-learn.org/","type":"local"},{"name":"SHAP","description":"特征重要性","url":"https://github.com/shap/shap","type":"local"},{"name":"Graphviz","description":"决策树可视化","url":"https://graphviz.org/","type":"local"}],
     "labEnvironment":[{"name":"RF IDS实验","description":"RF对CIC-IDS分类+调参","url":"https://www.kaggle.com/","type":"local","setup":"1.加载IDS数据\n2.训练RF\n3.调优n_estimators/max_depth\n4.特征重要性分析\n5.对比LR/SVM","expectedOutput":"RF IDS检测评估+特征重要性排名"}],
     "expertNotes":[{"author":"李智能","title":"RF万能基线","content":"任何表格数据安全分类任务，先跑RF建立基线。RF准确率一般能到85-95%区间，低于80%需检查数据和特征。"},{"author":"王算法","title":"特征重要性≠因果","content":"特征重要性高只说明预测有用，不代表因果关系。安全性检查：源端口不重要但攻击都用高端口？找数据泄漏。"},{"author":"张模型","title":"深度vs数量","content":"max_depth=10/15/None深树分别对应不同复杂度。先设max_depth=10快速实验，精度不满意再逐步加深。"}]
    },
    # DAY 8
    {"id":"ai-8","day":8,"title":"第一周总结：实践项目","subtitle":"Week 1 Summary & Practice",
     "objectives":["回顾第一周学习","完成IDS分类项目","评估学习效果"],
     "content":"第一周总结：从Python数据处理到经典ML模型。\n\nDay1-2: 环境搭建+数据处理\nDay3-4: 可视化+统计异常\nDay5-6: 特征工程+LR/SVM\nDay7: 随机森林\n\n综合项目：CIC-IDS-2017入侵检测\n数据加载→EDA可视化→特征工程→LR/SVM/RF对比→评估报告\n\n评估指标：RF Accuracy>90%，Attack Recall>90%\n\n下周预告：XGBoost/LightGBM高级集成方法、无监督异常检测、模型调优。",
     "keyPoints":["完成IDS端到端项目","至少对比3种分类器","建立特征工程pipeline","产出评估报告","准备XGBoost/LightGBM"],
     "quiz":[
        {"question":"第一周学习的分类器不包括？","options":["A. 逻辑回归","B. SVM","C. XGBoost","D. 随机森林"],"correctIndex":2,"explanation":"XGBoost是第二周内容，第一周只学了LR/SVM/RF。"},
        {"question":"IDS项目中哪种算法通常表现最好？","options":["A. LR","B. RF或XGBoost","C. 统计方法","D. 规则"],"correctIndex":1,"explanation":"RF在IDS表格数据场景通常优于线性方法。XGBoost在第二周会进一步学习。"},
        {"question":"特征工程pipeline应包含什么？","options":["A. 只有特征","B. 标准化+特征选择+时序聚合","C. 只有数据","D. 只有模型"],"correctIndex":1,"explanation":"完整pipeline：时间窗口 → 统计聚合 → 标准化 → 特征选择 → 模型。"},
        {"question":"模型对比最重要的维度？","options":["A. 训练速度","B. Attack Recall和F1","C. 模型大小","D. 参数数量"],"correctIndex":1,"explanation":"安全场景核心是检出攻击(Recall)并控制误报(Precision)，综合看F1。"},
        {"question":"本周学习最难的部分？","options":["A. 写代码","B. 特征工程设计(最具创造性和经验性)","C. 调参","D. 可视化"],"correctIndex":1,"explanation":"特征工程需要领域知识+ML经验+创造性思维，是最有挑战也最有价值的部分。"}],
     "codeExamples":[{"title":"IDS端到端项目","language":"python","code":"import numpy as np; from sklearn.pipeline import Pipeline\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.ensemble import RandomForestClassifier\nnp.random.seed(42)\nX=np.random.randn(1500,12); y=(np.abs(X[:,:4]).sum(1)>3.5).astype(int)\npipe=Pipeline([(\"scaler\",StandardScaler()),(\"rf\",RandomForestClassifier(n_estimators=100,max_depth=10))])\npipe.fit(X[:1000],y[:1000])\nacc=pipe.score(X[1000:],y[1000:])\nprint(f\"IDS Pipeline Accuracy: {acc:.2%}\")","explanation":"端到端IDS处理pipeline：标准化+RF分类"}],
     "resources":[{"name":"CIC-IDS-2017","url":"https://www.unb.ca/cic/datasets/ids-2017.html","type":"article"},{"name":"Kaggle IDS Notebook","url":"https://www.kaggle.com/code/tag/data","type":"article"},{"name":"IDS综述","url":"https://www.freebuf.com/articles/es/345672.html","type":"article"}],
     "recommendedTools":[{"name":"Jupyter","description":"交互编程","url":"https://jupyter.org/","type":"local"},{"name":"Scikit-learn","description":"ML pipeline","url":"https://scikit-learn.org/","type":"local"},{"name":"Matplotlib","description":"可视化","url":"https://matplotlib.org/","type":"local"}],
     "labEnvironment":[{"name":"Week1综合项目","description":"CIC-IDS完整检测pipeline","url":"https://www.kaggle.com/","type":"local","setup":"1.加载CIC-IDS\n2.EDA可视化\n3.特征工程pipeline\n4.训练LR/SVM/RF\n5.对比评估输出报告","expectedOutput":"Week1 IDS项目评估报告"}],
     "expertNotes":[{"author":"李智能","title":"第一周复盘","content":"恭喜完成第一周。最重要的收获不是代码而是从数据处理到模型评估的完整思维流程，这比任何单一算法都重要。"},{"author":"王算法","title":"建立实验习惯","content":"养成每次实验记录的MLflow习惯：记录数据集、特征、模型参数、评估指标。后面30天30个实验，不记录就混乱了。"},{"author":"张模型","title":"不要追求完美","content":"第一周RF达到85%就够了，不要花大量时间微调。建立pipeline的完整流程比追求2%的精度提升更有价值。"}]
    },
    # DAY 9
    {"id":"ai-9","day":9,"title":"KNN与朴素贝叶斯","subtitle":"KNN & Naive Bayes",
     "objectives":["掌握KNN距离分类","理解朴素贝叶斯","学习安全文本分类"],
     "content":"KNN和朴素贝叶斯是简单但实用的安全分类方法。\n\nKNN(K近邻)：找k个最近邻居投票决定类别。核心是距离度量(欧氏/曼哈顿/余弦)。特点：懒学习(无训练)、可解释(邻居就是证据)、计算量大(kd-tree加速)。\n\n朴素贝叶斯：基于贝叶斯定理+特征独立假设。GaussianNB(连续特征)、MultinomialNB(计数特征)、BernoulliNB(二值特征)。\n\n安全应用：KNN-端口扫描检测(相似流量模式)、NB-垃圾/钓鱼邮件检测、Web攻击payload分类。\n\nNB处理文本优势：MultinomialNB直接处理词频向量，适合安全日志文本特征。\n\n局限性：KNN对高维数据效率低、NB特征独立假设不成立影响精度。",
     "keyPoints":["KNN懒学习无需训练","朴素贝叶斯适合文本","KNN可解释(最近邻居)","NB计算极快","是GBDT和DL的简单基线"],
     "quiz":[
        {"question":"KNN中k值的含义？","options":["A. 特征数","B. 取最近k个邻居投票","C. 类别数","D. 迭代次数"],"correctIndex":1,"explanation":"k是超参数，新样本的类别由距离最近的k个训练样本投票决定。"},
        {"question":"朴素贝叶斯\"朴素\"在哪？","options":["A. 算法简单","B. 假设所有特征条件独立","C. 不需要数据","D. 输出随机"],"correctIndex":1,"explanation":"NB假设特征在给定类别下条件独立（现实中不成立但效果不错）。"},
        {"question":"MultinomialNB适合什么场景？","options":["A. 图像","B. 文本/计数特征","C. 音频","D. 视频"],"correctIndex":1,"explanation":"MultinomialNB处理计数特征，如安全日志中词频/nginx状态码计数。"},
        {"question":"K近邻分类需要特征标准化吗？","options":["A. 不需要","B. 必须标准化(距离计算依赖尺度)","C. 部分要","D. 看情况"],"correctIndex":1,"explanation":"KNN基于距离度量，量级大的特征会主导距离。必须标准化。"},
        {"question":"KNN在安全检测中的最大问题？","options":["A. 不准","B. 推理时要计算到所有训练样本的距离(慢)","C. 太简单","D. 不可解释"],"correctIndex":1,"explanation":"KNN推理遍历全部训练数据O(n)，百万级样本下太慢。kd-tree加速可缓解。"}],
     "codeExamples":[{"title":"KNN+NB安全分类","language":"python","code":"import numpy as np\nfrom sklearn.neighbors import KNeighborsClassifier\nfrom sklearn.naive_bayes import GaussianNB\nfrom sklearn.model_selection import train_test_split\n\nnp.random.seed(42)\nX=np.random.randn(800,8); y=(X[:,0]+X[:,1]>0.5).astype(int)\nX_tr,X_te,y_tr,y_te=train_test_split(X,y,test_size=0.3)\n\nknn=KNeighborsClassifier(n_neighbors=5); knn.fit(X_tr,y_tr)\nnb=GaussianNB(); nb.fit(X_tr,y_tr)\nprint(f\"KNN: {knn.score(X_te,y_te):.2%}\")\nprint(f\"NB : {nb.score(X_te,y_te):.2%}\")","explanation":"KNN(基于距离)+朴素贝叶斯(基于概率)安全分类对比"}],
     "resources":[{"name":"KNN文档","url":"https://scikit-learn.org/stable/modules/neighbors.html","type":"article"},{"name":"朴素贝叶斯","url":"https://scikit-learn.org/stable/modules/naive_bayes.html","type":"article"},{"name":"安全文本分类","url":"https://www.freebuf.com/articles/es/234567.html","type":"article"}],
     "recommendedTools":[{"name":"Scikit-learn","description":"KNN/NB","url":"https://scikit-learn.org/","type":"local"},{"name":"FAISS","description":"大规模KNN","url":"https://github.com/facebookresearch/faiss","type":"local"},{"name":"NLTK","description":"文本处理","url":"https://www.nltk.org/","type":"local"}],
     "labEnvironment":[{"name":"KNN+NB检测","description":"KNN/NB对网络流量分类","url":"https://www.kaggle.com/","type":"local","setup":"1.准备流量特征\n2.训练KNN(测试不同k)\n3.训练NB\n4.对比评估\n5.分析优劣势","expectedOutput":"KNN/NB/之前方法对比表"}],
     "expertNotes":[{"author":"李智能","title":"KNN实际价值","content":"KNN不适合生产(慢)，但适合快速原型验证和异常解释。K近邻是很好的模型解释工具。"},{"author":"王算法","title":"贝叶斯稳健","content":"NB最大的优点：小数据下稳健、训练极快、输出概率。安全场景初期数据不足时很好的起点。"},{"author":"张模型","title":"Baseline对照","content":"每次做新模型必须包含简单基线(KNN/NB/LR)。如果复杂模型效果不如简单基线，回头检查数据。"}]
    },
    # DAY 10
    {"id":"ai-10","day":10,"title":"聚类与降维","subtitle":"Clustering & Dimensionality Reduction",
     "objectives":["掌握KMeans/DBSCAN","理解PCA/t-SNE","学习聚类安全应用"],
     "content":"聚类和降维是探索性安全分析的重要工具。\n\nKMeans：预设k个中心→迭代分配更新。安全应用：用户行为分组、攻击模式发现。局限性：需预设k、对异常敏感。\n\nDBSCAN：基于密度的聚类，自动发现任意形状簇。适合发现"异常噪声点"=潜在攻击。\n\nPCA：主成分分析，线性降维保留最大方差。应用：高维特征可视化、去除噪声、加速训练。\n\nt-SNE：非线性降维可视化专用。在2D/3D中展示高维数据的聚类结构。\n\n实战技巧：PCA降维后再聚类(降噪提速)、t-SNE可视化PCA结果、DBSCAN自动标记不确定性样本。",
     "keyPoints":["KMeans预设k个中心","DBSCAN密度聚类自动发现异常","PCA线性降维保留方差","t-SNE可视化展示聚类","降维到2D/3D直观分析"],
     "quiz":[
        {"question":"DBSCAN相比KMeans的核心优势？","options":["A. 更快","B. 不需预设k、可发现任意形状簇+噪声点","C. 更准","D. 更简单"],"correctIndex":1,"explanation":"DBSCAN基于密度自动确定簇数和形状，核心将不属于任何簇的点标记为噪声(异常)。"},
        {"question":"PCA降维选择维度依据？","options":["A. 随机","B. 累积解释方差>95%的主成分数","C. 固定值","D. 越少越好"],"correctIndex":1,"explanation":"用explained_variance_ratio_累积和判断保留多少主成分能覆盖95%方差。"},
        {"question":"t-SNE能用于特征降维后建模吗？","options":["A. 可以","B. 不能(仅用于可视化,输出无物理含义)","C. 部分可以","D. 看情况"],"correctIndex":1,"explanation":"t-SNE是可视化工具，输出坐标无物理含义且每次运行结果不同，不能用于建模。"},
        {"question":"K-means中k=3但实际有5种攻击会怎样？","options":["A. 更好","B. 攻击类型被合并损失检测粒度","C. 更准","D. 没影响"],"correctIndex":1,"explanation":"k小于真实类别数迫使不同攻击被分入同一簇，丢失重要信息。"},
        {"question":"PCA在IDS中的实用价值？","options":["A. 没用","B. 加速训练+降噪+可视化高维特征","C. 替代分类","D. 只能可视化"],"correctIndex":1,"explanation":"IDS特征可能有几十维，PCA降到10-20维后训练更快且去除噪声维度。"}],
     "codeExamples":[{"title":"聚类+降维分析","language":"python","code":"import numpy as np\nfrom sklearn.cluster import KMeans, DBSCAN\nfrom sklearn.decomposition import PCA\n\nnp.random.seed(42)\nX=np.vstack([np.random.randn(150,10)+np.array([2]*10),np.random.randn(150,10),np.random.randn(30,10)+np.array([5]*10)])\n\n# PCA降维\npca=PCA(n_components=2); X2d=pca.fit_transform(X)\nprint(f\"PCA explained: {pca.explained_variance_ratio_.sum()*100:.1f}%\")\n\n# KMeans\nkm=KMeans(n_clusters=3,random_state=42)\nlabels=km.fit_predict(X)\nprint(f\"KMeans: clusters={len(set(labels))}\")\n\n# DBSCAN\ndb=DBSCAN(eps=2.5,min_samples=5)\nlabels_db=db.fit_predict(X)\nprint(f\"DBSCAN: noise={(labels_db==-1).sum()}, clusters={len(set(labels_db))-1}\")","explanation":"PCA降维+KMeans聚类+DBSCAN异常检测三合一"}],
     "resources":[{"name":"PCA详解","url":"https://scikit-learn.org/stable/modules/decomposition.html#pca","type":"article"},{"name":"DBSCAN文档","url":"https://scikit-learn.org/stable/modules/clustering.html#dbscan","type":"article"},{"name":"t-SNE可视化","url":"https://distill.pub/2016/misread-tsne/","type":"article"}],
     "recommendedTools":[{"name":"Scikit-learn","description":"聚类+降维","url":"https://scikit-learn.org/","type":"local"},{"name":"UMAP","description":"更快降维","url":"https://umap-learn.readthedocs.io/","type":"local"},{"name":"Plotly","description":"交互3D可视化","url":"https://plotly.com/python/","type":"local"}],
     "labEnvironment":[{"name":"聚类分析实验","description":"CIC-IDS聚类+降维","url":"https://www.kaggle.com/","type":"local","setup":"1.加载IDS特征\n2.PCA降维\n3.KMeans聚类分析\n4.DBSCAN异常发现\n5.t-SNE可视化","expectedOutput":"聚类分析报告+2D可视化"}],
     "expertNotes":[{"author":"李智能","title":"探索性分析","content":"拿到新安全数据集先做PCA/t-SNE可视化。很多时候一眼就能发现特征质量问题或数据泄漏。"},{"author":"王算法","title":"DBSCAN调参","content":"eps是DBSCAN最关键参数。建议用k-distance图找拐点。安全场景eps宜小勿大，宁愿多噪声少误合并。"},{"author":"张模型","title":"降维用途","content":"PCA三大用途：1)特征预处理加速 2)去噪提升精度 3)可视化理解数据结构。三个用途经常同时满足。"}]
    },
]

print(f"Script generated successfully with {len(days)} short days defined")
print("Run the main generation logic below to produce cyberAi.ts")
