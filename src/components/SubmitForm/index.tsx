import React, { useState } from 'react';
import { Modal, Form, Input, Button, Select, Spin, Steps, message } from 'antd';
import { useImageContext } from '@/models/imageContext';
import { ChatMessage } from '@/components/ChatGPT/interface';

// 表单接口定义
interface SubmitFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
  messages: ChatMessage[];
}

// 表单数据接口
interface FormData {
  user_name: string;
  suburb: string;
  email: string;
  phone_number: string;
  user_requirements?: string;
  user_feedback?: string;
}

// 紧急程度选项
const urgencyOptions = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
  { label: 'Critical', value: 'critical' },
];

// 预览的数据接口
interface PreviewData extends FormData {
  summary: string;
  urgency_level: string;
  content: string;
}

const SubmitForm: React.FC<SubmitFormProps> = ({ visible, onClose, onSubmit, messages }) => {
  const [form] = Form.useForm();
  const { uploadedImageInfos } = useImageContext();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);

  // 处理表单提交
  const handleFormSubmit = async () => {
    try {
      await form.validateFields();
      const values = form.getFieldsValue();
      setLoading(true);
      
      // 调用ChatGPT API生成摘要、紧急程度和内容
      await generateSummaryFromChatGPT(values, messages);
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };

  // 生成摘要
  const generateSummaryFromChatGPT = async (formValues: FormData, chatMessages: ChatMessage[]) => {
    try {
      // 准备发送给ChatGPT的消息
      const prompt = createSummaryPrompt(chatMessages);
      
      setLoading(true);
      
      const response = await fetch('/api/chat-unified', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          generate_report: true, // 添加标志指示这是报告生成请求
          response_format: { type: "json_object" } // 使用OpenAI的JSON响应格式
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate summary');
      }

      const data = await response.json();
      
      try {
        // 直接解析JSON内容，无需复杂的处理
        const parsedData = JSON.parse(data.content);
        
        // 验证紧急程度值是否符合API要求
        const validUrgencyLevels = ['low', 'medium', 'high', 'critical'];
        if (!validUrgencyLevels.includes(parsedData.urgency_level)) {
          // 如果不符合，默认设置为medium
          console.warn(`Invalid urgency_level: ${parsedData.urgency_level}, setting to 'medium'`);
          parsedData.urgency_level = 'medium';
        }
        
        // 合并用户表单数据和ChatGPT生成的数据
        const combinedData: PreviewData = {
          ...formValues,
          summary: parsedData.summary,
          urgency_level: parsedData.urgency_level,
          content: parsedData.content
        };
        
        setPreviewData(combinedData);
        setCurrentStep(1); // 前进到预览步骤
      } catch (parseError) {
        console.error('Failed to parse ChatGPT response:', parseError, data.content);
        message.error('Failed to analyze conversation. Please try again.');
      }
    } catch (error) {
      console.error('Error generating summary:', error);
      message.error('Failed to analyze conversation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // 创建用于生成摘要的提示词
  const createSummaryPrompt = (chatMessages: ChatMessage[]): string => {
    const conversationText = chatMessages
      .map(msg => `${msg.role.toUpperCase()}: ${msg.content}`)
      .join('\n\n');

    return `Please analyze the following conversation between a user and an assistant about a home repair issue. 
Extract the following information:
1. summary: A brief (max 50 words) summary of the problem
2. urgency_level: The urgency level of the problem (must be EXACTLY one of these values: "low", "medium", "high", "critical")
3. content: A detailed description of the problem (150-200 words)

Important: For urgency_level, you MUST use ONLY one of these exact values: "low", "medium", "high", or "critical". 
Any other value will cause an error.

Conversation:
${conversationText}

Respond with the JSON object containing the requested information.`;
  };

  // 最终提交报告
  const submitFinalReport = async () => {
    if (!previewData) return;
    
    setLoading(true);
    
    try {
      // 准备提交的数据，严格符合ReportCreateRequest格式
      const reportData = {
        user_name: previewData.user_name,
        suburb: previewData.suburb,
        email: previewData.email,
        phone_number: previewData.phone_number,
        summary: previewData.summary,
        urgency_level: previewData.urgency_level,
        content: previewData.content,
        user_requirements: previewData.user_requirements || null,
        user_feedback: previewData.user_feedback || null,
        report_id: null,  // API要求明确设置为null
        status: null,     // API要求明确设置为null
        notes: null,      // API要求明确设置为null
        created_at: null, // API要求明确设置为null
        // 添加图片信息，确保符合API要求的Image格式
        images: uploadedImageInfos.length > 0 
          ? uploadedImageInfos.map(info => ({
              image_path: info.imageData.image_path,
              image_url: info.imageData.image_url
            }))
          : null // 如果没有图片，则设置为null
      };
      
      // 发送到外部API
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
      if (!backendUrl) {
        throw new Error('Backend API URL is not configured');
      }
      
      const response = await fetch(`${backendUrl}/report/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(reportData),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('API Error Response:', errorData);
        throw new Error(`Failed to submit report: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('Report submitted successfully:', result);
      
      message.success('Your report has been submitted successfully! Our staff will contact you as soon as possible!');
      onClose();
      form.resetFields();
      setCurrentStep(0);
      setPreviewData(null);
    } catch (error) {
      console.error('Error submitting report:', error);
      message.error(`Failed to submit report: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // 渲染步骤内容
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Form
            form={form}
            layout="vertical"
            name="submit_form"
          >
            <Form.Item
              name="user_name"
              label="Name"
              rules={[{ required: true, message: 'Please enter your name' }]}
            >
              <Input placeholder="Your full name" />
            </Form.Item>
            
            <Form.Item
              name="suburb"
              label="Suburb"
              rules={[{ required: true, message: 'Please enter your suburb' }]}
            >
              <Input placeholder="Your suburb" />
            </Form.Item>
            
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Please enter a valid email address' }
              ]}
            >
              <Input placeholder="Your email address" />
            </Form.Item>
            
            <Form.Item
              name="phone_number"
              label="Phone Number"
              rules={[{ required: true, message: 'Please enter your phone number' }]}
            >
              <Input placeholder="Your phone number" />
            </Form.Item>
            
            <Form.Item
              name="user_requirements"
              label="Specific Requirements (Optional)"
            >
              <Input.TextArea placeholder="Any specific requirements for the repair service" />
            </Form.Item>
            
            <Form.Item
              name="user_feedback"
              label="Feedback (Optional)"
            >
              <Input.TextArea placeholder="Any additional feedback you'd like to provide" />
            </Form.Item>
          </Form>
        );
      
      case 1:
        return previewData ? (
          <div className="preview-container">
            <h3>Preview Report</h3>
            
            <div className="preview-section">
              <h4>Personal Information</h4>
              <p><strong>Name:</strong> {previewData.user_name}</p>
              <p><strong>Suburb:</strong> {previewData.suburb}</p>
              <p><strong>Email:</strong> {previewData.email}</p>
              <p><strong>Phone:</strong> {previewData.phone_number}</p>
              
              {previewData.user_requirements && (
                <p><strong>Requirements:</strong> {previewData.user_requirements}</p>
              )}
              
              {previewData.user_feedback && (
                <p><strong>Feedback:</strong> {previewData.user_feedback}</p>
              )}
            </div>
            
            <div className="preview-section">
              <h4>Problem Summary</h4>
              <p>{previewData.summary}</p>
              
              <h4>Urgency Level</h4>
              <p>{previewData.urgency_level.charAt(0).toUpperCase() + previewData.urgency_level.slice(1)}</p>
              
              <h4>Detailed Description</h4>
              <p>{previewData.content}</p>
            </div>
            
            <div className="preview-section">
              <h4>Attached Images</h4>
              <p>{uploadedImageInfos.length} image(s) attached</p>
            </div>
          </div>
        ) : <Spin tip="Loading preview..." />;
      
      default:
        return null;
    }
  };

  // 渲染底部按钮
  const renderFooter = () => {
    if (loading) {
      return [
        <Button key="cancel" onClick={onClose} disabled={loading}>
          Cancel
        </Button>,
        <Button key="loading" type="primary" loading>
          {currentStep === 0 ? 'Analyzing...' : 'Submitting...'}
        </Button>
      ];
    }

    switch (currentStep) {
      case 0:
        return [
          <Button key="cancel" onClick={onClose}>
            Cancel
          </Button>,
          <Button key="next" type="primary" onClick={handleFormSubmit}>
            Generate Report & Request Workers
          </Button>
        ];
      
      case 1:
        return [
          <Button key="back" onClick={() => setCurrentStep(0)}>
            Back
          </Button>,
          <Button key="submit" type="primary" onClick={submitFinalReport}>
            Submit to Contact Workers
          </Button>
        ];
      
      default:
        return null;
    }
  };

  return (
    <Modal
      title="Submit Your Conversation"
      open={visible}
      onCancel={onClose}
      footer={renderFooter()}
      width={600}
    >
      <Steps
        current={currentStep}
        style={{ marginBottom: 24 }}
      >
        <Steps.Step title="Information" />
        <Steps.Step title="Preview & Submit" />
      </Steps>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '30px 0' }}>
          <Spin tip={currentStep === 0 ? "Analyzing conversation..." : "Submitting report..."} />
        </div>
      ) : (
        renderStepContent()
      )}
    </Modal>
  );
};

export default SubmitForm;

// 添加样式
export const styles = `
  .preview-container {
    max-height: 400px;
    overflow-y: auto;
    padding: 0 10px;
  }
  
  .preview-section {
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid #f0f0f0;
  }
  
  .preview-section:last-child {
    border-bottom: none;
  }
  
  .preview-section h4 {
    margin-bottom: 8px;
    color: #333;
  }
`; 