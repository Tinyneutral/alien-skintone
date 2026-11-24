import {
	type UnknownAction,
	type Reducer as ToolkitReducer,
} from "@reduxjs/toolkit";
import reduceReducers from "reduce-reducers";

import { initialPalettesState, type Palettes } from "./lib/palettes";
import { reducer as palettesReducer } from "./palettes";
import { reducer as paletteReducer } from "./palette";
import { reducer as targetColorReducer } from "./targetColor";
import { reducer as filterReducer } from "./filter";

type Reducer<T> = ToolkitReducer<T, UnknownAction>;

const rootReducer = reduceReducers(
	initialPalettesState,
	palettesReducer,
	paletteReducer,
	targetColorReducer,
	filterReducer,
) as Reducer<Palettes>;

export { rootReducer as palettesReducer };
