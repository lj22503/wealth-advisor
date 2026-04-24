/**
 * 资产分布图表组件（ECharts 版）
 */

import { Card } from '@arco-design/web-react';
import { useAppStore } from '@/store/appStore';
import Chart, { type ECOption } from './Chart';

interface AssetDistributionChartProps {
  height?: number;
}

const COLORS = ['#00b42a', '#165dff', '#f77234', '#f53f3f', '#86909c'];

export default function AssetDistributionChart({ height = 300 }: AssetDistributionChartProps) {
  const { clients } = useAppStore();

  // 按风险等级统计资产
  const assetByRisk = clients.reduce((acc, client) => {
    const level = client.riskLevel;
    acc[level] = (acc[level] || 0) + client.totalAssets;
    return acc;
  }, {} as Record<string, number>);

  // 转换为图表数据格式
  const data = Object.entries(assetByRisk).map(([name, value]) => ({
    name,
    value: Math.round(value / 10000), // 转换为万元
  }));

  const total = data.reduce((sum, item) => sum + item.value, 0);

  const option: ECOption = {
    color: COLORS,
    tooltip: {
      trigger: 'item' as const,
      formatter: '{b}: {c}万 ({d}%)',
    },
    graphic: total > 0 ? [
      {
        type: 'text' as const,
        left: 'center',
        top: '42%',
        style: {
          text: '资产分布',
          fontSize: 14,
          fontWeight: 500,
          fill: '#4e5969',
          textAlign: 'center' as const,
        },
      },
      {
        type: 'text' as const,
        left: 'center',
        top: '52%',
        style: {
          text: `总额：${total}万`,
          fontSize: 16,
          fontWeight: 600,
          fill: '#1d2129',
          textAlign: 'center' as const,
        },
      },
    ] : [],
    series: [
      {
        type: 'pie' as const,
        radius: ['45%', '70%'],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 4,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          formatter: '{b} {d}%',
        },
        data,
      },
    ],
  };

  return (
    <Card title="客户资产分布">
      {data.length > 0 ? (
        <Chart option={option} height={`${height}px`} />
      ) : (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#86909c' }}>
          暂无数据
        </div>
      )}
    </Card>
  );
}
