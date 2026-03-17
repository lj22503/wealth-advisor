# Wealth Advisor 前端部署指南

**版本**: v2.0  
**更新时间**: 2026-03-17

---

## 📋 部署方案

### 方案 1: Vercel（推荐 ⭐）

**优势**:
- ✅ 零配置部署
- ✅ 自动 HTTPS
- ✅ 全球 CDN
- ✅ 自动预览部署

**步骤**:

1. **安装 Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **登录 Vercel**
   ```bash
   vercel login
   ```

3. **构建并部署**
   ```bash
   npm run build
   vercel deploy --prod
   ```

4. **或使用部署脚本**
   ```bash
   ./deploy-vercel.sh
   ```

**环境变量配置**:
在 Vercel 项目设置中添加：
- `VITE_FEISHU_APP_ID`
- `VITE_FEISHU_APP_SECRET`
- `VITE_API_BASE_URL`
- `VITE_ENV=production`

---

### 方案 2: Docker 部署

**优势**:
- ✅ 环境隔离
- ✅ 易于扩展
- ✅ 跨平台一致

**步骤**:

1. **构建 Docker 镜像**
   ```bash
   ./deploy-docker.sh
   # 或手动构建
   docker build -t wealth-advisor-frontend:2.0.0 .
   ```

2. **运行容器**
   ```bash
   docker run -d -p 80:80 wealth-advisor-frontend:2.0.0
   ```

3. **推送到镜像仓库**
   ```bash
   docker tag wealth-advisor-frontend:2.0.0 registry.your-domain.com/wealth-advisor-frontend:2.0.0
   docker push registry.your-domain.com/wealth-advisor-frontend:2.0.0
   ```

**Docker Compose**（可选）:
```yaml
version: '3.8'
services:
  frontend:
    image: wealth-advisor-frontend:2.0.0
    ports:
      - "80:80"
    environment:
      - VITE_FEISHU_APP_ID=xxx
      - VITE_API_BASE_URL=https://api.your-domain.com
    restart: always
```

---

### 方案 3: 自有服务器（Nginx）

**优势**:
- ✅ 完全控制
- ✅ 成本低
- ✅ 数据本地化

**步骤**:

1. **构建生产版本**
   ```bash
   npm run build
   ```

2. **上传到服务器**
   ```bash
   scp -r dist/* user@server:/var/www/wealth-advisor
   ```

3. **配置 Nginx**
   ```bash
   sudo cp nginx.conf /etc/nginx/sites-available/wealth-advisor
   sudo ln -s /etc/nginx/sites-available/wealth-advisor /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

4. **配置环境变量**
   在服务器上创建 `.env.production` 文件，或使用构建时注入。

---

## 🔐 环境变量

### 开发环境 (.env.development)
```bash
VITE_FEISHU_APP_ID=cli_xxxxxxxxxxxxx
VITE_API_BASE_URL=http://localhost:3001/api
VITE_ENV=development
```

### 测试环境 (.env.test)
```bash
VITE_FEISHU_APP_ID=cli_test_xxxxxxxxxxxxx
VITE_API_BASE_URL=https://test-api.your-domain.com/api
VITE_ENV=test
```

### 生产环境 (.env.production)
```bash
VITE_FEISHU_APP_ID=cli_xxxxxxxxxxxxx
VITE_FEISHU_APP_SECRET=xxxxxxxxxxxxx
VITE_API_BASE_URL=https://api.your-domain.com/api
VITE_ENV=production
VITE_APP_VERSION=2.0.0
```

---

## 📊 性能优化

### 构建优化
- ✅ 代码分割（Code Splitting）
- ✅ Tree Shaking
- ✅ 压缩混淆
- ✅ 图片优化

### 运行时优化
- ✅ Gzip 压缩
- ✅ 浏览器缓存
- ✅ CDN 加速
- ✅ 懒加载

### 监控指标
- 首屏加载时间（FCP）: < 1.5s
- 可交互时间（TTI）: < 3.5s
- Lighthouse 分数：> 90

---

## 🔍 监控与日志

### 性能监控
```typescript
// 在 src/main.tsx 中
import { reportWebVitals } from './utils/performance';

reportWebVitals((metric) => {
  console.log(metric);
  // 发送到监控平台
  // sendToAnalytics(metric);
});
```

### 错误监控
```typescript
// 全局错误捕获
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  // sendToErrorTracking(event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  // sendToErrorTracking(event.reason);
});
```

---

## 🚨 故障排查

### 构建失败
```bash
# 清理缓存
rm -rf node_modules package-lock.json
npm install
npm run build
```

### 部署后白屏
1. 检查浏览器控制台错误
2. 检查 Nginx 配置
3. 检查路由模式（Hash vs History）
4. 检查静态资源路径

### API 请求失败
1. 检查 `VITE_API_BASE_URL` 配置
2. 检查 CORS 配置
3. 检查网络防火墙
4. 检查 SSL 证书

---

## 📈 CI/CD 集成

### GitHub Actions 示例
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
        env:
          VITE_FEISHU_APP_ID: ${{ secrets.FEISHU_APP_ID }}
          VITE_API_BASE_URL: ${{ secrets.API_BASE_URL }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 📞 支持

- **文档**: https://github.com/lj22503/wealth-advisor
- **Issues**: https://github.com/lj22503/wealth-advisor/issues

---

**维护者**: Wealth Advisor Team  
**最后更新**: 2026-03-17
