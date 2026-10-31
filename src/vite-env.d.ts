/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TEAM?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
