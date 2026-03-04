import { useState, useEffect } from 'react'
import { Layout, Menu, Avatar, Dropdown, Button, Typography, Drawer, Tooltip } from 'antd'
import {
  HomeOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  TrophyOutlined,
  MenuOutlined,
  DatabaseOutlined,
  AppstoreOutlined,
  GroupOutlined,
  SunOutlined,
  MoonOutlined,
} from '@ant-design/icons'
import { useNavigate, useLocation, Outlet } from 'react-router-dom'
import { useMe, useLogout } from '../api'
import { useTheme } from '../contexts'

const { Header, Sider, Content } = Layout
const { Text } = Typography

const MOBILE_BREAKPOINT = 768

export function MainLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < MOBILE_BREAKPOINT)
  const navigate = useNavigate()
  const location = useLocation()
  const { data: user } = useMe()
  const logout = useLogout()
  const { themeMode, toggleTheme } = useTheme()

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
      if (window.innerWidth >= MOBILE_BREAKPOINT) {
        setMobileDrawerOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

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
      label: 'Нүүр хуудас',
    },
    {
      key: '/aduu',
      icon: <DatabaseOutlined />,
      label: 'Адуунууд',
    },
    {
      key: '/uulder',
      icon: <AppstoreOutlined />,
      label: 'Үүлдэрүүд',
    },
    {
      key: '/buleg',
      icon: <GroupOutlined />,
      label: 'Бүлэг',
    },
    {
      key: '/amjilt',
      icon: <TrophyOutlined />,
      label: 'Амжилтууд',
    },
  ]

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Профайл',
      onClick: () => navigate('/profile'),
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

  const handleMenuClick = (key: string) => {
    navigate(key)
    if (isMobile) {
      setMobileDrawerOpen(false)
    }
  }

  const sidebarContent = (
    <div className="sidebar-container">
      <div>
        <div className="layout-logo">
          <span className="layout-logo-icon">🐴</span>
          {(!collapsed || isMobile) && <span className="layout-logo-text">Удамшил</span>}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => handleMenuClick(key)}
          className="sidebar-menu"
        />
      </div>
    </div>
  )

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Desktop Sidebar */}
      {!isMobile && (
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
          {sidebarContent}
        </Sider>
      )}

      {/* Mobile Drawer */}
      <Drawer
        placement="left"
        onClose={() => setMobileDrawerOpen(false)}
        open={mobileDrawerOpen}
        styles={{
          wrapper: { width: 250 },
          body: { padding: 0, background: '#001529' },
          header: { display: 'none' },
        }}
      >
        {sidebarContent}
      </Drawer>

      <Layout
        style={{
          marginLeft: isMobile ? 0 : (collapsed ? 80 : 200),
          transition: 'margin-left 0.2s',
        }}
      >
        <Header className="layout-header">
          <Button
            type="text"
            icon={isMobile ? <MenuOutlined /> : (collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />)}
            onClick={() => isMobile ? setMobileDrawerOpen(true) : setCollapsed(!collapsed)}
            className="layout-trigger"
          />

          <div className="layout-header-right">
            <Tooltip title={themeMode === 'light' ? 'Харанхуй горим' : 'Гэрэлтэй горим'}>
              <Button
                type="text"
                icon={themeMode === 'light' ? <MoonOutlined /> : <SunOutlined />}
                onClick={toggleTheme}
                className="theme-toggle-btn"
              />
            </Tooltip>
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
