# Day 8：NumPy安全数据处理
> [安全数据处理面试核心] NumPy高效数值计算/安全日志分析/特征提取
## 核心知识点
### Q: 用NumPy做安全日志分析的实战例子
安全日志分析中NumPy的超能力在于向量化操作：无需Python for循环，直接对整个数组做运算→速度提升100x+。

实战一：批量IP地址转换→`np.array([ip_to_int(ip) for ip in ips], dtype=np.uint32)`→所有IP在数组中，做范围比较(判断是否属于某网段)只需一行

实战二：时间序列异常检测→登录事件时间戳→`diffs = np.diff(timestamps)`→相邻事件时间间隔→`np.percentile(diffs, [1, 99])`→找出极端异常的时间窗口(暴力破解通常间隔短)

实战三：特征向量化→流量大小/包数/端口数组成特征矩阵→用NumPy的`np.mean/var/corrcoef`快速计算统计特征→输入ML模型

面试说这个体现你理解安全数据处理和通用工具的关系
### Q: NumPy的vectorization在安全数据处理中为什么重要？
安全数据量大(可能每天亿级事件)→纯Python循环处理太慢→NumPy的C底层向量化操作直接把整个数组交给BLAS/LAPACK库→充分发挥CPU SIMD指令。
典型场景：对1000万个网络事件按端口分组→pandas DataFrame→`df.groupby('port').size()`底层就是NumPy的`np.unique(ports, return_counts=True)`。懂底层原理不是炫技，是优化性能瓶颈时能给出方案
## 面试陷阱
- NumPy只是工具——面试时讲清你用它解决了什么安全问题比只会API调用重要
- 向量化不是魔法——超大数组仍吃内存，需要分块处理(chunk/block)

## 今日检测
1. 用NumPy处理本地auth.log→统计每小时登录失败次数→找异常高峰
2. 对比Python纯循环和NumPy向量化操作处理100万条日志的性能差异
