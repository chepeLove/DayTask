import { AppRootStateType } from "store/store";

export const selectIsInitialized = (state: AppRootStateType) => state.app.isInitialized;
export const selectAppStatus = (state: AppRootStateType) => state.app.status;
