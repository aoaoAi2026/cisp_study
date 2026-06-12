# 接口文档

CISP 后端全部 REST API 接口定义，包含请求格式、响应结构和鉴权说明。

## 基础信息

- 开发地址：`http://localhost:3003`
- 代理路径：前端通过 Vite 代理将 `/api/*` 转发到后端
- 数据格式：JSON（`Content-Type: application/json`）
- 鉴权方式：JWT Bearer Token（`Authorization: Bearer <token>`）

## 通用约定

### 鉴权

除 `/api/auth/*` 和 `/api/health` 外，所有接口需要携带 JWT Token。

### 错误响应格式

```json
{
  "error": "错误描述",
  "detail": "详细错误信息（部分接口）"
}
```

HTTP 状态码：
- `200` — 成功
- `201` — 创建成功
- `400` — 请求参数错误
- `401` — 未认证或 Token 无效
- `404` — 资源不存在
- `409` — 资源冲突（如用户名已存在）
- `500` — 服务器内部错误

---

## 1. 健康检查

### GET /api/health

无需鉴权。

**响应示例：**

```json
{
  "status": "ok",
  "message": "CISP 后端服务运行中",
  "time": "2026-06-11T14:30:00.000Z"
}
```

---

## 2. 认证接口

### POST /api/auth/register

注册新用户。

**请求体：**

```json
{
  "username": "testuser",
  "password": "123456",
  "email": "test@example.com"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| username | string | 是 | 用户名，至少 3 个字符 |
| password | string | 是 | 密码，至少 6 个字符 |
| email | string | 否 | 邮箱地址 |

**成功响应（201）：**

```json
{
  "message": "注册成功",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com"
  }
}
```

**错误响应：**

| 状态码 | error | 说明 |
|--------|-------|------|
| 400 | 用户名和密码必填 | 缺少必填字段 |
| 400 | 用户名至少3个字符 | 用户名过短 |
| 400 | 密码至少6个字符 | 密码过短 |
| 409 | 用户名已存在 | 用户名重复 |

---

### POST /api/auth/login

用户登录。

**请求体：**

```json
{
  "username": "testuser",
  "password": "123456"
}
```

**成功响应：**

```json
{
  "message": "登录成功",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com"
  }
}
```

**错误响应：**

| 状态码 | error | 说明 |
|--------|-------|------|
| 400 | 用户名和密码必填 | 缺少必填字段 |
| 401 | 用户名或密码错误 | 用户名不存在或密码不匹配 |

---

### GET /api/auth/me

获取当前登录用户信息。**需要鉴权。**

**响应示例：**

```json
{
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com",
    "created_at": "2026-06-01T08:00:00.000Z"
  }
}
```

**错误响应：**

| 状态码 | error | 说明 |
|--------|-------|------|
| 401 | 未提供认证令牌 | 缺少 Authorization 头 |
| 401 | 令牌无效或已过期 | Token 无效 |
| 404 | 用户不存在 | 用户已被删除 |

---

## 3. 学习进度接口

全部需要鉴权（`middleware/auth.js` 全局应用）。

### GET /api/progress/all

获取当前用户的全部学习进度。

**响应示例：**

```json
{
  "currentDay": 3,
  "mode": "full",
  "streak": 2,
  "lastStudyDate": "2026-06-10",
  "completedDays": [
    { "dayId": "day-1", "completedAt": "2026-06-09T10:00:00.000Z", "quizScore": 85 },
    { "dayId": "day-2", "completedAt": "2026-06-10T09:30:00.000Z", "quizScore": 90 }
  ],
  "completedLabs": ["juice-shop"],
  "quizResults": {
    "quiz-1": { "score": 85, "date": "2026-06-09T10:00:00.000Z" }
  }
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| currentDay | number | 当前学习天数 |
| mode | string | 学习模式：`"full"` 完整 / `"intensive"` 强化 |
| streak | number | 连续学习天数（中断超过 1 天则重置） |
| lastStudyDate | string | 最后学习日期（YYYY-MM-DD） |
| completedDays | array | 已完成的天数列表 |
| completedLabs | string[] | 已完成的靶场 ID 列表 |
| quizResults | object | 测验成绩，key 为 quizId |

---

### POST /api/progress/day/:dayId/complete

标记某天学习完成。

**路径参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| dayId | string | 天数 ID，如 `"day-1"`、`"day-30"` |

**请求体：**

```json
{
  "quizScore": 85
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| quizScore | number | 否 | 该天测验得分 |

**成功响应：**

```json
{
  "success": true,
  "currentDay": 4
}
```

> 完成后会自动推进 `currentDay` 到下一天（取已完成天数的最大值 + 1）。

---

### POST /api/progress/lab/:labId/complete

标记靶场实验完成。

**路径参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| labId | string | 靶场 ID：`juice-shop` / `webgoat` / `dvwa` / `bwapp` |

**成功响应：**

```json
{
  "success": true
}
```

---

### POST /api/progress/quiz/:quizId

保存测验成绩。

**路径参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| quizId | string | 测验 ID |

**请求体：**

```json
{
  "score": 92
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| score | number | 是 | 得分 |

**成功响应：**

```json
{
  "success": true
}
```

> 如果同一 quizId 已有成绩，会覆盖更新。

---

### PUT /api/progress/preferences

更新学习偏好设置。

**请求体：**

```json
{
  "currentDay": 5,
  "mode": "intensive"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| currentDay | number | 否 | 当前学习天数 |
| mode | string | 否 | 学习模式：`"full"` 或 `"intensive"` |

**成功响应：**

```json
{
  "success": true,
  "preferences": {
    "current_day": 5,
    "mode": "intensive",
    "last_study_date": "2026-06-10"
  }
}
```

---

### POST /api/progress/reset

重置当前用户的全部学习进度（清除完成记录、测验成绩，偏好恢复默认）。

**成功响应：**

```json
{
  "success": true
}
```

---

## 4. 靶场接口

### GET /api/labs/list

获取所有靶场容器列表及运行状态。

**响应示例：**

```json
{
  "containers": [
    {
      "id": "juice-shop",
      "name": "OWASP Juice Shop",
      "description": "最流行的Web安全练习平台...",
      "port": 3000,
      "url": "http://localhost:3000",
      "dockerImage": "bkimminich/juice-shop:latest",
      "difficulty": "简单",
      "category": "Web安全",
      "defaultLogin": "admin@juice-sh.op / admin123",
      "features": ["SQL注入", "XSS跨站脚本", "CSRF", "文件上传漏洞", "认证绕过", "API安全"],
      "running": true,
      "status": "Up 2 hours"
    }
  ],
  "total": 4
}
```

---

### GET /api/labs/status/:containerId

获取单个容器状态。

**路径参数：** `containerId` — 容器 ID（`juice-shop` / `webgoat` / `dvwa` / `bwapp`）

**响应示例：**

```json
{
  "id": "juice-shop",
  "name": "OWASP Juice Shop",
  "port": 3000,
  "url": "http://localhost:3000",
  "running": true,
  "status": "Up 2 hours"
}
```

---

### POST /api/labs/start/:containerId

启动指定靶场容器。

**路径参数：** `containerId` — 容器 ID

**成功响应：**

```json
{
  "success": true,
  "message": "启动成功，请等待30秒后访问",
  "detail": "..."
}
```

**失败响应：**

```json
{
  "success": false,
  "message": "启动失败: ...",
  "detail": "..."
}
```

---

### POST /api/labs/stop/:containerId

停止指定靶场容器。

**成功响应：**

```json
{
  "success": true,
  "message": "停止成功",
  "detail": "..."
}
```

---

### GET /api/labs/tools

获取安全工具命令参考列表（静态数据）。

**响应示例：**

```json
{
  "tools": [
    {
      "id": "nmap",
      "name": "Nmap",
      "description": "最流行的网络扫描工具...",
      "commands": [
        { "name": "基础扫描", "cmd": "nmap 192.168.1.1", "description": "扫描单个IP的常用端口" }
      ],
      "officialSite": "https://nmap.org/"
    }
  ]
}
```

包含的工具：Nmap、Burp Suite、SQLMap、Hydra、John the Ripper、Wireshark、Metasploit、OpenSSL。

---

## 5. Token 说明

### Token 生成

- 算法：HS256
- 载荷：`{ userId, username }`
- 有效期：30 天
- 密钥：`process.env.JWT_SECRET` 或内置 fallback

### 前端使用方式

```typescript
// src/api/client.ts
const token = localStorage.getItem('cisp_token');
headers['Authorization'] = `Bearer ${token}`;
```

### 验证流程

```
middleware/auth.js:
  1. 检查 Authorization: Bearer <token> 头
  2. jwt.verify(token, JWT_SECRET)
  3. 解码后挂载到 req.user
```
