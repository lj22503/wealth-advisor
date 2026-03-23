import { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Input, Select, Modal, Message, Typography } from '@arco-design/web-react';
import { IconPlus, IconSearch, IconEdit, IconDelete, IconImport, IconExport } from '@arco-design/web-react/icon';

const { Text } = Typography;
import { useNavigate } from 'react-router-dom';
import { clientService } from '@/services/client';
import type { Client, ClientFilter } from '@/types';
import ClientFormModal from '@/components/ClientFormModal';
import ImportExportModal from '@/components/ImportExportModal';

const { Text } = Typography;

export default function ClientListPage() {
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  
  // 弹窗控制
  const [showClientModal, setShowClientModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);

  useEffect(() => {
    loadClients();
  }, []);

  async function loadClients() {
    setLoading(true);
    try {
      const filter: ClientFilter = {};
      if (searchText) filter.name = searchText;
      if (riskFilter) filter.riskLevel = riskFilter as any;
      
      const data = await clientService.getClients(filter);
      setClients(data);
    } catch (error) {
      Message.error('加载客户列表失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function handleDelete(client: Client) {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除客户"${client.name}"吗？`,
      onOk: async () => {
        try {
          await clientService.deleteClient(client.id);
          Message.success('删除成功');
          loadClients();
        } catch (error) {
          Message.error('删除失败');
        }
      },
    });
  }

  function handleBatchDelete() {
    if (selectedRowKeys.length === 0) {
      Message.warning('请选择要删除的客户');
      return;
    }

    Modal.confirm({
      title: '批量删除确认',
      content: `确定要删除选中的 ${selectedRowKeys.length} 个客户吗？此操作不可恢复。`,
      onOk: async () => {
        try {
          await Promise.all(
            selectedRowKeys.map((id) => clientService.deleteClient(id as string))
          );
          Message.success(`成功删除 ${selectedRowKeys.length} 个客户`);
          setSelectedRowKeys([]);
          loadClients();
        } catch (error) {
          Message.error('批量删除失败');
        }
      },
    });
  }

  function handleEditClient(client: Client) {
    setEditingClient(client);
    setShowClientModal(true);
  }

  function handleCreateClient() {
    setEditingClient(null);
    setShowClientModal(true);
  }

  // 表格列定义
  const columns = [
    {
      title: '客户姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '风险等级',
      dataIndex: 'riskLevel',
      key: 'riskLevel',
    },
    {
      title: '总资产',
      dataIndex: 'totalAssets',
      key: 'totalAssets',
      render: (value: number) => `¥${(value / 10000).toFixed(1)}万`,
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Client) => (
        <Space>
          <Button
            type="text"
            icon={<IconEdit />}
            onClick={() => handleEditClient(record)}
          >
            编辑
          </Button>
          <Button
            type="text"
            onClick={() => navigate(`/clients/${record.id}`)}
          >
            详情
          </Button>
          <Button
            type="text"
            status="danger"
            icon={<IconDelete />}
            onClick={() => handleDelete(record)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card>
      {/* 筛选栏 */}
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="搜索客户姓名"
          prefix={<IconSearch />}
          value={searchText}
          onChange={(value) => setSearchText(value)}
          onPressEnter={loadClients}
          style={{ width: 200 }}
          allowClear
        />
        <Select
          placeholder="风险等级"
          value={riskFilter}
          onChange={(value) => setRiskFilter(value)}
          style={{ width: 150 }}
          allowClear
        >
          <Select.Option value="C1">C1 保守型</Select.Option>
          <Select.Option value="C2">C2 稳健型</Select.Option>
          <Select.Option value="C3">C3 平衡型</Select.Option>
          <Select.Option value="C4">C4 成长型</Select.Option>
          <Select.Option value="C5">C5 进取型</Select.Option>
        </Select>
        <Button type="primary" onClick={loadClients}>
          搜索
        </Button>
        <Button
          icon={<IconImport />}
          onClick={() => setShowImportModal(true)}
        >
          导入
        </Button>
        <Button
          icon={<IconExport />}
          onClick={() => {}}
        >
          导出
        </Button>
        <Button
          type="primary"
          icon={<IconPlus />}
          onClick={handleCreateClient}
        >
          新增客户
        </Button>
        <Button
          danger
          icon={<IconDelete />}
          onClick={handleBatchDelete}
          disabled={selectedRowKeys.length === 0}
        >
          批量删除
        </Button>
        {selectedRowKeys.length > 0 && (
          <Text type="secondary">已选择 {selectedRowKeys.length} 个客户</Text>
        )}
      </Space>

      {/* 客户表格 */}
      <Table
        columns={columns}
        data={clients}
        rowKey="id"
        loading={loading}
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        pagination={{
          pageSize: 10,
          showTotal: true,
        }}
      />
    </Card>

    {/* 新增/编辑客户弹窗 */}
    <ClientFormModal
      visible={showClientModal}
      client={editingClient}
      onOk={() => {
        setShowClientModal(false);
        setEditingClient(null);
        loadClients();
      }}
      onCancel={() => {
        setShowClientModal(false);
        setEditingClient(null);
      }}
    />

    {/* 导入导出弹窗 */}
    <ImportExportModal
      visible={showImportModal}
      type="client"
      onOk={() => {
        setShowImportModal(false);
        loadClients();
      }}
      onCancel={() => setShowImportModal(false)}
    />
  );
}
