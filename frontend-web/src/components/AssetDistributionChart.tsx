/**
 * 资产分布图表组件
 */

import { Pie } from '@ant-design/charts';
import { Card } from '@arco-design/web-react';
import { useAppStore } from '@/store/appStore';

interface AssetDistributionChartProps {
  height?: number;
}

export default function AssetDistributionChart({ height = 300 }: AssetDistributionChartProps) {
  const { clients } = useAppStore();

  // 按风险等级统计资产
  const assetByRisk = clients.reduce((acc, client) => {
    const level = client.riskLevel;
    acc[level] = (acc[level] || 0) + client.totalAssets;
    return acc;
  }, {} as Record<string, number>);

  // 转换为图表数据格式
  const data = Object.entries(assetByRisk).map(([type, value]) => ({
    type,
    value: value / 10000, // 转换为万元
  }));

  const config = {
    appendPadding: 10,
    data,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    height,
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
    interactions: [
      {
        type: 'element-active',
      },
    ],
    color: ['#00b42a', '#165dff', '#f77234', '#f53f3f', '#86909c'],
    statistic: {
      title: {
        content: '资产分布',
        style: { fontSize: 14, fontWeight: 500 },
      },
      content: {
        content: () => {
          const total = data.reduce((sum, item) => sum + item.value, 0);
          return `总额：${total.toFixed(0)}万`;
        },
        style: { fontSize: 16, fontWeight: 600 },
      },
    },
  };

  return (
    <Card title="客户资产分布">
      {data.length > 0 ? (
        <Pie {...config} />
      ) : (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#86909c' }}>
          暂无数据
        </div>
      )}
    </Card>
  );
}
