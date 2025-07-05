import { useState, useEffect } from 'react'
import { Button, Input, message } from 'antd'
import { logEvent } from 'firebase/analytics'
import { Layout } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import Image from 'next/image'
import { useAnalytics } from '@/hooks/useAnalytics'
import { useRouter } from 'next/router'

import FooterBar from '@/components/FooterBar'
import HeaderBar from '@/components/HeaderBar'

import styles from './index.module.less'

const { TextArea } = Input

export default function Chat() {
  const [userInput, setUserInput] = useState('')
  const [hasStartedChat, setHasStartedChat] = useState(false)
  const analytics = useAnalytics()
  const router = useRouter()
  
  useEffect(() => {
    if (analytics) {
      logEvent(analytics, 'chat_page_view')
    }
  }, [analytics])

  const quickActions = [
    "My sink is leaking from the faucet",
    "My electrical outlet isn't working", 
    "My air conditioner is making strange noises",
    "My toilet keeps running after flushing",
    "My dishwasher isn't draining properly"
  ]

  const handleQuickAction = (action: string) => {
    setUserInput(action)
  }

  const handleSend = () => {
    if (!userInput.trim()) {
      message.warning('Please describe your issue first')
      return
    }
    
    if (analytics) {
      logEvent(analytics, 'chat_message_sent', {
        message_type: 'user_input'
      })
    }
    
    // For now, redirect to the original chat with the input
    router.push(`/chat-original?message=${encodeURIComponent(userInput)}`)
  }

  const handleGenerateReport = () => {
    if (!userInput.trim()) {
      message.warning('Please describe your issue first')
      return
    }
    
    if (analytics) {
      logEvent(analytics, 'generate_report_clicked')
    }
    
    // Start the chat flow with report generation
    router.push(`/chat-original?message=${encodeURIComponent(userInput)}&action=report`)
  }

  const handleSkipToJob = () => {
    if (analytics) {
      logEvent(analytics, 'skip_to_job_clicked')
    }
    
    router.push('/job-board')
  }

  const handleCancel = () => {
    setUserInput('')
  }

  return (
    <Layout className={styles.layout}>
      <HeaderBar />
      <Content className={styles.chatMain}>
        <div className={styles.chatContainer}>
          {/* Header Section */}
          <div className={styles.chatHeader}>
            <div className={styles.logoSection}>
              <Image 
                src="/logo-handi.png" 
                alt="Handi" 
                width={40} 
                height={40}
                className={styles.chatLogo}
              />
              <span className={styles.brandName}>Handi</span>
            </div>
            <h1 className={styles.chatTitle}>AI Self-Help</h1>
            <p className={styles.chatSubtitle}>
              Try our AI assistant to troubleshoot your problem before calling a professional
            </p>
          </div>

          {/* Chat Interface */}
          <div className={styles.chatInterface}>
            {/* Assistant Welcome Message */}
            <div className={styles.assistantMessage}>
              <div className={styles.messageContent}>
                Hi there! I'm your Handi Assistant. I can help you troubleshoot 
                issues before calling a professional. What problem are you 
                experiencing today?
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className={styles.quickActions}>
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  className={styles.quickActionBtn}
                  onClick={() => handleQuickAction(action)}
                >
                  {action}
                </Button>
              ))}
            </div>

            {/* Text Input */}
            <div className={styles.inputSection}>
              <TextArea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Describe your issue..."
                rows={4}
                className={styles.issueInput}
              />
              <Button 
                type="primary" 
                size="large"
                onClick={handleSend}
                className={styles.sendBtn}
              >
                Send
              </Button>
            </div>

            {/* Action Buttons */}
            <div className={styles.actionButtons}>
              <Button 
                size="large"
                onClick={handleCancel}
                className={styles.cancelBtn}
              >
                Cancel
              </Button>
              <Button 
                type="primary"
                size="large"
                onClick={handleGenerateReport}
                className={styles.reportBtn}
              >
                Generate Report & Continue
              </Button>
              <Button 
                size="large"
                onClick={handleSkipToJob}
                className={styles.skipBtn}
              >
                Skip to Post Job
              </Button>
            </div>

            {/* Info Note */}
            <div className={styles.infoNote}>
              <div className={styles.infoIcon}>ℹ</div>
              <span>
                This AI self-help tool is powered by <strong>Handi GPT</strong>. It can help diagnose your issue 
                and may help you fix it without needing a professional.
              </span>
            </div>

            {/* Support Contact */}
            <div className={styles.supportContact}>
              Need help? <a href="/contact" className={styles.supportLink}>Contact our support team</a>
            </div>
          </div>
        </div>
      </Content>
      <FooterBar />
    </Layout>
  )
} 