import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const initialState = "#ffffff";

const pickedColorSlice = createSlice({
	name: "pickedColor",
	initialState,
	reducers: {
		setPickedColor: (_state, action: PayloadAction<string>) =>
			action.payload,
	},
});

export const { setPickedColor } = pickedColorSlice.actions;
export default pickedColorSlice.reducer;
