import useSlots from "../slots/useSlots.ts";
import { Tab, NewTab } from "../slots/Tab.tsx";
import PalettePreview from "../PalettePreview.tsx";
import Palette from "../Palette.tsx";
import type { Colors } from "../palette.ts";

import "./App.css";

function App() {
	return (
		<>
			<PaletteWithTabs />
		</>
	);
}

function PaletteWithTabs() {
	const {
		init,
		state,
		dispatch,
		content: colors,
		setContent: setColors,
	} = useSlots<Colors>([]);

	return (
		<section className="palettes">
			<h2>Palettes</h2>
			<div className="tabs">
				{state.contents.map((colors: Colors, index: number) => (
					<Tab<Colors>
						key={index}
						index={index}
						isActive={index === state.activeIndex}
						dispatch={dispatch}>
						<PalettePreview
							colors6={colors.slice(0, 6)}
							length={colors.length}
							isActive={index === state.activeIndex}
						/>
					</Tab>
				))}
				<NewTab<Colors> init={init} dispatch={dispatch} />
			</div>
			<Palette colors={colors} setColors={setColors} />
		</section>
	);
}

export default App;
