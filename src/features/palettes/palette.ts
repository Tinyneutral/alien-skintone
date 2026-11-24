import { createAction, createReducer, createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";

import { initialPalettesState, rankPalette } from "./lib/palettes";
import { type Id, type EntryId } from "./lib/paletteIds";
import { closeness, type Rank } from "./lib/ranks";

const addColor = createAction<{
	paletteId: Id;
	color: cssColor;
}>("palette/addColor");
const addColors = createAction<{
	paletteId: Id;
	colors: cssColor[];
}>("palette/addColors");
const changeColor = createAction<{
	paletteId: Id;
	id: EntryId;
	color: cssColor;
}>("palette/changeColor");
const deleteColor = createAction<{
	paletteId: Id;
	id: EntryId;
}>("palette/deleteColor");
const deleteAllColors = createAction<{
	paletteId: Id;
}>("palette/deleteAllColors");

const reducer = createReducer(initialPalettesState, (builder) => {
	builder
		.addCase(addColor, (state, action) => {
			const { paletteId, color } = action.payload;
			if (!state.paletteIds[paletteId]) {
				throw new Error(`Palette with id ${paletteId} does not exist`);
			}

			const id = state._nextEntryIds[paletteId]();
			state.paletteIds[paletteId].push(id);
			state.colors[id] = color;
			state.closenesses[id] = closeness(
				color,
				state.target,
				state.filter
			);
			Object.assign(
				state.ranks,
				rankPalette(paletteId, state.paletteIds, state.closenesses)
			);
		})
		.addCase(addColors, (state, action) => {
			const { paletteId, colors } = action.payload;
			if (!state.paletteIds[paletteId]) {
				throw new Error(`Palette with id ${paletteId} does not exist`);
			}
			colors.forEach((color) => {
				const id = state._nextEntryIds[paletteId]();
				state.paletteIds[paletteId].push(id);
				state.colors[id] = color;
				state.closenesses[id] = closeness(
					color,
					state.target,
					state.filter
				);
			});
			Object.assign(
				state.ranks,
				rankPalette(paletteId, state.paletteIds, state.closenesses)
			);
		})
		.addCase(changeColor, (state, action) => {
			const { paletteId, id, color } = action.payload;
			if (!state.paletteIds[paletteId]) {
				throw new Error(`Palette with id ${paletteId} does not exist`);
			}
			if (!state.paletteIds[paletteId].includes(id)) {
				throw new Error(
					`Entry with id ${id} does not exist in palette with id ${paletteId}`
				);
			}

			state.colors[id] = color;
			state.closenesses[id] = closeness(
				color,
				state.target,
				state.filter
			);
			Object.assign(
				state.ranks,
				rankPalette(paletteId, state.paletteIds, state.closenesses)
			);
		})
		.addCase(deleteColor, (state, action) => {
			const { paletteId, id } = action.payload;
			if (!state.paletteIds[paletteId]) {
				throw new Error(`Palette with id ${paletteId} does not exist`);
			}
			if (!state.paletteIds[paletteId].includes(id)) {
				throw new Error(
					`Entry with id ${id} does not exist in palette with id ${paletteId}`
				);
			}

			state.paletteIds[paletteId] = state.paletteIds[paletteId].filter(
				(entryId) => entryId !== id
			);
			delete state.colors[id];
			delete state.closenesses[id];
			delete state.ranks[id];
			Object.assign(
				state.ranks,
				rankPalette(paletteId, state.paletteIds, state.closenesses)
			);
		})
		.addCase(deleteAllColors, (state, action) => {
			const { paletteId } = action.payload;
			if (!state.paletteIds[paletteId]) {
				throw new Error(`Palette with id ${paletteId} does not exist`);
			}

			for (const entryId of state.paletteIds[paletteId]) {
				delete state.colors[entryId];
				delete state.closenesses[entryId];
				delete state.ranks[entryId];
			}
			state.paletteIds[paletteId] = [];
		});
});

type PaletteEntry = {
	id: EntryId;
	color: cssColor;
	rank: Rank;
};

type PaletteEntries = {
	[key: Id]: PaletteEntry[];
};

const selectPaletteEntries = createSelector(
	(state: RootState) => state.palettes,
	(palettes): PaletteEntries =>
		Object.fromEntries(
			Object.entries(palettes.paletteIds).map(([paletteId, entryIds]) => [
				paletteId,
				entryIds.map((entryId) => {
					return {
						id: entryId,
						color: palettes.colors[entryId],
						rank: palettes.ranks[entryId],
					};
				}),
			])
		)
);

export type { PaletteEntry, PaletteEntries };
export {
	addColor,
	addColors,
	changeColor,
	deleteColor,
	deleteAllColors,
	reducer,
	selectPaletteEntries,
};
