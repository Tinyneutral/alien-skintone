import type { SlotAction } from "/features/useSlots";
import "./Tab.css";

interface TabProps<T> {
	index: number;
	isActive: boolean;
	label: string;
	init: T;
	dispatch: (action: SlotAction<T>) => void;
	children: React.ReactNode;
}

function Tab<T>({
	index,
	isActive,
	label,
	init,
	dispatch,
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
	text: string;
	children: React.ReactNode;
}

function NewTab<T>({ init, dispatch, text, children }: NewTabProps<T>) {
	return (
		<div className="new-tab">
			<button onClick={() => dispatch({ type: "added-slot", content: init })}>
				{text}
			</button>
			<div hidden>{children}</div>
		</div>
	);
}

export { Tab, NewTab };
