import { useState, useEffect } from 'react'
import { Button, Form, Input, message, Card, Select } from 'antd'
import { 
  ClockCircleOutlined, 
  SearchOutlined, 
  TeamOutlined,
  SafetyOutlined,
  StarOutlined,
  CheckCircleOutlined,
  SafetyCertificateOutlined
} from '@ant-design/icons'
import HeaderBar from '@/components/HeaderBar'
import FooterBar from '@/components/FooterBar'
import styles from './coming-soon.module.less'

const { Option } = Select

export default function FindTradiesPage() {
  const [form] = Form.useForm()

  const handleSignup = async (values: any) => {
    try {
      console.log('Find tradies early access signup:', values)
      message.success('Thank you! We\'ll notify you when Find Tradies launches.')
      form.resetFields()
    } catch (error) {
      message.error('Something went wrong. Please try again.')
    }
  }

  const features = [
    {
      icon: <SearchOutlined />,
      title: 'Verified Tradies',
      description: 'All tradies are licensed, insured, and background checked'
    },
    {
      icon: <StarOutlined />,
      title: 'Customer Reviews',
      description: 'Real reviews from verified customers on our platform'
    },
    {
      icon: <SafetyCertificateOutlined />,
      title: 'Guaranteed Work',
      description: 'Work guarantee and dispute resolution through our platform'
    },
    {
      icon: <TeamOutlined />,
      title: 'Instant Quotes',
      description: 'Get competitive quotes from multiple tradies quickly'
    }
  ]

  const serviceTypes = [
    'Plumbing',
    'Electrical',
    'Carpentry',
    'Painting',
    'Landscaping',
    'Cleaning',
    'Roofing',
    'Flooring',
    'HVAC',
    'Moving',
    'Appliance Repair',
    'General Labor',
    'Other'
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
            <h1 className={styles.title}>Find Trusted Tradies</h1>
            <p className={styles.subtitle}>
              Skip the AI troubleshooting and go straight to finding qualified, 
              verified tradespeople in your area. Get instant quotes and book with confidence.
            </p>
            
            <div className={styles.benefitsGrid}>
              <div className={styles.benefit}>
                <CheckCircleOutlined className={styles.benefitIcon} />
                <span>Licensed & insured tradies only</span>
              </div>
              <div className={styles.benefit}>
                <CheckCircleOutlined className={styles.benefitIcon} />
                <span>Real customer reviews & ratings</span>
              </div>
              <div className={styles.benefit}>
                <CheckCircleOutlined className={styles.benefitIcon} />
                <span>Instant competitive quotes</span>
              </div>
              <div className={styles.benefit}>
                <CheckCircleOutlined className={styles.benefitIcon} />
                <span>Work guarantee & protection</span>
              </div>
            </div>
          </div>
        </div>

        <section className={styles.features}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Why Choose Our Tradies</h2>
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
              <h2>Get Early Access to Verified Tradies</h2>
              <p>Be the first to book trusted tradies when our platform launches</p>
              
              <Form
                form={form}
                onFinish={handleSignup}
                layout="vertical"
                className={styles.signupForm}
              >
                <div className={styles.formRow}>
                  <Form.Item
                    name="name"
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
                
                <div className={styles.formRow}>
                  <Form.Item
                    name="suburb"
                    label="Suburb"
                    rules={[{ required: true, message: 'Please enter your suburb' }]}
                  >
                    <Input placeholder="Your suburb" size="large" />
                  </Form.Item>
                  
                  <Form.Item
                    name="service_type"
                    label="Service Needed"
                    rules={[{ required: true, message: 'Please select a service type' }]}
                  >
                    <Select placeholder="Select service type" size="large">
                      {serviceTypes.map(service => (
                        <Option key={service} value={service}>{service}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
                
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