import { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Select, Progress, Tag, Statistic, Message } from '@arco-design/web-react';
import { Grid } from '@arco-design/web-react';
const { Row, Col } = Grid;
import { IconDownload, IconRefresh } from '@arco-design/web-react/icon';
import { clientService } from '@/services/client';
import { holdingService } from '@/services/holding';
import Chart from '@/components/Chart';
import type { Client, Holding, HoldingStats } from '@/types';

export default function HoldingDiagnosisPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [stats, setStats] = useState<HoldingStats | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadClients();
  }, []);

  useEffect(() => {
    if (selectedClientId) {
      loadDiagnosis();
    }
  }, [selectedClientId]);

  async function loadClients() {
    try {
      const data = await clientService.getClients();
      setClients(data);
      if (data.length > 0) {
        setSelectedClientId(data[0].id);
      }
    } catch (error) {
      Message.error('加载客户列表失败');
    }
  }

  async function loadDiagnosis() {
    if (!selectedClientId) return;
    
    setLoading(true);
    try {
      const [holdingsData, statsData] = await Promise.all([
        holdingService.getClientHoldings(selectedClientId),
        holdingService.getHoldingStats(selectedClientId),
      ]);
      setHoldings(holdingsData);
      setStats(statsData);
    } catch (error) {
      Message.error('加载诊断数据失败');
    } finally {
      setLoading(false);
    }
  }

  // 计算风险评分（简化版）
  function calculateRiskScore(): number {
    if (!stats || stats.totalHoldings === 0) return 0;
    
    // 基于分散度评分
    const diversificationScore = Math.min(100, (Object.keys(stats.fundDistribution).length / stats.totalHoldings) * 100);
    
    // 基于集中度风险
    const maxConcentration = Math.max(...Object.values(stats.fundDistribution).map(d => d.percentage));
    const concentrationPenalty = maxConcentration > 50 ? 20 : maxConcentration > 30 ? 10 : 0;
    
    return Math.max(0, diversificationScore - concentrationPenalty);
  }

  // 生成诊断建议
  function generateSuggestions(): string[] {
    const suggestions: string[] = [];
    
    if (!stats) return suggestions;
    
    // 集中度风险
    const maxConcentration = Math.max(...Object.values(stats.fundDistribution).map(d => d.percentage));
    if (maxConcentration > 50) {
      suggestions.push('⚠️ 持仓集中度过高，建议分散投资');
    } else if (maxConcentration > 30) {
      suggestions.push('⚡ 单一基金占比较高，可适当分散');
    }
    
    // 分散度
    if (stats.totalHoldings < 5) {
      suggestions.push('💡 持仓数量较少，建议增加基金数量分散风险');
    }
    
    // 收益情况
    if (stats.totalProfitLossRate < -10) {
      suggestions.push('📉 当前亏损较大，建议审视持仓基金质量');
    } else if (stats.totalProfitLossRate > 20) {
      suggestions.push('📈 收益表现良好，可考虑止盈部分持仓');
    }
    
    if (suggestions.length === 0) {
      suggestions.push('✅ 持仓结构健康，继续保持');
    }
    
    return suggestions;
  }

  // 风险等级颜色
  function getRiskColor(score: number): string {
    if (score >= 80) return '#00b42a';
    if (score >= 60) return '#165dff';
    if (score >= 40) return '#f77234';
    return '#f53f3f';
  }

  function getRiskLevel(score: number): string {
    if (score >= 80) return '低风险';
    if (score >= 60) return '中低风险';
    if (score >= 40) return '中高风险';
    return '高风险';
  }

  const riskScore = calculateRiskScore();
  const suggestions = generateSuggestions();

  // 行业分布饼图
  const categoryOption = {
    title: { text: '基金类型分布', left: 'center' },
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: { orient: 'vertical', left: 'left' },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        data: Object.values(stats?.fundDistribution || {}).map((d: any) => ({
          value: d.totalValue,
          name: d.fundName,
        })),
      },
    ],
  };

  return (
    <div>
      {/* 客户选择 */}
      <Card style={{ marginBottom: 16 }}>
        <Space size="large">
          <div>
            <span style={{ marginRight: 8 }}>选择客户:</span>
            <Select
              value={selectedClientId}
              onChange={(value) => setSelectedClientId(value)}
              style={{ width: 250 }}
            >
              {clients.map((client) => (
                <Select.Option key={client.id} value={client.id}>
                  {client.name}
                </Select.Option>
              ))}
            </Select>
          </div>
          <Button icon={<IconRefresh />} onClick={loadDiagnosis}>
            刷新
          </Button>
          <Button icon={<IconDownload />}>导出报告</Button>
        </Space>
      </Card>

      {selectedClientId && (
        <>
          {/* 风险评分 */}
          <Card title="综合风险评估" style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={8}>
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <div style={{ fontSize: 48, fontWeight: 'bold', color: getRiskColor(riskScore) }}>
                    {riskScore.toFixed(0)}
                  </div>
                  <div style={{ fontSize: 16, color: '#86909c', marginTop: 8 }}>
                    风险评分
                  </div>
                  <Tag 
                    color={getRiskColor(riskScore)} 
                    style={{ marginTop: 12, fontSize: 14 }}
                  >
                    {getRiskLevel(riskScore)}
                  </Tag>
                </div>
              </Col>
              <Col span={16}>
                <Space direction="vertical" style={{ width: '100%' }} size="large">
                  <div>
                    <div style={{ marginBottom: 8 }}>分散度评分</div>
                    <Progress 
                      percent={Math.min(100, (Object.keys(stats?.fundDistribution || {}).length / (stats?.totalHoldings || 1)) * 100)} 
                      status={stats && stats.totalHoldings >= 5 ? 'success' : 'warning'}
                    />
                  </div>
                  <div>
                    <div style={{ marginBottom: 8 }}>集中度风险</div>
                    <Progress 
                      percent={Math.max(...Object.values(stats?.fundDistribution || {}).map((d: any) => d.percentage), 0)} 
                      status={stats && Math.max(...Object.values(stats.fundDistribution).map((d: any) => d.percentage)) < 30 ? 'success' : 'error'}
                    />
                  </div>
                  <div>
                    <div style={{ marginBottom: 8 }}>收益表现</div>
                    <Progress 
                      percent={Math.min(100, Math.max(0, (stats?.totalProfitLossRate || 0) + 50))} 
                      status={stats && stats.totalProfitLossRate >= 0 ? 'success' : 'error'}
                    />
                  </div>
                </Space>
              </Col>
            </Row>
          </Card>

          {/* 诊断建议 */}
          <Card title="诊断建议" style={{ marginBottom: 16 }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              {suggestions.map((suggestion, index) => (
                <div key={index} style={{ fontSize: 15, padding: '8px 0', borderBottom: index < suggestions.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
                  {suggestion}
                </div>
              ))}
            </Space>
          </Card>

          {/* 图表分析 */}
          <Row gutter={16}>
            <Col span={12}>
              <Card title="持仓分布">
                <Chart option={categoryOption} height={300} />
              </Card>
            </Col>
            <Col span={12}>
              <Card title="持仓统计">
                <Space direction="vertical" style={{ width: '100%' }} size="large">
                  <Statistic title="持仓总数" value={stats?.totalHoldings || 0} />
                  <Statistic title="持仓总市值" value={`¥${(stats?.totalValue || 0) / 10000}`} suffix="万" />
                  <Statistic 
                    title="总收益" 
                    value={`¥${(stats?.totalProfitLoss || 0) / 10000}`} 
                    suffix="万"
                    valueStyle={{ 
                      color: (stats?.totalProfitLoss || 0) >= 0 ? '#00b42a' : '#f53f3f' 
                    }}
                  />
                  <Statistic 
                    title="总收益率" 
                    value={stats?.totalProfitLossRate || 0} 
                    suffix="%"
                    valueStyle={{ 
                      color: (stats?.totalProfitLossRate || 0) >= 0 ? '#00b42a' : '#f53f3f' 
                    }}
                  />
                </Space>
              </Card>
            </Col>
          </Row>

          {/* 持仓明细 */}
          <Card title="持仓明细" style={{ marginTop: 16 }}>
            <Table
              columns={[
                { title: '基金代码', dataIndex: 'fundCode' },
                { title: '基金名称', dataIndex: 'fundName' },
                { 
                  title: '持仓市值', 
                  key: 'value',
                  render: (_: any, record: Holding) => `¥${(record.currentPrice * record.amount / 10000).toFixed(2)}万`
                },
                { 
                  title: '占比', 
                  key: 'percentage',
                  render: (_: any, record: Holding) => {
                    const percentage = stats?.totalValue 
                      ? (record.currentPrice * record.amount / stats.totalValue * 100).toFixed(2)
                      : 0;
                    return `${percentage}%`;
                  }
                },
                {
                  title: '收益率',
                  key: 'return',
                  render: (_: any, record: Holding) => {
                    const rate = ((record.currentPrice - record.purchasePrice) / record.purchasePrice) * 100;
                    return (
                      <span style={{ color: rate >= 0 ? '#00b42a' : '#f53f3f' }}>
                        {rate >= 0 ? '+' : ''}{rate.toFixed(2)}%
                      </span>
                    );
                  },
                },
              ]}
              data={holdings}
              rowKey="id"
              loading={loading}
              pagination={false}
            />
          </Card>
        </>
      )}
    </div>
  );
}
