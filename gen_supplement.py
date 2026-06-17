"""
Generate supplement TypeScript files for basic/penetration/defense plans.
Adds 5-7 additional quiz questions + coding exercises per day.
"""
import re, json

plans = {
    'basic': {
        'file': 'src/data/cyberBasic.ts',
        'output': 'src/data/cyberBasicSupplement.ts',
        'import_path': './cyberBasicSupplement',
        'var_name': 'cyberBasicSupplement',
        'quiz_format': 'ts'
    },
    'penetration': {
        'file': 'src/data/cyberPenetration.ts',
        'output': 'src/data/cyberPenetrationSupplement.ts',
        'import_path': './cyberPenetrationSupplement',
        'var_name': 'cyberPenetrationSupplement',
        'quiz_format': 'ts'
    },
    'defense': {
        'file': 'src/data/cyberDefense.ts',
        'output': 'src/data/cyberDefenseSupplement.ts',
        'import_path': './cyberDefenseSupplement',
        'var_name': 'cyberDefenseSupplement',
        'quiz_format': 'json'
    },
}

# Topic-specific additional questions for each plan
# Organized by day -> list of additional quiz items

def get_basic_day_quizzes(day_num, title):
    """Get additional quiz questions for basic plan by day."""
    quizzes = {
        1: [  # 网络安全概述
            {'type':'single','question':'以下哪个不属于信息安全的基本属性？','options':['A. 机密性','B. 完整性','C. 可用性','D. 可追溯性'],'correctIndex':3,'explanation':'信息安全三要素是机密性(Confidentiality)、完整性(Integrity)、可用性(Availability)，简称CIA三要素。可追溯性属于审计范畴。'},
            {'type':'single','question':'网络安全法中"等级保护制度"的核心要求是？','options':['A. 所有系统统一保护','B. 根据安全等级分级保护','C. 只保护三级以上系统','D. 不做分级'],'correctIndex':1,'explanation':'等级保护制度要求根据信息系统的重要程度和安全需求进行分级保护，不同等级要求不同安全措施。'},
            {'type':'boolean','question':'内部威胁比外部威胁更容易检测和防范。','options':['A. 正确','B. 错误'],'correctIndex':1,'explanation':'内部威胁因为内部人员已有合法访问权限，其恶意行为难以区分于正常操作，检测和防范难度更大。'},
            {'type':'fill','question':'信息安全的三大核心目标中，防止未授权修改数据属于保障数据的______。','correctAnswer':'完整性','explanation':'完整性(Integrity)确保数据在传输和存储过程中不被未授权修改或破坏。'},
            {'type':'single','question':'社会工程学攻击主要利用的是？','options':['A. 系统漏洞','B. 网络协议缺陷','C. 人性的弱点','D. 加密算法漏洞'],'correctIndex':2,'explanation':'社会工程学不依赖技术漏洞，而是利用人的信任、好奇、恐惧等心理弱点进行攻击。'},
            {'type':'multiple','question':'以下哪些属于网络安全从业人员角色？（多选）','options':['A. 渗透测试工程师','B. 安全运维分析师','C. 威胁情报分析师','D. 安全架构师'],'correctIndices':[0,1,2,3],'explanation':'这四个都是网络安全行业的核心岗位，分工不同但共同构成安全团队。'},
            {'type':'single','question':'《网络安全法》正式实施的日期是？','options':['A. 2016年6月1日','B. 2017年6月1日','C. 2018年1月1日','D. 2019年1月1日'],'correctIndex':1,'explanation':'《中华人民共和国网络安全法》于2017年6月1日正式实施，是我国网络空间安全的基本法律。'},
        ],
        2: [  # OSI七层模型与TCP/IP
            {'type':'single','question':'TCP/IP协议栈中，ARP协议工作在哪一层？','options':['A. 应用层','B. 传输层','C. 网络层','D. 数据链路层'],'correctIndex':2,'explanation':'ARP(地址解析协议)负责IP地址到MAC地址的映射，工作在网络层。虽然涉及链路层MAC地址，但ARP本身是网络层协议。'},
            {'type':'single','question':'以下关于OSI七层模型说法正确的是？','options':['A. TCP工作在会话层','B. IP工作在网络层','C. HTTP工作在传输层','D. SSL工作在物理层'],'correctIndex':1,'explanation':'IP协议负责路由选择，工作在网络层(第三层)。TCP在传输层，HTTP在应用层，SSL在表示层。'},
            {'type':'boolean','question':'TCP三次握手中，SYN包中的序列号是随机生成的。','options':['A. 正确','B. 错误'],'correctIndex':0,'explanation':'TCP三次握手时，客户端和服务端各自随机生成初始序列号(ISN)，用于后续数据传输的编号和确认。'},
            {'type':'fill','question':'在OSI七层模型中，______层负责将数据帧转换为比特流进行物理传输。','correctAnswer':'物理','explanation':'物理层(Physical Layer)是OSI模型的最底层，负责将数据帧转换为电信号、光信号等物理形式的比特流。'},
            {'type':'single','question':'下列哪个协议不属于应用层协议？','options':['A. HTTP','B. FTP','C. ICMP','D. DNS'],'correctIndex':2,'explanation':'ICMP(Internet控制报文协议)工作在网络层，用于传递差错报告和网络诊断信息(如ping命令)。'},
            {'type':'multiple','question':'TCP协议提供的服务包括？（多选）','options':['A. 可靠数据传输','B. 流量控制','C. 拥塞控制','D. 面向连接'],'correctIndices':[0,1,2,3],'explanation':'TCP提供面向连接的、可靠的数据传输服务，包括流量控制(滑动窗口)、拥塞控制和差错恢复机制。'},
            {'type':'single','question':'数据封装过程中，传输层添加的头部信息主要包含？','options':['A. MAC地址','B. IP地址','C. 端口号','D. URL路径'],'correctIndex':2,'explanation':'传输层头部包含源端口号和目的端口号，用于标识发送和接收的应用程序进程。'},
        ],
        3: [  # 常见端口与服务
            {'type':'single','question':'MySQL数据库的默认端口是？','options':['A. 1433','B. 3306','C. 5432','D. 27017'],'correctIndex':1,'explanation':'MySQL/MariaDB默认使用3306端口。1433是MSSQL，5432是PostgreSQL，27017是MongoDB。'},
            {'type':'single','question':'以下哪个端口号需要root/管理员权限才能绑定？','options':['A. 8080','B. 3306','C. 80','D. 3000'],'correctIndex':2,'explanation':'端口号1-1023为知名端口(Well-Known Ports)，在Linux系统中需要root权限才能绑定。80端口属于这个范围。'},
            {'type':'boolean','question':'FTP协议使用21端口传输数据，20端口传输控制命令。','options':['A. 正确','B. 错误'],'correctIndex':1,'explanation':'FTP中21端口用于控制命令传输，20端口用于实际数据传输。主动模式下服务器用20端口向客户端发送数据。'},
            {'type':'fill','question':'Redis数据库的默认端口号是______。','correctAnswer':'6379','explanation':'Redis默认使用6379端口。未授权访问的Redis(6379端口暴露在公网)是常见的安全漏洞。'},
            {'type':'single','question':'telnet协议的端口号是多少？','options':['A. 22','B. 23','C. 25','D. 21'],'correctIndex':1,'explanation':'telnet使用23端口，但它是明文协议不安全，应使用SSH(22端口)代替。'},
            {'type':'multiple','question':'以下哪些端口通常用于Web服务？（多选）','options':['A. 80','B. 443','C. 8080','D. 8443'],'correctIndices':[0,1,2,3],'explanation':'80(HTTP)和443(HTTPS)是标准Web端口，8080和8443是常用的替代Web端口，常见于开发环境和代理服务器。'},
        ],
        4: [  # 常见端口扫描
            {'type':'single','question':'Nmap中TCP SYN扫描的参数是？','options':['A. -sT','B. -sS','C. -sU','D. -sA'],'correctIndex':1,'explanation':'-sS是TCP SYN半开扫描，只发送SYN包不完成三次握手，是最常用的隐蔽扫描方式。-sT是全连接扫描，-sU是UDP扫描。'},
            {'type':'single','question':'端口扫描中，收到RST包说明端口处于什么状态？','options':['A. 开放','B. 关闭','C. 过滤','D. 不确定'],'correctIndex':1,'explanation':'收到RST+ACK响应说明端口关闭。收到SYN+ACK说明端口开放。无响应或收到ICMP不可达说明端口被过滤。'},
            {'type':'boolean','question':'UDP端口扫描通常比TCP端口扫描更快更可靠。','options':['A. 正确','B. 错误'],'correctIndex':1,'explanation':'UDP是无连接协议，不返回确认。UDP端口扫描需要等待ICMP端口不可达消息或超时，速度慢且结果不可靠。'},
            {'type':'fill','question':'Nmap中用于操作系统检测的参数是______。','correctAnswer':'-O','explanation':'-O参数启用Nmap的TCP/IP指纹识别功能，通过分析响应包的特征判断目标操作系统类型和版本。'},
            {'type':'single','question':'以下哪种Nmap扫描方式最隐蔽？','options':['A. TCP Connect扫描','B. SYN半开扫描','C. NULL扫描','D. Xmas扫描'],'correctIndex':2,'explanation':'NULL扫描不设置任何TCP标志位，某些防火墙和IDS可能不会记录这种异常包，但只对特定系统有效。'},
        ],
        5: [  # 加密基础与算法
            {'type':'single','question':'以下哪个是对称加密算法？','options':['A. RSA','B. AES','C. ECC','D. Diffie-Hellman'],'correctIndex':1,'explanation':'AES(高级加密标准)是对称加密算法，加密和解密使用同一密钥。RSA、ECC是非对称加密，DH是密钥交换协议。'},
            {'type':'single','question':'AES-256的密钥长度是多少位？','options':['A. 128位','B. 192位','C. 256位','D. 512位'],'correctIndex':2,'explanation':'AES-256使用256位密钥，AES-128使用128位密钥，AES-192使用192位密钥。密钥越长安全性越高但性能越低。'},
            {'type':'boolean','question':'MD5算法目前仍然适合用于密码存储。','options':['A. 正确','B. 错误'],'correctIndex':1,'explanation':'MD5已被证明存在碰撞漏洞，不应再用于安全场景。密码存储应使用bcrypt、scrypt或Argon2等专门设计的哈希算法。'},
            {'type':'fill','question':'非对称加密中使用______密钥加密的数据只能用对应的私钥解密。','correctAnswer':'公钥','explanation':'非对称加密使用公钥加密、私钥解密（机密性）或者私钥签名、公钥验证（认证性）。'},
            {'type':'multiple','question':'以下哪些是对称加密算法？（多选）','options':['A. DES','B. 3DES','C. AES','D. ChaCha20'],'correctIndices':[0,1,2,3],'explanation':'这四个都是对称加密算法。DES已过时不安全，3DES是DES的增强版，AES是当前标准，ChaCha20是流密码常用于移动设备。'},
        ],
        6: [  # 哈希算法与数字签名
            {'type':'single','question':'SHA-256的输出长度是多少位？','options':['A. 128位','B. 160位','C. 256位','D. 512位'],'correctIndex':2,'explanation':'SHA-256输出256位(32字节)哈希值。SHA-1输出160位(已被攻破)，SHA-512输出512位。'},
            {'type':'single','question':'数字签名使用发送方的什么密钥？','options':['A. 公钥','B. 私钥','C. 会话密钥','D. 共享密钥'],'correctIndex':1,'explanation':'数字签名使用发送方的私钥对消息哈希值进行加密，接收方使用发送方的公钥验证签名。私钥签名、公钥验证。'},
            {'type':'boolean','question':'哈希函数的一个重要特性是"雪崩效应"。','options':['A. 正确','B. 错误'],'correctIndex':0,'explanation':'雪崩效应指输入中任何微小的变化(如改变1比特)都会导致输出哈希值发生巨大变化，这是安全哈希函数的关键特性。'},
            {'type':'fill','question':'哈希算法应该具备的主要安全特性包括：抗原像攻击、抗第二原像攻击和抗______攻击。','correctAnswer':'碰撞','explanation':'碰撞攻击是指找到两个不同的输入产生相同的哈希输出。SHA-1已在2017年被成功进行碰撞攻击。'},
            {'type':'single','question':'以下哪个不是密码学哈希算法？','options':['A. SHA-256','B. SM3','C. CRC32','D. BLAKE3'],'correctIndex':2,'explanation':'CRC32是循环冗余校验，设计目的是检测数据传输错误而非安全性。CRC32容易构造碰撞，不能用于安全场景。'},
        ],
        7: [  # HTTP协议详解
            {'type':'single','question':'HTTP响应状态码403表示什么？','options':['A. 未找到','B. 禁止访问','C. 服务器错误','D. 重定向'],'correctIndex':1,'explanation':'403 Forbidden表示服务器理解请求但拒绝执行，通常因为权限不足。404是未找到，500是服务器内部错误。'},
            {'type':'single','question':'HTTP/2相比HTTP/1.1的主要改进不包括？','options':['A. 多路复用','B. 头部压缩','C. 服务器推送','D. 明文传输'],'correctIndex':3,'explanation':'HTTP/2引入二进制分帧、多路复用、头部压缩(HPACK)、服务器推送等特性。明文传输是HTTP/1.1的特性，HTTP/2浏览器实现均要求TLS加密。'},
            {'type':'boolean','question':'GET请求可以包含请求体(Body)。','options':['A. 正确','B. 错误'],'correctIndex':0,'explanation':'虽然HTTP规范允许GET请求包含Body，但大多数服务器会忽略它，且某些中间件可能拒绝处理。实际开发中不推荐GET携带Body。'},
            {'type':'fill','question':'HTTP请求头中，______字段用于告诉服务器客户端支持的内容类型。','correctAnswer':'Accept','explanation':'Accept请求头告知服务器客户端能够处理的MIME类型，如Accept: application/json表示客户端期望JSON响应。'},
            {'type':'multiple','question':'以下哪些HTTP方法是安全的(不修改资源)？（多选）','options':['A. GET','B. HEAD','C. OPTIONS','D. POST'],'correctIndices':[0,1,2],'explanation':'GET、HEAD、OPTIONS是安全方法(只读不修改)。POST、PUT、DELETE、PATCH会修改服务器资源。'},
        ],
        8: [  # XSS跨站脚本攻击
            {'type':'single','question':'以下哪种XSS类型最难防御？','options':['A. 反射型XSS','B. 存储型XSS','C. DOM型XSS','D. 都一样'],'correctIndex':2,'explanation':'DOM型XSS发生在客户端JavaScript中，不需要服务器参与，传统WAF难以检测，需要通过安全的JavaScript编码来防御。'},
            {'type':'boolean','question':'HttpOnly Cookie可以完全防止XSS攻击。','options':['A. 正确','B. 错误'],'correctIndex':1,'explanation':'HttpOnly只能防止JavaScript读取Cookie，但不能防止XSS攻击本身。攻击者仍可进行其他操作如发起请求、修改页面等。'},
            {'type':'fill','question':'防止XSS攻击最关键的措施是对______进行转义和过滤。','correctAnswer':'用户输入','explanation':'XSS攻击的本质是恶意脚本被注入到页面中执行，因此对所有用户输入在输出时进行上下文相关的转义是最核心的防御措施。'},
            {'type':'single','question':'CSP(内容安全策略)通过什么方式防御XSS？','options':['A. 加密页面内容','B. 限制脚本来源和执行','C. 过滤用户输入','D. 隐藏页面源码'],'correctIndex':1,'explanation':'CSP通过HTTP头或meta标签声明允许加载资源的来源白名单，限制内联脚本和eval的执行。'},
        ],
        9: [  # CSRF跨站请求伪造
            {'type':'single','question':'CSRF Token应该存储在哪里最安全？','options':['A. Cookie中','B. 表单隐藏字段','C. URL参数','D. localStorage'],'correctIndex':1,'explanation':'CSRF Token存储在表单隐藏字段或自定义HTTP头中。不应放在Cookie中(会自动发送)，也不应放在URL中(会泄露到日志和Referer)。'},
            {'type':'boolean','question':'验证Referer头是防CSRF的可靠方案。','options':['A. 正确','B. 错误'],'correctIndex':1,'explanation':'Referer头可能被浏览器策略或代理移除，也可能被伪造(在某些浏览器版本中)。应作为辅助措施而非唯一防线。'},
            {'type':'single','question':'SameSite Cookie属性设置为Lax时，什么情况下Cookie会被发送？','options':['A. 从不发送','B. 仅顶级导航的GET请求','C. 所有跨站请求','D. 仅POST请求'],'correctIndex':1,'explanation':'SameSite=Lax在用户从外部站点通过链接导航到目标站点时会发送Cookie(GET请求)，但从外部站点发起的POST/AJAX请求不会携带。'},
        ],
        10: [  # 文件上传漏洞
            {'type':'single','question':'文件上传漏洞防御中，白名单验证的核心是？','options':['A. 检查文件大小','B. 只允许特定扩展名和MIME类型','C. 重命名文件','D. 检查文件内容'],'correctIndex':1,'explanation':'白名单验证只允许明确安全的文件类型，比黑名单(禁止某些类型)更安全。应同时验证扩展名和实际MIME类型。'},
            {'type':'single','question':'上传文件存储的最佳实践是？','options':['A. 保存在Web目录直接访问','B. 保存在Web目录外通过脚本读取','C. 保存在/tmp目录','D. 保存在数据库中'],'correctIndex':1,'explanation':'将上传文件保存在Web根目录之外，通过服务端脚本代理读取，可以防止上传的脚本文件被直接执行。'},
            {'type':'boolean','question':'仅检查文件扩展名就足以防止文件上传漏洞。','options':['A. 正确','B. 错误'],'correctIndex':1,'explanation':'攻击者可以伪造Content-Type、使用双扩展名(shell.php.jpg)、使用特殊字符截断等绕过。需多重验证。'},
            {'type':'fill','question':'文件上传防御中，将上传文件的______设为不可执行是重要措施。','correctAnswer':'文件权限','explanation':'将上传目录的权限设为不可执行(如chmod -x)，这样即使上传了恶意脚本也无法被服务器执行。'},
        ],
        11: [  # SSRF
            {'type':'single','question':'SSRF攻击可以访问以下哪个资源？','options':['A. 公网服务','B. 内网服务','C. 云元数据API','D. 以上全部'],'correctIndex':3,'explanation':'SSRF(服务器端请求伪造)让服务器代替攻击者发起请求，可访问内网资源、云元数据(169.254.169.254)和本地服务。'},
            {'type':'boolean','question':'使用白名单URL验证可以有效防御SSRF。','options':['A. 正确','B. 错误'],'correctIndex':0,'explanation':'白名单验证只允许请求预定义的URL列表，是最有效的SSRF防御方式之一。黑名单容易被绕过。'},
            {'type':'single','question':'SSRF攻击中哪个协议最常用于读取本地文件？','options':['A. http://','B. https://','C. file://','D. ftp://'],'correctIndex':2,'explanation':'file://协议可使服务器读取本地文件。防御SSRF应禁用不安全的URL协议如file://, gopher://, dict://等。'},
            {'type':'fill','question':'SSRF的全称是______ Request Forgery。','correctAnswer':'Server-Side','explanation':'SSRF=Server-Side Request Forgery(服务器端请求伪造)，攻击者利用服务器发起恶意请求。'},
        ],
        12: [  # PKI体系
            {'type':'single','question':'数字证书中不包含以下哪个信息？','options':['A. 公钥','B. 证书持有者信息','C. CA的签名','D. 用户的私钥'],'correctIndex':3,'explanation':'数字证书包含公钥、持有者信息、有效期、CA签名等，绝不包含私钥。私钥始终由持有者自己保管。'},
            {'type':'boolean','question':'自签名证书与CA签发证书的安全性完全相同。','options':['A. 正确','B. 错误'],'correctIndex':1,'explanation':'自签名证书未经可信第三方验证，容易被中间人攻击替换。浏览器会显示安全警告，不应在生产环境使用。'},
            {'type':'single','question':'PKI体系中，CA的主要职责是什么？','options':['A. 加密数据','B. 签发和管理数字证书','C. 存储用户密码','D. 防火墙管理'],'correctIndex':1,'explanation':'CA(证书颁发机构)负责验证申请者身份、签发数字证书、维护证书吊销列表(CRL)等。'},
        ],
        13: [  # 身份认证与授权
            {'type':'single','question':'多因素认证(MFA)的三类因素不包括？','options':['A. 你知道的(密码)','B. 你拥有的(令牌)','C. 你是什么(生物特征)','D. 你做什么(行为习惯)'],'correctIndex':3,'explanation':'MFA的三类标准因素：知识因素(密码/PIN)、持有因素(手机/令牌)、生物因素(指纹/面部)。行为分析属于持续认证。'},
            {'type':'boolean','question':'JWT Token的payload部分是加密的。','options':['A. 正确','B. 错误'],'correctIndex':1,'explanation':'JWT的payload只是Base64URL编码，不是加密！任何人都可以解码查看内容。敏感信息不应放在JWT payload中。'},
            {'type':'single','question':'OAuth 2.0中，Authorization Code模式相比Implicit模式的主要优势是？','options':['A. 更简单','B. Token不经过浏览器','C. 不需要服务端','D. 速度更快'],'correctIndex':1,'explanation':'Authorization Code模式中token在后端交换，不经过浏览器URL，更安全。Implicit模式已不推荐使用。'},
        ],
        14: [  # 越权漏洞
            {'type':'single','question':'水平越权和垂直越权的主要区别是？','options':['A. 没有区别','B. 水平越权访问同级用户数据，垂直越权执行高级操作','C. 垂直越权更危险','D. 只有水平越权存在'],'correctIndex':1,'explanation':'水平越权：用户A访问用户B的同级数据。垂直越权：低权限用户执行高权限操作(如普通用户执行管理员操作)。'},
            {'type':'boolean','question':'前端隐藏按钮可以防止越权操作。','options':['A. 正确','B. 错误'],'correctIndex':1,'explanation':'前端权限控制只是UI层面的，攻击者可直接调用API。真正的权限控制必须在服务端实现。'},
            {'type':'single','question':'防止越权最有效的措施是？','options':['A. 前端权限控制','B. 服务端验证用户对资源的归属','C. URL混淆','D. 使用POST代替GET'],'correctIndex':1,'explanation':'每次请求都在服务端验证：当前用户是否有权访问所请求的资源，这是防止越权的根本措施。'},
        ],
        15: [  # 中间件安全配置
            {'type':'single','question':'Nginx中隐藏版本号应使用哪个指令？','options':['A. server_tokens off;','B. hide_version on;','C. server_signature off;','D. version_hide on;'],'correctIndex':0,'explanation':'server_tokens off; 可以隐藏Nginx版本号，减少信息泄露。Apache中类似的是ServerTokens Prod和ServerSignature Off。'},
            {'type':'single','question':'Tomcat中删除默认应用的主要原因是什么？','options':['A. 节省磁盘空间','B. 减少攻击面','C. 提高性能','D. 便于管理'],'correctIndex':1,'explanation':'Tomcat默认应用(如/manager、/host-manager、/examples)可能包含已知漏洞，删除它们可以减少被攻击的风险。'},
            {'type':'boolean','question':'使用HTTPS后，Web应用就不需要其他安全配置了。','options':['A. 正确','B. 错误'],'correctIndex':1,'explanation':'HTTPS只保护传输层安全，不能防御SQL注入、XSS、CSRF等应用层攻击。需要多层次的安全防护。'},
        ],
    }
    
    # Default questions for days not explicitly defined
    default_quiz = [
        {'type':'single','question':'网络安全防御的基本原则是？','options':['A. 单一防线','B. 纵深防御','C. 仅依赖防火墙','D. 仅依赖加密'],'correctIndex':1,'explanation':'纵深防御(Defense in Depth)是安全基本原则，通过多层不同机制的安全控制来保护系统。'},
        {'type':'boolean','question':'安全是一个持续的过程，而非一次性的任务。','options':['A. 正确','B. 错误'],'correctIndex':0,'explanation':'安全需要持续监控、更新、评估和改进，威胁环境不断变化，需要持续投入安全建设。'},
        {'type':'single','question':'最小权限原则(Least Privilege)的含义是？','options':['A. 给用户最少的功能','B. 仅授予完成任务所需的最小权限','C. 所有用户权限相同','D. 不使用权限'],'correctIndex':1,'explanation':'最小权限原则要求用户、程序或系统组件只被授予完成其任务所必需的最小权限，降低权限滥用的风险。'},
        {'type':'fill','question':'信息安全PDCA循环包括：计划(Plan)、执行(Do)、______、改进(Act)。','correctAnswer':'检查','explanation':'PDCA循环：Plan(计划)→Do(执行)→Check(检查)→Act(改进)，是安全管理的持续改进模型。'},
        {'type':'multiple','question':'以下哪些属于安全基线配置的内容？（多选）','options':['A. 禁用不必要的服务','B. 修改默认密码','C. 启用日志审计','D. 设置密码复杂度策略'],'correctIndices':[0,1,2,3],'explanation':'安全基线(Security Baseline)是最低安全标准，包括账户安全、日志审计、服务最小化、访问控制等多个方面。'},
    ]
    
    return quizzes.get(day_num, default_quiz)


def get_basic_day_code_examples(day_num, title):
    """Generate code examples for basic plan days."""
    examples = {
        1: [{'title':'Python实现CIA三要素演示','language':'python','code':'# CIA三要素演示\nimport hashlib\nimport base64\nfrom cryptography.fernet import Fernet\n\n# 机密性(Confidentiality): 加密演示\nkey = Fernet.generate_key()\ncipher = Fernet(key)\nplaintext = b"Secret message"\nencrypted = cipher.encrypt(plaintext)\nprint(f"加密后: {encrypted[:20]}...")\ndecrypted = cipher.decrypt(encrypted)\nprint(f"解密后: {decrypted.decode()}")\n\n# 完整性(Integrity): 哈希演示\ndata = "重要数据"\nhash_val = hashlib.sha256(data.encode()).hexdigest()\nprint(f"SHA256: {hash_val[:16]}...")\n\n# 可用性(Availability): 重试机制演示\nimport time\ndef retry_operation(func, max_retries=3):\n    for i in range(max_retries):\n        try:\n            return func()\n        except Exception as e:\n            print(f"第{i+1}次重试... ({e})")\n            time.sleep(1)\n    raise Exception("服务不可用")\n\nprint("CIA三要素演示完成")','explanation':'用代码直观展示CIA三要素：机密性(加密)、完整性(哈希)、可用性(重试机制)'}],
        2: [{'title':'Scapy构造TCP三次握手','language':'python','code':'# Scapy模拟TCP三次握手\nfrom scapy.all import IP, TCP, sr1\n\n# 第一次握手: 客户端发送SYN\ndef tcp_handshake_demo(target_ip, target_port):\n    print(f"=== TCP三次握手模拟: {target_ip}:{target_port} ===")\n    \n    # Step 1: SYN\n    syn = IP(dst=target_ip)/TCP(dport=target_port, flags="S", seq=1000)\n    print(f"[1] 客户端 -> 服务器: SYN (seq=1000)")\n    syn_ack = sr1(syn, timeout=3, verbose=0)\n    \n    if syn_ack and syn_ack.haslayer(TCP):\n        if syn_ack[TCP].flags == "SA":\n            # Step 2: SYN-ACK received\n            server_seq = syn_ack[TCP].seq\n            print(f"[2] 服务器 -> 客户端: SYN-ACK (seq={server_seq}, ack=1001)")\n            \n            # Step 3: ACK\n            ack = IP(dst=target_ip)/TCP(\n                dport=target_port, flags="A",\n                seq=1001, ack=server_seq+1\n            )\n            sr1(ack, timeout=1, verbose=0)\n            print(f"[3] 客户端 -> 服务器: ACK (ack={server_seq+1})")\n            print("握手完成!")\n        else:\n            print(f"收到 {syn_ack[TCP].flags} 标志")\n    else:\n        print("端口关闭或超时")\n\n# 使用方式(需要root权限):\n# tcp_handshake_demo("192.168.1.1", 80)','explanation':'使用Scapy库模拟TCP三次握手过程，直观理解SYN→SYN-ACK→ACK流程'}],
        3: [{'title':'Python多线程端口扫描','language':'python','code':'import socket\nimport threading\nfrom queue import Queue\n\n# 常见端口及其服务\nPORT_SERVICES = {\n    21: "FTP", 22: "SSH", 23: "Telnet", 25: "SMTP",\n    53: "DNS", 80: "HTTP", 110: "POP3", 143: "IMAP",\n    443: "HTTPS", 3306: "MySQL", 3389: "RDP",\n    5432: "PostgreSQL", 6379: "Redis", 27017: "MongoDB"\n}\n\ndef scan_port(host, port, results):\n    try:\n        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)\n        s.settimeout(1)\n        result = s.connect_ex((host, port))\n        s.close()\n        if result == 0:\n            service = PORT_SERVICES.get(port, "Unknown")\n            results.append(f"  Port {port:5d} OPEN - {service}")\n    except:\n        pass\n\ndef multi_scan(host, ports):\n    print(f"扫描 {host}...")\n    results = []\n    threads = []\n    for port in ports:\n        t = threading.Thread(target=scan_port, args=(host, port, results))\n        threads.append(t)\n        t.start()\n    for t in threads:\n        t.join()\n    print("\\n".join(results) if results else "  无开放端口")\n\n# 测试(扫描localhost)\ncommon_ports = sorted(PORT_SERVICES.keys())\nmulti_scan("127.0.0.1", common_ports)','explanation':'多线程端口扫描器，自动识别常见服务名称，展示端口到服务的映射关系'}],
        4: [{'title':'Nmap扫描结果解析','language':'python','code':'import subprocess\nimport json\nimport re\n\ndef parse_nmap_output(target):\n    """解析Nmap XML输出"""\n    # 需要先安装nmap\n    cmd = ["nmap", "-sV", "-oX", "-", target]\n    try:\n        result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)\n        if result.returncode != 0:\n            print(f"Nmap错误: {result.stderr}")\n            return\n        \n        # 简单提取端口信息\n        ports = re.findall(\n            r\'portid="(\\d+)"[^>]*>.*?<state state="(\\w+)".*?\'\n            r\'<service name="(\\w+)".*?\',\n            result.stdout, re.DOTALL\n        )\n        \n        print(f"=== {target} 扫描结果 ===")\n        for port, state, service in ports:\n            icon = "🟢" if state == "open" else "🔴"\n            print(f"  {icon} {port}/tcp {state} - {service}")\n    except FileNotFoundError:\n        print("请先安装Nmap: sudo apt install nmap")\n    except Exception as e:\n        print(f"扫描失败: {e}")\n\n# 示例\nprint("提示: 使用 parse_nmap_output(\'192.168.1.1\') 扫描目标")','explanation':'通过Python调用Nmap扫描并解析结果，展示不同扫描类型(全连接/SYN/UDP)的使用'}],
        5: [{'title':'AES加解密实战','language':'python','code':'from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes\nfrom cryptography.hazmat.primitives import padding\nimport os\n\ndef aes_encrypt(plaintext, key):\n    """AES-CBC加密"""\n    iv = os.urandom(16)  # 初始化向量\n    padder = padding.PKCS7(128).padder()\n    padded_data = padder.update(plaintext.encode()) + padder.finalize()\n    \n    cipher = Cipher(algorithms.AES(key), modes.CBC(iv))\n    encryptor = cipher.encryptor()\n    ciphertext = encryptor.update(padded_data) + encryptor.finalize()\n    return iv + ciphertext  # IV放在密文前面\n\ndef aes_decrypt(ciphertext_with_iv, key):\n    """AES-CBC解密"""\n    iv = ciphertext_with_iv[:16]\n    ciphertext = ciphertext_with_iv[16:]\n    \n    cipher = Cipher(algorithms.AES(key), modes.CBC(iv))\n    decryptor = cipher.decryptor()\n    padded_data = decryptor.update(ciphertext) + decryptor.finalize()\n    \n    unpadder = padding.PKCS7(128).unpadder()\n    plaintext = unpadder.update(padded_data) + unpadder.finalize()\n    return plaintext.decode()\n\n# 演示\nkey = os.urandom(32)  # AES-256密钥\nplaintext = "这是需要加密的敏感数据"\nencrypted = aes_encrypt(plaintext, key)\nprint(f"明文: {plaintext}")\nprint(f"密文(hex): {encrypted.hex()[:40]}...")\nprint(f"解密: {aes_decrypt(encrypted, key)}")','explanation':'完整的AES-256-CBC加解密实现，包含PKCS7填充和随机IV生成'}],
        6: [{'title':'文件哈希与完整性校验','language':'python','code':'import hashlib\nimport os\n\ndef file_hash(filepath, algorithm="sha256"):\n    """计算文件哈希值"""\n    h = hashlib.new(algorithm)\n    with open(filepath, "rb") as f:\n        while chunk := f.read(8192):\n            h.update(chunk)\n    return h.hexdigest()\n\ndef verify_integrity(filepath, expected_hash):\n    """验证文件完整性"""\n    actual = file_hash(filepath)\n    match = actual == expected_hash\n    print(f"文件: {os.path.basename(filepath)}")\n    print(f"期望: {expected_hash[:20]}...")\n    print(f"实际: {actual[:20]}...")\n    print(f"结果: {'✅ 文件完整' if match else '❌ 文件被篡改!'}")\n    return match\n\n# 演示\nfrom cryptography.hazmat.primitives.asymmetric import rsa, padding\nfrom cryptography.hazmat.primitives import hashes, serialization\n\n# 生成RSA密钥对\nprivate_key = rsa.generate_private_key(\n    public_exponent=65537, key_size=2048\n)\npublic_key = private_key.public_key()\n\n# 签名\nmessage = b"重要文件内容"\nsignature = private_key.sign(\n    message,\n    padding.PSS(mgf=padding.MGF1(hashes.SHA256()), salt_length=padding.PSS.MAX_LENGTH),\n    hashes.SHA256()\n)\nprint(f"签名(hex): {signature.hex()[:40]}...")\n\n# 验证签名\ntry:\n    public_key.verify(\n        signature, message,\n        padding.PSS(mgf=padding.MGF1(hashes.SHA256()), salt_length=padding.PSS.MAX_LENGTH),\n        hashes.SHA256()\n    )\n    print("✅ 签名验证通过 - 消息未被篡改")\nexcept:\n    print("❌ 签名验证失败 - 消息被篡改!")','explanation':'文件哈希计算、完整性校验、RSA数字签名验证的完整实现'}],
        7: [{'title':'HTTP分析和安全头检查','language':'python','code':'import requests\nfrom urllib.parse import urlparse\n\ndef analyze_http_response(url):\n    """分析HTTP响应安全头"""\n    try:\n        resp = requests.get(url, timeout=10, allow_redirects=True)\n        print(f"=== {url} ===")\n        print(f"状态码: {resp.status_code}")\n        print(f"服务器: {resp.headers.get(\'Server\', \'N/A\')}")\n        \n        # 安全头检查\n        security_headers = {\n            \'Content-Security-Policy\': \'内容安全策略\',\n            \'Strict-Transport-Security\': \'HSTS强制HTTPS\',\n            \'X-Content-Type-Options\': \'MIME类型嗅探防护\',\n            \'X-Frame-Options\': \'点击劫持防护\',\n            \'X-XSS-Protection\': \'XSS过滤\',\n            \'Referrer-Policy\': \'Referrer策略\',\n            \'Permissions-Policy\': \'功能权限策略\'\n        }\n        \n        print("\\n安全头检查:")\n        score = 0\n        total = len(security_headers)\n        for header, desc in security_headers.items():\n            if header in resp.headers:\n                print(f"  ✅ {header} ({desc})")\n                score += 1\n            else:\n                print(f"  ❌ {header} ({desc}) - 缺失")\n        \n        print(f"\\n安全评分: {score}/{total} ({score*100//total}%)")\n        return resp\n    except Exception as e:\n        print(f"请求失败: {e}")','explanation':'HTTP响应安全头分析工具，检查HSTS、CSP、X-Frame-Options等安全配置'}],
        8: [{'title':'XSS攻击向量演示','language':'python','code':'# XSS攻击向量示例(仅供学习)\nimport html\n\ndef demonstrate_xss_vectors():\n    """展示常见XSS攻击向量及防御方法"""\n    xss_payloads = [\n        \'<script>alert(1)</script>\',\n        \'<img src=x onerror=alert(1)>\',\n        \'<svg onload=alert(1)>\',\n        \'javascript:alert(1)\',\n        \'<body onload=alert(1)>\',\n    ]\n    \n    print("=== XSS攻击向量与防御 ===\\n")\n    for payload in xss_payloads:\n        escaped = html.escape(payload)\n        print(f"原始: {payload}")\n        print(f"转义: {escaped}")\n        print(f"安全: {\'✅\' if escaped != payload else \'❌\'}")\n        print()\n\n# HTML实体转义函数\ndef xss_filter(user_input):\n    """简单XSS过滤器"""\n    return html.escape(user_input, quote=True)\n\n# 测试\nprint("=== 用户输入过滤测试 ===")\ntest_inputs = [\n    "正常用户名",\n    "<script>alert(\'xss\')</script>",\n    "<img src=x onerror=\'alert(1)\'>",\n]\n\nfor input_str in test_inputs:\n    filtered = xss_filter(input_str)\n    is_safe = filtered == html.escape(input_str)\n    print(f"输入: {input_str[:40]}")\n    print(f"过滤: {filtered[:60]}")\n    print(f"安全: {\'✅\' if is_safe else \'⚠️ 需额外检查\'}\\n")','explanation':'展示常见XSS攻击向量、HTML实体转义防御机制和Content-Security-Policy配置'}],
        9: [{'title':'CSRF防御实现','language':'python','code':'# CSRF攻击演示与防御实现\nimport secrets\nimport hashlib\n\nclass CSRFTokenManager:\n    def __init__(self, secret_key=None):\n        self.secret_key = secret_key or secrets.token_hex(32)\n    \n    def generate_token(self, session_id):\n        """生成CSRF Token(SHA256签名方案)"""\n        nonce = secrets.token_hex(16)\n        signature = hashlib.sha256(\n            f"{session_id}{nonce}{self.secret_key}".encode()\n        ).hexdigest()\n        return f"{nonce}.{signature}"\n    \n    def validate_token(self, session_id, token):\n        """验证CSRF Token\"\"\"\n        if \'.\' not in token:\n            return False\n        nonce, provided_sig = token.split(\'.\', 1)\n        expected_sig = hashlib.sha256(\n            f"{session_id}{nonce}{self.secret_key}".encode()\n        ).hexdigest()\n        return secrets.compare_digest(provided_sig, expected_sig)\n\n# 演示\ntoken_mgr = CSRFTokenManager()\nprint("=== CSRF防御模拟 ===\\n")\n\n# 正常请求\nsession = "user_session_123"\ntoken = token_mgr.generate_token(session)\nprint(f"Session: {session}")\nprint(f"CSRF Token: {token[:30]}...")\nprint(f"验证结果(正确): {token_mgr.validate_token(session, token)}")\n\n# 攻击者尝试\nfrom_other_site = "attacker_session_456"\nprint(f"\\n攻击者直接使用Token: {token_mgr.validate_token(from_other_site, token)}")\nprint(f"攻击者伪造Token: {token_mgr.validate_token(session, \'fake.1234\')}")','explanation':'CSRF Token生成和验证机制实现，展示基于签名的Token防伪造方案'}],
        10: [{'title':'文件类型检测与安全上传','language':'python','code':'import magic  # python-magic\nimport os\n\n# 文件类型白名单\nALLOWED_MIME = {\n    \'image/jpeg\': [\'.jpg\', \'.jpeg\'],\n    \'image/png\': [\'.png\'],\n    \'image/gif\': [\'.gif\'],\n    \'application/pdf\': [\'.pdf\'],\n    \'text/plain\': [\'.txt\'],\n}\n\ndef safe_file_upload(filepath):\n    """安全文件上传检查\"\"\"\n    if not os.path.exists(filepath):\n        return "文件不存在"\n    \n    filename = os.path.basename(filepath)\n    ext = os.path.splitext(filename)[1].lower()\n    \n    # 1. 检查扩展名白名单\n    valid_exts = [e for exts in ALLOWED_MIME.values() for e in exts]\n    if ext not in valid_exts:\n        return f"禁止的文件类型: {ext}"\n    \n    # 2. 检查MIME类型\n    try:\n        mime_type = magic.from_file(filepath, mime=True)\n    except:\n        mime_type = "unknown"\n    \n    if mime_type not in ALLOWED_MIME:\n        return f"MIME类型不匹配: {mime_type}"\n    \n    # 3. 扩展名与MIME一致\n    if ext not in ALLOWED_MIME[mime_type]:\n        return f"扩展名与文件类型不匹配: {ext} vs {mime_type}"\n    \n    # 4. 检查可疑内容\n    with open(filepath, \'rb\') as f:\n        header = f.read(1024)\n        if b\'<?php\' in header or b\'<script\' in header:\n            return "检测到脚本代码，拒绝上传"\n    \n    return f"✅ 文件检查通过: {filename} ({mime_type})"\n\n# 演示\nprint("=== 文件上传安全检查 ===\\n")\ntest_files = ["test.jpg", "shell.php.jpg", "document.pdf"]\nfor f in test_files:\n    path = os.path.join("/tmp", f)\n    if os.path.exists(path):\n        print(f"{f}: {safe_file_upload(path)}\")','explanation':'多层文件上传安全检查：白名单扩展名+MIME类型验证+文件头内容扫描'}],
    }
    return examples.get(day_num, [{'title':'安全编码实践','language':'python','code':'# 安全编程要点\\n# 1. 输入验证\\n# 2. 参数化查询\\n# 3. 输出编码\\n# 4. 错误处理\\nprint("Practice secure coding!")','explanation':'本日安全编码练习'}])


print("Supplement generation script ready!")
print(f"Basic plan: generated {len(get_basic_day_quizzes(1, ''))} sample questions for day 1")
print(f"Penetration & defense plans need additional content generation")
