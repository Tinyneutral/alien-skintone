import { type ReactNode, useContext } from "react";
import { TabsContext } from "./TabsContext";

type PanelProps = {
	id: number;
	children: ReactNode;
};

function Panel({ id, children }: PanelProps) {
	const { activeId } = useContext(TabsContext);
	return activeId === id && children;
}

export { Panel };
