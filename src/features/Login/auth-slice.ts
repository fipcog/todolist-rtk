import {Dispatch} from 'redux'
import {appActions} from '../../app/app-slice'
import {authAPI, LoginParamsType} from '../../api/todolists-api'
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const slice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: false as boolean
    },
    reducers: {
        setIsLoggedIn: (state, action: PayloadAction<{isLoggedin: boolean}>) => {
            state.isLoggedIn = action.payload.isLoggedin
        }
    }
})

export const authActions = slice.actions
export const authReducer = slice.reducer
export type AuthInitialState = ReturnType<typeof slice.getInitialState>


// thunks
export const loginTC = (data: LoginParamsType) => (dispatch: Dispatch) => {
    dispatch(appActions.setAppStatus({status:'loading'}))
    authAPI.login(data)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(authActions.setIsLoggedIn({isLoggedin: true}))
                dispatch(appActions.setAppStatus({status:'succeeded'}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
}
export const logoutTC = () => (dispatch: Dispatch) => {
    dispatch(appActions.setAppStatus({status:'loading'}))
    authAPI.logout()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(authActions.setIsLoggedIn({isLoggedin: false}))
                dispatch(appActions.setAppStatus({status:'succeeded'}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
}
