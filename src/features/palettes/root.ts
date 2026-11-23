import {
	type UnknownAction,
	type Reducer as ToolkitReducer,
} from "@reduxjs/toolkit";
import { filterObject } from "@/other/filterObject";

import { type Palettes, initialPalettesState } from "./lib/palettes";
import { reducer as palettesReducer } from "./palettes";
import { reducer as paletteReducer } from "./palette";
import { reducer as targetColorReducer } from "./targetColor";
import { reducer as filterReducer } from "./filter";

const rootReducer = reduceReducersWithFilter<Palettes>(
	[
		[palettesReducer],
		[paletteReducer],
		[targetColorReducer],
		[filterReducer],
	],
	initialPalettesState
);

export { rootReducer as palettesReducer };

type Reducer<T> = ToolkitReducer<T, UnknownAction>;
type Pred<T> = (value: [keyof T, T[keyof T]]) => boolean;

/**
 * Reduces a list of reducers with a filter function.
 * @param reducerPredPairs - An array of reducer-predicate pairs.
 * @param initialState
 * @returns A reducer function.
 */
function reduceReducersWithFilter<T extends object>(
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	reducerPredPairs: [Reducer<any>, Pred<T>?][],
	initialState: T
): Reducer<T> {
	return (state, action) =>
		reducerPredPairs.reduce(
			<R extends object>(
				next: T,
				[reducer, _pred]: [Reducer<R>, Pred<T>?]
			): T => {
				const pred = _pred ?? (() => true);
				const entry = filterObject(next, pred) as R;
				const pass = filterObject(next, (x) => !pred(x));

				const reducedEntry = reducer(entry, action);
				if (!reducedEntry) {
					return pass as T;
				}
				return merge(reducedEntry, pass) as unknown as T;
			},
			state ?? initialState
		);
}

function merge<T extends object, U extends object>(
	source: T,
	target: U
): T & U {
	for (const [key, value] of Object.entries(source)) {
		const targetValue = target?.[key as unknown as keyof U];

		if (
			Object.hasOwn(target, key) &&
			isObject(value) &&
			isObject(targetValue)
		) {
			merge(value, targetValue);
		} else {
			Object.assign(target, { [key]: value });
		}
	}
	return target as T & U;
}

function isObject(obj: unknown): obj is object {
	return obj !== null && typeof obj === "object" && !Array.isArray(obj);
}
