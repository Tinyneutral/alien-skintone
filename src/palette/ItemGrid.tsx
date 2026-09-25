import { useState, useRef, useLayoutEffect, useMemo } from "react";
import { ItemHeader, Item, NewItem } from "./Item";
import "./ItemGrid.css";

type ItemGridProps = {
	colors: cssColor[];
	closenesses: number[];
	ranks: number[];
	addColor: (color: cssColor) => void;
	removeColor: (index: number) => void;
	setColor: (color: cssColor, index: number) => void;
	setCloseness: (closeness: number, index: number) => void;
	paletteRef: React.RefObject<HTMLDivElement | null>;
};

function ItemGrid({
	colors,
	closenesses,
	ranks,
	addColor,
	removeColor,
	setColor,
	setCloseness,
	paletteRef,
}: ItemGridProps) {
	const [inputtedRows, setInputtedRowAmount] = useState(4);
	const [possibleRows, setPossibleRowAmount] = useState(4);
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
	}, [possibleRows, paletteRef]);

	const rows = useMemo(
		() => Math.min(inputtedRows, possibleRows),
		[inputtedRows, possibleRows]
	);
	const [groupCols, setGroupCols] = useState(8);
	const groupItems = rows * groupCols;

	const gridRow = (row: number) => {
		const start = row * groupCols;
		const trills = getTrills(start, groupCols, groupItems, colors.length - 1);
		const isEndRow =
			Math.floor((colors.length % groupItems) / groupCols) === row;
		const style = { gridColumnStart: row + 1 };

		return [
			<ItemHeader
				key={`${row}-header`}
				style={style}
				ref={row === 0 ? cellRef : undefined}
			/>,
			...trills.map((trill) =>
				trill.map((index) => (
					<Item
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
						<NewItem
							key={`${row}-new`}
							addColor={addColor}
							style={style}
						/>,
					]
				: []),
		];
	};
	const gridRows = Array.from({ length: rows }, (_, row) => gridRow(row));

	return (
		<>
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
			<div
				className="grid"
				style={{ ["--rows"]: String(rows) } as React.CSSProperties}>
				{gridRows.flat().map((item) => item)}
			</div>
		</>
	);
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

export default ItemGrid;
