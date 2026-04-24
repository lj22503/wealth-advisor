# 🚀 零基础部署指南

**目标**: 让完全不懂技术的小白也能 10 分钟内部署成功

---

## 方案选择

### 🌟 推荐：Vercel（最简单）
- ✅ 不需要服务器
- ✅ 不需要配置
- ✅ 免费
- ✅ 自动 HTTPS
- ✅ 全球访问快

**适合**: 99% 的用户

### 🐳 备选：Docker（需要服务器）
- ✅ 完全控制
- ✅ 数据在自己手里
- ❌ 需要买服务器
- ❌ 需要配置域名

**适合**: 企业内网/数据敏感

---

## 🌟 Vercel 部署（10 分钟版）

### 第 1 步：准备账号（2 分钟）

1. **打开 Vercel 官网**
   ```
   https://vercel.com
   ```

2. **点击「Sign Up」注册**
   - 推荐用 GitHub 账号登录（没有就注册一个）
   - GitHub: https://github.com/signup

3. **登录成功后，看到 Dashboard 页面**

---

### 第 2 步：连接 GitHub（3 分钟）

1. **点击「Add New...」→「Project」**

2. **导入 GitHub 仓库**
   - 找到 `lj22503/wealth-advisor` 仓库
   - 点击「Import」

3. **如果找不到仓库**
   - 点击「Adjust GitHub App Permissions」
   - 授权 Vercel 访问你的 GitHub 仓库

---

### 第 3 步：配置环境变量（3 分钟）

在 Vercel 的项目设置页面，找到「Environment Variables」，添加以下变量：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `VITE_FEISHU_APP_ID` | `cli_xxxxxxxxxxxxx` | 飞书应用 ID（没有就先留空） |
| `VITE_API_BASE_URL` | `http://localhost:3001/api` | API 地址（先用这个） |
| `VITE_ENV` | `production` | 环境标识 |

**点击「Save」保存**

---

### 第 4 步：部署（1 分钟）

1. **点击「Deploy」按钮**

2. **等待 2-3 分钟**
   - Vercel 会自动构建
   - 看到绿色 ✅ 表示成功

3. **访问你的网站**
   - 点击「Visit」按钮
   - 或复制域名（如：`https://wealth-advisor-xxx.vercel.app`）

---

### 第 5 步：测试（1 分钟）

打开部署后的网址，检查：
- ✅ 能看到登录页面吗？
- ✅ 能看到首页吗？
- ✅ 能看到客户列表吗？

**如果有问题** → 看下面的「常见问题」

---

## 🐳 Docker 部署（20 分钟版）

### 前提条件
- 有一台服务器（阿里云/腾讯云，约 ¥50/月）
- 已安装 Docker

### 第 1 步：买服务器（5 分钟）

1. **选择云服务商**
   - 阿里云：https://www.aliyun.com
   - 腾讯云：https://cloud.tencent.com

2. **选择配置**
   - CPU: 2 核
   - 内存：2GB
   - 系统：Ubuntu 20.04

3. **付款后获取**
   - 服务器 IP（如：`123.45.67.89`）
   - 用户名（通常是 `root`）
   - 密码

---

### 第 2 步：连接服务器（3 分钟）

**Windows 用户**:
1. 下载 PuTTY: https://www.putty.org
2. 输入服务器 IP，点击「Open」
3. 输入用户名 `root` 和密码

**Mac 用户**:
```bash
ssh root@123.45.67.89
# 输入密码
```

---

### 第 3 步：安装 Docker（5 分钟）

在服务器终端执行：
```bash
# 一键安装 Docker
curl -fsSL https://get.docker.com | bash

# 验证安装
docker --version
```

看到 `Docker version x.x.x` 表示成功

---

### 第 4 步：运行应用（5 分钟）

```bash
# 拉取镜像（如果没有镜像，先构建）
docker run -d -p 80:80 wealth-advisor-frontend:latest

# 或者从 Docker Hub 拉取（如果有）
# docker pull your-username/wealth-advisor-frontend
# docker run -d -p 80:80 your-username/wealth-advisor-frontend
```

---

### 第 5 步：访问（2 分钟）

打开浏览器，访问：
```
http://你的服务器 IP
```

例如：`http://123.45.67.89`

---

## ❓ 常见问题

### Q1: Vercel 部署失败，提示「Build Error」
**解决**:
1. 点击「View Build Logs」查看详细错误
2. 常见原因：
   - 缺少环境变量 → 回到第 3 步补充
   - Node.js 版本不匹配 → 检查 package.json
3. 还是不行 → 把错误信息发给 AI 助手

### Q2: 访问部署后的网站显示白屏
**解决**:
1. 打开浏览器开发者工具（F12）
2. 看 Console 有什么错误
3. 常见原因：
   - API 地址配置错误 → 检查 `VITE_API_BASE_URL`
   - 路由问题 → 检查 Nginx 配置（Docker 方案）

### Q3: 飞书应用 ID 在哪里获取？
**解决**:
1. 打开飞书开放平台：https://open.feishu.cn
2. 登录 → 创建应用
3. 复制「App ID」（格式：`cli_xxxxxxxxxxxxx`）

**如果暂时没有**:
- 可以先留空，不影响基础功能
- 后续补上即可

### Q4: 本地开发怎么跑？
**解决**:
```bash
# 进入项目目录
cd frontend-web

# 安装依赖（第一次需要）
npm install

# 启动开发服务器
npm run dev

# 访问 http://localhost:3000
```

### Q5: 部署后数据在哪里？
**回答**:
- **前端**: 只负责展示，不存储数据
- **数据**: 在后端 API 中（需要单独部署后端）
- **本地测试**: 使用模拟数据

---

## 🎯 下一步

部署成功后，你可以：

1. **测试功能**
   - 添加客户
   - 查看持仓
   - 生成报告

2. **配置飞书**
   - 获取飞书应用 ID
   - 更新环境变量
   - 重新部署

3. **开始 Week4**
   - 功能测试
   - Bug 修复
   - 性能优化

---

## 📞 需要帮助？

遇到问题时：

1. **查看错误信息**
   - 部署日志
   - 浏览器 Console
   - 服务器日志

2. **描述问题**
   - 你做了什么操作
   - 期望的结果
   - 实际的结果
   - 错误信息截图

3. **联系支持**
   - GitHub Issues: https://github.com/lj22503/wealth-advisor/issues
   - AI 助手：直接问

---

**祝你部署成功！** 🎉
