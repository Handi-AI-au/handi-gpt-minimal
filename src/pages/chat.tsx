import { useState, useEffect } from 'react'
import ChatGPT from '@/components/ChatGPT'
import { Layout } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import Image from 'next/image'

import FooterBar from '@/components/FooterBar'
import HeaderBar from '@/components/HeaderBar'

import styles from './index.module.less'

export default function Chat() {
  const [hasMessages, setHasMessages] = useState(false);
  
  // Monitor message changes to determine whether to display the welcome interface
  useEffect(() => {
    const handleStorage = () => {
      // Check if there is message history
      const messagesCount = document.querySelectorAll('.chat-wrapper .message-item').length;
      setHasMessages(messagesCount > 0);
    };
    
    // Initial detection
    setTimeout(handleStorage, 500);
    
    // Add event listener to detect DOM changes
    const observer = new MutationObserver(handleStorage);
    observer.observe(document.body, { childList: true, subtree: true });
    
    return () => observer.disconnect();
  }, []);
  
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