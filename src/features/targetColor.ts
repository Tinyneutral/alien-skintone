import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const initialState: cssColor = "#ffffff";

const targetColorSlice = createSlice({
	name: "targetColor",
	initialState,
	reducers: {
		pickTargetColor: (_state, action: PayloadAction<cssColor>) =>
			action.payload,
	},
});

// TODO: link with palettes/ranks/target, using the same action pickTargetColor

export const { pickTargetColor } = targetColorSlice.actions;
export default targetColorSlice.reducer;
