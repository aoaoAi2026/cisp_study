# Day 14：应用系统安全加固
> [应用加固面试核心] Web服务器加固/TLS配置/数据库加固
## 核心知识点
### Q: Web服务器加固的关键点
Nginx/Apache加固：隐藏版本号、限制HTTP方法(GET/POST/HEAD排除PUT/DELETE/TRACE)、配置超时(client_body_timeout)、禁用目录列表、限制请求体大小(client_max_body_size)
TLS配置：只开TLS1.2/1.3→禁用TLS1.0/1.1→禁用弱密码套件(RC4/DES/3DES)→HSTS开启→Mozilla SSL Configuration Generator是最佳参考
## 面试陷阱
- 检测不是目的——目的是快速响应和持续改进规则
- 规则不是一次性写完就完了——需要基于新攻击手法的变化持续更新
- 实战护网中最高的评价是没出安全事件→不是因为你运气好而是因为你的检测和防御到位

## 今日检测
1. 在实际环境中实践本Day的核心检测技术
2. 用ATT&CK框架映射你的检测覆盖→找到覆盖盲区
3. 将本Day的知识点写成一条Splunk/ELK检测规则
