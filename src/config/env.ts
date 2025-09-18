// 环境变量配置
export const env = {
  // API 基础地址
  baseAPI: import.meta.env.VITE_BASE_API || (import.meta.env.DEV ? 'http://localhost:3000/api' : '/api'),

  // 应用标题
  appTitle: import.meta.env.VITE_APP_TITLE || 'startkit-react',

  // 应用端口
  port: import.meta.env.VITE_PORT || '5173',

  // 是否启用 Mock
  useMock: import.meta.env.VITE_USE_MOCK === 'true' || import.meta.env.DEV,

  // 是否为开发环境
  isDev: import.meta.env.DEV,

  // 是否为生产环境
  isProd: import.meta.env.PROD,

  // 调试模式
  debug: import.meta.env.VITE_DEBUG === 'true' || import.meta.env.DEV,
}

// 打印环境信息（仅开发环境）
if (env.isDev) {
  console.log('🚀 环境配置:', env)
}

export default env
