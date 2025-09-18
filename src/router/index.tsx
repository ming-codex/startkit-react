import { createHashRouter } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import Loading from '../components/Loading'

// 懒加载组件
const HomeView = lazy(() => import('../pages/HomeView'))
const AboutView = lazy(() => import('../pages/AboutView'))
const EventBusDemo = lazy(() => import('../components/EventBusDemo'))

// 路由配置
export const router = createHashRouter([
  {
    path: '/',
    element: (
      <Suspense>
        <HomeView />
      </Suspense>
    ),
  },
  {
    path: '/about',
    element: (
      <Suspense fallback={<Loading />}>
        <AboutView />
      </Suspense>
    ),
  },
  {
    path: '/eventbus',
    element: (
      <Suspense fallback={<Loading />}>
        <EventBusDemo />
      </Suspense>
    ),
  },
])

export default router
