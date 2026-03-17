import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Descriptions, Tabs, Table, Button, Space, Message } from '@arco-design/web-react';
import { IconArrowLeft, IconEdit } from '@arco-design/web-react/icon';
import { useNavigate } from 'react-router-dom';
import { clientService } from '@/services/client';
import { holdingService } from '@/services/holding';
import type { Client, Holding } from '@/types';

const { TabPane } = Tabs;

export default function ClientDetailPage() {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const [client, setClient] = useState<Client | null>(null);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (clientId) {
      loadClientDetail();
    }
  }, [clientId]);

  async function loadClientDetail() {
    if (!clientId) return;
    
    setLoading(true);
    try {
      const [clientData, holdingsData] = await Promise.all([
        clientService.getClient(clientId),
        holdingService.getClientHoldings(clientId),
      ]);
      
      setClient(clientData);
      setHoldings(holdingsData);
    } catch (error) {
      Message.error('加载客户详情失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

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

      {/* 客户信息 */}
      <Card title="客户信息" style={{ marginBottom: 16 }}>
        <Descriptions
          column={3}
          data={[
            { label: '客户姓名', value: client.name },
            { label: '手机号', value: client.phone || '-' },
            { label: '邮箱', value: client.email || '-' },
            { label: '风险等级', value: client.riskLevel },
            { label: '总资产', value: `¥${(client.totalAssets / 10000).toFixed(1)}万` },
            { label: '更新时间', value: new Date(client.updatedAt).toLocaleDateString() },
          ]}
        />
      </Card>

      {/* Tab 页签 */}
      <Tabs defaultActiveTab="holdings">
        <TabPane key="holdings" title="持仓明细">
          <Card>
            <Space style={{ marginBottom: 16 }}>
              <Button type="primary">导入持仓</Button>
              <Button>导出 Excel</Button>
            </Space>
            <Table
              columns={holdingColumns}
              data={holdings}
              rowKey="id"
              pagination={{ pageSize: 10, showTotal: true }}
            />
          </Card>
        </TabPane>
        
        <TabPane key="diagnosis" title="持仓诊断">
          <Card>
            <p>持仓诊断功能开发中...</p>
          </Card>
        </TabPane>
        
        <TabPane key="reports" title="历史报告">
          <Card>
            <p>历史报告功能开发中...</p>
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
}
