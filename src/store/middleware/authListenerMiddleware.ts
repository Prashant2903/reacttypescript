
import { createListenerMiddleware, isAnyOf, TaskAbortError } from '@reduxjs/toolkit'
import { RootState } from '..'
import { startApp, loginSuccess, logout, updateLoginInfo } from '../slices/appSlice'
import { appNavigate } from '@/router'
import { getQueryStrValue } from '@/utils/helpers/urlHelper'

const authListenerMiddleware = createListenerMiddleware()

authListenerMiddleware.startListening({
  actionCreator: startApp,
  // matcher: isAnyOf(increment, decrement),
  effect: async (action, listenerApi) => {
    // Cancels all other running instances of this same listener
    // except for the one that made this call.
    listenerApi.cancelActiveListeners()

    // State Machines for auth
    const { take, dispatch, getState /* getOriginalState */ } = listenerApi
    try {
      while (true) {
        // Check if you are currently logged in
        const getRootState = getState as () => RootState
        const isLogin = getRootState().app.isLogin
        if (isLogin === false) {
          // #############
          // ### Not logged in ###
          // #############

          // [Blocking] Waiting for login success signal
          const [{ payload: { authToken } }] = await take(loginSuccess.match)

          // Handle login
          dispatch(updateLoginInfo({ authToken, isLogin: true }))

          // Return to the page you originally wanted to visit
          const redirectUrl = getQueryStrValue('redirect_url')
          redirectUrl ? appNavigate(redirectUrl) : appNavigate('/home/main')
        } else {
          // #############
          // ### Logged in ###
          // #############

          // [Blocking] Waiting for logout request signal
          await take(isAnyOf(logout))

          // Handle logout
          dispatch(updateLoginInfo({ authToken: '', isLogin: false }))
          appNavigate('/public/login')
        }
      }
    } catch (error) {
      if (error instanceof TaskAbortError && action.type === startApp.type) {
        console.warn('authListenerMiddleware abort due to re-startApp')
      } else {
        console.error('authListenerMiddleware error:', error)
      }
    }

    // If you take multiple actions, you can identify which action matches the
    // increment.match(action)

    // For complex states, such as state changes, condition can be used as a condition
    // const isLogoutDone = listenerApi.condition((action, currentState, previousState) => {
    //   const preState = previousState as RootState
    //   const curState = currentState as RootState
    //   return preState.app.isLogin === true && curState.app.isLogin === false
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
