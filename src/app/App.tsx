import useSlots from "@/features/useSlots";
import { Tab, NewTab } from "@/Tab";
import PalettePreview from "@/palette/Preview";
import Palette from "@/palette/Palette.tsx";
import { initialPalette, type PaletteData } from "@/palette/palette.ts";

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
		<div className="app">
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
					<NewTab<PaletteData>
						init={init}
						dispatch={dispatch}
						text="New Palette">
						<PalettePreview colors6={[]} isActive={false} />
					</NewTab>
				</div>
				{paletteData && (
					<Palette content={paletteData} setPaletteData={setPaletteData} />
				)}
			</section>
			<div className="dev">
				<div className="row" style={{ width: "33%" }}>
					<p>
						This is a demo program. This is a part of Alien-skintone, a color
						comparer for humanization. This program aids comparing non-human skin
						with human skintones, by showing a closeness-in-filter (currently
						grayscale) ranking in the skintone palette. Above is the palette
						portion.
						<br />
						P.S.: The filter will be customizable in the final version.
					</p>
				</div>
				<div className="row jp" style={{ width: "25em" }}>
					<p>本作は、擬人化用の色比較ツール「Alien-skintone」の一部のデモです。</p>
					<p>このツールは非人間の肌と人間の肌パレットにフィルターをかけ、近い<br />順で順位をつけます。本作は、そのうち人間の肌パレットに当たります。</p>
					<p>本作のフィルターはグレースケールのみですが、完成版ではカスタマイズ<br />可能にする予定です。</p>
				</div>
			</div>
		</div>
	);
}

export default App;
