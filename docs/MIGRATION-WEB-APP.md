# 飞书小程序 → 网页应用迁移方案

**项目**: Wealth Advisor (理财经理投顾系统)  
**版本**: v2.0 (Web App)  
**创建时间**: 2026-03-17  
**状态**: 迁移规划中

---

## 📋 一、迁移背景

### 1.1 现状
- **当前形态**: 飞书小程序
- **问题**: 飞书小程序开发受限，功能扩展性差
- **飞书政策**: 飞书逐步转向网页应用模式

### 1.2 目标
- **新形态**: 飞书网页应用（Web App）
- **优势**: 
  - ✅ 完整 Web 技术栈（React/Vue + 任意 UI 库）
  - ✅ 更好的性能和用户体验
  - ✅ 更容易维护和扩展
  - ✅ 支持 PWA 离线能力

---

## 🏗️ 二、架构对比

### 2.1 小程序架构（当前）
```
┌─────────────────────────────────────┐
│         飞书小程序容器               │
├─────────────────────────────────────┤
│  Pages (小程序页面)                 │
│  ├── F001-home                      │
│  ├── F002-client-list               │
│  └── ...                            │
├─────────────────────────────────────┤
│  小程序 API (tt.* / fs.* )          │
├─────────────────────────────────────┤
│  后端服务 (Node.js + IndexedDB)     │
└─────────────────────────────────────┘
```

### 2.2 网页应用架构（目标）
```
┌─────────────────────────────────────┐
│         飞书网页应用容器             │
├─────────────────────────────────────┤
│  React/Vue SPA                      │
│  ├── Pages (路由页面)               │
│  ├── Components (可复用组件)        │
│  └── Services (API 调用)            │
├─────────────────────────────────────┤
│  飞书 JS SDK (fs.open.* )           │
├─────────────────────────────────────┤
│  后端服务 (Node.js + IndexedDB/云)   │
└─────────────────────────────────────┘
```

---

## 🔄 三、迁移策略

### 3.1 总体原则
- **后端复用**: 95% 后端代码可直接复用
- **前端重写**: 小程序页面 → Web 页面
- **数据兼容**: 保持数据模型不变
- **渐进式**: 分模块迁移，降低风险

### 3.2 迁移阶段

#### 阶段 1：基础框架搭建（1 周）
- [ ] 创建 Web 应用脚手架（推荐 Vite + React）
- [ ] 集成飞书 JS SDK
- [ ] 配置路由系统
- [ ] 搭建 UI 组件库（推荐 Ant Design / Arco Design）

#### 阶段 2：核心页面迁移（2 周）
- [ ] 首页（F001）
- [ ] 客户列表（F002）
- [ ] 客户详情（F004）
- [ ] 持仓诊断（F005）

#### 阶段 3：功能完善（1 周）
- [ ] Excel 导入导出
- [ ] 图表集成（ECharts）
- [ ] 报告生成
- [ ] 性能优化

#### 阶段 4：测试上线（1 周）
- [ ] 功能测试
- [ ] 兼容性测试
- [ ] 飞书审核
- [ ] 灰度发布

---

## 🛠️ 四、技术选型

### 4.1 前端技术栈
| 技术 | 选型 | 理由 |
|------|------|------|
| 框架 | React 18 | 生态成熟，组件丰富 |
| 构建工具 | Vite 5 | 快速开发，热更新 |
| UI 库 | Arco Design | 字节出品，与飞书风格一致 |
| 图表库 | ECharts 5 | 功能强大，文档完善 |
| 状态管理 | Zustand | 轻量，易用 |
| 路由 | React Router 6 | 标准方案 |
| HTTP 客户端 | Axios | 成熟稳定 |

### 4.2 后端技术栈（保持不变）
| 技术 | 选型 | 说明 |
|------|------|------|
| 运行时 | Node.js 18+ | 保持不变 |
| 语言 | TypeScript | 保持不变 |
| 数据库 | IndexedDB / 云数据库 | 可升级 |
| API | RESTful | 保持不变 |

---

## 📁 五、项目结构

### 5.1 新目录结构
```
wealth-advisor/
├── backend/                    # 后端（保持不变）
│   ├── src/
│   │   ├── services/
│   │   ├── db/
│   │   ├── types/
│   │   └── utils/
│   └── package.json
├── frontend-web/               # 新 Web 前端 ⭐
│   ├── src/
│   │   ├── pages/             # 页面组件
│   │   │   ├── Home.tsx
│   │   │   ├── ClientList.tsx
│   │   │   ├── ClientDetail.tsx
│   │   │   ├── HoldingDiagnosis.tsx
│   │   │   └── ...
│   │   ├── components/        # 可复用组件
│   │   │   ├── ClientCard.tsx
│   │   │   ├── HoldingTable.tsx
│   │   │   └── ...
│   │   ├── services/          # API 调用
│   │   │   ├── client.ts
│   │   │   ├── holding.ts
│   │   │   └── ...
│   │   ├── hooks/             # 自定义 Hooks
│   │   ├── store/             # 状态管理
│   │   ├── types/             # TypeScript 类型
│   │   ├── utils/             # 工具函数
│   │   └── App.tsx
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
├── excel-templates/            # Excel 模板 ⭐ 新增
│   ├── 客户数据模板.xlsx
│   ├── 持仓数据模板.xlsx
│   ├── 基金数据模板.xlsx
│   └── README.md
├── docs/
│   ├── PRD-v1.0.md
│   ├── TECH-SPEC-WEB.md       # 新技术方案 ⭐
│   └── MIGRATION-GUIDE.md     # 迁移指南 ⭐
└── README.md
```

---

## 🔌 六、飞书集成

### 6.1 飞书 JS SDK 集成

**安装**:
```bash
npm install @lark-base-open/js-sdk
```

**初始化**:
```typescript
// src/utils/feishu.ts
import { api, auth } from '@lark-base-open/js-sdk';

export async function initFeishuSDK() {
  // 获取用户信息
  const userInfo = await auth.getUserId();
  
  // 配置 API 请求
  api.config({
    timeout: 10000,
    onError: (error) => {
      console.error('Feishu API Error:', error);
    }
  });
  
  return userInfo;
}
```

### 6.2 身份认证

**小程序方式**（旧）:
```javascript
// 小程序自动获取用户身份
const userInfo = tt.getUserInfo();
```

**网页应用方式**（新）:
```typescript
// Web 需要显式调用 SDK
import { auth } from '@lark-base-open/js-sdk';

async function getUserInfo() {
  const userId = await auth.getUserId();
  const userInfo = await auth.getUserInfo();
  return userInfo;
}
```

### 6.3 应用配置

在飞书开放平台配置网页应用：

1. 进入「应用管理」→ 选择应用
2. 添加「网页应用」能力
3. 配置应用首页 URL：`https://your-domain.com`
4. 配置回调域名
5. 提交审核

---

## 📝 七、代码迁移示例

### 7.1 页面迁移

**小程序页面**（旧）:
```jsx
// pages/F002-client-list/index.jsx
Page({
  data: {
    clients: []
  },
  
  onLoad() {
    this.loadClients();
  },
  
  async loadClients() {
    const clients = await tt.request({
      url: '/api/clients'
    });
    this.setData({ clients });
  },
  
  onClientTap(e) {
    const clientId = e.currentTarget.dataset.id;
    tt.navigateTo({ url: `/pages/F004-client-detail/index?id=${clientId}` });
  }
});
```

**Web 页面**（新）:
```tsx
// src/pages/ClientList.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Card } from '@arco-design/web-react';
import { clientService } from '@/services/client';

export function ClientList() {
  const [clients, setClients] = useState([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    loadClients();
  }, []);
  
  async function loadClients() {
    const data = await clientService.getClients();
    setClients(data);
  }
  
  function onClientClick(clientId: string) {
    navigate(`/client/${clientId}`);
  }
  
  return (
    <Card>
      <Table
        data={clients}
        columns={[
          { title: '姓名', dataIndex: 'name' },
          { title: '风险等级', dataIndex: 'riskLevel' },
          { title: '总资产', dataIndex: 'totalAssets' }
        ]}
        onRow={(record) => ({
          onClick: () => onClientClick(record.id)
        })}
      />
    </Card>
  );
}
```

### 7.2 API 调用迁移

**小程序方式**（旧）:
```javascript
// 小程序原生 request
tt.request({
  url: 'https://api.example.com/clients',
  method: 'GET',
  success: (res) => {
    console.log(res.data);
  }
});
```

**Web 方式**（新）:
```typescript
// Axios
import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
  timeout: 10000
});

export const clientService = {
  async getClients() {
    const response = await apiClient.get('/clients');
    return response.data;
  }
};
```

---

## 🎨 八、UI/UX 优化

### 8.1 设计原则
- **保持一致性**: 保持原有小程序的交互逻辑
- **提升体验**: 利用 Web 优势优化加载速度
- **响应式**: 支持桌面端和移动端

### 8.2 关键优化点

| 页面 | 优化点 |
|------|--------|
| 首页 | 添加数据概览卡片，支持自定义布局 |
| 客户列表 | 支持高级筛选、批量操作、Excel 导出 |
| 客户详情 | 添加时间轴、交互图表 |
| 持仓诊断 | 交互式图表、一键生成报告 |

---

## 🚀 九、部署方案

### 9.1 部署流程

```bash
# 1. 构建
cd frontend-web
npm run build

# 2. 上传到服务器
# 方式 1: Vercel / Netlify（推荐）
vercel deploy --prod

# 方式 2: 自有服务器
scp -r dist/* user@server:/var/www/wealth-advisor

# 3. 配置飞书应用后台
# 更新应用首页 URL 为部署地址
```

### 9.2 环境配置

**.env.example**:
```bash
# API 地址
VITE_API_BASE_URL=https://api.your-domain.com

# 飞书应用配置
VITE_FEISHU_APP_ID=cli_xxxxxxxxxxxxx
VITE_FEISHU_APP_SECRET=xxxxxxxxxxxxx

# 部署环境
VITE_ENV=production
```

---

## ⚠️ 十、风险与应对

### 10.1 技术风险

| 风险 | 影响 | 应对措施 |
|------|------|----------|
| 飞书 SDK 兼容性 | 中 | 提前测试，准备降级方案 |
| 浏览器兼容性 | 低 | 使用 Babel 转译，polyfill |
| 性能问题 | 中 | 代码分割，懒加载，CDN |

### 10.2 业务风险

| 风险 | 影响 | 应对措施 |
|------|------|----------|
| 数据丢失 | 高 | 完整备份，灰度发布 |
| 用户不适应 | 中 | 提供使用指南，保留旧版入口 |
| 审核不通过 | 中 | 提前沟通，预留审核时间 |

---

## 📅 十一、时间计划

### 11.1 里程碑

| 日期 | 里程碑 | 交付物 |
|------|--------|--------|
| 2026-03-24 | 基础框架完成 | Web 应用脚手架 |
| 2026-03-31 | 核心页面完成 | 4 个核心页面 |
| 2026-04-07 | 功能完善 | 全部功能可用 |
| 2026-04-14 | 测试完成 | 测试报告 |
| 2026-04-21 | 上线发布 | 正式版 v2.0 |

### 11.2 每周任务

**Week 1 (03-17 ~ 03-24)**:
- [ ] 搭建 Vite + React 项目
- [ ] 集成 Arco Design
- [ ] 配置路由
- [ ] 集成飞书 SDK
- [ ] 完成首页

**Week 2 (03-24 ~ 03-31)**:
- [ ] 客户列表页
- [ ] 客户详情页
- [ ] 持仓诊断页
- [ ] API 对接

**Week 3 (03-31 ~ 04-07)**:
- [ ] Excel 导入导出
- [ ] 图表集成
- [ ] 报告生成
- [ ] 性能优化

**Week 4 (04-07 ~ 04-14)**:
- [ ] 功能测试
- [ ] 兼容性测试
- [ ] Bug 修复
- [ ] 文档完善

**Week 5 (04-14 ~ 04-21)**:
- [ ] 飞书审核
- [ ] 灰度发布
- [ ] 用户反馈收集
- [ ] 正式上线

---

## 📚 十二、参考文档

- [飞书网页应用开发指南](https://open.feishu.cn/document/uAjLw4CM/uMzNwEjLzcDMx4yM3ATM/embed-web-app-into-feishu-workbench/introduction)
- [飞书 JS SDK](https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/js-sdk)
- [React 官方文档](https://react.dev)
- [Vite 官方文档](https://vitejs.dev)
- [Arco Design](https://arco.design)

---

**维护者**: Wealth Advisor Team  
**最后更新**: 2026-03-17
