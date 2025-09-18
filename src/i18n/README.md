# 没有类型安全的 i18n 使用指南

## 基本用法
### 1. 使用 react-i18next 的原生 useTranslation

```tsx
import { useTranslation } from 'react-i18next'

const MyComponent = () => {
  const { t } = useTranslation('common') // 指定命名空间
  
  return (
    <div>
      <h1>{t('welcome2')}</h1> // 不存在的键不会报错
      <p>{t('hello')} - {t('description')}</p>
      <p>{t('userGreeting', { username: 'React' })}</p>
    </div>
  )
}
```

# 类型安全的 i18n 使用指南（推荐）

## 概述

这个项目提供了类型安全的国际化解决方案，使用标准的 `useTranslation` API，同时提供完整的 TypeScript 类型提示。

## 基本用法

### 1. 使用 Common 命名空间（默认）

```tsx
import { useTranslation } from '@/i18n/hooks'

const MyComponent = () => {
  const { t } = useTranslation('common') // 指定命名空间
  
  return (
    <div>
      <h1>{t('welcome')}</h1>
      <p>{t('hello')} - {t('description')}</p>
      <p>{t('userGreeting', { username: 'React' })}</p>
    </div>
  )
}
```

### 2. 使用其他命名空间

```tsx
import { useTranslation } from '@/i18n/hooks'

const MyComponent = () => {
  // 使用不同的命名空间
  const { t: tNetwork } = useTranslation('network')
  const { t: tMyname } = useTranslation('myname')
  
  return (
    <div>
      <p>{tNetwork('operationSuccess')}</p>
      <p>{tNetwork('loadingText')}</p>
      <p>{tMyname('chm')} - {tMyname('ison')}</p>
    </div>
  )
}
```

### 3. 插值参数

```tsx
const { t } = useTranslation('common')

// 带参数的翻译
<p>{t('userGreeting', { username: 'John' })}</p>
<p>{t('itemCount', { count: 5 })}</p>
<p>{t('lastUpdated', { date: new Date().toLocaleString() })}</p>
```

## 可用的 Hook

- `useTranslation(namespace)` - 通用的类型安全翻译 hook，支持所有命名空间

支持的命名空间：
- `'common'` - 通用翻译文本
- `'network'` - 网络相关文本
- `'myname'` - 自定义命名空间

## 类型安全特性

- 完整的键名自动补全
- 编译时类型检查
- 插值参数类型验证
- 命名空间隔离
- 标准 react-i18next API

## 完整示例

```tsx
import { useTranslation } from '@/i18n/hooks'

const MyComponent = () => {
  // 使用不同的命名空间
  const { t } = useTranslation('common')
  const { t: tNetwork } = useTranslation('network')
  
  return (
    <div>
      {/* Common 命名空间 */}
      <h1>{t('welcome')}</h1>
      <p>{t('userGreeting', { username: 'React' })}</p>
      
      {/* Network 命名空间 */}
      <p>{tNetwork('operationSuccess')}</p>
      <p>{tNetwork('loadingText')}</p>
      
    </div>
  )
}
```
