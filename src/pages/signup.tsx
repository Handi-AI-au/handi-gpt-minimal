import { useState, useEffect } from 'react'
import { Button, Form, Input, message, Checkbox, Divider } from 'antd'
import { 
  UserOutlined, 
  MailOutlined, 
  LockOutlined,
  GoogleOutlined
} from '@ant-design/icons'
import { useRouter } from 'next/router'
import Link from 'next/link'
import HeaderBar from '@/components/HeaderBar'
import FooterBar from '@/components/FooterBar'
import styles from './auth.module.less'

export default function SignupPage() {
  const router = useRouter()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const handleSignup = async (values: any) => {
    setLoading(true)
    try {
      console.log('Signup attempt:', values)
      // Here you would typically call your authentication API
      message.success('Account created successfully! Please check your email to verify your account.')
      
      // For now, redirect to login page
      setTimeout(() => {
        router.push('/login')
      }, 2000)
      
    } catch (error) {
      message.error('Failed to create account. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignup = () => {
    message.info('Google signup will be available soon!')
  }

  return (
    <div className={styles.authContainer}>
      <HeaderBar />
      
      <main className={styles.authMain}>
        <div className={styles.authCard}>
          <div className={styles.authHeader}>
            <h1>Create Your Handi Account</h1>
            <p>Join thousands of homeowners getting smarter repair solutions</p>
          </div>

          <Form
            form={form}
            onFinish={handleSignup}
            layout="vertical"
            className={styles.authForm}
          >
            <Form.Item
              name="name"
              label="Full Name"
              rules={[
                { required: true, message: 'Please enter your full name' },
                { min: 2, message: 'Name must be at least 2 characters' }
              ]}
            >
              <Input 
                prefix={<UserOutlined />}
                placeholder="Enter your full name"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email Address"
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Please enter a valid email address' }
              ]}
            >
              <Input 
                prefix={<MailOutlined />}
                placeholder="Enter your email address"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: 'Please enter your password' },
                { min: 8, message: 'Password must be at least 8 characters' }
              ]}
            >
              <Input.Password 
                prefix={<LockOutlined />}
                placeholder="Create a strong password"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Confirm Password"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Please confirm your password' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve()
                    }
                    return Promise.reject(new Error('Passwords do not match'))
                  },
                }),
              ]}
            >
              <Input.Password 
                prefix={<LockOutlined />}
                placeholder="Confirm your password"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="terms"
              valuePropName="checked"
              rules={[
                { 
                  validator: (_, value) =>
                    value ? Promise.resolve() : Promise.reject(new Error('Please accept the terms and conditions'))
                }
              ]}
            >
              <Checkbox>
                I agree to the <Link href="/terms"><a>Terms of Service</a></Link> and{' '}
                <Link href="/privacy"><a>Privacy Policy</a></Link>
              </Checkbox>
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                size="large" 
                block
                loading={loading}
                className={styles.authButton}
              >
                Create Account
              </Button>
            </Form.Item>
          </Form>

          <Divider>or</Divider>

          <Button 
            icon={<GoogleOutlined />}
            size="large" 
            block
            className={styles.googleButton}
            onClick={handleGoogleSignup}
          >
            Continue with Google
          </Button>

          <div className={styles.authFooter}>
            <p>
              Already have an account?{' '}
              <Link href="/login">
                <a>Sign in here</a>
              </Link>
            </p>
          </div>
        </div>
      </main>
      
      <FooterBar />
    </div>
  )
} 