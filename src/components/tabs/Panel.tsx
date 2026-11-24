import { type ReactNode, useContext, Activity } from "react";
import { TabsContext } from "./TabsContext";

type PanelProps = {
	id: number;
	children: ReactNode;
};

function Panel({ id, children }: PanelProps) {
	const { activeId } = useContext(TabsContext);
	return (
		<Activity mode={activeId === id ? "visible" : "hidden"}>
			{children}
		</Activity>
	);
}

export { Panel };
