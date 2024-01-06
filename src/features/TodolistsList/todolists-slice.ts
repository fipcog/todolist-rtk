import {todolistsAPI, TodolistType} from '../../api/todolists-api'
import {Dispatch} from 'redux'
import {RequestStatusType, appActions} from '../../app/app-slice'
import {handleServerNetworkError} from '../../utils/error-utils'
import { AppThunk } from '../../app/store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}

const slice = createSlice({
    name: 'todolist',
    initialState: [] as TodolistDomainType[],
    reducers: {
        removeTodolist: (state, action: PayloadAction<{id: string}>) => {
            const todoIndex = state.findIndex(todo => todo.id === action.payload.id)
            if(todoIndex !== -1) {
                state.splice(todoIndex, 1)
            }
        },
        addTodolist: (state, action: PayloadAction<{todolist: TodolistType}>) => {
            state.unshift({...action.payload.todolist, filter: 'all', entityStatus: 'idle'})
        },
        changeTodolistTitle: (state, action: PayloadAction<{id: string, title: string}>) => {
            const tl = state.find(tl => tl.id === action.payload.id)
            if(tl) {
                tl.title = action.payload.title
            }
        },
        changeTodolistFilter: (state, action: PayloadAction<{id: string, filter: FilterValuesType}>) => {
            const tl = state.find(tl => tl.id === action.payload.id)
            if(tl) {
                tl.filter = action.payload.filter
            }
        },
        changeTodolistEntityStatus: (state, action: PayloadAction<{id: string, status: RequestStatusType}>) => {
            const tl = state.find(tl => tl.id === action.payload.id)
            if(tl) {
                tl.entityStatus = action.payload.status
            }
        },
        setTodolists: (state, action: PayloadAction<{todolists: Array<TodolistType>}>) => {
            return action.payload.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
        }
    }
})

export const todolistsReducer = slice.reducer
export const todolistActions = slice.actions
export type TodolistInitialState = ReturnType<typeof slice.getInitialState>



// thunks
export const fetchTodolistsTC = (): AppThunk => {
    return (dispatch) => {
        dispatch(appActions.setAppStatus({status: 'loading'}))
        todolistsAPI.getTodolists()
            .then((res) => {
                dispatch(todolistActions.setTodolists({todolists: res.data}))
                dispatch(appActions.setAppStatus({status: 'succeeded'}))
            })
            .catch(error => {
                handleServerNetworkError(error, dispatch);
            })
    }
}
export const removeTodolistTC = (todolistId: string) => {
    return (dispatch: Dispatch) => {
        dispatch(appActions.setAppStatus({status: 'loading'}))
        dispatch(todolistActions.changeTodolistEntityStatus({id: todolistId, status: 'loading'}))
        todolistsAPI.deleteTodolist(todolistId)
            .then((res) => {
                dispatch(todolistActions.removeTodolist({id: todolistId}))
                dispatch(appActions.setAppStatus({status: 'succeeded'}))
            })
    }
}
export const addTodolistTC = (title: string) => {
    return (dispatch: Dispatch) => {
        dispatch(appActions.setAppStatus({status: 'loading'}))
        todolistsAPI.createTodolist(title)
            .then((res) => {
                dispatch(todolistActions.addTodolist({todolist: res.data.data.item}))
                dispatch(appActions.setAppStatus({status: 'succeeded'}))
            })
    }
}
export const changeTodolistTitleTC = (id: string, title: string) => {
    return (dispatch: Dispatch) => {
        todolistsAPI.updateTodolist(id, title)
            .then((res) => {
                dispatch(todolistActions.changeTodolistTitle({id, title}))
            })
    }
}