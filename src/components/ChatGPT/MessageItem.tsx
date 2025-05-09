import React from 'react'
import Image from 'next/image'

import MarkdownIt from 'markdown-it'
import mdHighlight from 'markdown-it-highlightjs'
import mdKatex from 'markdown-it-katex'

import { ChatMessageItemProps } from './interface'

const md = MarkdownIt({ html: true }).use(mdKatex).use(mdHighlight)
const fence = md.renderer.rules.fence!
md.renderer.rules.fence = (...args) => {
  const [tokens, idx] = args
  const token = tokens[idx]
  const rawCode = fence(...args)

  return `<div relative>
  <div data-clipboard-text=${encodeURIComponent(token.content)} class="copy-btn">
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 32 32"><path fill="currentColor" d="M28 10v18H10V10h18m0-2H10a2 2 0 0 0-2 2v18a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2Z" /><path fill="currentColor" d="M4 18H2V4a2 2 0 0 1 2-2h14v2H4Z" /></svg>
    <div>Copy</div>
  </div>
  ${rawCode}
  </div>`
}

const MessageItem = (props: ChatMessageItemProps) => {
  const { message } = props

  // 渲染单个图片
  const renderSingleImage = (imageUrl: string) => (
    <div className="message-image">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img 
        src={imageUrl} 
        alt="Uploaded" 
        style={{ 
          maxWidth: '100%', 
          maxHeight: '400px',
          borderRadius: '4px',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'
        }} 
      />
    </div>
  )

  // 渲染多张图片
  const renderMultipleImages = (images: string[]) => (
    <div className="message-images">
      {images.map((img, index) => (
        <div key={index} className="message-image">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={img} 
            alt={`Uploaded ${index}`} 
            style={{ 
              maxWidth: '100%', 
              maxHeight: '400px',
              borderRadius: '4px',
              boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
              marginBottom: '8px'
            }} 
          />
        </div>
      ))}
    </div>
  )

  return (
    <div className="message-item">
      <div className="meta">
        <div className="avatar">
          <span className={message.role}></span>
        </div>
        <div className="message">
          {/* 显示单张图片 */}
          {message.image && typeof message.image === 'string' && message.image.startsWith('data:image/') && 
            renderSingleImage(message.image)
          }
          
          {/* 显示多张图片 */}
          {message.images && message.images.length > 0 && 
            renderMultipleImages(message.images)
          }
          
          {/* 显示文本内容 */}
          <div dangerouslySetInnerHTML={{ __html: md.render(message.content) }} />
        </div>
      </div>
    </div>
  )
}

export default MessageItem
