import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// 自动导入所有语言包
function loadLocaleMessages() {
  // 使用 import.meta.glob 自动导入所有语言文件
  const locales = import.meta.glob('./lang/*/*.ts', { eager: true })
  const messages: Record<string, Record<string, Record<string, string>>> = {}
  const namespaces: Set<string> = new Set()

  for (const path in locales) {
    // 匹配路径: ./lang/zh/common.ts -> [zh, common]
    const matched = path.match(/\.\/lang\/([^/]+)\/([^/]+)\.ts$/)
    if (matched && matched.length === 3) {
      const locale = matched[1]
      const namespace = matched[2]

      // 初始化语言对象
      if (!messages[locale]) {
        messages[locale] = {}
      }

      // 获取模块的默认导出，确保类型兼容
      const module = locales[path] as { default: Record<string, string> }
      messages[locale][namespace] = module.default

      // 收集命名空间
      namespaces.add(namespace)
    }
  }

  return {
    messages,
    namespaces: Array.from(namespaces),
  }
}

const { messages: resources, namespaces } = loadLocaleMessages()


i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'zh',
    debug: import.meta.env.DEV,

    // 语言检测选项
    detection: {
      order: ['querystring', 'localStorage', 'navigator', 'htmlTag'],
      lookupQuerystring: 'lang',
      lookupLocalStorage: 'app_lang',
      caches: ['localStorage'],
    },

    interpolation: {
      escapeValue: false,
    },

    // 动态命名空间设置
    ns: namespaces,
    defaultNS: 'common',
  })

// 支持的语言类型
export type SupportedLanguage = 'zh' | 'en'

// 获取可用的语言列表 - ['zh', 'en']
export const getAvailableLocales = () => Object.keys(resources)

// 获取可用的命名空间列表 - ['common', 'network']
export const getAvailableNamespaces = () => namespaces

// 动态添加国际化辅助函数
export const addResourceBundle = (locale: string, namespace: string, resource: Record<string, string>) => {
  i18n.addResourceBundle(locale, namespace, resource, true, true)
}

export default i18n
