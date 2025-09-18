import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
// Antd 5.x 使用 CSS-in-JS，无需单独导入样式文件

import './style.less'

// i18n 配置
import './i18n'

// 路由配置
import router from './router'

// Antd 动态配置提供者
import AntdConfigProvider from './components/AntdConfigProvider'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AntdConfigProvider>
      <RouterProvider router={router} />
    </AntdConfigProvider>
  </React.StrictMode>
)
