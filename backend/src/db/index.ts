import Dexie from 'dexie';
import { Client, Holding, Fund } from '../types';

/**
 * 数据库配置
 */
export class WealthAdvisorDB extends Dexie {
  clients!: Dexie.Table<Client, string>;
  holdings!: Dexie.Table<Holding, string>;
  funds!: Dexie.Table<Fund, string>;

  constructor() {
    super('WealthAdvisorDB');
    
    this.version(1).stores({
      clients: 'id, name, riskLevel, createdAt',
      holdings: 'id, clientId, fundCode, purchaseDate',
      funds: 'code, name, category, riskLevel'
    });
    
    // 索引配置（注意：Client、Holding、Fund是接口，不是类，所以不能使用mapToClass）
  }
}

// 导出数据库实例
export const db = new WealthAdvisorDB();

// 初始化示例数据
export async function initDatabase() {
  try {
    // 检查是否已有数据
    const clientCount = await db.clients.count();
    
    if (clientCount === 0) {
      console.log('初始化示例数据...');
      
      // 添加示例客户
      await db.clients.bulkAdd([
        {
          id: 'client_001',
          name: '张伟',
          phone: '13800138001',
          email: 'zhangwei@example.com',
          riskLevel: 'MODERATE',
          totalAssets: 3250000,
          createdAt: new Date('2026-01-15'),
          updatedAt: new Date('2026-03-13')
        },
        {
          id: 'client_002',
          name: '王芳',
          phone: '13800138002',
          email: 'wangfang@example.com',
          riskLevel: 'CONSERVATIVE',
          totalAssets: 1850000,
          createdAt: new Date('2026-02-10'),
          updatedAt: new Date('2026-03-12')
        },
        {
          id: 'client_003',
          name: '李强',
          phone: '13800138003',
          email: 'liqiang@example.com',
          riskLevel: 'AGGRESSIVE',
          totalAssets: 5600000,
          createdAt: new Date('2026-01-20'),
          updatedAt: new Date('2026-03-12')
        }
      ]);

      // 添加示例基金
      await db.funds.bulkAdd([
        {
          code: '000001',
          name: '华夏成长混合',
          category: '混合型',
          riskLevel: 'MODERATE',
          nav: 2.45,
          navDate: new Date('2026-03-13'),
          manager: '华夏基金',
          establishedDate: new Date('2001-12-18')
        },
        {
          code: '000011',
          name: '华夏大盘精选',
          category: '股票型',
          riskLevel: 'AGGRESSIVE',
          nav: 3.21,
          navDate: new Date('2026-03-13'),
          manager: '华夏基金',
          establishedDate: new Date('2004-08-11')
        },
        {
          code: '000021',
          name: '华夏债券A',
          category: '债券型',
          riskLevel: 'CONSERVATIVE',
          nav: 1.08,
          navDate: new Date('2026-03-13'),
          manager: '华夏基金',
          establishedDate: new Date('2002-10-23')
        }
      ]);

      // 添加示例持仓
      await db.holdings.bulkAdd([
        {
          id: 'holding_001',
          clientId: 'client_001',
          fundCode: '000001',
          fundName: '华夏成长混合',
          amount: 500000,
          purchasePrice: 2.30,
          currentPrice: 2.45,
          purchaseDate: new Date('2025-12-15')
        },
        {
          id: 'holding_002',
          clientId: 'client_001',
          fundCode: '000021',
          fundName: '华夏债券A',
          amount: 1000000,
          purchasePrice: 1.05,
          currentPrice: 1.08,
          purchaseDate: new Date('2025-11-20')
        },
        {
          id: 'holding_003',
          clientId: 'client_002',
          fundCode: '000021',
          fundName: '华夏债券A',
          amount: 1500000,
          purchasePrice: 1.04,
          currentPrice: 1.08,
          purchaseDate: new Date('2025-10-10')
        },
        {
          id: 'holding_004',
          clientId: 'client_003',
          fundCode: '000011',
          fundName: '华夏大盘精选',
          amount: 2000000,
          purchasePrice: 3.00,
          currentPrice: 3.21,
          purchaseDate: new Date('2025-09-05')
        }
      ]);

      console.log('示例数据初始化完成');
    }
  } catch (error) {
    console.error('初始化数据库失败:', error);
  }
}

// 数据库工具函数
export async function clearDatabase() {
  try {
    await db.clients.clear();
    await db.holdings.clear();
    await db.funds.clear();
    console.log('数据库已清空');
  } catch (error) {
    console.error('清空数据库失败:', error);
  }
}

export async function getDatabaseStats() {
  try {
    const clientCount = await db.clients.count();
    const holdingCount = await db.holdings.count();
    const fundCount = await db.funds.count();
    
    return {
      clients: clientCount,
      holdings: holdingCount,
      funds: fundCount,
      total: clientCount + holdingCount + fundCount
    };
  } catch (error) {
    console.error('获取数据库统计失败:', error);
    return null;
  }
}