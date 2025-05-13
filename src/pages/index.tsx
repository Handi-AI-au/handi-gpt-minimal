import { useState } from 'react';
import { Modal, Radio, Select, Input } from 'antd';
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
  const [modalVisible, setModalVisible] = useState(false);
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');

  const handleStartClick = () => {
    setModalVisible(true);
  };

  const handleModalCancel = () => {
    setModalVisible(false);
  };

  const handleSubmit = () => {
    // Save user information to local storage
    if (gender && age) {
      localStorage.setItem('user_info', JSON.stringify({
        gender,
        age,
        email: email || '',
        timestamp: new Date().toISOString()
      }));
      
      // Redirect to chat page
      router.push('/chat');
    }
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

      <Modal
        title={null}
        open={modalVisible}
        onCancel={handleModalCancel}
        footer={null}
        centered
        width={400}
        className={styles.modal}
      >
        <div className={styles.title}>We&apos;d love to know a little about you</div>
        
        <div className={styles.formItem}>
          <label className={styles.label}>Your Gender</label>
          <div className={styles.radioGroup}>
            <Radio.Group onChange={(e) => setGender(e.target.value)} value={gender}>
              <Radio value="male">Male</Radio>
              <Radio value="female">Female</Radio>
              <Radio value="other">Other</Radio>
            </Radio.Group>
          </div>
        </div>
        
        <div className={styles.formItem}>
          <label className={styles.label}>Your Age Group</label>
          <Select
            placeholder="Select your age range"
            onChange={(value) => setAge(value)}
            value={age}
            className={styles.ageSelect}
          >
            <Select.Option value="18-25">18-25 years</Select.Option>
            <Select.Option value="26-35">26-35 years</Select.Option>
            <Select.Option value="36-45">36-45 years</Select.Option>
            <Select.Option value="46-55">46-55 years</Select.Option>
            <Select.Option value="56+">56 years and above</Select.Option>
          </Select>
        </div>
        
        <div className={styles.formItem}>
          <label className={styles.label}>Email Address (Optional)</label>
          <Input
            placeholder="Share your email if you&apos;d like updates"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className={styles.emailInput}
          />
        </div>
        
        <button 
          className={styles.submitButton} 
          onClick={handleSubmit}
          disabled={!gender || !age}
        >
          Continue to Handi
        </button>
      </Modal>
    </div>
  );
}
