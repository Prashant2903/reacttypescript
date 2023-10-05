
import { Action, MiddlewareAPI, isRejectedWithValue, Middleware } from '@reduxjs/toolkit'
import { AppDispatch, RootState } from '..'
import { showMsgBox } from '@/utils/helpers/msgHelper'
import { logout } from '../slices/appSlice'

/**
 * Interception API responds to abnormal situations for unified logical processing
 */
const apiErrorHandleMiddleware =
  ({ dispatch, getState }: MiddlewareAPI<AppDispatch, RootState>) =>
    (next: (action: Action) => void) =>
      (action: any) => {
        // only fetch when http code !== 200
        if (isRejectedWithValue(action)) {
          const httpCode = action.payload?.originalStatus || action.payload?.status
          if (httpCode) {
            switch (httpCode) {
              case 'FETCH_ERROR':
                // The client network is abnormal and cannot connect to the server.
                showMsgBox({
                  title: 'mistake',
                  content: 'The network connection is unstable, please try again later.',
                  hasCloseBtn: true
                })

                break

              case 401:
                // No permission to access the site
                showMsgBox({
                  title: 'mistake',
                  content: 'No permission to access the site, please log in again',
                  mainBtn: {
                    label: 'Ok',
                    onClick: () => {
                      if (getState().app.isLogin) {
                        dispatch(logout())
                      }
                    }
                  }
                })

                break

              default:
                // Server responds with status code other than 200
                showMsgBox({
                  title: 'mistake',
                  content: `The system is currently busy, please try again later.！(${httpCode})`,
                  hasCloseBtn: true
                })

                break
            }
          }
        }
        return next(action)
      }

const middleware = apiErrorHandleMiddleware as Middleware
export default middleware
