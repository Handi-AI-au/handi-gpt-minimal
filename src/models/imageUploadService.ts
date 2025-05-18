/**
 * 图像上传服务模块
 * 用于将图像上传到外部API
 */

// 外部API的基础URL
const EXTERNAL_API_BASE_URL = 'https://handi-gpt-backend-657064704852.australia-southeast2.run.app';

export interface ImageUploadResponse {
  image_path: string;
  image_url: string;
}

/**
 * 将base64格式的图像转换为Blob对象
 */
const base64ToBlob = (base64Data: string): Blob => {
  // 提取MIME类型和实际的base64数据
  const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  
  if (!matches || matches.length !== 3) {
    throw new Error('Invalid base64 format');
  }
  
  const contentType = matches[1];
  const base64 = matches[2];
  const byteCharacters = atob(base64);
  const byteArrays = [];
  
  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);
    
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  
  return new Blob(byteArrays, { type: contentType });
};

/**
 * 上传图像到外部API
 * @param imageBase64 base64格式的图像数据
 * @returns 上传后的图像路径和URL
 */
export const uploadImageToExternalAPI = async (imageBase64: string): Promise<ImageUploadResponse> => {
  try {
    // 将base64转换为blob对象
    const blob = base64ToBlob(imageBase64);
    
    // 创建FormData对象
    const formData = new FormData();
    formData.append('image', blob);
    
    // 发送请求到外部API
    const response = await fetch(`${EXTERNAL_API_BASE_URL}/image/upload`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`Upload failed with status: ${response.status}`);
    }
    
    // 解析响应
    const data: ImageUploadResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error uploading image to external API:', error);
    throw error;
  }
};

/**
 * 上传多张图像到外部API
 * @param imagesBase64 多个base64格式的图像数据
 * @returns 上传后的图像路径和URL数组
 */
export const uploadMultipleImagesToExternalAPI = async (imagesBase64: string[]): Promise<ImageUploadResponse[]> => {
  const uploadPromises = imagesBase64.map(imageBase64 => uploadImageToExternalAPI(imageBase64));
  return Promise.all(uploadPromises);
}; 