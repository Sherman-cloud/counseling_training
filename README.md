# 心理咨询师培训系统 - 后端服务

## 项目简介

这是一个基于 Node.js 和 Express 的代理服务器，用于连接前端应用与 Dify AI API。

## 技术栈

- Node.js (>= 18.0.0)
- Express.js
- http-proxy-middleware
- CORS
- dotenv

## 快速开始

### 本地开发

1. 安装依赖
```bash
npm install
```

2. 配置环境变量
```bash
cp .env.example .env.local
```

3. 启动服务
```bash
npm start
```

服务将在 `http://localhost:3000` 启动

## 环境变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| PORT | 服务器端口 | 3000 |
| PROXY_TARGET | 代理目标地址 | https://gateway.lingxinai.com/dify-test |
| PROXY_PATH_REWRITE | 路径重写规则 | /v1 |
| CORS_ORIGIN | CORS 允许的源 | * |
| NODE_ENV | 运行环境 | development |

## API 端点

### POST /api/chat-messages
发送聊天消息到 Dify API

**请求头：**
```
Authorization: Bearer {your-api-key}
Content-Type: application/json
```

**请求体：**
```json
{
  "inputs": {},
  "query": "用户消息",
  "response_mode": "blocking",
  "conversation_id": "",
  "user": "user-123"
}
```

## 部署

详细的部署指南请查看 [DEPLOYMENT.md](./DEPLOYMENT.md)

### 推荐部署方式

1. **PM2 部署**（推荐用于生产环境）
2. **Docker 部署**（推荐用于容器化环境）
3. **systemd 部署**（推荐用于 Linux 服务器）

## 项目结构

```
.
├── proxy-server.js          # 主服务器文件
├── package.json              # 项目配置
├── ecosystem.config.js       # PM2 配置
├── .env.example              # 环境变量示例
├── .env.local                # 本地环境变量（不提交）
├── .gitignore                # Git 忽略文件
├── DEPLOYMENT.md             # 部署指南
└── README.md                 # 项目说明
```

## 开发说明

### 修改代理配置

编辑 `proxy-server.js` 中的代理配置，或通过环境变量设置。

### 添加新的 API 端点

在 `proxy-server.js` 中添加新的 Express 路由。

## 常见问题

### 端口被占用
修改 `.env` 文件中的 `PORT` 变量

### CORS 错误
检查 `CORS_ORIGIN` 配置，确保包含前端域名

### 代理失败
检查 `PROXY_TARGET` 地址是否正确，网络是否可达

## 许可证

MIT

## 联系方式

如有问题，请提交 Issue 或 Pull Request。
