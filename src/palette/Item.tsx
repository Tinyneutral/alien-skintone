import Color from "colorjs.io";
import { useState, useEffect, useRef, useMemo, memo } from "react";

import { useAppDispatch, useAppSelector } from "@/app/hooks";
import outOfGamutUrl from "@/assets/svg/out-of-gamut.svg";
import { setDefaultEditSpace } from "@/features/defaultEditSpace";
import { copyCssColorToClipboard } from "@/feature-select";

import { toWeighted, deltaE } from "./closeness";
import "./Item.css";

type ItemProps = {
	color: cssColor;
	rank: number | "-";
	closeness: number;
	setCloseness: (closeness: number) => void;
	setIsEditing: (isEditing: boolean) => void;
	deleteSelf: () => void;
	style?: React.CSSProperties;
};

const Item = memo(
	({
		color,
		rank,
		closeness,
		setCloseness,
		setIsEditing,
		deleteSelf,
		style = {},
	}: ItemProps) => {
		const pickedColor = useAppSelector((state) => state.pickedColor);
		const featureSpace = Color.spaces.oklab; // TODO: redux
		const featureWeights: number[] = useMemo(() => [1, 0, 0], []); // TODO: redux

		const featureColor: string = useMemo(
			() => toWeighted(color, featureSpace, featureWeights),
			[color, featureSpace, featureWeights]
		);
		const pickedFeatureColor: string = useMemo(
			() => toWeighted(pickedColor, featureSpace, featureWeights),
			[pickedColor, featureSpace, featureWeights]
		);
		const newCloseness: number = useMemo(
			() => deltaE(featureColor, pickedFeatureColor),
			[featureColor, pickedFeatureColor]
		);
		useEffect(() => {
			if (newCloseness !== closeness) {
				setCloseness(newCloseness);
			}
		}, [color, closeness, newCloseness, setCloseness]);

		const handleEdit = () => {
			setIsEditing(true);
		};
		const handleCopy = () => {
			copyCssColorToClipboard(color);
		};

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
			<div className="item" style={style}>
				<div className={`rank ${rankClass}`}>
					<p>{rank}</p>
				</div>
				<div className="feature-color" style={bg(featureColor)}>
					<div
						className="picked-color-overlay"
						style={bg(pickedFeatureColor)}></div>
				</div>
				<div className="color" style={bg(color)}></div>
				<button className="edit" onClick={handleEdit}>
					<span className="icon">edit</span>
				</button>
				<button className="copy" onClick={handleCopy}>
					<span className="icon">copy</span>
				</button>
				<button className="delete" onClick={deleteSelf}>
					<span className="icon">delete</span>
				</button>
			</div>
		);
	}
);

type EditItemProps = {
	initialColor: cssColor;
	submitColor: (color: cssColor) => void;
	cancel: () => void;
	style?: React.CSSProperties;
};

function EditItem({
	initialColor,
	submitColor,
	cancel,
	style = {},
}: EditItemProps) {
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
		<div className="edit-item-container" style={style}>
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

type ItemHeaderProps = {
	style?: React.CSSProperties;
	ref?: React.Ref<HTMLDivElement>;
};

const ItemHeader = memo(({ style = {}, ref }: ItemHeaderProps) => {
	return (
		<div className="item header" style={style} ref={ref}>
			<div className="rank">
				<p>Rank</p>
			</div>
			<div className="color">
				<p>Color</p>
			</div>
		</div>
	);
});

type ItemWrapperProps = {
	index: number;
	color: cssColor;
	rank: number | "-";
	closeness: number;
	setCloseness: (closeness: number, index: number) => void;
	setColor: (color: cssColor, index: number) => void;
	removeColor: (index: number) => void;
	style?: React.CSSProperties;
};

const ItemWrapper = memo(
	({
		index,
		color,
		rank,
		closeness,
		setColor,
		setCloseness,
		removeColor,
		style = {},
	}: ItemWrapperProps) => {
		const [isEditing, setIsEditing] = useState(false);
		const handleSetColor = (color: cssColor) => {
			setIsEditing(false);
			setColor(color, index);
		};
		const handleSetCloseness = (closeness: number) => {
			setCloseness(closeness, index);
		};
		const cancelEdit = () => {
			setIsEditing(false);
		};
		const deleteSelf = () => {
			removeColor(index);
		};

		if (isEditing) {
			return (
				<EditItem
					initialColor={color}
					submitColor={handleSetColor}
					cancel={cancelEdit}
					style={style}
				/>
			);
		}
		return (
			<Item
				color={color}
				rank={rank}
				closeness={closeness}
				setCloseness={handleSetCloseness}
				setIsEditing={setIsEditing}
				deleteSelf={deleteSelf}
				style={style}
			/>
		);
	}
);

type NewItemProps = {
	addColor: (color: cssColor) => void;
	style?: React.CSSProperties;
};

function NewItem({ addColor, style = {} }: NewItemProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [savedInitialColor, saveInitialColor] = useState("#000000");

	const startEdit = () => {
		setIsEditing(true);
	};
	const cancelEdit = () => {
		setIsEditing(false);
	};
	const handleAddColor = (color: cssColor) => {
		setIsEditing(false);
		saveInitialColor(color);
		addColor(color);
	};

	if (isEditing) {
		return (
			<EditItem
				initialColor={savedInitialColor}
				submitColor={handleAddColor}
				cancel={cancelEdit}
				style={style}
			/>
		);
	} else {
		return (
			<div className="item new" style={style}>
				<button onClick={startEdit}>
					<span className="icon">add</span> Add Color
				</button>
			</div>
		);
	}
}

export { ItemWrapper as Item, ItemHeader, NewItem };
export default ItemWrapper;
