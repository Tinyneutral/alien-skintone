import type { Colors } from "./palette.ts";
import "./PalettePreview.css";

type PalettePreviewProps = {
	colors6: Colors;
	length: number;
	isActive: boolean;
};

function PalettePreview({ colors6, length, isActive }: PalettePreviewProps) {
	if (colors6.length > 6) {
		throw new Error("colors6 must be at most 6 colors");
	}
	return (
		<div className={`palette-preview${isActive ? " active" : ""}`}>
			<div className="color-grid">
				{colors6.map((color, index) => (
					<div
						key={index}
						className="color"
						style={{ backgroundColor: color }}
					/>
				))}
			</div>
			<p className="color-count">{length}</p>
		</div>
	);
}

export default PalettePreview;
