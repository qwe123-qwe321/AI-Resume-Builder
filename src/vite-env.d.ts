/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_STRAPI_API_KEY: string;
  readonly VITE_API_BASE_URL: string;
  readonly VITE_GOOGLE_GEMINI_API_KEY: string;
  readonly VITE_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}