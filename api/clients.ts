/**
 * Vercel API Routes - 客户管理
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

// 内存数据库
let clients: any[] = [
  { id: '1', name: '张三', phone: '13800138000', email: 'zhangsan@example.com', riskLevel: 'C3', totalAssets: 500000, createdAt: new Date(), updatedAt: new Date() },
  { id: '2', name: '李四', phone: '13900139000', email: 'lisi@example.com', riskLevel: 'C2', totalAssets: 300000, createdAt: new Date(), updatedAt: new Date() },
  { id: '3', name: '王五', phone: '13700137000', email: 'wangwu@example.com', riskLevel: 'C4', totalAssets: 800000, createdAt: new Date(), updatedAt: new Date() },
];

export default function handler(req: VercelRequest, res: VercelResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      // 获取客户列表或单个客户
      if (req.query.id) {
        const client = clients.find(c => c.id === req.query.id);
        if (client) {
          res.status(200).json(client);
        } else {
          res.status(404).json({ error: '客户不存在' });
        }
      } else {
        res.status(200).json(clients);
      }
      break;

    case 'POST':
      // 新增客户
      const newClient = {
        id: Date.now().toString(),
        ...req.body,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      clients.push(newClient);
      res.status(201).json(newClient);
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
