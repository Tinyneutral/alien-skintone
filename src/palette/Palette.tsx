import { useCallback, useRef, type SetStateAction } from "react";
import Color from "colorjs.io";

import ItemGrid from "./ItemGrid";

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

	return (
		<div className="palette" ref={paletteRef}>
			<ItemGrid
				colors={colors}
				closenesses={closenesses}
				ranks={ranks}
				addColor={addColor}
				removeColor={removeColor}
				setColor={setColor}
				setCloseness={setCloseness}
				paletteRef={paletteRef}
			/>
			<button onClick={handleInit}>Init Palette</button>
			<button onClick={handleInit2}>Init Palette 2</button>
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
	addColor("#ff0000");
	addColor("#008000");
	addColor("#0000ff");
	addColor("#ffff00");
	addColor("#800080");
	addColor("#ffa500");
	addColor("#a52a2a");
	addColor("#808080");
	addColor("#000000");
	addColor("#ffffff");
	addColor("#ff0000");
	addColor("#008000");
	addColor("#0000ff");
	addColor("#ffff00");
	addColor("#800080");
	addColor("#ffa500");
	addColor("#a52a2a");
	addColor("#808080");
	addColor("#000000");
	addColor("#ffffff");
	addColor("#ff0000");
	addColor("#008000");
	addColor("#0000ff");
	addColor("#ffff00");
	addColor("#800080");
	addColor("#ffa500");
	addColor("#a52a2a");
	addColor("#808080");
	addColor("#000000");
	addColor("#ffffff");
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

export default Palette;
