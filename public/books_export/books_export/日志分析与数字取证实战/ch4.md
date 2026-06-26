# 第四章 Web日志分析

> 第4章 | 55页

4.1 Web日志格式

Nginx/Apache常见日志格式：
- 通用日志格式（Common Log Format）
- 组合日志格式（Combined Log Format）
- 自定义日志格式

典型日志字段：
- 客户端IP
- 时间戳
- 请求方法
- 请求URL
- HTTP协议版本
- 响应状态码
- 响应字节数
- Referer
- User-Agent

4.2 Web攻击日志特征

SQL注入特征：
- URL/POST中包含SELECT、UNION、AND、OR等SQL关键字
- 单引号、双引号、注释符（--、/*）
- OR 1=1、sleep()、benchmark()等典型注入语句

XSS特征：
- <script>、javascript:、onerror、onload等
- alert、document.cookie等
- <img src=x onerror=...>等变形

文件上传特征：
- .php、.asp、.jsp、.aspx等脚本后缀
- multipart/form-data请求
- 上传路径可访问

命令注入特征：
- ;、|、&&、||等命令连接符
- system()、exec()、passthru()等函数
- whoami、id、cat /etc/passwd等命令

4.3 日志分析工具

- awk/sed/grep：命令行日志分析
- goaccess：实时Web日志分析
- ELK Stack：日志平台
- Splunk：商业日志平台
- AWStats：日志统计工具

4.4 实战：Web攻击溯源

1. 确定攻击时间范围
2. 筛选攻击特征日志
3. 统计攻击IP
4. 分析攻击路径
5. 还原攻击过程
6. 查找攻击入口点
7. 评估受影响范围
