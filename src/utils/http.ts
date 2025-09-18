import { message } from 'antd'
import i18n from '@/i18n'
import env from '@/config/env'

// ==================== 配置常量 ====================
const BASE_URL = env.baseAPI
const TIMEOUT = 15000
const t = i18n.t.bind(i18n)

// ==================== 类型定义 ====================
interface RequestOptions extends RequestInit {
  preventDuplicate?: boolean
  showLoading?: boolean
  showSuccess?: boolean
  needToken?: boolean
  retry?: number
  params?: Record<string, string | number | boolean | null | undefined>
}

interface LoadingConfig {
  type: 'antd' | 'store' | 'event' | 'none'
  antdOptions?: {
    content?: string
    duration?: number
  }
}

// 响应数据类型
interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}

// ==================== 全局状态 ====================
const pendingRequests = new Map<string, AbortController>()
let loadingInstance: (() => void) | null = null
let loadingCount = 0

const defaultLoadingConfig: LoadingConfig = {
  type: 'antd',
  antdOptions: {
    content: '加载中...',
    duration: 0,
  },
}

// ==================== 工具函数 ====================
const generateReqKey = (url: string, method: string, params?: Record<string, unknown>, body?: unknown): string =>
  [url, method, JSON.stringify(params || {}), JSON.stringify(body || {})].join('&')

const buildUrlWithParam = (
  baseUrl: string,
  params?: Record<string, string | number | boolean | null | undefined>
): string => {
  if (!params || Object.keys(params).length === 0) return baseUrl

  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      searchParams.append(key, String(value))
    }
  })

  const queryString = searchParams.toString()
  return queryString ? `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}${queryString}` : baseUrl
}

// ==================== 请求管理 ====================
const addPendingRequest = (key: string, controller: AbortController) => {
  if (!pendingRequests.has(key)) pendingRequests.set(key, controller)
}

const removePendingRequest = (key: string) => {
  pendingRequests.delete(key)
}

const cancelPendingRequest = (key: string) => {
  const controller = pendingRequests.get(key)
  if (controller) {
    controller.abort(t('network.duplicateRequest'))
    pendingRequests.delete(key)
  }
}

// ==================== Loading 管理 ====================
const showLoading = (config: LoadingConfig = defaultLoadingConfig) => {
  loadingCount++
  if (loadingCount !== 1) return

  switch (config.type) {
    case 'antd':
      loadingInstance = message.loading(
        config.antdOptions?.content ?? t('network.loadingText'),
        config.antdOptions?.duration ?? 0
      )
      break
    case 'store':
      import('@/stores/loading')
        .then(({ useLoadingStore }) => useLoadingStore.getState().setLoading(true, t('network.loadingText')))
        .catch((error) => console.warn('Loading store not available:', error))
      break
    case 'event':
      window.dispatchEvent(new CustomEvent('loading:show', { detail: { text: t('network.loadingText') } }))
      break
  }
}

const hideLoading = (config: LoadingConfig = defaultLoadingConfig) => {
  loadingCount = Math.max(0, loadingCount - 1)
  if (loadingCount > 0) return

  switch (config.type) {
    case 'antd':
      if (loadingInstance) {
        loadingInstance()
        loadingInstance = null
      }
      break
    case 'store':
      import('@/stores/loading')
        .then(({ useLoadingStore }) => useLoadingStore.getState().setLoading(false))
        .catch((error) => console.warn('Loading store not available:', error))
      break
    case 'event':
      window.dispatchEvent(new CustomEvent('loading:hide'))
      break
  }
}

// ==================== 错误处理 ====================
const handleErrorResponse = async (response: Response) => {
  const errorMessages: Record<number, string> = {
    401: t('network.unauthorized'),
    403: t('network.forbidden'),
    404: t('network.notFound'),
    500: t('network.serverError'),
  }

  message.error(errorMessages[response.status] || t('network.networkError'))

  if (response.status === 401) {
    localStorage.removeItem('token')
    window.location.href = '/login'
  }
}

const handleError = (error: unknown) => {
  const err = error as Error
  if (err?.name === 'AbortError') {
    message.error(err.message || t('network.requestCanceled'))
  } else if (err?.message?.includes('Failed to fetch')) {
    message.error(t('network.networkConnectionFailed'))
  } else {
    message.error(err?.message || t('network.requestSendFailed'))
  }
}

// ==================== Http 客户端类 ====================
class HttpClient {
  /**
   * 通用请求方法
   */
  private async coreRequest<T = unknown>(url: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    // 解构配置
    const {
      method = 'GET',
      preventDuplicate = true,
      showLoading: needLoading = true,
      showSuccess = false,
      needToken = true,
      retry = 0,
      params,
      headers: customHeaders,
      ...restOptions
    } = options

    // 初始化
    const controller = new AbortController()
    const reqKey = generateReqKey(url, method, params, restOptions.body)
    const requestUrl = buildUrlWithParam(BASE_URL + url, params)

    // 构建请求头
    const headers: Record<string, string> = {
      'Content-Type': 'application/json;charset=utf-8',
    }
    if (customHeaders) {
      Object.assign(headers, customHeaders)
    }
    if (needToken) {
      const token = localStorage.getItem('token')
      if (token) headers['Authorization'] = `Bearer ${token}`
    }

    // 重复请求处理
    if (preventDuplicate) {
      cancelPendingRequest(reqKey)
      addPendingRequest(reqKey, controller)
    }

    // 显示loading
    if (needLoading) showLoading()

    // 设置超时
    const timeoutId = setTimeout(() => {
      controller.abort(t('network.requestTimeout'))
    }, TIMEOUT)

    const cleanup = () => {
      clearTimeout(timeoutId)
      removePendingRequest(reqKey)
      if (needLoading) hideLoading()
    }

    try {
      // 发送请求
      const response = await fetch(requestUrl, {
        method,
        headers,
        signal: controller.signal,
        ...restOptions,
      })

      cleanup()

      // 检查响应状态
      if (!response.ok) {
        await handleErrorResponse(response)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // 解析响应
      const data = await response.json()

      // 业务状态码处理
      if (data.code === 200) {
        if (showSuccess) {
          message.success(data.message || t('network.operationSuccess'))
        }
        return data
      } else {
        message.error(data.message || t('network.operationFailed'))
        throw new Error(data.message)
      }
    } catch (error: unknown) {
      cleanup()

      const err = error as Error
      // 重复请求不需要处理
      if (err?.name === 'AbortError' && err.message?.includes(t('network.duplicateRequest'))) {
        return Promise.reject(error)
      }

      // 重试机制
      if (retry > 0) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        return this.coreRequest<T>(url, { ...options, retry: retry - 1 })
      }

      // 错误处理
      handleError(error)
      return Promise.reject(error)
    }
  }

  /**
   * GET 请求
   */
  async get<T = unknown>(
    url: string,
    params?: Record<string, string | number | boolean | null | undefined>,
    options?: Omit<RequestOptions, 'method' | 'params'>
  ): Promise<ApiResponse<T>> {
    return this.coreRequest<T>(url, {
      ...options,
      method: 'GET',
      params,
    })
  }

  /**
   * POST 请求
   */
  async post<T = unknown>(
    url: string,
    data?: unknown,
    options?: Omit<RequestOptions, 'method' | 'body'>
  ): Promise<ApiResponse<T>> {
    return this.coreRequest<T>(url, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  /**
   * PUT 请求
   */
  async put<T = unknown>(
    url: string,
    data?: unknown,
    options?: Omit<RequestOptions, 'method' | 'body'>
  ): Promise<ApiResponse<T>> {
    return this.coreRequest<T>(url, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  /**
   * DELETE 请求
   */
  async delete<T = unknown>(url: string, options?: Omit<RequestOptions, 'method'>): Promise<ApiResponse<T>> {
    return this.coreRequest<T>(url, {
      ...options,
      method: 'DELETE',
    })
  }

  /**
   * PATCH 请求
   */
  async patch<T = unknown>(
    url: string,
    data?: unknown,
    options?: Omit<RequestOptions, 'method' | 'body'>
  ): Promise<ApiResponse<T>> {
    return this.coreRequest<T>(url, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  /**
   * 文件上传
   */
  async upload<T = unknown>(
    url: string,
    file: File | FormData,
    options?: Omit<RequestOptions, 'method' | 'body' | 'headers'>
  ): Promise<ApiResponse<T>> {
    const formData = file instanceof FormData ? file : new FormData()
    if (file instanceof File) {
      formData.append('file', file)
    }

    return this.coreRequest<T>(url, {
      ...options,
      method: 'POST',
      body: formData,
      headers: {
        // 不设置 Content-Type，让浏览器自动设置
      },
    })
  }

  /**
   * 文件下载
   */
  async download(url: string, filename?: string, options?: Omit<RequestOptions, 'method'>): Promise<void> {
    try {
      const token = localStorage.getItem('token')
      const headers: Record<string, string> = {
        ...((options?.headers as Record<string, string>) || {}),
      }
      if (token) headers['Authorization'] = `Bearer ${token}`

      const response = await fetch(BASE_URL + url, {
        method: 'GET',
        headers,
      })

      if (!response.ok) {
        throw new Error(`Download failed: ${response.statusText}`)
      }

      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = filename || 'download'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)

      message.success(t('network.operationSuccess'))
    } catch (error) {
      console.error('Download error:', error)
      message.error(t('network.operationFailed'))
    }
  }
}

// ==================== 导出 ====================
export const http = new HttpClient()

// 导出配置函数
export const setLoadingConfig = (config: Partial<LoadingConfig>) => {
  Object.assign(defaultLoadingConfig, config)
}

// 导出类型
export type { RequestOptions, LoadingConfig, ApiResponse }
