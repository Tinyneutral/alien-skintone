import { useState } from "react";
import type { Id } from "@/features/palettes/lib/paletteIds";

import { ActivePaletteIdContext } from "./activePaletteIdContext.tsx";
import Palettes from "@/components/palettes/Palettes.tsx";
import DemoInfo from "./DemoInfo.tsx";
import "./App.css";

function App() {
	const [activeId, setActiveId] = useState<Id>(0);
	return (
		<ActivePaletteIdContext.Provider value={{ activeId, setActiveId }}>
			<div className="app">
				<Palettes />
				<DemoInfo />
			</div>
		</ActivePaletteIdContext.Provider>
	);
}

export default App;
