import { useMemo, type ReactNode } from "react";
import {
  AssistantRuntimeProvider,
  useLocalRuntime,
  type ChatModelAdapter,
} from "@assistant-ui/react";
import type { ThreadHistoryAdapter } from "@assistant-ui/core";
import type { ThreadMessage } from "@assistant-ui/core";
import type { ApiClient } from "../api/client";

type Props = {
  api: ApiClient;
  conversationId: string | null;
  children: ReactNode;
};

function userMessageFromRow(row: {
  id: string;
  content: string;
  created_at: string;
}): ThreadMessage {
  return {
    id: row.id,
    role: "user",
    content: [{ type: "text", text: row.content }],
    attachments: [],
    createdAt: new Date(row.created_at),
    metadata: { custom: {} },
  };
}

function assistantMessageFromRow(row: {
  id: string;
  content: string;
  created_at: string;
}): ThreadMessage {
  return {
    id: row.id,
    role: "assistant",
    content: [{ type: "text", text: row.content }],
    status: { type: "complete", reason: "stop" },
    createdAt: new Date(row.created_at),
    metadata: {
      unstable_state: null,
      unstable_annotations: [],
      unstable_data: [],
      steps: [],
      custom: {},
    },
  };
}

function buildHistoryAdapter(
  api: ApiClient,
  conversationId: string | null,
): ThreadHistoryAdapter {
  return {
    async load() {
      if (!conversationId) {
        return { messages: [] };
      }
      const rows = await api.listMessages(conversationId);
      const ordered = [...rows].sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      );
      const messages = ordered
        .filter((r) => r.role === "user" || r.role === "assistant")
        .map((r) => {
          if (r.role === "user") {
            return {
              parentId: null as string | null,
              message: userMessageFromRow(r),
            };
          }
          return {
            parentId: null as string | null,
            message: assistantMessageFromRow(r),
          };
        });
      return { messages };
    },
    async append() {
      /* 消息已由后端在 chat 接口中持久化 */
    },
  };
}

function createModelAdapter(
  api: ApiClient,
  conversationId: string | null,
): ChatModelAdapter {
  return {
    async run({ messages, abortSignal }) {
      if (!conversationId) {
        throw new Error("请先选择或创建会话");
      }
      const lastUser = [...messages].reverse().find((m) => m.role === "user");
      const text =
        lastUser?.role === "user"
          ? lastUser.content
              .filter((p) => p.type === "text")
              .map((p) => p.text)
              .join("\n")
          : "";
      if (!text.trim()) {
        throw new Error("请输入内容");
      }
      const data = await api.sendMessage(conversationId, text);
      if (abortSignal.aborted) {
        return { content: [] };
      }
      return {
        content: [{ type: "text", text: data.content }],
      };
    },
  };
}

function InnerProvider({
  api,
  conversationId,
  children,
}: Props) {
  const modelAdapter = useMemo(
    () => createModelAdapter(api, conversationId),
    [api, conversationId],
  );

  const historyAdapter = useMemo(
    () => buildHistoryAdapter(api, conversationId),
    [api, conversationId],
  );

  const runtime = useLocalRuntime(modelAdapter, {
    adapters: { history: historyAdapter },
  });

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      {children}
    </AssistantRuntimeProvider>
  );
}

/** conversationId 变化时通过 key 重置 runtime，以重新加载历史 */
export function ChatRuntimeProvider(props: Props) {
  return <InnerProvider key={props.conversationId ?? "none"} {...props} />;
}
