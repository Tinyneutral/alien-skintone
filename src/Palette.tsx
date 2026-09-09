import { useCallback, useState } from "react";

import type { Colors } from "./palette.ts";
import PaletteItem, { PaletteItemHeader } from "./PaletteItem.tsx";

import "./Palette.css";

type PaletteProps = {
	colors: Colors;
	setColors: (colors: Colors) => void;
};

function Palette({ colors, setColors }: PaletteProps) {
	const [closenesses, setClosenesses] = useState<number[]>(
		Array(colors.length).fill(Number.POSITIVE_INFINITY)
	);
	const setCloseness = useCallback((closeness: number, index: number) => {
		setClosenesses((prev) => {
			if (index >= prev.length) {
				const pad = Array(index - prev.length + 1).fill(
					Number.POSITIVE_INFINITY
				);
				return [...prev, ...pad, closeness];
			}
			return prev.with(index, closeness);
		});
	}, []);
	const ranks = getRanks(closenesses);

	const addColor = () => {
		setColors([...colors, "#000000"]);
		setClosenesses((prev) => [...prev, Number.POSITIVE_INFINITY]);
	};
	const removeColor = (index: number) => {
		setColors(colors.filter((_, i) => i !== index));
		setClosenesses((prev) => prev.filter((_, i) => i !== index));
	};
	const setColor = (index: number, color: string) => {
		setColors(colors.map((prevColor, i) => (i === index ? color : prevColor)));
	};

	const [index, setIndex] = useState(0);
	const handleInit = () => {
		setColors([
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
		]);
	};

	return (
		<div className="palette">
			<PaletteItemHeader />
			{colors.map((color, i) => (
				<PaletteItem
					key={i}
					color={color}
					rank={ranks[i]}
					closeness={closenesses[i]}
					setCloseness={setCloseness}
					closenessIndex={i}
				/>
			))}
			<button onClick={handleInit}>Init Palette</button>
			{colors.length > 0 && (
				<>
					<button onClick={addColor}>Add Color</button>
					<input
						type="number"
						value={index}
						onChange={(e) => setIndex(parseInt(e.target.value))}
					/>
					<button onClick={() => removeColor(index)}>
						Remove Color at Index
					</button>
					<input
						type="color"
						value={colors[index]}
						onChange={(e) => setColor(index, e.target.value)}
					/>
					<button onClick={() => setColor(index, colors[index])}>
						Set Color at Index
					</button>
				</>
			)}
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

export default Palette;
