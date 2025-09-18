# StartKit React

> 基于 React 19 + TypeScript + Vite 的现代化前端项目模板

## 项目概述

这是一个功能完整、开箱即用的 React 项目模板，集成了现代前端开发的最佳实践。采用了最新的 React 19 和完整的 TypeScript 支持，配备了企业级的 HTTP 客户端请求、完善的国际化方案和友好的开发体验。

## 核心特性

- **极速开发** - Vite 驱动的闪电式热更新，支持 HMR 和快速构建
- **完整国际化** - 智能语言检测、模块化语言包、动态切换
- **企业级 HTTP** - 防重复请求、智能重试、多种加载模式、统一错误处理
- **EventBus 通信** - 轻量级事件总线，支持组件间解耦通信
- **TypeScript** - 完整类型定义，提供优秀的 IDE 开发体验
- **Ant Design** - 企业级 UI 组件库，开箱即用
- **轻量状态管理** - 使用 Zustand 替代 Redux
- **完善工程化** - ESLint + Prettier + EditorConfig 统一代码规范

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview

# 代码检查
npm run lint
```

## 项目结构

```
src/
├── components/          # 可复用组件
│   ├── HelloWorld/      # 组件示例（嵌套结构）
│   │   ├── hooks/       # 组件相关的自定义hooks
│   │   ├── types/       # 组件类型定义
│   │   └── assets/      # 组件样式和资源
│   └── AntdConfigProvider.tsx
├── pages/              # 页面组件
│   ├── HomeView.tsx
│   └── AboutView.tsx
├── router/             # 路由配置
├── stores/             # Zustand 状态管理
├── utils/              # 工具函数
│   ├── http.ts         # 企业级 HTTP 客户端
│   ├── eventBus.ts     # EventBus 事件总线
├── i18n/               # 国际化配置
│   ├── hooks/          # i18n 相关 hooks
│   ├── lang/           # 多语言文件
│   │   ├── zh/         # 中文语言包
│   │   └── en/         # 英文语言包
│   └── index.ts        # i18n 主配置
├── config/             # 配置文件
├── types/              # 全局TypeScript 类型定义
└── assets/             # 静态资源
```

## 核心功能详解

### 智能国际化系统

#### 特性亮点
- **自动语言检测** - 支持 URL 参数(?lang=en)、localStorage、浏览器语言检测
- **模块化语言包** - 按功能模块组织(common、network)，便于维护和扩展
- **动态语言切换** - 无需刷新页面，组件自动重渲染
- **命名空间支持** - 避免语言键冲突，支持按模块加载

#### 使用示例
```typescript
// 组件中使用
const { t } = useTranslation('common')
const message = t('hello') // 获取当前语言的文案

// 语言切换
const { switchLang } = useLanguageSwitch()
switchLang('en') // 切换到英文
```

### 企业级 HTTP 客户端

#### 核心功能
- **请求防重复** - 自动取消重复请求，避免资源浪费
- **智能重试机制** - 网络异常时自动重试，提升请求成功率
- **多种加载提示** - 支持 Antd、Store、Event 三种加载模式
- **统一错误处理** - 自动处理 HTTP 状态码和业务错误码
- **文件上传/下载** - 完整的文件处理方案
- **请求拦截器** - 自动添加 Token，处理认证逻辑

#### 使用示例
```typescript
import { http } from '@/utils/http'

// GET 请求
const response = await http.get('/api/users', { page: 1, size: 10 })

// POST 请求
const result = await http.post('/api/users', { name: 'John' }, {
  showSuccess: true,  // 显示成功提示
  retry: 2           // 失败时重试2次
})

// 文件上传
await http.upload('/api/upload', file)

// 文件下载
await http.download('/api/download/file.pdf', 'report.pdf')
```

### EventBus 组件间通信

#### 核心功能
- **事件发布订阅** - 支持事件的发布、订阅和取消订阅
- **一次性监听** - 支持只触发一次的事件监听
- **自动清理** - 组件卸载时需要手动清理订阅，避免内存泄漏
- **类型安全** - 完整的 TypeScript 类型定义
- **错误处理** - 监听器异常不会影响其他监听器

#### 使用示例
```typescript
import { eventBus } from '@/utils/eventBus'

// React组件中使用
const MyComponent = () => {
  useEffect(() => {
    // 订阅事件
    const unsubscribe = eventBus.on('user:login', (userData) => {
      console.log('用户登录:', userData)
    })
    
    // 组件卸载时清理订阅
    return unsubscribe
  }, [])
  
  // 发布事件
  const handleClick = () => {
    eventBus.emit('user:login', { userId: '123', username: '张三' })
  }
  
  return <button onClick={handleClick}>登录</button>
}

// 一次性监听
eventBus.once('app:init', () => {
  console.log('应用初始化完成')
})

// 通知系统示例
eventBus.emit('notification:show', {
  type: 'success',
  message: '操作成功！'
})
```

### 开发体验优化

- **TypeScript 完整支持** - 所有组件、工具函数都有完整的类型定义
- **Vite 极速构建** - 开发服务器秒启动，HMR 毫秒级更新
- **代码规范统一** - ESLint + Prettier 自动格式化，EditorConfig 统一编辑器配置
- **组件化设计** - 模块化组件结构，支持嵌套组件和自定义 Hooks
- **路由懒加载** - 自动代码分割，优化加载性能

### 状态管理

使用轻量级的 Zustand 替代 Redux：

```typescript
// stores/loading.ts
export const useLoadingStore = create<LoadingState>((set) => ({
  isLoading: false,
  loadingText: '',
  setLoading: (loading: boolean, text?: string) => {
    set({ isLoading: loading, loadingText: text })
  }
}))
```

## 完整技术栈

### 核心框架
| 技术 | 版本 | 说明 |
|------|------|------|
| **React** | 19.1.1 | 核心前端框架，使用最新的 Hooks API |
| **TypeScript** | 5.9.2 | 类型安全的 JavaScript 超集 |
| **Vite** | 7.1.5 | 现代化构建工具，提供快速开发体验 |

### 路由和状态管理
| 技术 | 版本 | 说明 |
|------|------|------|
| **React Router** | 7.9.1 | 官方路由管理器 |
| **Zustand** | 5.0.8 | 轻量级状态管理库 |

### UI 和样式
| 技术 | 版本 | 说明 |
|------|------|------|
| **Ant Design** | 5.27.4 | 企业级 UI 设计语言 |
| **Less** | 4.4.1 | CSS 预处理器 |

### 国际化
| 技术 | 版本 | 说明 |
|------|------|------|
| **i18next** | 25.5.2 | 强大的国际化框架 |
| **react-i18next** | 15.7.3 | React 国际化解决方案 |
| **i18next-browser-languagedetector** | 8.2.0 | 浏览器语言检测插件 |

### 开发工具
| 技术 | 版本 | 说明 |
|------|------|------|
| **ESLint** | 9.35.0 | 代码质量检查 |
| **Prettier** | 3.6.2 | 代码格式化 |
| **Terser** | 5.44.0 | 代码压缩优化 |

## 使用场景

- **企业级中后台管理系统** - 完整的权限管理、数据展示和操作界面
- **多语言国际化应用** - 面向全球用户的产品
- **团队协作开发项目** - 统一的代码规范和开发流程
- **React 学习和实践** - 学习现代 React 开发最佳实践
- **快速原型开发** - 快速构建产品 MVP

## 项目亮点

### 1. 现代化开发体验
- Vite 提供极速的热更新和构建体验
- 完整的 TypeScript 类型支持，IDE 智能提示
- React 19 最新特性支持

### 2. 企业级功能
- 完整的 HTTP 客户端解决方案，开箱即用
- EventBus 事件总线，支持组件间解耦通信
- 国际化支持，轻松扩展多语言
- 轻量级状态管理，性能优异

### 3. 代码质量保障
- ESLint + Prettier 确保代码规范一致
- EditorConfig 统一编辑器配置
- 完整的 TypeScript 类型定义
- 模块化的组件和工具设计

### 4. 性能优化
- React 组件懒加载
- 代码分割优化加载性能
- Vite 原生 ES 模块支持

## 总结

这个模板为你提供了完整的现代化 React 开发环境，集成了企业级应用开发所需的所有功能。无论是构建大型企业应用还是学习 React 最佳实践，都能为你提供优秀的开发体验和代码质量保障。