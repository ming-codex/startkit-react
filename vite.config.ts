import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// 自动生成 i18n 类型文件
import I18nTypesPlugin from './plugins/vite-plugin-i18n-types'

export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), '')

  // 设置默认的环境变量
  const defaultEnv = {
    VITE_BASE_API: env.VITE_BASE_API || (mode === 'development' ? 'http://localhost:3000/api' : '/api'),
    VITE_APP_TITLE: env.VITE_APP_TITLE || 'startkit-react',
    VITE_PORT: env.VITE_PORT || '5173',
    VITE_USE_MOCK: env.VITE_USE_MOCK || (mode === 'development' ? 'true' : 'false'),
  }

  return {
    // 设置基础路径为相对路径，生成的静态资源路径将以 './' 开头
    base: './',

    // 定义全局常量替换
    define: {
      __APP_ENV__: JSON.stringify(defaultEnv),
    },

    plugins: [
      react(),
      // 只在开发模式下启用 i18n 类型插件，构建时通过独立脚本执行
      ...(mode === 'development' ? [{
        ...I18nTypesPlugin(),
      }] : [])
    ],

    resolve: {
      // 路径别名
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },

    // 开发服务器配置
    server: {
      port: parseInt(defaultEnv.VITE_PORT),
      open: true,
      proxy: {
        // 代理 API 请求
        '/api': {
          target: defaultEnv.VITE_BASE_API.replace('/api', ''),
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '/api'),
        },
      },
    },

    build: {
      // 设置合理的块大小警告限制
      chunkSizeWarningLimit: 900,
      // 打包配置
      rollupOptions: {
        output: {
          manualChunks: {
            // React相关库
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            // Antd单独打包
            'antd': ['antd'],
            // 国际化相关
            'i18n': ['i18next', 'react-i18next', 'i18next-browser-languagedetector'],
            // 状态管理
            'state': ['zustand']
          }
        }
      },
      // tree shaking
      minify: 'terser',
      terserOptions: {
        compress: {
          // 移除 console
          drop_console: true,
          // 移除 debugger
          drop_debugger: true,
          // 移除未使用的代码
          pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
          // 压缩
          passes: 2,
          unsafe: true,
          unsafe_comps: true,
          unsafe_math: true,
        },
        mangle: {
          // 混淆变量名
          safari10: true,
        },
      },
    },
  }
})
