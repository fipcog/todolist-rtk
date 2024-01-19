import thunkMiddleware, { ThunkAction, ThunkDispatch } from 'redux-thunk'
import { appReducer } from './app-slice'
import { combineReducers, configureStore, UnknownAction } from "@reduxjs/toolkit";
import { tasksReducer } from 'features/TodolistsList/tasks-slice';
import { todolistsReducer } from 'features/TodolistsList/todolists-slice';
import { authReducer } from 'features/Login/auth-slice';

// const rootReducer = combineReducers({
// 	tasks: tasksReducer,
// 	todolists: todolistsReducer,
// 	app: appReducer,
// 	auth: authReducer
// })
// export const store = configureStore({reducer: rootReducer},)

// // старая запись, с новыми версиями не работает
// //  const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));

export const store = configureStore({
	reducer: {
		tasks: tasksReducer,
		todolists: todolistsReducer,
		app: appReducer,
		auth: authReducer
	}
})

export type AppRootStateType = ReturnType<typeof store.getState>

// ❗ UnknownAction вместо AnyAction
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, UnknownAction>

export type AppDispatch = typeof store.dispatch
// ❗ UnknownAction вместо AnyAction
// export type AppDispatch = ThunkDispatch<AppRootStateType, unknown, UnknownAction>
