import type { PaletteEntry } from "@/features/palettes/palette";
import { Item, NewItem, ItemHeader } from "./Item.tsx";
import "./ItemTable.css";

type ItemTableProps = {
	entries: PaletteEntry[];
	rows: number;
	groupCols: number;
};

function ItemTable({ entries, rows, groupCols }: ItemTableProps) {
	const groupItems = rows * groupCols;
	const tableRow = (row: number) => {
		const start = row * groupCols;
		const trills = getTrills(start, groupCols, groupItems, entries.length - 1);
		const isEndRow =
			Math.floor((entries.length % groupItems) / groupCols) === row;

		return [
			...trills.map((trill) =>
				trill.map((index) => (
					<Item
						key={`${index}`}
						id={entries[index].id}
						color={entries[index].color}
						rank={entries[index].rank}
					/>
				))
			),
			...(isEndRow ? [<NewItem key={`${row}-new`} />] : []),
		];
	};
	const tableHeaderRow = (row: number) => <ItemHeader key={`${row}-header`} />;

	const rowRange = Array.from({ length: rows }, (_, row) => row);
	const tableHeaderRows = rowRange.map(tableHeaderRow);
	const tableRows = rowRange.map(tableRow);

	return (
		<>
			<div
				className="table"
				style={{ ["--rows"]: String(rows) } as React.CSSProperties}>
				<div className="head">{tableHeaderRows.flat().map((item) => item)}</div>
				<div className="body">
					{tableRows.map((row, rowIndex) => (
						<div key={rowIndex} className="row">
							{row.map((item) => item)}
						</div>
					))}
				</div>
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

export default ItemTable;
