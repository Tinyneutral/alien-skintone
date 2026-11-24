import { useState, useRef, useLayoutEffect, useMemo, useContext } from "react";
import Color from "colorjs.io";
import type { Id } from "@/features/palettes/lib/paletteIds";
import type { PaletteEntry } from "@/features/palettes/palette";

import { useAppDispatch } from "@/app/hooks";
import { addColors } from "@/features/palettes/palette";
import { ItemHeader, Item, NewItem } from "./Item";
// import DevButtons from "./DevButtons";
import { PaletteContext } from "./PaletteContext";
import "./Palette.css";

type PaletteProps = {
	id: Id;
	entries: PaletteEntry[];
};

function Palette({ id, entries }: PaletteProps) {
	const [possibleRows, setPossibleRowAmount] = useState(4);
	const paletteRef = useRef<HTMLDivElement>(null);
	const cellRef = useRef<HTMLDivElement>(null);
	useLayoutEffect(() => {
		if (!paletteRef.current) return;
		let lastWidth = 0;
		let timeoutId: ReturnType<typeof setTimeout>;

		const observer = new ResizeObserver(([entry]) => {
			if (!paletteRef.current || !cellRef.current) {
				return;
			}
			const width = Math.round(entry.contentBoxSize[0].inlineSize);
			if (width === lastWidth) {
				return;
			}
			lastWidth = width;
			console.log("width", width);

			observer.unobserve(paletteRef.current);
			clearTimeout(timeoutId);
			timeoutId = setTimeout(() => {
				if (paletteRef.current) {
					observer.observe(paletteRef.current);
				}
			}, 333);

			const style = getComputedStyle(cellRef.current);
			const minCellWidth = parseFloat(style.minWidth);
			const possibleNextRows = Math.max(Math.floor(width / minCellWidth), 1);
			if (possibleNextRows === possibleRows) return;
			console.log("possibleNextRows", possibleNextRows, "possibleRows", possibleRows);
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

	return (
		<PaletteContext.Provider value={id}>
			<div className="palette" ref={paletteRef}>
				<ItemTable
					entries={entries}
					possibleRows={possibleRows}
					cellRef={cellRef}
				/>
				<DevButtons />
			</div>
		</PaletteContext.Provider>
	);
}

type ItemTableProps = {
	entries: PaletteEntry[];
	possibleRows: number;
	cellRef: React.RefObject<HTMLDivElement | null>;
};

function ItemTable({ entries, possibleRows, cellRef }: ItemTableProps) {
	const [inputtedRows, setInputtedRowAmount] = useState(4);
	const rows = useMemo(
		() => Math.min(inputtedRows, possibleRows),
		[inputtedRows, possibleRows]
	);
	const [groupCols, setGroupCols] = useState(8);
	const groupItems = rows * groupCols;

	const tableRow = (row: number) => {
		const start = row * groupCols;
		const trills = getTrills(start, groupCols, groupItems, entries.length - 1);
		const isEndRow =
			Math.floor((entries.length % groupItems) / groupCols) === row;
		const style = {};

		return [
			...trills.map((trill) =>
				trill.map((index) => (
					<Item
						key={`${index}`}
						id={entries[index].id}
						color={entries[index].color}
						rank={entries[index].rank}
						style={style}
					/>
				))
			),
			...(isEndRow ? [<NewItem key={`${row}-new`} style={style} />] : []),
		];
	};
	const tableHeaderRow = (row: number) => {
		const style = { gridColumnStart: row + 1 };
		return (
			<ItemHeader
				key={`${row}-header`}
				style={style}
				ref={row === 0 ? cellRef : undefined}
			/>
		);
	};

	const rowRange = Array.from({ length: rows }, (_, row) => row);
	const tableHeaderRows = rowRange.map(tableHeaderRow);
	const tableRows = rowRange.map(tableRow);

	return (
		<>
			<div className="table-config">
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

function DevButtons() {
	const id = useContext(PaletteContext);
	const dispatch = useAppDispatch();
	const dispatchAddColors = (colors: cssColor[]) =>
		dispatch(addColors({ paletteId: id, colors }));

	const handleInit = () => {
		initPalette(dispatchAddColors);
	};
	const handleInit2 = () => {
		initPalette2(dispatchAddColors);
	};
	const handleInit3 = () => {
		initPalette3(dispatchAddColors);
	};

	return (
		<div className="dev">
			<p>
				The buttons below are for demo use only. (There will be an "import
				palette" button as an alternative.)
			</p>
			<p>
				以下のボタンはデモ用で、完成版には含まれません。（完成版ではパレットを読み込む機能を実装する予定です。）
			</p>
			<div className="inputs">
				<button onClick={handleInit}>Init Palette</button>
				<button onClick={handleInit2}>Init Palette 2</button>
				<label>
					<button onClick={handleInit3}>The REAL Init Palette</button> palette
					made by _izz_ ({" "}
					<a
						href="https://pin.it/69lsNiOWB"
						target="_blank"
						rel="noopener noreferrer">
						Pinterest link
					</a>{" "}
					)
				</label>
			</div>
		</div>
	);
}

function initPalette(addColors: (colors: cssColor[]) => void) {
	addColors([
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
	]);
}

function initPalette2(addColors: (colors: cssColor[]) => void) {
	const rep = 10;
	const color = new Color("red").to("srgb");
	const colors = [];
	for (let i = 0; i < rep; i++) {
		for (let j = 0; j < rep; j++) {
			color.set("r", i / (rep - 1));
			color.set("g", j / (rep - 1));
			colors.push(color.display());
		}
	}
	addColors(colors);
}

function initPalette3(addColors: (colors: cssColor[]) => void) {
	addColors([
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
		"#342c29",
	]);
}

export default Palette;
