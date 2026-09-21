import Color from "colorjs.io";
import { useState, useEffect, useRef, useMemo, memo } from "react";

import { useAppDispatch, useAppSelector } from "/app/hooks.ts";
import { setDefaultEditSpace } from "/features/defaultEditSpace.ts";
import { toWeighted, deltaE } from "./closest.ts";
import { copyCssColorToClipboard } from "/feature-select.ts";
import outOfGamutUrl from "/assets/svg/out-of-gamut.svg";

import "/PaletteItem.css";

type PaletteItemProps = {
	color: cssColor;
	rank: number | "-";
	closeness: number;
	setCloseness: (closeness: number) => void;
	setIsEditing: (isEditing: boolean) => void;
	deleteSelf: () => void;
};

const PaletteItem = memo(
	({
		color,
		rank,
		closeness,
		setCloseness,
		setIsEditing,
		deleteSelf,
	}: PaletteItemProps) => {
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
			<div className="palette-item">
				<div className="feature-color" style={bg(featureColor)}>
					<div
						className="picked-color-overlay"
						style={bg(pickedFeatureColor)}></div>
				</div>
				<div className="color" style={bg(color)}></div>
				<p className={`rank ${rankClass}`}>{rank}</p>
				<div className="buttons">
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
			</div>
		);
	}
);

type EditPaletteItemProps = {
	initialColor: cssColor;
	submitColor: (color: cssColor) => void;
	cancel: () => void;
};

function EditPaletteItem({
	initialColor,
	submitColor,
	cancel,
}: EditPaletteItemProps) {
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
		<div className="edit-palette-item">
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

const PaletteItemHeader = memo(() => {
	return (
		<div className="palette-item header">
			<div className="feature-color">
				<div className="picked-color-overlay"></div>
			</div>
			<p className="color">Color</p>
			<p className="meta">Rank</p>
		</div>
	);
});

type PaletteItemWrapperProps = {
	index: number;
	color: cssColor;
	rank: number | "-";
	closeness: number;
	setCloseness: (closeness: number, index: number) => void;
	setColor: (color: cssColor, index: number) => void;
	removeColor: (index: number) => void;
};

const PaletteItemWrapper = memo(
	({
		index,
		color,
		rank,
		closeness,
		setColor,
		setCloseness,
		removeColor,
	}: PaletteItemWrapperProps) => {
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
				<EditPaletteItem
					initialColor={color}
					submitColor={handleSetColor}
					cancel={cancelEdit}
				/>
			);
		}
		return (
			<PaletteItem
				color={color}
				rank={rank}
				closeness={closeness}
				setCloseness={handleSetCloseness}
				setIsEditing={setIsEditing}
				deleteSelf={deleteSelf}
			/>
		);
	}
);

type NewPaletteItemProps = {
	addColor: (color: cssColor) => void;
};

function NewPaletteItem({ addColor }: NewPaletteItemProps) {
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
			<EditPaletteItem
				initialColor={savedInitialColor}
				submitColor={handleAddColor}
				cancel={cancelEdit}
			/>
		);
	} else {
		return (
			<div className="palette-item new">
				<button onClick={startEdit}>
					<span className="icon">add</span> Add Color
				</button>
			</div>
		);
	}
}

export { PaletteItemWrapper as PaletteItem, PaletteItemHeader, NewPaletteItem };
export default PaletteItemWrapper;
