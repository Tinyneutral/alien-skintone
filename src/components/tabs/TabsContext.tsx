import { createContext } from "react";

const TabsContext = createContext<{
	activeId: number;
	setActiveId: (id: number) => void;
}>({
	activeId: 0,
	setActiveId: () => {},
});

export { TabsContext };
