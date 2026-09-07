import type { Colors } from "./palette.ts";
import "./PalettePreview.css";

type PalettePreviewProps = {
	colors6: Colors;
	length: number;
};

function PalettePreview({ colors6, length }: PalettePreviewProps) {
	if (colors6.length > 6) {
		throw new Error("colors6 must be at most 6 colors");
	}
	return (
		<div className="preview">
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
