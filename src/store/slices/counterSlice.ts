import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { AppThunk, RootState } from '..'
import sampleApi from '../../services/api/sampleApi'

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
  (amount: number): AppThunk<Promise<{ age: number }>> =>
    async (dispatch, getState) => {
      // call api
      const result = await dispatch(sampleApi.endpoints.Sample01.initiate({ category: 'c1' })).unwrap()
      console.log('age result:', result.body.age)

      // get state
      console.log('currentCounter:', getState().counter.value)

      // change other redux state
      dispatch(incrementByAmount(amount))

      // get state
      console.log('newCounter:', getState().counter.value)

      // return value
      return { age: result.body.age }
    }

// Selection
// e.g. const counterValue = useAppSelector(state => state.counter.value)
//      const counterValue = useAppSelector(selectCount)
export const selectCount = (state: RootState) => state.counter.value

// Action creators are generated for each case reducer function
export const { increment, decrement, incrementByAmount } = counterSlice.actions
export default counterSlice.reducer