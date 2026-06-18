# Day 9：Pandas进阶数据处理
> [安全数据处理面试核心] Pandas数据清洗/分组聚合/时间序列/告警分析
## 核心知识点
### Q: 用Pandas做安全告警分析的实际流程
典型分析流程：
```python
# 1. 加载SIEM告警数据
df = pd.read_csv('alerts.csv', parse_dates=['timestamp'])
# 2. 按资产分组找Top告警源
top_assets = df.groupby('src_ip').size().nlargest(10)
# 3. 时间窗口聚合(每小时告警量)
hourly = df.set_index('timestamp').resample('1h').size()
# 4. 找异常高峰(3 sigma)
mean, std = hourly.mean(), hourly.std()
anomalies = hourly[abs(hourly - mean) > 3*std]
```

面试亮点：Pandas的resample+rolling是做安全时间序列分析的基础。可以追踪每天某个IP的告警趋势→拐点就是攻击开始或停止的信号
### Q: Pandas如何做安全日志的关联分析？
多数据源关联：
```python
# 防火墙日志和AD域日志做关联
merged = pd.merge(firewall_logs, ad_logs, 
                  left_on='src_ip', right_on='client_ip', 
                  how='inner')
# 找出同一用户在防火墙异常后AD也有异常的时间窗口
merged['time_diff'] = (merged['fw_time'] - merged['ad_time']).abs()
suspicious = merged[merged['time_diff'] < pd.Timedelta('5min')]
```

关联分析在SIEM中是核心能力——Pandas可以作为SIEM的离线分析补充，处理SIEM内置关联引擎做不到的灵活分析
## 面试陷阱
- Pandas读百万行安全日志内存可能不够用→要了解chunksize分块读和dask/polars替代方案
- resample的closed和label参数容易搞错→面试时当场写错可能减分

## 今日检测
1. 用Pandas加载SIEM导出的CSV→分组分析Top 10告警源→时间窗口聚合
2. 用pd.merge做AD日志和VPN日志的关联分析→找5分钟内的同时登出/异地登录
