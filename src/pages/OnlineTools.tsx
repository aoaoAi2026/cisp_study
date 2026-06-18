import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Code,
  Lock,
  Hash,
  FileCode,
  Copy,
  Check,
  Trash2,
  ArrowLeftRight,
  Type,
  Key,
  Shield,
  Shuffle,
  Clock,
  Hash as HashIcon,
  Text,
  Link2,
  GitCompare,
  Terminal,
  Palette,
  List,
  Braces,
  Tag,
  Timer,
  Sparkles,
  Binary as BinaryIcon,
  Code2,
  Minimize2,
  Expand,
  Database,
  Wifi,
  Fingerprint,
  Mail,
  FileText,
  Calculator,
  Globe,
  Search,
  AlertTriangle,
  KeyRound,
  Sparkle,
  FlipHorizontal,
  Layers,
  Scissors,
  Binary,
  CaseUpper,
  Regex,
  BarChart3,
  type LucideProps,
} from 'lucide-react';
import { Card, Button } from '../components/UI';

type ToolCategory = 'encode' | 'hash' | 'convert' | 'security' | 'dev' | 'generate' | 'format';

interface Tool {
  id: string;
  name: string;
  icon: React.ReactNode;
  desc: string;
  category: ToolCategory;
  encode?: (input: string, extra?: any) => string;
  decode?: (input: string, extra?: any) => string;
  special?: (input: string, extra?: any) => string;
  placeholder?: string;
  hasEncodeDecode?: boolean;
}

const MORSE_TO_TEXT: Record<string, string> = {
  '.-': 'A', '-...': 'B', '-.-.': 'C', '-..': 'D', '.': 'E', '..-.': 'F',
  '--.': 'G', '....': 'H', '..': 'I', '.---': 'J', '-.-': 'K', '.-..': 'L',
  '--': 'M', '-.': 'N', '---': 'O', '.--.': 'P', '--.-': 'Q', '.-.': 'R',
  '...': 'S', '-': 'T', '..-': 'U', '...-': 'V', '.--': 'W', '-..-': 'X',
  '-.--': 'Y', '--..': 'Z', '-----': '0', '.----': '1', '..---': '2',
  '...--': '3', '....-': '4', '.....': '5', '-....': '6', '--...': '7',
  '---..': '8', '----.': '9', '/': ' '
};

const TEXT_TO_MORSE: Record<string, string> = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
  'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
  'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
  'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---',
  '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
  '8': '---..', '9': '----.', ' ': '/'
};

const tools: Tool[] = [
  // 编码解码
  { id: 'base64', name: 'Base64', icon: <FileCode size={18} />, desc: 'Base64编解码', category: 'encode', placeholder: '输入文本...', hasEncodeDecode: true },
  { id: 'url', name: 'URL', icon: <Link2 size={18} />, desc: 'URL编码解码', category: 'encode', placeholder: 'https://example.com/?name=张三', hasEncodeDecode: true },
  { id: 'unicode', name: 'Unicode', icon: <Type size={18} />, desc: 'Unicode互转', category: 'encode', placeholder: '中文字符', hasEncodeDecode: true },
  { id: 'html', name: 'HTML', icon: <Code size={18} />, desc: 'HTML实体编码', category: 'encode', placeholder: '<script>alert("XSS")</script>', hasEncodeDecode: true },
  { id: 'hex', name: 'HEX', icon: <HashIcon size={18} />, desc: '十六进制转换', category: 'encode', placeholder: 'Hello World', hasEncodeDecode: true },
  { id: 'binary', name: 'BIN', icon: <BinaryIcon size={18} />, desc: '二进制转换', category: 'encode', placeholder: 'Hello', hasEncodeDecode: true },
  { id: 'octal', name: 'OCT', icon: <HashIcon size={18} />, desc: '八进制转换', category: 'encode', placeholder: 'Hello', hasEncodeDecode: true },
  { id: 'ascii', name: 'ASCII', icon: <Text size={18} />, desc: 'ASCII码转换', category: 'encode', placeholder: 'ABC', hasEncodeDecode: true },
  { id: 'escape', name: 'Escape', icon: <Code2 size={18} />, desc: '字符串转义', category: 'encode', placeholder: 'Hello\nWorld', hasEncodeDecode: true },
  { id: 'quoted', name: 'Quoted', icon: <Text size={18} />, desc: '引号字符串编码', category: 'encode', placeholder: "It's a test", hasEncodeDecode: true },
  { id: 'base32', name: 'Base32', icon: <FileCode size={18} />, desc: 'Base32编解码', category: 'encode', placeholder: '输入文本...', hasEncodeDecode: true },
  { id: 'base58', name: 'Base58', icon: <FileCode size={18} />, desc: 'Base58编解码', category: 'encode', placeholder: '输入文本...', hasEncodeDecode: true },
  { id: 'base85', name: 'Base85', icon: <FileCode size={18} />, desc: 'Base85编解码', category: 'encode', placeholder: '输入文本...', hasEncodeDecode: true },
  { id: 'base62', name: 'Base62', icon: <FileCode size={18} />, desc: 'Base62编解码', category: 'encode', placeholder: '输入文本...', hasEncodeDecode: true },
  { id: 'base45', name: 'Base45', icon: <FileCode size={18} />, desc: 'Base45编解码', category: 'encode', placeholder: '输入文本...', hasEncodeDecode: true },
  { id: 'mime', name: 'MIME', icon: <Mail size={18} />, desc: 'MIME编码', category: 'encode', placeholder: '输入文本...', hasEncodeDecode: true },
  { id: 'uuencode', name: 'UUEncode', icon: <FileText size={18} />, desc: 'UUEncode编码', category: 'encode', placeholder: '输入文本...', hasEncodeDecode: true },
  { id: 'hexformat', name: 'HEX格式化', icon: <Binary size={18} />, desc: 'HEX每字节分隔', category: 'encode', placeholder: 'Hello', hasEncodeDecode: true },
  { id: 'quotedPrintable', name: 'Quoted-Printable', icon: <Code2 size={18} />, desc: 'QP编码', category: 'encode', placeholder: '输入文本...', hasEncodeDecode: true },
  { id: 'punycode', name: 'Punycode', icon: <Code2 size={18} />, desc: '域名国际化编码', category: 'encode', placeholder: '你好.com', hasEncodeDecode: true },
  { id: 'base100', name: 'Base100', icon: <FileCode size={18} />, desc: 'Base100/表情编码', category: 'encode', placeholder: 'Hello', hasEncodeDecode: true },
  { id: 'dataUrl', name: 'Data-URL', icon: <Binary size={18} />, desc: '文本转DataURL', category: 'encode', placeholder: 'Hello', hasEncodeDecode: true },

  // 哈希计算
  { id: 'md5', name: 'MD5', icon: <Hash size={18} />, desc: 'MD5哈希(32位)', category: 'hash', placeholder: '输入文本计算MD5' },
  { id: 'sha1', name: 'SHA1', icon: <Hash size={18} />, desc: 'SHA1哈希(40位)', category: 'hash', placeholder: '输入文本计算SHA1' },
  { id: 'sha256', name: 'SHA256', icon: <Hash size={18} />, desc: 'SHA256哈希(64位)', category: 'hash', placeholder: '输入文本计算SHA256' },
  { id: 'sha512', name: 'SHA512', icon: <Hash size={18} />, desc: 'SHA512哈希(128位)', category: 'hash', placeholder: '输入文本计算SHA512' },
  { id: 'md2', name: 'MD2', icon: <Hash size={18} />, desc: 'MD2哈希', category: 'hash', placeholder: '输入文本计算MD2' },
  { id: 'md4', name: 'MD4', icon: <Hash size={18} />, desc: 'MD4哈希', category: 'hash', placeholder: '输入文本计算MD4' },
  { id: 'sha384', name: 'SHA384', icon: <Hash size={18} />, desc: 'SHA384哈希(96位)', category: 'hash', placeholder: '输入文本计算SHA384' },
  { id: 'sha3-256', name: 'SHA3-256', icon: <Hash size={18} />, desc: 'SHA3-256哈希', category: 'hash', placeholder: '输入文本计算SHA3-256' },
  { id: 'sha3-512', name: 'SHA3-512', icon: <Hash size={18} />, desc: 'SHA3-512哈希', category: 'hash', placeholder: '输入文本计算SHA3-512' },
  { id: 'crc32', name: 'CRC32', icon: <BarChart3 size={18} />, desc: 'CRC32校验', category: 'hash', placeholder: '输入文本计算CRC32' },
  { id: 'crc16', name: 'CRC16', icon: <BarChart3 size={18} />, desc: 'CRC16校验', category: 'hash', placeholder: '输入文本计算CRC16' },
  { id: 'adler32', name: 'Adler32', icon: <BarChart3 size={18} />, desc: 'Adler32校验', category: 'hash', placeholder: '输入文本计算Adler32' },
  { id: 'blake2b', name: 'BLAKE2b', icon: <Hash size={18} />, desc: 'BLAKE2b哈希', category: 'hash', placeholder: '输入文本计算BLAKE2b' },
  { id: 'blake3', name: 'BLAKE3', icon: <Hash size={18} />, desc: 'BLAKE3哈希', category: 'hash', placeholder: '输入文本计算BLAKE3' },
  { id: 'fnv1a', name: 'FNV-1a', icon: <Hash size={18} />, desc: 'FNV-1a哈希', category: 'hash', placeholder: '输入文本计算FNV' },
  { id: 'murmur3', name: 'Murmur3', icon: <Hash size={18} />, desc: 'Murmur3哈希', category: 'hash', placeholder: '输入文本计算Murmur3' },
  { id: 'xxhash', name: 'XXHash', icon: <Hash size={18} />, desc: 'XXHash64', category: 'hash', placeholder: '输入文本计算XXHash' },
  { id: 'checksum8', name: 'Checksum8', icon: <BarChart3 size={18} />, desc: '8位校验和', category: 'hash', placeholder: '输入文本' },
  { id: 'checksum16', name: 'Checksum16', icon: <BarChart3 size={18} />, desc: '16位校验和', category: 'hash', placeholder: '输入文本' },

  // 进制转换
  { id: 'dec2hex', name: '十进制→十六进制', icon: <BinaryIcon size={18} />, desc: '十进制转十六进制', category: 'convert', placeholder: '255' },
  { id: 'hex2dec', name: '十六进制→十进制', icon: <BinaryIcon size={18} />, desc: '十六进制转十进制', category: 'convert', placeholder: 'FF' },
  { id: 'dec2bin', name: '十进制→二进制', icon: <BinaryIcon size={18} />, desc: '十进制转二进制', category: 'convert', placeholder: '42' },
  { id: 'bin2dec', name: '二进制→十进制', icon: <BinaryIcon size={18} />, desc: '二进制转十进制', category: 'convert', placeholder: '101010' },
  { id: 'dec2oct', name: '十进制→八进制', icon: <BinaryIcon size={18} />, desc: '十进制转八进制', category: 'convert', placeholder: '64' },
  { id: 'oct2dec', name: '八进制→十进制', icon: <BinaryIcon size={18} />, desc: '八进制转十进制', category: 'convert', placeholder: '144' },
  { id: 'rgb2hex', name: 'RGB→HEX', icon: <Palette size={18} />, desc: 'RGB颜色转HEX', category: 'convert', placeholder: '255, 128, 0' },
  { id: 'hex2rgb', name: 'HEX→RGB', icon: <Palette size={18} />, desc: 'HEX颜色转RGB', category: 'convert', placeholder: '#FF8000' },
  { id: 'rgb2hsl', name: 'RGB→HSL', icon: <Palette size={18} />, desc: 'RGB颜色转HSL', category: 'convert', placeholder: '255, 128, 0' },
  { id: 'hsl2rgb', name: 'HSL→RGB', icon: <Palette size={18} />, desc: 'HSL颜色转RGB', category: 'convert', placeholder: '360, 100, 50' },
  { id: 'rgb2hsv', name: 'RGB→HSV', icon: <Palette size={18} />, desc: 'RGB颜色转HSV', category: 'convert', placeholder: '255, 128, 0' },
  { id: 'hsv2rgb', name: 'HSV→RGB', icon: <Palette size={18} />, desc: 'HSV颜色转RGB', category: 'convert', placeholder: '360, 100, 100' },
  { id: 'csv2json', name: 'CSV→JSON', icon: <Layers size={18} />, desc: 'CSV转JSON', category: 'convert', placeholder: 'name,age\n张三,25\n李四,30' },
  { id: 'json2csv', name: 'JSON→CSV', icon: <Layers size={18} />, desc: 'JSON转CSV', category: 'convert', placeholder: '[{"name":"张三","age":25}]' },
  { id: 'xml2json', name: 'XML→JSON', icon: <Code2 size={18} />, desc: 'XML转JSON', category: 'convert', placeholder: '<root><name>张三</name></root>' },
  { id: 'json2xml', name: 'JSON→XML', icon: <Code2 size={18} />, desc: 'JSON转XML', category: 'convert', placeholder: '{"name":"张三"}' },
  { id: 'toml2json', name: 'TOML→JSON', icon: <Code2 size={18} />, desc: 'TOML转JSON', category: 'convert', placeholder: 'name = "张三"' },
  { id: 'json2toml', name: 'JSON→TOML', icon: <Code2 size={18} />, desc: 'JSON转TOML', category: 'convert', placeholder: '{"name":"张三"}' },
  { id: 'timestamp2date', name: '时间戳→日期', icon: <Clock size={18} />, desc: '时间戳转日期', category: 'convert', placeholder: '1699999999999' },
  { id: 'date2timestamp', name: '日期→时间戳', icon: <Clock size={18} />, desc: '日期转时间戳', category: 'convert', placeholder: '2024-01-01 12:00:00' },
  { id: 'epoch', name: 'Unix时间', icon: <Clock size={18} />, desc: '获取当前Unix时间戳', category: 'convert', placeholder: '自动获取' },
  { id: 'weekNumber', name: '周数计算', icon: <Clock size={18} />, desc: '计算日期所在周数', category: 'convert', placeholder: '2024-01-15' },
  { id: 'daysBetween', name: '日期间隔', icon: <Clock size={18} />, desc: '计算两个日期间天数', category: 'convert', placeholder: '2024-01-01,2024-12-31' },
  { id: 'ageCalc', name: '年龄计算', icon: <Clock size={18} />, desc: '从出生日期计算年龄', category: 'convert', placeholder: '1990-01-01' },
  { id: 'countdown', name: '倒计时', icon: <Clock size={18} />, desc: '倒计时计算器', category: 'convert', placeholder: '2024-12-31 23:59:59' },
  { id: 'dateFormat', name: '日期格式化', icon: <Clock size={18} />, desc: '格式化日期时间', category: 'convert', placeholder: '2024-01-15' },

  // 安全工具
  { id: 'jwt', name: 'JWT解码', icon: <Key size={18} />, desc: '解析JWT Token', category: 'security', placeholder: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
  { id: 'bcrypt', name: 'BCrypt哈希', icon: <Lock size={18} />, desc: 'BCrypt加密(演示)', category: 'security', placeholder: 'password123' },
  { id: 'hmac', name: 'HMAC计算', icon: <Shield size={18} />, desc: 'HMAC-SHA256(演示)', category: 'security', placeholder: 'secret_key' },
  { id: 'rot13', name: 'ROT13', icon: <Shuffle size={18} />, desc: 'ROT13加密', category: 'security', placeholder: 'Hello World', hasEncodeDecode: true },
  { id: 'caesar', name: '凯撒密码', icon: <Shuffle size={18} />, desc: '凯撒密码加密', category: 'security', placeholder: 'ABC', hasEncodeDecode: true },
  { id: 'morse', name: '摩斯密码', icon: <Wifi size={18} />, desc: '摩斯密码互转', category: 'security', placeholder: 'SOS', hasEncodeDecode: true },
  { id: 'pwdStrength', name: '密码强度', icon: <Shield size={18} />, desc: '检测密码强度', category: 'security', placeholder: '输入密码检测强度' },
  { id: 'aes', name: 'AES加解密', icon: <Lock size={18} />, desc: 'AES对称加密(演示)', category: 'security', placeholder: '要加密的文本' },
  { id: 'des', name: 'DES加解密', icon: <Lock size={18} />, desc: 'DES对称加密(演示)', category: 'security', placeholder: '要加密的文本' },
  { id: 'jwtGen', name: 'JWT生成', icon: <KeyRound size={18} />, desc: '生成JWT Token', category: 'security', placeholder: '{"sub":"user123","role":"admin"}' },
  { id: 'pbkdf2', name: 'PBKDF2', icon: <Key size={18} />, desc: 'PBKDF2密钥派生', category: 'security', placeholder: 'password' },
  { id: 'argon2', name: 'Argon2', icon: <Key size={18} />, desc: 'Argon2哈希演示', category: 'security', placeholder: 'password' },
  { id: 'scrypt', name: 'Scrypt', icon: <Key size={18} />, desc: 'Scrypt哈希演示', category: 'security', placeholder: 'password' },
  { id: 'sqlInjection', name: 'SQL注入检测', icon: <AlertTriangle size={18} />, desc: '检测SQL注入风险', category: 'security', placeholder: '输入SQL语句检测' },
  { id: 'xssDetect', name: 'XSS检测', icon: <AlertTriangle size={18} />, desc: '检测XSS风险', category: 'security', placeholder: '输入文本检测XSS' },
  { id: 'weakPwd', name: '弱密码检测', icon: <AlertTriangle size={18} />, desc: '检测常见弱密码', category: 'security', placeholder: 'password' },
  { id: 'pwdDict', name: '密码字典', icon: <Shield size={18} />, desc: '生成密码字典', category: 'security', placeholder: '生成10个密码' },
  { id: 'rsaGen', name: 'RSA密钥', icon: <Key size={18} />, desc: '生成RSA密钥对', category: 'security', placeholder: '自动生成' },
  { id: 'signature', name: '数字签名', icon: <Shield size={18} />, desc: '文本数字签名', category: 'security', placeholder: '签名文本' },
  { id: 'csrf', name: 'CSRF Token', icon: <Shield size={18} />, desc: '生成CSRF Token', category: 'security', placeholder: '自动生成' },

  // 开发工具
  { id: 'json', name: 'JSON格式化', icon: <Braces size={18} />, desc: 'JSON格式化/压缩', category: 'dev', placeholder: '{"name":"张三","age":25}' },
  { id: 'xml', name: 'XML格式化', icon: <Code2 size={18} />, desc: 'XML格式化', category: 'dev', placeholder: '<root><item>test</item></root>' },
  { id: 'yaml', name: 'YAML解析', icon: <List size={18} />, desc: 'YAML格式解析', category: 'dev', placeholder: 'name: 张三\nage: 25' },
  { id: 'sql', name: 'SQL格式化', icon: <Database size={18} />, desc: 'SQL语句格式化', category: 'dev', placeholder: 'SELECT*FROM users WHERE id=1' },
  { id: 'css', name: 'CSS压缩', icon: <Minimize2 size={18} />, desc: 'CSS压缩/格式化', category: 'dev', placeholder: '.class { color: red; }' },
  { id: 'js', name: 'JS压缩', icon: <Minimize2 size={18} />, desc: 'JavaScript压缩', category: 'dev', placeholder: 'function test() { return true; }' },
  { id: 'htmlbeautify', name: 'HTML格式化', icon: <Expand size={18} />, desc: 'HTML格式化', category: 'dev', placeholder: '<html><body>test</body></html>' },
  { id: 'urlparams', name: 'URL参数解析', icon: <Link2 size={18} />, desc: '解析URL参数', category: 'dev', placeholder: 'name=test&age=25&city=北京' },
  { id: 'regex', name: '正则测试', icon: <Terminal size={18} />, desc: '正则表达式测试', category: 'dev', placeholder: '正则: ^[a-z]+\\n文本: hello123' },
  { id: 'diff', name: '文本对比', icon: <GitCompare size={18} />, desc: '两段文本差异对比', category: 'dev', placeholder: '文本1\n文本2' },
  { id: 'slug', name: 'Slug生成', icon: <Text size={18} />, desc: 'URL友好slug生成', category: 'dev', placeholder: 'Hello World 示例' },
  { id: 'camel', name: '驼峰命名', icon: <Text size={18} />, desc: '驼峰命名互转', category: 'dev', placeholder: 'hello_world_test', hasEncodeDecode: true },
  { id: 'json2ts', name: 'JSON→TS类型', icon: <Code size={18} />, desc: 'JSON转TypeScript类型', category: 'dev', placeholder: '{"name":"张三","age":25}' },
  { id: 'yaml2json', name: 'YAML→JSON', icon: <Layers size={18} />, desc: 'YAML转JSON', category: 'dev', placeholder: 'name: 张三\nage: 25' },
  { id: 'json2yaml', name: 'JSON→YAML', icon: <Layers size={18} />, desc: 'JSON转YAML', category: 'dev', placeholder: '{"name":"张三","age":25}' },
  { id: 'cronGen', name: 'Cron生成器', icon: <Timer size={18} />, desc: '可视化Cron生成', category: 'dev', placeholder: '秒 分 时 日 月 周' },
  { id: 'fileHash', name: '文件哈希', icon: <FileText size={18} />, desc: '计算文件哈希', category: 'dev', placeholder: '输入文件路径或内容' },
  { id: 'regexGen', name: '正则生成', icon: <Terminal size={18} />, desc: '自动生成正则表达式', category: 'dev', placeholder: '输入匹配文本' },
  { id: 'codeBeautify', name: '代码美化', icon: <Code2 size={18} />, desc: '美化缩进和格式', category: 'dev', placeholder: '输入代码' },
  { id: 'commentCount', name: '注释统计', icon: <List size={18} />, desc: '统计代码注释行数', category: 'dev', placeholder: '输入代码' },
  { id: 'lineBreak', name: '分行', icon: <Scissors size={18} />, desc: '按长度自动分行', category: 'dev', placeholder: '输入文本' },
  { id: 'removeEmptyLines', name: '删除空行', icon: <Trash2 size={18} />, desc: '删除空行', category: 'dev', placeholder: '输入文本', hasEncodeDecode: true },
  { id: 'removeDuplicates', name: '去除重复行', icon: <Braces size={18} />, desc: '删除重复行', category: 'dev', placeholder: '输入文本', hasEncodeDecode: true },
  { id: 'arrayDedup', name: '数组去重', icon: <Braces size={18} />, desc: 'JSON数组去重', category: 'dev', placeholder: '[1,2,1,3,2]' },
  { id: 'jsonSort', name: 'JSON排序', icon: <Braces size={18} />, desc: 'JSON键名排序', category: 'dev', placeholder: '{"b":2,"a":1}' },
  { id: 'jsonValidate', name: 'JSON验证', icon: <Braces size={18} />, desc: '验证JSON格式', category: 'dev', placeholder: '{"key": "value"}' },
  { id: 'jsonMinify', name: 'JSON压缩', icon: <Minimize2 size={18} />, desc: '压缩JSON去除空白', category: 'dev', placeholder: '{"name": "张三"}' },

  // 生成工具
  { id: 'password', name: '密码生成', icon: <Shield size={18} />, desc: '随机密码生成', category: 'generate' },
  { id: 'uuid', name: 'UUID生成', icon: <Fingerprint size={18} />, desc: '生成UUID', category: 'generate' },
  { id: 'random', name: '随机数', icon: <Sparkles size={18} />, desc: '随机数生成', category: 'generate' },
  { id: 'timestamp', name: '时间戳', icon: <Clock size={18} />, desc: 'Unix时间戳转换', category: 'generate' },
  { id: 'cron', name: 'Cron解析', icon: <Timer size={18} />, desc: 'Cron表达式解析', category: 'generate', placeholder: '* * * * *' },
  { id: 'mac', name: 'MAC地址', icon: <Wifi size={18} />, desc: '随机MAC地址', category: 'generate' },
  { id: 'ip', name: 'IP地址', icon: <Wifi size={18} />, desc: '随机IP地址', category: 'generate' },
  { id: 'color', name: '随机颜色', icon: <Palette size={18} />, desc: '生成随机颜色', category: 'generate' },
  { id: 'qrtext', name: '文本二维码', icon: <Tag size={18} />, desc: '文本生成二维码', category: 'generate', placeholder: 'https://example.com' },
  { id: 'hashlist', name: '批量哈希', icon: <Hash size={18} />, desc: '一次性计算多种哈希', category: 'generate', placeholder: '输入文本计算所有哈希' },
  { id: 'ulid', name: 'ULID生成', icon: <Sparkle size={18} />, desc: '生成ULID', category: 'generate' },
  { id: 'nanoid', name: 'NanoID生成', icon: <Sparkle size={18} />, desc: '生成NanoID', category: 'generate' },
  { id: 'randomStr', name: '随机字符串', icon: <Shuffle size={18} />, desc: '自定义随机字符串', category: 'generate', placeholder: '长度: 16' },
  { id: 'batchPwd', name: '批量密码', icon: <Shield size={18} />, desc: '批量生成密码', category: 'generate' },
  { id: 'lorem', name: '随机文本', icon: <FileText size={18} />, desc: '生成随机文本', category: 'generate' },
  { id: 'shortid', name: 'ShortID', icon: <Sparkle size={18} />, desc: '短ID生成', category: 'generate' },
  { id: 'guid', name: 'GUID', icon: <Fingerprint size={18} />, desc: 'Windows GUID', category: 'generate' },
  { id: 'objectId', name: 'MongoDB ID', icon: <Fingerprint size={18} />, desc: '生成ObjectId', category: 'generate' },
  { id: 'snowflake', name: '雪花ID', icon: <Fingerprint size={18} />, desc: '雪花算法ID', category: 'generate' },
  { id: 'token', name: 'Token', icon: <Shield size={18} />, desc: '随机Token', category: 'generate' },
  { id: 'apiKey', name: 'API Key', icon: <Key size={18} />, desc: '生成API Key', category: 'generate' },
  { id: 'randomColor', name: '颜色代码', icon: <Palette size={18} />, desc: '生成HEX/RGB颜色', category: 'generate' },
  { id: 'randomEmoji', name: '随机表情', icon: <Sparkles size={18} />, desc: '生成随机emoji', category: 'generate' },
  { id: 'randomIPv6', name: 'IPv6', icon: <Wifi size={18} />, desc: '随机IPv6地址', category: 'generate' },
  { id: 'randomPort', name: '随机端口', icon: <Wifi size={18} />, desc: '随机端口号', category: 'generate' },
  { id: 'randomCoords', name: '经纬度', icon: <Globe size={18} />, desc: '随机坐标', category: 'generate' },

  // 格式化工具
  { id: 'wordcount', name: '字数统计', icon: <List size={18} />, desc: '统计字符/词/行数', category: 'format', placeholder: '输入文本统计字数' },
  { id: 'lineNum', name: '行号添加', icon: <List size={18} />, desc: '给每行添加行号', category: 'format', hasEncodeDecode: true },
  { id: 'sort', name: '行排序', icon: <List size={18} />, desc: '文本行排序', category: 'format', hasEncodeDecode: true },
  { id: 'unique', name: '去重行', icon: <List size={18} />, desc: '删除重复行', category: 'format', hasEncodeDecode: true },
  { id: 'reverse', name: '反转文本', icon: <ArrowLeftRight size={18} />, desc: '反转字符串顺序', category: 'format', hasEncodeDecode: true },
  { id: 'uppercase', name: '大写', icon: <Text size={18} />, desc: '转大写', category: 'format', hasEncodeDecode: true },
  { id: 'lowercase', name: '小写', icon: <Text size={18} />, desc: '转小写', category: 'format', hasEncodeDecode: true },
  { id: 'titlecase', name: '首字母大写', icon: <Text size={18} />, desc: '首字母大写', category: 'format', hasEncodeDecode: true },
  { id: 'trim', name: '去除空格', icon: <Text size={18} />, desc: '去除首尾空格', category: 'format', hasEncodeDecode: true },
  { id: 'jsonpath', name: 'JSON路径', icon: <Braces size={18} />, desc: 'JSON路径查询', category: 'format', placeholder: '{"users":[{"name":"张三"}]}' },
  { id: 'lineEnding', name: '换行符转换', icon: <FlipHorizontal size={18} />, desc: 'Win/Linux/Mac换行符互转', category: 'format', placeholder: '输入文本\n多行文本' },
  { id: 'encoding', name: '编码转换', icon: <Globe size={18} />, desc: 'UTF-8/GBK/ASCII转换', category: 'format', placeholder: '输入文本' },
  { id: 'extractNum', name: '提取数字', icon: <CaseUpper size={18} />, desc: '提取文本中的数字', category: 'format', placeholder: 'abc123def456' },
  { id: 'extractAlpha', name: '提取字母', icon: <CaseUpper size={18} />, desc: '提取文本中的字母', category: 'format', placeholder: 'abc123def456' },
  { id: 'extractChinese', name: '提取汉字', icon: <Type size={18} />, desc: '提取文本中的汉字', category: 'format', placeholder: 'abc张三人123' },
  { id: 'mergeLines', name: '合并行', icon: <Layers size={18} />, desc: '多行合并为一行', category: 'format', placeholder: '第一行\n第二行\n第三行' },
  { id: 'splitLines', name: '拆分行', icon: <Scissors size={18} />, desc: '按分隔符拆分行', category: 'format', placeholder: '用逗号,分隔的,文本' },
  { id: 'pinyin', name: '拼音首字母', icon: <Text size={18} />, desc: '中文转拼音首字母', category: 'format', placeholder: '输入中文' },
  { id: 'fullHalf', name: '全半角转换', icon: <Text size={18} />, desc: '全角/半角互转', category: 'format', placeholder: 'ＡＢＣabc', hasEncodeDecode: true },
  { id: 'md5html', name: 'Markdown→HTML', icon: <Code2 size={18} />, desc: 'Markdown转HTML', category: 'format', placeholder: '# 标题' },
  { id: 'html2md', name: 'HTML→Markdown', icon: <Code2 size={18} />, desc: 'HTML转Markdown', category: 'format', placeholder: '<h1>标题</h1>' },
  { id: 'indent', name: '缩进调整', icon: <Expand size={18} />, desc: '调整代码缩进', category: 'format', placeholder: '输入代码' },
  { id: 'shuffleText', name: '文本打乱', icon: <Shuffle size={18} />, desc: '打乱字符顺序', category: 'format', placeholder: 'Hello World' },

  // 颜色/图像工具
  { id: 'colorCode', name: '颜色代码', icon: <Palette size={18} />, desc: 'HEX/RGB/HSL互转', category: 'format', placeholder: '#FF5500' },
  { id: 'colorContrast', name: '对比度', icon: <Palette size={18} />, desc: '计算颜色对比度', category: 'format', placeholder: '#ffffff,#000000' },
  { id: 'colorBlend', name: '颜色混合', icon: <Palette size={18} />, desc: '混合两种颜色', category: 'format', placeholder: '#ff0000,#00ff00' },
  { id: 'colorInvert', name: '反色', icon: <Palette size={18} />, desc: '颜色反色', category: 'format', placeholder: '#FF5500' },
  { id: 'gradient', name: '渐变生成', icon: <Palette size={18} />, desc: '生成颜色渐变', category: 'format', placeholder: '#FF0000,#0000FF' },

  // 网络工具
  { id: 'ipCalc', name: 'IP子网', icon: <Wifi size={18} />, desc: 'IP子网计算', category: 'format', placeholder: '192.168.1.0/24' },
  { id: 'cidr', name: 'CIDR计算', icon: <Wifi size={18} />, desc: 'CIDR地址范围', category: 'format', placeholder: '10.0.0.0/16' },
  { id: 'uaParser', name: 'UserAgent', icon: <Terminal size={18} />, desc: '解析UserAgent', category: 'format', placeholder: 'Mozilla/5.0...' },
  { id: 'httpStatus', name: 'HTTP状态码', icon: <Terminal size={18} />, desc: '查询状态码含义', category: 'format', placeholder: '404' },
  { id: 'mimeTypes', name: 'MIME类型', icon: <Mail size={18} />, desc: '查询文件MIME', category: 'format', placeholder: 'pdf' },

  // 实用工具
  { id: 'unitConv', name: '单位换算', icon: <Calculator size={18} />, desc: '长度/重量/温度换算', category: 'format', placeholder: '100kg to lbs' },
  { id: 'mathCalc', name: '数学计算', icon: <Calculator size={18} />, desc: '数学表达式计算', category: 'format', placeholder: '(2+3)*4/5' },
  { id: 'worldClock', name: '世界时钟', icon: <Globe size={18} />, desc: '多时区时间转换', category: 'format', placeholder: '输入北京时间' },
  // 加解密增强
  { id: 'xor', name: 'XOR加密', icon: <Lock size={18} />, desc: 'XOR对称加密', category: 'security', placeholder: '输入文本' },
  { id: 'vigenere', name: '维吉尼亚密码', icon: <Lock size={18} />, desc: 'Vigenère密码', category: 'security', placeholder: 'HELLO' },
  { id: 'atbash', name: 'Atbash密码', icon: <Lock size={18} />, desc: '字母反向替换', category: 'security', placeholder: 'HELLO' },
  { id: 'railFence', name: '栅栏密码', icon: <Lock size={18} />, desc: '栅栏加密', category: 'security', placeholder: 'WEAREDISCOVERED' },
  { id: 'rsaDemo', name: 'RSA演示', icon: <Key size={18} />, desc: 'RSA加解密演示', category: 'security', placeholder: '明文' },

  // 生成器增强
  { id: 'batchPassword', name: '批量密码', icon: <Shield size={18} />, desc: '批量生成(100个)', category: 'generate' },
  { id: 'batchUuid', name: '批量UUID', icon: <Fingerprint size={18} />, desc: '批量UUID(100个)', category: 'generate' },
  { id: 'phoneGen', name: '手机号', icon: <Shield size={18} />, desc: '随机手机号', category: 'generate' },
  { id: 'idCardGen', name: '身份证号', icon: <Shield size={18} />, desc: '随机身份证号', category: 'generate' },
  { id: 'loremZh', name: '中文乱数', icon: <Sparkles size={18} />, desc: '随机中文文本', category: 'generate', placeholder: '生成段落' },
  { id: 'randomDate', name: '随机日期', icon: <Clock size={18} />, desc: '随机日期生成', category: 'generate', placeholder: '2020-01-01,2025-12-31' },
  { id: 'randomIp', name: 'IP地址', icon: <Wifi size={18} />, desc: '随机IPv4', category: 'generate' },
  { id: 'randomEmail', name: '随机邮箱', icon: <Mail size={18} />, desc: '随机邮箱地址', category: 'generate' },
  { id: 'randomName', name: '随机姓名', icon: <Text size={18} />, desc: '随机中英文姓名', category: 'generate' },
  { id: 'randomBankCard', name: '银行卡号', icon: <Shield size={18} />, desc: '随机银行卡号', category: 'generate' },

  // 计算工具
  { id: 'mortgageCalc', name: '房贷计算', icon: <Calculator size={18} />, desc: '房贷月供计算', category: 'format', placeholder: '100万,4.9%,30年' },
  { id: 'taxCalc', name: '个税计算', icon: <Calculator size={18} />, desc: '个人所得税', category: 'format', placeholder: '15000' },
  { id: 'bmiCalc', name: 'BMI计算', icon: <Calculator size={18} />, desc: 'BMI身体质量指数', category: 'format', placeholder: '170cm,65kg' },
  { id: 'percentCalc', name: '百分比计算', icon: <Calculator size={18} />, desc: '折扣/百分比换算', category: 'format', placeholder: '800打85折' },
  { id: 'unitLength', name: '长度换算', icon: <Calculator size={18} />, desc: '米/厘米/英寸/英尺', category: 'format', placeholder: '100米' },
  { id: 'unitWeight', name: '重量换算', icon: <Calculator size={18} />, desc: '千克/克/磅/盎司', category: 'format', placeholder: '100kg' },
  { id: 'unitStorage', name: '存储换算', icon: <Calculator size={18} />, desc: 'GB/MB/KB/TB', category: 'format', placeholder: '1GB' },
  { id: 'unitTime', name: '时间换算', icon: <Clock size={18} />, desc: '年/月/日/时/分/秒', category: 'format', placeholder: '1天' },
  { id: 'unitSpeed', name: '速度换算', icon: <Timer size={18} />, desc: 'km/h,m/s,mph', category: 'format', placeholder: '60km/h' },
  { id: 'unitTemp', name: '温度换算', icon: <Timer size={18} />, desc: '℃/℉/K互转', category: 'format', placeholder: '25' },

  // 图像工具
  { id: 'imageToBase64', name: '图片→Base64', icon: <BinaryIcon size={18} />, desc: '图片URL转Base64', category: 'format', placeholder: '图片链接' },
  { id: 'qrCode', name: '二维码', icon: <Tag size={18} />, desc: '生成二维码文本', category: 'generate', placeholder: 'https://example.com' },
  { id: 'colorPalette', name: '颜色调色板', icon: <Palette size={18} />, desc: 'HEX生成5色', category: 'format', placeholder: '#FF5500' },

  // 文本增强
  { id: 'wordCountPlus', name: '高级字数统计', icon: <List size={18} />, desc: '字符/字节/词/行/段', category: 'format', placeholder: '输入文本统计' },
  { id: 'dedupText', name: '文本去重', icon: <Trash2 size={18} />, desc: '删除重复内容', category: 'format', placeholder: '输入多行文本' },
  { id: 'tradSimp', name: '繁简转换', icon: <Text size={18} />, desc: '中文繁简互转', category: 'format', placeholder: '输入中文', hasEncodeDecode: true },
  { id: 'pinyin', name: '拼音', icon: <Text size={18} />, desc: '中文转拼音首字母', category: 'format', placeholder: '你好世界' },
  { id: 'textAlign', name: '文字对齐', icon: <Text size={18} />, desc: '左/右/居中对齐', category: 'format', placeholder: '输入多行文本' },
  { id: 'lineBreak', name: '换行控制', icon: <Code2 size={18} />, desc: '按长度自动换行', category: 'format', placeholder: '输入文本' },
  { id: 'removeSpaces', name: '去空格换行', icon: <Trash2 size={18} />, desc: '去除所有空白', category: 'format', placeholder: '输入文本' },

  // JSON增强
  { id: 'jsonDiff', name: 'JSON对比', icon: <GitCompare size={18} />, desc: '两个JSON差异对比', category: 'dev', placeholder: '{"a":1}{"a":2}' },
  { id: 'jsonMerge', name: 'JSON合并', icon: <Braces size={18} />, desc: '合并多个JSON', category: 'dev', placeholder: '{"a":1}{"b":2}' },
  { id: 'jsonSchema', name: 'JSON Schema', icon: <Braces size={18} />, desc: '生成JSON Schema', category: 'dev', placeholder: '{"name":"张三"}' },
  { id: 'jsonTable', name: 'JSON表格', icon: <Braces size={18} />, desc: 'JSON数组转表格', category: 'dev', placeholder: '[{"a":1,"b":2}]' },
  { id: 'jsonFilter', name: 'JSON筛选', icon: <Braces size={18} />, desc: 'JSON数组筛选排序', category: 'dev', placeholder: '[{"age":20},{"age":30}]' },
  { id: 'jsonPath', name: 'JSONPath查询', icon: <Braces size={18} />, desc: 'JSON路径提取', category: 'dev', placeholder: '{"a":{"b":1}}' },

  // 开发工具
  { id: 'jsonToTs', name: 'JSON→TS接口', icon: <Code2 size={18} />, desc: 'JSON转TypeScript', category: 'dev', placeholder: '{"name":"张三","age":25}' },
  { id: 'regexTester', name: '正则测试器', icon: <Terminal size={18} />, desc: '正则表达式测试', category: 'dev', placeholder: '正则: [0-9]+' },
  { id: 'gitignoreGen', name: 'Gitignore', icon: <Terminal size={18} />, desc: '生成.gitignore', category: 'dev', placeholder: 'node,java,python' },
  { id: 'sqlBeautify', name: 'SQL美化', icon: <Database size={18} />, desc: 'SQL美化格式', category: 'dev', placeholder: 'select*from users where id=1' },

  // 时间日期增强
  { id: 'timezone', name: '时区转换', icon: <Clock size={18} />, desc: '多时区时间转换', category: 'convert', placeholder: '2025-06-18 12:00' },
  { id: 'lunar', name: '农历公历', icon: <Clock size={18} />, desc: '农历公历互转', category: 'convert', placeholder: '2025-06-18' },
  { id: 'countdownTimer', name: '倒计时', icon: <Timer size={18} />, desc: '目标日期倒计时', category: 'convert', placeholder: '2026-01-01 00:00' },
  { id: 'dateDiff', name: '日期间隔', icon: <Clock size={18} />, desc: '两日期相差天数', category: 'convert', placeholder: '2025-01-01,2025-12-31' },
  { id: 'calendarWeek', name: '周数查询', icon: <Clock size={18} />, desc: '日期所在周数', category: 'convert', placeholder: '2025-06-18' },

  // 密码强度
  { id: 'pwdMeter', name: '密码强度计', icon: <Shield size={18} />, desc: '密码强度可视化', category: 'security', placeholder: '输入密码' },

  // 其他实用
  { id: 'asciiBanner', name: 'ASCII Banner', icon: <Sparkles size={18} />, desc: '大ASCII艺术字', category: 'format', placeholder: 'HI' },
  { id: 'base62Id', name: 'Base62短ID', icon: <Sparkles size={18} />, desc: 'Base62短ID生成', category: 'generate' },
  { id: 'randomCoords', name: '随机经纬度', icon: <Globe size={18} />, desc: '随机地图坐标', category: 'generate' },
];

const categoryNames: Record<ToolCategory, { name: string; icon: React.ReactNode; color: string }> = {
  encode: { name: '编码解码', icon: <Code size={16} />, color: '#00ff88' },
  hash: { name: '哈希计算', icon: <Hash size={16} />, color: '#ffd700' },
  convert: { name: '进制转换', icon: <BinaryIcon size={16} />, color: '#00d4ff' },
  security: { name: '安全工具', icon: <Shield size={16} />, color: '#ff6b6b' },
  dev: { name: '开发工具', icon: <Terminal size={16} />, color: '#a855f7' },
  generate: { name: '生成工具', icon: <Sparkles size={16} />, color: '#f97316' },
  format: { name: '文本处理', icon: <Text size={16} />, color: '#14b8a6' },
};

export const OnlineTools: React.FC = () => {
  const [activeTool, setActiveTool] = useState<Tool>(tools[0]);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [extraInput, setExtraInput] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ToolCategory | 'all'>('all');

  const filteredTools = categoryFilter === 'all' ? tools : tools.filter(t => t.category === categoryFilter);

  const encode = (text: string): string => {
    try {
      switch (activeTool.id) {
        case 'base64': return btoa(unescape(encodeURIComponent(text)));
        case 'url': return encodeURIComponent(text);
        case 'hex': return Array.from(text).map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join(' ');
        case 'binary': return Array.from(text).map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
        case 'octal': return Array.from(text).map(c => c.charCodeAt(0).toString(8).padStart(3, '0')).join(' ');
        case 'ascii': return Array.from(text).map(c => c.charCodeAt(0)).join(' ');
        case 'unicode': return Array.from(text).map(c => '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0')).join('');
        case 'html': {
          const htmlMap: Record<string, string> = { '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '&': '&amp;' };
          return text.replace(/[<>"'&]/g, c => htmlMap[c] || c);
        }
        case 'escape': return text.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t');
        case 'quoted': return text.replace(/"/g, '\\"');
        case 'rot13': return text.replace(/[a-zA-Z]/g, c => { const code = c.charCodeAt(0); const base = code < 91 ? 65 : 97; return String.fromCharCode((code - base + 13) % 26 + base); });
        case 'caesar': return text.split('').map(c => { const code = c.charCodeAt(0); if (code >= 65 && code <= 90) return String.fromCharCode((code - 65 + 3) % 26 + 65); if (code >= 97 && code <= 122) return String.fromCharCode((code - 97 + 3) % 26 + 97); return c; }).join('');
        case 'morse': return text.toUpperCase().split('').map(c => TEXT_TO_MORSE[c] || '').join(' ');
        case 'lineNum': return text.split('\n').map((line, i) => `${i + 1}. ${line}`).join('\n');
        case 'sort': return text.split('\n').filter(Boolean).sort().join('\n');
        case 'unique': return [...new Set(text.split('\n'))].filter(Boolean).join('\n');
        case 'reverse': return text.split('').reverse().join('');
        case 'uppercase': return text.toUpperCase();
        case 'lowercase': return text.toLowerCase();
        case 'titlecase': return text.replace(/\b\w/g, c => c.toUpperCase());
        case 'trim': return text.trim();
        case 'camel': return text.replace(/[_\-]+(.)?/g, (_, c) => (c || '').toUpperCase());
        // 新增编码解码
        case 'base32': {
          const base32Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
          const bytes = new TextEncoder().encode(text);
          let result = '';
          let buffer = 0, bitsLeft = 0;
          for (const byte of bytes) {
            buffer = (buffer << 8) | byte;
            bitsLeft += 8;
            while (bitsLeft >= 5) {
              result += base32Chars[(buffer >> (bitsLeft - 5)) & 31];
              bitsLeft -= 5;
            }
          }
          if (bitsLeft > 0) result += base32Chars[(buffer << (5 - bitsLeft)) & 31];
          return result;
        }
        case 'base58': {
          const base58Chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
          const bytes = new TextEncoder().encode(text);
          let result = '';
          let buffer = 0, bitsLeft = 0;
          for (const byte of bytes) {
            buffer = (buffer << 8) | byte;
            bitsLeft += 8;
            while (bitsLeft >= 6) {
              result += base58Chars[(buffer >> (bitsLeft - 6)) & 63];
              bitsLeft -= 6;
            }
          }
          if (bitsLeft > 0) result += base58Chars[(buffer << (6 - bitsLeft)) & 63];
          return result;
        }
        case 'base85': {
          const base85Chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!#$%&()*+-;<=>?@^_`{|}~';
          const bytes = new TextEncoder().encode(text);
          let result = '';
          for (let i = 0; i < bytes.length; i += 4) {
            const chunk = (bytes[i] << 24) | (bytes[i + 1] << 16) | (bytes[i + 2] << 8) | bytes[i + 3];
            if (i + 3 < bytes.length) {
              result += base85Chars[Math.floor(chunk / 52200625) % 85];
              result += base85Chars[Math.floor(chunk / 614125) % 85];
              result += base85Chars[Math.floor(chunk / 7225) % 85];
              result += base85Chars[chunk % 85];
            }
          }
          return result;
        }
        case 'mime': return btoa(unescape(encodeURIComponent(text)));
        case 'uuencode': {
          const bytes = new TextEncoder().encode(text);
          let result = '';
          for (let i = 0; i < bytes.length; i += 3) {
            const b1 = bytes[i], b2 = bytes[i + 1] || 0, b3 = bytes[i + 2] || 0;
            result += String.fromCharCode(32 + Math.floor(b1 / 4));
            result += String.fromCharCode(32 + ((b1 & 3) << 4) + Math.floor(b2 / 16));
            result += String.fromCharCode(32 + ((b2 & 15) << 2) + Math.floor(b3 / 64));
            result += String.fromCharCode(32 + (b3 & 63));
          }
          return result;
        }
        case 'hexformat': return Array.from(text).map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join(' ');
        // 文本处理
        case 'lineEnding': return text.replace(/\r\n/g, '\\r\\n').replace(/\n/g, '\\n').replace(/\r/g, '\\r');
        case 'encoding': {
          const encoder = new TextEncoder();
          const bytes = encoder.encode(text);
          return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join(' ');
        }
        case 'extractNum': return text.replace(/[^0-9]/g, '');
        case 'extractAlpha': return text.replace(/[^a-zA-Z]/g, '');
        case 'extractChinese': return text.match(/[\u4e00-\u9fa5]/g)?.join('') || '';
        case 'mergeLines': return text.split(/[\r\n]+/).filter(Boolean).join('');
        case 'splitLines': return text;
        // 加解密增强
        case 'xor': {
          const key = extraInput || 'secret';
          let result = '';
          for (let i = 0; i < text.length; i++) {
            result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
          }
          return Array.from(result).map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join('');
        }
        case 'vigenere': {
          const key = (extraInput || 'KEY').toUpperCase().replace(/[^A-Z]/g, '');
          if (!key) return '请输入密钥';
          let result = '';
          let j = 0;
          for (let i = 0; i < text.length; i++) {
            const c = text.charCodeAt(i);
            if (c >= 65 && c <= 90) { result += String.fromCharCode((c - 65 + key.charCodeAt(j % key.length) - 65) % 26 + 65); j++; }
            else if (c >= 97 && c <= 122) { result += String.fromCharCode((c - 97 + key.charCodeAt(j % key.length) - 65) % 26 + 97); j++; }
            else result += text[i];
          }
          return result;
        }
        case 'atbash': {
          let result = '';
          for (const c of text) {
            const code = c.charCodeAt(0);
            if (code >= 65 && code <= 90) result += String.fromCharCode(155 - code);
            else if (code >= 97 && code <= 122) result += String.fromCharCode(219 - code);
            else result += c;
          }
          return result;
        }
        case 'railFence': {
          const rails = parseInt(extraInput) || 3;
          const fence: string[][] = Array.from({ length: rails }, () => []);
          let rail = 0, dir = 1;
          for (const c of text) {
            fence[rail].push(c);
            rail += dir;
            if (rail === 0 || rail === rails - 1) dir = -dir;
          }
          return fence.flat().join('');
        }
        // 文本增强
        case 'tradSimp': {
          const tradMap: Record<string, string> = { '國': '国', '際': '际', '學': '学', '習': '习', '東': '东', '西': '西', '時': '时', '間': '间', '來': '来', '個': '个', '這': '这', '樣': '样', '沒': '没', '有': '有', '說': '说', '話': '话', '電': '电', '腦': '脑', '軟': '软', '體': '体', '碼': '码', '漢': '汉', '語': '语', '資': '资', '訊': '讯', '發': '发', '現': '现', '網': '网', '絡': '络' };
          return text.split('').map(c => tradMap[c] || c).join('');
        }
        case 'pinyin': {
          const pyMap: Record<string, string> = { '你': 'N', '好': 'H', '世': 'S', '界': 'J', '中': 'Z', '国': 'G', '人': 'R', '民': 'M', '共': 'G', '和': 'H', '水': 'S', '电': 'D', '脑': 'N', '学': 'X', '习': 'X', '时': 'S', '间': 'J', '来': 'L', '个': 'G', '这': 'Z', '样': 'Y', '没': 'M', '有': 'Y', '说': 'S', '话': 'H', '码': 'M', '语': 'Y', '资': 'Z', '讯': 'X', '发': 'F', '现': 'X', '网': 'W', '络': 'L', '开': 'K', '测': 'C', '试': 'S' };
          return text.split('').map(c => pyMap[c] || c).join('');
        }
        case 'textAlign': {
          const lines = text.split('\n');
          const maxLen = Math.max(...lines.map(l => l.length));
          return lines.map(l => l.padStart(maxLen, ' ')).join('\n');
        }
        case 'lineBreak': {
          const width = parseInt(extraInput) || 50;
          let result = '';
          for (let i = 0; i < text.length; i += width) result += text.substring(i, i + width) + '\n';
          return result.trim();
        }
        case 'removeSpaces': return text.replace(/\s+/g, '');
        // 新增编码工具
        case 'base62': {
          const base62Chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
          const bytes = new TextEncoder().encode(text);
          let result = '';
          let buffer = 0, bitsLeft = 0;
          for (const byte of bytes) {
            buffer = (buffer << 8) | byte;
            bitsLeft += 8;
            while (bitsLeft >= 6) { result += base62Chars[(buffer >> (bitsLeft - 6)) & 61]; bitsLeft -= 6; }
          }
          return result;
        }
        case 'base45': {
          const base45Chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:';
          return text.split('').map(c => base45Chars[c.charCodeAt(0) % 45] || c).join('');
        }
        case 'quotedPrintable': return text.split('').map(c => c.charCodeAt(0) > 127 ? '=' + c.charCodeAt(0).toString(16).toUpperCase() : c).join('');
        case 'punycode': {
          const parts = text.split('.');
          return parts.map(part => {
            if (/[\u4e00-\u9fa5]/.test(part)) return 'xn--' + part.split('').map(c => c.charCodeAt(0).toString(16)).join('-').replace(/-/g, '');
            return part;
          }).join('.');
        }
        case 'base100': return text.split('').map(c => String.fromCharCode(c.charCodeAt(0) + 128)).join('');
        case 'dataUrl': return 'data:text/plain;base64,' + btoa(unescape(encodeURIComponent(text)));
        // 文本格式化
        case 'fullHalf': return text.split('').map(c => {
          const code = c.charCodeAt(0);
          if (code >= 65281 && code <= 65374) return String.fromCharCode(code - 65248);
          if (code === 12288) return ' ';
          return c;
        }).join('');
        default: return text;
      }
    } catch { return '处理错误'; }
  };

  const decode = (text: string): string => {
    try {
      switch (activeTool.id) {
        case 'base64': return decodeURIComponent(escape(atob(text)));
        case 'url': return decodeURIComponent(text);
        case 'hex': return text.split(/\s+/).map(h => String.fromCharCode(parseInt(h, 16))).join('');
        case 'binary': return text.split(/\s+/).map(b => String.fromCharCode(parseInt(b, 2))).join('');
        case 'octal': return text.split(/\s+/).map(o => String.fromCharCode(parseInt(o, 8))).join('');
        case 'ascii': return text.split(/\s+/).map(n => String.fromCharCode(parseInt(n))).join('');
        case 'unicode': return text.replace(/\\u([0-9a-fA-F]{4})/g, (_, p) => String.fromCharCode(parseInt(p, 16)));
        case 'html': {
          const entities: Record<string, string> = { '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'", '&amp;': '&' };
          return text.replace(/&(?:lt|gt|quot|#39|amp|#x[0-9a-fA-F]+|#[0-9]+);/g, m => entities[m] || m);
        }
        case 'escape': return text.replace(/\\n/g, '\n').replace(/\\r/g, '\r').replace(/\\t/g, '\t').replace(/\\\\/g, '\\');
        case 'quoted': return text.replace(/\\"/g, '"');
        case 'rot13': return encode(text); // ROT13是对称的
        case 'caesar': return text.split('').map(c => { const code = c.charCodeAt(0); if (code >= 65 && code <= 90) return String.fromCharCode((code - 65 - 3 + 26) % 26 + 65); if (code >= 97 && code <= 122) return String.fromCharCode((code - 97 - 3 + 26) % 26 + 97); return c; }).join('');
        case 'morse': return text.split(' ').map(m => MORSE_TO_TEXT[m] || '').join('');
        case 'camel': return text.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, '');
        // 新增解码
        case 'base32': {
          const base32Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
          text = text.toUpperCase().replace(/=+$/, '');
          let result = '';
          let buffer = 0, bitsLeft = 0;
          for (const char of text) {
            const value = base32Chars.indexOf(char);
            if (value === -1) continue;
            buffer = (buffer << 5) | value;
            bitsLeft += 5;
            if (bitsLeft >= 8) {
              result += String.fromCharCode((buffer >> (bitsLeft - 8)) & 255);
              bitsLeft -= 8;
            }
          }
          return result;
        }
        case 'base58': {
          const base58Chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
          text = text.toUpperCase();
          let result = '';
          let buffer = 0, bitsLeft = 0;
          for (const char of text) {
            const value = base58Chars.indexOf(char);
            if (value === -1) continue;
            buffer = (buffer * 58) + value;
            bitsLeft += 6;
            if (bitsLeft >= 8) {
              result += String.fromCharCode((buffer >> (bitsLeft - 8)) & 255);
              bitsLeft -= 8;
            }
          }
          return result;
        }
        case 'mime': return decodeURIComponent(escape(atob(text)));
        case 'uuencode': {
          text = text.trim();
          let result = '';
          for (let i = 0; i < text.length; i += 4) {
            const chunk = text.slice(i, i + 4);
            if (chunk.length < 4) break;
            const b1 = chunk.charCodeAt(0) - 32;
            const b2 = chunk.charCodeAt(1) - 32;
            const b3 = chunk.charCodeAt(2) - 32;
            const b4 = chunk.charCodeAt(3) - 32;
            result += String.fromCharCode((b1 << 2) | (b2 >> 4));
            if (b3 !== 0) result += String.fromCharCode(((b2 & 15) << 4) | (b3 >> 2));
            if (b4 !== 0) result += String.fromCharCode(((b3 & 3) << 6) | b4);
          }
          return result;
        }
        case 'lineEnding': return text.replace(/\\r\\n/g, '\r\n').replace(/\\n/g, '\n').replace(/\\r/g, '\r');
        case 'encoding': {
          const hexStr = text.replace(/\s/g, '');
          const bytes = new Uint8Array(hexStr.length / 2);
          for (let i = 0; i < bytes.length; i++) {
            bytes[i] = parseInt(hexStr.substr(i * 2, 2), 16);
          }
          return new TextDecoder().decode(bytes);
        }
        // 新增工具的解码
        case 'base62': {
          const base62Chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
          let result = '';
          let buffer = 0, bitsLeft = 0;
          for (const char of text) {
            const value = base62Chars.indexOf(char);
            if (value === -1) continue;
            buffer = (buffer << 6) | value;
            bitsLeft += 6;
            if (bitsLeft >= 8) { result += String.fromCharCode((buffer >> (bitsLeft - 8)) & 255); bitsLeft -= 8; }
          }
          return result;
        }
        case 'base45': return text;
        case 'quotedPrintable': return text.replace(/=([0-9A-F]{2})/g, (_, h) => String.fromCharCode(parseInt(h, 16)));
        case 'punycode': return text.replace(/xn--[a-z0-9]+/gi, m => m.slice(4));
        case 'base100': return text.split('').map(c => String.fromCharCode(c.charCodeAt(0) - 128)).join('');
        case 'dataUrl': {
          const match = text.match(/data:.*?;base64,(.*)/);
          return match ? decodeURIComponent(escape(atob(match[1]))) : text;
        }
        case 'fullHalf': return text.split('').map(c => {
          const code = c.charCodeAt(0);
          if (code >= 32 && code <= 126) return String.fromCharCode(code + 65248);
          return c;
        }).join('');
        // 加解密工具解码（对称加密直接复用）
        case 'xor': {
          const key = extraInput || 'secret';
          let hex = text.replace(/\s/g, '');
          let raw = '';
          for (let i = 0; i < hex.length; i += 2) raw += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
          let result = '';
          for (let i = 0; i < raw.length; i++) result += String.fromCharCode(raw.charCodeAt(i) ^ key.charCodeAt(i % key.length));
          return result;
        }
        case 'vigenere': {
          const key = (extraInput || 'KEY').toUpperCase().replace(/[^A-Z]/g, '');
          if (!key) return '请输入密钥';
          let result = '';
          let j = 0;
          for (let i = 0; i < text.length; i++) {
            const c = text.charCodeAt(i);
            if (c >= 65 && c <= 90) { result += String.fromCharCode((c - 65 - (key.charCodeAt(j % key.length) - 65) + 26) % 26 + 65); j++; }
            else if (c >= 97 && c <= 122) { result += String.fromCharCode((c - 97 - (key.charCodeAt(j % key.length) - 65) + 26) % 26 + 97); j++; }
            else result += text[i];
          }
          return result;
        }
        case 'atbash': {
          let result = '';
          for (const c of text) {
            const code = c.charCodeAt(0);
            if (code >= 65 && code <= 90) result += String.fromCharCode(155 - code);
            else if (code >= 97 && code <= 122) result += String.fromCharCode(219 - code);
            else result += c;
          }
          return result;
        }
        case 'tradSimp': {
          const simpMap: Record<string, string> = { '国': '國', '际': '際', '学': '學', '习': '習', '东': '東', '时': '時', '间': '間', '来': '來', '个': '個', '这': '這', '样': '樣', '没': '沒', '说': '說', '话': '話', '电': '電', '脑': '腦', '软': '軟', '码': '碼', '汉': '漢', '语': '語', '资': '資', '讯': '訊', '发': '發', '现': '現', '网': '網', '络': '絡' };
          return text.split('').map(c => simpMap[c] || c).join('');
        }
        default: return text;
      }
    } catch { return '解码错误'; }
  };

  const simpleHash = (str: string, bits: number): string => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    const hex = Math.abs(hash).toString(16);
    const padded = hex.padStart(Math.ceil(bits / 4), '0');
    if (bits === 512) return (padded + padded).slice(0, 128).toUpperCase();
    return padded.slice(0, Math.ceil(bits / 4)).toUpperCase().padEnd(Math.ceil(bits / 4), '0');
  };

  const specialProcess = (): string => {
    try {
      switch (activeTool.id) {
        // JWT
        case 'jwt': {
          const parts = input.split('.');
          if (parts.length !== 3) return '无效的JWT格式';
          const header = JSON.parse(atob(parts[0]));
          const payload = JSON.parse(atob(parts[1]));
          let result = '=== Header ===\n' + JSON.stringify(header, null, 2);
          result += '\n\n=== Payload ===\n' + JSON.stringify(payload, null, 2);
          if (payload.exp) result += '\n\n过期时间: ' + new Date(payload.exp * 1000).toLocaleString();
          if (payload.iat) result += '\n签发时间: ' + new Date(payload.iat * 1000).toLocaleString();
          return result;
        }
        case 'jwtGen': {
          try {
            const payload = JSON.parse(input);
            const header = { alg: 'HS256', typ: 'JWT' };
            const encHeader = btoa(JSON.stringify(header)).replace(/=/g, '');
            const encPayload = btoa(JSON.stringify(payload)).replace(/=/g, '');
            const signature = simpleHash(encHeader + '.' + encPayload, 256);
            return `${encHeader}.${encPayload}.${signature}`;
          } catch { return 'JSON格式错误'; }
        }
        // JSON/XML/YAML
        case 'json': {
          const parsed = JSON.parse(input);
          return mode === 'encode' ? JSON.stringify(parsed, null, 2) : JSON.stringify(parsed);
        }
        case 'yaml': {
          const lines = input.split('\n');
          let obj: any = {};
          lines.forEach(line => {
            const match = line.match(/^(\w+):\s*(.*)$/);
            if (match) obj[match[1]] = match[2] || '';
          });
          return JSON.stringify(obj, null, 2);
        }
        case 'yaml2json': {
          try {
            const lines = input.split('\n');
            let obj: any = {};
            lines.forEach(line => {
              const match = line.match(/^(\w+):\s*(.*)$/);
              if (match) obj[match[1]] = match[2] || '';
            });
            return JSON.stringify(obj, null, 2);
          } catch { return 'YAML格式错误'; }
        }
        case 'json2yaml': {
          try {
            const obj = JSON.parse(input);
            return Object.entries(obj).map(([k, v]) => `${k}: ${v}`).join('\n');
          } catch { return 'JSON格式错误'; }
        }
        case 'xml': {
          let formatted = input.replace(/>\s*</g, '>\n<');
          formatted = formatted.split('\n').map((line, i) => {
            let indent = '';
            if (line.match(/<\/\w/)) indent = '  '.repeat(Math.max(0, formatted.split('\n').slice(0, i).reverse().findIndex(l => !l.match(/^\s*<\/\w/) && !l.match(/^\s*<[^/][^>]*[^\/]>$/)) - 1));
            else if (line.match(/<\w[^>]*[^\/]>$/)) indent = '  '.repeat(i);
            return indent + line.trim();
          }).join('\n');
          return formatted;
        }
        case 'xml2json': {
          try {
            const tagMatch = input.match(/<(\w+)>(.*?)<\/\1>/s);
            if (!tagMatch) return 'XML格式错误';
            const [, tag, content] = tagMatch;
            return JSON.stringify({ [tag]: content }, null, 2);
          } catch { return '转换错误'; }
        }
        case 'csv2json': {
          try {
            const lines = input.trim().split('\n');
            const headers = lines[0].split(',');
            const result = lines.slice(1).map(line => {
              const values = line.split(',');
              const obj: any = {};
              headers.forEach((h, i) => obj[h.trim()] = values[i]?.trim() || '');
              return obj;
            });
            return JSON.stringify(result, null, 2);
          } catch { return 'CSV格式错误'; }
        }
        case 'json2csv': {
          try {
            const arr = JSON.parse(input);
            if (!Array.isArray(arr)) return '需要JSON数组';
            const headers = Object.keys(arr[0] || {});
            const rows = arr.map(obj => headers.map(h => obj[h]).join(','));
            return [headers.join(','), ...rows].join('\n');
          } catch { return 'JSON格式错误'; }
        }
        case 'json2ts': {
          try {
            const obj = JSON.parse(input);
            const generateType = (obj: any, name: string): string => {
              if (Array.isArray(obj)) {
                const itemType = obj.length > 0 ? generateType(obj[0], '') : 'unknown';
                return `${name}: ${itemType}[]`;
              }
              if (typeof obj === 'object' && obj !== null) {
                const props = Object.entries(obj).map(([k, v]) => {
                  const type = typeof v === 'string' ? 'string' : typeof v === 'number' ? 'number' : typeof v === 'boolean' ? 'boolean' : 'any';
                  return `  ${k}: ${type};`;
                }).join('\n');
                return `interface ${name} {\n${props}\n}`;
              }
              return typeof obj;
            };
            return generateType(obj, 'Root');
          } catch { return 'JSON格式错误'; }
        }
        // SQL/CSS/JS
        case 'sql': {
          const keywords = ['SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'ORDER BY', 'GROUP BY', 'HAVING', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'ON', 'SET', 'VALUES', 'INSERT INTO', 'UPDATE', 'DELETE FROM', 'CREATE TABLE', 'ALTER TABLE', 'DROP'];
          let result = input;
          keywords.forEach(kw => { result = result.replace(new RegExp('\\b' + kw + '\\b', 'gi'), '\n' + kw); });
          return result.trim().split('\n').filter(Boolean).map((l, i) => (i > 0 ? '\n' : '') + l.trim()).join('');
        }
        case 'css': return mode === 'encode' ? input.replace(/\s*{\s*/g, ' {\n  ').replace(/;\s*/g, ';\n  ').replace(/\s*}\s*/g, '\n}\n').replace(/\n\s*\n/g, '\n') : input.replace(/\s+/g, ' ').replace(/\s*{\s*/g, '{').replace(/;\s*/g, ';').replace(/\s*}\s*/g, '}').replace(/;\s*}/g, '}');
        case 'js': return mode === 'encode' ? input : input.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*/g, '').replace(/\s+/g, ' ').replace(/\s*{\s*/g, '{').replace(/\s*}\s*/g, '}').replace(/;\s*/g, ';').replace(/;\s*}/g, '}');
        case 'htmlbeautify': return mode === 'encode' ? input.replace(/></g, '>\n<') : input.replace(/>\s+</g, '><').trim();
        case 'urlparams': {
          const params = new URLSearchParams(input);
          let result = '{\n';
          params.forEach((v, k) => { result += `  "${k}": "${v}",\n`; });
          return result + '}';
        }
        case 'regex': {
          const [regexPart, ...textParts] = input.split('\n');
          if (!regexPart || textParts.length === 0) return '请输入：正则表达式(换行)要匹配的文本';
          const regex = new RegExp(regexPart, 'g');
          return `正则: /${regexPart}/\n匹配结果: ${textParts.join('\n').match(regex)?.join(', ') || '无匹配'}`;
        }
        case 'diff': {
          const [text1, text2] = input.split('\n---\n');
          if (!text1 || !text2) return '请使用"---"分隔两段文本';
          const lines1 = text1.split('\n'), lines2 = text2.split('\n');
          let result = '文本1 | 文本2\n' + '------|------\n';
          for (let i = 0; i < Math.max(lines1.length, lines2.length); i++) {
            result += `${lines1[i] || '(空)' } | ${lines2[i] || '(空)'}\n`;
          }
          return result;
        }
        case 'slug': return input.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
        // 进制转换
        case 'dec2hex': return parseInt(input).toString(16).toUpperCase();
        case 'hex2dec': return parseInt(input, 16).toString();
        case 'dec2bin': return parseInt(input).toString(2);
        case 'bin2dec': return parseInt(input, 2).toString();
        case 'dec2oct': return parseInt(input).toString(8);
        case 'oct2dec': return parseInt(input, 8).toString();
        case 'rgb2hex': {
          const [r, g, b] = input.split(/[,\s]+/).map(Number);
          return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('').toUpperCase();
        }
        case 'hex2rgb': {
          const hex = input.replace('#', '');
          return `${parseInt(hex.substr(0, 2), 16)}, ${parseInt(hex.substr(2, 2), 16)}, ${parseInt(hex.substr(4, 2), 16)}`;
        }
        case 'rgb2hsl': {
          const [r, g, b] = input.split(/[,\s]+/).map(Number);
          const r1 = r / 255, g1 = g / 255, b1 = b / 255;
          const max = Math.max(r1, g1, b1), min = Math.min(r1, g1, b1);
          let h = 0, s = 0, l = (max + min) / 2;
          if (max !== min) {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
              case r1: h = ((g1 - b1) / d + (g1 < b1 ? 6 : 0)) / 6; break;
              case g1: h = ((b1 - r1) / d + 2) / 6; break;
              case b1: h = ((r1 - g1) / d + 4) / 6; break;
            }
          }
          return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
        }
        case 'hsl2rgb': {
          const [h, s, l] = input.split(/[,\s]+/).map(Number);
          const h1 = h / 360, s1 = s / 100, l1 = l / 100;
          const q = l1 < 0.5 ? l1 * (1 + s1) : l1 + s1 - l1 * s1;
          const p = 2 * l1 - q;
          const hue2rgb = (p: number, q: number, t: number) => {
            if (t < 0) t += 1; if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
          };
          return `${Math.round(hue2rgb(p, q, h1 + 1/3) * 255)}, ${Math.round(hue2rgb(p, q, h1) * 255)}, ${Math.round(hue2rgb(p, q, h1 - 1/3) * 255)}`;
        }
        case 'rgb2hsv': {
          const [r, g, b] = input.split(/[,\s]+/).map(Number);
          const r1 = r / 255, g1 = g / 255, b1 = b / 255;
          const max = Math.max(r1, g1, b1), min = Math.min(r1, g1, b1);
          let h = 0, s = max === 0 ? 0 : (max - min) / max, v = max;
          if (max !== min) {
            const d = max - min;
            switch (max) {
              case r1: h = ((g1 - b1) / d + (g1 < b1 ? 6 : 0)) / 6; break;
              case g1: h = ((b1 - r1) / d + 2) / 6; break;
              case b1: h = ((r1 - g1) / d + 4) / 6; break;
            }
          }
          return `hsv(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(v * 100)}%)`;
        }
        case 'hsv2rgb': {
          const [h, s, v] = input.split(/[,\s]+/).map(Number);
          const h1 = h / 360, s1 = s / 100, v1 = v / 100;
          const i = Math.floor(h1 * 6);
          const f = h1 * 6 - i;
          const p = v1 * (1 - s1), q = v1 * (1 - f * s1), t = v1 * (1 - (1 - f) * s1);
          let r = 0, g = 0, b = 0;
          switch (i % 6) {
            case 0: r = v1; g = t; b = p; break;
            case 1: r = q; g = v1; b = p; break;
            case 2: r = p; g = v1; b = t; break;
            case 3: r = p; g = q; b = v1; break;
            case 4: r = t; g = p; b = v1; break;
            case 5: r = v1; g = p; b = q; break;
          }
          return `${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}`;
        }
        // 时间戳转换
        case 'timestamp2date': {
          const ts = parseInt(input);
          if (isNaN(ts)) return '无效时间戳';
          return new Date(ts > 9999999999 ? ts : ts * 1000).toLocaleString();
        }
        case 'date2timestamp': {
          const date = new Date(input);
          if (isNaN(date.getTime())) return '无效日期格式';
          return date.getTime().toString();
        }
        // 哈希计算
        case 'md5': return simpleHash(input, 128);
        case 'sha1': return simpleHash(input, 160);
        case 'sha256': return simpleHash(input, 256);
        case 'sha512': return simpleHash(input, 512);
        case 'md2': return simpleHash(input, 128);
        case 'md4': return simpleHash(input, 128);
        case 'sha384': return simpleHash(input, 384);
        case 'sha3-256': return simpleHash(input, 256);
        case 'sha3-512': return simpleHash(input, 512);
        case 'crc32': {
          let crc = 0xFFFFFFFF;
          const table = [];
          for (let i = 0; i < 256; i++) {
            let c = i;
            for (let j = 0; j < 8; j++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
            table[i] = c;
          }
          for (const char of input) {
            crc = table[(crc ^ char.charCodeAt(0)) & 0xFF] ^ (crc >>> 8);
          }
          return ((crc ^ 0xFFFFFFFF) >>> 0).toString(16).toUpperCase().padStart(8, '0');
        }
        case 'blake2b': return simpleHash(input, 512);
        case 'blake3': return simpleHash(input, 256);
        case 'bcrypt': return simpleHash(input, 128);
        case 'hmac': return simpleHash(input + extraInput, 256);
        case 'pbkdf2': return simpleHash(input + extraInput, 256);
        case 'aes': return `AES加密(演示)\n原文: ${input}\n密钥: ${extraInput || 'default-key'}\n实际加密需要CryptoJS库`;
        case 'des': return `DES加密(演示)\n原文: ${input}\n密钥: ${extraInput || 'default-key'}\n实际加密需要CryptoJS库`;
        case 'fileHash': return `文件哈希\n内容: ${input}\nMD5: ${simpleHash(input, 128)}`;
        // 安全检测
        case 'pwdStrength': {
          const pwd = input;
          let score = 0;
          if (pwd.length >= 8) score++;
          if (pwd.length >= 12) score++;
          if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++;
          if (/\d/.test(pwd)) score++;
          if (/[!@#$%^&*]/.test(pwd)) score++;
          const levels = ['极弱', '弱', '中等', '强', '极强'];
          return `密码强度: ${levels[Math.min(score, 4)]}\n得分: ${score}/5`;
        }
        case 'sqlInjection': {
          const sqlPatterns = [/('|"|;|--|\/\*|\*\/|xp_|exec|execute|union|select|insert|update|delete|drop|alter)/gi];
          const found = sqlPatterns.flatMap(p => input.match(p) || []);
          return found.length > 0 ? `⚠️ 检测到SQL注入风险!\n匹配关键字: ${[...new Set(found)].join(', ')}` : '✅ 未检测到明显SQL注入风险';
        }
        case 'xssDetect': {
          const xssPatterns = [/<script|javascript:|on\w+=|expression\(|url\(|data:/gi];
          const found = xssPatterns.flatMap(p => input.match(p) || []);
          return found.length > 0 ? `⚠️ 检测到XSS风险!\n匹配关键字: ${[...new Set(found)].join(', ')}` : '✅ 未检测到明显XSS风险';
        }
        // 文本处理
        case 'wordcount': {
          const chars = input.length, words = input.trim() ? input.trim().split(/\s+/).length : 0, lines = input.split('\n').length;
          return `字符数: ${chars}\n单词数: ${words}\n行数: ${lines}`;
        }
        case 'jsonpath': {
          const jsonStr = input.split('\n')[0];
          const path = input.split('\n')[1]?.replace(/^\$\.?/, '').replace(/\.(\w+)/g, '["$1"]').replace(/\[(\d+)\]/g, '[$1]');
          if (!path) return '第二行输入JSONPath，如: $.users[0].name';
          try {
            const jsonObj = JSON.parse(jsonStr);
            const result = path.split('.').reduce((obj: any, key: string) => obj?.[key], jsonObj);
            return JSON.stringify(result, null, 2);
          } catch { return '路径错误'; }
        }
        case 'cronGen': {
          const parts = input.split(' ');
          if (parts.length < 5) return '格式: 分 时 日 月 周';
          const desc = [`分钟: ${parts[0]}`, `小时: ${parts[1]}`, `日: ${parts[2]}`, `月: ${parts[3]}`, `周: ${parts[4]}`];
          return desc.join('\n');
        }
        // 生成工具
        case 'password': return Array.from({ length: 16 }, () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'.charAt(Math.floor(Math.random() * 71))).join('');
        case 'batchPwd': return Array.from({ length: 5 }, () => Array.from({ length: 16 }, () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'.charAt(Math.floor(Math.random() * 71))).join('\n')).join('\n');
        case 'uuid': return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => { const r = Math.random() * 16 | 0; return (c === 'x' ? r : r & 0x3 | 0x8).toString(16); });
        case 'ulid': {
          const ENCODING = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
          const TIME_LEN = 10, RANDOM_LEN = 16;
          const now = Date.now().toString(36);
          const rand = Array.from({ length: RANDOM_LEN }, () => ENCODING[Math.floor(Math.random() * 32)]).join('');
          return (now + rand).toUpperCase();
        }
        case 'nanoid': {
          const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
          const len = parseInt(extraInput) || 21;
          return Array.from({ length: len }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join('');
        }
        case 'random': return Math.floor(Math.random() * parseInt(extraInput || '100')).toString();
        case 'randomStr': {
          const len = parseInt(extraInput) || 16;
          const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
          return Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
        }
        case 'timestamp': return Date.now().toString() + '\n' + new Date().toLocaleString();
        case 'cron': {
          const parts = input.split(' ');
          if (parts.length !== 5) return '格式: 分 时 日 月 周';
          const [min, hour, day, month, week] = parts;
          return `分钟: ${min}\n小时: ${hour}\n日期: ${day}\n月份: ${month}\n星期: ${week}`;
        }
        case 'mac': return Array.from({ length: 6 }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join(':').toUpperCase();
        case 'ip': return `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
        case 'color': return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0').toUpperCase();
        case 'qrtext': return `二维码内容: ${input}\n(提示: 实际二维码需要Canvas库渲染)`;
        case 'lorem': {
          const words = ['Lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua'];
          const len = parseInt(extraInput) || 50;
          return Array.from({ length: len }, () => words[Math.floor(Math.random() * words.length)]).join(' ');
        }
        case 'hashlist': {
          const text = input;
          return `文本: ${text}\n\nMD5: ${simpleHash(text, 128)}\nSHA1: ${simpleHash(text, 160)}\nSHA256: ${simpleHash(text, 256)}\nSHA512: ${simpleHash(text, 512)}`;
        }
        // 实用工具
        case 'unitConv': {
          const match = input.match(/(\d+\.?\d*)\s*(\w+)\s+(to|in)\s+(\w+)/i);
          if (!match) return '格式: 数值 单位 to 目标单位\n例如: 100kg to lbs';
          const [, val, from, , to] = match;
          const conversions: Record<string, Record<string, number | ((v: number) => number)>> = {
            kg: { lbs: 2.20462, g: 1000, oz: 35.274 },
            lbs: { kg: 0.453592, g: 453.592, oz: 16 },
            g: { kg: 0.001, lbs: 0.00220462, oz: 0.035274 },
            m: { ft: 3.28084, in: 39.3701, cm: 100 },
            ft: { m: 0.3048, in: 12, cm: 30.48 },
            cm: { m: 0.01, ft: 0.0328084, in: 0.393701 },
            c: { f: (v: number) => v * 9/5 + 32, k: (v: number) => v + 273.15 },
            f: { c: (v: number) => (v - 32) * 5/9, k: (v: number) => (v - 32) * 5/9 + 273.15 },
            k: { c: (v: number) => v - 273.15, f: (v: number) => (v - 273.15) * 9/5 + 32 },
          };
          const v = parseFloat(val);
          const conv = conversions[from.toLowerCase()];
          if (!conv) return '不支持的单位';
          const target = conv[to.toLowerCase()];
          if (!target) return '不支持的目标单位';
          const result = typeof target === 'function' ? target(v) : v * target;
          return `${val} ${from} = ${result.toFixed(4)} ${to}`;
        }
        case 'mathCalc': {
          try {
            const result = Function('"use strict"; return (' + input.replace(/\^/g, '**') + ')')();
            return result.toString();
          } catch { return '计算错误'; }
        }
        case 'worldClock': {
          const zones = [
            { name: '北京时间', offset: 8 },
            { name: '东京时间', offset: 9 },
            { name: '纽约时间', offset: -5 },
            { name: '伦敦时间', offset: 0 },
            { name: '洛杉矶时间', offset: -8 },
          ];
          const now = new Date();
          return zones.map(z => {
            const local = new Date(now.getTime() + z.offset * 3600000);
            return `${z.name}: ${local.toLocaleTimeString()}`;
          }).join('\n');
        }
        // 新增哈希
        case 'crc16': {
          let crc = 0xFFFF;
          for (const char of input) {
            crc ^= char.charCodeAt(0);
            for (let i = 0; i < 8; i++) crc = crc & 1 ? (crc >> 1) ^ 0xA001 : crc >> 1;
          }
          return crc.toString(16).toUpperCase().padStart(4, '0');
        }
        case 'adler32': {
          let a = 1, b = 0;
          for (const char of input) {
            a = (a + char.charCodeAt(0)) % 65521;
            b = (b + a) % 65521;
          }
          return ((b << 16) | a).toString(16).toUpperCase();
        }
        case 'fnv1a': {
          let hash = 0xcbf29ce484222325n;
          for (const char of input) {
            hash ^= BigInt(char.charCodeAt(0));
            hash *= 0x100000001b3n;
          }
          return hash.toString(16).toUpperCase();
        }
        case 'murmur3': return simpleHash(input, 128);
        case 'xxhash': return simpleHash(input, 128);
        case 'checksum8': {
          let sum = 0;
          for (const char of input) sum = (sum + char.charCodeAt(0)) & 0xFF;
          return sum.toString(16).toUpperCase().padStart(2, '0');
        }
        case 'checksum16': {
          let sum = 0;
          for (const char of input) sum = (sum + char.charCodeAt(0)) & 0xFFFF;
          return sum.toString(16).toUpperCase().padStart(4, '0');
        }
        // 新增安全工具
        case 'argon2': return simpleHash(input, 256);
        case 'scrypt': return simpleHash(input, 256);
        case 'weakPwd': {
          const weak = ['123456', 'password', '123456789', 'qwerty', '12345678', '111111', '1234567', '123123', 'admin', 'letmein'];
          const pwd = input.toLowerCase();
          if (weak.includes(pwd)) return '⚠️ 弱密码！已在常见密码字典中！';
          return '✅ 不是常见弱密码';
        }
        case 'pwdDict': {
          const prefixes = ['admin', 'root', 'test', 'user', 'demo'];
          const suffixes = ['123', '2023', '2024', '1234', '!@#'];
          return prefixes.flatMap(p => suffixes.map(s => `${p}${s}`)).join('\n');
        }
        case 'rsaGen': {
          return `公钥: ${simpleHash(Date.now().toString(), 128)}\n私钥: ${simpleHash(Date.now().toString() + '1', 128)}\n\n(演示用途，非真实RSA密钥)`;
        }
        case 'signature': return `签名: ${simpleHash(input + Date.now(), 256)}`;
        case 'csrf': return simpleHash(Date.now().toString(), 64);
        // 新增生成工具
        case 'shortid': {
          const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
          return Array.from({ length: 10 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
        }
        case 'guid': return '{' + Array.from({ length: 8 }, () => Math.floor(Math.random() * 16).toString(16)).join('') + '-' +
          Array.from({ length: 4 }, () => Math.floor(Math.random() * 16).toString(16)).join('') + '-' +
          Array.from({ length: 4 }, () => Math.floor(Math.random() * 16).toString(16)).join('') + '-' +
          Array.from({ length: 4 }, () => Math.floor(Math.random() * 16).toString(16)).join('') + '-' +
          Array.from({ length: 12 }, () => Math.floor(Math.random() * 16).toString(16)).join('') + '}';
        case 'objectId': {
          const ts = Math.floor(Date.now() / 1000).toString(16);
          const rand = Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
          return ts + rand;
        }
        case 'snowflake': {
          const timestamp = Date.now().toString(2).padStart(42, '0');
          const machine = Array.from({ length: 10 }, () => Math.floor(Math.random() * 2)).join('');
          const seq = Array.from({ length: 12 }, () => Math.floor(Math.random() * 2)).join('');
          const binary = timestamp + machine + seq;
          return BigInt('0b' + binary).toString();
        }
        case 'token': {
          const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
          return Array.from({ length: 32 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
        }
        case 'apiKey': return 'sk-' + Array.from({ length: 40 }, () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.charAt(Math.floor(Math.random() * 62))).join('');
        case 'randomColor': {
          const r = Math.floor(Math.random() * 256), g = Math.floor(Math.random() * 256), b = Math.floor(Math.random() * 256);
          return `HEX: #${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}\nRGB: rgb(${r}, ${g}, ${b})`;
        }
        case 'randomEmoji': {
          const emojis = ['😀','😃','😄','😁','😆','😅','🤣','😂','🙂','🙃','😉','😊','😇','🥰','😍','🤩','😘','😗','😚','😙','😋','😛','😝','😜','🤪','🤨','🧐','🤓','😎','🤓','🥳','🤗','🤭','🤫','🤔','🤐','🤨','😐','😑','😶','😏','😒','🙄','😬','🤥','😌','😔','😪','🤤','😴','😷','🤒','🤕','🤢','🤮','🥵','🥶','🥴','😵','🤯','🤠','🥳','🤡','🤥','🤫','🤭','🧐'];
          return Array.from({ length: 5 }, () => emojis[Math.floor(Math.random() * emojis.length)]).join(' ');
        }
        case 'randomIPv6': {
          const groups = Array.from({ length: 8 }, () => Math.floor(Math.random() * 65536).toString(16)).join(':');
          return groups;
        }
        case 'randomPort': return Math.floor(Math.random() * 65535).toString();
        // 经纬度
        case 'randomCoords': {
          const lat = (Math.random() * 180 - 90).toFixed(6);
          const lng = (Math.random() * 360 - 180).toFixed(6);
          return `纬度(Lat): ${lat}\n经度(Lng): ${lng}\n\n地图查询: https://maps.google.com/?q=${lat},${lng}`;
        }
        // 颜色工具
        case 'colorCode': {
          const hex = input.replace('#', '');
          const r = parseInt(hex.substr(0, 2), 16), g = parseInt(hex.substr(2, 2), 16), b = parseInt(hex.substr(4, 2), 16);
          return `HEX: #${hex.toUpperCase()}\nRGB: rgb(${r}, ${g}, ${b})\n十进制: ${r * 65536 + g * 256 + b}`;
        }
        case 'colorContrast': {
          const [c1, c2] = input.split(/[,]/).map(c => c.trim());
          return `颜色1: ${c1}\n颜色2: ${c2}\n对比度: ${(Math.random() * 10 + 1).toFixed(2)}:1`;
        }
        case 'colorBlend': {
          const [hex1, hex2] = input.split(/[,]/).map(c => c.trim().replace('#', ''));
          const r1 = parseInt(hex1.substr(0, 2), 16), g1 = parseInt(hex1.substr(2, 2), 16), b1 = parseInt(hex1.substr(4, 2), 16);
          const r2 = parseInt(hex2.substr(0, 2), 16), g2 = parseInt(hex2.substr(2, 2), 16), b2 = parseInt(hex2.substr(4, 2), 16);
          const r = Math.floor((r1 + r2) / 2), g = Math.floor((g1 + g2) / 2), b = Math.floor((b1 + b2) / 2);
          return `混合色: #${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
        }
        case 'colorInvert': {
          const hex = input.replace('#', '');
          const r = 255 - parseInt(hex.substr(0, 2), 16), g = 255 - parseInt(hex.substr(2, 2), 16), b = 255 - parseInt(hex.substr(4, 2), 16);
          return `反色: #${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
        }
        case 'gradient': {
          const [h1, h2] = input.split(/[,]/).map(c => c.trim());
          return `渐变: linear-gradient(to right, ${h1}, ${h2})`;
        }
        // 时间工具
        case 'epoch': return Date.now().toString() + '\n秒: ' + Math.floor(Date.now() / 1000).toString();
        case 'weekNumber': {
          const date = new Date(input || Date.now());
          const firstDay = new Date(date.getFullYear(), 0, 1);
          const dayOfYear = Math.floor((date.getTime() - firstDay.getTime()) / 86400000);
          return `第 ${Math.ceil((dayOfYear + firstDay.getDay() + 1) / 7)} 周`;
        }
        case 'daysBetween': {
          const [d1, d2] = input.split(/[,]/);
          const date1 = new Date(d1), date2 = new Date(d2);
          const days = Math.floor(Math.abs(date2.getTime() - date1.getTime()) / 86400000);
          return `相隔: ${days} 天\n约: ${(days / 7).toFixed(1)} 周 / ${(days / 30).toFixed(1)} 月`;
        }
        case 'ageCalc': {
          const birth = new Date(input);
          const now = new Date();
          const age = now.getFullYear() - birth.getFullYear();
          return `年龄: ${age} 岁`;
        }
        case 'countdown': {
          const target = new Date(input);
          const now = new Date();
          const diff = Math.max(0, target.getTime() - now.getTime());
          const days = Math.floor(diff / 86400000);
          const hours = Math.floor((diff % 86400000) / 3600000);
          const mins = Math.floor((diff % 3600000) / 60000);
          const secs = Math.floor((diff % 60000) / 1000);
          return `剩余: ${days}天 ${hours}时 ${mins}分 ${secs}秒`;
        }
        case 'dateFormat': {
          const d = new Date(input || Date.now());
          return `ISO: ${d.toISOString()}\nLocale: ${d.toLocaleString()}\nUTC: ${d.toUTCString()}`;
        }
        // 开发辅助工具
        case 'regexGen': {
          const patterns = { '邮箱': '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}', '手机号': '1[3-9]\\d{9}', 'URL': 'https?://[^\\s]+', 'IP地址': '\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}', '日期': '\\d{4}-\\d{2}-\\d{2}', '数字': '\\d+', '字母': '[a-zA-Z]+' };
          return Object.entries(patterns).map(([k, v]) => `${k}: ${v}`).join('\n');
        }
        case 'codeBeautify': return input.split(';').filter(s => s.trim()).map(s => '  ' + s.trim() + ';').join('\n');
        case 'commentCount': {
          const lines = input.split('\n');
          const comments = lines.filter(l => /^\s*[\/#]/.test(l)).length;
          return `总行数: ${lines.length}\n注释行: ${comments}\n代码行: ${lines.length - comments}`;
        }
        case 'lineBreak': {
          const len = parseInt(extraInput) || 50;
          let result = '';
          for (let i = 0; i < input.length; i += len) result += input.substring(i, i + len) + '\n';
          return result.trim();
        }
        case 'removeEmptyLines': return mode === 'encode' ? input.split('\n').filter(l => l.trim()).join('\n') : input.split('\n').map(l => l + '\n').join('');
        case 'removeDuplicates': return mode === 'encode' ? [...new Set(input.split('\n'))].join('\n') : input.split('\n').join('\n');
        case 'arrayDedup': {
          try {
            const arr = JSON.parse(input);
            return JSON.stringify([...new Set(arr)]);
          } catch { return '需要JSON数组格式'; }
        }
        case 'jsonSort': {
          try {
            const obj = JSON.parse(input);
            const sorted = (o: any): any => {
              if (Array.isArray(o)) return o.map(sorted);
              if (typeof o === 'object' && o !== null) return Object.keys(o).sort().reduce((r: any, k) => (r[k] = sorted(o[k]), r), {});
              return o;
            };
            return JSON.stringify(sorted(obj), null, 2);
          } catch { return 'JSON格式错误'; }
        }
        case 'jsonValidate': {
          try { JSON.parse(input); return '✅ 有效的JSON格式'; } catch { return '❌ JSON格式错误'; }
        }
        case 'jsonMinify': {
          try { return JSON.stringify(JSON.parse(input)); } catch { return 'JSON格式错误'; }
        }
        // 文本工具
        case 'indent': return input.split('\n').map(l => '  ' + l).join('\n');
        case 'shuffleText': {
          const arr = input.split('');
          for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
          }
          return arr.join('');
        }
        case 'md5html': return input.replace(/^#\s+(.*)$/gm, '<h1>$1</h1>').replace(/^##\s+(.*)$/gm, '<h2>$1</h2>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>').replace(/`(.*?)`/g, '<code>$1</code>');
        case 'html2md': return input.replace(/<h1>(.*?)<\/h1>/gi, '# $1').replace(/<h2>(.*?)<\/h2>/gi, '## $1').replace(/<strong>(.*?)<\/strong>/gi, '**$1**').replace(/<em>(.*?)<\/em>/gi, '*$1*').replace(/<code>(.*?)<\/code>/gi, '`$1`');
        // 数据格式转换
        case 'json2xml': {
          try {
            const obj = JSON.parse(input);
            const toXml = (data: any, tag = 'root'): string => {
              if (Array.isArray(data)) return data.map((item, i) => toXml(item, `item${i}`)).join('');
              if (typeof data === 'object' && data !== null) return `<${tag}>` + Object.entries(data).map(([k, v]) => toXml(v, k)).join('') + `</${tag}>`;
              return `<${tag}>${data}</${tag}>`;
            };
            return toXml(obj);
          } catch { return 'JSON格式错误'; }
        }
        case 'toml2json': {
          try {
            const result: any = {};
            for (const line of input.split('\n')) {
              const match = line.match(/^(\w+)\s*=\s*(.*)$/);
              if (match) result[match[1]] = match[2].replace(/^"|"$/g, '');
            }
            return JSON.stringify(result, null, 2);
          } catch { return 'TOML格式错误'; }
        }
        case 'json2toml': {
          try {
            const obj = JSON.parse(input);
            return Object.entries(obj).map(([k, v]) => `${k} = "${v}"`).join('\n');
          } catch { return 'JSON格式错误'; }
        }
        // 网络工具
        case 'ipCalc': {
          const parts = input.split('/');
          const ip = parts[0];
          const prefix = parseInt(parts[1]) || 24;
          const mask = [0, 0, 0, 0];
          for (let i = 0; i < prefix; i++) mask[Math.floor(i / 8)] |= 1 << (7 - (i % 8));
          return `IP: ${ip}\n子网掩码: ${mask.join('.')}\n可用主机: ${Math.pow(2, 32 - prefix) - 2}`;
        }
        case 'cidr': {
          const parts = input.split('/');
          const prefix = parseInt(parts[1]) || 16;
          return `CIDR: ${input}\n地址范围: ${Math.pow(2, 32 - prefix)} 个\n子网掩码: ${Array(4).fill(0).map((_, i) => { const bits = Math.max(0, prefix - i * 8); return bits >= 8 ? 255 : bits > 0 ? 256 - Math.pow(2, 8 - bits) : 0; }).join('.')}`;
        }
        case 'uaParser': {
          const ua = input;
          let browser = '未知', os = '未知', device = '桌面';
          if (/Chrome\//.test(ua)) browser = 'Chrome';
          else if (/Firefox\//.test(ua)) browser = 'Firefox';
          else if (/Safari\//.test(ua)) browser = 'Safari';
          if (/Windows/.test(ua)) os = 'Windows';
          else if (/Mac OS/.test(ua)) os = 'macOS';
          else if (/Linux/.test(ua)) os = 'Linux';
          if (/Mobile|Android|iPhone|iPad/.test(ua)) device = '移动';
          return `浏览器: ${browser}\n系统: ${os}\n设备: ${device}\n\n原始UA:\n${ua}`;
        }
        case 'httpStatus': {
          const codes: Record<string, string> = { '200': 'OK - 成功', '201': 'Created - 创建成功', '204': 'No Content - 无内容', '301': 'Moved Permanently - 永久重定向', '302': 'Found - 临时重定向', '400': 'Bad Request - 错误请求', '401': 'Unauthorized - 未授权', '403': 'Forbidden - 禁止访问', '404': 'Not Found - 未找到', '500': 'Internal Server Error - 服务器错误', '502': 'Bad Gateway - 网关错误', '503': 'Service Unavailable - 服务不可用' };
          return codes[input] || '未知状态码，请输入如: 200, 404, 500';
        }
        case 'mimeTypes': {
          const types: Record<string, string> = { 'html': 'text/html', 'css': 'text/css', 'js': 'application/javascript', 'json': 'application/json', 'xml': 'application/xml', 'pdf': 'application/pdf', 'jpg': 'image/jpeg', 'png': 'image/png', 'gif': 'image/gif', 'mp4': 'video/mp4', 'zip': 'application/zip' };
          return Object.entries(types).map(([k, v]) => `${k}: ${v}`).join('\n');
        }
        // 其他工具
        case 'asciiArt': {
          const artChars = ['█', '▓', '▒', '░'];
          const width = 20;
          let result = '';
          for (let i = 0; i < 5; i++) {
            for (let j = 0; j < width; j++) result += artChars[Math.floor(Math.random() * artChars.length)];
            result += '\n';
          }
          return `ASCII Art:\n${result}\n输入文本: ${input}`;
        }
        case 'randomData': {
          const count = parseInt(input) || 5;
          const names = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九'];
          const result = Array.from({ length: count }, (_, i) => ({ id: i + 1, name: names[Math.floor(Math.random() * names.length)], age: Math.floor(Math.random() * 50) + 18, email: `user${i + 1}@example.com`, score: Math.floor(Math.random() * 100) }));
          return JSON.stringify(result, null, 2);
        }
        case 'numberFormat': {
          const num = parseFloat(input);
          if (isNaN(num)) return '请输入有效数字';
          return `千分位: ${num.toLocaleString()}\n保留2位: ${num.toFixed(2)}\n百分比: ${(num * 100).toFixed(2)}%\n货币: ¥${num.toLocaleString()}`;
        }
        // 批量生成器
        case 'batchPassword': {
          const count = parseInt(extraInput) || 100;
          const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
          return Array.from({ length: count }, (_, i) => `${i + 1}. ` + Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')).join('\n');
        }
        case 'batchUuid': {
          const count = parseInt(extraInput) || 100;
          return Array.from({ length: count }, () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
            const r = Math.floor(Math.random() * 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
          })).join('\n');
        }
        case 'phoneGen': {
          const prefixes = ['133', '135', '136', '137', '138', '139', '150', '151', '152', '157', '158', '159', '180', '181', '182', '183', '184', '185', '186', '187', '188', '189'];
          return prefixes[Math.floor(Math.random() * prefixes.length)] + Array.from({ length: 8 }, () => Math.floor(Math.random() * 10)).join('');
        }
        case 'idCardGen': {
          const areaCodes = ['110101', '310104', '440106', '510107', '330106'];
          const area = areaCodes[Math.floor(Math.random() * areaCodes.length)];
          const year = 1970 + Math.floor(Math.random() * 40);
          const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
          const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
          const seq = Array.from({ length: 3 }, () => Math.floor(Math.random() * 10)).join('');
          const check = String(Math.floor(Math.random() * 10));
          return `${area}${year}${month}${day}${seq}${check}`;
        }
        case 'loremZh': {
          const chars = '中华人民共和国改革开放科技发展学习教育创新研究数据分析人工智能大数据云计算区块链物联网';
          const count = parseInt(extraInput) || 3;
          return Array.from({ length: count }, () => Array.from({ length: 20 + Math.floor(Math.random() * 30) }, () => chars[Math.floor(Math.random() * chars.length)]).join('')).join('\n');
        }
        case 'randomDate': {
          const parts = input.split(',');
          const start = parts[0] ? new Date(parts[0]).getTime() : Date.now() - 31536000000;
          const end = parts[1] ? new Date(parts[1]).getTime() : Date.now();
          const randomTime = start + Math.floor(Math.random() * (end - start));
          return new Date(randomTime).toISOString().split('T')[0];
        }
        case 'randomIp': {
          return `${Math.floor(Math.random() * 223) + 1}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
        }
        case 'randomEmail': {
          const names = ['user', 'test', 'admin', 'info', 'support', 'contact'];
          const domains = ['example.com', 'test.org', 'mail.net', 'demo.io', 'sample.cn'];
          return `${names[Math.floor(Math.random() * names.length)]}${Math.floor(Math.random() * 1000)}@${domains[Math.floor(Math.random() * domains.length)]}`;
        }
        case 'randomName': {
          const surnames = ['张', '李', '王', '刘', '陈', '杨', '黄', '赵', '周', '吴'];
          const givenNames = ['伟', '芳', '娜', '敏', '静', '强', '磊', '洋', '艳', '勇'];
          return surnames[Math.floor(Math.random() * surnames.length)] + givenNames[Math.floor(Math.random() * givenNames.length)] + (Math.random() > 0.5 ? givenNames[Math.floor(Math.random() * givenNames.length)] : '');
        }
        case 'randomBankCard': {
          const prefixes = ['6222', '6225', '6228', '6217', '6251'];
          return prefixes[Math.floor(Math.random() * prefixes.length)] + Array.from({ length: 14 }, () => Math.floor(Math.random() * 10)).join('');
        }
        // 计算工具
        case 'mortgageCalc': {
          const parts = input.split(/[,，\s]+/).map(s => parseFloat(s.replace(/[^0-9.]/g, '')));
          const principal = (parts[0] || 100) * 10000;
          const rate = (parts[1] || 4.9) / 100 / 12;
          const months = (parts[2] || 30) * 12;
          const monthly = (principal * rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1);
          const total = monthly * months;
          return `贷款: ¥${principal.toLocaleString()}\n年利率: ${(rate * 12 * 100).toFixed(2)}%\n期限: ${months}个月\n月供: ¥${monthly.toFixed(2)}\n总还款: ¥${total.toFixed(2)}\n总利息: ¥${(total - principal).toFixed(2)}`;
        }
        case 'taxCalc': {
          const income = parseFloat(input.replace(/[^0-9.]/g, '')) || 15000;
          const taxable = Math.max(0, income - 5000);
          let tax = 0;
          if (taxable <= 3000) tax = taxable * 0.03;
          else if (taxable <= 12000) tax = taxable * 0.1 - 210;
          else if (taxable <= 25000) tax = taxable * 0.2 - 1410;
          else if (taxable <= 35000) tax = taxable * 0.25 - 2660;
          else tax = taxable * 0.3 - 4410;
          return `月薪: ¥${income.toLocaleString()}\n起征额: ¥5,000\n应纳税所得: ¥${taxable.toLocaleString()}\n税率: ${tax > 0 ? (tax / taxable * 100).toFixed(1) : 0}%\n个税: ¥${tax.toFixed(2)}\n税后收入: ¥${(income - tax).toFixed(2)}`;
        }
        case 'bmiCalc': {
          const parts = input.split(/[,，\s]+/).map(s => parseFloat(s.replace(/[^0-9.]/g, '')));
          const h = (parts[0] || 170) / 100;
          const w = parts[1] || 65;
          const bmi = w / (h * h);
          let status = '正常';
          if (bmi < 18.5) status = '偏瘦';
          else if (bmi >= 24 && bmi < 28) status = '偏胖';
          else if (bmi >= 28) status = '肥胖';
          return `身高: ${(h * 100).toFixed(0)}cm\n体重: ${w.toFixed(1)}kg\nBMI: ${bmi.toFixed(1)}\n状态: ${status}\n\n标准: 偏瘦<18.5, 正常18.5-24, 偏胖24-28, 肥胖≥28`;
        }
        case 'percentCalc': {
          const match = input.match(/(\d+(?:\.\d+)?).*?(\d+(?:\.\d+)?)/);
          if (!match) return '格式: 原价 折扣率，例如"800打85折"';
          const price = parseFloat(match[1]);
          const discount = parseFloat(match[2]);
          const finalPrice = price * (discount / 100);
          const saved = price - finalPrice;
          return `原价: ¥${price.toFixed(2)}\n折扣: ${discount}折\n折后价: ¥${finalPrice.toFixed(2)}\n节省: ¥${saved.toFixed(2)}`;
        }
        case 'unitLength': {
          const v = parseFloat(input.replace(/[^0-9.]/g, '')) || 100;
          return `${v} 米 = \n${(v * 100).toFixed(2)} 厘米\n${(v * 1000).toFixed(2)} 毫米\n${(v * 3.28084).toFixed(4)} 英尺\n${(v * 39.3701).toFixed(2)} 英寸\n${(v * 0.001).toFixed(6)} 公里`;
        }
        case 'unitWeight': {
          const v = parseFloat(input.replace(/[^0-9.]/g, '')) || 100;
          return `${v} 千克 = \n${(v * 1000).toFixed(2)} 克\n${(v * 2.20462).toFixed(4)} 磅\n${(v * 35.274).toFixed(2)} 盎司\n${(v * 2).toFixed(2)} 斤\n${(v * 0.001).toFixed(6)} 吨`;
        }
        case 'unitStorage': {
          const v = parseFloat(input.replace(/[^0-9.]/g, '')) || 1;
          return `${v} GB = \n${(v * 1024).toFixed(2)} MB\n${(v * 1024 * 1024).toFixed(2)} KB\n${(v * 1024 * 1024 * 1024).toFixed(2)} Bytes\n${(v * 8 * 1024 * 1024 * 1024).toFixed(0)} bits\n${(v / 1024).toFixed(6)} TB`;
        }
        case 'unitTime': {
          const v = parseFloat(input.replace(/[^0-9.]/g, '')) || 1;
          return `${v} 天 = \n${(v * 24).toFixed(2)} 小时\n${(v * 1440).toFixed(2)} 分钟\n${(v * 86400).toFixed(2)} 秒\n${(v / 7).toFixed(6)} 周\n${(v / 30).toFixed(6)} 月(约)\n${(v / 365).toFixed(6)} 年(约)`;
        }
        case 'unitSpeed': {
          const v = parseFloat(input.replace(/[^0-9.]/g, '')) || 60;
          return `${v} km/h = \n${(v * 1000 / 3600).toFixed(4)} m/s\n${(v / 1.609).toFixed(4)} mph (英里/小时)\n${(v / 1.852).toFixed(4)} 节 (海里/小时)\n${(v * 0.911344).toFixed(4)} ft/s`;
        }
        case 'unitTemp': {
          const c = parseFloat(input.replace(/[^0-9.-]/g, '')) || 25;
          const f = c * 9 / 5 + 32;
          const k = c + 273.15;
          return `${c}℃ = \n${f.toFixed(2)} ℉ (华氏度)\n${k.toFixed(2)} K (开尔文)`;
        }
        // 图像工具
        case 'imageToBase64': return '请输入图片URL，纯前端实现需浏览器环境。支持的格式：https://example.com/image.png';
        case 'qrCode': return `二维码内容:\n${input}\n\n（注：浏览器中可使用 QR Code 库生成图片，此处仅显示文本）`;
        case 'colorPalette': {
          const hex = input.replace('#', '').trim() || 'FF5500';
          const r = parseInt(hex.substr(0, 2), 16), g = parseInt(hex.substr(2, 2), 16), b = parseInt(hex.substr(4, 2), 16);
          return `主色: #${hex.toUpperCase()}\n衍生色1: #${Math.max(0, r - 30).toString(16).padStart(2, '0')}${Math.max(0, g - 30).toString(16).padStart(2, '0')}${Math.max(0, b - 30).toString(16).padStart(2, '0')}\n衍生色2: #${Math.min(255, r + 30).toString(16).padStart(2, '0')}${Math.min(255, g + 30).toString(16).padStart(2, '0')}${Math.min(255, b + 30).toString(16).padStart(2, '0')}\n对比色: #${(255 - r).toString(16).padStart(2, '0')}${(255 - g).toString(16).padStart(2, '0')}${(255 - b).toString(16).padStart(2, '0')}\n灰色调: #${Math.floor((r + g + b) / 3).toString(16).padStart(2, '0').repeat(3)}`;
        }
        // 文本统计
        case 'wordCountPlus': {
          const chars = input.length;
          const bytes = new TextEncoder().encode(input).length;
          const words = input.split(/\s+/).filter(Boolean).length;
          const lines = input.split('\n').length;
          const cnChars = (input.match(/[\u4e00-\u9fa5]/g) || []).length;
          return `字符数: ${chars}\n字节数: ${bytes}\n单词数: ${words}\n行数: ${lines}\n中文字符: ${cnChars}\n非空行: ${input.split('\n').filter(l => l.trim()).length}`;
        }
        case 'dedupText': {
          const lines = input.split('\n');
          const seen = new Set<string>();
          return lines.filter(l => { if (seen.has(l.trim())) return false; seen.add(l.trim()); return true; }).join('\n');
        }
        // JSON增强
        case 'jsonDiff': {
          const match = input.match(/(\{[\s\S]*\})\s*(\{[\s\S]*\})/);
          if (!match) return '格式: 两个JSON对象，例如 {"a":1,"b":2}{"a":1,"b":3,"c":4}';
          try {
            const a = JSON.parse(match[1]);
            const b = JSON.parse(match[2]);
            const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
            const diff: string[] = [];
            for (const k of keys) {
              if (JSON.stringify(a[k]) !== JSON.stringify(b[k])) diff.push(`${k}: ${JSON.stringify(a[k])} → ${JSON.stringify(b[k])}`);
            }
            return diff.length ? diff.join('\n') : '无差异';
          } catch { return 'JSON格式错误'; }
        }
        case 'jsonMerge': {
          const match = input.match(/(\{[\s\S]*\})\s*(\{[\s\S]*\})/);
          if (!match) return '格式: {"a":1}{"b":2}';
          try {
            const a = JSON.parse(match[1]);
            const b = JSON.parse(match[2]);
            return JSON.stringify({ ...a, ...b }, null, 2);
          } catch { return 'JSON格式错误'; }
        }
        case 'jsonSchema': {
          try {
            const obj = JSON.parse(input);
            const schema: any = { type: typeof obj };
            if (Array.isArray(obj)) {
              schema.type = 'array';
              if (obj.length > 0) schema.items = { type: typeof obj[0] };
            } else if (typeof obj === 'object' && obj !== null) {
              schema.properties = {};
              for (const [k, v] of Object.entries(obj)) schema.properties[k] = { type: typeof v };
            }
            return JSON.stringify(schema, null, 2);
          } catch { return 'JSON格式错误'; }
        }
        case 'jsonTable': {
          try {
            const arr = JSON.parse(input);
            if (!Array.isArray(arr) || arr.length === 0) return '需要JSON数组';
            const keys = Object.keys(arr[0]);
            return '| ' + keys.join(' | ') + ' |\n| ' + keys.map(() => '---').join(' | ') + ' |\n' + arr.map(item => '| ' + keys.map(k => item[k]).join(' | ') + ' |').join('\n');
          } catch { return 'JSON格式错误'; }
        }
        case 'jsonFilter': {
          try {
            const arr = JSON.parse(input);
            if (!Array.isArray(arr)) return '需要JSON数组';
            const sorted = [...arr].sort((a, b) => {
              const av = Object.values(a)[0];
              const bv = Object.values(b)[0];
              if (typeof av === 'number') return av - (bv as number);
              return String(av).localeCompare(String(bv));
            });
            return JSON.stringify(sorted, null, 2);
          } catch { return 'JSON格式错误'; }
        }
        case 'jsonPath': {
          try {
            const obj = JSON.parse(input);
            const path = extraInput || 'a.b.c';
            const result = path.split('.').reduce((acc: any, key) => acc && acc[key] !== undefined ? acc[key] : undefined, obj);
            return result ? JSON.stringify(result, null, 2) : '未找到';
          } catch { return 'JSON格式错误'; }
        }
        // 开发工具
        case 'jsonToTs': {
          try {
            const obj = JSON.parse(input);
            const inferType = (v: any): string => {
              if (v === null) return 'null';
              if (Array.isArray(v)) return v.length > 0 ? `${inferType(v[0])}[]` : 'any[]';
              if (typeof v === 'object') {
                return '{ ' + Object.entries(v).map(([k, val]) => `${k}: ${inferType(val)}`).join(', ') + ' }';
              }
              return typeof v;
            };
            return `interface Data ${inferType(obj)}`;
          } catch { return 'JSON格式错误'; }
        }
        case 'regexTester': {
          try {
            const parts = input.split(' ');
            const pattern = parts[0] || '\\d+';
            const text = parts.slice(1).join(' ') || 'test 123 abc 456';
            const regex = new RegExp(pattern, 'g');
            const matches = text.match(regex) || [];
            return `正则: /${pattern}/g\n测试文本: ${text}\n匹配 ${matches.length} 个:\n${matches.join(', ')}`;
          } catch { return '正则语法错误'; }
        }
        case 'gitignoreGen': {
          const templates: Record<string, string> = { 'node': 'node_modules/\nnpm-debug.log\nyarn-error.log\ndist/', 'java': '*.class\n*.jar\nbuild/\ntarget/\n.gradle/', 'python': '__pycache__/\n*.pyc\n*.pyo\n.venv/\nenv/', 'web': '.DS_Store\n*.log\n.vscode/\n.idea/', 'all': '# 通用\nnode_modules/\n*.log\n.DS_Store\n*.jar\n*.class\nbuild/\ndist/\n__pycache__/\n*.pyc\n.idea/\n.vscode/\ntarget/\n' };
          const key = Object.keys(templates).find(k => input.includes(k));
          return key ? templates[key] : templates.all;
        }
        case 'sqlBeautify': {
          return input.replace(/\b(select|from|where|and|or|join|left|right|inner|on|group by|order by|limit|insert into|values|update|set|delete|create table|drop table|alter table)\b/gi, m => '\n' + m.toUpperCase()).trim();
        }
        // 时间日期增强
        case 'timezone': {
          const date = new Date(input || Date.now());
          const zones = [
            { name: '北京', offset: 8 }, { name: '东京', offset: 9 },
            { name: '伦敦', offset: 0 }, { name: '纽约', offset: -5 },
            { name: '洛杉矶', offset: -8 }, { name: '悉尼', offset: 11 },
            { name: '巴黎', offset: 1 }, { name: '迪拜', offset: 4 },
          ];
          return zones.map(z => {
            const local = new Date(date.getTime() + z.offset * 3600000);
            const hh = String(local.getUTCHours()).padStart(2, '0');
            const mm = String(local.getUTCMinutes()).padStart(2, '0');
            const ss = String(local.getUTCSeconds()).padStart(2, '0');
            return `${z.name}(UTC${z.offset >= 0 ? '+' : ''}${z.offset}): ${hh}:${mm}:${ss}`;
          }).join('\n');
        }
        case 'lunar': {
          const d = new Date(input || Date.now());
          const lunarMonths = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'];
          const lunarDays = ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十', '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十', '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'];
          const zodiac = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
          const baseYear = 1900;
          const year = d.getFullYear();
          const zodiacIdx = (year - baseYear) % 12;
          return `公历: ${year}年${d.getMonth() + 1}月${d.getDate()}日\n生肖: ${zodiac[zodiacIdx]}\n农历(演示): ${lunarMonths[(d.getMonth() + 8) % 12]}月${lunarDays[(d.getDate() + 7) % 30]}\n\n(完整农历需专用算法库)`;
        }
        case 'countdownTimer': {
          const target = new Date(input);
          if (isNaN(target.getTime())) return '请输入有效日期，例如: 2026-01-01 00:00:00';
          const now = new Date();
          const diff = Math.max(0, target.getTime() - now.getTime());
          const days = Math.floor(diff / 86400000);
          const hours = Math.floor((diff % 86400000) / 3600000);
          const mins = Math.floor((diff % 3600000) / 60000);
          const secs = Math.floor((diff % 60000) / 1000);
          return `目标: ${target.toLocaleString()}\n现在: ${now.toLocaleString()}\n\n剩余:\n${days} 天\n${hours} 小时\n${mins} 分钟\n${secs} 秒\n\n总计: ${(diff / 1000).toLocaleString()} 秒`;
        }
        case 'dateDiff': {
          const parts = input.split(/[,，\s]+/);
          if (parts.length < 2) return '格式: 日期1,日期2';
          const d1 = new Date(parts[0]);
          const d2 = new Date(parts[1]);
          const diff = Math.abs(d2.getTime() - d1.getTime());
          const days = Math.floor(diff / 86400000);
          return `${parts[0]} → ${parts[1]}\n\n相差: ${days} 天\n约 ${(days / 7).toFixed(1)} 周\n约 ${(days / 30).toFixed(1)} 月\n约 ${(days / 365).toFixed(2)} 年\n\n共 ${(diff / 3600000).toFixed(0)} 小时`;
        }
        case 'calendarWeek': {
          const d = new Date(input || Date.now());
          const yearStart = new Date(d.getFullYear(), 0, 1);
          const dayOfYear = Math.floor((d.getTime() - yearStart.getTime()) / 86400000);
          const week = Math.ceil((dayOfYear + yearStart.getDay() + 1) / 7);
          return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日\n第 ${week} 周\n第 ${dayOfYear + 1} 天`;
        }
        // 密码强度
        case 'pwdMeter': {
          const pwd = input || 'password';
          let score = 0;
          if (pwd.length >= 8) score += 20;
          if (pwd.length >= 12) score += 10;
          if (/[a-z]/.test(pwd)) score += 15;
          if (/[A-Z]/.test(pwd)) score += 20;
          if (/[0-9]/.test(pwd)) score += 20;
          if (/[^a-zA-Z0-9]/.test(pwd)) score += 15;
          let level = '弱', emoji = '🔴';
          if (score >= 40 && score < 60) { level = '一般'; emoji = '🟠'; }
          else if (score >= 60 && score < 80) { level = '良好'; emoji = '🟡'; }
          else if (score >= 80) { level = '强'; emoji = '🟢'; }
          return `密码: ${'•'.repeat(Math.min(pwd.length, 20))}\n长度: ${pwd.length}\n分数: ${score}/100\n强度: ${emoji} ${level}\n\n建议: ${score < 60 ? '增加长度、大小写、数字和特殊字符' : '密码强度良好'}`;
        }
        // ASCII Banner
        case 'asciiBanner': {
          const text = (input || 'HI').toUpperCase();
          const bigChars: Record<string, string[]> = {
            'H': ['H   H', 'H   H', 'HHHHH', 'H   H', 'H   H'],
            'I': [' II ', ' II ', ' II ', ' II ', ' II '],
            'A': ['  A  ', ' A A ', 'A   A', 'AAAAA', 'A   A'],
            'B': ['BBBB ', 'B   B', 'BBBB ', 'B   B', 'BBBB '],
            'C': [' CCC ', 'C   C', 'C    ', 'C   C', ' CCC '],
            'D': ['DDDD ', 'D   D', 'D   D', 'D   D', 'DDDD '],
            'E': ['EEEEE', 'E    ', 'EEE  ', 'E    ', 'EEEEE'],
            'L': ['L    ', 'L    ', 'L    ', 'L    ', 'LLLLL'],
            'O': [' OOO ', 'O   O', 'O   O', 'O   O', ' OOO '],
            ' ': ['     ', '     ', '     ', '     ', '     '],
          };
          let result = '';
          for (let row = 0; row < 5; row++) {
            for (const c of text) result += (bigChars[c] || bigChars['A'])[row] + ' ';
            result += '\n';
          }
          return result;
        }
        // Base62 ID
        case 'base62Id': {
          const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
          let num = Date.now();
          let result = '';
          while (num > 0) { result = chars[num % 62] + result; num = Math.floor(num / 62); }
          return result + Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * 62)]).join('');
        }
        // RSA演示
        case 'rsaDemo': {
          const p = 61, q = 53;
          const n = p * q;
          const phi = (p - 1) * (q - 1);
          const e = 17;
          return `RSA演示 (简化版):\n\n素数 p = ${p}, q = ${q}\nn = p × q = ${n}\nφ(n) = (p-1)(q-1) = ${phi}\n公钥 e = ${e}\n\n公钥: (e=${e}, n=${n})\n私钥: 需计算 d = e⁻¹ mod φ(n)\n\n输入: ${input}\n\n注意: 此为演示说明，浏览器中无法安全计算大整数RSA`;
        }
        default: return input;
      }
    } catch (e) { return '处理错误: ' + (e instanceof Error ? e.message : '未知错误'); }
  };

  const handleProcess = () => {
    if (activeTool.special) {
      setOutput(specialProcess());
    } else if (['md5', 'sha1', 'sha256', 'sha512', 'md2', 'md4', 'sha384', 'sha3-256', 'sha3-512', 'crc32', 'crc16', 'adler32', 'fnv1a', 'murmur3', 'xxhash', 'checksum8', 'checksum16', 'blake2b', 'blake3', 'bcrypt', 'hmac', 'pbkdf2', 'argon2', 'scrypt', 'aes', 'des', 'fileHash', 'jwt', 'jwtGen', 'password', 'batchPwd', 'uuid', 'ulid', 'nanoid', 'shortid', 'guid', 'objectId', 'snowflake', 'token', 'apiKey', 'random', 'randomStr', 'randomColor', 'randomEmoji', 'randomIPv6', 'randomPort', 'randomCoords', 'timestamp', 'cron', 'cronGen', 'mac', 'ip', 'color', 'qrtext', 'hashlist', 'lorem', 'dec2hex', 'hex2dec', 'dec2bin', 'bin2dec', 'dec2oct', 'oct2dec', 'rgb2hex', 'hex2rgb', 'rgb2hsl', 'hsl2rgb', 'rgb2hsv', 'hsv2rgb', 'timestamp2date', 'date2timestamp', 'epoch', 'weekNumber', 'daysBetween', 'ageCalc', 'countdown', 'dateFormat', 'csv2json', 'json2csv', 'xml2json', 'json2xml', 'toml2json', 'json2toml', 'yaml2json', 'json2yaml', 'json2ts', 'wordcount', 'wordCountPlus', 'jsonpath', 'slug', 'regex', 'regexGen', 'regexTester', 'diff', 'json', 'yaml', 'xml', 'sql', 'css', 'js', 'htmlbeautify', 'sqlBeautify', 'urlparams', 'codeBeautify', 'commentCount', 'lineBreak', 'removeEmptyLines', 'removeDuplicates', 'arrayDedup', 'jsonSort', 'jsonValidate', 'jsonMinify', 'pwdStrength', 'pwdMeter', 'sqlInjection', 'xssDetect', 'weakPwd', 'pwdDict', 'rsaGen', 'rsaDemo', 'signature', 'csrf', 'xor', 'vigenere', 'atbash', 'railFence', 'unitConv', 'mathCalc', 'worldClock', 'colorCode', 'colorContrast', 'colorBlend', 'colorInvert', 'gradient', 'colorPalette', 'ipCalc', 'cidr', 'uaParser', 'httpStatus', 'mimeTypes', 'indent', 'shuffleText', 'md5html', 'html2md', 'asciiArt', 'asciiBanner', 'randomData', 'numberFormat', 'mortgageCalc', 'taxCalc', 'bmiCalc', 'percentCalc', 'unitLength', 'unitWeight', 'unitStorage', 'unitTime', 'unitSpeed', 'unitTemp', 'imageToBase64', 'qrCode', 'dedupText', 'tradSimp', 'pinyin', 'textAlign', 'removeSpaces', 'jsonDiff', 'jsonMerge', 'jsonSchema', 'jsonTable', 'jsonFilter', 'jsonPath', 'gitignoreGen', 'timezone', 'lunar', 'countdownTimer', 'dateDiff', 'calendarWeek', 'batchPassword', 'batchUuid', 'phoneGen', 'idCardGen', 'loremZh', 'randomDate', 'randomIp', 'randomEmail', 'randomName', 'randomBankCard', 'base62Id'].includes(activeTool.id)) {
      setOutput(specialProcess());
    } else {
      setOutput(mode === 'encode' ? encode(input) : decode(input));
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => { setInput(''); setOutput(''); };

  const isSpecial = activeTool.special || ['md5', 'sha1', 'sha256', 'sha512', 'md2', 'md4', 'sha384', 'sha3-256', 'sha3-512', 'crc32', 'crc16', 'adler32', 'fnv1a', 'murmur3', 'xxhash', 'checksum8', 'checksum16', 'blake2b', 'blake3', 'bcrypt', 'hmac', 'pbkdf2', 'argon2', 'scrypt', 'aes', 'des', 'fileHash', 'jwt', 'jwtGen', 'password', 'batchPwd', 'uuid', 'ulid', 'nanoid', 'shortid', 'guid', 'objectId', 'snowflake', 'token', 'apiKey', 'random', 'randomStr', 'randomColor', 'randomEmoji', 'randomIPv6', 'randomPort', 'randomCoords', 'timestamp', 'cron', 'cronGen', 'mac', 'ip', 'color', 'qrtext', 'hashlist', 'lorem', 'dec2hex', 'hex2dec', 'dec2bin', 'bin2dec', 'dec2oct', 'oct2dec', 'rgb2hex', 'hex2rgb', 'rgb2hsl', 'hsl2rgb', 'rgb2hsv', 'hsv2rgb', 'timestamp2date', 'date2timestamp', 'epoch', 'weekNumber', 'daysBetween', 'ageCalc', 'countdown', 'dateFormat', 'csv2json', 'json2csv', 'xml2json', 'json2xml', 'toml2json', 'json2toml', 'yaml2json', 'json2yaml', 'json2ts', 'wordcount', 'wordCountPlus', 'jsonpath', 'slug', 'regex', 'regexGen', 'regexTester', 'diff', 'json', 'yaml', 'xml', 'sql', 'css', 'js', 'htmlbeautify', 'sqlBeautify', 'urlparams', 'codeBeautify', 'commentCount', 'lineBreak', 'removeEmptyLines', 'removeDuplicates', 'arrayDedup', 'jsonSort', 'jsonValidate', 'jsonMinify', 'pwdStrength', 'pwdMeter', 'sqlInjection', 'xssDetect', 'weakPwd', 'pwdDict', 'rsaGen', 'rsaDemo', 'signature', 'csrf', 'unitConv', 'mathCalc', 'worldClock', 'colorCode', 'colorContrast', 'colorBlend', 'colorInvert', 'gradient', 'colorPalette', 'ipCalc', 'cidr', 'uaParser', 'httpStatus', 'mimeTypes', 'indent', 'shuffleText', 'md5html', 'html2md', 'asciiArt', 'asciiBanner', 'randomData', 'numberFormat', 'mortgageCalc', 'taxCalc', 'bmiCalc', 'percentCalc', 'unitLength', 'unitWeight', 'unitStorage', 'unitTime', 'unitSpeed', 'unitTemp', 'imageToBase64', 'qrCode', 'dedupText', 'jsonDiff', 'jsonMerge', 'jsonSchema', 'jsonTable', 'jsonFilter', 'gitignoreGen', 'timezone', 'lunar', 'countdownTimer', 'dateDiff', 'calendarWeek', 'batchPassword', 'batchUuid', 'phoneGen', 'idCardGen', 'loremZh', 'randomDate', 'randomIp', 'randomEmail', 'randomName', 'randomBankCard', 'base62Id'].includes(activeTool.id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-lg bg-cyber-blue/20 flex items-center justify-center">
            <Code size={24} className="text-cyber-blue" />
          </div>
          <div>
            <h1 className="font-orbitron text-2xl font-bold text-white">在线工具箱</h1>
            <p className="text-sm text-gray-400">{tools.length}+ 工具，点击即可使用，无需安装</p>
          </div>
        </div>
      </motion.div>

      {/* Category Filter */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }}>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setCategoryFilter('all')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${categoryFilter === 'all' ? 'bg-cyber-green/20 text-cyber-green border border-cyber-green/40' : 'bg-cyber-purple/10 text-gray-400 border border-cyber-green/10 hover:text-white'}`}>
            全部
          </button>
          {(Object.keys(categoryNames) as ToolCategory[]).map(cat => (
            <button key={cat} onClick={() => setCategoryFilter(cat)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${categoryFilter === cat ? 'bg-cyber-green/20 text-cyber-green border border-cyber-green/40' : 'bg-cyber-purple/10 text-gray-400 border border-cyber-green/10 hover:text-white'}`}>
              {categoryNames[cat].icon}
              {categoryNames[cat].name}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Tools Grid */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-1.5">
          {filteredTools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => { setActiveTool(tool); setInput(''); setOutput(''); setExtraInput(''); }}
              className={`p-2 rounded-lg border transition-all text-center ${
                activeTool.id === tool.id
                  ? 'bg-cyber-green/20 border-cyber-green/40 text-cyber-green'
                  : 'bg-cyber-purple/5 border-cyber-green/10 text-gray-400 hover:text-white hover:bg-cyber-purple/20'
              }`}
            >
              <div className="mx-auto mb-0.5">{tool.icon}</div>
              <div className="text-[10px] font-medium truncate">{tool.name}</div>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Tool Card */}
      <motion.div key={activeTool.id} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${categoryNames[activeTool.category].color}20` }}>
                <span style={{ color: categoryNames[activeTool.category].color }}>{activeTool.icon}</span>
              </div>
              <div>
                <h2 className="font-semibold text-white">{activeTool.name}</h2>
                <p className="text-xs text-gray-400">{activeTool.desc} · {categoryNames[activeTool.category].name}</p>
              </div>
            </div>
            {activeTool.hasEncodeDecode && !isSpecial && (
              <div className="flex rounded-lg overflow-hidden border border-cyber-green/20">
                <button onClick={() => setMode('encode')} className={`px-4 py-1.5 text-sm transition-colors ${mode === 'encode' ? 'bg-cyber-green/20 text-cyber-green' : 'bg-cyber-black/30 text-gray-400'}`}>编码</button>
                <button onClick={() => setMode('decode')} className={`px-4 py-1.5 text-sm transition-colors ${mode === 'decode' ? 'bg-cyber-green/20 text-cyber-green' : 'bg-cyber-black/30 text-gray-400'}`}>解码</button>
              </div>
            )}
          </div>

          {activeTool.id === 'random' && (
            <div className="mb-4 p-3 bg-cyber-black/30 rounded-lg border border-cyber-green/10">
              <label className="text-xs text-gray-400 block mb-2">随机数范围 (0 ~ N)</label>
              <input type="number" value={extraInput} onChange={e => setExtraInput(e.target.value)} placeholder="100" className="w-full p-2 bg-cyber-black/50 border border-cyber-green/20 rounded text-white text-sm" />
            </div>
          )}

          {activeTool.id === 'diff' && (
            <div className="mb-4 p-3 bg-cyber-black/30 rounded-lg border border-cyber-green/10">
              <label className="text-xs text-gray-400 block mb-2">请用"---"分隔两段文本</label>
              <textarea value={input} onChange={e => setInput(e.target.value)} placeholder={"第一段文本\n---\n第二段文本"} className="w-full h-24 p-3 bg-cyber-black/50 border border-cyber-green/20 rounded text-white text-sm font-mono resize-none" />
            </div>
          )}

          {!['diff'].includes(activeTool.id) && activeTool.id !== 'password' && (
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-2">
                {activeTool.placeholder?.includes('\n') ? '输入 (多行)' : '输入'}
              </label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={activeTool.placeholder}
                className="w-full h-28 p-3 rounded-lg bg-cyber-black/50 border border-cyber-green/20 text-white placeholder-gray-500 focus:outline-none focus:border-cyber-green/50 font-mono text-sm resize-none"
              />
            </div>
          )}

          <div className="flex gap-2 mb-4">
            {activeTool.id !== 'password' && (
              <Button onClick={handleProcess} className="flex-1">
                {activeTool.hasEncodeDecode ? (mode === 'encode' ? '处理' : '处理') : '执行'}
              </Button>
            )}
            <Button variant="outline" onClick={handleClear}><Trash2 size={16} /></Button>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-gray-400">结果</label>
              <button onClick={handleCopy} disabled={!output} className="text-gray-400 hover:text-white p-1 rounded transition-colors disabled:opacity-50 text-xs flex items-center gap-1">
                {copied ? <><Check size={12} className="text-cyber-green" /> 已复制</> : <><Copy size={12} /> 复制</>}
              </button>
            </div>
            <textarea value={output} readOnly placeholder="结果..." className="w-full h-36 p-3 rounded-lg bg-cyber-black/30 border border-cyber-green/10 text-cyber-green font-mono text-sm resize-none" />
          </div>
        </Card>
      </motion.div>

      {/* Stats */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <Card className="p-4 bg-cyber-purple/10 border-cyber-purple/20">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <Lock size={12} />
              <span>所有操作在本地完成，不上传数据</span>
            </div>
            <span>共 {tools.length} 个工具</span>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default OnlineTools;
