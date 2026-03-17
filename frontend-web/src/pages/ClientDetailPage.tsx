import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Row, Col, Statistic, Table, Button, Space, Tag, Progress, Message, Descriptions } from '@arco-design/web-react';
import { IconArrowLeft, IconPlus, IconEdit, IconDelete, IconDownload } from '@arco-design/web-react/icon';
import { useNavigate } from 'react-router-dom';
import { clientService } from '@/services/client';
import { holdingService } from '@/services/holding';
import Chart from '@/components/Chart';
import HoldingFormModal from '@/components/HoldingFormModal';
import type { Client, Holding, HoldingStats, FundDistribution } from '@/types';

export default function ClientDetailPage() {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  
  const [client, setClient] = useState<Client | null>(null);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [stats, setStats] = useState<HoldingStats | null>(null);
  const [loading, setLoading] = useState(false);
  
  // 弹窗控制
  const [showHoldingModal, setShowHoldingModal] = useState(false);
  const [editingHolding, setEditingHolding] = useState<Holding | null>(null);

  useEffect(() => {
    if (clientId) {
      loadClientDetail();
    }
  }, [clientId]);

  async function loadClientDetail() {
    if (!clientId) return;
    
    setLoading(true);
    try {
      const [clientData, holdingsData, statsData] = await Promise.all([
        clientService.getClient(clientId),
        holdingService.getClientHoldings(clientId),
        holdingService.getHoldingStats(clientId),
      ]);
      
      setClient(clientData);
      setHoldings(holdingsData);
      setStats(statsData);
    } catch (error) {
      Message.error('加载客户详情失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function handleDeleteHolding(holding: Holding) {
    // TODO: 实现删除确认
    console.log('Delete holding:', holding);
  }

  function handleEditHolding(holding: Holding) {
    setEditingHolding(holding);
    setShowHoldingModal(true);
  }

  // 资产配置饼图
  const allocationOption = {
    title: { text: '资产配置分布', left: 'center' },
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: { orient: 'vertical', left: 'left' },
    series: [
      {
        type: 'pie',
        radius: '60%',
        data: stats ? Object.values(stats.fundDistribution).map((d: FundDistribution) => ({
          value: d.totalValue,
          name: d.fundName,
        })) : [],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  };

  // 收益分析柱状图
  const returnOption = {
    title: { text: '持仓收益分析', left: 'center' },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    xAxis: {
      type: 'category',
      data: holdings.map((h) => h.fundName),
      axisLabel: { rotate: 30 },
    },
    yAxis: { type: 'value', name: '收益率 (%)' },
    series: [
      {
        type: 'bar',
        data: holdings.map((h) => {
          const rate = ((h.currentPrice - h.purchasePrice) / h.purchasePrice) * 100;
          return {
            value: rate,
            itemStyle: {
              color: rate >= 0 ? '#00b42a' : '#f53f3f',
            },
          };
        }),
      },
    ],
  };

  if (!client) {
    return <div>客户不存在</div>;
  }

  const holdingColumns = [
    {
      title: '基金代码',
      dataIndex: 'fundCode',
      key: 'fundCode',
    },
    {
      title: '基金名称',
      dataIndex: 'fundName',
      key: 'fundName',
    },
    {
      title: '持有份额',
      dataIndex: 'amount',
      key: 'amount',
      render: (value: number) => value.toLocaleString(),
    },
    {
      title: '买入价格',
      dataIndex: 'purchasePrice',
      key: 'purchasePrice',
      render: (value: number) => `¥${value.toFixed(4)}`,
    },
    {
      title: '当前价格',
      dataIndex: 'currentPrice',
      key: 'currentPrice',
      render: (value: number) => `¥${value.toFixed(4)}`,
    },
    {
      title: '持仓市值',
      key: 'value',
      render: (_: any, record: Holding) => {
        const value = record.currentPrice * record.amount;
        return `¥${(value / 10000).toFixed(2)}万`;
      },
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
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Holding) => (
        <Space>
          <Button type="text" onClick={() => handleEditHolding(record)}>编辑</Button>
          <Button type="text" status="danger" onClick={() => handleDeleteHolding(record)}>删除</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* 返回按钮 */}
      <Button
        icon={<IconArrowLeft />}
        onClick={() => navigate('/clients')}
        style={{ marginBottom: 16 }}
      >
        返回列表
      </Button>

      {/* 客户信息卡片 */}
      <Card title="客户信息" style={{ marginBottom: 16 }}>
        <Descriptions
          column={3}
          data={[
            { label: '客户姓名', value: client.name },
            { label: '手机号', value: client.phone || '-' },
            { label: '邮箱', value: client.email || '-' },
            { 
              label: '风险等级', 
              value: (
                <Tag color={
                  client.riskLevel === 'C1' ? 'green' :
                  client.riskLevel === 'C2' ? 'blue' :
                  client.riskLevel === 'C3' ? 'orange' :
                  client.riskLevel === 'C4' ? 'red' : 'gray'
                }>
                  {client.riskLevel}
                </Tag>
              )
            },
            { label: '总资产', value: `¥${(client.totalAssets / 10000).toFixed(1)}万` },
            { label: '更新时间', value: new Date(client.updatedAt).toLocaleDateString() },
          ]}
        />
      </Card>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="持仓数量"
              value={stats?.totalHoldings || 0}
              valueStyle={{ fontSize: 24 }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="持仓总市值"
              value={`¥${(stats?.totalValue || 0) / 10000}`}
              suffix="万"
              valueStyle={{ fontSize: 24 }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总收益"
              value={`¥${(stats?.totalProfitLoss || 0) / 10000}`}
              suffix="万"
              valueStyle={{ 
                fontSize: 24, 
                color: (stats?.totalProfitLoss || 0) >= 0 ? '#00b42a' : '#f53f3f' 
              }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总收益率"
              value={stats?.totalProfitLossRate || 0}
              suffix="%"
              valueStyle={{ 
                fontSize: 24, 
                color: (stats?.totalProfitLossRate || 0) >= 0 ? '#00b42a' : '#f53f3f' 
              }}
            />
          </Card>
        </Col>
      </Row>

      {/* 图表分析 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={12}>
          <Card title="资产配置">
            <Chart option={allocationOption} height={300} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="收益分析">
            <Chart option={returnOption} height={300} />
          </Card>
        </Col>
      </Row>

      {/* 持仓明细 */}
      <Card
        title="持仓明细"
        extra={
          <Space>
            <Button icon={<IconDownload />}>导出 Excel</Button>
            <Button type="primary" icon={<IconPlus />} onClick={() => setShowHoldingModal(true)}>
              添加持仓
            </Button>
          </Space>
        }
      >
        <Table
          columns={holdingColumns}
          data={holdings}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10, showTotal: true }}
        />
      </Card>

      {/* 添加/编辑持仓弹窗 */}
      <HoldingFormModal
        visible={showHoldingModal}
        clientId={clientId}
        holding={editingHolding}
        onOk={() => {
          setShowHoldingModal(false);
          setEditingHolding(null);
          loadClientDetail();
        }}
        onCancel={() => {
          setShowHoldingModal(false);
          setEditingHolding(null);
        }}
      />
    </div>
  );
}
