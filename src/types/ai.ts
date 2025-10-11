export interface AIMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface AIRequestOptions {
  temperature?: number;
  maxTokens?: number;
  model?: string;
}

export interface AIResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface AIService {
  chat(messages: AIMessage[], options?: AIRequestOptions): Promise<AIResponse>;
  complete(prompt: string, options?: AIRequestOptions): Promise<AIResponse>;
}
