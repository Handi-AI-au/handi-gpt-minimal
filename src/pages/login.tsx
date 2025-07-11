import { useState, useEffect } from 'react'
import { Button, Form, Input, message, Checkbox, Divider } from 'antd'
import { 
  MailOutlined, 
  LockOutlined,
  GoogleOutlined
} from '@ant-design/icons'
import { useRouter } from 'next/router'
import Link from 'next/link'
import HeaderBar from '@/components/HeaderBar'
import FooterBar from '@/components/FooterBar'
import styles from './auth.module.less'

export default function LoginPage() {
  const router = useRouter()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const handleLogin = async (values: any) => {
    setLoading(true)
    try {
      console.log('Login attempt:', values)
      // Here you would typically call your authentication API
      message.success('Login successful! Redirecting...')
      
      // For now, redirect to chat page
      setTimeout(() => {
        router.push('/chat')
      }, 1500)
      
    } catch (error) {
      message.error('Invalid email or password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    message.info('Google login will be available soon!')
  }

  const handleForgotPassword = () => {
    message.info('Password reset will be available soon!')
  }

  return (
    <div className={styles.authContainer}>
      <HeaderBar />
      
      <main className={styles.authMain}>
        <div className={styles.authCard}>
          <div className={styles.authHeader}>
            <h1>Welcome Back</h1>
            <p>Sign in to your Handi account to continue</p>
          </div>

          <Form
            form={form}
            onFinish={handleLogin}
            layout="vertical"
            className={styles.authForm}
            initialValues={{ remember: true }}
          >
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
                { required: true, message: 'Please enter your password' }
              ]}
            >
              <Input.Password 
                prefix={<LockOutlined />}
                placeholder="Enter your password"
                size="large"
              />
            </Form.Item>

            <Form.Item>
              <div className={styles.loginOptions}>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Remember me</Checkbox>
                </Form.Item>
                <Button 
                  type="link" 
                  className={styles.forgotPassword}
                  onClick={handleForgotPassword}
                >
                  Forgot password?
                </Button>
              </div>
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
                Sign In
              </Button>
            </Form.Item>
          </Form>

          <Divider>or</Divider>

          <Button 
            icon={<GoogleOutlined />}
            size="large" 
            block
            className={styles.googleButton}
            onClick={handleGoogleLogin}
          >
            Continue with Google
          </Button>

          <div className={styles.authFooter}>
            <p>
              Don&apos;t have an account?{' '}
              <Link href="/signup">
                <a>Create one here</a>
              </Link>
            </p>
          </div>
        </div>
      </main>
      
      <FooterBar />
    </div>
  )
} 