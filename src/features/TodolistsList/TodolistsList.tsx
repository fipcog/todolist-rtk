import React, { useCallback, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { AppRootStateType } from '../../app/store'
import {
    todolistActions,
    FilterValuesType,
    TodolistDomainType,
    todolistThunks
} from './todolists-slice'
import { TasksStateType, tasksThunks } from './tasks-slice'
import { TaskStatuses } from '../../api/todolists-api'
import { Grid, Paper } from '@mui/material'
import { AddItemForm } from '../../common/components/AddItemForm/AddItemForm'
import { Todolist } from './Todolist/Todolist'
import { Navigate } from 'react-router-dom'
import { useAppDispatch } from '../../common/hooks/useAppDispatch';

type PropsType = {
    demo?: boolean
}

export const TodolistsList: React.FC<PropsType> = ({ demo = false }) => {
    const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>(state => state.todolists)
    const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)
    const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn)

    const dispatch = useAppDispatch()

    useEffect(() => {
        if (demo || !isLoggedIn) {
            return;
        }
        dispatch(todolistThunks.fetchTodolists())
    }, [])

    const changeFilter = useCallback(function (value: FilterValuesType, todolistId: string) {
        dispatch(todolistActions.changeTodolistFilter({ id: todolistId, filter: value }))
    }, [])

    const addTodolist = useCallback((title: string) => {
        dispatch(todolistThunks.addTodolist(title))
    }, [dispatch])

    if (!isLoggedIn) {
        return <Navigate to={"/login"} />
    }

    return <>
        <Grid container style={{ padding: '20px' }}>
            <AddItemForm addItem={addTodolist} />
        </Grid>
        <Grid container spacing={3}>
            {
                todolists.map(tl => {
                    let allTodolistTasks = tasks[tl.id]

                    return <Grid item key={tl.id}>
                        <Paper style={{ padding: '10px' }}>
                            <Todolist
                                todolist={tl}
                                tasks={allTodolistTasks}
                                changeFilter={changeFilter}
                                demo={demo}
                            />
                        </Paper>
                    </Grid>
                })
            }
        </Grid>
    </>
}
