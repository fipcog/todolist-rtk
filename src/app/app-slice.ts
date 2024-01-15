import { Dispatch } from 'redux'
import { authActions } from '../features/Login/auth-slice'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { authAPI } from 'api/login-api'


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
        setAppInitialized: (state, action: PayloadAction<{ isInitialized: boolean }>) => {
            state.isInitialized = action.payload.isInitialized
        }
    }
})

export const appActions = slice.actions
export const appReducer = slice.reducer
export type AppInitialState = ReturnType<typeof slice.getInitialState>


export const initializeAppTC = () => (dispatch: Dispatch) => {
    authAPI.me().then(res => {
        if (res.data.resultCode === 0) {
            dispatch(authActions.setIsLoggedIn({ isLoggedin: true }));
        } else {

        }

        dispatch(appActions.setAppInitialized({ isInitialized: true }));
    })
}
