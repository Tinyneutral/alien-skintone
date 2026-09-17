import useSlots from "/features/useSlots.ts";
import { Tab, NewTab } from "/Tab.tsx";
import PalettePreview from "../PalettePreview.tsx";
import Palette from "/palette.tsx";
import type { Colors } from "/palette.ts";

import "/app/App.css";

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
						label={`${colors.length}`}
						dispatch={dispatch}
						init={init}>
						<PalettePreview
							colors6={colors.slice(0, 6)}
							isActive={index === state.activeIndex}
						/>
					</Tab>
				))}
				<NewTab<Colors> init={init} dispatch={dispatch}>
					<PalettePreview colors6={[]} isActive={false} />
				</NewTab>
			</div>
			{colors && <Palette colors={colors} setColors={setColors} />}
		</section>
	);
}

export default App;
