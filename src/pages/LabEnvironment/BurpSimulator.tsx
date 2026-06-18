import React, { useState } from 'react';
import { Send, Copy, Trash2, ArrowRightLeft, Shield, AlertTriangle, Eye, Globe, Lock, Code } from 'lucide-react';
import { Card, Button } from '../../components/UI';

/** 预置的测试请求模板 */
const templates = [
  {
    name:'普通登录',
    method:'POST',
    url:'http://example.com/api/login',
    headers:'Content-Type: application/json\nAuthorization: Bearer eyJ...',
    body:'{"username":"admin","password":"test123"}',
  },
  {
    name:'SQL注入探测',
    method:'GET',
    url:"http://example.com/api/users?id=1' OR '1'='1",
    headers:'Content-Type: application/json',
    body:'',
    desc:'在URL参数中注入SQL探测payload',
  },
  {
    name:'XSS测试',
    method:'POST',
    url:'http://example.com/api/comment',
    headers:'Content-Type: application/json',
    body:'{"content":"<script>alert(1)</script>","author":"test"}',
    desc:'在POST body中注入XSS payload',
  },
  {
    name:'路径遍历',
    method:'GET',
    url:'http://example.com/api/files?path=../../../etc/passwd',
    headers:'',
    body:'',
    desc:'路径遍历尝试读取系统文件',
  },
  {
    name:'PUT上传',
    method:'PUT',
    url:'http://example.com/uploads/shell.jsp',
    headers:'Content-Type: application/jsp',
    body:'<% Runtime.getRuntime().exec(request.getParameter("cmd")); %>',
    desc:'尝试上传WebShell',
  },
  {
    name:'OPTIONS探测',
    method:'OPTIONS',
    url:'http://example.com/api/admin',
    headers:'',
    body:'',
    desc:'探测服务器支持的HTTP方法',
  },
];

/** 模拟的漏洞检测规则 */
const vulnRules = [
  { pattern: /'(\s*)(OR|AND|UNION)/i, name:'SQL注入', severity:'high', tip:'参数化查询 / ORM / 输入过滤' },
  { pattern: /<script|<img.*onerror|<svg.*onload|<iframe/i, name:'XSS跨站脚本', severity:'high', tip:'输出编码(CSP) / HTML实体转义' },
  { pattern: /\.\.\/|\.\.\\|etc\/passwd|win\.ini/i, name:'路径遍历', severity:'medium', tip:'路径白名单 / realpath规范化' },
  { pattern: /\$\\{|\\{\\{.*\\}\\}|<%=/i, name:'SSTI模板注入', severity:'high', tip:'沙箱模式 / 禁止用户输入进模板' },
  { pattern: /cmd=|exec\(|system\(|passthru/i, name:'命令注入', severity:'critical', tip:'避免拼接命令 / 使用参数数组' },
  { pattern: /127\.0\.0\.1|localhost|169\.254/i, name:'SSRF(内网探测)', severity:'medium', tip:'URL白名单 / 禁止内网IP' },
  { pattern: /\.jsp|\.php|\.asp/i, name:'WebShell上传', severity:'critical', tip:'文件类型白名单 / 内容检测' },
  { pattern: /<!(?:DOCTYPE|ENTITY)/i, name:'XXE外部实体', severity:'high', tip:'禁用外部实体 / DTD处理' },
  { pattern: /sleep\(|benchmark\(|waitfor\s+delay/i, name:'时间盲注', severity:'high', tip:'参数化查询 / 超时限制' },
  { pattern: /\\$\{(?:jndi|java)/i, name:'Log4Shell(JNDI注入)', severity:'critical', tip:'升级Log4j / 禁用lookup' },
];

export const BurpSimulator: React.FC = () => {
  const [url, setUrl] = useState('http://example.com/api/login');
  const [method, setMethod] = useState('POST');
  const [headers, setHeaders] = useState('Content-Type: application/json\nUser-Agent: SecurityLab/1.0');
  const [body, setBody] = useState('{"username":"admin","password":"test"}');
  const [response, setResponse] = useState('');
  const [history, setHistory] = useState<{method:string;url:string;time:string;size:number;status:number}[]>([]);
  const [alerts, setAlerts] = useState<{name:string;severity:string;tip:string}[]>([]);
  const [showCompare, setShowCompare] = useState(false);
  const [compareIdx, setCompareIdx] = useState(-1);

  const methodColors: Record<string, string> = {
    GET:'bg-green-500/20 text-green-400',
    POST:'bg-blue-500/20 text-blue-400',
    PUT:'bg-yellow-500/20 text-yellow-400',
    DELETE:'bg-red-500/20 text-red-400',
    PATCH:'bg-purple-500/20 text-purple-400',
    OPTIONS:'bg-cyan-500/20 text-cyan-400',
  };

  const handleSend = () => {
    // Vulnerability detection
    const foundAlerts: {name:string;severity:string;tip:string}[] = [];
    const allContent = `${url} ${headers} ${body}`;
    vulnRules.forEach(rule => {
      if (rule.pattern.test(allContent)) {
        foundAlerts.push({name:rule.name,severity:rule.severity,tip:rule.tip});
      }
    });
    setAlerts(foundAlerts);

    // Parse headers
    const parsedHeaders = headers.split('\n').reduce((acc,l) => {
      const [p,...v] = l.split(':');
      if(p&&v.length) acc[p.trim()] = v.join(':').trim();
      return acc;
    }, {} as Record<string,string>);

    // Build response
    const isMalicious = foundAlerts.length > 0;
    const statusCode = isMalicious ? 403 : 200;
    const responseBody = isMalicious
      ? `{\n  "status":"blocked",\n  "reason":"WAF拦截 - 检测到 ${foundAlerts.length} 个疑似攻击特征",\n  "alerts": ${JSON.stringify(foundAlerts.map(a=>({type:a.name,severity:a.severity})))},\n  "timestamp":"${new Date().toISOString()}",\n  "advice":"${foundAlerts.map(a=>a.tip).join('; ')}"\n}`
      : `{\n  "status":"success",\n  "message":"请求已处理",\n  "data":{\n    "id":${Math.floor(Math.random()*10000)},\n    "created":"${new Date().toISOString()}"\n  }\n}`;

    const res = `HTTP/1.1 ${statusCode} ${isMalicious?'Forbidden':'OK'}
Server: nginx/1.24.0 + ModSecurity
Date: ${new Date().toUTCString()}
Content-Type: application/json; charset=utf-8
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'
Set-Cookie: session=${Math.random().toString(36).substr(2,10)}; HttpOnly; Secure; SameSite=Strict
${isMalicious?'X-WAF-Rule-Triggered: true\nX-WAF-Alert-Count: '+foundAlerts.length:'X-WAF-Status: clean'}
Content-Length: ${responseBody.length}

${responseBody}`;

    setResponse(res);
    setHistory([{
      method,url,
      time:new Date().toLocaleTimeString(),
      size:responseBody.length,
      status:statusCode,
    },...history.slice(0,29)]);
  };

  const handleClearHistory = () => {
    setHistory([]);
    setResponse('');
    setAlerts([]);
  };

  const handleLoadTemplate = (tpl: typeof templates[0]) => {
    setUrl(tpl.url);
    setMethod(tpl.method);
    setHeaders(tpl.headers);
    setBody(tpl.body);
  };

  return (
    <div className="space-y-4">
      {/* Template quick load */}
      <Card className="border-orange-600/15">
        <h4 className="text-xs text-orange-400 mb-2 flex items-center gap-1">
          <Code size={12}/> 快速加载请求模板
        </h4>
        <div className="flex gap-1.5 flex-wrap">
          {templates.map((tpl, i) => (
            <button key={i} onClick={() => handleLoadTemplate(tpl)}
              className="px-2 py-1 rounded text-[11px] bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 transition border border-orange-500/20"
              title={tpl.desc}>
              <span className={`inline-block px-1 rounded text-[9px] mr-1 ${methodColors[tpl.method]?.split(' ')[0]}`}>
                {tpl.method}
              </span>
              {tpl.name}
            </button>
          ))}
        </div>
      </Card>

      {/* Request editor */}
      <Card className="border-orange-600/20">
        <div className="space-y-3">
          {/* Method + URL bar */}
          <div className="flex gap-2">
            <select value={method} onChange={e => setMethod(e.target.value)}
              className="px-3 py-2 bg-cyber-black/50 border border-gray-700 rounded-lg text-white text-sm outline-none focus:border-orange-500 cursor-pointer">
              <option>GET</option><option>POST</option><option>PUT</option><option>DELETE</option><option>PATCH</option><option>OPTIONS</option><option>HEAD</option>
            </select>
            <input value={url} onChange={e => setUrl(e.target.value)}
              placeholder="输入完整URL..."
              className="flex-1 px-4 py-2 bg-cyber-black/50 border border-gray-700 rounded-lg text-white text-sm outline-none focus:border-orange-500 font-mono"/>
            <Button onClick={handleSend} className="!bg-orange-600 text-white hover:!bg-orange-500">
              <Send size={16}/> 发送
            </Button>
          </div>

          {/* Headers */}
          <div>
            <label className="text-xs text-gray-400 mb-1 block flex items-center gap-1">
              <Globe size={12}/> Request Headers:
            </label>
            <textarea value={headers} onChange={e => setHeaders(e.target.value)}
              className="w-full px-3 py-2 bg-cyber-black/50 border border-gray-700 rounded-lg text-white text-xs outline-none focus:border-orange-500 h-20 font-mono"
              placeholder="Header: value (每行一个)"/>
          </div>

          {/* Body (show for non-GET methods) */}
          {method !== 'GET' && method !== 'OPTIONS' && method !== 'HEAD' && (
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Request Body:</label>
              <textarea value={body} onChange={e => setBody(e.target.value)}
                className="w-full px-3 py-2 bg-cyber-black/50 border border-gray-700 rounded-lg text-white text-xs outline-none focus:border-orange-500 h-20 font-mono"/>
            </div>
          )}

          {/* Alerts bar */}
          {alerts.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap p-2 rounded-lg bg-red-500/10 border border-red-500/20">
              <AlertTriangle size={14} className="text-red-400"/>
              <span className="text-xs text-red-400 font-medium">
                检测到 {alerts.length} 个安全问题:
              </span>
              {alerts.map((a,i) => (
                <span key={i} className={`text-[10px] px-1.5 py-0.5 rounded ${
                  a.severity==='critical'?'bg-red-500/30 text-red-200':
                  a.severity==='high'?'bg-orange-500/20 text-orange-300':
                  'bg-yellow-500/20 text-yellow-300'}`}>
                  {a.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Response + History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Response panel */}
        <div className="lg:col-span-2">
          {response ? (
            <Card className="border-green-500/20">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm text-green-400 flex items-center gap-2">
                  <Eye size={14}/> Response
                  {alerts.length > 0 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-400">
                      🚫 被拦截
                    </span>
                  )}
                </h4>
                <button onClick={() => {
                  navigator.clipboard.writeText(response).catch(()=>{});
                }} className="text-xs text-gray-600 hover:text-gray-400 transition">
                  <Copy size={12}/>
                </button>
              </div>
              <pre className="p-3 bg-black/70 rounded-lg text-xs text-gray-300 overflow-x-auto max-h-[400px] overflow-y-auto font-mono whitespace-pre-wrap leading-relaxed">
                {response}
              </pre>

              {/* Security tips when alerts */}
              {alerts.length > 0 && (
                <div className="mt-3 space-y-2">
                  <p className="text-xs text-orange-400 font-medium flex items-center gap-1">
                    <Shield size={12}/> 修复建议
                  </p>
                  {alerts.map((a,i) => (
                    <div key={i} className="flex items-start gap-2 p-2 rounded bg-red-500/5 border border-red-500/10">
                      <span className={`text-[10px] px-1 rounded ${
                        a.severity==='critical'?'bg-red-500/30':'bg-orange-500/20'}`}>
                        {a.severity}
                      </span>
                      <div>
                        <p className="text-[11px] text-gray-300">{a.name}</p>
                        <p className="text-[10px] text-gray-600 mt-0.5">💡 {a.tip}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          ) : (
            <Card className="border-gray-700/30 bg-cyber-black/20">
              <div className="text-center py-12">
                <Send size={32} className="text-gray-600 mx-auto mb-2"/>
                <p className="text-gray-500 text-sm">发送请求后在此查看响应</p>
                <p className="text-gray-600 text-[11px] mt-2">支持自动检测常见Web漏洞特征</p>
              </div>
            </Card>
          )}
        </div>

        {/* History sidebar */}
        <div>
          <Card className="border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm text-gray-400 flex items-center gap-2">
                📋 请求历史
                <span className="text-[10px] text-gray-600">({history.length})</span>
              </h4>
              {history.length > 0 && (
                <button onClick={handleClearHistory} className="text-xs text-gray-600 hover:text-red-400 transition">
                  <Trash2 size={12}/>
                </button>
              )}
            </div>
            {history.length === 0 ? (
              <p className="text-xs text-gray-600 py-8 text-center">暂无历史记录</p>
            ) : (
              <div className="space-y-1 max-h-[400px] overflow-y-auto">
                {history.map((h, i) => (
                  <div key={i}
                    onClick={() => {
                      setShowCompare(true);
                      setCompareIdx(i);
                    }}
                    className="flex items-center gap-2 p-1.5 rounded bg-cyber-black/30 text-xs hover:bg-cyber-black/50 cursor-pointer transition group">
                    <span className={`px-1 py-0.5 rounded text-[9px] font-mono ${methodColors[h.method]||'bg-gray-500/20 text-gray-400'}`}>
                      {h.method}
                    </span>
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${h.status<400?'bg-green-500':'bg-red-500'}`}/>
                    <span className="text-gray-400 truncate flex-1">{h.url.length>35?h.url.substring(0,35)+'...':h.url}</span>
                    <span className="text-gray-600 text-[9px]">{h.time}</span>
                    <span className="text-gray-600 text-[9px] opacity-0 group-hover:opacity-100 transition">
                      <ArrowRightLeft size={10}/>
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
