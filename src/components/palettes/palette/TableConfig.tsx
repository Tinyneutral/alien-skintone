import { useState, useRef, useLayoutEffect, useMemo, useEffect } from "react";
import { ItemHeader } from "./Item.tsx";
import "./TableConfig.css";

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
	useLayoutEffect(() => {
		if (!maxWidthRef.current) return;
		let lastWidth = 0;
		let timeoutId: ReturnType<typeof setTimeout>;

		const observer = new ResizeObserver(([entry]) => {
			if (!maxWidthRef.current || !cellRef.current) {
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

			const style = getComputedStyle(cellRef.current);
			const minCellWidth = parseFloat(style.minWidth);
			const possibleNextRows = Math.max(Math.floor(width / minCellWidth), 1);
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
		</div>
	);
}

export default TableConfig;
