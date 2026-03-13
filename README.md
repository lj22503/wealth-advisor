# Wealth Advisor - 理财经理投顾系统

## 项目概述

理财经理投顾系统（FA-Assistant）是一个飞书小程序，旨在为银行、券商、独立财富机构的理财经理/投资顾问提供专业的投顾工具。

## 核心功能

- **资产配置**：智能资产配置建议
- **持仓穿透**：深度分析客户持仓
- **业绩归因**：业绩来源分析
- **策略解释**：投资策略可视化解释
- **客户陪伴**：客户关系管理
- **模拟调仓推演**：调仓方案模拟

## 技术栈

### 前端
- 飞书小程序
- JavaScript/TypeScript
- 图表库：ECharts/F2

### 后端
- Node.js/TypeScript
- IndexedDB（本地存储）
- RESTful API

## 项目结构

```
wealth-advisor/
├── docs/                    # 文档
│   ├── PRD-v1.0.md         # 产品需求文档
│   └── PROJECT-KICKOFF.md  # 项目启动文档
├── design/                 # 设计规范
│   ├── DESIGN-SPEC.md      # 设计规范
│   └── INTERACTION-SPEC.md # 交互规范
├── prototype/              # HTML原型
│   ├── F001-home.html      # 首页
│   ├── F002-client-list.html # 客户列表
│   └── ...                 # 其他页面
├── backend/                # 后端代码
│   ├── src/
│   │   ├── services/       # 服务层
│   │   ├── db/            # 数据库层
│   │   └── utils/         # 工具函数
│   └── TECH-SPEC.md       # 技术方案
└── frontend/              # 前端代码
    ├── pages/             # 页面组件
    └── services/          # 前端服务
```

## 快速开始

### 环境要求
- Node.js >= 16
- 飞书开发者账号

### 安装依赖
```bash
cd backend
npm install

cd ../frontend
# 飞书小程序开发工具
```

### 开发运行
```bash
# 后端开发
cd backend
npm run dev

# 前端开发
# 使用飞书小程序IDE打开frontend目录
```

## 项目状态

**完成度**: 98%

### 各模块完成情况
- ✅ **产品文档**：100%
- ✅ **设计规范**：100%
- ✅ **HTML原型**：100%
- ✅ **后端核心服务**：95%
- ✅ **前端页面**：95%
- ✅ **测试用例**：100%

## 许可证

MIT License