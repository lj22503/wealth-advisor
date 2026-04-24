import { Client, Holding } from '../types';
import { db } from '../db';
import { AppError, ErrorCode } from '../utils/errors';

// 类型定义（前置声明）
interface AssetCategory {
  name: string;
  totalValue: number;
  holdings: Holding[];
  percentage: number;
}

/**
 * 持仓诊断服务
 */
export class DiagnosisService {
  /**
   * 为客户进行持仓诊断
   */
  async diagnoseClient(clientId: string): Promise<DiagnosisResult> {
    try {
      // 获取客户信息
      const client = await db.clients.get(clientId);
      if (!client) {
        throw new AppError(
          ErrorCode.NOT_FOUND,
          `客户 ${clientId} 不存在`
        );
      }

      // 获取客户持仓
      const holdings = await db.holdings
        .where('clientId')
        .equals(clientId)
        .toArray();

      if (holdings.length === 0) {
        return {
          clientId,
          clientName: client.name,
          riskLevel: client.riskLevel,
          totalAssets: client.totalAssets,
          holdings: [],
          diagnosis: {
            overallRisk: 'LOW',
            diversificationScore: 0,
            concentrationRisk: false,
            suggestions: ['暂无持仓数据，请先导入持仓信息']
          }
        };
      }

      // 计算诊断指标
      const totalValue = holdings.reduce((sum, h) => sum + (h.currentPrice * h.amount), 0);
      const categories = this.categorizeHoldings(holdings);
      const riskScore = this.calculateRiskScore(holdings, client.riskLevel);
      const diversificationScore = this.calculateDiversificationScore(categories);

      // 生成诊断结果
      const diagnosis: DiagnosisResult = {
        clientId,
        clientName: client.name,
        riskLevel: client.riskLevel,
        totalAssets: client.totalAssets,
        holdings: holdings.map(h => ({
          ...h,
          currentValue: h.currentPrice * h.amount,
          profitLoss: (h.currentPrice - h.purchasePrice) * h.amount,
          profitLossRate: ((h.currentPrice - h.purchasePrice) / h.purchasePrice) * 100
        })),
        diagnosis: {
          overallRisk: this.getRiskLevel(riskScore),
          diversificationScore,
          concentrationRisk: this.checkConcentrationRisk(holdings),
          assetAllocation: categories,
          suggestions: this.generateSuggestions(holdings, client.riskLevel, categories)
        }
      };

      return diagnosis;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      
      throw new AppError(
        ErrorCode.DATABASE_ERROR,
        `持仓诊断失败: ${error instanceof Error ? error.message : '未知错误'}`,
        { originalError: error }
      );
    }
  }

  /**
   * 持仓分类
   */
  private categorizeHoldings(holdings: Holding[]): AssetCategory[] {
    const categories: Record<string, AssetCategory> = {};

    holdings.forEach(holding => {
      const category = this.getFundCategory(holding.fundCode);
      if (!categories[category]) {
        categories[category] = {
          name: category,
          totalValue: 0,
          holdings: [],
          percentage: 0
        };
      }
      categories[category].totalValue += holding.currentPrice * holding.amount;
      categories[category].holdings.push(holding);
    });

    const totalValue = Object.values(categories).reduce((sum, cat) => sum + cat.totalValue, 0);
    
    return Object.values(categories).map(cat => ({
      ...cat,
      percentage: totalValue > 0 ? (cat.totalValue / totalValue) * 100 : 0
    }));
  }

  /**
   * 根据基金代码判断类别（简化版）
   */
  private getFundCategory(fundCode: string): string {
    // 实际应用中应该对接基金数据API
    const codePrefix = fundCode.substring(0, 2);
    
    switch(codePrefix) {
      case '00': return '股票型';
      case '01': return '债券型';
      case '02': return '混合型';
      case '03': return '货币型';
      case '04': return 'QDII';
      case '05': return '另类投资';
      default: return '其他';
    }
  }

  /**
   * 计算风险评分
   */
  private calculateRiskScore(holdings: Holding[], clientRiskLevel: string): number {
    // 简化版风险评分算法
    let score = 0;
    
    holdings.forEach(holding => {
      const category = this.getFundCategory(holding.fundCode);
      const weight = this.getCategoryRiskWeight(category);
      const holdingValue = holding.currentPrice * holding.amount;
      const totalValue = holdings.reduce((sum, h) => sum + (h.currentPrice * h.amount), 0);
      
      score += weight * (holdingValue / totalValue);
    });

    // 根据客户风险偏好调整
    const riskAdjustment = this.getRiskAdjustment(clientRiskLevel);
    return score * riskAdjustment;
  }

  private getCategoryRiskWeight(category: string): number {
    const weights: Record<string, number> = {
      '股票型': 0.8,
      '混合型': 0.6,
      '债券型': 0.3,
      '货币型': 0.1,
      'QDII': 0.7,
      '另类投资': 0.9,
      '其他': 0.5
    };
    return weights[category] || 0.5;
  }

  private getRiskAdjustment(riskLevel: string): number {
    const adjustments: Record<string, number> = {
      'CONSERVATIVE': 0.7,
      'MODERATE': 1.0,
      'AGGRESSIVE': 1.3
    };
    return adjustments[riskLevel] || 1.0;
  }

  /**
   * 计算分散度评分
   */
  private calculateDiversificationScore(categories: AssetCategory[]): number {
    if (categories.length <= 1) return 0;
    
    const maxPercentage = Math.max(...categories.map(c => c.percentage));
    const minPercentage = Math.min(...categories.map(c => c.percentage));
    
    // 分散度评分：1 - (最大占比 - 最小占比) / 100
    return Math.max(0, 1 - (maxPercentage - minPercentage) / 100);
  }

  /**
   * 检查集中度风险
   */
  private checkConcentrationRisk(holdings: Holding[]): boolean {
    const totalValue = holdings.reduce((sum, h) => sum + (h.currentPrice * h.amount), 0);
    
    // 检查是否有单一持仓占比超过30%
    for (const holding of holdings) {
      const holdingValue = holding.currentPrice * holding.amount;
      if (holdingValue / totalValue > 0.3) {
        return true;
      }
    }
    
    return false;
  }

  /**
   * 获取风险等级
   */
  private getRiskLevel(score: number): string {
    if (score < 0.3) return 'LOW';
    if (score < 0.6) return 'MODERATE';
    return 'HIGH';
  }

  /**
   * 生成投资建议
   */
  private generateSuggestions(
    holdings: Holding[], 
    clientRiskLevel: string, 
    categories: AssetCategory[]
  ): string[] {
    const suggestions: string[] = [];
    const totalValue = holdings.reduce((sum, h) => sum + (h.currentPrice * h.amount), 0);

    // 检查资产配置
    const stockPercentage = categories.find(c => c.name === '股票型')?.percentage || 0;
    const bondPercentage = categories.find(c => c.name === '债券型')?.percentage || 0;

    // 根据风险偏好给出配置建议
    if (clientRiskLevel === 'CONSERVATIVE' && stockPercentage > 30) {
      suggestions.push('股票型基金占比偏高，建议适当降低至30%以内');
    } else if (clientRiskLevel === 'AGGRESSIVE' && stockPercentage < 50) {
      suggestions.push('股票型基金占比偏低，建议适当增加至50%以上');
    }

    // 检查分散度
    if (categories.length < 3) {
      suggestions.push('资产类别较少，建议增加2-3个不同类别的基金');
    }

    // 检查集中度
    if (this.checkConcentrationRisk(holdings)) {
      suggestions.push('存在单一持仓集中风险，建议分散投资');
    }

    // 检查债券配置
    if (bondPercentage < 20 && clientRiskLevel !== 'AGGRESSIVE') {
      suggestions.push('债券型基金配置不足，建议增加至20%以上以降低风险');
    }

    if (suggestions.length === 0) {
      suggestions.push('当前持仓配置较为合理，建议定期关注市场变化');
    }

    return suggestions;
  }
}

// 类型定义
interface DiagnosisResult {
  clientId: string;
  clientName: string;
  riskLevel: string;
  totalAssets: number;
  holdings: (Holding & {
    currentValue: number;
    profitLoss: number;
    profitLossRate: number;
  })[];
  diagnosis: {
    overallRisk: string;
    diversificationScore: number;
    concentrationRisk: boolean;
    assetAllocation?: AssetCategory[];
    suggestions: string[];
  };
}