# Wealth Advisor - 理财经理投顾系统

**版本**: v2.0  
**状态**: ✅ 小程序版完成 | 🔄 网页应用迁移中  
**最后更新**: 2026-03-17

---

## 项目概述

理财经理投顾系统（FA-Assistant）是一个飞书应用，旨在为银行、券商、独立财富机构的理财经理/投资顾问提供专业的投顾工具。

**🎉 新增功能**:
- ✅ **Excel 导入导出** - 支持批量导入客户/持仓数据
- 🔄 **网页应用版** - 从飞书小程序迁移至网页应用（开发中）

---

## 核心功能

- **资产配置**：智能资产配置建议
- **持仓穿透**：深度分析客户持仓
- **业绩归因**：业绩来源分析
- **策略解释**：投资策略可视化解释
- **客户陪伴**：客户关系管理
- **模拟调仓推演**：调仓方案模拟

---

## 技术栈

### 小程序版（当前）
- **前端**: 飞书小程序 + JavaScript/TypeScript + ECharts
- **后端**: Node.js/TypeScript + IndexedDB

### 网页应用版（开发中）
- **前端**: React 18 + Vite 5 + Arco Design + ECharts
- **后端**: Node.js/TypeScript + IndexedDB/云数据库
- **集成**: 飞书 JS SDK

---

## 项目结构

```
wealth-advisor/
├── docs/                    # 文档
│   ├── PRD-v1.0.md         # 产品需求文档
│   ├── TECH-SPEC.md        # 技术方案
│   └── MIGRATION-WEB-APP.md # 网页应用迁移方案 ⭐
├── excel-templates/         # Excel 模板 ⭐ 新增
│   ├── README.md           # 使用指南
│   ├── 客户数据模板.xlsx
│   ├── 持仓数据模板.xlsx
│   └── 基金数据模板.xlsx
├── design/                  # 设计规范
│   ├── DESIGN-SPEC.md
│   └── INTERACTION-SPEC.md
├── prototype/               # HTML 原型
│   ├── F001-home.html
│   └── ...
├── backend/                 # 后端代码
│   ├── src/services/       # 服务层
│   ├── src/db/             # 数据库层
│   └── src/types/          # 类型定义
└── frontend-web/            # 网页应用前端 ⭐（开发中）
    ├── src/pages/
    └── src/components/
```

---

## 快速开始

### 方式 1：使用 Excel 模板（推荐 ⭐）

适合非技术用户，无需编程基础：

1. **下载模板**
   ```bash
   # 从 excel-templates 目录下载
   - 客户数据模板.xlsx
   - 持仓数据模板.xlsx
   - 基金数据模板.xlsx
   ```

2. **填写数据**
   - 按照示例填写客户/持仓信息
   - 红色字体为必填项

3. **导入系统**
   - 打开飞书应用 → 点击对应模块 → 导入 Excel

📖 **详细指南**: [excel-templates/README.md](excel-templates/README.md)

### 方式 2：开发运行

#### 环境要求
- Node.js >= 18
- 飞书开发者账号

#### 安装依赖
```bash
# 后端
cd backend
npm install

# 前端（网页应用版）
cd frontend-web
npm install
```

#### 开发运行
```bash
# 后端开发
cd backend
npm run dev

# 前端开发
cd frontend-web
npm run dev
```

---

## 项目状态

### 小程序版
**完成度**: 98%

| 模块 | 完成度 | 状态 |
|------|--------|------|
| 产品文档 | 100% | ✅ |
| 设计规范 | 100% | ✅ |
| HTML 原型 | 100% | ✅ |
| 后端核心服务 | 95% | ✅ |
| 前端页面 | 95% | ✅ |
| 测试用例 | 100% | ✅ |
| Excel 模板 | 100% | ✅ 新增 |

### 网页应用版
**完成度**: 10%

| 模块 | 完成度 | 状态 |
|------|--------|------|
| 迁移方案 | 100% | ✅ |
| 基础框架 | 0% | 🔄 待开发 |
| 核心页面 | 0% | 🔄 待开发 |
| 飞书集成 | 0% | 🔄 待开发 |

📖 **迁移计划**: [docs/MIGRATION-WEB-APP.md](docs/MIGRATION-WEB-APP.md)

---

## 核心服务层

后端提供以下核心服务：

| 服务 | 功能 | 状态 |
|------|------|------|
| `ClientService` | 客户管理（CRUD + 导入导出） | ✅ |
| `HoldingService` | 持仓管理（CRUD + 分析） | ✅ |
| `DiagnosisService` | 持仓诊断 + 风险评估 | ✅ |
| `FundService` | 基金数据管理 | ✅ |
| `ReportService` | 报告生成 + 导出 | ✅ |

---

## 数据模型

### 客户 (Client)
```typescript
interface Client {
  id: string;           // 客户 ID
  name: string;         // 客户姓名
  phone?: string;       // 联系电话
  email?: string;       // 邮箱
  riskLevel: RiskLevel; // 风险等级 (C1-C5)
  totalAssets: number;  // 总资产
  createdAt: Date;
  updatedAt: Date;
}
```

### 持仓 (Holding)
```typescript
interface Holding {
  id: string;           // 持仓 ID
  clientId: string;     // 客户 ID
  fundCode: string;     // 基金代码
  fundName: string;     // 基金名称
  amount: number;       // 持有份额
  purchasePrice: number;// 买入价格
  currentPrice: number; // 当前价格
  purchaseDate: Date;   // 买入日期
}
```

---

## 文档导航

| 文档 | 说明 |
|------|------|
| [GETTING-STARTED.md](GETTING-STARTED.md) | 快速入门指南 |
| [docs/PRD-v1.0.md](docs/PRD-v1.0.md) | 产品需求文档 |
| [backend/TECH-SPEC.md](backend/TECH-SPEC.md) | 技术方案 |
| [excel-templates/README.md](excel-templates/README.md) | Excel 模板使用指南 ⭐ |
| [docs/MIGRATION-WEB-APP.md](docs/MIGRATION-WEB-APP.md) | 网页应用迁移方案 ⭐ |

---

## 开发计划

### 2026-03-17 ~ 2026-04-21（网页应用迁移）

| 阶段 | 时间 | 目标 |
|------|------|------|
| 阶段 1 | 03-17 ~ 03-24 | 基础框架搭建 |
| 阶段 2 | 03-24 ~ 03-31 | 核心页面迁移 |
| 阶段 3 | 03-31 ~ 04-07 | 功能完善 |
| 阶段 4 | 04-07 ~ 04-14 | 测试优化 |
| 阶段 5 | 04-14 ~ 04-21 | 上线发布 |

---

## 许可证

MIT License

---

## 联系方式

- **GitHub**: https://github.com/lj22503/wealth-advisor
- **Issues**: https://github.com/lj22503/wealth-advisor/issues
