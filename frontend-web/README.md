# Wealth Advisor - 网页应用前端

**技术栈**: React 18 + Vite 5 + TypeScript + Arco Design

---

## 快速开始

### 安装依赖
```bash
npm install
```

### 开发运行
```bash
npm run dev
```

访问：http://localhost:3000

### 构建生产版本
```bash
npm run build
```

### 预览生产构建
```bash
npm run preview
```

---

## 项目结构

```
frontend-web/
├── src/
│   ├── components/        # 可复用组件
│   │   └── Layout.tsx     # 布局组件
│   ├── pages/             # 页面组件
│   │   ├── HomePage.tsx           # 首页
│   │   ├── ClientListPage.tsx     # 客户列表
│   │   ├── ClientDetailPage.tsx   # 客户详情
│   │   ├── HoldingDiagnosisPage.tsx  # 持仓诊断
│   │   ├── ReportPage.tsx         # 报告中心
│   │   └── SettingsPage.tsx       # 设置
│   ├── services/          # API 服务
│   │   ├── client.ts      # 客户服务
│   │   └── holding.ts     # 持仓服务
│   ├── store/             # 状态管理
│   │   └── appStore.ts    # 全局状态
│   ├── types/             # TypeScript 类型
│   │   └── index.ts
│   ├── utils/             # 工具函数
│   │   ├── api.ts         # API 客户端
│   │   └── feishu.ts      # 飞书 SDK
│   ├── App.tsx            # 根组件
│   ├── main.tsx           # 入口文件
│   └── index.css          # 全局样式
├── package.json
├── tsconfig.json
├── vite.config.ts
└── .env.example
```

---

## 环境变量

复制 `.env.example` 为 `.env.local`：

```bash
cp .env.example .env.local
```

配置环境变量：

```bash
# 飞书应用配置
VITE_FEISHU_APP_ID=cli_xxxxxxxxxxxxx

# API 地址（开发环境）
VITE_API_BASE_URL=http://localhost:3001/api

# 部署环境
VITE_ENV=development
```

---

## 开发规范

### 组件命名
- 页面组件：`PascalCase` + `Page` 后缀（如 `HomePage.tsx`）
- 普通组件：`PascalCase`（如 `ClientCard.tsx`）

### 目录约定
- `pages/` - 路由页面
- `components/` - 可复用组件
- `services/` - API 调用
- `store/` - 状态管理
- `utils/` - 工具函数

### 状态管理
- 全局状态：Zustand（`store/appStore.ts`）
- 局部状态：React `useState` / `useReducer`

### API 调用
- 统一在 `services/` 目录下
- 使用 `utils/api.ts` 的 Axios 实例
- 统一错误处理

---

## 飞书集成

### 本地开发
在浏览器中开发，飞书 SDK 会返回模拟数据。

### 飞书环境
在飞书客户端中运行时，会自动加载飞书 JS SDK。

---

## 下一步开发

### Week 1 已完成
- ✅ 基础框架搭建
- ✅ Arco Design 集成
- ✅ 路由配置
- ✅ 首页（F001）
- ✅ 客户列表（F002）
- ✅ 客户详情（F004）

### Week 2 待开发
- [ ] 持仓诊断页面（F005）
- [ ] Excel 导入导出功能
- [ ] 图表集成（ECharts）
- [ ] 报告生成页面

---

## 常见问题

### Q: 如何在飞书外测试？
A: 直接访问 `http://localhost:3000`，飞书 SDK 会返回模拟数据。

### Q: API 请求失败？
A: 检查 `.env.local` 中的 `VITE_API_BASE_URL` 配置。

### Q: 飞书 SDK 加载失败？
A: 检查网络连接，或确认飞书 SDK URL 是否正确。

---

## 参考文档

- [React 官方文档](https://react.dev)
- [Vite 官方文档](https://vitejs.dev)
- [Arco Design](https://arco.design)
- [Zustand](https://github.com/pmndrs/zustand)
- [飞书开放平台](https://open.feishu.cn)
