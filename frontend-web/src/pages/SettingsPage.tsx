import { Card, Descriptions, Button, Message } from '@arco-design/web-react';
import { useAppStore } from '@/store/appStore';

export default function SettingsPage() {
  const { currentUser } = useAppStore();

  function handleClearCache() {
    // TODO: 清除缓存逻辑
    Message.success('缓存已清除');
  }

  return (
    <div>
      <Card title="个人设置" style={{ marginBottom: 16 }}>
        <Descriptions
          column={2}
          data={[
            { label: '用户 ID', value: currentUser?.userId || '-' },
            { label: '姓名', value: currentUser?.name || '-' },
            { label: '邮箱', value: currentUser?.email || '-' },
            { label: '部门', value: currentUser?.department || '-' },
          ]}
        />
      </Card>

      <Card title="系统设置">
        <Button onClick={handleClearCache}>清除缓存</Button>
      </Card>

      <Card title="关于" style={{ marginTop: 16 }}>
        <Descriptions
          data={[
            { label: '系统名称', value: '财富顾问 Wealth Advisor' },
            { label: '版本', value: 'v2.0.0 (Web App)' },
            { label: '技术栈', value: 'React 18 + Vite 5 + Arco Design' },
          ]}
        />
      </Card>
    </div>
  );
}
