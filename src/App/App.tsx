import useSlots from "/features/useSlots.ts";
import { Tab, NewTab } from "/Tab.tsx";
import PalettePreview from "/palette/PalettePreview";
import Palette from "/palette/Palette.tsx";
import { initialPalette, type PaletteData } from "/palette/palette.ts";

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
		content: paletteData,
		setContent: setPaletteData,
	} = useSlots<PaletteData>(initialPalette);

	return (
		<section className="palettes">
			<h2>Palettes</h2>
			<div className="tabs">
				{state.contents.map((content: PaletteData, index: number) => (
					<Tab<PaletteData>
						key={index}
						index={index}
						isActive={index === state.activeIndex}
						label={`${content.colors.length}`}
						init={init}
						dispatch={dispatch}>
						<PalettePreview
							colors6={content.colors.slice(0, 6)}
							isActive={index === state.activeIndex}
						/>
					</Tab>
				))}
				<NewTab<PaletteData> init={init} dispatch={dispatch} text="New Palette">
					<PalettePreview colors6={[]} isActive={false} />
				</NewTab>
			</div>
			{paletteData && (
				<Palette content={paletteData} setPaletteData={setPaletteData} />
			)}
		</section>
	);
}

export default App;
