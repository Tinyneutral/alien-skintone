import { type ReactNode, useState } from "react";
import { TabsContext } from "./TabsContext";

type RootProps = {
	activeIdOverride?: {
		activeId: number;
		setActiveId: (id: number) => void;
	};
	children: ReactNode;
};

function Root({ children, activeIdOverride = undefined }: RootProps) {
	const [activeId, setActiveId] = useState(0);

	return (
		<TabsContext.Provider value={activeIdOverride ?? { activeId, setActiveId }}>
			{children}
		</TabsContext.Provider>
	);
}

export { Root };
