/**
 * 内存版后端服务（用于开发测试）
 */

import express from 'express';
import cors from 'cors';

const app = express();
const port = 3001;

// 中间件
app.use(cors());
app.use(express.json());

// 内存数据库
let clients: any[] = [
  { id: '1', name: '张三', phone: '13800138000', email: 'zhangsan@example.com', riskLevel: 'C3', totalAssets: 500000, createdAt: new Date(), updatedAt: new Date() },
  { id: '2', name: '李四', phone: '13900139000', email: 'lisi@example.com', riskLevel: 'C2', totalAssets: 300000, createdAt: new Date(), updatedAt: new Date() },
  { id: '3', name: '王五', phone: '13700137000', email: 'wangwu@example.com', riskLevel: 'C4', totalAssets: 800000, createdAt: new Date(), updatedAt: new Date() },
];

let holdings: any[] = [
  { id: '1', clientId: '1', fundCode: '000001', fundName: '华夏成长混合', amount: 10000, purchasePrice: 1.5, currentPrice: 1.8, purchaseDate: '2024-01-15' },
  { id: '2', clientId: '1', fundCode: '000002', fundName: '易方达蓝筹精选', amount: 5000, purchasePrice: 2.3, currentPrice: 2.1, purchaseDate: '2024-02-20' },
  { id: '3', clientId: '2', fundCode: '000003', fundName: '南方宝元债券', amount: 20000, purchasePrice: 1.2, currentPrice: 1.3, purchaseDate: '2024-03-10' },
];

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 客户管理 API
app.get('/api/clients', (req, res) => {
  console.log('GET /api/clients');
  res.json(clients);
});

app.get('/api/clients/:id', (req, res) => {
  const client = clients.find(c => c.id === req.params.id);
  if (client) {
    res.json(client);
  } else {
    res.status(404).json({ error: '客户不存在' });
  }
});

app.post('/api/clients', (req, res) => {
  const newClient = {
    id: Date.now().toString(),
    ...req.body,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  clients.push(newClient);
  res.json(newClient);
});

app.put('/api/clients/:id', (req, res) => {
  const index = clients.findIndex(c => c.id === req.params.id);
  if (index !== -1) {
    clients[index] = { ...clients[index], ...req.body, updatedAt: new Date() };
    res.json(clients[index]);
  } else {
    res.status(404).json({ error: '客户不存在' });
  }
});

app.delete('/api/clients/:id', (req, res) => {
  clients = clients.filter(c => c.id !== req.params.id);
  res.json({ success: true });
});

// 持仓管理 API
app.get('/api/clients/:clientId/holdings', (req, res) => {
  const clientHoldings = holdings.filter(h => h.clientId === req.params.clientId);
  console.log(`GET /api/clients/${req.params.clientId}/holdings`, clientHoldings.length);
  res.json(clientHoldings);
});

app.get('/api/clients/:clientId/holdings/stats', (req, res) => {
  const clientHoldings = holdings.filter(h => h.clientId === req.params.clientId);
  
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
  
  res.json(stats);
});

// 启动服务
app.listen(port, () => {
  console.log(`🚀 后端服务启动成功！`);
  console.log(`📍 端口：${port}`);
  console.log(`🌐 地址：http://localhost:${port}`);
  console.log(`💾 模式：内存模式（数据重启后清空）`);
  console.log(``);
  console.log(`可用 API:`);
  console.log(`  GET  /health`);
  console.log(`  GET  /api/clients`);
  console.log(`  POST /api/clients`);
  console.log(`  PUT  /api/clients/:id`);
  console.log(`  DELETE /api/clients/:id`);
  console.log(`  GET  /api/clients/:id/holdings`);
  console.log(`  GET  /api/clients/:id/holdings/stats`);
});
