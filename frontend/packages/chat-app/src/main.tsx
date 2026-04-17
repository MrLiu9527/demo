import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { renderWithQiankun, qiankunWindow } from "vite-plugin-qiankun/dist/helper";
import "./index.css";
import App from "./App.tsx";

let root: ReturnType<typeof createRoot> | null = null;

function render(props: Record<string, unknown>) {
  const container =
    (props.container as HTMLElement | undefined)?.querySelector("#root") ??
    document.querySelector("#root");
  if (!container) return;
  root = createRoot(container);
  root.render(
    <StrictMode>
      <App qiankunProps={props} />
    </StrictMode>,
  );
}

function unmount() {
  root?.unmount();
  root = null;
}

renderWithQiankun({
  bootstrap() {
    return Promise.resolve();
  },
  mount(props) {
    render(props);
    return Promise.resolve();
  },
  unmount() {
    unmount();
    return Promise.resolve();
  },
  update() {
    return Promise.resolve();
  },
});

if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  render({});
}
