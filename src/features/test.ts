import { createAction, createReducer } from "@reduxjs/toolkit";
import {
	type Pred,
	type RootState,
	initialState,
	filterObject,
} from "./rootCommon";

type type1 = {
	data1: number;
};
const pred1: Pred<RootState> = ([key]) => key === "data1";
const initialState1 = filterObject(initialState, pred1) as type1;

const increment1 = createAction<number>("data1/increment");
const decrement1 = createAction<number>("data1/decrement");

const reducer1 = createReducer(initialState1, (builder) => {
	builder
		.addCase(increment1, (state, action) => {
			state.data1 += action.payload;
		})
		.addCase(decrement1, (state, action) => {
			state.data1 -= action.payload;
		});
});

type type2 = {
	data2: number;
};
const pred2: Pred<RootState> = ([key]) => key === "data2";
const initialState2 = filterObject(initialState, pred2) as type2;

const increment2 = createAction<number>("data2/increment");
const decrement2 = createAction<number>("data2/decrement");

const reducer2 = createReducer(initialState2, (builder) => {
	builder
		.addCase(increment2, (state, action) => {
			state.data2 += action.payload;
		})
		.addCase(decrement2, (state, action) => {
			state.data2 -= action.payload;
		});
});

const increment3 = createAction<number>("data/increment");
const decrement3 = createAction<number>("data/decrement");

const bothReducer = createReducer(initialState, (builder) => {
	builder
		.addCase(increment3, (state, action) => {
			state.data1 += action.payload;
			state.data2 += action.payload;
		})
		.addCase(decrement3, (state, action) => {
			state.data1 -= action.payload;
			state.data2 -= action.payload;
		});
});

export {
	increment1,
	decrement1,
	increment2,
	decrement2,
	increment3,
	decrement3,
	reducer1,
	pred1,
	reducer2,
	pred2,
	bothReducer,
};
