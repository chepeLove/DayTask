import { AppRootStateType } from "store/store";

export const selectIsLoggedIn = (state: AppRootStateType) => state.auth.isLoggedIn;
