import { Layout } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import HeaderBar from '@/components/HeaderBar'
import FooterBar from '@/components/FooterBar'

export default function HowItWorks() {
  return (
    <Layout>
      <HeaderBar />
      <Content style={{ minHeight: 'calc(100vh - 120px)', padding: '2rem', background: '#f8f9fa' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>How It Works</h1>
          <p style={{ fontSize: '1.25rem', color: '#666' }}>
            Coming soon! This page will explain how Handi connects you with the right solution for your home repair needs.
          </p>
        </div>
      </Content>
      <FooterBar />
    </Layout>
  )
} 