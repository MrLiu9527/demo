import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import qiankun from "vite-plugin-qiankun";

const useQiankunDev = process.env.VITE_QIANKUN_DEV === "1";

// 子应用被主应用以开发 URL 加载时，设置 VITE_QIANKUN_DEV=1（与 HMR 可能冲突，见插件文档）
export default defineConfig({
  plugins: [react(), qiankun("chat", { useDevMode: useQiankunDev })],
  server: {
    port: 5174,
    cors: true,
    origin: "http://localhost:5174",
  },
  base:
    process.env.NODE_ENV === "production"
      ? "/child/chat/"
      : "//localhost:5174/",
});
