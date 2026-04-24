import { describe, it, expect, beforeEach, vi } from 'vitest';
import { clientService } from './client';
import apiClient from '../utils/api';

// Mock API client
vi.mock('../utils/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('ClientService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getClients', () => {
    it('should return client list', async () => {
      const mockClients = [
        { id: '1', name: '张三', riskLevel: 'C3', totalAssets: 500000 },
        { id: '2', name: '李四', riskLevel: 'C2', totalAssets: 300000 },
      ];

      vi.mocked(apiClient.get).mockResolvedValue({ data: mockClients });

      const clients = await clientService.getClients();

      expect(clients).toHaveLength(2);
      expect(clients[0].name).toBe('张三');
      expect(apiClient.get).toHaveBeenCalledWith('/clients', { params: undefined });
    });

    it('should handle filter params', async () => {
      const mockClients = [{ id: '1', name: '张三', riskLevel: 'C3', totalAssets: 500000 }];

      vi.mocked(apiClient.get).mockResolvedValue({ data: mockClients });

      await clientService.getClients({ name: '张三', riskLevel: 'C3' });

      expect(apiClient.get).toHaveBeenCalledWith('/clients', {
        params: { name: '张三', riskLevel: 'C3' },
      });
    });
  });

  describe('getClient', () => {
    it('should return single client', async () => {
      const mockClient = { id: '1', name: '张三', riskLevel: 'C3', totalAssets: 500000 };

      vi.mocked(apiClient.get).mockResolvedValue({ data: mockClient });

      const client = await clientService.getClient('1');

      expect(client).toEqual(mockClient);
      expect(apiClient.get).toHaveBeenCalledWith('/clients/1');
    });

    it('should return null when client not found', async () => {
      vi.mocked(apiClient.get).mockResolvedValue({ data: null });

      const client = await clientService.getClient('999');

      expect(client).toBeNull();
    });
  });

  describe('createClient', () => {
    it('should create new client', async () => {
      const input = { name: '王五', riskLevel: 'C4', totalAssets: 800000 };
      const newClient = { id: '3', ...input };

      vi.mocked(apiClient.post).mockResolvedValue({ data: newClient });

      const client = await clientService.createClient(input);

      expect(client).toEqual(newClient);
      expect(apiClient.post).toHaveBeenCalledWith('/clients', input);
    });
  });

  describe('updateClient', () => {
    it('should update existing client', async () => {
      const updates = { name: '张三更新', totalAssets: 600000 };
      const updatedClient = { id: '1', name: '张三更新', riskLevel: 'C3', totalAssets: 600000 };

      vi.mocked(apiClient.put).mockResolvedValue({ data: updatedClient });

      const client = await clientService.updateClient('1', updates);

      expect(client).toEqual(updatedClient);
      expect(apiClient.put).toHaveBeenCalledWith('/clients/1', updates);
    });
  });

  describe('deleteClient', () => {
    it('should delete client', async () => {
      vi.mocked(apiClient.delete).mockResolvedValue({});

      await clientService.deleteClient('1');

      expect(apiClient.delete).toHaveBeenCalledWith('/clients/1');
    });
  });
});
