import Color from "colorjs.io";
import { useEffect, useMemo, memo } from "react";
import { useAppSelector } from "./app/hooks.ts";
import { toWeighted, deltaE } from "./closest.ts";
import "./PaletteItem.css";

type PaletteItemProps = {
	color: string;
	rank: number | "-";
	closeness: number;
	setCloseness: (closeness: number, index: number) => void;
	closenessIndex: number;
};

const PaletteItem = memo(
	({
		color,
		rank,
		closeness,
		setCloseness,
		closenessIndex,
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
				setCloseness(newCloseness, closenessIndex);
			}
			// setCloseness is recreated each parent render; color/newCloseness are the intended triggers.
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [color, newCloseness, closeness]);

		const rankClass = useMemo(() => {
			if (typeof rank !== "number") {
				return "rank-none";
			} else if (rank <= 3) {
				return "rank-great";
			} else if (rank <= 10) {
				return "rank-good";
			} else {
				return "rank-meh";
			}
		}, [rank]);

		const bg = (color: string): React.CSSProperties => {
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
				<div className={`meta ${rankClass}`}>
					<p className="rank">{rank}</p>
					<button className="edit-button">Edit</button>
					<button className="copy-button">Copy</button>
				</div>
			</div>
		);
	}
);

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

export { PaletteItem, PaletteItemHeader };
export default PaletteItem;
