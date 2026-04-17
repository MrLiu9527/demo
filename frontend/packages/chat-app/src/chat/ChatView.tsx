import { useCallback, useMemo, useState } from "react";
import { ThreadPrimitive, ComposerPrimitive, MessagePrimitive } from "@assistant-ui/react";
import { createApiClient, type ClientConfig } from "../api/client";
import { ChatRuntimeProvider } from "./ChatRuntimeProvider";
import "./chat.css";

type Props = {
  config: ClientConfig;
  defaultAgentId?: string;
};

function pickInitialAgentId(
  agents: { agent_id: string }[],
  defaultAgentId?: string,
): string {
  if (defaultAgentId && agents.some((a) => a.agent_id === defaultAgentId)) {
    return defaultAgentId;
  }
  return agents[0]?.agent_id ?? "";
}

export function ChatView({ config, defaultAgentId }: Props) {
  const api = useMemo(() => createApiClient(config), [config]);

  const [agents, setAgents] = useState<
    Awaited<ReturnType<typeof api.listAgents>>
  >([]);
  const [agentId, setAgentId] = useState("");
  const [conversations, setConversations] = useState<
    Awaited<ReturnType<typeof api.listConversations>>
  >([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadConversations = useCallback(
    async (id: string) => {
      if (!id) {
        setConversations([]);
        return;
      }
      setError(null);
      try {
        const list = await api.listConversations(id);
        setConversations(list);
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    },
    [api],
  );

  const loadAgents = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const list = await api.listAgents();
      setAgents(list);
      const next = pickInitialAgentId(list, defaultAgentId);
      setAgentId(next);
      await loadConversations(next);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [api, defaultAgentId, loadConversations]);

  const handleNewChat = async () => {
    if (!agentId) {
      setError("请选择 Agent");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const conv = await api.createConversation(agentId);
      setConversationId(conv.id);
      await loadConversations(agentId);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-layout">
      <aside className="chat-sidebar">
        <div className="chat-sidebar-header">
          <button type="button" onClick={() => void loadAgents()} disabled={loading}>
            加载 Agent 列表
          </button>
          <label className="chat-label">
            Agent
            <select
              value={agentId}
              onChange={(e) => {
                const id = e.target.value;
                setAgentId(id);
                setConversationId(null);
                void loadConversations(id);
              }}
            >
              <option value="">选择...</option>
              {agents.map((a) => (
                <option key={a.agent_id} value={a.agent_id}>
                  {a.name} ({a.agent_id})
                </option>
              ))}
            </select>
          </label>
          <button type="button" onClick={() => void handleNewChat()} disabled={loading}>
            新会话
          </button>
        </div>
        <ul className="chat-conv-list">
          {conversations.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                className={c.id === conversationId ? "active" : ""}
                onClick={() => setConversationId(c.id)}
              >
                {c.title || c.id.slice(0, 8)}
              </button>
            </li>
          ))}
        </ul>
      </aside>
      <main className="chat-main">
        {error && <div className="chat-banner error">{error}</div>}
        {agents.length === 0 && (
          <div className="chat-empty-hint">
            点击左上角「加载 Agent 列表」拉取{" "}
            <code>/api/v1/space/{"{spaceId}"}/agents</code>
          </div>
        )}
        {agents.length > 0 && !conversationId && (
          <div className="chat-empty-hint">
            选择左侧会话或点击「新会话」（消息经{" "}
            <code>.../chat/conversations/{"{id}"}/messages</code> 发送）
          </div>
        )}
        {conversationId && (
          <ChatRuntimeProvider api={api} conversationId={conversationId}>
            <ThreadPrimitive.Root className="aui-thread-root">
              <ThreadPrimitive.Viewport className="aui-thread-viewport">
                <ThreadPrimitive.Empty>
                  <div className="chat-thread-empty">暂无消息，在下方输入开始。</div>
                </ThreadPrimitive.Empty>
                <ThreadPrimitive.Messages>
                  {({ message }) =>
                    message.role === "user" ? (
                      <MessagePrimitive.Root className="msg msg-user">
                        <MessagePrimitive.Parts />
                      </MessagePrimitive.Root>
                    ) : (
                      <MessagePrimitive.Root className="msg msg-assistant">
                        <MessagePrimitive.Parts />
                      </MessagePrimitive.Root>
                    )
                  }
                </ThreadPrimitive.Messages>
              </ThreadPrimitive.Viewport>
              <ComposerPrimitive.Root className="aui-composer">
                <ComposerPrimitive.Input
                  placeholder="输入消息，Enter 发送"
                  className="aui-composer-input"
                />
                <ComposerPrimitive.Send className="aui-composer-send">
                  发送
                </ComposerPrimitive.Send>
              </ComposerPrimitive.Root>
            </ThreadPrimitive.Root>
          </ChatRuntimeProvider>
        )}
      </main>
    </div>
  );
}
