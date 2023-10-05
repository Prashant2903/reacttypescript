import { store } from '@/store'
import { addGlobalMsg, GlobalMsg } from '@/store/slices/msgSlice'

/**
 * Show text message pop-up window (add to message queue)
 * @param globalMsg Text message parameters
 */
export const showMsgBox = (globalMsg: GlobalMsg) => {
  store.dispatch(addGlobalMsg(globalMsg))
}
