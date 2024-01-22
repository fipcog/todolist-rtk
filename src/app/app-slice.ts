import { Dispatch } from 'redux'
import { authActions } from '../features/Login/auth-slice'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
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
        setAppStatus: (state, action: PayloadAction<{ status: RequestStatusType }>) => {
            state.status = action.payload.status
        },
        setAppError: (state, action: PayloadAction<{ error: string | null }>) => {
            state.error = action.payload.error
        },
    },
    extraReducers: builder => {
        builder
            .addCase(initializeApp.fulfilled, (state, action) => {
                state.isInitialized = action.payload.isInitialized
            })
    }
})




export const initializeApp = createAsyncAppThunk<{ isInitialized: boolean, isLoggedIn: boolean }, undefined>(
    'app/initializeApp',
    async (_, thunkAPI) => {
        const { dispatch, rejectWithValue } = thunkAPI

        const res = await authAPI.me()
        if (res.data.resultCode !== 0) {
            return { isInitialized: true, isLoggedIn: false }
        } else {
            return { isLoggedIn: true, isInitialized: true }
        }
    }

)


export const appActions = slice.actions
export const appReducer = slice.reducer
export type AppInitialState = ReturnType<typeof slice.getInitialState>