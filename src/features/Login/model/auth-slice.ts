import { Dispatch } from 'redux'
import { appActions, initializeApp } from '../../../app/app-slice'
import { handleServerAppError } from '../../../common/utils/handleServerAppError'
import { createSlice, isFulfilled, PayloadAction } from '@reduxjs/toolkit'
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
            .addMatcher(isFulfilled(login, initializeApp), (state, action) => {
                state.isLoggedIn = true
            })
            .addMatcher(isFulfilled(logout), (state, action) => {
                state.isLoggedIn = false
            })
    }
})


export const login = createAsyncAppThunk<{ isLoggedin: boolean }, LoginParamsType>(
    'auth/login',
    async (data, thunkAPI) => {
        const { dispatch, rejectWithValue } = thunkAPI
        try {
            const res = await authAPI.login(data)
            if (res.data.resultCode === 0) {
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
            const res = await authAPI.logout()
            if (res.data.resultCode === 0) {
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