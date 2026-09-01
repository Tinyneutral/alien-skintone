import Color from "colorjs.io";
import { useMemo } from "react";
import "./PaletteItem.css";

type PaletteItemProps = {
	base: Color;
	feature: Color;
	pickedFeature: Color;
	rank: number | "-";
};

function PaletteItem({ base, feature, pickedFeature, rank }: PaletteItemProps) {
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

	const bg = (color: Color): React.CSSProperties => {
		return { backgroundColor: color.toString() };
	};
	return (
		<div className="palette-item">
			<div className="feature-color" style={bg(feature)}>
				<div className="picked-color-overlay" style={bg(pickedFeature)}></div>
			</div>
			<div className="color" style={bg(base)}></div>
			<p className={`rank ${rankClass}`}>{rank}</p>
			<button className={`copy-button ${rankClass}`}>Copy</button>
		</div>
	);
}

export default PaletteItem;
