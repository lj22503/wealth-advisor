import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout as ArcoLayout, Menu, Avatar, Dropdown, Badge } from '@arco-design/web-react';
import {
  IconHome,
  IconUser,
  IconFile,
  IconSettings,
  IconDashboard,
  IconMenuFold,
  IconMenuUnfold,
  IconPoweroff,
} from '@arco-design/web-react/icon';
import { useAppStore } from '@/store/appStore';

const { Header, Sider, Content } = ArcoLayout;
const { MenuItem } = Menu;

interface LayoutProps {
  children?: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, setCurrentUser } = useAppStore();

  // 菜单项配置
  const menuItems = [
    { key: '/', icon: <IconHome />, title: '首页' },
    { key: '/clients', icon: <IconUser />, title: '客户管理' },
    { key: '/diagnosis', icon: <IconDashboard />, title: '持仓诊断' },
    { key: '/reports', icon: <IconFile />, title: '报告中心' },
    { key: '/settings', icon: <IconSettings />, title: '设置' },
  ];

  // 用户菜单
  const userMenuItems = [
    {
      key: 'profile',
      title: '个人中心',
      onClick: () => navigate('/settings'),
    },
    {
      key: 'logout',
      title: '退出登录',
      icon: <IconPoweroff />,
      onClick: () => {
        setCurrentUser(null);
        // TODO: 调用登出 API
      },
    },
  ];

  return (
    <ArcoLayout style={{ minHeight: '100vh' }}>
      {/* 侧边栏 */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        trigger={collapsed ? <IconMenuUnfold /> : <IconMenuFold />}
        style={{
          background: '#001529',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 100,
        }}
      >
        {/* Logo */}
        <div
          style={{
            height: 48,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#002140',
            color: '#fff',
            fontSize: collapsed ? 20 : 18,
            fontWeight: 'bold',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
          }}
        >
          {collapsed ? '🔗' : '🔗 财富顾问'}
        </div>

        {/* 导航菜单 */}
        <Menu
          style={{ background: '#001529' }}
          selectedKeys={[location.pathname]}
          onClickMenuItem={(key) => navigate(key)}
        >
          {menuItems.map((item) => (
            <MenuItem key={item.key} style={{ color: '#fff' }}>
              <span style={{ color: '#fff', display: 'flex', alignItems: 'center', gap: 8 }}>
                {item.icon}
                {!collapsed && item.title}
              </span>
            </MenuItem>
          ))}
        </Menu>
      </Sider>

      {/* 主体内容 */}
      <ArcoLayout
        style={{
          marginLeft: collapsed ? 48 : 200,
          transition: 'margin-left 0.2s',
        }}
      >
        {/* 顶部栏 */}
        <Header
          style={{
            background: '#fff',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
            position: 'sticky',
            top: 0,
            zIndex: 99,
          }}
        >
          {/* 面包屑/标题 */}
          <div style={{ fontSize: 16, fontWeight: 500 }}>
            {menuItems.find((item) => item.key === location.pathname)?.title || '财富顾问'}
          </div>

          {/* 用户信息 */}
          <Dropdown menu={{ items: userMenuItems }} position="br" trigger="click">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                cursor: 'pointer',
                padding: '4px 8px',
                borderRadius: 4,
                ':hover': { background: '#f5f5f5' },
              }}
            >
              <Badge count={0}>
                <Avatar size={32} style={{ backgroundColor: '#165dff' }}>
                  {currentUser?.name?.[0] || 'U'}
                </Avatar>
              </Badge>
              <span style={{ fontSize: 14 }}>{currentUser?.name || '用户'}</span>
            </div>
          </Dropdown>
        </Header>

        {/* 页面内容 */}
        <Content
          style={{
            padding: 24,
            margin: 24,
            background: '#fff',
            borderRadius: 4,
            minHeight: 'calc(100vh - 112px)',
          }}
        >
          <Outlet />
        </Content>
      </ArcoLayout>
    </ArcoLayout>
  );
}
