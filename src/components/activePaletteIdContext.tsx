import { createContext } from "react";
import type { Id } from "@/features/palettes/lib/paletteIds";

const ActivePaletteIdContext = createContext<{
	activeId: Id;
	setActiveId: (id: Id) => void;
}>({
	activeId: 0,
	setActiveId: () => {},
});

export { ActivePaletteIdContext };
