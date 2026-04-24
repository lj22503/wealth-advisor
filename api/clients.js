// api/clients.js - Vercel Serverless Function
export default function handler(req, res) {
  // CORS 设置
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  // 内存数据（生产环境建议用真正的数据库）
  const clients = [
    { id: '1', name: '张三', phone: '13800138000', email: 'zhangsan@example.com', riskLevel: 'C3', totalAssets: 500000, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '2', name: '李四', phone: '13900139000', email: 'lisi@example.com', riskLevel: 'C2', totalAssets: 300000, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '3', name: '王五', phone: '13700137000', email: 'wangwu@example.com', riskLevel: 'C4', totalAssets: 800000, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  ]

  if (req.method === 'GET') {
    return res.status(200).json(clients)
  }

  if (req.method === 'POST') {
    const newClient = {
      id: Date.now().toString(),
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    return res.status(201).json(newClient)
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
