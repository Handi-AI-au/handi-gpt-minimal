export interface Message {
  role: Role
  content: string
  image?: string
}

export type Role = 'assistant' | 'user' | 'system'
