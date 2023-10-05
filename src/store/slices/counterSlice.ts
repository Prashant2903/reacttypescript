import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppThunk, RootState } from '..'
import sampleApi from '@/services/api/sampleApi'
import { createAppAsyncThunk } from '@/utils/helpers/thunkHelper'

// Define the initial state
const initialState = {
  value: 0
}

// Slice
const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1
    },
    decrement: (state) => {
      state.value -= 1
    },
    // Use the PayloadAction type to declare the contents of `action.payload`
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload
    }
  }
})

// Thunk
export const incrementAsync =
  // 透過 createAppAsyncThunk 完整建立 thunk action 及執行狀態 (pending / fulfilled)，可在 Redux Dev Tool 追蹤
  createAppAsyncThunk(`${counterSlice.name}/incrementAsync`, async (amount: number, { dispatch, getState }) => {
    // call api
    const response = await dispatch(sampleApi.endpoints.SampleGetProducts.initiate({ category: 'c1' })).unwrap()
    console.log('response:', response.body)

    // get state
    console.log('currentCounter:', getState().counter.value)

    // change other redux state
    dispatch(incrementByAmount(amount))

    // get state
    console.log('newCounter:', getState().counter.value)

    // return value
    return { counter: getState().counter.value }
  })

export const incrementAsyncSimple =
  // Creating thunk method manually but not tracing it in Redux Dev Tool
  (amount: number): AppThunk<Promise<{ counter: number }>> =>
    async (dispatch, getState) => {
      // call api
      const response = await dispatch(sampleApi.endpoints.SampleGetProducts.initiate({ category: 'c1' })).unwrap()
      console.log('response:', response.body)

      // get state
      console.log('currentCounter:', getState().counter.value)

      // change other redux state
      dispatch(incrementByAmount(amount))

      // get state
      console.log('newCounter:', getState().counter.value)

      // return value
      return { counter: getState().counter.value }
    }

// Selection (prefix 'select')
// e.g. const counterValue = useAppSelector(state => state.counter.value)
//      const counterValue = useAppSelector(selectCount)
export const selectCount = (state: RootState) => state.counter.value

// Action creators are generated for each case reducer function
export const { increment, decrement, incrementByAmount } = counterSlice.actions
export default counterSlice
