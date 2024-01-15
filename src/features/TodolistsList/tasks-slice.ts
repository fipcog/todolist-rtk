import { todolistActions, todolistThunks } from './todolists-slice'
import { TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType } from '../../api/todolists-api'
import { Dispatch } from 'redux'
import { AppRootStateType } from '../../app/store'
import { appActions } from '../../app/app-slice'
import { handleServerAppError } from '../../common/utils/handleServerAppError'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { authActions } from 'features/Login/auth-slice'
import { handleServerNetworkError } from 'common/utils/handleServerNetworkError'
import { createAsyncAppThunk } from 'common/instances/createAsyncAppThunk'

export type TasksStateType = {
    [key: string]: Array<TaskType>
}

export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}

const slice = createSlice({
    name: 'task',
    initialState: {} as TasksStateType,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(todolistThunks.addTodolist.fulfilled, (state, action) => {
                state[action.payload.todolist.id] = []
            })
            .addCase(todolistThunks.removeTodolist.fulfilled, (state, action) => {
                delete state[action.payload.id]
            })
            .addCase(todolistThunks.fetchTodolists.fulfilled, (state, action) => {
                action.payload.todolists.forEach(tl => state[tl.id] = [])
            })
            .addCase(authActions.setIsLoggedIn, (state, action) => {
                if (!action.payload.isLoggedin) {
                    return {}
                }
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state[action.payload.todolistId] = action.payload.tasks
            })
            .addCase(removeTask.fulfilled, (state, action) => {
                const taskIndex = state[action.payload.todolistId].findIndex(t => t.id === action.payload.taskId)
                if (taskIndex !== -1) {
                    state[action.payload.todolistId].splice(taskIndex, 1)
                }
            })
            .addCase(addTask.fulfilled, (state, action) => {
                state[action.payload.task.todoListId].unshift(action.payload.task)
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                const tasks = state[action.payload.todolistId]
                const taskId = tasks.findIndex(t => t.id === action.payload.taskId)
                if (taskId !== -1) {
                    tasks[taskId] = { ...tasks[taskId], ...action.payload.model }
                }
            })
    }
})

// thunks

const fetchTasks = createAsyncAppThunk<{ tasks: TaskType[], todolistId: string }, string>(
    'tasks/fetchTasks',
    async (todolistId, thunkAPI) => {
        const { dispatch, rejectWithValue } = thunkAPI
        try {
            dispatch(appActions.setAppStatus({ status: 'loading' }))
            const res = await todolistsAPI.getTasks(todolistId)
            dispatch(appActions.setAppStatus({ status: 'succeeded' }))
            const tasks = res.data.items
            return { tasks, todolistId }
        } catch (e: unknown) {
            handleServerNetworkError(e, dispatch)
            return rejectWithValue(null)
        }
    }
)

const removeTask = createAsyncAppThunk<{ taskId: string, todolistId: string }, { taskId: string, todolistId: string }>(
    'tasks/removeTask',
    async ({ taskId, todolistId }, thunkAPI) => {
        const { dispatch, rejectWithValue } = thunkAPI
        try {
            await todolistsAPI.deleteTask(todolistId, taskId)
            return { taskId, todolistId }
        } catch (e: unknown) {
            handleServerNetworkError(e, dispatch)
            return rejectWithValue(null)
        }
    }
)

const addTask = createAsyncAppThunk<{ task: TaskType }, { title: string, todolistId: string }>(
    'tasks/addTask',
    async ({ title, todolistId }, thunkAPI) => {
        const { dispatch, rejectWithValue } = thunkAPI
        try {
            dispatch(appActions.setAppStatus({ status: 'loading' }))
            const res = await todolistsAPI.createTask(todolistId, title)
            if (res.data.resultCode === 0) {
                dispatch(appActions.setAppStatus({ status: 'succeeded' }))
                return { task: res.data.data.item }
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

const updateTask = createAsyncAppThunk<
    { taskId: string, model: UpdateDomainTaskModelType, todolistId: string },
    { taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string }
>(
    'tasks/updateTask',
    async ({ taskId, domainModel, todolistId }, thunkAPI) => {
        const { dispatch, rejectWithValue, getState } = thunkAPI
        try {
            const state = getState()
            const task = state.tasks[todolistId].find(t => t.id === taskId)
            if (!task) {
                console.warn('task not found in the state')
                return rejectWithValue(null)
            }

            const apiModel: UpdateTaskModelType = {
                deadline: task.deadline,
                description: task.description,
                priority: task.priority,
                startDate: task.startDate,
                title: task.title,
                status: task.status,
                ...domainModel
            }

            const res = await todolistsAPI.updateTask(todolistId, taskId, apiModel)

            if (res.data.resultCode === 0) {
                return { taskId, model: domainModel, todolistId }
            } else {
                handleServerAppError(res.data, dispatch);
                return rejectWithValue(null)
            }
        } catch (e: unknown) {
            handleServerNetworkError(e, dispatch)
            return rejectWithValue(null)
        }
    }
)

export const tasksThunks = {
    fetchTasks,
    removeTask,
    addTask,
    updateTask
}
export const tasksActions = slice.actions
export const tasksReducer = slice.reducer