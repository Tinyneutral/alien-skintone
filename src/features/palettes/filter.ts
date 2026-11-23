import { createAction, createReducer } from "@reduxjs/toolkit";

import {
	initialPalettesState,
	rankPalette,
	type Palettes,
} from "./lib/palettes";
import { type Id, type EntryId } from "./lib/paletteIds";
import {
	closeness,
	type Closeness,
	type Space,
	type Weight,
	type Rank,
} from "./lib/ranks";

const changeFilterSpace = createAction<Space>("filter/changeFilterSpace");
const changeFilterWeights = createAction<Weight[]>(
	"filter/changeFilterWeights"
);

const reducer = createReducer(initialPalettesState, (builder) => {
	builder
		.addCase(changeFilterSpace, (state, action) => {
			state.filter.space = action.payload;
			recalcClosenessesAndRanks(state);
		})
		.addCase(changeFilterWeights, (state, action) => {
			state.filter.weights = action.payload;
			recalcClosenessesAndRanks(state);
		});
});

function recalcClosenessesAndRanks(state: Palettes) {
	state.closenesses = Object.fromEntries(
		Object.entries(state.colors).reduce(
			(acc, [entryId, color]) => {
				acc.push([
					entryId,
					closeness(color, state.target, state.filter),
				]);
				return acc;
			},
			[] as [EntryId, Closeness][]
		)
	);
	state.ranks = Object.fromEntries(
		Object.keys(state.paletteIds).reduce(
			(acc, paletteId) => [
				...acc,
				...Object.entries(
					rankPalette(
						Number(paletteId) as Id,
						state.paletteIds,
						state.closenesses
					)
				),
			],
			[] as [EntryId, Rank][]
		)
	);
}

export { changeFilterSpace, changeFilterWeights, reducer };
