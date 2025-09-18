import React, { useState, useEffect } from 'react'
import { ConfigProvider } from 'antd'
import { getLang } from '@/i18n/utils'
import type { Locale } from 'antd/es/locale'

interface AntdConfigProviderProps {
  children: React.ReactNode
}

const AntdConfigProvider: React.FC<AntdConfigProviderProps> = ({ children }) => {
  const [locale, setLocale] = useState<Locale | undefined>(undefined)

  useEffect(() => {
    const loadLocale = async () => {
      const currentLang = getLang()

      try {
        let localeData: Locale
        switch (currentLang) {
          case 'en':
            localeData = (await import('antd/locale/en_US')).default
            break
          case 'zh':
          default:
            localeData = (await import('antd/locale/zh_CN')).default
            break
        }
        setLocale(localeData)
      } catch (error) {
        console.warn('Failed to load locale:', error)
        // 如果加载失败，使用默认（英文）
        const defaultLocale = (await import('antd/locale/en_US')).default
        setLocale(defaultLocale)
      }
    }

    loadLocale()
  }, [])

  // 在locale加载完成前，先渲染无locale的ConfigProvider
  return <ConfigProvider locale={locale}>{children}</ConfigProvider>
}

export default AntdConfigProvider
