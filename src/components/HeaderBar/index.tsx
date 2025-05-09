import React from 'react'

import { LinkedinOutlined } from '@ant-design/icons'
import { Layout, Space, Typography } from 'antd'

import styles from './index.module.less'

const { Link } = Typography

const { Header } = Layout

const HeaderBar = () => {
  return (
    <>
      <Header className={styles.header}>
        <div className={styles.logoBar}>
          <Link href="/">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="logo" src="/logo-handi.png" />
            <h1>Handi AI</h1>
          </Link>
        </div>
        <Space className={styles.right} size={0}>
          <span className={styles.right}>
            <Link
              className={styles.action}
              href="https://www.linkedin.com/company/handiaus/"
              target="_blank"
            >
              <LinkedinOutlined />
            </Link>
          </span>
        </Space>
      </Header>
      <div className={styles.vacancy} />
    </>
  )
}

export default HeaderBar
