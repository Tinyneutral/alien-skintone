// file separated from root.ts to avoid circular dependencies
import { type UnknownAction } from "@reduxjs/toolkit";

type Reducer<T> = (state: T | undefined, action: UnknownAction) => T;
type Pred<T> = (value: [keyof T, T[keyof T]]) => boolean;

type RootState = {
	data1: number;
	data2: number;
};

const initialState: RootState = {
	data1: 0,
	data2: 0,
};

function filterObject<T extends object>(
	object: T,
	predicate: (value: [keyof T, T[keyof T]]) => boolean
) {
	return Object.fromEntries(
		Object.entries(object).filter(([key, value]) =>
			predicate([key as keyof T, value])
		)
	);
}

export { type Reducer, type Pred, type RootState, initialState, filterObject };
