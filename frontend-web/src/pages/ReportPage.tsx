import { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Tag, Modal, Message, Typography } from '@arco-design/web-react';
import { IconPlus, IconDownload, IconEye, IconDelete } from '@arco-design/web-react/icon';
import { clientService } from '@/services/client';
import type { Report, Client } from '@/types';

const { Title } = Typography;

export default function ReportPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewReport, setPreviewReport] = useState<Report | null>(null);

  useEffect(() => {
    loadClients();
    loadReports();
  }, []);

  async function loadClients() {
    try {
      const data = await clientService.getClients();
      setClients(data);
    } catch (error) {
      console.error('Failed to load clients:', error);
    }
  }

  async function loadReports() {
    setLoading(true);
    try {
      // TODO: 调用报告 API
      // const data = await reportService.getReports();
      // setReports(data);
      
      // 模拟数据
      setReports([
        {
          id: 'report_001',
          clientId: 'client_001',
          type: '季度报告',
          title: '2026 年 Q1 季度报告 - 张三',
          status: 'generated',
          generatedAt: new Date(),
          content: {
            summary: '本季度整体表现良好',
            performance: {
              totalReturn: 5.2,
              annualizedReturn: 8.5,
              benchmarkComparison: {
                benchmark: '沪深 300',
                excessReturn: 2.1,
              },
            },
            diagnosis: {
              clientId: 'client_001',
              overallRisk: '中等',
              diversificationScore: 75,
              concentrationRisk: false,
              assetAllocation: [],
              suggestions: ['建议增加债券配置'],
            },
            recommendations: [],
            charts: [],
          },
        },
      ]);
    } catch (error) {
      Message.error('加载报告失败');
    } finally {
      setLoading(false);
    }
  }

  function handleGenerateReport() {
    Modal.confirm({
      title: '生成报告',
      content: (
        <div>
          <p>请选择报告类型：</p>
          <Space direction="vertical" style={{ marginTop: 16 }}>
            <Button long>季度报告</Button>
            <Button long>年度报告</Button>
            <Button long>持仓诊断报告</Button>
            <Button long>调仓建议报告</Button>
          </Space>
        </div>
      ),
      onOk: () => {
        Message.success('报告生成中，请稍后查看');
      },
    });
  }

  function handlePreview(report: Report) {
    setPreviewReport(report);
    setPreviewVisible(true);
  }

  function handleDownload(report: Report) {
    // TODO: 实现报告下载
    Message.info('报告下载功能开发中');
  }

  function handleDelete(report: Report) {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除报告"${report.title}"吗？`,
      onOk: () => {
        setReports(reports.filter(r => r.id !== report.id));
        Message.success('删除成功');
      },
    });
  }

  const columns = [
    {
      title: '报告名称',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '报告类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const colorMap: Record<string, string> = {
          '季度报告': 'blue',
          '年度报告': 'green',
          '持仓诊断': 'orange',
          '调仓建议': 'red',
        };
        return <Tag color={colorMap[type] || 'gray'}>{type}</Tag>;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap: Record<string, string> = {
          'draft': '草稿',
          'generated': '已生成',
          'sent': '已发送',
          'archived': '已归档',
        };
        return <Tag>{statusMap[status] || status}</Tag>;
      },
    },
    {
      title: '生成时间',
      dataIndex: 'generatedAt',
      key: 'generatedAt',
      render: (date: Date) => new Date(date).toLocaleDateString(),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Report) => (
        <Space>
          <Button type="text" icon={<IconEye />} onClick={() => handlePreview(record)}>
            预览
          </Button>
          <Button type="text" icon={<IconDownload />} onClick={() => handleDownload(record)}>
            下载
          </Button>
          <Button type="text" status="danger" icon={<IconDelete />} onClick={() => handleDelete(record)}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card
        title="报告中心"
        extra={
          <Button type="primary" icon={<IconPlus />} onClick={handleGenerateReport}>
            生成报告
          </Button>
        }
      >
        <Table
          columns={columns}
          data={reports}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10, showTotal: true }}
        />
      </Card>

      {/* 报告预览弹窗 */}
      <Modal
        visible={previewVisible}
        title={previewReport?.title || '报告预览'}
        onCancel={() => setPreviewVisible(false)}
        footer={
          <Space>
            <Button onClick={() => setPreviewVisible(false)}>关闭</Button>
            <Button type="primary" icon={<IconDownload />}>下载 PDF</Button>
          </Space>
        }
        width={800}
      >
        {previewReport && (
          <div style={{ padding: '20px 0' }}>
            <Title heading={4}>{previewReport.title}</Title>
            
            <Card style={{ marginBottom: 16 }}>
              <Typography.Text strong>报告摘要：</Typography.Text>
              <p style={{ marginTop: 8 }}>{previewReport.content.summary}</p>
            </Card>

            <Card style={{ marginBottom: 16 }}>
              <Typography.Text strong>业绩表现：</Typography.Text>
              <div style={{ marginTop: 16 }}>
                <p>总收益：{previewReport.content.performance.totalReturn.toFixed(2)}%</p>
                <p>年化收益：{previewReport.content.performance.annualizedReturn.toFixed(2)}%</p>
                <p>
                  超额收益：{previewReport.content.performance.benchmarkComparison.excessReturn.toFixed(2)}% 
                  （基准：{previewReport.content.performance.benchmarkComparison.benchmark}）
                </p>
              </div>
            </Card>

            <Card>
              <Typography.Text strong>诊断建议：</Typography.Text>
              <ul style={{ marginTop: 8 }}>
                {previewReport.content.diagnosis.suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </Card>
          </div>
        )}
      </Modal>
    </div>
  );
}
