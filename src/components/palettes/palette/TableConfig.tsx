import { useState, useRef, useLayoutEffect, useMemo, useEffect } from "react";
import { ItemHeader } from "./Item.tsx";
import "./TableConfig.css";

const GAP_REM = 0.8;
const BORDER_REM = 0.6;

type TableConfigProps = {
	rowState: {
		rows: number;
		setRowAmount: (rows: number) => void;
	};
	groupColsState: {
		groupCols: number;
		setGroupColAmount: (groupCols: number) => void;
	};
};

function TableConfig({ rowState, groupColsState }: TableConfigProps) {
	const [possibleRows, setPossibleRowAmount] = useState(4);
	const maxWidthRef = useRef<HTMLDivElement>(null);
	const cellRef = useRef<HTMLDivElement>(null);
	const remRef = useRef<HTMLDivElement>(null);
	useLayoutEffect(() => {
		if (!maxWidthRef.current) return;
		let lastWidth = 0;
		let timeoutId: ReturnType<typeof setTimeout>;

		const observer = new ResizeObserver(([entry]) => {
			if (!maxWidthRef.current || !cellRef.current || !remRef.current) {
				return;
			}
			const width = Math.round(entry.contentBoxSize[0].inlineSize);
			if (width === lastWidth) {
				return;
			}
			lastWidth = width;
			console.log("width", width);

			observer.unobserve(maxWidthRef.current);
			clearTimeout(timeoutId);
			timeoutId = setTimeout(() => {
				if (maxWidthRef.current) {
					observer.observe(maxWidthRef.current);
				}
			}, 333);

			const minCellWidth = parseFloat(
				getComputedStyle(cellRef.current).minWidth
			);
			const REM = parseFloat(getComputedStyle(remRef.current).width);
			const gapWidth = REM * GAP_REM;
			const borderWidth = REM * BORDER_REM;
			const possibleNextRows = Math.max(
				1,
				Math.floor(
					(width + gapWidth - 2 * borderWidth) / (minCellWidth + gapWidth)
					// When a: minCellWidth, b: gapWidth, c: borderWidth, w: width,
					// x: possibleNextRows, then:
					// ax + b(x - 1) + 2c <= w  <->  x <= (w + b - 2c) / (a + b)
				)
			);
			if (possibleNextRows === possibleRows) return;
			console.log(
				"possibleNextRows",
				possibleNextRows,
				"possibleRows",
				possibleRows
			);
			setPossibleRowAmount(possibleNextRows);
		});
		observer.observe(maxWidthRef.current);
		return () => {
			observer.disconnect();
			if (timeoutId) {
				clearTimeout(timeoutId);
			}
		};
	}, [possibleRows, maxWidthRef]);

	const [inputtedRows, setInputtedRowAmount] = useState(4);
	const calculatedRows = useMemo(
		() => Math.min(inputtedRows, possibleRows),
		[inputtedRows, possibleRows]
	);
	const { rows, setRowAmount } = rowState;
	useEffect(() => {
		if (calculatedRows === rows) return;
		setRowAmount(calculatedRows);
	}, [calculatedRows, rows, setRowAmount]);

	const { groupCols, setGroupColAmount } = groupColsState;

	return (
		<div className="table-config" ref={maxWidthRef}>
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
					onChange={(e) => setGroupColAmount(parseInt(e.target.value))}
				/>{" "}
				each
			</label>
			<ItemHeader ref={cellRef} isTransparent />
			<div ref={remRef} style={{ width: "1rem" }} />
		</div>
	);
}

export default TableConfig;
