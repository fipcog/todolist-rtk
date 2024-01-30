import React, { useCallback, useEffect } from 'react'
import { AddItemForm } from '../../../../common/components/AddItemForm/AddItemForm'
import { EditableSpan } from '../../../../common/components/EditableSpan/EditableSpan'
import { Task } from '../Task/ui/Task'
import { TaskStatuses, TaskType } from '../../../../api/todolists-api'
import { FilterValuesType, TodolistDomainType, todolistThunks } from '../model/todolists-slice'
import { useAppDispatch } from '../../../../common/hooks/useAppDispatch';
import { Button, IconButton } from '@mui/material'
import { Delete } from '@mui/icons-material'
import { tasksThunks } from '../Task/model/tasks-slice'

type PropsType = {
    todolist: TodolistDomainType
    tasks: Array<TaskType>
    changeFilter: (value: FilterValuesType, todolistId: string) => void
    demo?: boolean
}

export const Todolist = React.memo(function ({ demo = false, ...props }: PropsType) {

    const dispatch = useAppDispatch()

    useEffect(() => {
        if (demo) {
            return
        }
        dispatch(tasksThunks.fetchTasks(props.todolist.id))
    }, [])

    const addTaskHandler = useCallback((title: string) => {
        dispatch(tasksThunks.addTask({ title, todolistId: props.todolist.id }))
    }, [props.todolist.id])

    const removeTodolistHandler = () => {
        dispatch(todolistThunks.removeTodolist(props.todolist.id))
    }
    const changeTodolistTitleHandler = useCallback((title: string) => {
        dispatch(todolistThunks.changeTodolistTitle({ id: props.todolist.id, title }))
    }, [props.todolist.id])

    const onAllClickHandler = useCallback(() => props.changeFilter('all', props.todolist.id), [props.todolist.id, props.changeFilter])
    const onActiveClickHandler = useCallback(() => props.changeFilter('active', props.todolist.id), [props.todolist.id, props.changeFilter])
    const onCompletedClickHandler = useCallback(() => props.changeFilter('completed', props.todolist.id), [props.todolist.id, props.changeFilter])


    let tasksForTodolist = props.tasks

    if (props.todolist.filter === 'active') {
        tasksForTodolist = props.tasks.filter(t => t.status === TaskStatuses.New)
    }
    if (props.todolist.filter === 'completed') {
        tasksForTodolist = props.tasks.filter(t => t.status === TaskStatuses.Completed)
    }

    return <div>
        <h3><EditableSpan value={props.todolist.title} onChange={changeTodolistTitleHandler} />
            <IconButton onClick={removeTodolistHandler} disabled={props.todolist.entityStatus === 'loading'}>
                <Delete />
            </IconButton>
        </h3>
        <AddItemForm addItem={addTaskHandler} disabled={props.todolist.entityStatus === 'loading'} />
        <div>
            {
                tasksForTodolist.map(t => <Task key={t.id} task={t} todolistId={props.todolist.id} />)
            }
        </div>
        <div style={{ paddingTop: '10px' }}>
            <Button variant={props.todolist.filter === 'all' ? 'outlined' : 'text'}
                onClick={onAllClickHandler}
                color={'inherit'}
            >All
            </Button>
            <Button variant={props.todolist.filter === 'active' ? 'outlined' : 'text'}
                onClick={onActiveClickHandler}
                color={'primary'}>Active
            </Button>
            <Button variant={props.todolist.filter === 'completed' ? 'outlined' : 'text'}
                onClick={onCompletedClickHandler}
                color={'secondary'}>Completed
            </Button>
        </div>
    </div>
})


