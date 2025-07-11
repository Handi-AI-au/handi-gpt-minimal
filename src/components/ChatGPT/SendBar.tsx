import React, { KeyboardEventHandler, useRef, useEffect } from 'react'
import Image from 'next/image'

import { ClearOutlined, DeleteOutlined, PictureOutlined, SendOutlined } from '@ant-design/icons'

import { ChatRole, SendBarProps } from './interface'
import Show from './Show'

const SendBar = (props: SendBarProps) => {
  const { loading, disabled, onSend, onClear, onStop, onImageUpload, uploadedImages, removeUploadedImage } = props

  const inputRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const onInputAutoSize = () => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'
      inputRef.current.style.height = inputRef.current.scrollHeight + 'px'
    }
  }

  const handleClear = () => {
    if (inputRef.current) {
      inputRef.current.value = ''
      inputRef.current.style.height = 'auto'
      onClear()
    }
  }

  const handleSend = () => {
    const content = inputRef.current?.value || ''
    inputRef.current!.value = ''
    inputRef.current!.style.height = 'auto'
    onSend({
      content,
      role: ChatRole.User
    })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0 && onImageUpload) {
      // 处理多个文件
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        onImageUpload(file).catch(error => {
          console.error('Error uploading image:', error);
        });
      }
      
      // 清空文件选择器
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }

  const onKeydown: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.shiftKey) {
      return
    }

    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      handleSend()
    }
  }

  return (
    <Show
      fallback={
        <div className="thinking">
          <span>Please wait ...</span>
          <div className="stop" onClick={onStop}>
            Stop
          </div>
        </div>
      }
      loading={loading}
    >
      <div className="send-bar-container">
        {uploadedImages && uploadedImages.length > 0 && (
          <div className="uploaded-images">
            {uploadedImages.map((image, index) => (
              <div key={index} className="image-preview">
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                  <Image
                    src={image}
                    alt={`Uploaded ${index}`}
                    fill
                    style={{
                      objectFit: 'cover',
                      borderRadius: '4px'
                    }}
                  />
                </div>
                {removeUploadedImage && (
                  <button 
                    className="remove-image" 
                    onClick={() => removeUploadedImage(index)}
                    title="Remove image"
                  >
                    <DeleteOutlined />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
        <div className="send-bar">
          <textarea
            ref={inputRef!}
            className="input"
            disabled={disabled}
            placeholder="Shift + Enter for new line"
            autoComplete="off"
            rows={1}
            onKeyDown={onKeydown}
            onInput={onInputAutoSize}
          />
          {onImageUpload && (
            <div className="image-upload">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={disabled}
                title="Upload images"
                multiple
              />
              <div className="upload-icon">
                <PictureOutlined />
              </div>
            </div>
          )}
          <button className="button" title="Send" disabled={disabled} onClick={handleSend}>
            <SendOutlined />
          </button>
          <button className="button" title="Clear" disabled={disabled} onClick={handleClear}>
            <ClearOutlined />
          </button>
        </div>
      </div>
    </Show>
  )
}

export default SendBar
