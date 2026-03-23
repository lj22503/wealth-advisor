/**
 * Vercel API Routes - 持仓统计
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

// 内存数据库
let holdings: any[] = [
  { id: '1', clientId: '1', fundCode: '000001', fundName: '华夏成长混合', amount: 10000, purchasePrice: 1.5, currentPrice: 1.8, purchaseDate: '2024-01-15' },
  { id: '2', clientId: '1', fundCode: '000002', fundName: '易方达蓝筹精选', amount: 5000, purchasePrice: 2.3, currentPrice: 2.1, purchaseDate: '2024-02-20' },
  { id: '3', clientId: '2', fundCode: '000003', fundName: '南方宝元债券', amount: 20000, purchasePrice: 1.2, currentPrice: 1.3, purchaseDate: '2024-03-10' },
];

export default function handler(req: VercelRequest, res: VercelResponse) {
  const { clientId } = req.query;

  if (!clientId) {
    return res.status(400).json({ error: '缺少 clientId 参数' });
  }

  const clientHoldings = holdings.filter(h => h.clientId === clientId);

  const stats = {
    totalHoldings: clientHoldings.length,
    totalValue: clientHoldings.reduce((sum, h) => sum + h.amount * h.currentPrice, 0),
    totalProfitLoss: clientHoldings.reduce((sum, h) => sum + (h.currentPrice - h.purchasePrice) * h.amount, 0),
    totalProfitLossRate: 0,
    fundDistribution: {} as any,
  };

  // 计算收益率
  const totalCost = clientHoldings.reduce((sum, h) => sum + h.purchasePrice * h.amount, 0);
  stats.totalProfitLossRate = totalCost > 0 ? (stats.totalProfitLoss / totalCost) * 100 : 0;

  // 基金分布
  clientHoldings.forEach(h => {
    const value = h.amount * h.currentPrice;
    stats.fundDistribution[h.fundName] = {
      value,
      percentage: stats.totalValue > 0 ? (value / stats.totalValue) * 100 : 0,
    };
  });

  res.status(200).json(stats);
}
