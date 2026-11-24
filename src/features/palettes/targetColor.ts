import { createAction, createReducer } from "@reduxjs/toolkit";

import {
	initialPalettesState,
	rankPalette,
	type Palettes,
} from "./lib/palettes";
import { type Id, type EntryId } from "./lib/paletteIds";
import { closeness, type Closeness, filter, type Rank } from "./lib/ranks";

const pickTargetColor = createAction<cssColor>("targetColor/pickTargetColor");

const reducer = createReducer(initialPalettesState, (builder) => {
	builder.addCase(pickTargetColor, (state, action) => {
		state.target = filter(action.payload, state.filter);
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

export { pickTargetColor, reducer };
