import React from 'react'
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

      <Table className="hello-world__table" dataSource={[]} columns={[]} pagination={{ pageSize: 5 }} />

      <div className="hello-world__counter">
        <button type="button" className="hello-world__counter-button" onClick={() => increment()}>
          count is {count}
        </button>
      </div>
    </div>
  )
}

export default HelloWorld
