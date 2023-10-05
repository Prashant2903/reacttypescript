
import { isPending, isFulfilled, isRejected, Action, MiddlewareAPI, Middleware } from '@reduxjs/toolkit'
import { AppDispatch, RootState } from '..'
import { addLoadingApi, removeLoadingApi } from '../slices/appSlice'

/**
 * Not included in the list calculated by the loading api
 */
const ignoreLoadingList = [
  'SampleGetProducts'
]

/**
 * Intercept the api execution status to update the loading api quantity. Intercept the api execution status to update the loading api quantity.
 */
const apiLoadingMiddleware =
  ({ dispatch }: MiddlewareAPI<AppDispatch, RootState>) =>
    (next: (action: Action) => void) =>
      (action: any) => {
        const endpointName = action?.meta?.arg?.endpointName
        if (endpointName) {
          if (ignoreLoadingList.includes(endpointName)) {
            return next(action)
          } else if (isPending(action)) {
            dispatch(addLoadingApi(action.meta.requestId))
          } else if (isFulfilled(action)) {
            dispatch(removeLoadingApi(action.meta.requestId))
          } else if (isRejected(action)) {
            dispatch(removeLoadingApi(action.meta.requestId))
          }
        }
        return next(action)
      }

const middleware = apiLoadingMiddleware as Middleware
export default middleware
