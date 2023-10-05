import React, { useCallback, useEffect, useRef, useState } from 'react'
import { AppModeEnum } from './constants/enums'
import environment from './environment'
import { Outlet } from 'react-router-dom'
import useAppSelector from './utils/hooks/useAppSelector'
import { initAppAsync, selectLoadingApiCounter } from './store/slices/appSlice'
import LoadingMask from './components/LoadingMask'
import useAppDispatch from './utils/hooks/useAppDispatch'
import { removeCurrentGlobalMsg, selectCurrentGlobalMsg } from './store/slices/msgSlice'
import MsgBox from './components/MsgBox'
import { unwrapResult } from '@reduxjs/toolkit'

function App() {
  const loadingApiCounter = useAppSelector(selectLoadingApiCounter)
  const currentGlobalMsg = useAppSelector(selectCurrentGlobalMsg)
  const dispatch = useAppDispatch()
  const isInitApp = useRef(false)
  const [isInitAppSuccess, setIsInitAppSuccess] = useState<boolean | null>(null)
  const initApplication = useCallback(
    async () => {
      if (isInitApp.current === false) {
        // Initial website, perform the necessary procedures before entering the website
        isInitApp.current = true
        const resultAction = await dispatch(initAppAsync())
        const isSuccess = unwrapResult(resultAction)
        setIsInitAppSuccess(isSuccess)
      }
    },
    [dispatch]
  )
  useEffect(() => { initApplication() }, [initApplication])

  return (
    <div className='app'>

      {/* api loader */}
      {loadingApiCounter > 0 && <LoadingMask />}

      {/* Identify the environment */}
      {environment.appMode !== AppModeEnum.PROD && (
        <div className='env-info'>Mode: {process.env.REACT_APP_MODE}</div>
      )}

      {/* Global text message pop-up window */}
      {currentGlobalMsg && <MsgBox
        {...currentGlobalMsg}
        isVisible
        onRequestClose={() => { dispatch(removeCurrentGlobalMsg()) }} />}

      {/* subroute insertion point */}
      {isInitAppSuccess && <Outlet />}

    </div>
  )
}

export default App
