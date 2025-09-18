import { useState, useCallback } from 'react'

/**
 * 计数器自定义Hook
 * @param initialValue 初始值
 * @returns 计数器相关状态和方法
 */
export function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue)

  /**
   * 增加计数
   * @param step 步长，默认为 1
   */
  const increment = useCallback((step = 1) => {
    setCount((prev) => prev + step)
  }, [])

  /**
   * 减少计数
   * @param step 步长，默认为 1
   */
  const decrement = useCallback((step = 1) => {
    setCount((prev) => prev - step)
  }, [])

  /**
   * 重置计数
   */
  const reset = useCallback(() => {
    setCount(initialValue)
  }, [initialValue])

  return {
    count,
    increment,
    decrement,
    reset,
  }
}
