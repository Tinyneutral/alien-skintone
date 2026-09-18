import type { SlotAction } from "/features/useSlots.ts";

import "/Tab.css";

interface TabProps<T> {
	index: number;
	isActive: boolean;
	label: string;
	dispatch: (action: SlotAction<T>) => void;
	init: T;
	children: React.ReactNode;
}

function Tab<T>({
	index,
	isActive,
	label,
	dispatch,
	init,
	children,
}: TabProps<T>) {
	const handleSelect = () => {
		dispatch({ type: "selected-slot", index });
	};
	const handleClose = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.stopPropagation();
		dispatch({
			type: "deleted-slot",
			index,
			initWhenLast: true,
			initContent: init,
		});
	};
	return (
		<div className={isActive ? "tab active" : "tab"} onClick={handleSelect}>
			<div className="head">
				<p>{label}</p>
				<button className="close" onClick={handleClose}>
					<span className="icon">delete</span>
				</button>
			</div>
			{children}
		</div>
	);
}

interface NewTabProps<T> {
	init: T;
	dispatch: (action: SlotAction<T>) => void;
	children: React.ReactNode;
}

function NewTab<T>({ init, dispatch, children }: NewTabProps<T>) {
	return (
		<div className="new-tab">
			<button onClick={() => dispatch({ type: "added-slot", content: init })}>
				New Tab
			</button>
			<div hidden>{children}</div>
		</div>
	);
}

export { Tab, NewTab };
