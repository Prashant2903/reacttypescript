
import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit'
import { RootState } from '..'
import { startApp, login, logout, updateLoginStatus } from '../slices/systemSlice'
import router from '../../router'
import { getQueryStrValue } from '../../utils/helpers/urlHelper'

const authListenerMiddleware = createListenerMiddleware()

authListenerMiddleware.startListening({
  actionCreator: startApp,
  // matcher: isAnyOf(increment, decrement),
  effect: async (action, listenerApi) => {
    // const originalState = listenerApi.getOriginalState() as RootState

    // Cancels all other running instances of this same listener
    // except for the one that made this call.
    listenerApi.cancelActiveListeners()

    // 系統登入狀態機
    const { take, dispatch, getState /* getOriginalState */ } = listenerApi
    try {
      while (true) {
        // 檢查目前是否為已登入狀態
        const state = getState() as RootState
        const isLogin = state.system.isLogin
        if (isLogin === false) {
          // ### 未登入 ###
          console.log('[login status: false]')

          // [阻塞] 等待登入要求訊號
          const [{ payload: info }] = await take(isAnyOf(login.match))
          console.log('do login,', info)

          // 處理登入事宜
          dispatch(updateLoginStatus(true))
          // 回到原本欲訪問的頁面
          const redirectUrl = getQueryStrValue('redirect_url')
          redirectUrl ? router.navigate(redirectUrl) : router.navigate('/home/main')
        } else {
          // ### 已登入 ###
          console.log('[login status: true]')

          // [阻塞] 等待登出要求訊號
          await take(isAnyOf(logout.match))
          console.log('do logout')

          // 處理登出事宜
          dispatch(updateLoginStatus(false))
          router.navigate('/public/landing')
        }
      }
    } catch (error) {
      console.error('authListenerMiddleware error:', error)
    }

    // 如果 take 多個 action 時，可以這樣識別是哪個 action 符合
    // increment.match(action)

    // 複雜狀態，如 state 變化，可以用 condition 做條件
    // const isLogoutDone = listenerApi.condition((action, currentState, previousState) => {
    //   const preState = previousState as RootState
    //   const curState = currentState as RootState
    //   return preState.system.isLogin === true && curState.system.isLogin === false
    // })

    // Spawn "child tasks" that can do more work and return results
    // const task = listenerApi.fork(async (forkApi) => {
    //   // Can pause execution
    //   await forkApi.delay(5)
    //   // Complete the child by returning a value
    //   return 42
    // })
  }
})

export default authListenerMiddleware.middleware
