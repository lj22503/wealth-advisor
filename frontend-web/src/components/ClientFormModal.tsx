import { useState } from 'react';
import { Modal, Form, Input, Select, InputNumber, Button, Message, Upload } from '@arco-design/web-react';
import { IconUpload } from '@arco-design/web-react/icon';
import { clientService } from '@/services/client';
import type { Client, ClientInput, RiskLevel } from '@/types';

interface ClientFormModalProps {
  visible: boolean;
  client?: Client | null;
  onOk: () => void;
  onCancel: () => void;
}

export default function ClientFormModal({ visible, client, onOk, onCancel }: ClientFormModalProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // 重置表单
  useState(() => {
    if (visible && client) {
      form.setFieldsValue(client);
    } else if (visible) {
      form.resetFields();
    }
  });

  async function handleSubmit() {
    try {
      await form.validate();
      const values = form.getFieldsValue() as ClientInput;
      
      setLoading(true);
      
      if (client) {
        // 更新
        await clientService.updateClient(client.id, values);
        Message.success('更新成功');
      } else {
        // 新增
        await clientService.createClient(values);
        Message.success('创建成功');
      }
      
      onOk();
    } catch (error) {
      console.error('表单提交失败:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleFileUpload(file: File) {
    // TODO: 实现 Excel 文件解析
    Message.info('Excel 导入功能开发中');
    return false; // 阻止默认上传行为
  }

  return (
    <Modal
      visible={visible}
      title={client ? '编辑客户' : '新增客户'}
      onOk={handleSubmit}
      onCancel={onCancel}
      confirmLoading={loading}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        autoComplete="off"
        style={{ marginTop: 16 }}
      >
        <Form.Item
          label="客户姓名"
          field="name"
          rules={[{ required: true, message: '请输入客户姓名' }]}
        >
          <Input placeholder="请输入客户姓名" />
        </Form.Item>

        <Form.Item
          label="手机号"
          field="phone"
          rules={[
            { 
              pattern: /^1[3-9]\d{9}$/, 
              message: '请输入正确的手机号',
              type: 'warning'
            }
          ]}
        >
          <Input placeholder="请输入手机号" maxLength={11} />
        </Form.Item>

        <Form.Item
          label="邮箱"
          field="email"
          rules={[
            { 
              type: 'email', 
              message: '请输入正确的邮箱',
              type: 'warning'
            }
          ]}
        >
          <Input placeholder="请输入邮箱" />
        </Form.Item>

        <Form.Item
          label="风险等级"
          field="riskLevel"
          rules={[{ required: true, message: '请选择风险等级' }]}
          initialValue="C3"
        >
          <Select placeholder="请选择风险等级">
            <Select.Option value="C1">C1 保守型</Select.Option>
            <Select.Option value="C2">C2 稳健型</Select.Option>
            <Select.Option value="C3">C3 平衡型</Select.Option>
            <Select.Option value="C4">C4 成长型</Select.Option>
            <Select.Option value="C5">C5 进取型</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="总资产（元）"
          field="totalAssets"
          rules={[{ required: true, message: '请输入总资产' }]}
        >
          <InputNumber
            placeholder="请输入总资产"
            min={0}
            precision={2}
            style={{ width: '100%' }}
            formatter={(value) => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value) => Number(value?.replace(/¥\s?|(,*)/g, ''))}
          />
        </Form.Item>

        <Form.Item label="Excel 导入" extra="支持批量导入客户数据">
          <Upload
            action="/api/clients/import"
            multiple={false}
            accept=".xlsx,.xls,.csv"
            beforeUpload={handleFileUpload}
          >
            <Button icon={<IconUpload />}>选择文件</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
}
