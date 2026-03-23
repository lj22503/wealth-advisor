# Vercel 全栈部署指南

**更新时间：** 2026-03-23  
**部署平台：** Vercel（全栈部署）

---

## 📋 项目结构

```
wealth-advisor/
├── api/                    # Vercel API Routes（后端）
│   ├── clients.ts         # 客户管理 API
│   ├── holdings.ts        # 持仓管理 API
│   └── holdings-stats.ts  # 持仓统计 API
├── frontend-web/          # 前端 React 应用
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
├── vercel.json            # Vercel 配置
└── README.md
```

---

## 🚀 部署步骤

### Step 1: 安装 Vercel CLI

```bash
npm install -g vercel
```

### Step 2: 登录 Vercel

```bash
vercel login
```

### Step 3: 本地测试构建

```bash
cd frontend-web
npm install
npm run build
```

### Step 4: 部署到 Vercel

```bash
# 在项目根目录执行
cd /home/admin/.openclaw/workspace/projects/wealth-advisor
vercel --prod
```

### Step 5: 配置环境变量

在 Vercel 控制台设置：
- `VITE_API_BASE_URL` = `/api`
- `NODE_ENV` = `production`

---

## 📊 API 路由

部署后可用 API：

| 端点 | 方法 | 说明 |
|------|------|------|
| `/api/clients` | GET | 获取客户列表 |
| `/api/clients` | POST | 新增客户 |
| `/api/clients/:id` | GET | 获取客户详情 |
| `/api/holdings?clientId=xxx` | GET | 获取持仓列表 |
| `/api/holdings-stats?clientId=xxx` | GET | 获取持仓统计 |

---

## 🔧 Vercel 配置说明

### vercel.json

```json
{
  "version": 2,
  "builds": [
    {
      "src": "frontend-web/package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "dist" }
    }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "/api/$1" },
    { "src": "/(.*)", "dest": "/frontend-web/$1" }
  ]
}
```

### 前端构建配置

Vercel 自动检测 `frontend-web/package.json` 并执行：
- `npm run build` - 构建生产版本
- 输出目录：`frontend-web/dist`

---

## 📝 注意事项

### 1. 数据持久化

**当前状态：** 内存模式（重启后数据清空）

**生产环境建议：**
- 使用 Vercel Postgres
- 或使用外部数据库（MongoDB Atlas/Supabase）

### 2. API 限制

- Vercel Hobby 计划：100GB 带宽/月
- Serverless Function 超时：10 秒
- 内存限制：1024MB

### 3. 环境变量

**开发环境：**
```bash
# frontend-web/.env
VITE_API_BASE_URL=/api
```

**生产环境：**
在 Vercel 控制台设置环境变量

---

## 🧪 测试清单

部署后测试：

- [ ] 首页加载正常
- [ ] 客户列表显示
- [ ] 新增客户功能
- [ ] 客户详情页面
- [ ] 持仓诊断页面
- [ ] 批量删除功能
- [ ] 导入导出功能

---

## 🔗 相关链接

- **Vercel 控制台：** https://vercel.com/dashboard
- **项目文档：** https://vercel.com/docs
- **API Routes：** https://vercel.com/docs/functions

---

**部署状态：** 准备就绪 ✅  
**预计部署时间：** 5-10 分钟
