import Color from "colorjs.io";
import { useMemo } from "react";
import "./PaletteItem.css";

type PaletteItemProps = {
	color: Color;
	featureColor: Color;
	pickedFeatureColor: Color;
	rank: number | "-";
};

function PaletteItem({ color, featureColor, pickedFeatureColor, rank }: PaletteItemProps) {
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

	return (
		<div className="palette-item">
			<div className="feature-color" style={{ backgroundColor: featureColor.toString() }}>
				<div
					className="picked-color-overlay"
					style={{ backgroundColor: pickedFeatureColor.toString() }}></div>
			</div>
			<div className="color" style={{ backgroundColor: color.toString() }}></div>
			<p className={`rank ${rankClass}`}>{rank}</p>
			<button className={`copy-button ${rankClass}`}>Copy</button>
		</div>
	);
}

export default PaletteItem;
