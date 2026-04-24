import apiClient from './api';
import type { Holding, HoldingInput, HoldingStats, ApiResponse } from '@/types';

/**
 * 持仓服务
 */
export const holdingService = {
  /**
   * 获取客户持仓列表
   */
  async getClientHoldings(clientId: string): Promise<Holding[]> {
    const response = await apiClient.get<ApiResponse<Holding[]>>(`/clients/${clientId}/holdings`);
    return response.data || [];
  },

  /**
   * 获取单个持仓
   */
  async getHolding(id: string): Promise<Holding | null> {
    const response = await apiClient.get<ApiResponse<Holding>>(`/holdings/${id}`);
    return response.data || null;
  },

  /**
   * 添加持仓
   */
  async addHolding(input: HoldingInput): Promise<Holding> {
    const response = await apiClient.post<ApiResponse<Holding>>('/holdings', input);
    return response.data!;
  },

  /**
   * 更新持仓
   */
  async updateHolding(id: string, input: Partial<HoldingInput>): Promise<Holding> {
    const response = await apiClient.put<ApiResponse<Holding>>(`/holdings/${id}`, input);
    return response.data!;
  },

  /**
   * 删除持仓
   */
  async deleteHolding(id: string): Promise<void> {
    await apiClient.delete(`/holdings/${id}`);
  },

  /**
   * 批量导入持仓
   */
  async importHoldings(clientId: string, file: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.post(`/clients/${clientId}/holdings/import`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  },

  /**
   * 获取持仓统计
   */
  async getHoldingStats(clientId: string): Promise<HoldingStats> {
    const response = await apiClient.get<ApiResponse<HoldingStats>>(`/clients/${clientId}/holdings/stats`);
    return response.data!;
  },

  /**
   * 更新持仓当前价格
   */
  async updateHoldingsCurrentPrice(fundCode: string, currentPrice: number): Promise<number> {
    const response = await apiClient.put<ApiResponse<number>>('/holdings/update-price', {
      fundCode,
      currentPrice,
    });
    return response.data!;
  },
};
