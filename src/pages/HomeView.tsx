import React from 'react'
import { useTranslation } from '@/i18n/hooks'
import { Space, Button } from 'antd'
import { Link } from 'react-router-dom'
import HelloWorld from '@/components/HelloWorld'

const HomeView: React.FC = () => {
  const { t } = useTranslation('common')

  return (
    <main>
      <HelloWorld msg={t('hello')} />
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <Space>
          <Link to="/about">
            <Button type="primary">关于页面</Button>
          </Link>
          <Link to="/eventbus">
            <Button type="primary">EventBus 示例</Button>
          </Link>
        </Space>
      </div>
    </main>
  )
}

export default HomeView
