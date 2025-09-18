import React, { useState, useEffect } from 'react'
import { Button, Card, Input, Space, Typography, Badge, message, Row, Col } from 'antd'
import { eventBus } from '@/utils/eventBus'

const { Title, Text } = Typography

/**
 * EventBus 演示组件
 */

// 消息通信演示 - 展示基础的发布订阅模式
const MessageDemo: React.FC = () => {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<string[]>([])

  useEffect(() => {
    const unsubscribe = eventBus.on<string>('demo:message', (msg) => {
      setMessages((prev) => [...prev.slice(-2), msg]) // 只保留最新3条
      message.info(`收到消息: ${msg}`)
    })
    return unsubscribe
  }, [])

  const sendMessage = () => {
    if (input.trim()) {
      eventBus.emit('demo:message', input)
      setInput('')
    }
  }

  return (
    <Card title="消息通信" size="small" style={{ height: '100%' }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Text type="secondary">演示基础的发布订阅模式</Text>

        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="输入消息内容"
          onPressEnter={sendMessage}
        />

        <Button type="primary" onClick={sendMessage} block>
          发布消息
        </Button>

        <div style={{ marginTop: 12 }}>
          <Text strong>消息历史:</Text>
          <div style={{ marginTop: 8, minHeight: 60 }}>
            {messages.length === 0 ? (
              <Text type="secondary">暂无消息</Text>
            ) : (
              messages.map((msg, i) => (
                <div key={i} style={{ marginBottom: 4 }}>
                  <Text code>{msg}</Text>
                </div>
              ))
            )}
          </div>
        </div>
      </Space>
    </Card>
  )
}

//  状态同步演示 - 展示跨组件状态管理
const StateDemo: React.FC = () => {
  const [count, setCount] = useState(0)
  const [user, setUser] = useState<string | null>(null)

  useEffect(() => {
    // 监听计数器更新
    const unsubscribe1 = eventBus.on<number>('demo:counter', (newCount) => {
      setCount(newCount)
    })

    // 监听用户状态
    const unsubscribe2 = eventBus.on<string>('demo:login', (username) => {
      setUser(username)
      message.success(`${username} 已登录`)
    })

    const unsubscribe3 = eventBus.on('demo:logout', () => {
      setUser(null)
      message.info('已退出登录')
    })

    return () => {
      unsubscribe1()
      unsubscribe2()
      unsubscribe3()
    }
  }, [])

  const updateCount = (delta: number) => {
    const newCount = Math.max(0, count + delta)
    eventBus.emit('demo:counter', newCount)
  }

  return (
    <Card title="状态同步" size="small" style={{ height: '100%' }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Text type="secondary">演示跨组件状态管理</Text>

        {/* 计数器控制 */}
        <div>
          <Text strong>计数器: </Text>
          <Badge count={count} style={{ marginLeft: 8 }} />
        </div>

        <Space style={{ width: '100%', justifyContent: 'center' }}>
          <Button onClick={() => updateCount(-1)} disabled={count === 0}>
            -
          </Button>
          <Text strong style={{ minWidth: 30, textAlign: 'center' }}>
            {count}
          </Text>
          <Button onClick={() => updateCount(1)}>+</Button>
          <Button onClick={() => eventBus.emit('demo:counter', 0)} size="small">
            重置
          </Button>
        </Space>

        {/* 用户状态控制 */}
        <div style={{ marginTop: 16 }}>
          <Text strong>用户状态:</Text>
          <div style={{ marginTop: 8 }}>
            {user ? (
              <Space direction="vertical" style={{ width: '100%' }}>
                <Text>
                  当前用户: <Text strong>{user}</Text>
                </Text>
                <Button onClick={() => eventBus.emit('demo:logout')} block>
                  退出登录
                </Button>
              </Space>
            ) : (
              <Button
                type="primary"
                onClick={() => eventBus.emit('demo:login', '用户' + Date.now().toString().slice(-3))}
                block
              >
                模拟登录
              </Button>
            )}
          </div>
        </div>
      </Space>
    </Card>
  )
}

// 主演示组件
const EventBusDemo: React.FC = () => {
  return (
    <div style={{ padding: '24px', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <Title level={2}>EventBus 演示</Title>
        <Text type="secondary" style={{ fontSize: 16 }}>
          EventBus的用法
        </Text>
      </div>

      <Row gutter={[24, 24]} style={{ minHeight: 400 }}>
        <Col xs={24} lg={12}>
          <MessageDemo />
        </Col>
        <Col xs={24} lg={12}>
          <StateDemo />
        </Col>
      </Row>
    </div>
  )
}

export default EventBusDemo
