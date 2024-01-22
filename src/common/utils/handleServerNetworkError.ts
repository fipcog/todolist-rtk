import { appActions } from "app/app-slice";
import { AppDispatch } from "app/store";
import axios from "axios";


/**
 *  util resolve network errors of response and dispatch setAppError and setAppStatus actions
 * @param err - error of unknown type wich type will be fownd out inside
 * @param dispatch - stors dispatch of type AppDispatch
 */
export const handleServerNetworkError = (err: unknown, dispatch: AppDispatch): void => {
    let errorMessage = "Some error occurred";

    if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.message || err?.message || errorMessage;
    } else if (err instanceof Error) {
        errorMessage = `Native error: ${err.message}`;
    } else {
        errorMessage = JSON.stringify(err);
    }

    dispatch(appActions.setAppError({ error: errorMessage }));
    dispatch(appActions.setAppStatus({ status: "failed" }));
};