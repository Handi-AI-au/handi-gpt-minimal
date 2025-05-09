import type { ReactNode } from 'react'

export enum ChatRole {
  Assistant = 'assistant',
  User = 'user',
  System = 'system'
}

export interface ChatGPTProps {
  fetchPath: string
}

export interface ChatMessage {
  content: string
  role: ChatRole
  image?: string
  images?: string[]
}

export interface ChatMessageItemProps {
  message: ChatMessage
}

export interface SendBarProps {
  loading: boolean
  disabled: boolean
  onSend: (message: ChatMessage) => void
  onClear: () => void
  onStop: () => void
  onImageUpload?: (file: File) => Promise<void>
  uploadedImages?: string[]
  removeUploadedImage?: (index: number) => void
}

export interface ShowProps {
  loading?: boolean
  fallback?: ReactNode
  children?: ReactNode
}
