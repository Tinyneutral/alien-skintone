import { createAction, createReducer } from "@reduxjs/toolkit";
import { initialPalettesState } from "./lib/palettes";
import { type Id, nextEntryIdFactory } from "./lib/paletteIds";

const addPalette = createAction("palettes/addPalette");
const deletePalette = createAction<Id>("palettes/deletePalette");

const reducer = createReducer(initialPalettesState, (builder) => {
	builder
		.addCase(addPalette, (state) => {
			const id = state._nextId();
			state.paletteIds[id] = [];
			state._nextEntryIds[id] = nextEntryIdFactory(id);
		})
		.addCase(deletePalette, (state, action) => {
			const id = action.payload;
			if (!state.paletteIds[id]) {
				throw new Error(`Palette with id ${id} does not exist`);
			}
			delete state.paletteIds[id];
			delete state._nextEntryIds[id];
		});
});

export { addPalette, deletePalette, reducer };
