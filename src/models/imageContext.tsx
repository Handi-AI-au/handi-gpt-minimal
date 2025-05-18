import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ImageUploadResponse } from './imageUploadService';

// 上传图片信息的接口，包含API返回结果和上传时间
export interface UploadedImageInfo {
  imageData: ImageUploadResponse;  // API返回的图片信息
  uploadTime: number;             // 上传时间戳
  messageIndex?: number;          // 关联的消息索引
  description?: string;           // 可选的描述信息
}

// 上下文接口定义
interface ImageContextType {
  uploadedImageInfos: UploadedImageInfo[];  // 存储所有上传图片的信息
  addUploadedImageInfo: (imageInfo: UploadedImageInfo) => void;  // 添加图片信息
  clearUploadedImageInfos: () => void;  // 清空所有图片信息
}

// 创建上下文
const ImageContext = createContext<ImageContextType | undefined>(undefined);

// 上下文提供者组件
export const ImageContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [uploadedImageInfos, setUploadedImageInfos] = useState<UploadedImageInfo[]>([]);

  // 添加上传图片信息
  const addUploadedImageInfo = (imageInfo: UploadedImageInfo) => {
    setUploadedImageInfos(prev => [...prev, imageInfo]);
  };

  // 清空所有图片信息
  const clearUploadedImageInfos = () => {
    setUploadedImageInfos([]);
  };

  return (
    <ImageContext.Provider value={{ 
      uploadedImageInfos, 
      addUploadedImageInfo, 
      clearUploadedImageInfos 
    }}>
      {children}
    </ImageContext.Provider>
  );
};

// 自定义Hook，便于消费上下文
export const useImageContext = (): ImageContextType => {
  const context = useContext(ImageContext);
  if (context === undefined) {
    throw new Error('useImageContext must be used within an ImageContextProvider');
  }
  return context;
}; 