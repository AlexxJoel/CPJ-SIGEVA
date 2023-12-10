/// <reference types="vite/client" />
interface ImportMetaEnv {
    readonly VITE_BASE_SEVER_URL: string
    // more env variables...
}
interface ImportMeta {
    readonly env: ImportMetaEnv
}