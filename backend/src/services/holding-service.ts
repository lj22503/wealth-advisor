import { Holding, HoldingInput } from '../types';
import { db } from '../db';
import { generateId } from '../utils/id-generator';
import { AppError, ErrorCode } from '../utils/errors';

/**
 * 持仓管理服务
 */
export class HoldingService {
  /**
   * 获取客户持仓列表
   */
  async getClientHoldings(clientId: string): Promise<Holding[]> {
    try {
      // 检查客户是否存在
      const client = await db.clients.get(clientId);
      if (!client) {
        throw new AppError(
          ErrorCode.NOT_FOUND,
          `客户 ${clientId} 不存在`
        );
      }

      const holdings = await db.holdings
        .where('clientId')
        .equals(clientId)
        .toArray();

      return holdings;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      
      throw new AppError(
        ErrorCode.DATABASE_ERROR,
        `获取客户持仓失败: ${error instanceof Error ? error.message : '未知错误'}`,
        { originalError: error }
      );
    }
  }

  /**
   * 获取单个持仓
   */
  async getHolding(id: string): Promise<Holding | null> {
    try {
      const holding = await db.holdings.get(id);
      return holding || null;
    } catch (error) {
      throw new AppError(
        ErrorCode.DATABASE_ERROR,
        `获取持仓 ${id} 失败`,
        { originalError: error }
      );
    }
  }

  /**
   * 添加持仓
   */
  async addHolding(input: HoldingInput): Promise<Holding> {
    // 数据验证
    if (!input.clientId) {
      throw new AppError(
        ErrorCode.VALIDATION_ERROR,
        '客户ID不能为空'
      );
    }

    if (!input.fundCode || input.fundCode.trim().length === 0) {
      throw new AppError(
        ErrorCode.VALIDATION_ERROR,
        '基金代码不能为空'
      );
    }

    if (input.amount <= 0) {
      throw new AppError(
        ErrorCode.VALIDATION_ERROR,
        '持仓份额必须大于0'
      );
    }

    if (input.purchasePrice <= 0) {
      throw new AppError(
        ErrorCode.VALIDATION_ERROR,
        '买入价格必须大于0'
      );
    }

    // 检查客户是否存在
    const client = await db.clients.get(input.clientId);
    if (!client) {
      throw new AppError(
        ErrorCode.NOT_FOUND,
        `客户 ${input.clientId} 不存在`
      );
    }

    // 检查基金是否存在（如果基金库中有数据）
    const fund = await db.funds.get(input.fundCode);
    const holding: Holding = {
      id: generateId('holding'),
      clientId: input.clientId,
      fundCode: input.fundCode,
      fundName: input.fundName || fund?.name || '未知基金',
      amount: input.amount,
      purchasePrice: input.purchasePrice,
      currentPrice: fund?.nav || input.purchasePrice, // 使用基金净值或买入价
      purchaseDate: input.purchaseDate || new Date()
    };

    try {
      await db.holdings.add(holding);
      
      // 更新客户总资产
      const clientHoldings = await this.getClientHoldings(input.clientId);
      const totalHoldingsValue = clientHoldings.reduce(
        (sum, h) => sum + (h.currentPrice * h.amount), 
        0
      );
      
      // 更新客户总资产（仅更新持仓部分，其他资产不变）
      await db.clients.update(input.clientId, {
        totalAssets: totalHoldingsValue,
        updatedAt: new Date()
      });

      return holding;
    } catch (error) {
      throw new AppError(
        ErrorCode.DATABASE_ERROR,
        '添加持仓失败',
        { originalError: error }
      );
    }
  }

  /**
   * 更新持仓
   */
  async updateHolding(id: string, updates: Partial<Holding>): Promise<Holding> {
    try {
      const existingHolding = await db.holdings.get(id);
      if (!existingHolding) {
        throw new AppError(
          ErrorCode.NOT_FOUND,
          `持仓 ${id} 不存在`
        );
      }

      // 验证更新数据
      if (updates.amount !== undefined && updates.amount <= 0) {
        throw new AppError(
          ErrorCode.VALIDATION_ERROR,
          '持仓份额必须大于0'
        );
      }

      if (updates.purchasePrice !== undefined && updates.purchasePrice <= 0) {
        throw new AppError(
          ErrorCode.VALIDATION_ERROR,
          '买入价格必须大于0'
        );
      }

      if (updates.currentPrice !== undefined && updates.currentPrice <= 0) {
        throw new AppError(
          ErrorCode.VALIDATION_ERROR,
          '当前价格必须大于0'
        );
      }

      const updatedHolding: Holding = {
        ...existingHolding,
        ...updates,
        id // 确保ID不变
      };

      await db.holdings.put(updatedHolding);
      
      // 更新客户总资产
      const clientHoldings = await this.getClientHoldings(existingHolding.clientId);
      const totalHoldingsValue = clientHoldings.reduce(
        (sum, h) => sum + (h.currentPrice * h.amount), 
        0
      );
      
      await db.clients.update(existingHolding.clientId, {
        totalAssets: totalHoldingsValue,
        updatedAt: new Date()
      });

      return updatedHolding;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      
      throw new AppError(
        ErrorCode.DATABASE_ERROR,
        `更新持仓 ${id} 失败`,
        { originalError: error }
      );
    }
  }

  /**
   * 删除持仓
   */
  async deleteHolding(id: string): Promise<boolean> {
    try {
      // 检查持仓是否存在
      const holding = await db.holdings.get(id);
      if (!holding) {
        throw new AppError(
          ErrorCode.NOT_FOUND,
          `持仓 ${id} 不存在`
        );
      }

      await db.holdings.delete(id);
      
      // 更新客户总资产
      const clientHoldings = await this.getClientHoldings(holding.clientId);
      const totalHoldingsValue = clientHoldings.reduce(
        (sum, h) => sum + (h.currentPrice * h.amount), 
        0
      );
      
      await db.clients.update(holding.clientId, {
        totalAssets: totalHoldingsValue,
        updatedAt: new Date()
      });

      return true;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      
      throw new AppError(
        ErrorCode.DATABASE_ERROR,
        `删除持仓 ${id} 失败`,
        { originalError: error }
      );
    }
  }

  /**
   * 批量导入持仓
   */
  async importHoldings(clientId: string, data: HoldingInput[]): Promise<ImportResult> {
    // 检查客户是否存在
    const client = await db.clients.get(clientId);
    if (!client) {
      throw new AppError(
        ErrorCode.NOT_FOUND,
        `客户 ${clientId} 不存在`
      );
    }

    const results: ImportResult = {
      success: 0,
      failed: 0,
      errors: []
    };

    for (const [index, item] of data.entries()) {
      try {
        await this.addHolding({
          ...item,
          clientId
        });
        results.success++;
      } catch (error) {
        results.failed++;
        results.errors.push({
          index,
          data: item,
          error: error instanceof Error ? error.message : '未知错误'
        });
      }
    }

    return results;
  }

  /**
   * 更新持仓当前价格（从基金数据更新）
   */
  async updateHoldingsCurrentPrice(fundCode: string, currentPrice: number): Promise<number> {
    if (currentPrice <= 0) {
      throw new AppError(
        ErrorCode.VALIDATION_ERROR,
        '当前价格必须大于0'
      );
    }

    try {
      // 获取所有持有该基金的持仓
      const holdings = await db.holdings
        .where('fundCode')
        .equals(fundCode)
        .toArray();

      let updatedCount = 0;
      
      // 批量更新
      for (const holding of holdings) {
        await this.updateHolding(holding.id, { currentPrice });
        updatedCount++;
      }

      return updatedCount;
    } catch (error) {
      throw new AppError(
        ErrorCode.DATABASE_ERROR,
        `更新持仓价格失败: ${error instanceof Error ? error.message : '未知错误'}`,
        { originalError: error }
      );
    }
  }

  /**
   * 获取持仓统计
   */
  async getHoldingStats(clientId: string): Promise<HoldingStats> {
    try {
      const holdings = await this.getClientHoldings(clientId);
      
      if (holdings.length === 0) {
        return {
          totalHoldings: 0,
          totalValue: 0,
          totalProfitLoss: 0,
          totalProfitLossRate: 0,
          fundDistribution: {}
        };
      }

      const totalValue = holdings.reduce((sum, h) => sum + (h.currentPrice * h.amount), 0);
      const totalCost = holdings.reduce((sum, h) => sum + (h.purchasePrice * h.amount), 0);
      const totalProfitLoss = totalValue - totalCost;
      const totalProfitLossRate = totalCost > 0 ? (totalProfitLoss / totalCost) * 100 : 0;

      // 基金分布
      const fundDistribution = holdings.reduce((dist, holding) => {
        const fundCode = holding.fundCode;
        const value = holding.currentPrice * holding.amount;
        
        if (!dist[fundCode]) {
          dist[fundCode] = {
            fundCode,
            fundName: holding.fundName,
            totalValue: 0,
            percentage: 0,
            holdings: []
          };
        }
        
        dist[fundCode].totalValue += value;
        dist[fundCode].holdings.push(holding);
        return dist;
      }, {} as Record<string, FundDistribution>);

      // 计算百分比
      Object.values(fundDistribution).forEach(dist => {
        dist.percentage = totalValue > 0 ? (dist.totalValue / totalValue) * 100 : 0;
      });

      return {
        totalHoldings: holdings.length,
        totalValue,
        totalProfitLoss,
        totalProfitLossRate,
        fundDistribution
      };
    } catch (error) {
      throw new AppError(
        ErrorCode.DATABASE_ERROR,
        `获取持仓统计失败: ${error instanceof Error ? error.message : '未知错误'}`,
        { originalError: error }
      );
    }
  }
}

// 类型定义
interface ImportResult {
  success: number;
  failed: number;
  errors: Array<{
    index: number;
    data: HoldingInput;
    error: string;
  }>;
}

interface HoldingStats {
  totalHoldings: number;
  totalValue: number;
  totalProfitLoss: number;
  totalProfitLossRate: number;
  fundDistribution: Record<string, FundDistribution>;
}

interface FundDistribution {
  fundCode: string;
  fundName: string;
  totalValue: number;
  percentage: number;
  holdings: Holding[];
}