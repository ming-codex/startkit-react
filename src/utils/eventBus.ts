/**
 * EventBus 事件总线
 */

export type EventListener<T = unknown> = (data: T) => void

/**
 * 核心功能：订阅、发布、取消订阅
 */
class EventBus {
  private events = new Map<string, EventListener<unknown>[]>()

  /**
   * 订阅事件
   */
  on<T = unknown>(event: string, listener: EventListener<T>): () => void {
    const listeners = this.events.get(event) || []
    listeners.push(listener as EventListener<unknown>)
    this.events.set(event, listeners)

    // 返回取消订阅函数
    return () => this.off(event, listener)
  }

  /**
   * 发布事件
   */
  emit<T = unknown>(event: string, data?: T): void {
    const listeners = this.events.get(event)
    if (listeners) {
      // 复制数组避免在执行中被修改
      listeners.slice().forEach(listener => listener(data))
    }
  }

  /**
   * 取消订阅
   */
  off<T = unknown>(event: string, listener?: EventListener<T>): void {
    const listeners = this.events.get(event)
    if (!listeners) return

    if (listener) {
      const index = listeners.indexOf(listener as EventListener<unknown>)
      if (index > -1) {
        listeners.splice(index, 1)
        if (listeners.length === 0) {
          this.events.delete(event)
        }
      }
    } else {
      this.events.delete(event)
    }
  }

  /**
   * 一次性订阅
   */
  once<T = unknown>(event: string, listener: EventListener<T>): () => void {
    const onceListener: EventListener<T> = (data) => {
      listener(data)
      this.off(event, onceListener)
    }
    return this.on(event, onceListener)
  }

  /**
   * 清空所有事件
   */
  clear(): void {
    this.events.clear()
  }

  /**
   * 获取事件监听器数量
   */
  getListenerCount(event: string): number {
    return this.events.get(event)?.length || 0
  }

  /**
   * 获取所有事件名称
   */
  getEventNames(): string[] {
    return Array.from(this.events.keys())
  }
}

// 全局实例
export const eventBus = new EventBus()

// 导出类供创建多实例
export default EventBus


