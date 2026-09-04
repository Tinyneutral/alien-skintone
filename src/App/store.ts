import { configureStore } from "@reduxjs/toolkit";
import pickedColorReducer from "../features/pickedColor.ts";

export const store = configureStore({
	reducer: {
		pickedColor: pickedColorReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			thunk: false,
			immutableCheck: false,
			serializableCheck: false,
		}),
});

export type AppStore = typeof store;
export type AppDispatch = AppStore["dispatch"];
export type RootState = ReturnType<typeof store.getState>;
