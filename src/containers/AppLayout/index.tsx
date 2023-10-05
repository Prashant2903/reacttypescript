import { Navigate, NavLink, useLocation } from 'react-router-dom'
import { logout } from '@/store/slices/appSlice'
import useAppDispatch from '@/utils/hooks/useAppDispatch'
import useAppSelector from '@/utils/hooks/useAppSelector'
import logo from '@/assets/images/logo.svg'
import { PropsWithChildren } from 'react'
import clsx from 'clsx'

interface IProps {
  isAuthRequired?: boolean
}

const AppLayout = (props: PropsWithChildren<IProps>) => {
  const isLogin = useAppSelector(state => state.app.isLogin)
  const dispatch = useAppDispatch()
  const location = useLocation()

  if (props.isAuthRequired && !isLogin) {
    const currentPath = location.pathname
    return <Navigate to={`/public/login?redirect_url=${currentPath}`} />
  }

  const handleLogout = () => {
    dispatch(logout())
  }

  const getLinkClassName = ({ isActive }: { isActive: boolean }) => {
    return clsx('app-header__link', isActive && 'app-header__link--active')
  }

  return (
    <div className='ct-app-layout'>

      {/* Header */}
      <header className='app-header'>

        <img src={logo} alt='logo' className='app-header__logo' />
        <span className='app-header__title'>REACT</span>

        <ul className='app-header__nav'>

          {/* Not logged in menu */}
          {!isLogin && <>

            <li className='app-header__nav-item'>
              <NavLink className={getLinkClassName} to={'/dev/sample'}>Dev Sample</NavLink>
            </li>

            <li className='app-header__nav-item'>
              <NavLink className={getLinkClassName} to={'/public/login'}>Login</NavLink>
            </li>
          </>}

          {/* Logged into the menu */}
          {isLogin && <>

            <li className='app-header__nav-item'>
              <NavLink className={getLinkClassName} to={'/home/main'}>Main</NavLink>
            </li>

            <li className='app-header__nav-item'>
              <NavLink className={getLinkClassName} to={'/home/edit-profile'}>Profile</NavLink>
            </li>

            <li className='app-header__nav-item'>
              <a className='app-header__link' onClick={handleLogout}>Logout</a>
            </li>

          </>}

        </ul>

      </header>

      {/* Body */}
      <div className='app-body'>
        <div className='app-body__container'>

          {/* child */}
          {props.children}

        </div>
      </div>

    </div>
  )
}

export default AppLayout
