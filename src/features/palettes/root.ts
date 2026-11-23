import {
	type Reducer,
	type Pred,
	initialState,
	type RootState,
	filterObject,
} from "./rootCommon";
import {
	reducer1,
	pred1,
	reducer2,
	pred2,
	bothReducer
} from "./test";

const rootReducer = reduceReducersWithFilter<RootState>(
	[
		[reducer1, pred1],
		[reducer2, pred2],
		[bothReducer]
	],
	initialState
);

export { rootReducer as palettesReducer };

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
