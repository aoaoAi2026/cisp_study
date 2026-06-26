🗺️ 超详细靶场搭建与练习手册（终极版）
🖥️ 第一阶段：Web安全基础 (约2-3周)

目标：在Windows本机上搭建集成环境，理解最基础的Web漏洞原理。
1. DVWA (Damn Vulnerable Web Application)

    简介：Web安全入门的“教科书”，包含暴力破解、命令注入、CSRF、文件包含、文件上传、SQL注入、XSS等10个漏洞模块，每个模块有Low/Medium/High/Impossible四种安全等级。

    下载地址：

        PHPStudy（小皮面板）：https://www.xp.cn/download.html

        DVWA源码：https://github.com/digininja/DVWA（点击Code → Download ZIP）

        DVWA百度网盘备用：https://pan.baidu.com/s/1GGupf9DdWK9K1GsB0jizfA?pwd=q7dm 提取码: q7dm

    部署步骤：

        安装PHPStudy：运行安装包，路径不要包含中文或空格。

        启动服务：打开PHPStudy，启动 Apache 和 MySQL 服务。

        切换PHP版本：在“软件管理”→“PHP”中，启用 PHP 7.3或7.4 版本（DVWA对PHP版本有要求）。

        验证环境：浏览器访问 http://localhost，看到欢迎页即成功。

        放置源码：将DVWA源码解压，放入PHPStudy的WWW目录下（默认D:\phpstudy_pro\WWW\），重命名文件夹为dvwa 方便访问。

        配置文件：进入dvwa/config/目录，复制config.inc.php.dist并重命名为config.inc.php。用记事本打开，将$_DVWA[ 'db_password' ] = 'p@ssw0rd';改为$_DVWA[ 'db_password' ] = 'root';（PHPStudy默认数据库密码是root）。

        创建数据库（可选）：在PHPStudy中创建数据库dvwa，用户名dvwa，密码root123（或跳过此步，在下一步由DVWA自动创建）。

        初始化：浏览器访问 http://localhost/dvwa/setup.php，点击 “Create/Reset Database” 按钮。

        登录：使用默认账号 admin / password 登录。

    常见问题：

        allow_url_include 报错：修改PHPStudy的php.ini文件，将allow_url_include = Off改为On，重启Apache。

        reCAPTCHA密钥错误：在config.inc.php文件末尾添加：
        text

        $_DVWA[ 'recaptcha_public_key' ] = '6LdK7xITAAzzAAJQTfL7fu6I-0aPl8KHHieAT_yJg';
        $_DVWA[ 'recaptcha_private_key' ] = '6LdK7xITAzzAAL_uw9YXVUOPoIHPZLfw2K1n5NVQ';

        数据库连接失败：检查config.inc.php中的数据库密码是否与PHPStudy中MySQL的设置一致（默认为root）。

2. SQLi-Labs

    简介：SQL注入专项练习场，共75种不同类型的注入关卡。

    下载地址：

        官方GitHub：https://github.com/Audi-1/sqli-labs

    部署步骤：

        将源码解压到PHPStudy的WWW目录下。

        进入sql-connections/目录，打开db-creds.inc文件，将数据库用户名和密码修改为root。

        浏览器访问 http://localhost/sqli-labs/，点击页面上的 “Setup/reset Database for Labs” 链接初始化数据库。看到“Database has been reset!”即成功。

3. Upload-Labs

    简介：文件上传漏洞专项靶场，共21关。

    ⚠️ 特别提醒：此靶场需要PHP 5.2.17旧版本环境，强烈建议直接使用作者提供的专用集成环境，不要用新版PHPStudy手动配置。

    下载地址：

        官方GitHub：https://github.com/c0ny1/upload-labs

        专用集成环境：在GitHub项目页的“README”中找upload-labs-env-win-0.1-beta.1下载链接

    部署步骤：

        下载专用集成环境，解压到没有中文的路径下。

        进入upload-labs-env-win-0.1-beta.1\upload-labs-env\WWW目录，删除里面所有文件。

        下载最新21关源码，解压后所有文件放入此WWW目录。

        在集成环境根目录下，先运行modify_path.bat文件。

        双击phpstudy.exe启动Apache和MySQL服务。

        浏览器访问 http://localhost/upload-labs/ 即可。

4. Pikachu

    简介：优秀的中文漏洞练习平台，覆盖XSS、SQL注入等多种漏洞场景。

    下载地址：

        官方GitHub：https://github.com/zhuifengshaonianhanlu/pikachu

        百度网盘备用：https://pan.baidu.com/s/1lDd8siHqgb444nqIH6pLcg 提取码: cp2r

    部署步骤：

        将源码解压到PHPStudy的WWW目录下，重命名为pikachu 。

        进入pikachu/inc/目录，打开config.inc.php，将数据库密码修改为root。

        创建网站：在PHPStudy中点击“网站”→“创建网站”，域名随意填，PHP版本选择5.6.9，根目录选择pikachu文件夹。

        浏览器访问 http://localhost/pikachu/install.php（如果端口冲突改成了84，则访问http://localhost:84/install.php），点击 “安装/初始化” 。

🖥️ 第二阶段：VulnHub入门实战 (约2-3周)

目标：挑战完整虚拟机，熟悉完整的渗透测试流程。
5. Jangow: 1.0.1

    简介：公认的新手友好型入门靶机。

    下载地址：https://www.vulnhub.com/entry/jangow-101,754/

    部署步骤：

        导入：VMware中“文件”→“打开”，选择下载的.ova文件。

        网络：将网络适配器设置为 NAT模式。

        启动：启动靶机，无需登录。

        找IP：在Kali终端用sudo arp-scan -l或sudo netdiscover -r 192.168.x.0/24找到靶机IP。

6. Kioptrix Level 1

    简介：VulnHub上最经典的入门靶机之一。

    下载地址：https://www.vulnhub.com/entry/kioptrix-level-1-1,22/

    ⚠️ 网络配置（特别重要） ：此靶机默认桥接模式可能无法获取IP。解决方法：

        关闭靶机，在VMware中移除网络适配器。

        找到靶机的.vmx文件，用记事本打开，删除所有以“ethernet0”开头的条目并保存。

        重新导入虚拟机，新增一个NAT模式的网络适配器。

🐳 第三阶段：Web专项与漏洞复现 (约3-4周)

目标：接触真实世界漏洞。
7. Vulhub

    简介：基于Docker的漏洞环境集合，一键复现CVE漏洞。

    部署方式（在Kali或Ubuntu虚拟机中操作）：

        安装Docker：curl -fsSL https://get.docker.com | bash -s docker --mirror Aliyun

        安装Docker-Compose：
        bash

        # 下载docker-compose
        sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
        # 添加执行权限
        sudo chmod +x /usr/local/bin/docker-compose
        # 验证
        docker-compose --version

        获取Vulhub：git clone https://github.com/vulhub/vulhub.git

        启动漏洞环境：进入漏洞目录（如/vulhub/tomcat/CVE-2017-12615/），执行docker-compose up -d

        关闭环境：在对应目录执行docker-compose down

🚀 第四阶段：VulnHub进阶实战 (持续进行)
8. DC-1

    简介：经典入门级靶机，适合新手磨练技能。

    下载地址：https://www.vulnhub.com/entry/dc-1,292/

    部署步骤：

        导入：VMware中“文件”→“打开”，选择下载的.ova文件。

        内存：分配至少1GB内存。

        网络：设置为 NAT模式。

        启动：启动靶机。

💎 总结
阶段	靶场	核心目标	推荐周期
第一阶段	DVWA, SQLi-Labs, Upload-Labs, Pikachu	理解Web漏洞原理	2-3周
第二阶段	Jangow, Kioptrix Level 1	熟悉渗透测试完整流程	2-3周
第三阶段	Vulhub	接触并复现真实世界漏洞	3-4周
第四阶段	DC-1, DC-2, Mr-Robot等	提升综合实战能力	持续进行

    善用Writeup：打靶卡住是常态，善用网上的Writeup是学习的重要一环。

    记录笔记：把你敲的每一条命令和思路都记下来，方便复盘。

如果在搭建过程中遇到任何问题，随时截图发给我！