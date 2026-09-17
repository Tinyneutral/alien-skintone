import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import Color from "colorjs.io";

const initialState = Color.spaces.oklab;

const defaultEditSpaceSlice = createSlice({
	name: "defaultEditSpace",
	initialState,
	reducers: {
		setDefaultEditSpace: (_state, action: PayloadAction<string>) =>
			Color.spaces[action.payload],
	},
});

export const { setDefaultEditSpace } = defaultEditSpaceSlice.actions;
export default defaultEditSpaceSlice.reducer;
