import { ChatView } from "./chat/ChatView";

type QiankunProps = {
  apiBaseUrl?: string;
  spaceId?: string;
  userId?: string;
  defaultAgentId?: string;
};

function envOr<T extends string>(v: T | undefined, fallback: T): T {
  return (v && v.length > 0 ? v : fallback) as T;
}

export default function App({
  qiankunProps = {},
}: {
  qiankunProps?: Record<string, unknown>;
}) {
  const p = qiankunProps as QiankunProps;

  const baseUrl = envOr(
    p.apiBaseUrl,
    import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000",
  );
  const spaceId = envOr(p.spaceId, import.meta.env.VITE_SPACE_ID ?? "");
  const userId = envOr(p.userId, import.meta.env.VITE_USER_ID ?? "");
  const defaultAgentId =
    p.defaultAgentId ?? import.meta.env.VITE_DEFAULT_AGENT_ID ?? undefined;

  if (!spaceId.trim() || !userId.trim()) {
    return (
      <div className="app-root app-config-missing">
        <p>
          请配置 <code>VITE_SPACE_ID</code> 与 <code>VITE_USER_ID</code>（或从 qiankun
          主应用传入 props），参考 <code>frontend/.env.example</code>。
        </p>
      </div>
    );
  }

  return (
    <div className="app-root">
      <header className="app-header">
        <h1>AI 对话</h1>
        <span className="app-sub">
          assistant-ui · 对接 {baseUrl}
        </span>
      </header>
      <ChatView
        config={{ baseUrl, spaceId: spaceId.trim(), userId: userId.trim() }}
        defaultAgentId={defaultAgentId}
      />
    </div>
  );
}
