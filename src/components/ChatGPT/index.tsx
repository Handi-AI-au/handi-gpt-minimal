import React, { useState, useEffect } from 'react'
import { logEvent } from 'firebase/analytics'

import { ChatGPTProps, ChatRole } from './interface'
import MessageItem from './MessageItem'
import SendBar from './SendBar'
import { useChatGPT } from './useChatGPT'
import SubmitForm from '../SubmitForm'
import { useAnalytics } from '@/hooks/useAnalytics'

import './index.less'
import 'highlight.js/styles/atom-one-dark.css'

// 需要达到的最小对话轮次
const MIN_CONVERSATIONS_REQUIRED = 3;

const ChatGPT = (props: ChatGPTProps) => {
  // 使用统一 API 路径
  const apiProps = {
    ...props,
    fetchPath: '/api/chat-unified'
  }
  
  const { 
    loading, 
    disabled, 
    messages, 
    currentMessage, 
    onSend, 
    onClear, 
    onStop, 
    onImageUpload,
    uploadedImages,
    removeUploadedImage 
  } = useChatGPT(apiProps)

  // 控制提交按钮的显示和表单的显示状态
  const [showSubmitForm, setShowSubmitForm] = useState<boolean>(false)
  const [conversationCount, setConversationCount] = useState<number>(0)
  const [isButtonActive, setIsButtonActive] = useState<boolean>(false)
  const analytics = useAnalytics();

  // 监听对话轮次变化
  useEffect(() => {
    // 计算对话轮次 (用户消息数量)
    const userMessagesCount = messages.filter(msg => msg.role === ChatRole.User).length;
    setConversationCount(userMessagesCount);
    
    // 检查是否达到了所需的最小对话轮次
    setIsButtonActive(userMessagesCount >= MIN_CONVERSATIONS_REQUIRED);
  }, [messages]);

  // 监听消息变化，追踪对话轮次
  useEffect(() => {
    const userMessagesCount = messages.filter(msg => msg.role === ChatRole.User).length;
    if (userMessagesCount > conversationCount) {
      setConversationCount(userMessagesCount);
      if (analytics) {
        logEvent(analytics, 'chat_conversation_turns', {
          turns_count: userMessagesCount
        });
      }
    }
  }, [messages, conversationCount, analytics]);

  // 计算还需要多少轮对话
  const getRemainingConversations = () => {
    return Math.max(0, MIN_CONVERSATIONS_REQUIRED - conversationCount);
  };

  // 处理表单提交
  const handleFormSubmit = (formData: any) => {
    console.log('Form data submitted:', formData);
    // 这个函数在SubmitForm内部已经处理，这里只是为了满足接口
  }

  const handleSubmitConversation = () => {
    if (analytics) {
      logEvent(analytics, 'submit_conversation_clicked');
    }
    setShowSubmitForm(true);
  };

  return (
    <div className="chat-wrapper">
      {messages.map((message, index) => (
        <MessageItem key={index} message={message} />
      ))}
      {currentMessage.current && (
        <MessageItem message={{ content: currentMessage.current, role: ChatRole.Assistant }} />
      )}
      
      {/* 提交对话按钮 - 始终显示但状态随对话轮次变化 */}
      <div className={`submit-btn-container ${isButtonActive ? 'active' : 'inactive'}`}>
        <button 
          className={`submit-btn ${isButtonActive ? 'active' : 'inactive'}`}
          onClick={handleSubmitConversation}
          disabled={!isButtonActive || loading}
          title={isButtonActive ? "Submit Conversation & Find Workers" : `${getRemainingConversations()} more exchanges needed to submit`}
        >
          {isButtonActive 
            ? "Submit Conversation & Find Workers" 
            : `${getRemainingConversations()} more exchanges needed to submit and find workers`}
        </button>
      </div>
      
      <SendBar
        loading={loading}
        disabled={disabled}
        onSend={onSend}
        onClear={onClear}
        onStop={onStop}
        onImageUpload={onImageUpload}
        uploadedImages={uploadedImages}
        removeUploadedImage={removeUploadedImage}
      />
      
      {/* 提交表单模态框 */}
      <SubmitForm 
        visible={showSubmitForm} 
        onClose={() => setShowSubmitForm(false)}
        onSubmit={handleFormSubmit}
        messages={messages}
      />
    </div>
  )
}

export default ChatGPT
