import "./PalettePreview.css";

type PalettePreviewProps = {
	colors6: cssColor[];
	isActive: boolean;
};

function PalettePreview({ colors6, isActive }: PalettePreviewProps) {
	if (colors6.length > 6) {
		throw new Error("colors6 must be at most 6 colors");
	}
	return (
		<div className={`palette-preview${isActive ? " active" : ""}`}>
			{colors6.map((color, index) => (
				<div key={index} className="color" style={{ backgroundColor: color }} />
			))}
		</div>
	);
}

export default PalettePreview;
