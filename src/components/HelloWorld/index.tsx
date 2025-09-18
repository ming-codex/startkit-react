import React, { useMemo } from 'react'
import { Button, Table, Tooltip } from 'antd'
import { useLanguageSwitch } from '@/i18n/hooks'
import { useCounter } from './hooks/useCounter'
import { useTranslation } from '@/i18n/hooks'
import type { HelloWorldProps } from './types'
import './assets/styles.less'

const HelloWorld: React.FC<HelloWorldProps> = ({ msg }) => {
  const { t } = useTranslation('common')

  // 使用自定义hooks
  const { switchLanguage } = useLanguageSwitch()

  const { count, increment } = useCounter()

  // 优化：使用 useMemo 缓存表格数据，避免每次渲染重新创建
  const dataSource = useMemo(
    () => [
      {
        key: '1',
        name: '张三',
        age: 32,
        address: '北京市朝阳区',
      },
      {
        key: '2',
        name: '李四',
        age: 28,
        address: '上海市浦东新区',
      },
      {
        key: '3',
        name: '王五',
        age: 35,
        address: '广州市天河区',
      },
    ],
    []
  )

  // 优化：使用 useMemo 缓存列配置，只在翻译函数变化时重新计算
  const columns = useMemo(
    () => [
      {
        title: t('name'),
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: t('age'),
        dataIndex: 'age',
        key: 'age',
      },
      {
        title: t('address'),
        dataIndex: 'address',
        key: 'address',
      },
    ],
    [t]
  )

  return (
    <div className="hello-world">
      <h1 className="hello-world__title">{msg}</h1>

      <div className="hello-world__language-switcher">
        <Tooltip title="切换到中文">
          <Button onClick={() => switchLanguage('zh')}>中文</Button>
        </Tooltip>
        <Tooltip title="Switch to English">
          <Button onClick={() => switchLanguage('en')} style={{ marginLeft: 8 }}>
            English
          </Button>
        </Tooltip>
      </div>

      <div className="hello-world__welcome">{t('welcome')}</div>

      <Table className="hello-world__table" dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} />

      <div className="hello-world__counter">
        <button type="button" className="hello-world__counter-button" onClick={() => increment()}>
          count is {count}
        </button>
      </div>
    </div>
  )
}

export default HelloWorld
