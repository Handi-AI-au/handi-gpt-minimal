import { useState, useEffect } from 'react'
import { Button, Form, Input, Modal, message } from 'antd'
import { 
  ArrowRightOutlined, 
  ToolOutlined, 
  SearchOutlined, 
  TeamOutlined, 
  RobotOutlined,
  CheckCircleOutlined,
  SafetyOutlined,
  ClockCircleOutlined,
  StarOutlined
} from '@ant-design/icons'
import { useRouter } from 'next/router'
import Image from 'next/image'
import HeaderBar from '@/components/HeaderBar'
import FooterBar from '@/components/FooterBar'
import styles from './index.module.less'

const { TextArea } = Input

export default function HomePage() {
  const router = useRouter()
  const [form] = Form.useForm()
  const [signupModalVisible, setSignupModalVisible] = useState(false)

  const handleStartClick = () => {
    router.push('/chat')
  }

  const handleSignupInterest = async (values: any) => {
    try {
      // Here you would typically send to your backend
      console.log('Interest signup:', values)
      message.success('Thank you for your interest! We\'ll notify you when we launch.')
      setSignupModalVisible(false)
      form.resetFields()
    } catch (error) {
      message.error('Something went wrong. Please try again.')
    }
  }

  const tradieServices = [
    {
      key: 'plumbing',
      title: 'Plumbing',
      description: 'Leaky taps, blocked drains, toilet repairs, and more',
      icon: '🔧'
    },
    {
      key: 'electrical',
      title: 'Electrical',
      description: 'Outlet issues, lighting problems, electrical safety checks',
      icon: '⚡'
    },
    {
      key: 'carpentry',
      title: 'Carpentry',
      description: 'Cabinet repairs, door fixes, furniture assembly',
      icon: '🔨'
    },
    {
      key: 'painting',
      title: 'Painting',
      description: 'Touch-ups, wall repairs, color matching',
      icon: '🎨'
    },
    {
      key: 'landscaping',
      title: 'Landscaping',
      description: 'Garden maintenance, lawn care, irrigation issues',
      icon: '🌱'
    },
    {
      key: 'cleaning',
      title: 'Cleaning',
      description: 'Deep cleaning, maintenance cleaning, specialized cleaning',
      icon: '🧹'
    },
    {
      key: 'roofing',
      title: 'Roofing',
      description: 'Roof repairs, gutter cleaning, leak fixes',
      icon: '🏠'
    },
    {
      key: 'flooring',
      title: 'Flooring',
      description: 'Floor repairs, tile replacement, carpet issues',
      icon: '🪵'
    },
    {
      key: 'hvac',
      title: 'HVAC',
      description: 'Heating, cooling, air conditioning repairs',
      icon: '❄️'
    },
    {
      key: 'moving',
      title: 'Moving',
      description: 'Furniture moving, packing, relocation services',
      icon: '📦'
    },
    {
      key: 'appliance-repair',
      title: 'Appliance Repair',
      description: 'Washing machine, dishwasher, oven repairs',
      icon: '🔧'
    },
    {
      key: 'general-labor',
      title: 'General Labor',
      description: 'Handyman services, general repairs, maintenance',
      icon: '👷'
    }
  ]

  const howItWorksSteps = [
    {
      step: 1,
      title: 'Describe Your Problem',
      description: 'Tell our AI about the issue you\'re facing. Upload photos for better diagnosis.',
      icon: <ToolOutlined />
    },
    {
      step: 2,
      title: 'Try DIY Solutions',
      description: 'Follow our guided troubleshooting steps. Many issues can be fixed easily!',
      icon: <CheckCircleOutlined />
    },
    {
      step: 3,
      title: 'Get Professional Help',
      description: 'If DIY doesn\'t work, we\'ll create a diagnostic report and connect you with qualified tradies.',
      icon: <TeamOutlined />
    }
  ]

  return (
    <div className={styles.homeContainer}>
      <HeaderBar />
      
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>
              Fix It Yourself or Find the Right Tradie
            </h1>
            <p className={styles.heroSubtitle}>
              Handi uses AI to help you troubleshoot home problems yourself, and connects you 
              with qualified tradespeople when you need professional help. Save money, save time.
            </p>
            <div className={styles.heroButtons}>
              <Button 
                type="primary" 
                size="large" 
                className={styles.primaryButton}
                onClick={handleStartClick}
              >
                Try Fix It Yourself <RobotOutlined />
              </Button>
              <Button 
                size="large" 
                className={styles.secondaryButton}
                onClick={() => setSignupModalVisible(true)}
              >
                Get Early Access
              </Button>
            </div>
            <div className={styles.heroStats}>
              <div className={styles.stat}>
                <span className={styles.statNumber}>85%</span>
                <span className={styles.statLabel}>Issues Resolved Without Callouts</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>$150</span>
                <span className={styles.statLabel}>Average Savings per Issue</span>
              </div>
            </div>
          </div>
          <div className={styles.heroImage}>
            <Image 
              src="/logo-handi.png" 
              alt="Handi AI Assistant" 
              width={400} 
              height={400}
              className={styles.heroLogo}
            />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className={styles.services}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Services We Cover</h2>
          <p className={styles.sectionSubtitle}>
            From simple fixes to complex repairs, Handi helps with all your home maintenance needs
          </p>
          
          <div className={styles.servicesGrid}>
            {tradieServices.map(service => (
              <div key={service.key} className={styles.serviceCard}>
                <div className={styles.serviceIcon}>
                  {service.icon}
                </div>
                <h3 className={styles.serviceTitle}>{service.title}</h3>
                <p className={styles.serviceDescription}>{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className={styles.howItWorks}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>How Handi Works</h2>
          <div className={styles.stepsContainer}>
            {howItWorksSteps.map(step => (
              <div key={step.step} className={styles.step}>
                <div className={styles.stepIcon}>
                  <div className={styles.stepNumber}>{step.step}</div>
                  {step.icon}
                </div>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDescription}>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className={styles.benefits}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Why Choose Handi?</h2>
          <div className={styles.benefitsGrid}>
            <div className={styles.benefit}>
              <ClockCircleOutlined className={styles.benefitIcon} />
              <h3>Save Time</h3>
              <p>Get instant help 24/7. No waiting for callback appointments or quotes.</p>
            </div>
            <div className={styles.benefit}>
              <StarOutlined className={styles.benefitIcon} />
              <h3>Save Money</h3>
              <p>Avoid unnecessary callout fees by fixing simple issues yourself.</p>
            </div>
            <div className={styles.benefit}>
              <SafetyOutlined className={styles.benefitIcon} />
              <h3>Verified Tradies</h3>
              <p>When you need professional help, we connect you with licensed, insured tradies.</p>
            </div>
            <div className={styles.benefit}>
              <RobotOutlined className={styles.benefitIcon} />
              <h3>AI-Powered</h3>
              <p>Smart diagnostics that learn from thousands of repair scenarios.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Interest Registration Section */}
      <section className={styles.cta}>
        <div className={styles.container}>
          <h2 className={styles.ctaTitle}>Ready to Experience Handi?</h2>
          <p className={styles.ctaSubtitle}>
            Join our early access program and be the first to try our AI-powered home repair assistant
          </p>
          <div className={styles.ctaButtons}>
            <Button 
              type="primary" 
              size="large" 
              className={styles.primaryButton}
              onClick={handleStartClick}
            >
              Try the Demo <ArrowRightOutlined />
            </Button>
            <Button 
              size="large" 
              className={styles.secondaryButton}
              onClick={() => setSignupModalVisible(true)}
            >
              Get Early Access
            </Button>
          </div>
        </div>
      </section>

      <FooterBar />

      {/* Interest Signup Modal */}
      <Modal
        title="Join Our Early Access Program"
        visible={signupModalVisible}
        onCancel={() => setSignupModalVisible(false)}
        footer={null}
        className={styles.signupModal}
      >
        <Form
          form={form}
          onFinish={handleSignupInterest}
          layout="vertical"
        >
          <Form.Item
            name="email"
            label="Email Address"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input placeholder="your.email@example.com" />
          </Form.Item>
          
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please enter your name' }]}
          >
            <Input placeholder="Your name" />
          </Form.Item>
          
          <Form.Item
            name="interests"
            label="What home repair challenges do you face? (Optional)"
          >
            <TextArea 
              rows={3} 
              placeholder="Tell us about the types of repairs you typically need help with..."
            />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              Join Early Access
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
