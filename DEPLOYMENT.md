# 后端部署指南

## 本地开发

### 1. 安装依赖
```bash
npm install
```

### 2. 配置环境变量
复制 `.env.example` 为 `.env.local` 并根据需要修改配置：
```bash
cp .env.example .env.local
```

### 3. 启动开发服务器
```bash
npm start
```

服务器将在 `http://localhost:3000` 启动

## 生产环境部署

### 方案一：使用 PM2 部署（推荐）

#### 1. 安装 PM2
```bash
npm install -g pm2
```

#### 2. 创建 ecosystem 配置文件
在项目根目录创建 `ecosystem.config.js`：
```javascript
module.exports = {
  apps: [{
    name: 'counseling-backend',
    script: './proxy-server.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
```

#### 3. 启动应用
```bash
pm2 start ecosystem.config.js --env production
```

#### 4. 查看日志
```bash
pm2 logs counseling-backend
```

#### 5. 重启应用
```bash
pm2 restart counseling-backend
```

#### 6. 停止应用
```bash
pm2 stop counseling-backend
```

### 方案二：使用 Docker 部署

#### 1. 创建 Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

#### 2. 创建 .dockerignore
```
node_modules
npm-debug.log
.env.local
.git
```

#### 3. 构建镜像
```bash
docker build -t counseling-backend .
```

#### 4. 运行容器
```bash
docker run -d -p 3000:3000 \
  -e PORT=3000 \
  -e PROXY_TARGET=https://gateway.lingxinai.com/dify-test \
  -e PROXY_PATH_REWRITE=/v1 \
  -e CORS_ORIGIN=* \
  --name counseling-backend \
  counseling-backend
```

### 方案三：使用 systemd（Linux 服务器）

#### 1. 创建服务文件
在 `/etc/systemd/system/counseling-backend.service` 创建：
```ini
[Unit]
Description=Counseling Backend Service
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/path/to/counseling-backend
ExecStart=/usr/bin/node /path/to/counseling-backend/proxy-server.js
Restart=on-failure
Environment=NODE_ENV=production
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
```

#### 2. 启动服务
```bash
sudo systemctl start counseling-backend
sudo systemctl enable counseling-backend
```

#### 3. 查看状态
```bash
sudo systemctl status counseling-backend
```

## 环境变量说明

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| PORT | 服务器端口 | 3000 |
| PROXY_TARGET | 代理目标地址 | https://gateway.lingxinai.com/dify-test |
| PROXY_PATH_REWRITE | 路径重写规则 | /v1 |
| CORS_ORIGIN | CORS 允许的源 | * |
| NODE_ENV | 运行环境 | development |

## 部署检查清单

- [ ] 安装所有依赖
- [ ] 配置环境变量（生产环境使用 `.env`，本地开发使用 `.env.local`）
- [ ] 确保端口 3000 可用
- [ ] 测试代理功能
- [ ] 配置防火墙规则
- [ ] 设置日志监控
- [ ] 配置自动重启机制

## 常见问题

### 1. 端口被占用
修改 `.env` 文件中的 `PORT` 变量

### 2. 代理失败
检查 `PROXY_TARGET` 地址是否正确，网络是否可达

### 3. CORS 错误
检查 `CORS_ORIGIN` 配置，确保包含前端域名

### 4. 内存不足
使用 PM2 的 `max_memory_restart` 限制内存使用

## 监控和日志

### PM2 监控
```bash
pm2 monit
```

### 查看实时日志
```bash
pm2 logs --lines 100
```

### 系统日志
```bash
journalctl -u counseling-backend -f
```

## 安全建议

1. 不要将 `.env` 文件提交到版本控制
2. 在生产环境中使用 HTTPS
3. 限制 `CORS_ORIGIN` 为特定域名
4. 定期更新依赖包
5. 配置防火墙规则
6. 使用反向代理（如 Nginx）处理静态文件和 SSL
