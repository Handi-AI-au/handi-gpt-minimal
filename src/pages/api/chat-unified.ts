import { Message } from '@/models'
import { createParser, ParsedEvent, ReconnectInterval } from 'eventsource-parser'

export const config = {
  runtime: 'edge'
}

// 定义OpenAI消息内容的接口
interface TextContent {
  type: 'text';
  text: string;
}

interface ImageUrlContent {
  type: 'image_url';
  image_url: {
    url: string;
  };
}

type ContentItem = TextContent | ImageUrlContent;

const handler = async (req: Request): Promise<Response> => {
  try {
    const { messages } = (await req.json()) as {
      messages: Message[]
    }

    // 检查是否有带图片的消息
    const hasImageMessages = messages.some(msg => 
      (msg.image && typeof msg.image === 'string' && msg.image.startsWith('data:image/')) ||
      (msg.image && Array.isArray(msg.image) && msg.image.length > 0)
    );
    
    // 处理消息，为OpenAI API准备
    const processedMessages = processMessages(messages);
    
    // 获取API配置
    const { apiUrl, apiKey, model } = getApiConfig();
    
    // 检查最后一条消息是否有图片
    const lastMessage = messages[messages.length - 1];
    const hasStringImage = lastMessage.image && typeof lastMessage.image === 'string' && lastMessage.image.startsWith('data:image/');
    const hasArrayImage = lastMessage.image && Array.isArray(lastMessage.image) && lastMessage.image.length > 0;
    
    // 如果有图片消息并且是最后一条，使用非流式请求获取单个完整响应
    // 否则使用流式响应以获得更好的用户体验
    if (hasImageMessages && (hasStringImage || hasArrayImage)) {
      const response = await singleResponse(apiUrl, apiKey, model, processedMessages);
      return new Response(JSON.stringify(response), {
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      // 使用流式响应
      const stream = await OpenAIStream(apiUrl, apiKey, model, processedMessages);
      return new Response(stream);
    }
  } catch (error) {
    console.error(error);
    return new Response('Error', { status: 500 });
  }
};

// 处理消息，将带图片的消息转换为OpenAI多模态格式
const processMessages = (messages: Message[]) => {
  const charLimit = 12000;
  let charCount = 0;
  const processedMessages = [];
  
  // 系统消息
  processedMessages.push({
    role: 'system',
    content: `You are an AI assistant that helps people find information and analyze images when provided.`
  });
  
  // 处理用户消息
  for (let i = 0; i < messages.length; i++) {
    const message = messages[i];
    
    // 检查长度限制
    if (charCount + message.content.length > charLimit) {
      break;
    }
    
    charCount += message.content.length;
    
    // 处理带单张图片的消息（字符串形式）
    if (message.image && typeof message.image === 'string' && message.image.startsWith('data:image/')) {
      processedMessages.push({
        role: message.role,
        content: [
          { type: 'text', text: message.content } as TextContent,
          { type: 'image_url', image_url: { url: message.image } } as ImageUrlContent
        ]
      });
    } 
    // 处理带多张图片的消息（数组形式）
    else if (message.image && Array.isArray(message.image) && message.image.length > 0) {
      const content: ContentItem[] = [{ type: 'text', text: message.content }];
      
      // 添加所有图片到content数组
      message.image.forEach(img => {
        if (img && typeof img === 'string' && img.startsWith('data:image/')) {
          content.push({ type: 'image_url', image_url: { url: img } } as ImageUrlContent);
        }
      });
      
      processedMessages.push({
        role: message.role,
        content: content
      });
    } else {
      // 普通文本消息
      processedMessages.push({
        role: message.role,
        content: message.content
      });
    }
  }
  
  return processedMessages;
};

// 获取API配置
const getApiConfig = () => {
  const useAzureOpenAI =
    process.env.AZURE_OPENAI_API_BASE_URL && process.env.AZURE_OPENAI_API_BASE_URL.length > 0;

  let apiUrl: string;
  let apiKey: string;
  let model: string;
  
  if (useAzureOpenAI) {
    let apiBaseUrl = process.env.AZURE_OPENAI_API_BASE_URL;
    const version = '2024-02-01';
    const deployment = process.env.AZURE_OPENAI_DEPLOYMENT || '';
    if (apiBaseUrl && apiBaseUrl.endsWith('/')) {
      apiBaseUrl = apiBaseUrl.slice(0, -1);
    }
    apiUrl = `${apiBaseUrl}/openai/deployments/${deployment}/chat/completions?api-version=${version}`;
    apiKey = process.env.AZURE_OPENAI_API_KEY || '';
    model = ''; // Azure Open AI always ignores the model
  } else {
    let apiBaseUrl = process.env.OPENAI_API_BASE_URL || 'https://api.openai.com';
    if (apiBaseUrl && apiBaseUrl.endsWith('/')) {
      apiBaseUrl = apiBaseUrl.slice(0, -1);
    }
    apiUrl = `${apiBaseUrl}/v1/chat/completions`;
    apiKey = process.env.OPENAI_API_KEY || '';
    model = 'gpt-4o'; // 使用支持图像的模型
  }
  
  return { apiUrl, apiKey, model };
};

// 非流式响应，用于处理图片
const singleResponse = async (apiUrl: string, apiKey: string, model: string, messages: any[]) => {
  const res = await fetch(apiUrl, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'api-key': `${apiKey}`
    },
    method: 'POST',
    body: JSON.stringify({
      model: model,
      frequency_penalty: 0,
      max_tokens: 4000,
      messages: messages,
      presence_penalty: 0,
      temperature: 0.7,
      top_p: 0.95
    })
  });

  if (res.status !== 200) {
    const statusText = res.statusText;
    throw new Error(
      `The OpenAI API has encountered an error with a status code of ${res.status} and message ${statusText}`
    );
  }

  const data = await res.json();
  return {
    content: data.choices[0]?.message?.content || 'No response available'
  };
};

// 流式响应，用于常规聊天
const OpenAIStream = async (apiUrl: string, apiKey: string, model: string, messages: any[]) => {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  
  const res = await fetch(apiUrl, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'api-key': `${apiKey}`
    },
    method: 'POST',
    body: JSON.stringify({
      model: model,
      frequency_penalty: 0,
      max_tokens: 4000,
      messages: messages,
      presence_penalty: 0,
      stream: true,
      temperature: 0.7,
      top_p: 0.95
    })
  });

  if (res.status !== 200) {
    const statusText = res.statusText;
    throw new Error(
      `The OpenAI API has encountered an error with a status code of ${res.status} and message ${statusText}`
    );
  }

  return new ReadableStream({
    async start(controller) {
      const onParse = (event: ParsedEvent | ReconnectInterval) => {
        if (event.type === 'event') {
          const data = event.data;

          if (data === '[DONE]') {
            controller.close();
            return;
          }

          try {
            const json = JSON.parse(data);
            const text = json.choices[0]?.delta.content;
            const queue = encoder.encode(text);
            controller.enqueue(queue);
          } catch (e) {
            controller.error(e);
          }
        }
      };

      const parser = createParser(onParse);

      for await (const chunk of res.body as any) {
        const str = decoder.decode(chunk).replace('[DONE]\n', '[DONE]\n\n');
        parser.feed(str);
      }
    }
  });
};

export default handler; 