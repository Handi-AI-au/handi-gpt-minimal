import { useState } from 'react'
import { Button, Menu, Dropdown } from 'antd'
import { MenuOutlined } from '@ant-design/icons'
import { useRouter } from 'next/router'
import Image from 'next/image'
import styles from './index.module.less'

const HeaderBar = () => {
  const router = useRouter()
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false)

  const navigationItems = [
    { key: 'home', label: 'Home', path: '/' },
    { key: 'chat', label: 'Try Fix It Yourself', path: '/chat-original' },
    { key: 'job-board', label: 'Job Board', path: '/job-board' },
    { key: 'find-tradies', label: 'Find Tradies', path: '/find-tradies' },
  ]

  const handleNavigation = (path: string) => {
    router.push(path)
    setMobileMenuVisible(false)
  }

  const mobileMenu = (
    <Menu>
      {navigationItems.map(item => (
        <Menu.Item key={item.key} onClick={() => handleNavigation(item.path)}>
          {item.label}
        </Menu.Item>
      ))}
    </Menu>
  )

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        {/* Logo Section */}
        <div className={styles.logo} onClick={() => handleNavigation('/')}>
          <Image src="/logo-handi.png" alt="Handi" width={40} height={40} />
          <span className={styles.logoText}>Handi</span>
        </div>

        {/* Desktop Navigation */}
        <nav className={styles.desktopNav}>
          {navigationItems.map(item => (
            <Button
              key={item.key}
              type="text"
              className={`${styles.navButton} ${router.pathname === item.path ? styles.active : ''}`}
              onClick={() => handleNavigation(item.path)}
            >
              {item.label}
            </Button>
          ))}
        </nav>

        {/* Mobile Menu */}
        <div className={styles.mobileMenu}>
          <Dropdown 
            overlay={mobileMenu} 
            trigger={['click']}
            visible={mobileMenuVisible}
            onVisibleChange={setMobileMenuVisible}
          >
            <Button type="text" icon={<MenuOutlined />} />
          </Dropdown>
        </div>
      </div>
    </header>
  )
}

export default HeaderBar
