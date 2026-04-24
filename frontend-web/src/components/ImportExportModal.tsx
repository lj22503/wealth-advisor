import { useState } from 'react';
import { Modal, Form, Input, InputNumber, Select, DatePicker, Table, Button, Space, Message, Upload, Progress } from '@arco-design/web-react';
import { IconUpload, IconDownload } from '@arco-design/web-react/icon';
import { clientService } from '@/services/client';
import { holdingService } from '@/services/holding';
import type { Client, Holding } from '@/types';
import dayjs from 'dayjs';

interface ImportExportModalProps {
  visible: boolean;
  type: 'client' | 'holding';
  clientId?: string;
  onOk: () => void;
  onCancel: () => void;
}

export default function ImportExportModal({ 
  visible, 
  type, 
  clientId,
  onOk, 
  onCancel 
}: ImportExportModalProps) {
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importProgress, setImportProgress] = useState(0);
  const [importResult, setImportResult] = useState<any>(null);

  function handleDownloadTemplate() {
    // 创建示例 CSV 数据
    let csvContent = '';
    let filename = '';
    
    if (type === 'client') {
      filename = '客户数据模板.csv';
      csvContent = '客户姓名，手机号，邮箱，风险等级，总资产\n张三，13800138000,zhangsan@example.com,C3,500000\n李四，13900139000,lisi@example.com,C2,300000';
    } else {
      filename = '持仓数据模板.csv';
      csvContent = '基金代码，基金名称，持有份额，买入价格，买入日期\n000001,华夏成长混合，10000,1.5000,2024-01-15\n000002,易方达蓝筹精选，5000,2.3000,2024-02-20';
    }
    
    // 下载文件
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    
    Message.success('模板已下载');
  }

  function handleFileUpload(file: File) {
    setImportFile(file);
    return false; // 阻止默认上传
  }

  async function handleImport() {
    if (!importFile) {
      Message.warning('请先选择文件');
      return;
    }

    setImportProgress(10);
    
    try {
      // 模拟导入进度
      const progressInterval = setInterval(() => {
        setImportProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // TODO: 调用实际导入 API
      // const service = type === 'client' ? clientService : holdingService;
      // const result = await service.importData(importFile);
      
      // 模拟导入
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      clearInterval(progressInterval);
      setImportProgress(100);
      
      setImportResult({
        success: 10,
        failed: 0,
        errors: [],
      });
      
      Message.success('导入成功！');
      
      setTimeout(() => {
        onOk();
      }, 1000);
    } catch (error) {
      Message.error('导入失败');
      console.error(error);
    }
  }

  function handleExport() {
    // TODO: 调用导出 API
    Message.info('导出功能开发中');
  }

  return (
    <Modal
      visible={visible}
      title={type === 'client' ? '客户导入/导出' : '持仓导入/导出'}
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        {/* 下载模板 */}
        <Card title="1. 下载模板">
          <Button icon={<IconDownload />} onClick={handleDownloadTemplate}>
            下载{type === 'client' ? '客户' : '持仓'}模板
          </Button>
        </Card>

        {/* 上传文件 */}
        <Card title="2. 上传文件">
          <Upload
            drag
            multiple={false}
            accept=".xlsx,.xls,.csv"
            beforeUpload={handleFileUpload}
            onRemove={() => setImportFile(null)}
          >
            <div style={{ padding: '20px 0' }}>
              <IconUpload style={{ fontSize: 48, color: '#86909c' }} />
              <div style={{ marginTop: 16, color: '#86909c' }}>
                点击或拖拽文件到此处上传
              </div>
              <div style={{ fontSize: 12, color: '#86909c', marginTop: 8 }}>
                支持格式：.xlsx, .xls, .csv
              </div>
            </div>
          </Upload>
          
          {importFile && (
            <div style={{ marginTop: 16 }}>
              <p>已选择：{importFile.name}</p>
              {importProgress > 0 && (
                <Progress percent={importProgress} style={{ marginTop: 8 }} />
              )}
            </div>
          )}
        </Card>

        {/* 导入结果 */}
        {importResult && (
          <Card title="导入结果">
            <p>成功：{importResult.success} 条</p>
            <p>失败：{importResult.failed} 条</p>
            {importResult.errors.length > 0 && (
              <div style={{ marginTop: 8, color: '#f53f3f' }}>
                <p>错误详情：</p>
                <ul>
                  {importResult.errors.map((err: any, i: number) => (
                    <li key={i}>{err.error}</li>
                  ))}
                </ul>
              </div>
            )}
          </Card>
        )}

        {/* 操作按钮 */}
        <Space style={{ justifyContent: 'flex-end', marginTop: 16 }}>
          <Button onClick={onCancel}>取消</Button>
          <Button type="primary" onClick={handleImport} disabled={!importFile || importProgress > 0}>
            开始导入
          </Button>
          <Button onClick={handleExport}>
            导出全部
          </Button>
        </Space>
      </Space>
    </Modal>
  );
}
