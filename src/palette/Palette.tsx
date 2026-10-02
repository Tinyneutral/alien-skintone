import { useCallback, useRef, type SetStateAction } from "react";
import Color from "colorjs.io";

import ItemTable from "./ItemTable";

import { type PaletteData, INITIAL_CLOSENESS } from "./palette.ts";
import "@/palette/Palette.css";

type PaletteProps = {
	content: {
		colors: cssColor[];
		closenesses: number[];
	};
	setPaletteData: (paletteData: SetStateAction<PaletteData>) => void;
};

function Palette({
	content: { colors, closenesses },
	setPaletteData,
}: PaletteProps) {
	const paletteRef = useRef<HTMLDivElement>(null);

	const setColors = useCallback(
		(colors: SetStateAction<cssColor[]>) => {
			if (typeof colors === "function") {
				setPaletteData((prev) => ({ ...prev, colors: colors(prev.colors) }));
			} else {
				setPaletteData((prev) => ({ ...prev, colors }));
			}
		},
		[setPaletteData]
	);
	const setClosenesses = useCallback(
		(closenesses: SetStateAction<number[]>) => {
			if (typeof closenesses === "function") {
				setPaletteData((prev) => ({
					...prev,
					closenesses: closenesses(prev.closenesses),
				}));
			} else {
				setPaletteData((prev) => ({ ...prev, closenesses }));
			}
		},
		[setPaletteData]
	);
	const ranks = getRanks(closenesses);

	const addColor = (color: cssColor) => {
		setColors((prev) => prev.concat(color));
		setClosenesses((prev) => prev.concat(INITIAL_CLOSENESS));
	};
	const removeColor = (index: number) => {
		setColors((prev) => prev.filter((_, i) => i !== index));
		setClosenesses((prev) => prev.filter((_, i) => i !== index));
	};
	const setColor = (color: cssColor, index: number) => {
		setColors((prev) => prev.toSpliced(index, 1, color));
		setClosenesses((prev) => prev.toSpliced(index, 1, INITIAL_CLOSENESS));
	};
	const setCloseness = (closeness: number, index: number) => {
		setClosenesses((prev) => prev.toSpliced(index, 1, closeness));
	};

	const handleInit = () => {
		initPalette(addColor);
	};
	const handleInit2 = () => {
		initPalette2(addColor);
	};
	const handleInit3 = () => {
		initPalette3(addColor);
	};

	return (
		<div className="palette" ref={paletteRef}>
			<ItemTable
				colors={colors}
				closenesses={closenesses}
				ranks={ranks}
				addColor={addColor}
				removeColor={removeColor}
				setColor={setColor}
				setCloseness={setCloseness}
				paletteRef={paletteRef}
			/>
			<div className="dev">
				<p>
					The buttons below are for demo use only. (There will be an "import
					palette" button as an alternative.)
				</p>
				<p>
					以下のボタンはデモ用で、完成版には含まれません。（完成版ではパレットを読み込む機能を実装する予定です。）
				</p>
					<button onClick={handleInit}>Init Palette</button>
					<button onClick={handleInit2}>Init Palette 2</button>
					<label>
						<button onClick={handleInit3}>The REAL Init Palette</button>
						{" "}palette made by _izz_ ( <a href="https://pin.it/69lsNiOWB" target="_blank" rel="noopener noreferrer">Pinterest link</a> )
					</label>
				</div>
			</div>
		</div>
	);
}

/**
 * Get ranks, closest first. Duplicates are marked as the same rank.
 * @param closenesses number[]
 */
function getRanks(closenesses: number[]) {
	const rankMap = closenesses
		.map((closeness, index) => ({ index, closeness }))
		.sort((a, b) => a.closeness - b.closeness)
		.map((entry, index) => ({ ...entry, rank: index + 1 }));
	const rankMapWithTies = rankMap;
	for (let i = 1; i < rankMap.length; i++) {
		const current = rankMapWithTies[i];
		const prev = rankMapWithTies[i - 1];
		if (current.closeness === prev.closeness) {
			current.rank = prev.rank;
		}
	}
	console.log(rankMapWithTies);
	return rankMapWithTies
		.sort((a, b) => a.index - b.index)
		.map((entry) => entry.rank);
}

function initPalette(addColor: (color: cssColor) => void) {
	const colors = [
		"#ff0000",
		"#008000",
		"#0000ff",
		"#ffff00",
		"#800080",
		"#ffa500",
		"#a52a2a",
		"#808080",
		"#000000",
		"#ffffff",
		"#ff0000",
		"#008000",
		"#0000ff",
		"#ffff00",
		"#800080",
		"#ffa500",
		"#a52a2a",
		"#808080",
		"#000000",
		"#ffffff",
		"#ff0000",
		"#008000",
		"#0000ff",
		"#ffff00",
		"#800080",
		"#ffa500",
		"#a52a2a",
		"#808080",
		"#000000",
		"#ffffff",
	];
	colors.forEach(addColor);
}

function initPalette2(addColor: (color: cssColor) => void) {
	const rep = 10;
	const color = new Color("red").to("srgb");
	for (let i = 0; i < rep; i++) {
		for (let j = 0; j < rep; j++) {
			color.set("r", i / (rep - 1));
			color.set("g", j / (rep - 1));
			addColor(color.display());
		}
	}
}

function initPalette3(addColor: (color: cssColor) => void) {
	const colors = [
		"#fef4ec",
		"#fdefe2",
		"#fee4d3",
		"#fad8bd",
		"#f4cdac",
		"#eec19a",
		"#e1ad88",
		"#d39d77",
		"#b48464",
		"#fde7d5",
		"#fadac3",
		"#fbcdb5",
		"#f4c2a7",
		"#ebb996",
		"#d5a17f",
		"#c18f6e",
		"#ad775b",
		"#8d5d48",
		"#ffeccb",
		"#fedcac",
		"#fecf97",
		"#f7bb7f",
		"#efa86a",
		"#e69b61",
		"#db9059",
		"#ca7a47",
		"#b46132",
		"#fdf4d8",
		"#fee7bb",
		"#fedea1",
		"#fdd496",
		"#fdc383",
		"#fdb777",
		"#f8a167",
		"#f3925b",
		"#da834d",
		"#fbedc1",
		"#fae3af",
		"#fdd18e",
		"#f8c47b",
		"#f4b46c",
		"#f4a25e",
		"#e98b4b",
		"#cf7a43",
		"#9f582a",
		"#ffd598",
		"#f6cb8d",
		"#ecbb78",
		"#e0ac6b",
		"#d19652",
		"#c78640",
		"#b57839",
		"#a56a32",
		"#8c5626",
		"#fadcb7",
		"#f7cb9c",
		"#ebbc89",
		"#e2af76",
		"#c79768",
		"#a57a51",
		"#835838",
		"#6e3f23",
		"#5b250f",
		"#f6d5c2",
		"#efbc9f",
		"#e5aa88",
		"#d79972",
		"#c3885c",
		"#ab7245",
		"#8c5c38",
		"#765232",
		"#634123",
		"#f1c197",
		"#e8b07f",
		"#ce9462",
		"#c38961",
		"#b57b55",
		"#ad6e4e",
		"#966046",
		"#85523d",
		"#6d4637",
		"#f1b596",
		"#e69d7a",
		"#c8845f",
		"#b2744f",
		"#9b613c",
		"#835130",
		"#5e3e25",
		"#402b1a",
		"#2b1e13",
		"#f8b095",
		"#eb9b7a",
		"#e18b67",
		"#d0805d",
		"#c47a55",
		"#b76c4d",
		"#a56444",
		"#7b482d",
		"#45291e",
		"#e6c8a6",
		"#dbbd9b",
		"#cdab86",
		"#bc9a74",
		"#a98b69",
		"#947a5c",
		"#846a4f",
		"#6c5744",
		"#342c29"
	];
	colors.forEach(hex => addColor(hex));
}

export default Palette;
