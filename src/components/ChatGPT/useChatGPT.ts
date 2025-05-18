import { useEffect, useReducer, useRef, useState } from 'react'

import ClipboardJS from 'clipboard'
import { throttle } from 'lodash-es'

import { uploadImageToExternalAPI } from '@/models/imageUploadService'
import { useImageContext } from '@/models/imageContext'
import { ChatGPTProps, ChatMessage, ChatRole } from './interface'

// 全局标志，控制是否将图片同步到外部API
const SYNC_TO_EXTERNAL_API = true;

const scrollDown = throttle(
  () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
  },
  300,
  {
    leading: true,
    trailing: false
  }
)

const requestMessage = async (
  url: string,
  messages: ChatMessage[],
  controller: AbortController | null
) => {
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      messages
    }),
    signal: controller?.signal
  })

  if (!response.ok) {
    throw new Error(response.statusText)
  }
  
  // 检查响应的content-type
  const contentType = response.headers.get('content-type')
  
  // 如果是JSON响应（非流式，通常是图片消息的响应）
  if (contentType && contentType.includes('application/json')) {
    const data = await response.json()
    return { isJson: true, content: data.content }
  }
  
  // 流式响应的处理
  const data = response.body
  if (!data) {
    throw new Error('No data')
  }
  return { isJson: false, reader: data.getReader() }
}

export const useChatGPT = (props: ChatGPTProps) => {
  const { fetchPath } = props
  const [, forceUpdate] = useReducer((x: boolean) => !x, false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [disabled] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  
  // 使用图片上下文
  const { addUploadedImageInfo } = useImageContext()

  const controller = useRef<AbortController | null>(null)
  const currentMessage = useRef<string>('')

  const archiveCurrentMessage = () => {
    const content = currentMessage.current
    currentMessage.current = ''
    setLoading(false)
    if (content) {
      setMessages((messages) => {
        return [
          ...messages,
          {
            content,
            role: ChatRole.Assistant
          }
        ]
      })
      scrollDown()
    }
  }

  const fetchMessage = async (messagesToSend: ChatMessage[]) => {
    try {
      currentMessage.current = ''
      controller.current = new AbortController()
      setLoading(true)

      const result = await requestMessage('/api/chat-unified', messagesToSend, controller.current)
      
      // 处理JSON响应（图片处理的情况）
      if (result.isJson) {
        currentMessage.current = result.content
        archiveCurrentMessage()
        return
      }
      
      // 处理流式响应
      if (!result.reader) {
        throw new Error('Stream reader is undefined')
      }
      
      const reader = result.reader
      const decoder = new TextDecoder('utf-8')
      let done = false

      while (!done) {
        const { value, done: readerDone } = await reader.read()
        if (value) {
          const char = decoder.decode(value)
          if (char === '\n' && currentMessage.current.endsWith('\n')) {
            continue
          }
          if (char) {
            currentMessage.current += char
            forceUpdate()
          }
          scrollDown()
        }
        done = readerDone
      }

      archiveCurrentMessage()
    } catch (e) {
      console.error(e)
      setLoading(false)
      return
    }
  }

  const onStop = () => {
    if (controller.current) {
      controller.current.abort()
      archiveCurrentMessage()
    }
  }

  const onSend = (message: ChatMessage) => {
    // 如果有上传的图片，将图片添加到消息中
    let messagesToSend: ChatMessage = { ...message };
    
    if (uploadedImages.length > 0) {
      // 创建带图片的消息
      messagesToSend.images = uploadedImages;
    }
    
    const newMessages = [...messages, messagesToSend];
    setMessages(newMessages);
    
    // 创建用于API请求的消息数组
    const messagesToAPI: ChatMessage[] = newMessages.map((msg, index) => {
      if (index === newMessages.length - 1 && msg.images && msg.images.length > 0) {
        // 处理最新消息的所有图片
        return {
          content: msg.content,
          role: msg.role,
          image: msg.images // 发送所有图片
        };
      }
      // 返回无图片的普通消息
      return {
        content: msg.content,
        role: msg.role
      };
    });
    
    fetchMessage(messagesToAPI);
    
    // 发送后清空已上传的图片
    setUploadedImages([]);
  }

  const onClear = () => {
    setMessages([]);
    setUploadedImages([]); // 清空本地上传的图片，但已上传到外部API的图片不受影响
  }

  const onImageUpload = async (file: File) => {
    try {
      // 将文件转换为base64
      const reader = new FileReader();
      const imagePromise = new Promise<string>((resolve) => {
        reader.onload = (e) => {
          resolve(e.target?.result as string);
        }
      });
      reader.readAsDataURL(file);
      
      const imageBase64 = await imagePromise;
      
      // 将图片添加到上传图片数组中，但不立即发送
      setUploadedImages((prev: string[]) => [...prev, imageBase64]);
      
      // 同时将图片上传到外部API
      if (SYNC_TO_EXTERNAL_API) {
        try {
          const result = await uploadImageToExternalAPI(imageBase64);
          console.log('图片已成功上传到外部API:', result);
          
          // 将图片上传结果添加到上下文中
          addUploadedImageInfo({
            imageData: result,
            uploadTime: Date.now(),
            messageIndex: messages.length
          });
        } catch (uploadError) {
          // 仅记录错误但不影响原有功能
          console.error('上传图片到外部API时出错:', uploadError);
        }
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  }

  const removeUploadedImage = (index: number) => {
    setUploadedImages((prev: string[]) => prev.filter((_, i: number) => i !== index));
  }

  useEffect(() => {
    new ClipboardJS('.chat-wrapper .copy-btn')
  }, [])

  return {
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
  }
}
