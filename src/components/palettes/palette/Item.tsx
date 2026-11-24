import Color from "colorjs.io";
import { useState, useEffect, useContext, useRef, useMemo, memo } from "react";

import type { EntryId } from "@/features/palettes/lib/paletteIds";
import { filter } from "@/features/palettes/lib/ranks";

import outOfGamutUrl from "@/assets/svg/out-of-gamut.svg";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { setDefaultEditSpace } from "@/features/defaultEditSpace";
import {
	addColor,
	changeColor,
	deleteColor,
} from "@/features/palettes/palette";
import { PaletteContext } from "./PaletteContext";
import "./Item.css";

type ItemProps = {
	id: EntryId;
	color: cssColor;
	rank: number | "-";
	setIsEditing: (isEditing: boolean) => void;
};

const Item = memo(({ id, color, rank, setIsEditing }: ItemProps) => {
	const paletteId = useContext(PaletteContext);
	const dispatch = useAppDispatch();

	const f = useAppSelector((state) => state.palettes.filter);
	const filteredColor = filter(color, f);
	const filteredTarget = useAppSelector((state) => state.palettes.target);

	const rankClass = useMemo(() => {
		if (typeof rank !== "number") {
			return "none";
		} else if (rank <= 3) {
			return "great";
		} else if (rank <= 10) {
			return "good";
		} else {
			return "meh";
		}
	}, [rank]);
	const bg = (color: cssColor): React.CSSProperties => {
		return { backgroundColor: color };
	};
	return (
		<div className="item">
			<div className={`rank ${rankClass}`}>
				<p>{rank}</p>
			</div>
			<div className="filtered-color" style={bg(filteredColor)}>
				<div className="target-color-overlay" style={bg(filteredTarget)}></div>
			</div>
			<div className="color" style={bg(color)}></div>
			<button className="edit" onClick={() => setIsEditing(true)}>
				<span className="icon">edit</span>
			</button>
			<button className="copy" onClick={() => copyCssColorToClipboard(color)}>
				<span className="icon">copy</span>
			</button>
			<button
				className="delete"
				onClick={() => dispatch(deleteColor({ paletteId, id }))}>
				<span className="icon">delete</span>
			</button>
		</div>
	);
});

type EditItemProps = {
	initialColor: cssColor;
	submitColor: (color: cssColor) => void;
	cancel: () => void;
};

function EditItem({ initialColor, submitColor, cancel }: EditItemProps) {
	const defaultSpace = useAppSelector((state) => state.defaultEditSpace);
	const dispatch = useAppDispatch();
	const [color, setColor] = useState(new Color(initialColor).to(defaultSpace));
	console.log(color.space.name);
	console.log(color.space.coords);
	console.log(color.coords);

	const firstCoordRef = useRef<HTMLInputElement>(null);
	useEffect(() => {
		if (firstCoordRef.current) {
			firstCoordRef.current.focus();
		}
	}, []);

	const setCoord = (coordName: string, value: number) => {
		setColor((prev) => new Color(prev).set(coordName, value));
	};
	const setSpace = (space: string) => {
		setColor((prev) => new Color(prev).to(Color.spaces[space]));
	};
	const handleSubmit = () => {
		dispatch(setDefaultEditSpace(color.space.id));
		submitColor(color.display());
	};

	const bg = (color: cssColor): React.CSSProperties => {
		return { backgroundColor: color };
	};
	return (
		<div className="edit-item-container">
			<div className="edit-item">
				<div className="preview">
					<div className="now" style={bg(color.display())}></div>
					<div className="prev" style={bg(initialColor)}></div>
				</div>
				<div className="coords">
					{Object.entries(color.space.coords).map(([name, coord], index) => (
						<label className="coord" key={name}>
							<span className="label">{name.toUpperCase()}</span>
							<input
								type="number"
								min={coord.refRange?.[0] ?? 0}
								max={coord.refRange?.[1] ?? 1}
								step={(rangeWidthDigit(coord.refRange) ?? 1) / 100}
								value={no0atEnd(color.coords[index]?.toPrecision(5)) ?? 0}
								onChange={(e) => setCoord(name, parseFloat(e.target.value))}
								ref={index === 0 ? firstCoordRef : null}
							/>
						</label>
					))}
				</div>
				<div className="actions-and-warning">
					<button className="submit" onClick={handleSubmit}>
						Submit
					</button>
					<button className="cancel" onClick={cancel}>
						Cancel
					</button>
					{!color.inGamut() && (
						<div className="out-of-gamut">
							<img src={outOfGamutUrl} alt="Out of gamut" />
						</div>
					)}
				</div>
				<select
					className="space"
					value={color.space.id}
					onChange={(e) => setSpace(e.target.value)}>
					{Object.entries(Color.spaces).map(([name, { id }]) => (
						<option key={name} value={id}>
							{name}
						</option>
					))}
				</select>
			</div>
		</div>
	);
}

function rangeWidthDigit(range: [number, number] | undefined) {
	if (!range) {
		return null;
	}
	const width = range[1] - range[0];
	const widthDigit = width.toPrecision(1).replace(/[^0\D]/, "1");
	return parseFloat(widthDigit);
}

function no0atEnd(value: string | undefined) {
	if (!value) {
		return null;
	}
	return parseFloat(value);
}

type ItemWrapperProps = {
	id: EntryId;
	color: cssColor;
	rank: number | "-";
};

const ItemWrapper = memo(({ id, color, rank }: ItemWrapperProps) => {
	const paletteId = useContext(PaletteContext);
	const dispatch = useAppDispatch();
	const [isEditing, setIsEditing] = useState(false);

	if (isEditing) {
		return (
			<EditItem
				initialColor={color}
				submitColor={(color: cssColor) => {
					setIsEditing(false);
					dispatch(changeColor({ paletteId, id, color }));
				}}
				cancel={() => setIsEditing(false)}
			/>
		);
	} else {
		return (
			<Item id={id} color={color} rank={rank} setIsEditing={setIsEditing} />
		);
	}
});

function NewItem() {
	const paletteId = useContext(PaletteContext);
	const dispatch = useAppDispatch();
	const [isEditing, setIsEditing] = useState(false);
	const [savedInitialColor, saveInitialColor] = useState("#000000");

	if (isEditing) {
		return (
			<EditItem
				initialColor={savedInitialColor}
				submitColor={(color: cssColor) => {
					setIsEditing(false);
					saveInitialColor(color);
					dispatch(addColor({ paletteId, color }));
				}}
				cancel={() => setIsEditing(false)}
			/>
		);
	} else {
		return (
			<div className="item new">
				<button onClick={() => setIsEditing(true)}>
					<span className="icon">add</span> Add Color
				</button>
			</div>
		);
	}
}

type ItemHeaderProps = {
	isTransparent?: boolean;
	ref?: React.Ref<HTMLDivElement>;
};

const ItemHeader = memo(({ isTransparent, ref }: ItemHeaderProps) => {
	return (
		<div
			className={`item header${isTransparent ? " transparent" : ""}`}
			ref={ref}>
			<div className="rank">
				<p>Rank</p>
			</div>
			<div className="color">
				<p>Color</p>
			</div>
		</div>
	);
});

async function copyCssColorToClipboard(color: cssColor) {
	await navigator.clipboard.writeText(new Color(color).display());
}

export { ItemWrapper as Item, NewItem, ItemHeader };
export default ItemWrapper;
