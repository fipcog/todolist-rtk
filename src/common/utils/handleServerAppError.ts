import { appActions } from '../../app/app-slice'
import { ResponseType } from '../../api/todolists-api'
import { Dispatch } from 'redux'

export const handleServerAppError = <D>(data: ResponseType<D>, dispatch: Dispatch, showError: boolean = true) => {
    if (showError) {
        dispatch(appActions.setAppError({ error: data.messages.length ? data.messages[0] : 'Some error occurred' }))
    }
    dispatch(appActions.setAppStatus({ status: 'failed' }))
}

