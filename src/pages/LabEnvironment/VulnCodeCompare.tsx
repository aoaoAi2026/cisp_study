import React, { useState } from 'react';
import { XCircle, CheckCircle } from 'lucide-react';
import { Card } from '../../components/UI';

export const VulnCodeCompare: React.FC = () => {
  const scenarios = [
    { id: 1, title: 'SQL注入', unsafe: `query = "SELECT * FROM users WHERE id = " + user_input\ncursor.execute(query)`, safe: `query = "SELECT * FROM users WHERE id = ?"\ncursor.execute(query, (user_input,))`, desc: '使用参数化查询防止SQL注入' },
    { id: 2, title: 'XSS攻击', unsafe: `element.innerHTML = user_comment`, safe: `element.textContent = user_comment\n// 或使用DOMPurify\nconst clean = DOMPurify.sanitize(user_comment)\nelement.innerHTML = clean`, desc: '使用textContent或HTML净化库防止XSS' },
    { id: 3, title: '命令注入', unsafe: `os.system("ping " + user_host)`, safe: `import subprocess\nsubprocess.run(["ping", user_host], shell=False)`, desc: '使用参数列表而非字符串拼接避免命令注入' },
    { id: 4, title: '不安全的反序列化', unsafe: `obj = pickle.loads(user_data)`, safe: `obj = json.loads(user_data)\n# 使用JSON替代pickle`, desc: '避免使用pickle等不安全反序列化，使用JSON' },
    { id: 5, title: '路径遍历', unsafe: `with open("/var/www/" + filename) as f:\n  return f.read()`, safe: `import os\nsafe_path = os.path.normpath("/var/www/" + filename)\nif not safe_path.startswith("/var/www/"):\n  raise Exception("Invalid path")\nwith open(safe_path) as f:\n  return f.read()`, desc: '使用路径规范化并验证路径前缀' },
    { id: 6, title: '硬编码密钥', unsafe: `API_KEY = "sk-abc123def456"\nSECRET = "mysecret123"`, safe: `import os\nAPI_KEY = os.environ.get("API_KEY")\nSECRET = os.environ.get("SECRET")`, desc: '使用环境变量或密钥管理服务存储敏感信息' },
    { id: 7, title: '弱加密算法', unsafe: `encrypted = md5(password)  # 不安全\ncipher = DES.new(key)`, safe: `import hashlib\nencrypted = hashlib.sha256(password.encode()).hexdigest()\nfrom Crypto.Cipher import AES\ncipher = AES.new(key, AES.MODE_GCM)`, desc: '使用SHA256+盐值和AES-GCM替代MD5和DES' },
    { id: 8, title: '无速率限制', unsafe: `@app.route('/login', methods=['POST'])\ndef login():\n  # 无限制尝试\n  return check_password()`, safe: `from flask_limiter import Limiter\nlimiter = Limiter(app)\n@app.route('/login', methods=['POST'])\n@limiter.limit("5 per minute")\ndef login():\n  return check_password()`, desc: '添加速率限制防止暴力破解' },
  ];

  const [current, setCurrent] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-2">
        {scenarios.map((s, i) => (
          <button key={s.id} onClick={() => { setCurrent(i); setShowAnswer(false); }}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-sm transition ${current===i ? 'bg-amber-500 text-black font-medium' : 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'}`}>
            {s.title}
          </button>
        ))}
      </div>
      <Card className="border-amber-500/20">
        <h3 className="text-amber-400 font-medium mb-2">{scenarios[current].title}</h3>
        <p className="text-xs text-gray-500 mb-4">{scenarios[current].desc}</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <XCircle size={14} className="text-red-400"/>
              <span className="text-xs text-red-400 font-medium">不安全代码</span>
            </div>
            <pre className="p-3 bg-red-500/5 border border-red-500/20 rounded-lg text-xs text-red-300 overflow-x-auto font-mono">{scenarios[current].unsafe}</pre>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle size={14} className="text-green-400"/>
              <span className="text-xs text-green-400 font-medium">安全修复</span>
            </div>
            <pre className="p-3 bg-green-500/5 border border-green-500/20 rounded-lg text-xs text-green-300 overflow-x-auto font-mono">{scenarios[current].safe}</pre>
          </div>
        </div>
      </Card>
    </div>
  );
};
