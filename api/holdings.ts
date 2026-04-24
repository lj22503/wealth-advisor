/**
 * Vercel API Routes - 持仓管理
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

// 内存数据库
let holdings: any[] = [
  { id: '1', clientId: '1', fundCode: '000001', fundName: '华夏成长混合', amount: 10000, purchasePrice: 1.5, currentPrice: 1.8, purchaseDate: '2024-01-15' },
  { id: '2', clientId: '1', fundCode: '000002', fundName: '易方达蓝筹精选', amount: 5000, purchasePrice: 2.3, currentPrice: 2.1, purchaseDate: '2024-02-20' },
  { id: '3', clientId: '2', fundCode: '000003', fundName: '南方宝元债券', amount: 20000, purchasePrice: 1.2, currentPrice: 1.3, purchaseDate: '2024-03-10' },
];

export default function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { method, query } = req;
  const { clientId } = query;

  switch (method) {
    case 'GET':
      if (clientId) {
        // 获取客户持仓列表
        const clientHoldings = holdings.filter(h => h.clientId === clientId);
        res.status(200).json(clientHoldings);
      } else {
        res.status(400).json({ error: '缺少 clientId 参数' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
