require('dotenv').config({ path: '.env.local' });
const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 3000;
const PROXY_TARGET = process.env.PROXY_TARGET || 'https://gateway.lingxinai.com/dify-test';
const PROXY_PATH_REWRITE = process.env.PROXY_PATH_REWRITE || '/v1';
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

app.use(cors({
    origin: CORS_ORIGIN,
    credentials: true
}));

app.use('/api', createProxyMiddleware({
    target: PROXY_TARGET,
    changeOrigin: true,
    secure: false,
    pathRewrite: {
        '^/api': PROXY_PATH_REWRITE
    },
    onProxyReq: (proxyReq, req, res) => {
        console.log('代理请求:', req.method, req.url);
        console.log('Authorization头:', req.headers.authorization);

        if (req.headers.authorization) {
            proxyReq.setHeader('Authorization', req.headers.authorization);
        }

        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Accept', 'application/json');
    },
    onProxyRes: (proxyRes, req, res) => {
        console.log('代理响应状态:', proxyRes.statusCode, req.url);
        
        delete proxyRes.headers['access-control-allow-origin'];
        delete proxyRes.headers['access-control-allow-credentials'];
        delete proxyRes.headers['access-control-expose-headers'];
        
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
    },
    onError: (err, req, res) => {
        console.error('代理错误:', err);
        res.status(500).json({
            error: '代理服务器错误',
            message: err.message,
            url: req.url
        });
    }
}));

app.use(express.static(__dirname));

app.listen(PORT, () => {
    console.log(`代理服务器运行在 http://localhost:${PORT}`);
    console.log(`前端应用地址: http://localhost:5173`);
});
