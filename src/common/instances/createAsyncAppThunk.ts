import { createAsyncThunk } from "@reduxjs/toolkit";
import { AppDispatch, AppRootStateType } from "app/store";

export const createAsyncAppThunk = createAsyncThunk.withTypes<{
    dispatch: AppDispatch,
    state: AppRootStateType,
    rejectValue: null
}>()