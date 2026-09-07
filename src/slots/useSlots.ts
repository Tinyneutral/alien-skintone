import { useReducer, type SetStateAction } from "react";

type SlotState<T> = {
	contents: T[];
	activeIndex: number;
};

type SlotAction<T> =
	| { type: "added-slot"; content: T }
	| {
			type: "deleted-slot";
			index: number;
			initWhenLast?: boolean;
			initContent?: T;
	  }
	| { type: "selected-slot"; index: number };

type ContentAction<T> = { type: "changed-content"; content: SetStateAction<T> };

type EveryAction<T> = SlotAction<T> | ContentAction<T>;

function reducer<T>(state: SlotState<T>, action: EveryAction<T>): SlotState<T> {
	switch (action.type) {
		case "added-slot":
			return {
				...state,
				contents: [...state.contents, action.content],
				activeIndex: state.contents.length,
			};
		case "deleted-slot":
			if (action.initWhenLast && state.contents.length === 1) {
				if (!action.initContent) {
					throw new Error(
						"initContent is required when initWhenLast is true"
					);
				}
				return {
					...state,
					contents: [action.initContent],
					activeIndex: 0,
				};
			}
			return {
				...state,
				contents: state.contents.filter(
					(_, index) => index !== action.index
				),
				activeIndex:
					action.index <= state.activeIndex
						? state.activeIndex - 1
						: state.activeIndex,
			};
		case "selected-slot":
			return { ...state, activeIndex: action.index };
		case "changed-content":
			return {
				...state,
				contents: state.contents.map((c, i) => {
					if (i !== state.activeIndex) {
						return c;
					}
					const next = action.content;
					return typeof next === "function"
						? (next as (prev: T) => T)(c)
						: next;
				}),
			};
		default:
			throw new Error("Invalid action type");
	}
}

function useSlots<T>(initialContent: T) {
	const [state, dispatch] = useReducer(reducer<T>, {
		contents: [initialContent],
		activeIndex: 0,
	});

	const content = state.contents[state.activeIndex];
	const setContent = (nextContent: SetStateAction<T>) => {
		dispatch({
			type: "changed-content",
			content: nextContent,
		} as ContentAction<T>);
	};
	const slotDispatch = (action: SlotAction<T>) => dispatch(action);

	return {
		init: initialContent,
		state,
		dispatch: slotDispatch,
		content,
		setContent,
	};
}

export { useSlots, type SlotState, type SlotAction };
export default useSlots;
