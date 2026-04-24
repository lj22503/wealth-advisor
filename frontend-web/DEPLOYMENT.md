# Wealth Advisor 前端部署指南

**版本**: v2.1  
**更新时间**: 2026-04-24

---

## 🚀 快速部署 (Vercel)

### 方式 1: GitHub 自动部署 (推荐 ⭐)

推送代码到 GitHub，Vercel 自动检测并部署：

```bash
git add .
git commit -m "refactor: rebuild Vercel deployment"
git push origin main
```

Vercel 会自动：
1. 检测 `vercel.json` 配置
2. 构建 `frontend-web` 目录
3. 部署为 SPA + API 函数
4. 配置 SPA 路由 (所有 404 → index.html)

### 方式 2: Vercel CLI 手动部署

```bash
# 从项目根目录部署
cd ~/Hermes/workspace/projects/github-repos/wealth-advisor
vercel --prod
```

### 方式 3: 拉取现有部署

```bash
vercel --prod
```

---

## ⚙️ vercel.json 配置

项目根目录的 `vercel.json` 定义了完整的部署行为：

```json
{
  "version": 2,
  "buildCommand": "cd frontend-web && npm install && npm run build",
  "outputDirectory": "frontend-web/dist",
  "routes": [
    { "src": "/api/(.*)", "dest": "/api/$1" },
    { "src": "/.*", "dest": "/index.html" }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" }
      ]
    }
  ]
}
```

**路由说明**:
- `/api/*` → 代理到 Vercel Serverless Functions (`api/` 目录)
- `/*` → 所有其他请求返回 `index.html` (SPA 路由)

---

## 🔐 环境变量

在 Vercel 项目设置中配置：

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `VITE_FEISHU_APP_ID` | 飞书应用 ID (公开) | `cli_xxxxxxxxxxxxx` |
| `VITE_API_BASE_URL` | API 地址 (生产环境用 `/api`) | `/api` |
| `VITE_ENV` | 部署环境 | `production` |

**注意**: `VITE_FEISHU_APP_SECRET` 不应暴露在前端，仅在后端使用。

### 本地开发环境变量 (.env.development)

```bash
VITE_FEISHU_APP_ID=cli_xxxxxxxxxxxxx
VITE_API_BASE_URL=http://localhost:3001/api
VITE_ENV=development
```

### 生产环境变量 (.env.production)

```bash
VITE_FEISHU_APP_ID=cli_xxxxxxxxxxxxx
VITE_API_BASE_URL=/api
VITE_ENV=production
```

---

## 📁 项目结构

```
wealth-advisor/
├── vercel.json              # Vercel 部署配置
├── frontend-web/            # React + Vite 前端
│   ├── src/
│   ├── dist/                # 构建输出 (自动部署)
│   ├── .env.production      # 生产环境变量
│   └── vite.config.ts      # Vite 配置
└── api/                     # Vercel Serverless Functions
    ├── health.js            # 健康检查
    ├── clients.ts           # 客户管理 API
    └── holdings.ts          # 持仓管理 API
```

---

## 🧪 验证部署

部署完成后访问:

- **前端**: `https://your-project.vercel.app`
- **API 健康检查**: `https://your-project.vercel.app/api/health`
- **客户列表**: `https://your-project.vercel.app/api/clients`

---

## 🐛 故障排查

### 部署后白屏
1. 检查浏览器控制台错误
2. 确认 `VITE_API_BASE_URL=/api` 正确
3. 检查 `vercel.json` 的 `outputDirectory` 配置

### API 请求失败
1. 检查 CORS 配置 (已配置 `Access-Control-Allow-Origin: *`)
2. 确认 API 函数正确导出 `default` handler
3. 查看 Vercel 函数日志

### 构建失败
```bash
cd frontend-web
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 📞 支持

- **文档**: https://github.com/lj22503/wealth-advisor
- **Issues**: https://github.com/lj22503/wealth-advisor/issues

---

**维护者**: Wealth Advisor Team  
**最后更新**: 2026-04-24
