import { createAsyncThunk } from "@reduxjs/toolkit";
import { ResponseType } from "api/todolists-api";
import { AppDispatch, AppRootStateType } from "app/store";

export const createAsyncAppThunk = createAsyncThunk.withTypes<{
    dispatch: AppDispatch,
    state: AppRootStateType,
    rejectValue: null | ResponseType
}>()