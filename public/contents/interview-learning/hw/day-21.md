# Day 21：恶意代码分析
> [恶意代码分析面试核心] 静态/动态分析/沙箱/逆向基础/PE结构
## 核心知识点
### Q: 恶意代码分析的静态与动态方法
静态分析(不执行)：①文件格式分析→pecheck/Exeinfo PE→查壳+编译器信息 ②字符串提取→strings+floss-strings→找URL/IP/互斥量/加密字符串 ③导入表分析→DependencyWalker→看加载了哪些可疑API(CreateRemoteThread/WriteProcessMemory/VirtualAllocEx)
动态分析(在沙箱执行)：Cuckoo Sandbox/Any.Run→观察进程/网络/文件/注册表行为→提取IOC(连接的C2域名/IP/下载的dropper/创建的持久化键)
进阶：用IDA Pro/Ghidra做逆向工程→分析加密算法→编写解密脚本→提取C2配置
## 面试陷阱
- 检测不是目的——目的是快速响应和持续改进规则
- 规则不是一次性写完就完了——需要基于新攻击手法的变化持续更新
- 实战护网中最高的评价是没出安全事件→不是因为你运气好而是因为你的检测和防御到位

## 今日检测
1. 在实际环境中实践本Day的核心检测技术
2. 用ATT&CK框架映射你的检测覆盖→找到覆盖盲区
3. 将本Day的知识点写成一条Splunk/ELK检测规则
