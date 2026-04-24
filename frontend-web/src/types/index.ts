/**
 * 全局类型定义
 */

// 后端 API 响应结构
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: PaginationParams;
}

// 分页参数
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  total?: number;
}

// 客户类型
export type RiskLevel = 'C1' | 'C2' | 'C3' | 'C4' | 'C5';

// 风险等级中文标签
export const RISK_LEVEL_LABELS: Record<RiskLevel, string> = {
  'C1': '保守型',
  'C2': '稳健型',
  'C3': '平衡型',
  'C4': '进取型',
  'C5': '激进型',
};

export interface Client {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  riskLevel: RiskLevel;
  totalAssets: number;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface ClientInput {
  name: string;
  phone?: string;
  email?: string;
  riskLevel?: RiskLevel;
  totalAssets?: number;
}

export interface ClientFilter {
  name?: string;
  riskLevel?: RiskLevel;
  sortBy?: keyof Client;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

// 持仓类型
export interface Holding {
  id: string;
  clientId: string;
  fundCode: string;
  fundName: string;
  amount: number;
  purchasePrice: number;
  currentPrice: number;
  purchaseDate: string | Date;
}

export interface HoldingInput {
  clientId: string;
  fundCode: string;
  fundName: string;
  amount: number;
  purchasePrice: number;
  purchaseDate?: string | Date;
}

// 基金类型
export type FundCategory = '股票型' | '债券型' | '混合型' | '货币型' | 'QDII' | '另类投资' | '其他';

export interface Fund {
  code: string;
  name: string;
  category: FundCategory;
  riskLevel: RiskLevel;
  nav: number;
  navDate: string | Date;
  manager?: string;
  establishedDate?: string | Date;
}

// 诊断结果
export interface Diagnosis {
  clientId: string;
  overallRisk: string;
  diversificationScore: number;
  concentrationRisk: boolean;
  assetAllocation: AssetAllocation[];
  suggestions: string[];
}

export interface AssetAllocation {
  category: FundCategory;
  percentage: number;
  currentValue: number;
}

// 持仓统计
export interface HoldingStats {
  totalHoldings: number;
  totalValue: number;
  totalProfitLoss: number;
  totalProfitLossRate: number;
  fundDistribution: Record<string, FundDistribution>;
}

export interface FundDistribution {
  fundCode: string;
  fundName: string;
  totalValue: number;
  percentage: number;
  holdings: Holding[];
}

// 报告类型
export type ReportType = '季度报告' | '年度报告' | '持仓诊断' | '调仓建议';
export type ReportStatus = 'draft' | 'generated' | 'sent' | 'archived';

export interface Report {
  id: string;
  clientId: string;
  type: ReportType;
  title: string;
  content: ReportContent;
  generatedAt: string | Date;
  status: ReportStatus;
}

export interface ReportContent {
  summary: string;
  performance: PerformanceMetrics;
  diagnosis: Diagnosis;
  recommendations: Recommendation[];
  charts: ChartData[];
}

export interface PerformanceMetrics {
  totalReturn: number;
  annualizedReturn: number;
  sharpeRatio?: number;
  maxDrawdown?: number;
  benchmarkComparison: BenchmarkComparison;
}

export interface BenchmarkComparison {
  benchmark: string;
  excessReturn: number;
  trackingError?: number;
  informationRatio?: number;
}

export interface Recommendation {
  type: 'buy' | 'sell' | 'hold' | 'adjust';
  fundCode: string;
  fundName: string;
  reason: string;
  targetAmount?: number;
  targetPercentage?: number;
}

export interface ChartData {
  type: 'pie' | 'bar' | 'line' | 'radar';
  title: string;
  data: any;
  options?: any;
}

// 导入结果
export interface ImportResult {
  success: number;
  failed: number;
  errors: Array<{
    index: number;
    data: any;
    error: string;
  }>;
}
