import React, { useState, useEffect, useMemo } from 'react'
import { ConfigProvider } from 'antd'
import { getLang } from '@/i18n/utils'
import enUS from 'antd/locale/en_US'
import zhCN from 'antd/locale/zh_CN'
import i18n from '@/i18n'

interface AntdConfigProviderProps {
  children: React.ReactNode
}

// 预定义语言映射，避免每次渲染时重新计算
const LOCALE_MAP = {
  zh: zhCN,
  en: enUS,
} as const

const AntdConfigProvider: React.FC<AntdConfigProviderProps> = ({ children }) => {
  const [currentLang, setCurrentLang] = useState(getLang())

  useEffect(() => {
    // 监听 i18n 语言变化事件
    const handleLanguageChange = (lng: string) => {
      setCurrentLang(lng)
    }

    i18n.on('languageChanged', handleLanguageChange)

    return () => {
      i18n.off('languageChanged', handleLanguageChange)
    }
  }, [])

  // 使用 useMemo 缓存 locale 对象
  const locale = useMemo(() => {
    return LOCALE_MAP[currentLang as keyof typeof LOCALE_MAP] || zhCN
  }, [currentLang])

  return <ConfigProvider locale={locale}>{children}</ConfigProvider>
}

export default AntdConfigProvider
