import type { Id } from "@/features/palettes/lib/paletteIds";

import { PaletteContext } from "./PaletteContext";
import DevButtons from "./DevButtons";
import "./Root.css";

type PaletteProps = {
	id: Id;
	children: React.ReactNode;
};

function Root({ id, children }: PaletteProps) {
	return (
		<PaletteContext.Provider value={id}>
			<div className="palette">
				{children}
				<DevButtons />
			</div>
		</PaletteContext.Provider>
	);
}

export default Root;
