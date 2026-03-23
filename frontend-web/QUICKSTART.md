# 🎯 10 分钟快速开始

**适合人群**: 完全不懂技术的小白  
**预计时间**: 10 分钟  
**目标**: 让应用跑起来

---

## 方案 A: 本地运行（2 分钟）

**用途**: 先看看应用长什么样

### 步骤

1. **打开终端/命令行**
   - Windows: 按 `Win+R`，输入 `cmd`，回车
   - Mac: 按 `Cmd+Space`，输入 `terminal`，回车

2. **进入项目目录**
   ```bash
   cd /path/to/wealth-advisor/frontend-web
   ```

3. **安装依赖**（第一次需要，约 1 分钟）
   ```bash
   npm install
   ```

4. **启动应用**
   ```bash
   npm run dev
   ```

5. **打开浏览器访问**
   ```
   http://localhost:3000
   ```

**完成！** 🎉 现在你可以看到应用了

---

## 方案 B: Vercel 部署（10 分钟）

**用途**: 让别人也能访问

### 步骤

#### 1. 准备 GitHub 账号（3 分钟）

1. 打开 https://github.com
2. 点击「Sign up」注册（或「Sign in」登录）
3. 记住你的用户名

#### 2. 准备 Vercel 账号（2 分钟）

1. 打开 https://vercel.com
2. 点击「Sign Up」
3. 选择「Continue with GitHub」
4. 授权 Vercel 访问你的 GitHub

#### 3. 部署应用（5 分钟）

1. **点击「Add New...」→「Project」**

2. **导入仓库**
   - 找到 `wealth-advisor` 仓库
   - 点击「Import」

3. **配置环境变量**（可选）
   ```
   VITE_API_BASE_URL = http://localhost:3001/api
   VITE_ENV = production
   ```

4. **点击「Deploy」**

5. **等待 2-3 分钟**

6. **访问你的网站**
   - 点击「Visit」
   - 或复制链接（如：`https://xxx.vercel.app`）

**完成！** 🎉 现在全世界都能访问你的应用了

---

## ❓ 遇到问题？

### 问题 1: npm install 失败
**原因**: 网络问题  
**解决**: 
```bash
# 使用国内镜像
npm config set registry https://registry.npmmirror.com
npm install
```

### 问题 2: npm run dev 报错
**原因**: 依赖缺失  
**解决**:
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### 问题 3: Vercel 部署失败
**原因**: 配置问题  
**解决**:
1. 查看 Build Logs 找错误
2. 检查 package.json 是否存在
3. 检查 Node.js 版本（需要 18+）

### 问题 4: 访问白屏
**原因**: API 地址错误  
**解决**:
1. 打开浏览器开发者工具（F12）
2. 看 Console 的错误信息
3. 检查环境变量配置

---

## 📞 需要帮助？

**最佳方式**: 把错误信息截图发给 AI 助手

**包含这些信息**:
1. 你做了什么操作
2. 看到了什么错误
3. 错误信息的截图

---

## ✅ 验证成功

### 本地运行成功标志
- ✅ 终端显示 `Local: http://localhost:3000`
- ✅ 浏览器能看到应用界面
- ✅ 点击菜单有反应

### Vercel 部署成功标志
- ✅ 看到绿色 ✅ 图标
- ✅ 能访问分配的域名
- ✅ 页面正常显示

---

**祝你成功！** 🚀
