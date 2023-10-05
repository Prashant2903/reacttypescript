/* eslint-disable indent */
import React, { lazy } from 'react'
import { Outlet, Navigate, createBrowserRouter } from 'react-router-dom'
import App from '@/App'
import { AppEnvEnum } from '@/constants/enums'
import environment from '@/environment'
import routerSubscriber from './routerSubscriber'

// Use dynamic loading (code splitting) to avoid getting the entire package of js files that may not be used when you first visit the website.
// Please group according to the page type. The packaging will be separated into a js file with a name set by webpackChunkName according to the grouping.
const HomeLayout = lazy(() => import(/* webpackChunkName: "home" */ '@/pages/Home'))
const EditProfile = lazy(() => import(/* webpackChunkName: "home" */ '@/pages/Home/EditProfile'))
const Main = lazy(() => import(/* webpackChunkName: "home" */ '@/pages/Home/Main'))
const PublicLayout = lazy(() => import(/* webpackChunkName: "public" */ '@/pages/Public'))
const Landing = lazy(() => import(/* webpackChunkName: "public" */ '@/pages/Public/Landing'))
const Login = lazy(() => import(/* webpackChunkName: "public" */ '@/pages/Public/Login'))
const Sample = lazy(() => import(/* webpackChunkName: "dev" */ '@/pages/Dev/Sample'))

const Suspense = (component: JSX.Element) => <React.Suspense fallback={<>...</>}>
  {component}
</React.Suspense>

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Navigate to='home' replace /> },

      /* Public Page Area */
      {
        path: 'public',
        element: Suspense(<PublicLayout />),
        children: [
          { index: true, element: <Navigate to='landing' replace /> },
          { path: 'landing', element: Suspense(<Landing />) },
          { path: 'login', element: Suspense(<Login />) }
        ]
      },

      /* Private Page Area */
      {
        path: 'home',
        element: Suspense(<HomeLayout />),
        children: [
          { index: true, element: <Navigate to='main' replace /> },
          { path: 'main', element: Suspense(<Main />) },
          { path: 'edit-profile', element: Suspense(<EditProfile />) },
          { path: '*', element: <Navigate to='main' replace /> }
        ]
      },

      /* Development Specific Page Area */
      environment.appEnv === AppEnvEnum.DEVELOPMENT
        ? {
          path: 'dev',
          element: <Outlet />,
          children: [
            { index: true, element: <Navigate to='sample' replace /> },
            { path: 'sample/:userId', element: Suspense(<Sample />) },
            { path: 'sample', element: Suspense(<Sample />) }
          ]
        }
        : {},

      /* Default Page */
      { path: '*', element: <Navigate to='public' replace /> }

    ]
  }
], {
  basename: process.env.PUBLIC_URL
})

// Subscribe to route change events
router.subscribe(routerSubscriber)

// Provides a redirection method that can be used outside the component
// - Using the navigate method provided by useNavigator within the component will contain basename
// - But using router.navigate directly does not contain basename, so we need to encapsulate it
export const appNavigate = (url: string) => {
  router.navigate({ pathname: router.basename + url })
}

export default router
