import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
	reducer: {},
});

export type AppStore = typeof store;
export type AppDispatch = AppStore["dispatch"];
export type RootState = ReturnType<typeof store.getState>;
