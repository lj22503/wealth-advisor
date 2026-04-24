// api/clients/[id].js - 单个客户管理
export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  const { id } = req.query

  const clients = [
    { id: '1', name: '张三', phone: '13800138000', email: 'zhangsan@example.com', riskLevel: 'C3', totalAssets: 500000 },
    { id: '2', name: '李四', phone: '13900139000', email: 'lisi@example.com', riskLevel: 'C2', totalAssets: 300000 },
    { id: '3', name: '王五', phone: '13700137000', email: 'wangwu@example.com', riskLevel: 'C4', totalAssets: 800000 },
  ]

  if (req.method === 'GET') {
    const client = clients.find(c => c.id === id)
    if (client) {
      return res.status(200).json(client)
    }
    return res.status(404).json({ error: '客户不存在' })
  }

  if (req.method === 'DELETE') {
    return res.status(200).json({ success: true })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
