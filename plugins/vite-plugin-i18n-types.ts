import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

async function extractKeys(dir: string, prefix = ''): Promise<string[]> {
  const keys: string[] = []

  for (const file of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, file)
    const stat = fs.statSync(fullPath)

    if (stat.isDirectory()) {
      keys.push(...(await extractKeys(fullPath, prefix ? `${prefix}.${file}` : file)))
    } else if (file.endsWith('.ts')) {
      const name = file.replace(/\.ts$/, '')
      const keyPrefix = prefix ? `${prefix}.${name}` : name

      try {
        const mod = await import(`file://${fullPath}?t=${Date.now()}`)
        keys.push(...flattenObject(mod.default, keyPrefix))
      } catch (error) {
        console.warn(`无法导入文件 ${fullPath}:`, error)
      }
    }
  }
  return keys
}

function flattenObject(obj: Record<string, unknown>, prefix: string): string[] {
  if (typeof obj !== 'object' || obj === null) return [prefix]

  return Object.entries(obj).flatMap(([key, value]) => {
    const newKey = `${prefix}.${key}`
    return typeof value === 'object' && value !== null ? [newKey, ...flattenObject(value as Record<string, unknown>, newKey)] : [newKey]
  })
}

async function genTypes() {
  const LOCALES_DIR = path.resolve(__dirname, '../src/i18n/lang')
  const OUTPUT_FILE = path.resolve(__dirname, '../src/types/i18n.d.ts')

  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true })

  // 获取所有命名空间
  const namespaces = fs.readdirSync(path.join(LOCALES_DIR, 'zh'))
    .filter(file => file.endsWith('.ts'))
    .map(file => file.replace(/\.ts$/, ''))

  const keys = await extractKeys(path.join(LOCALES_DIR, 'zh'))

  // 生成命名空间类型导入
  const importStatements = namespaces
    .map(ns => `import type ${capitalize(ns)}Zh from '../i18n/lang/zh/${ns}'`)
    .join('\n')

  // 生成命名空间资源映射
  const namespaceResources = namespaces
    .map(ns => `  ${ns}: typeof ${capitalize(ns)}Zh`)
    .join('\n')

  // 生成自动类型推导工具和各命名空间的键类型
  const namespaceKeyTypes = `// 自动生成命名空间内的键类型（无需手动维护）
export type NamespaceKeys<T extends keyof NamespaceResources> = keyof NamespaceResources[T]

// 为了向后兼容，保留具体的键类型导出
${namespaces.map(ns => `export type ${capitalize(ns)}Keys = NamespaceKeys<'${ns}'>`).join('\n')}`

  const typeDef = `// React i18next 类型定义文件 - 自动生成，请勿手动修改

// 导入所有语言包类型
${importStatements}

// 定义命名空间映射类型
export type NamespaceResources = {
${namespaceResources}
}

// 定义所有可用的翻译键
export type MessageKeys = ${keys.map((k) => `'${k}'`).join(' | ')}

// 定义命名空间内的键类型
${namespaceKeyTypes}

// 定义插值参数类型
export type InterpolationOptions = Record<string, string | number | boolean | null | undefined>

// 定义翻译函数的重载类型
export interface TypedTranslationFunction {
  // 使用默认命名空间（common）
  (key: CommonKeys, options?: InterpolationOptions): string
  // 使用完整的 namespace:key 格式
  (key: MessageKeys, options?: InterpolationOptions): string
  // 指定命名空间的重载
  <T extends keyof NamespaceResources>(
    key: keyof NamespaceResources[T],
    options?: InterpolationOptions & { ns?: T }
  ): string
}

// 扩展 react-i18next 的类型定义
declare module 'react-i18next' {
  interface CustomTypeOptions {
    // 自定义命名空间
    defaultNS: 'common'
    // 资源类型
    resources: NamespaceResources
    // 返回对象类型（用于嵌套翻译）
    returnObjects: false
    // 启用严格类型检查
    returnNull: false
  }

  // 扩展 useTranslation hook 的返回类型
  interface UseTranslationResponse {
    t: TypedTranslationFunction
    i18n: object
    ready: boolean
  }
}

export {}`

  fs.writeFileSync(OUTPUT_FILE, typeDef, 'utf-8')
  console.log(`✅ i18n 类型文件已生成: ${OUTPUT_FILE}`)
  console.log(`i18n命名空间: [${namespaces.join(', ')}] `)
}

// 导出插件函数
export default function I18nTypesPlugin() {
  return {
    name: 'vite-plugin-i18n-types',
    async buildStart() {
      await genTypes()
    },
    handleHotUpdate: async (ctx: { file: string }) => {
      if (ctx.file.includes('/i18n/lang/')) {
        await genTypes()
      }
    },
  }
}

// 如果直接执行此文件，则运行类型生成
if (import.meta.url.endsWith(process.argv[1]?.replace(/\\/g, '/'))) {
  genTypes().catch(console.error)
}
