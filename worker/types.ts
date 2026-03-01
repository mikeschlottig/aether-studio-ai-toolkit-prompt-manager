export interface ApiResponse<T = unknown> { success: boolean; data?: T; error?: string; }
export interface WeatherResult {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
}
export interface MCPResult {
  content: string;
}
export interface ErrorResult {
  error: string;
}
export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  id: string;
  toolCalls?: ToolCall[];
}
export interface ToolCall {
  id: string;
  name: string;
  arguments: Record<string, unknown>;
  result?: unknown;
}
export interface ChatState {
  messages: Message[];
  sessionId: string;
  isProcessing: boolean;
  model: string;
  streamingMessage?: string;
}
export interface SessionInfo {
  id: string;
  title: string;
  createdAt: number;
  lastActive: number;
}
export interface Tool {
  name: string;
  description: string;
  parameters: {
    type: string;
    properties: Record<string, unknown>;
    required: string[];
  };
}
export interface Prompt {
  id: string;
  name: string;
  content: string;
  tags: string[];
  version: string;
  updatedAt: number;
}
export interface Script {
  id: string;
  name: string;
  code: string;
  language: 'python' | 'javascript' | 'sql';
  description: string;
  updatedAt: number;
}
export interface MCPServer {
  id: string;
  name: string;
  url: string;
  description: string;
  status: 'connected' | 'limited' | 'disconnected';
  updatedAt: number;
}