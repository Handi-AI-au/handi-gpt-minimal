import { useRouter } from 'next/router';
import {
  ToolOutlined,
  SearchOutlined,
  TeamOutlined,
  RobotOutlined,
  ArrowRightOutlined
} from '@ant-design/icons';

import styles from './landing.module.less';

export default function LandingPage() {
  const router = useRouter();

  const handleStartClick = () => {
    // 直接跳转到聊天页面，不再弹出表单
    router.push('/chat');
  };

  return (
    <div className={styles.landingContainer}>
      <header className={styles.header}>
        <div className={styles.logo}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-handi.png" alt="Handi AI Logo" />
          <h1>Handi</h1>
        </div>
      </header>

      <section className={styles.hero}>
        <h2>Your Smart Home Repair Assistant</h2>
        <p className={styles.subtitle}>
          Handi helps you easily troubleshoot home repair issues, provides professional advice, and connects you with reliable repair technicians when needed
        </p>
      </section>

      <section className={styles.features}>
        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>
            <ToolOutlined />
          </div>
          <h3>Problem Diagnosis</h3>
          <p>Precisely analyze your repair issues using AI technology and provide professional diagnosis</p>
        </div>

        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>
            <SearchOutlined />
          </div>
          <h3>Repair Guidance</h3>
          <p>Provide clear, easy-to-understand repair step guidance to help you solve simple problems</p>
        </div>

        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>
            <TeamOutlined />
          </div>
          <h3>Technician Matching</h3>
          <p>For complex problems, we help connect you with nearby professional repair technicians, saving time and effort</p>
        </div>

        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>
            <RobotOutlined />
          </div>
          <h3>Smart Learning</h3>
          <p>The system continuously learns and optimizes to provide increasingly accurate problem-solving solutions</p>
        </div>
      </section>

      <section className={styles.cta}>
        <h2>Ready to Experience Handi?</h2>
        <p>Let Handi help you solve your home repair challenges with ease and confidence</p>
        <button className={styles.startButton} onClick={handleStartClick}>
          Get Started <ArrowRightOutlined />
        </button>
      </section>

      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} Handi - Smart Home Repair Assistant</p>
      </footer>
    </div>
  );
}
