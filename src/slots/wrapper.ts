import type { Content, sContentType } from "./Wrapper.tsx";

export interface SlotState {
	contents: Content[];
	contentType: sContentType;
	activeIndex: number;
}

export type SlotAction =
	| { type: "added-slot"; content: Content }
	| { type: "deleted-slot"; index: number }
	| { type: "selected-slot"; index: number };

export type ContentAction = { type: "changed-content"; content: Content };

type EveryAction = SlotAction | ContentAction;

export function reducer(state: SlotState, action: EveryAction): SlotState {
	switch (action.type) {
		case "added-slot":
			return {
				...state,
				contents: [...state.contents, action.content],
				activeIndex: state.contents.length,
			};
		case "deleted-slot":
			return {
				...state,
				contents: state.contents.filter(
					(_, index) => index !== action.index
				),
				activeIndex:
					action.index < state.activeIndex
						? state.activeIndex - 1
						: state.activeIndex,
			};
		case "selected-slot":
			return { ...state, activeIndex: action.index };
		case "changed-content":
			return {
				...state,
				contents: state.contents.map((c, i) =>
					i === state.activeIndex ? action.content : c
				),
			};
		default:
			throw new Error("Invalid action type");
	}
}
