import { useContext } from "react";
import { TabsContext } from "./TabsContext";

interface TabProps {
	id: number;
	label: string;
	onClose: () => void;
	children: React.ReactNode;
}

function Tab({ id, label, onClose, children }: TabProps) {
	const { activeId, setActiveId } = useContext(TabsContext);
	return (
		<div
			className={id === activeId ? "tab active" : "tab"}
			onClick={() => setActiveId(id)}>
			<div className="head">
				<p>{label}</p>
				<button className="close" onClick={onClose}>
					<span className="icon">delete</span>
				</button>
			</div>
			{children}
		</div>
	);
}

interface NewTabProps {
	onNewTab: () => void;
	text: string;
	children: React.ReactNode;
}

function NewTab({ onNewTab, text, children }: NewTabProps) {
	return (
		<div className="new-tab">
			<button onClick={() => onNewTab()}>{text}</button>
			<div hidden>{children}</div>
		</div>
	);
}

export { Tab, NewTab };
