import { todolistsAPI, TodolistType } from '../../api/todolists-api'
import { Dispatch } from 'redux'
import { RequestStatusType, appActions } from '../../app/app-slice'
import { AppThunk } from '../../app/store';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { authActions } from 'features/Login/auth-slice';
import { createAsyncAppThunk } from 'common/instances/createAsyncAppThunk';
import { handleServerNetworkError } from 'common/utils/handleServerNetworkError';

export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}

const slice = createSlice({
    name: 'todolist',
    initialState: [] as TodolistDomainType[],
    reducers: {
        changeTodolistFilter: (state, action: PayloadAction<{ id: string, filter: FilterValuesType }>) => {
            const tl = state.find(tl => tl.id === action.payload.id)
            if (tl) {
                tl.filter = action.payload.filter
            }
        },
        changeTodolistEntityStatus: (state, action: PayloadAction<{ id: string, status: RequestStatusType }>) => {
            const tl = state.find(tl => tl.id === action.payload.id)
            if (tl) {
                tl.entityStatus = action.payload.status
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(authActions.setIsLoggedIn, (state, action) => {
                if (!action.payload.isLoggedin) {
                    return []
                }
            })
            .addCase(fetchTodolists.fulfilled, (state, action) => {
                return action.payload.todolists.map(tl => ({ ...tl, filter: 'all', entityStatus: 'idle' }))
            })
            .addCase(removeTodolist.fulfilled, (state, action) => {
                const todoIndex = state.findIndex(todo => todo.id === action.payload.id)
                if (todoIndex !== -1) {
                    state.splice(todoIndex, 1)
                }
            })
            .addCase(addTodolist.fulfilled, (state, action) => {
                state.unshift({ ...action.payload.todolist, filter: 'all', entityStatus: 'idle' })
            })
            .addCase(changeTodolistTitle.fulfilled, (state, action) => {
                const tl = state.find(tl => tl.id === action.payload.id)
                if (tl) {
                    tl.title = action.payload.title
                }
            })
    }
})

// thunks

const fetchTodolists = createAsyncAppThunk<{ todolists: TodolistType[] }, void>(
    'todolist/fetchTodolists',
    async (_, thunkAPI) => {
        const { dispatch, rejectWithValue } = thunkAPI
        try {
            dispatch(appActions.setAppStatus({ status: 'loading' }))
            const res = await todolistsAPI.getTodolists()
            dispatch(appActions.setAppStatus({ status: 'succeeded' }))
            return { todolists: res.data }
        } catch (e: unknown) {
            handleServerNetworkError(e, dispatch)
            return rejectWithValue(null)
        }
    }
)

const removeTodolist = createAsyncAppThunk<{ id: string }, string>(
    'todolist/removeTodolist',
    async (todolistId, thunkAPI) => {
        const { dispatch, rejectWithValue } = thunkAPI
        try {
            dispatch(appActions.setAppStatus({ status: 'loading' }))
            dispatch(todolistActions.changeTodolistEntityStatus({ id: todolistId, status: 'loading' }))
            await todolistsAPI.deleteTodolist(todolistId)
            return { id: todolistId }
        } catch (e: unknown) {
            dispatch(todolistActions.changeTodolistEntityStatus({ id: todolistId, status: 'idle' }))
            handleServerNetworkError(e, dispatch)
            return rejectWithValue(null)
        }
    }
)

const addTodolist = createAsyncAppThunk<{ todolist: TodolistType }, string>(
    'todolist/addTodolist',
    async (title, thunkAPI) => {
        const { dispatch, rejectWithValue } = thunkAPI
        try {
            dispatch(appActions.setAppStatus({ status: 'loading' }))
            const res = await todolistsAPI.createTodolist(title)
            dispatch(appActions.setAppStatus({ status: 'succeeded' }))
            return { todolist: res.data.data.item }
        } catch (e: unknown) {
            handleServerNetworkError(e, dispatch)
            return rejectWithValue(null)
        }
    }
)

const changeTodolistTitle = createAsyncAppThunk<{ id: string, title: string }, { id: string, title: string }>(
    'todolist/changeTodolistTitle',
    async ({ id, title }, thunkAPI) => {
        const { dispatch, rejectWithValue } = thunkAPI
        try {
            await todolistsAPI.updateTodolist(id, title)
            return { id, title }
        } catch (e: unknown) {
            handleServerNetworkError(e, dispatch)
            return rejectWithValue(null)
        }
    }
)

export const todolistThunks = {
    fetchTodolists,
    removeTodolist,
    addTodolist,
    changeTodolistTitle
}
export const todolistsReducer = slice.reducer
export const todolistActions = slice.actions
export type TodolistInitialState = ReturnType<typeof slice.getInitialState>