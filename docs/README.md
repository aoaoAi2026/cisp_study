# 文档导航

CISP 学习平台全部项目文档的入口索引，按主题分类。

## 快速入门

| 文档 | 说明 | 适合人群 |
|------|------|----------|
| [../README.md](../README.md) | 项目根文档，含定位、技术栈、快速启动 | 所有人 |
| [setup/environment.md](setup/environment.md) | 环境依赖、端口关系、Docker 与 Android 前置 | 首次搭建环境 |

## 架构与设计

| 文档 | 说明 |
|------|------|
| [architecture/overview.md](architecture/overview.md) | 系统架构总览：前端、后端、JSON 存储、Docker 靶场、Capacitor 关系 |

## 后端接口

| 文档 | 说明 |
|------|------|
| [backend/api.md](backend/api.md) | 全部 REST API 接口定义、请求/响应结构、鉴权方式 |

## 靶场

| 文档 | 说明 |
|------|------|
| [labs/docker-labs.md](labs/docker-labs.md) | 靶场容器列表、启动/停止、排障建议、安全边界 |

## 计划补充

以下文档尚未编写，可根据需要逐步完善：

| 建议文档 | 预期内容 |
|----------|----------|
| `frontend/routes.md` | 前端页面与路由地图，每个页面用途和入口路径 |
| `data/data-model.md` | `backend/data/database.json` 数据结构说明 |
| `data/content-guide.md` | `src/data/` 下各文件字段约束和内容更新方式 |
| `frontend/store-guide.md` | Zustand 状态管理（user / learning / achievement / community store）使用说明 |
| `mobile/capacitor-guide.md` | Capacitor 配置详解、Android 签名、发布流程 |

## 目录约定

```
docs/
├── README.md                   # 本文件（文档导航）
├── setup/
│   └── environment.md          # 环境说明
├── architecture/
│   └── overview.md             # 架构总览
├── backend/
│   └── api.md                  # 接口文档
└── labs/
    └── docker-labs.md          # 靶场说明
```

欢迎继续扩展 `docs/` 下的文档，保持按主题分目录的组织方式。
