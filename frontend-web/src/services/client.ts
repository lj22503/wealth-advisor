import apiClient from './api';
import type { Client, ClientInput, ClientFilter, ApiResponse } from '@/types';

/**
 * 客户服务
 */
export const clientService = {
  /**
   * 获取客户列表
   */
  async getClients(filter?: ClientFilter): Promise<Client[]> {
    const response = await apiClient.get<ApiResponse<Client[]>>('/clients', { params: filter });
    return response.data || [];
  },

  /**
   * 获取单个客户
   */
  async getClient(id: string): Promise<Client | null> {
    const response = await apiClient.get<ApiResponse<Client>>(`/clients/${id}`);
    return response.data || null;
  },

  /**
   * 创建客户
   */
  async createClient(input: ClientInput): Promise<Client> {
    const response = await apiClient.post<ApiResponse<Client>>('/clients', input);
    return response.data!;
  },

  /**
   * 更新客户
   */
  async updateClient(id: string, input: Partial<ClientInput>): Promise<Client> {
    const response = await apiClient.put<ApiResponse<Client>>(`/clients/${id}`, input);
    return response.data!;
  },

  /**
   * 删除客户
   */
  async deleteClient(id: string): Promise<void> {
    await apiClient.delete(`/clients/${id}`);
  },

  /**
   * 批量导入客户
   */
  async importClients(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.post('/clients/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  },

  /**
   * 导出客户
   */
  async exportClients(filter?: ClientFilter): Promise<Blob> {
    const response = await apiClient.get('/clients/export', {
      params: filter,
      responseType: 'blob',
    });
    return response;
  },
};
