import { PreloadedState } from '@reduxjs/toolkit'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Sample from '.'
import { mockedUseNavigate, mswServer } from '@/setupTests'
import { initStore, RootState } from '@/store'
import { renderWithProviders } from '@/utils/helpers/unitTestHelper'
import { addLoadingApi } from '@/store/slices/appSlice'
import { rest } from 'msw'
import { createRes, getApiUrl } from '@/mocks/mockHelper'
import { ISampleGetUserRes } from '@/services/models/sample'

describe('Test Sample page', () => {
  // =========================
  // Lifecycle for testing
  // =========================
  beforeEach(() => {
    // Because the following api will be called immediately when the Sample page is loaded, the api mock is defined here.
    mswServer.use(
      rest.post(getApiUrl('/sample/get-img'), (req, res, ctx) => {
        const imageBuffer = new ArrayBuffer(20)
        return res(
          ctx.set('Content-Length', imageBuffer.byteLength.toString()),
          ctx.set('Content-Type', 'image/jpeg'),
          ctx.status(200),
          ctx.delay(),
          ctx.body(imageBuffer)
        )
      })
    )
  })

  // =========================
  // Testing DOM
  // =========================

  test('The incoming props are displayed in the corresponding DOM location', async () => {
    // Arrange
    const title = 'This is the title'
    renderWithProviders(<Sample title={title} />)

    // Assert
    expect(screen.getByTestId('title')).toHaveTextContent(title)
  })

  test('The incoming props are displayed in the corresponding DOM location (update props value)', () => {
    // Arrange1
    const title1 = 'This is title 1'
    const { rerender } = renderWithProviders(
      <Sample title={title1} />
    )
    // Assert1
    expect(screen.getByTestId('title')).toHaveTextContent(title1)

    // Arrange2 (更改傳入值)
    const title2 = 'This is title 2'
    rerender(
      <Sample title={title2} />
    )
    // Assert2
    expect(screen.getByTestId('title')).toHaveTextContent(title2)
  })

  // =========================
  // Testing Function
  // =========================

  test('Test whether the callback function is executed', async () => {
    // Arrange
    const onSomethingDoneFn = jest.fn()
    renderWithProviders(<Sample onSomethingDone={onSomethingDoneFn} />)

    // Act
    const doSomethingBtn = screen.getByTestId('doSomethingBtn')
    userEvent.click(doSomethingBtn) // Simulate user clicks
    // Assert
    expect(onSomethingDoneFn).toBeCalledTimes(1)
  })

  // =========================
  // Testing Navigate
  // =========================

  test('Test the useNavigate navigation page', async () => {
    // Arrange
    renderWithProviders(<Sample />)

    // Act
    const goUser01Btn = screen.getByTestId('goUser01Btn')
    userEvent.click(goUser01Btn) // Simulate user clicks

    // Assert
    expect(mockedUseNavigate).toHaveBeenCalledWith('/dev/sample/user01')
  })

  test('Test link guide page', async () => {
    // Arrange
    renderWithProviders(<Sample />, { route: '/' })

    // Act
    const goUser03Link = screen.getByTestId('goUser03Link')
    userEvent.click(goUser03Link) // Simulate user clicks

    // Assert
    const url = new URL(window.location.href)
    expect(url.pathname).toBe('/dev/sample/user03')
    expect(url.searchParams.has('id')).toBe(true)
    expect(url.searchParams.get('id')).toEqual('1234')
  })

  // =========================
  // Testing Redux Only
  // =========================

  test('操作 store 執行 dispatch 變更 redux 狀態', () => {
    // Arrange
    // PreloadedState needs to be set only when the test case needs to specify the initial state.
    // Note: If you specify app slice status only,
    //     It will not affect other slices, and the default initial state will be used.
    const preloadedState: PreloadedState<RootState> = {
      app: {
        isLogin: false,
        authToken: '',
        loadingApiList: ['api-01'],
        _persist: { version: 1, rehydrated: false }
      }
    }

    const store = initStore(preloadedState)

    // Act
    store.dispatch(addLoadingApi('api-01'))

    // Assert
    const appState = store.getState().app
    expect(appState.loadingApiList.length).toBe(2)
  })

  // =========================
  // Testing Redux with Component
  // =========================

  test('操作 component 執行 dispatch 變更 redux 狀態', async () => {
    // Arrange
    // PreloadedState needs to be set only when the test case needs to specify the initial state.
    // Note: If you specify the counter slice status only，
    //      It will not affect other slices, and the default initial state will be used.
    const { store } = renderWithProviders(<Sample />, {
      preloadedState: { counter: { value: 99 } }
    })

    // Act
    const addCounterBtn = screen.getByTestId('addCounterBtn')
    userEvent.click(addCounterBtn) // Simulate user clicks

    // Assert
    const counterState = store.getState().counter
    expect(counterState.value).toBe(100)
  })

  // =========================
  // Testing API(Integration testing)
  // =========================

  test('Test calls to the API and displays the results on the screen', async () => {
    // Arrange
    mswServer.use(
      rest.post(getApiUrl('/sample/get-user'), (req, res, ctx) => {
        const response = createRes<ISampleGetUserRes>({ username: 'chris', firstName: 'chen' })
        return res(ctx.status(200), ctx.delay(), ctx.json(response))
      })
    )
    renderWithProviders(<Sample />)

    // Act
    const callSampleGetUserApiBtn = screen.getByTestId('callSampleGetUserApiBtn')
    userEvent.click(callSampleGetUserApiBtn) // Simulate user clicks

    // Assert
    // The text found in element must be all correct (if it cannot be found, it will fail, no need to expect)
    await screen.findByText('username : chris chen')
    // Find part of the text in element to be correct (fail if not found, no need to expect)
    await screen.findByText('chris chen', { exact: false })
    // If it is asynchronous, use waitFor to wait, and find the element through testid to compare the expect text.
    await waitFor(() => expect(screen.getByTestId('username')).toHaveTextContent('chris chen'))
  })
})

export default {}
