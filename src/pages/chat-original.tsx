import { useState, useEffect } from 'react'
import ChatGPT from '@/components/ChatGPT'
import { Layout } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import Image from 'next/image'
import { useRouter } from 'next/router'

import FooterBar from '@/components/FooterBar'
import HeaderBar from '@/components/HeaderBar'

import styles from './index.module.less'

export default function ChatOriginal() {
  const [hasMessages, setHasMessages] = useState(false)
  const router = useRouter()
  
  // Handle initial message from URL params
  useEffect(() => {
    const { message, action } = router.query
    if (message && typeof message === 'string') {
      // Auto-start chat with the provided message
      setTimeout(() => {
        const sendBar = document.querySelector('.send-bar input') as HTMLInputElement
        const sendButton = document.querySelector('.send-bar button') as HTMLButtonElement
        
        if (sendBar && sendButton) {
          sendBar.value = decodeURIComponent(message)
          sendBar.dispatchEvent(new Event('input', { bubbles: true }))
          
          // Trigger send after a brief delay
          setTimeout(() => {
            sendButton.click()
          }, 500)
        }
      }, 1000)
    }
  }, [router.query])
  
  // Monitor message changes to determine whether to display the welcome interface
  useEffect(() => {
    const handleStorage = () => {
      // Check if there is message history
      const messagesCount = document.querySelectorAll('.chat-wrapper .message-item').length
      setHasMessages(messagesCount > 0)
    }
    
    // Initial detection
    setTimeout(handleStorage, 500)
    
    // Add event listener to detect DOM changes
    const observer = new MutationObserver(handleStorage)
    observer.observe(document.body, { childList: true, subtree: true })
    
    return () => observer.disconnect()
  }, [])
  
  return (
    <Layout hasSider className={styles.layout}>
      <Layout>
        <HeaderBar />
        <Content className={`${styles.main} ${!hasMessages ? styles.centeredMain : ''}`}>
          {!hasMessages && (
            <div className={styles.welcomeContainer}>
              <div className={styles.logoContainer}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo-handi.png" alt="Handi AI Logo" className={styles.welcomeLogo} />
                <h1 className={styles.welcomeTitle}>Handi AI</h1>
                <p className={styles.welcomeSubtitle}>Home Repair Expert, Helping You Troubleshoot Problems and Find Workers in One Stop</p>
              </div>
            </div>
          )}
          <ChatGPT fetchPath="/api/chat-unified" />
        </Content>
        <FooterBar />
      </Layout>
    </Layout>
  )
} 