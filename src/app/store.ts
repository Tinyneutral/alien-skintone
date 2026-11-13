import { configureStore } from "@reduxjs/toolkit";
import targetColorReducer from "@/features/targetColor";
import defaultEditSpaceReducer from "@/features/defaultEditSpace";

export const store = configureStore({
	reducer: {
		targetColor: targetColorReducer,
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
