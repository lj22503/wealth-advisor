import { Card } from '@arco-design/web-react';

export default function ReportPage() {
  return (
    <Card title="报告中心">
      <div style={{ textAlign: 'center', padding: '60px 0', color: '#86909c' }}>
        <p style={{ fontSize: 16, marginBottom: 8 }}>报告中心功能开发中</p>
        <p style={{ fontSize: 14 }}>
          该功能将提供：
          <br />
          • 季度报告生成
          <br />
          • 年度报告生成
          <br />
          • 持仓诊断报告
          <br />
          • 调仓建议报告
          <br />
          • PDF/Excel导出
        </p>
      </div>
    </Card>
  );
}
