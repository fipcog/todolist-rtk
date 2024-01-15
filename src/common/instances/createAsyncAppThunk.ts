import { createAsyncThunk } from "@reduxjs/toolkit";
import { AppDispatch, AppRootStateType } from "app/store";

export const CreateAsyncAppThunk = createAsyncThunk.withTypes<{
    dispatch: AppDispatch,
    state: AppRootStateType,
    rejectValue: null
}>()