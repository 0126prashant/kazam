interface ImportMetaEnv {
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

export const config = {
  apiUrl: import.meta.env.VITE_API_URL,
};
