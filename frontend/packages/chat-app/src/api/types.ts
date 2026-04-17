/** 与后端 `ResponseModel` / `PaginatedResponse` 对齐 */

export type ApiEnvelope<T> = {
  code: number;
  message: string;
  data: T;
};

export type PaginatedEnvelope<T> = {
  code: number;
  message: string;
  data: T[];
  total: number;
  page: number;
  page_size: number;
  has_more: boolean;
};

export type AgentSummary = {
  agent_id: string;
  name: string;
  description?: string | null;
  type?: string;
  scope?: string;
  status?: string;
};

export type ConversationSummary = {
  id: string;
  title: string | null;
  agent_id: string;
  agent_type: string;
  space_id: string;
  is_active: boolean;
  is_pinned: boolean;
  message_count: number;
  total_tokens: number;
  created_at: string;
  updated_at: string;
  ended_at: string | null;
};

export type MessageRow = {
  id: string;
  conversation_id: string;
  role: string;
  type: string;
  content: string;
  tool_name?: string | null;
  tool_call_id?: string | null;
  tool_args?: Record<string, unknown> | null;
  tool_result?: Record<string, unknown> | null;
  prompt_tokens?: number | null;
  completion_tokens?: number | null;
  total_tokens?: number | null;
  metadata?: Record<string, unknown> | null;
  created_at: string;
};

export type ChatResponseData = {
  message_id: string | null;
  conversation_id: string;
  content: string;
  role: string;
  tool_calls?: unknown[] | null;
  prompt_tokens?: number | null;
  completion_tokens?: number | null;
  total_tokens?: number | null;
};
