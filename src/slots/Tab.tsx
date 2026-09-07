import type { SlotAction } from "./useSlots.ts";

import "./Tab.css";

interface TabProps<T> {
	index: number;
	isActive: boolean;
	dispatch: (action: SlotAction<T>) => void;
	children: React.ReactNode;
}

function Tab<T>({ index, isActive, dispatch, children }: TabProps<T>) {
	return (
		<button
			className={isActive ? "tab active" : "tab"}
			onClick={() => dispatch({ type: "selected-slot", index })}>
			{children}
		</button>
	);
}

interface NewTabProps<T> {
	init: T;
	dispatch: (action: SlotAction<T>) => void;
}

function NewTab<T>({ init, dispatch }: NewTabProps<T>) {
	return (
		<button onClick={() => dispatch({ type: "added-slot", content: init })}>
			New Tab
		</button>
	);
}

export { Tab, NewTab };
