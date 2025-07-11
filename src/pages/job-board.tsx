import { useState, useEffect } from 'react'
import { Button, Form, Input, message, Card } from 'antd'
import { 
  ClockCircleOutlined, 
  ToolOutlined, 
  SearchOutlined, 
  TeamOutlined,
  CheckCircleOutlined,
  SafetyOutlined
} from '@ant-design/icons'
import HeaderBar from '@/components/HeaderBar'
import FooterBar from '@/components/FooterBar'
import styles from './coming-soon.module.less'

const { TextArea } = Input

export default function JobBoardPage() {
  const [form] = Form.useForm()

  const handleSignup = async (values: any) => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
      if (!backendUrl) {
        throw new Error('Backend API URL is not configured');
      }

      const response = await fetch(`${backendUrl}/early-access/job-board`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          full_name: values.fullName,
          email: values.email,
          business_name: values.businessName,
          specialties: values.specialties
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('API Error Response:', errorData);
        throw new Error(`Failed to submit signup: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Job board early access signup successful:', result);
      
      message.success('Thank you! We\'ll notify you when the Job Board launches.')
      form.resetFields()
    } catch (error) {
      console.error('Error submitting job board signup:', error);
      message.error(`Failed to submit signup: ${error instanceof Error ? error.message : 'Something went wrong. Please try again.'}`)
    }
  }

  const features = [
    {
      icon: <SearchOutlined />,
      title: 'Browse Jobs',
      description: 'View detailed diagnostic reports from AI assessments'
    },
    {
      icon: <ToolOutlined />,
      title: 'Smart Matching',
      description: 'Get matched with jobs that fit your skills and location'
    },
    {
      icon: <TeamOutlined />,
      title: 'Direct Communication',
      description: 'Connect directly with homeowners through our platform'
    },
    {
      icon: <SafetyOutlined />,
      title: 'Verified Customers',
      description: 'All customers are verified through our AI assessment process'
    }
  ]

  return (
    <div className={styles.comingSoonContainer}>
      <HeaderBar />
      
      <main className={styles.main}>
        <div className={styles.hero}>
          <div className={styles.heroContent}>
            <div className={styles.comingSoonBadge}>
              <ClockCircleOutlined /> Coming Soon
            </div>
            <h1 className={styles.title}>Job Board for Tradies</h1>
            <p className={styles.subtitle}>
              Access pre-diagnosed repair jobs from our AI system. Get detailed problem descriptions, 
              photos, and customer information before you quote.
            </p>
            
            <div className={styles.benefitsGrid}>
              <div className={styles.benefit}>
                <CheckCircleOutlined className={styles.benefitIcon} />
                <span>Pre-diagnosed issues save you time</span>
              </div>
              <div className={styles.benefit}>
                <CheckCircleOutlined className={styles.benefitIcon} />
                <span>Detailed photos and descriptions</span>
              </div>
              <div className={styles.benefit}>
                <CheckCircleOutlined className={styles.benefitIcon} />
                <span>Direct customer communication</span>
              </div>
              <div className={styles.benefit}>
                <CheckCircleOutlined className={styles.benefitIcon} />
                <span>Competitive pricing platform</span>
              </div>
            </div>
          </div>
        </div>

        <section className={styles.features}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>What You'll Get</h2>
            <div className={styles.featuresGrid}>
              {features.map((feature, index) => (
                <Card key={index} className={styles.featureCard}>
                  <div className={styles.featureIcon}>
                    {feature.icon}
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.signup}>
          <div className={styles.container}>
            <div className={styles.signupContent}>
              <h2>Be First to Access the Job Board</h2>
              <p>Join our early access program and get priority access when we launch</p>
              
              <Form
                form={form}
                onFinish={handleSignup}
                layout="vertical"
                className={styles.signupForm}
              >
                <div className={styles.formRow}>
                  <Form.Item
                    name="fullName"
                    label="Full Name"
                    rules={[{ required: true, message: 'Please enter your name' }]}
                  >
                    <Input placeholder="Your full name" size="large" />
                  </Form.Item>
                  
                  <Form.Item
                    name="email"
                    label="Email Address"
                    rules={[
                      { required: true, message: 'Please enter your email' },
                      { type: 'email', message: 'Please enter a valid email' }
                    ]}
                  >
                    <Input placeholder="your.email@example.com" size="large" />
                  </Form.Item>
                </div>
                
                <Form.Item
                  name="businessName"
                  label="Business Name"
                  rules={[{ required: true, message: 'Please enter your business name' }]}
                >
                  <Input placeholder="Your business or trading name" size="large" />
                </Form.Item>
                
                <Form.Item
                  name="specialties"
                  label="Your Specialties"
                  rules={[{ required: true, message: 'Please describe your specialties' }]}
                >
                  <TextArea 
                    rows={3} 
                    placeholder="e.g., Plumbing, Electrical, Carpentry..."
                    size="large"
                  />
                </Form.Item>
                
                <Form.Item>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    size="large" 
                    block
                    className={styles.submitButton}
                  >
                    Join Early Access Program
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </section>
      </main>
      
      <FooterBar />
    </div>
  )
} 