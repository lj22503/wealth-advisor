// api/clients/holdings-stats.js - 持仓统计
export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  const { clientId } = req.query

  const stats = {
    totalHoldings: 3,
    totalValue: 43000,
    totalProfitLoss: 5000,
    totalProfitLossRate: 13.16,
    fundDistribution: {
      '华夏成长混合': { fundCode: '000001', fundName: '华夏成长混合', totalValue: 18000, percentage: 41.86, holdings: [] },
      '易方达蓝筹精选': { fundCode: '000002', fundName: '易方达蓝筹精选', totalValue: 10500, percentage: 24.42, holdings: [] },
      '南方宝元债券': { fundCode: '000003', fundName: '南方宝元债券', totalValue: 14500, percentage: 33.72, holdings: [] },
    },
  }

  return res.status(200).json(stats)
}
