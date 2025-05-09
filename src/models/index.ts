export interface Message {
  role: Role
  content: string
  image?: string | string[]  // 可以是单个图片或图片数组
  images?: string[]
}

export type Role = 'assistant' | 'user' | 'system'
