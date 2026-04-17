import { useEffect, useRef, useState } from "react";
import { loadMicroApp, type MicroApp } from "qiankun";

const CHAT_ENTRY =
  import.meta.env.VITE_CHAT_ENTRY ?? "//localhost:5174/";

export default function App() {
  const appRef = useRef<MicroApp | null>(null);
  const [apiBaseUrl] = useState(
    () => import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000",
  );
  const [spaceId, setSpaceId] = useState(
    () => import.meta.env.VITE_SPACE_ID ?? "",
  );
  const [userId, setUserId] = useState(
    () => import.meta.env.VITE_USER_ID ?? "",
  );

  useEffect(() => {
    const el = document.querySelector("#subapp-viewport");
    if (!el || !spaceId.trim() || !userId.trim()) {
      return;
    }

    const instance = loadMicroApp(
      {
        name: "chat",
        entry: CHAT_ENTRY,
        container: el as HTMLElement,
        props: {
          apiBaseUrl,
          spaceId: spaceId.trim(),
          userId: userId.trim(),
        },
      },
      { sandbox: { experimentalStyleIsolation: true } },
    );
    appRef.current = instance;

    return () => {
      void instance.unmount();
      appRef.current = null;
    };
  }, [apiBaseUrl, spaceId, userId]);

  return (
    <div className="shell">
      <aside className="shell-side">
        <h1>AI-Assistant</h1>
        <p className="shell-desc">
          qiankun 主应用 · 子应用为对话（assistant-ui）
        </p>
        <label>
          API Base URL
          <input value={apiBaseUrl} readOnly />
        </label>
        <label>
          Space ID (UUID)
          <input
            value={spaceId}
            onChange={(e) => setSpaceId(e.target.value)}
            placeholder="必填：空间 UUID"
          />
        </label>
        <label>
          User ID (X-User-Id)
          <input
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="必填：用户 UUID"
          />
        </label>
        <p className="shell-hint">
          修改 Space / User 后会重新挂载子应用。请先启动子应用{" "}
          <code>pnpm dev:chat</code>（端口 5174）。
        </p>
      </aside>
      <div id="subapp-viewport" className="shell-main" />
    </div>
  );
}
