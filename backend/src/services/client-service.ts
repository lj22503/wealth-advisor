import { Client, ClientInput, ClientFilter, LEGACY_RISK_LEVEL_MAP } from '../types';
import { db } from '../db';
import { generateId } from '../utils/id-generator';
import { AppError, ErrorCode } from '../utils/errors';

/**
 * 客户管理服务
 */
export class ClientService {
  /**
   * 获取客户列表
   */
  async getClients(filter?: ClientFilter): Promise<Client[]> {
    try {
      let clients = await db.clients.toArray();
      
      // 应用筛选条件
      if (filter) {
        if (filter.name) {
          clients = clients.filter((client: Client) => 
            client.name.toLowerCase().includes(filter.name!.toLowerCase())
          );
        }
        
        if (filter.riskLevel) {
          // 支持新旧两种风险等级格式
          clients = clients.filter((client: Client) => {
            if (client.riskLevel === filter.riskLevel) return true;
            // 兼容旧数据：CONSERVATIVE->C1, MODERATE->C3, AGGRESSIVE->C5
            if (LEGACY_RISK_LEVEL_MAP[client.riskLevel] === filter.riskLevel) return true;
            if (client.riskLevel === LEGACY_RISK_LEVEL_MAP[filter.riskLevel]) return true;
            return false;
          });
        }
        
        // 排序
        if (filter.sortBy) {
          clients.sort((a: Client, b: Client) => {
            const aValue = a[filter.sortBy! as keyof Client];
            const bValue = b[filter.sortBy! as keyof Client];
            
            if (typeof aValue === 'string' && typeof bValue === 'string') {
              return filter.sortOrder === 'desc' 
                ? bValue.localeCompare(aValue)
                : aValue.localeCompare(bValue);
            }
            
            if (typeof aValue === 'number' && typeof bValue === 'number') {
              return filter.sortOrder === 'desc'
                ? bValue - aValue
                : aValue - bValue;
            }
            
            return 0;
          });
        }
      }
      
      return clients;
    } catch (error) {
      throw new AppError(
        ErrorCode.DATABASE_ERROR,
        '获取客户列表失败',
        { originalError: error }
      );
    }
  }

  /**
   * 获取单个客户
   */
  async getClient(id: string): Promise<Client | null> {
    try {
      const client = await db.clients.get(id);
      return client || null;
    } catch (error) {
      throw new AppError(
        ErrorCode.DATABASE_ERROR,
        `获取客户 ${id} 失败`,
        { originalError: error }
      );
    }
  }

  /**
   * 创建客户
   */
  async createClient(input: ClientInput): Promise<Client> {
    // 数据验证
    if (!input.name || input.name.trim().length === 0) {
      throw new AppError(
        ErrorCode.VALIDATION_ERROR,
        '客户姓名不能为空'
      );
    }

    if (input.totalAssets !== undefined && input.totalAssets < 0) {
      throw new AppError(
        ErrorCode.VALIDATION_ERROR,
        '总资产不能为负数'
      );
    }

    const now = new Date();
    const client: Client = {
      id: generateId('client'),
      name: input.name.trim(),
      phone: input.phone?.trim(),
      email: input.email?.trim(),
      riskLevel: input.riskLevel || 'C3',
      totalAssets: input.totalAssets ?? 0,
      createdAt: now,
      updatedAt: now
    };

    try {
      await db.clients.add(client);
      return client;
    } catch (error) {
      throw new AppError(
        ErrorCode.DATABASE_ERROR,
        '创建客户失败',
        { originalError: error }
      );
    }
  }

  /**
   * 更新客户
   */
  async updateClient(id: string, updates: Partial<Client>): Promise<Client> {
    try {
      const existingClient = await db.clients.get(id);
      if (!existingClient) {
        throw new AppError(
          ErrorCode.NOT_FOUND,
          `客户 ${id} 不存在`
        );
      }

      // 验证更新数据
      if (updates.name !== undefined && updates.name.trim().length === 0) {
        throw new AppError(
          ErrorCode.VALIDATION_ERROR,
          '客户姓名不能为空'
        );
      }

      if (updates.totalAssets !== undefined && updates.totalAssets < 0) {
        throw new AppError(
          ErrorCode.VALIDATION_ERROR,
          '总资产不能为负数'
        );
      }

      const updatedClient: Client = {
        ...existingClient,
        ...updates,
        id, // 确保ID不变
        updatedAt: new Date()
      };

      await db.clients.put(updatedClient);
      return updatedClient;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      
      throw new AppError(
        ErrorCode.DATABASE_ERROR,
        `更新客户 ${id} 失败`,
        { originalError: error }
      );
    }
  }

  /**
   * 删除客户
   */
  async deleteClient(id: string): Promise<boolean> {
    try {
      // 检查客户是否存在
      const client = await db.clients.get(id);
      if (!client) {
        throw new AppError(
          ErrorCode.NOT_FOUND,
          `客户 ${id} 不存在`
        );
      }

      // 检查是否有关联的持仓记录
      const holdings = await db.holdings.where('clientId').equals(id).toArray();
      if (holdings.length > 0) {
        throw new AppError(
          ErrorCode.VALIDATION_ERROR,
          '客户有关联的持仓记录，无法删除'
        );
      }

      await db.clients.delete(id);
      return true;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      
      throw new AppError(
        ErrorCode.DATABASE_ERROR,
        `删除客户 ${id} 失败`,
        { originalError: error }
      );
    }
  }

  /**
   * 批量导入客户
   */
  async importClients(data: ClientInput[]): Promise<ImportResult> {
    const results: ImportResult = {
      success: 0,
      failed: 0,
      errors: []
    };

    for (const [index, item] of data.entries()) {
      try {
        await this.createClient(item);
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
   * 获取客户统计信息
   */
  async getClientStats(): Promise<ClientStats> {
    try {
      const clients = await db.clients.toArray();
      
      const totalClients = clients.length;
      const totalAssets = clients.reduce((sum: number, client: Client) => sum + client.totalAssets, 0);
      const avgAssets = totalClients > 0 ? totalAssets / totalClients : 0;
      
      // 风险等级分布
      const riskDistribution = clients.reduce((dist: Record<string, number>, client: Client) => {
        dist[client.riskLevel] = (dist[client.riskLevel] || 0) + 1;
        return dist;
      }, {} as Record<string, number>);

      return {
        totalClients,
        totalAssets,
        avgAssets,
        riskDistribution
      };
    } catch (error) {
      throw new AppError(
        ErrorCode.DATABASE_ERROR,
        '获取客户统计失败',
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
    data: ClientInput;
    error: string;
  }>;
}

interface ClientStats {
  totalClients: number;
  totalAssets: number;
  avgAssets: number;
  riskDistribution: Record<string, number>;
}