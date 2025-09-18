/// <reference types="vite/client" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

// CSS 模块类型声明
declare module '*.module.css' {
  const classes: { [key: string]: string }
  export default classes
}

declare module '*.module.scss' {
  const classes: { [key: string]: string }
  export default classes
}

declare module '*.module.less' {
  const classes: { [key: string]: string }
  export default classes
}

declare module '*.less' {
  const content: string
  export default content
}

interface ImportMetaEnv {
  readonly VITE_BASE_API: string
  readonly VITE_APP_TITLE: string
  readonly VITE_PORT: string
  readonly VITE_USE_MOCK: string
  readonly VITE_DEBUG: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
