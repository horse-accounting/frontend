import { useState } from 'react'
import { Layout, Menu, Avatar, Dropdown, Button, Typography } from 'antd'
import {
  HomeOutlined,
  UserOutlined,
  LogoutOutlined,
  KeyOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UnorderedListOutlined,
  TrophyOutlined,
} from '@ant-design/icons'
import { useNavigate, useLocation, Outlet } from 'react-router-dom'
import { useMe, useLogout } from '../api'

const { Header, Sider, Content } = Layout
const { Text } = Typography

export function MainLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { data: user } = useMe()
  const logout = useLogout()

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        navigate('/login')
      },
    })
  }

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: 'Нүүр',
    },
    {
      key: '/aduu',
      icon: <UnorderedListOutlined />,
      label: 'Адуунууд',
    },
    {
      key: '/uulder',
      icon: <UnorderedListOutlined />,
      label: 'Үүлдэрүүд',
    },
    {
      key: '/amjilt',
      icon: <TrophyOutlined />,
      label: 'Амжилтууд',
    },
  ]

  const userMenuItems = [
    {
      key: 'change-password',
      icon: <KeyOutlined />,
      label: 'Нууц үг солих',
      onClick: () => navigate('/change-password'),
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Гарах',
      danger: true,
      onClick: handleLogout,
    },
  ]

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        theme="dark"
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div className="layout-logo">
          <span className="layout-logo-icon">🐴</span>
          {!collapsed && <span className="layout-logo-text">Удамшил</span>}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>

      <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'margin-left 0.2s' }}>
        <Header className="layout-header">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="layout-trigger"
          />

          <div className="layout-header-right">
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <div className="layout-user">
                <Avatar icon={<UserOutlined />} />
                <Text className="layout-username">{user?.name}</Text>
              </div>
            </Dropdown>
          </div>
        </Header>

        <Content className="layout-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
