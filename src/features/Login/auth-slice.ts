import { Dispatch } from 'redux'
import { appActions, initializeApp } from '../../app/app-slice'
import { handleServerAppError } from '../../common/utils/handleServerAppError'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { LoginParamsType, authAPI } from 'api/login-api'
import { handleServerNetworkError } from 'common/utils/handleServerNetworkError'
import { createAsyncAppThunk } from 'common/instances/createAsyncAppThunk'

const slice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: false as boolean
    },
    reducers: {
    },
    extraReducers: builder => {
        builder
            .addCase(login.fulfilled, (state, action) => {
                state.isLoggedIn = action.payload.isLoggedin
            })
            .addCase(initializeApp.fulfilled, (state, action) => {
                state.isLoggedIn = action.payload.isLoggedIn
            })
            .addCase(logout.fulfilled, (state, action) => {
                state.isLoggedIn = action.payload.isLoggedin
            })
    }
})


export const login = createAsyncAppThunk<{ isLoggedin: boolean }, LoginParamsType>(
    'auth/login',
    async (data, thunkAPI) => {
        const { dispatch, rejectWithValue } = thunkAPI
        try {
            dispatch(appActions.setAppStatus({ status: 'loading' }))
            const res = await authAPI.login(data)
            if (res.data.resultCode === 0) {
                dispatch(appActions.setAppStatus({ status: 'succeeded' }))
                return { isLoggedin: true }
            } else {
                handleServerAppError(res.data, dispatch, false)
                return rejectWithValue(res.data)
            }
        } catch (e: unknown) {
            handleServerNetworkError(e, dispatch)
            return rejectWithValue(null)
        }
    }
)

export const logout = createAsyncAppThunk<{ isLoggedin: boolean }, undefined>(
    'auth/logout',
    async (_, thunkAPI) => {
        const { dispatch, rejectWithValue } = thunkAPI
        try {
            dispatch(appActions.setAppStatus({ status: 'loading' }))
            const res = await authAPI.logout()
            if (res.data.resultCode === 0) {
                dispatch(appActions.setAppStatus({ status: 'succeeded' }))
                return { isLoggedin: false }
            } else {
                handleServerAppError(res.data, dispatch)
                return rejectWithValue(null)
            }
        } catch (e: unknown) {
            handleServerNetworkError(e, dispatch)
            return rejectWithValue(null)
        }
    }
)

export const authActions = slice.actions
export const authReducer = slice.reducer
export type AuthInitialState = ReturnType<typeof slice.getInitialState>