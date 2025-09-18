/**
 * 增强版的 i18n hooks
 * 提供类型安全的 useTranslation 和语言切换功能
 */

import { useTranslation as useI18nTranslation } from 'react-i18next'
import type {
  NamespaceResources,
  InterpolationOptions,
} from '@/types/i18n'

// 导出语言切换 hook
export { useLanguageSwitch } from './hooks/useLanguageSwitch'

/**
 * 类型安全的 useTranslation hook
 * 使用方式：const { t } = useTranslation('common')
 * 自动识别所有可用的命名空间类型，无需手动维护
 */
export function useTranslation<T extends keyof NamespaceResources = 'common'>(
  namespace?: T
) {
  const { t: originalT, i18n, ready } = useI18nTranslation(namespace)

  // 自动推导命名空间对应的键类型
  const t = (
    key: keyof NamespaceResources[T],
    options?: InterpolationOptions
  ): string => {
    return originalT(key as string, options)
  }

  return {
    t,
    i18n,
    ready,
  }
}
