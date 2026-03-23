# 🚀 Vercel 部署执行指南

**创建时间：** 2026-03-23 15:50  
**状态：** 准备就绪，等待执行

---

## ⚠️ 当前状态

**Vercel 凭证：** 未配置  
**需要操作：** 登录 Vercel 或提供 Token

---

## 🔧 执行方式

### 方式 1：交互式登录（推荐）

```bash
# 1. 登录 Vercel
vercel login

# 2. 选择登录方式（GitHub/GitLab/Bitbucket/Email）

# 3. 部署项目
cd /home/admin/.openclaw/workspace/projects/wealth-advisor
vercel deploy --prod --yes
```

### 方式 2：使用 Token

```bash
# 获取 Token：https://vercel.com/account/tokens
export VERCEL_TOKEN=your_token_here

# 部署
cd /home/admin/.openclaw/workspace/projects/wealth-advisor
vercel deploy --prod --yes --token=$VERCEL_TOKEN
```

---

## 📦 部署包内容

已准备就绪的文件：

| 文件 | 说明 | 状态 |
|------|------|------|
| `api/clients.ts` | 客户管理 API | ✅ |
| `api/holdings.ts` | 持仓管理 API | ✅ |
| `api/holdings-stats.ts` | 持仓统计 API | ✅ |
| `vercel.json` | Vercel 配置 | ✅ |
| `frontend-web/` | 前端应用 | ✅ |
| `DEPLOYMENT.md` | 部署指南 | ✅ |

---

## 🎯 部署后 URL

部署成功后，你将获得：

- **生产环境 URL：** `https://wealth-advisor-xxx.vercel.app`
- **预览环境 URL：** `https://wealth-advisor-git-main-xxx.vercel.app`

---

## ✅ 部署验证清单

部署完成后测试：

- [ ] 访问首页 `https://xxx.vercel.app`
- [ ] 检查客户列表加载
- [ ] 测试新增客户功能
- [ ] 访问持仓诊断页面
- [ ] 检查 API 响应（浏览器 DevTools）

---

## 🔗 快速链接

- **Vercel 登录：** https://vercel.com/login
- **Vercel 控制台：** https://vercel.com/dashboard
- **Token 管理：** https://vercel.com/account/tokens

---

## 📝 快速执行命令

```bash
# 复制粘贴执行（方式 1）
cd /home/admin/.openclaw/workspace/projects/wealth-advisor
vercel login
vercel deploy --prod --yes

# 或（方式 2，如有 Token）
cd /home/admin/.openclaw/workspace/projects/wealth-advisor
vercel deploy --prod --yes --token=YOUR_TOKEN
```

---

**等待执行：** 请选择上述任一方式执行部署！
