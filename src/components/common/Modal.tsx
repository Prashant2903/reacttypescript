import clsx from 'clsx'
import { PropsWithChildren, useCallback, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import { freezeBody, unfreezeBody } from '@/utils/helpers/domHelper'
import useClickOutsideHandler from '@/utils/hooks/useClickOutsideHandler'
import useKeyDownHandler from '@/utils/hooks/useKeyDownHandler'

export interface IBaseModalProps {
  isVisible: boolean
  onRequestClose: () => void
}

interface IProps extends IBaseModalProps {
  isCloseByBackdrop?: boolean
  isCloseByEsc?: boolean
  maxWidth?: string
  target?: HTMLElement
  className?: string
}

const Modal = ({ className, isVisible, isCloseByBackdrop, isCloseByEsc, children, maxWidth, target, onRequestClose }: PropsWithChildren<IProps>) => {
  // Move the popup window to a specific element
  const portalTarget = target || document.body

  // Notify the parent layer to request shutdown


  const requestCloseModal = useCallback(() => {
    isVisible && onRequestClose && onRequestClose()
  }, [isVisible, onRequestClose])

  // Click Backdrop (non-modal block) to close the pop-up window
  const modalRef = useRef<HTMLDivElement>(null)
  const isEnableClickMonitor = isVisible && isCloseByBackdrop === true
  useClickOutsideHandler(modalRef, () => requestCloseModal(), isEnableClickMonitor)

  // Close the popup window when the Esc key is pressed
  const isEnableKeyMonitor = isVisible && isCloseByEsc === true
  useKeyDownHandler(e => e.key === 'Escape' && requestCloseModal(), isEnableKeyMonitor)

  // Keep the screen locked to avoid scrolling chaos
  useEffect(() => {
    isVisible ? freezeBody() : unfreezeBody()

    return () => {
      unfreezeBody()
    }
  }, [isVisible])

  return isVisible
    ? ReactDOM.createPortal(
      <div className='cp-modal cp-modal__backdrop'>
        <div className={clsx('cp-modal__box', className)} ref={modalRef} style={{ maxWidth }} >

          {children}

        </div>
      </div>,
      portalTarget
    )
    : null
}

export default Modal
