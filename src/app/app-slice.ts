import { AnyAction, Dispatch, UnknownAction } from 'redux'
import { authActions } from '../features/Login/auth-slice'
import { PayloadAction, createSlice, isAnyOf, isFulfilled, isPending, isRejected } from '@reduxjs/toolkit'
import { authAPI } from 'api/login-api'
import { createAsyncAppThunk } from 'common/instances/createAsyncAppThunk'


export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const slice = createSlice({
    name: 'app',
    initialState: {
        status: 'idle' as RequestStatusType,
        error: null as string | null,
        isInitialized: false as boolean
    },
    reducers: {
        // setAppStatus: (state, action: PayloadAction<{ status: RequestStatusType }>) => {
        //     state.status = action.payload.status
        // },
        setAppError: (state, action: PayloadAction<{ error: string | null }>) => {
            state.error = action.payload.error
        },
    },
    extraReducers: builder => {
        builder
            .addMatcher(isAnyOf(initializeApp.fulfilled, initializeApp.rejected), (state, action) => {
                state.isInitialized = true
            })
            .addMatcher(isPending, (state) => {
                state.status = 'loading'
            })
            .addMatcher(isFulfilled, (state) => {
                state.status = 'succeeded'
            })
            .addMatcher(isRejected, (state, action: AnyAction) => {
                state.status = 'failed'
                // if (action.payload) {
                //     state.error = action.payload.messages[0]
                // } else {
                //     state.error = action.error.message ? action.error.message : 'Some error occurred'
                // }
            })
    }
})




export const initializeApp = createAsyncAppThunk<{ isInitialized: boolean }, undefined>(
    'app/initializeApp',
    async (_, thunkAPI) => {
        const { dispatch, rejectWithValue } = thunkAPI

        const res = await authAPI.me()
        if (res.data.resultCode === 0) {
            return { isInitialized: true }
        } else {
            return rejectWithValue(res.data)
        }
    }

)


export const appActions = slice.actions
export const appReducer = slice.reducer
export type AppInitialState = ReturnType<typeof slice.getInitialState>