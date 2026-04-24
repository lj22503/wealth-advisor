/**
 * 客户类型定义
 */
export interface Client {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  riskLevel: RiskLevel;
  totalAssets: number;
  createdAt: Date;
  updatedAt: Date;
}

// 风险等级类型 - C1-C5 量表
export type RiskLevel = 'C1' | 'C2' | 'C3' | 'C4' | 'C5';

// 兼容旧数据的风险等级映射
export const LEGACY_RISK_LEVEL_MAP: Record<string, RiskLevel> = {
  'CONSERVATIVE': 'C1',
  'MODERATE': 'C3',
  'AGGRESSIVE': 'C5',
};

// 风险等级中文标签
export const RISK_LEVEL_LABELS: Record<RiskLevel, string> = {
  'C1': '保守型',
  'C2': '稳健型',
  'C3': '平衡型',
  'C4': '进取型',
  'C5': '激进型',
};

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
}

/**
 * 持仓类型定义
 */
export interface Holding {
  id: string;
  clientId: string;
  fundCode: string;
  fundName: string;
  amount: number; // 份额
  purchasePrice: number; // 买入价格
  currentPrice: number; // 当前价格
  purchaseDate: Date;
}

export interface HoldingInput {
  clientId: string;
  fundCode: string;
  fundName: string;
  amount: number;
  purchasePrice: number;
  purchaseDate: Date;
}

/**
 * 基金类型定义
 */
export interface Fund {
  code: string;
  name: string;
  category: FundCategory;
  riskLevel: RiskLevel;
  nav: number; // 单位净值
  navDate: Date;
  manager: string;
  establishedDate: Date;
}

export type FundCategory = '股票型' | '债券型' | '混合型' | '货币型' | 'QDII' | '另类投资' | '其他';

export interface FundFilter {
  category?: FundCategory;
  riskLevel?: RiskLevel;
  keyword?: string;
}

/**
 * 诊断结果类型
 */
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

/**
 * 报告类型定义
 */
export interface Report {
  id: string;
  clientId: string;
  type: ReportType;
  title: string;
  content: ReportContent;
  generatedAt: Date;
  status: ReportStatus;
}

export type ReportType = '季度报告' | '年度报告' | '持仓诊断' | '调仓建议';
export type ReportStatus = 'draft' | 'generated' | 'sent' | 'archived';

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

/**
 * 工具类型
 */
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  total?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: PaginationParams;
}

export interface ImportResult {
  success: number;
  failed: number;
  errors: Array<{
    index: number;
    data: any;
    error: string;
  }>;
}