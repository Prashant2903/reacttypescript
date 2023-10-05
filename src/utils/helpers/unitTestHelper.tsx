import React, { PropsWithChildren, ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { AppStore, initStore, RootState } from '@/store'
import { PreloadedState } from '@reduxjs/toolkit'

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: PreloadedState<RootState>
  store?: AppStore
  route?: string
}

export const renderWithProviders = (
  ui: ReactElement,
  {
    // Pass in a specific slice's state to replace the init state
    preloadedState = {},
    // When the caller does not pass in the store, a default store can be automatically created for use.
    // And test according to the state passed into the specific slice instead of the init state
    store = initStore(preloadedState),
    // Pass in a specific route path as the initial location
    route = '/',
    ...renderOptions
  }: ExtendedRenderOptions = {}
) => {
  window.history.pushState({}, 'testing page', route)
  const Wrapper = ({ children }: PropsWithChildren<{}>): JSX.Element => {
    return (
      <Provider store={store} >
        <BrowserRouter>{children} </BrowserRouter>
      </Provider>
    )
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) }
}
