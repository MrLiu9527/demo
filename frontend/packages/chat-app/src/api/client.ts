import type {
  AgentSummary,
  ApiEnvelope,
  ChatResponseData,
  ConversationSummary,
  MessageRow,
  PaginatedEnvelope,
} from "./types";

export type ClientConfig = {
  baseUrl: string;
  spaceId: string;
  userId: string;
};

function joinUrl(base: string, path: string): string {
  const b = base.replace(/\/+$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${b}${p}`;
}

async function parseJson<T>(res: Response): Promise<T> {
  const text = await res.text();
  let body: unknown;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    throw new Error(`Invalid JSON (${res.status}): ${text.slice(0, 200)}`);
  }
  if (!res.ok) {
    const msg =
      typeof body === "object" && body !== null && "message" in body
        ? String((body as { message?: string }).message)
        : res.statusText;
    throw new Error(`${res.status} ${msg}`);
  }
  return body as T;
}

export function createApiClient(config: ClientConfig) {
  const { baseUrl, spaceId, userId } = config;
  const prefix = `/api/v1/space/${spaceId}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-User-Id": userId,
  };

  return {
    async listAgents(): Promise<AgentSummary[]> {
      const res = await fetch(joinUrl(baseUrl, `${prefix}/agents`), {
        headers,
      });
      const body = await parseJson<PaginatedEnvelope<AgentSummary>>(res);
      return body.data ?? [];
    },

    async createConversation(agentId: string, title?: string) {
      const res = await fetch(joinUrl(baseUrl, `${prefix}/conversations`), {
        method: "POST",
        headers,
        body: JSON.stringify({
          agent_id: agentId,
          title: title ?? null,
          metadata: null,
        }),
      });
      const body = await parseJson<ApiEnvelope<ConversationSummary>>(res);
      if (!body.data) throw new Error("Empty conversation response");
      return body.data;
    },

    async listConversations(agentId?: string) {
      const q = agentId
        ? `?agent_id=${encodeURIComponent(agentId)}&page=1&page_size=50`
        : "?page=1&page_size=50";
      const res = await fetch(joinUrl(baseUrl, `${prefix}/conversations${q}`), {
        headers,
      });
      const body = await parseJson<PaginatedEnvelope<ConversationSummary>>(res);
      return body.data ?? [];
    },

    async listMessages(conversationId: string) {
      const res = await fetch(
        joinUrl(
          baseUrl,
          `${prefix}/conversations/${conversationId}/messages?page=1&page_size=100`,
        ),
        { headers },
      );
      const body = await parseJson<PaginatedEnvelope<MessageRow>>(res);
      return body.data ?? [];
    },

    async sendMessage(conversationId: string, message: string) {
      const res = await fetch(
        joinUrl(
          baseUrl,
          `${prefix}/chat/conversations/${conversationId}/messages`,
        ),
        {
          method: "POST",
          headers,
          body: JSON.stringify({ message, stream: false }),
        },
      );
      const body = await parseJson<ApiEnvelope<ChatResponseData>>(res);
      if (!body.data) throw new Error("Empty chat response");
      return body.data;
    },
  };
}

export type ApiClient = ReturnType<typeof createApiClient>;
