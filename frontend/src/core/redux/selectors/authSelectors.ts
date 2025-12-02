import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../store";

export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectAuthToken = (state: RootState) => state.auth.token;

export const selectIsAuthenticated = createSelector(
  (state: RootState) => state.auth,
  (auth) => Boolean(auth.user)
);
