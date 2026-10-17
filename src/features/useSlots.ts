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

type ContentAction<A> = { type: "changed-content"; action: A };

type EveryAction<T, A> = SlotAction<T> | ContentAction<A>;

function reducerFactory<T, A>(contentReducer: (state: T, action: A) => T) {
	return (state: SlotState<T>, action: EveryAction<T, A>): SlotState<T> => {
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
							? Math.max(0, state.activeIndex - 1)
							: state.activeIndex,
				};
			case "selected-slot":
				return { ...state, activeIndex: action.index };
			case "changed-content":
				return {
					...state,
					contents: state.contents.map((content, i) => {
						if (i !== state.activeIndex) {
							return content;
						}
						return contentReducer(content, action.action);
					}),
				};
			default:
				throw new Error("Invalid action type");
		}
	};
}

function setStateReducer<T>(state: T, action: SetStateAction<T>) {
	return typeof action === "function"
		? (action as (prev: T) => T)(state)
		: action;
}

function useSlots<T, A = SetStateAction<T>>(
	initialContent: T,
	customReducer?: (state: T, action: A) => T
) {
	const contentReducer =
		customReducer ?? (setStateReducer as (state: T, action: A) => T);
	const reducer = reducerFactory(contentReducer);
	const [state, dispatch] = useReducer(reducer, {
		contents: [initialContent],
		activeIndex: 0,
	});

	const content = state.contents[state.activeIndex];
	const slotDispatch = (action: SlotAction<T>) => dispatch(action);
	const contentDispatch = (action: A) =>
		dispatch({ type: "changed-content", action });

	if (customReducer) {
		return {
			init: initialContent,
			state,
			dispatch: slotDispatch,
			content,
			contentDispatch,
		};
	}

	const setContent = (nextContent: SetStateAction<T>) => {
		contentDispatch(nextContent as A);
	};
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
