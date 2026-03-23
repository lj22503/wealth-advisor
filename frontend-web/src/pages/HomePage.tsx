import { useEffect, useState } from 'react';
import { Card, Statistic, Button, Table, Space, Typography } from '@arco-design/web-react';
import Grid from '@arco-design/web-react/es/Grid';
const { Row, Col } = Grid;
import { IconUser, IconFile, IconDashboard, IconPlus, IconRefresh } from '@arco-design/web-react/icon';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/appStore';
import { clientService } from '@/services/client';
import AssetDistributionChart from '@/components/AssetDistributionChart';
import type { Client } from '@/types';

const { Text } = Typography;

export default function HomePage() {
  const navigate = useNavigate();
  const { clients, setClients, loading, setLoading } = useAppStore();
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    loadClients();
  }, []);

  async function loadClients() {
    setLoading(true);
    try {
      const data = await clientService.getClients();
      setClients(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load clients:', error);
    } finally {
      setLoading(false);
    }
  }

  // 统计数据
  const totalClients = clients.length;
  const totalAssets = clients.reduce((sum, c) => sum + c.totalAssets, 0);
  const avgAssets = totalClients > 0 ? totalAssets / totalClients : 0;

  // 最近客户表格
  const recentClients = clients.slice(0, 5);
  const columns = [
    {
      title: '客户姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '风险等级',
      dataIndex: 'riskLevel',
      key: 'riskLevel',
      render: (level: string) => {
        const colorMap: Record<string, string> = {
          C1: '#00b42a',
          C2: '#165dff',
          C3: '#f77234',
          C4: '#f53f3f',
          C5: '#86909c',
        };
        return <span style={{ color: colorMap[level] || '#86909c' }}>{level}</span>;
      },
    },
    {
      title: '总资产',
      dataIndex: 'totalAssets',
      key: 'totalAssets',
      render: (value: number) => `¥${(value / 10000).toFixed(1)}万`,
    },
  ];

  return (
    <div>
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="客户总数"
              value={totalClients}
              prefix={<IconUser style={{ color: '#165dff' }} />}
              valueStyle={{ fontSize: 28 }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="管理资产总额"
              value={(totalAssets / 10000).toFixed(0)}
              suffix="万"
              prefix={<IconFile style={{ color: '#00b42a' }} />}
              valueStyle={{ fontSize: 28 }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="户均资产"
              value={(avgAssets / 10000).toFixed(1)}
              suffix="万"
              prefix={<IconDashboard style={{ color: '#f77234' }} />}
              valueStyle={{ fontSize: 28 }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <Statistic
                title={
                  <span>
                    最后更新
                    <Button
                      type="text"
                      icon={<IconRefresh />}
                      onClick={loadClients}
                      loading={loading}
                      style={{ marginLeft: 8 }}
                      size="small"
                    />
                  </span>
                }
                value={
                  <Text style={{ fontSize: 14 }}>
                    {lastUpdated.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                }
              />
            </div>
          </Card>
        </Col>
      </Row>

      {/* 快捷操作 */}
      <Card title="快捷操作" style={{ marginBottom: 24 }}>
        <Space size="large">
          <Button
            type="primary"
            icon={<IconPlus />}
            onClick={() => navigate('/clients?action=create')}
          >
            新增客户
          </Button>
          <Button onClick={() => navigate('/clients')}>客户管理</Button>
          <Button onClick={() => navigate('/diagnosis')}>持仓诊断</Button>
          <Button onClick={() => navigate('/reports')}>报告中心</Button>
        </Space>
      </Card>

      {/* 资产分布图表 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={12}>
          <AssetDistributionChart height={300} />
        </Col>
        <Col span={12}>
          {/* 最近客户 */}
          <Card
            title="最近客户"
            extra={
              <Button type="text" onClick={() => navigate('/clients')}>
                查看全部 →
              </Button>
            }
          >
            <Table
              columns={columns}
              data={recentClients}
              rowKey="id"
              loading={loading}
              pagination={false}
              onRow={(record: Client) => ({
                onClick: () => navigate(`/clients/${record.id}`),
                style: { cursor: 'pointer' },
              })}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
