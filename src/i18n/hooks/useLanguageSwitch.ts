import { useCallback } from 'react'
import { setLangStorage } from '../utils'
import i18n, { type SupportedLanguage } from '../index'

// 语言切换 hook
export function useLanguageSwitch() {
  const switchLanguage = useCallback((lang: SupportedLanguage) => {
    // 设置存储和URL
    setLangStorage(lang)

    // 更新i18n实例
    i18n.changeLanguage(lang)
  }, [])

  return {
    switchLanguage,
  }
}
