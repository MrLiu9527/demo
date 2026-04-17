/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_SPACE_ID?: string;
  readonly VITE_USER_ID?: string;
  readonly VITE_CHAT_ENTRY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
