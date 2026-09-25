import {
	useState,
	useMemo,
	useCallback,
	useLayoutEffect,
	useRef,
	type SetStateAction,
} from "react";
import Color from "colorjs.io";

import { type PaletteData, INITIAL_CLOSENESS } from "./palette.ts";
import PaletteItem, {
	NewPaletteItem,
	PaletteItemHeader,
} from "./PaletteItem.tsx";

import "./Palette.css";

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
	const [inputtedRows, setInputtedRowAmount] = useState(4);
	const [possibleRows, setPossibleRowAmount] = useState(4);
	const paletteRef = useRef<HTMLDivElement>(null);
	const cellRef = useRef<HTMLDivElement>(null);
	useLayoutEffect(() => {
		if (!paletteRef.current) return;
		let lastWidth = 0;
		let timeoutId: ReturnType<typeof setTimeout>;

		const observer = new ResizeObserver(([entry]) => {
			if (!paletteRef.current || !cellRef.current) return;

			const width = Math.round(entry.contentBoxSize[0].inlineSize);
			if (width === lastWidth) {
				return;
			}
			lastWidth = width;

			observer.unobserve(paletteRef.current);
			clearTimeout(timeoutId);
			timeoutId = setTimeout(() => {
				if (paletteRef.current) {
					observer.observe(paletteRef.current);
				}
			}, 333);

			const cellStyle = getComputedStyle(cellRef.current);
			const cellWidthMin = parseFloat(cellStyle.minWidth);
			const possibleNextRows = Math.max(Math.floor(width / cellWidthMin), 1);
			if (possibleNextRows === possibleRows) return;
			setPossibleRowAmount(possibleNextRows);
		});
		observer.observe(paletteRef.current);
		return () => {
			observer.disconnect();
			if (timeoutId) {
				clearTimeout(timeoutId);
			}
		};
	}, [possibleRows]);

	const rows = useMemo(
		() => Math.min(inputtedRows, possibleRows),
		[inputtedRows, possibleRows]
	);
	const [groupCols, setGroupCols] = useState(8);
	console.log(rows);

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

	const groupItems = rows * groupCols;
	const gridRow = (row: number) => {
		const start = row * groupCols;
		const trills = getTrills(start, groupCols, groupItems, colors.length - 1);
		const isEndRow =
			Math.floor((colors.length % groupItems) / groupCols) === row;
		const style = { gridColumnStart: row + 1 };

		return [
			<PaletteItemHeader
				key={`${row}-header`}
				style={style}
				ref={row === 0 ? cellRef : undefined}
			/>,
			...trills.map((trill) =>
				trill.map((index) => (
					<PaletteItem
						key={`${row}-${index}`}
						index={index}
						color={colors[index]}
						rank={ranks[index]}
						closeness={closenesses[index]}
						setCloseness={setCloseness}
						setColor={setColor}
						removeColor={removeColor}
						style={style}
					/>
				))
			),
			...(isEndRow
				? [
						<NewPaletteItem
							key={`${row}-new`}
							addColor={addColor}
							style={style}
						/>,
					]
				: []),
		];
	};
	const gridRows = Array.from({ length: rows }, (_, row) => gridRow(row));

	const handleInit = () => {
		initPalette(addColor);
	};
	const handleInit2 = () => {
		initPalette2(addColor);
	}

	return (
		<div
			className="palette"
			style={{ ["--rows"]: String(rows) } as React.CSSProperties}
			ref={paletteRef}>
			<div className="grid-config">
				<label>
					Rows:{" "}
					<input
						type="number"
						value={inputtedRows}
						min={1}
						max={possibleRows}
						step={1}
						onChange={(e) => setInputtedRowAmount(parseInt(e.target.value))}
					/>
				</label>
				<label>
					Columns:{" "}
					<input
						type="number"
						value={groupCols}
						min={1}
						max={99}
						step={1}
						onChange={(e) => setGroupCols(parseInt(e.target.value))}
					/>{" "}
					each
				</label>
			</div>
			<div className="grid">
				{gridRows.flatMap((row, rowIndex) =>
					row.flatMap((item, i) => {
						if (i % groupCols === 1) {
							return [
								<div
									key={`${rowIndex}-divider-${i}`}
									className="divider"
									style={{ gridColumnStart: rowIndex + 1 }}
								/>,
								item,
							];
						}
						return item;
					})
				)}
			</div>
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

function getTrills(
	start: number,
	length: number,
	step: number,
	max: number
): number[][] {
	const trills: number[][] = [];
	for (let i = start; i <= max; i += step) {
		const trill: number[] = [];
		for (let j = i; j < i + length; j++) {
			if (j > max) {
				break;
			}
			trill.push(j);
		}
		trills.push(trill);
	}
	return trills;
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
