import "./Preview.css";

type PreviewProps = {
	colors6: cssColor[];
};

function Preview({ colors6 }: PreviewProps) {
	if (colors6.length > 6) {
		throw new Error("colors6 must be at most 6 colors");
	}
	return (
		<div className="palette-preview">
			{colors6.map((color, index) => (
				<div key={index} className="color" style={{ backgroundColor: color }} />
			))}
		</div>
	);
}

export default Preview;
