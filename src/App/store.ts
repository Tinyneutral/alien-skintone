import { configureStore } from "@reduxjs/toolkit";
import pickedColorReducer from "/features/pickedColor";
import defaultEditSpaceReducer from "/features/defaultEditSpace";

export const store = configureStore({
	reducer: {
		pickedColor: pickedColorReducer,
		defaultEditSpace: defaultEditSpaceReducer,
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
