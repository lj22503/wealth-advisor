import { useState } from 'react';
import { Modal, Form, Input, InputNumber, DatePicker, Button, Message, Select } from '@arco-design/web-react';
import { holdingService } from '@/services/holding';
import type { Holding, HoldingInput } from '@/types';
import dayjs from 'dayjs';

interface HoldingFormModalProps {
  visible: boolean;
  clientId: string;
  holding?: Holding | null;
  onOk: () => void;
  onCancel: () => void;
}

export default function HoldingFormModal({ 
  visible, 
  clientId, 
  holding, 
  onOk, 
  onCancel 
}: HoldingFormModalProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // 重置表单
  useState(() => {
    if (visible && holding) {
      form.setFieldsValue({
        ...holding,
        purchaseDate: dayjs(holding.purchaseDate),
      });
    } else if (visible) {
      form.resetFields();
      form.setFieldsValue({ clientId });
    }
  });

  async function handleSubmit() {
    try {
      await form.validate();
      const values = form.getFieldsValue();
      
      const input: HoldingInput = {
        clientId,
        fundCode: values.fundCode,
        fundName: values.fundName,
        amount: values.amount,
        purchasePrice: values.purchasePrice,
        purchaseDate: values.purchaseDate?.format('YYYY-MM-DD'),
      };
      
      setLoading(true);
      
      if (holding) {
        // 更新
        await holdingService.updateHolding(holding.id, input);
        Message.success('更新成功');
      } else {
        // 新增
        await holdingService.addHolding(input);
        Message.success('添加成功');
      }
      
      onOk();
    } catch (error) {
      console.error('表单提交失败:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      visible={visible}
      title={holding ? '编辑持仓' : '添加持仓'}
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
          label="基金代码"
          field="fundCode"
          rules={[
            { required: true, message: '请输入基金代码' },
            { pattern: /^\d{6}$/, message: '基金代码为 6 位数字' }
          ]}
        >
          <Input placeholder="请输入 6 位基金代码" maxLength={6} />
        </Form.Item>

        <Form.Item
          label="基金名称"
          field="fundName"
          rules={[{ required: true, message: '请输入基金名称' }]}
        >
          <Input placeholder="请输入基金名称" />
        </Form.Item>

        <Form.Item
          label="持有份额"
          field="amount"
          rules={[
            { required: true, message: '请输入持有份额' },
            { type: 'number', min: 0, message: '份额必须大于 0' }
          ]}
        >
          <InputNumber
            placeholder="请输入持有份额"
            min={0}
            precision={2}
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item
          label="买入价格"
          field="purchasePrice"
          rules={[
            { required: true, message: '请输入买入价格' },
            { type: 'number', min: 0, message: '价格必须大于 0' }
          ]}
        >
          <InputNumber
            placeholder="请输入买入价格"
            min={0}
            precision={4}
            style={{ width: '100%' }}
            prefix="¥"
          />
        </Form.Item>

        <Form.Item
          label="买入日期"
          field="purchaseDate"
          rules={[{ required: true, message: '请选择买入日期' }]}
          initialValue={dayjs()}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
