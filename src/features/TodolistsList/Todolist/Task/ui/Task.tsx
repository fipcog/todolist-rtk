import React, { ChangeEvent, useCallback } from 'react'
import { Checkbox, IconButton } from '@mui/material'
import { EditableSpan } from '../../../../../common/components/EditableSpan/EditableSpan'
import { Delete } from '@mui/icons-material'
import { TaskStatuses, TaskType } from '../../../../../api/todolists-api'
import { useAppDispatch } from 'common/hooks/useAppDispatch'
import { tasksThunks } from 'features/TodolistsList/Todolist/Task/model/tasks-slice'

type TaskPropsType = {
	task: TaskType
	todolistId: string
}
export const Task = React.memo(({ task, todolistId }: TaskPropsType) => {
	const dispatch = useAppDispatch()

	const removeTaskHandler = () => {
		dispatch(tasksThunks.removeTask({ taskId: task.id, todolistId }))
	}

	const changeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
		const status = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New
		dispatch(tasksThunks.updateTask({ taskId: task.id, domainModel: { status }, todolistId }))
	}

	const changeTaskTitleHandler = useCallback((newTitle: string) => {
		dispatch(tasksThunks.updateTask({ taskId: task.id, domainModel: { title: newTitle }, todolistId }))
	}, [task.id, todolistId])

	return <div key={task.id} className={task.status === TaskStatuses.Completed ? 'is-done' : ''}>
		<Checkbox
			checked={task.status === TaskStatuses.Completed}
			color="primary"
			onChange={changeTaskStatusHandler}
		/>

		<EditableSpan value={task.title} onChange={changeTaskTitleHandler} />
		<IconButton onClick={removeTaskHandler}>
			<Delete />
		</IconButton>
	</div>
})
