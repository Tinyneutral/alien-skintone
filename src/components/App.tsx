import { useState } from "react";
import type { Id } from "@/features/palettes/lib/paletteIds";

import { ActivePaletteIdContext } from "./activePaletteIdContext.tsx";
import Palettes from "@/components/palettes/Palettes.tsx";
import ColorPickers from "@/components/color-pickers/ColorPickers.tsx";
import "./App.css";

function App() {
	const [activeId, setActiveId] = useState<Id>(0);
	return (
		<ActivePaletteIdContext.Provider value={{ activeId, setActiveId }}>
			<div className="app">
				<Palettes />
				<p className="break"> </p>
				<ColorPickers />
				<p className="break"> </p>
				<DemoInfo />
				<Footer />
			</div>
		</ActivePaletteIdContext.Provider>
	);
}

function DemoInfo() {
	return (
		<div className="demo-info">
			<div className="en">
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
			<div className="jp">
				<p>
					本作は、擬人化用の色比較ツール「Alien-skintone」の一部のデモです。
				</p>
				<p>
					このツールは非人間の肌と人間の肌パレットにフィルターをかけ、近い{" "}
					順で順位をつけます。本作は、そのうち人間の肌パレットに当たります。
				</p>
				<p>
					本作のフィルターはグレースケールのみですが、完成版ではカスタマイズ{" "}
					可能にする予定です。
				</p>
			</div>
		</div>
	);
}

function Footer() {
	return (
		<footer>
			<p>
				Alien-skintone by{" "}
				<a href="https://github.com/alien-skintone">Tinyneutral</a>. All rights
				reserved.
			</p>
		</footer>
	);
}

export default App;
