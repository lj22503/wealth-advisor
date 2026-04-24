# 技术方案文档

## 1. 技术选型

### 1.1 前端技术栈
- **框架**: 飞书小程序
- **语言**: JavaScript/TypeScript
- **UI库**: 飞书原生组件
- **图表库**: ECharts for Mini Program
- **状态管理**: 小程序原生状态管理

### 1.2 后端技术栈
- **运行时**: Node.js 18+
- **语言**: TypeScript
- **数据库**: IndexedDB（客户端存储）
- **构建工具**: Vite/Rollup
- **代码规范**: ESLint + Prettier

## 2. 架构设计

### 2.1 整体架构
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   飞书小程序    │───▶│   业务逻辑层    │───▶│   数据服务层    │
│   (前端)        │    │   (Service)     │    │   (DB/API)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   用户界面      │    │   领域模型      │    │   数据存储      │
│   (Pages)       │    │   (Models)      │    │   (IndexedDB)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 2.2 模块划分
1. **客户端模块**：页面展示、用户交互
2. **服务模块**：业务逻辑处理
3. **数据模块**：数据存储、缓存管理
4. **工具模块**：通用工具函数

## 3. 数据模型设计

### 3.1 核心实体
```typescript
// 客户实体
interface Client {
  id: string;           // 客户ID
  name: string;         // 客户姓名
  phone?: string;       // 联系电话
  email?: string;       // 邮箱
  riskLevel: RiskLevel; // 风险等级
  totalAssets: number;  // 总资产
  createdAt: Date;      // 创建时间
  updatedAt: Date;      // 更新时间
}

// 持仓实体
interface Holding {
  id: string;           // 持仓ID
  clientId: string;     // 客户ID
  fundCode: string;     // 基金代码
  fundName: string;     // 基金名称
  amount: number;       // 持有份额
  purchasePrice: number;// 买入价格
  currentPrice: number; // 当前价格
  purchaseDate: Date;   // 买入日期
}

// 基金数据实体
interface FundData {
  code: string;         // 基金代码
  name: string;         // 基金名称
  type: FundType;       // 基金类型
  netValue: number;     // 单位净值
  accumulatedValue: number; // 累计净值
  date: Date;           // 净值日期
}
```

### 3.2 数据库设计
```typescript
// IndexedDB 表结构
const DB_SCHEMA = {
  name: 'WealthAdvisorDB',
  version: 1,
  stores: {
    clients: {
      keyPath: 'id',
      indexes: [
        { name: 'name', keyPath: 'name' },
        { name: 'createdAt', keyPath: 'createdAt' }
      ]
    },
    holdings: {
      keyPath: 'id',
      indexes: [
        { name: 'clientId', keyPath: 'clientId' },
        { name: 'fundCode', keyPath: 'fundCode' }
      ]
    },
    fundData: {
      keyPath: 'code',
      indexes: [
        { name: 'date', keyPath: 'date' }
      ]
    }
  }
};
```

## 4. 服务层设计

### 4.1 客户服务 (ClientService)
```typescript
class ClientService {
  // 获取客户列表
  async getClients(filter?: ClientFilter): Promise<Client[]>
  
  // 获取单个客户
  async getClient(id: string): Promise<Client | null>
  
  // 创建客户
  async createClient(client: ClientInput): Promise<Client>
  
  // 更新客户
  async updateClient(id: string, updates: Partial<Client>): Promise<Client>
  
  // 删除客户
  async deleteClient(id: string): Promise<boolean>
  
  // 导入客户数据
  async importClientsFromExcel(file: File): Promise<ImportResult>
}
```

### 4.2 持仓服务 (HoldingService)
```typescript
class HoldingService {
  // 获取客户持仓
  async getClientHoldings(clientId: string): Promise<Holding[]>
  
  // 分析持仓结构
  async analyzeHoldings(holdings: Holding[]): Promise<HoldingAnalysis>
  
  // 计算持仓收益
  async calculateReturns(holdings: Holding[]): Promise<ReturnAnalysis>
  
  // 生成调仓建议
  async generateRebalanceSuggestions(
    holdings: Holding[],
    targetAllocation: AllocationTarget
  ): Promise<RebalanceSuggestion[]>
}
```

### 4.3 诊断服务 (DiagnosisService)
```typescript
class DiagnosisService {
  // 持仓诊断
  async diagnoseHoldings(holdings: Holding[]): Promise<DiagnosisResult>
  
  // 风险评估
  async assessRisk(holdings: Holding[], clientRiskLevel: RiskLevel): Promise<RiskAssessment>
  
  // 业绩归因
  async attributePerformance(holdings: Holding[], period: DateRange): Promise<PerformanceAttribution>
  
  // 生成报告
  async generateReport(clientId: string, reportType: ReportType): Promise<Report>
}
```

## 5. 异常处理设计

### 5.1 错误类型定义
```typescript
enum ErrorCode {
  // 客户端错误
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  
  // 服务端错误
  DATABASE_ERROR = 'DATABASE_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  
  // 业务错误
  INSUFFICIENT_DATA = 'INSUFFICIENT_DATA',
  CALCULATION_ERROR = 'CALCULATION_ERROR'
}

class AppError extends Error {
  constructor(
    public code: ErrorCode,
    public message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}
```

### 5.2 错误处理策略
1. **客户端错误**：用户输入验证失败，提示用户修正
2. **网络错误**：自动重试机制，离线模式支持
3. **数据错误**：数据校验，回滚操作
4. **系统错误**：日志记录，优雅降级

### 5.3 重试机制
```typescript
async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      // 如果是网络错误，等待后重试
      if (isNetworkError(error) && i < maxRetries - 1) {
        await sleep(delay * Math.pow(2, i)); // 指数退避
        continue;
      }
      
      throw error;
    }
  }
  
  throw lastError!;
}
```

## 6. 性能优化

### 6.1 数据缓存
- 客户端数据缓存（IndexedDB）
- 内存缓存（高频访问数据）
- 缓存失效策略（TTL + LRU）

### 6.2 懒加载
- 图片懒加载
- 组件懒加载
- 数据分页加载

### 6.3 代码优化
- Tree Shaking
- 代码分割
- 资源压缩

## 7. 安全考虑

### 7.1 数据安全
- 客户端数据加密存储
- 敏感信息脱敏
- 数据备份机制

### 7.2 访问控制
- 飞书登录验证
- 权限分级管理
- 操作日志记录

## 8. 部署与监控

### 8.1 部署流程
1. 代码构建
2. 飞书小程序上传
3. 版本发布
4. 灰度测试

### 8.2 监控指标
- 页面加载时间
- API响应时间
- 错误率统计
- 用户行为分析

---

**附录**
- [飞书小程序开发文档](https://open.feishu.cn/document/uYjL24iN/ukTMukTMukTM)
- [IndexedDB API文档](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [TypeScript文档](https://www.typescriptlang.org/docs/)