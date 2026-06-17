import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { Card, Button } from '../../components/UI';

export const BurpSimulator: React.FC = () => {
  const [url, setUrl] = useState('http://example.com/login');
  const [method, setMethod] = useState('POST');
  const [headers, setHeaders] = useState('Content-Type: application/x-www-form-urlencoded\nUser-Agent: Mozilla/5.0');
  const [body, setBody] = useState('username=admin&password=test');
  const [response, setResponse] = useState('');
  const [history, setHistory] = useState<{method:string;url:string;time:string}[]>([]);

  const handleSend = () => {
    const res = `HTTP/1.1 200 OK
Server: nginx/1.24.0
Date: ${new Date().toUTCString()}
Content-Type: application/json
Set-Cookie: session=demo123; HttpOnly; Secure

{
  "status": "success",
  "message": "模拟响应",
  "request": {
    "method": "${method}",
    "url": "${url}",
    "headers_sent": ${JSON.stringify(headers.split('\n').reduce((acc,l)=>{const[p,...v]=l.split(':');if(p&&v.length)acc[p.trim()]=v.join(':').trim();return acc;},{} as any))},
    "body": "${body.replace(/"/g,'\\"')}"
  }
}`;
    setResponse(res);
    setHistory([{method,url,time:new Date().toLocaleTimeString()},...history.slice(0,19)]);
  };

  return (
    <div className="space-y-4">
      <Card className="border-orange-600/20">
        <div className="space-y-3">
          <div className="flex gap-2">
            <select value={method} onChange={e => setMethod(e.target.value)}
              className="px-3 py-2 bg-cyber-black/50 border border-gray-700 rounded-lg text-white text-sm">
              <option>GET</option><option>POST</option><option>PUT</option><option>DELETE</option><option>PATCH</option><option>OPTIONS</option>
            </select>
            <input value={url} onChange={e => setUrl(e.target.value)}
              className="flex-1 px-4 py-2 bg-cyber-black/50 border border-gray-700 rounded-lg text-white text-sm outline-none focus:border-orange-500"/>
            <Button onClick={handleSend} className="!bg-orange-600 text-white hover:!bg-orange-500">
              <Send size={16}/> 发送
            </Button>
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Headers:</label>
            <textarea value={headers} onChange={e => setHeaders(e.target.value)}
              className="w-full px-4 py-2 bg-cyber-black/50 border border-gray-700 rounded-lg text-white text-xs outline-none focus:border-orange-500 h-20 font-mono"/>
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Body:</label>
            <textarea value={body} onChange={e => setBody(e.target.value)}
              className="w-full px-4 py-2 bg-cyber-black/50 border border-gray-700 rounded-lg text-white text-xs outline-none focus:border-orange-500 h-20 font-mono"/>
          </div>
        </div>
      </Card>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          {response && (
            <Card className="border-green-500/20">
              <h4 className="text-sm text-green-400 mb-2">📥 Response</h4>
              <pre className="p-3 bg-black/70 rounded-lg text-xs text-gray-300 overflow-x-auto max-h-[300px] overflow-y-auto font-mono whitespace-pre-wrap">{response}</pre>
            </Card>
          )}
        </div>
        <div>
          <Card className="border-gray-700">
            <h4 className="text-sm text-gray-400 mb-2">📋 历史记录 ({history.length})</h4>
            <div className="space-y-1 max-h-[300px] overflow-y-auto">
              {history.map((h, i) => (
                <div key={i} className="flex items-center gap-2 p-1.5 rounded bg-cyber-black/30 text-xs">
                  <span className={`px-1.5 py-0.5 rounded ${h.method==='GET'?'bg-green-500/20 text-green-400':h.method==='POST'?'bg-blue-500/20 text-blue-400':'bg-yellow-500/20 text-yellow-400'}`}>{h.method}</span>
                  <span className="text-gray-400 truncate flex-1">{h.url}</span>
                  <span className="text-gray-600">{h.time}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
