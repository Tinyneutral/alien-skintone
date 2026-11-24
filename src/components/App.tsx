import { useState } from "react";
import { useAppSelector, useAppDispatch } from "@/app/hooks";
import { addPalette, deletePalette } from "@/features/palettes/palettes";
import { selectPaletteEntries } from "@/features/palettes/palette";

import Tabs from "@/components/tabs";
import Palette from "@/components/palette/Palette.tsx";
import PalettePreview from "@/components/palette/Preview";

import "./App.css";

function App() {
	return (
		<>
			<PaletteWithTabs />
		</>
	);
}

function PaletteWithTabs() {
	const dispatch = useAppDispatch();
	const paletteEntries = useAppSelector(selectPaletteEntries);
	const paletteIds = useAppSelector((state) => state.palettes.paletteIds);
	const colors = useAppSelector((state) => state.palettes.colors);

	const [activeId, setActiveId] = useState(0);
	const nextIdPeek = useAppSelector((state) => state.palettes._nextId("peek"));

	return (
		<div className="app">
			<section className="palettes">
				<h2>Palettes</h2>
				<Tabs.Root activeIdOverride={{ activeId, setActiveId }}>
					<Tabs.List>
						{Object.entries(paletteIds).map(([sId, entries]) => {
							const id = parseInt(sId);
							return (
								<Tabs.Tab
									key={id}
									id={id}
									label={entries.length.toString()}
									onClose={() => {
										dispatch(deletePalette(id));
									}}>
									<PalettePreview
										colors6={paletteIds[id]
											.slice(0, 6)
											.map((entry) => colors[entry])}
									/>
								</Tabs.Tab>
							);
						})}
						<Tabs.NewTab
							onNewTab={() => {
								dispatch(addPalette());
								setActiveId(nextIdPeek);
							}}
							text="New Palette">
							<PalettePreview colors6={[]} />
						</Tabs.NewTab>
					</Tabs.List>
					{Object.entries(paletteIds).map(([sId]) => {
						const id = parseInt(sId);
						return (
							<Tabs.Panel key={id} id={id}>
								<Palette id={id} entries={paletteEntries[id]} />
							</Tabs.Panel>
						);
					})}
				</Tabs.Root>
			</section>
			<div className="dev">
				<div className="row" style={{ width: "33%" }}>
					<p>
						This is a demo program. This is a part of Alien-skintone, a color
						comparer for humanization. This program aids comparing non-human
						skin with human skintones, by showing a closeness-in-filter
						(currently grayscale) ranking in the skintone palette. Above is the
						palette portion.
						<br />
						P.S.: The filter will be customizable in the final version.
					</p>
				</div>
				<div className="row jp" style={{ width: "25em" }}>
					<p>
						本作は、擬人化用の色比較ツール「Alien-skintone」の一部のデモです。
					</p>
					<p>
						このツールは非人間の肌と人間の肌パレットにフィルターをかけ、近い
						<br />
						順で順位をつけます。本作は、そのうち人間の肌パレットに当たります。
					</p>
					<p>
						本作のフィルターはグレースケールのみですが、完成版ではカスタマイズ
						<br />
						可能にする予定です。
					</p>
				</div>
			</div>
		</div>
	);
}

export default App;
