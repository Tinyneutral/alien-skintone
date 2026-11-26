import { useState } from "react";
import alienMaskUrl from "@/assets/alien-mask.svg";
import "./HumanColorPicker.css";

function HumanColorPicker({ colors10 }: { colors10: cssColor[] }) {
	const [selectedColorId, setSelectedColorId] = useState<number>(0);
	const selectedColor = colors10[selectedColorId];
	return (
		<div className="human">
			<div className="preview">
				<img
					src={alienMaskUrl}
					alt="Human Color Picker"
					style={{ backgroundColor: selectedColor }}
				/>
				<span>Human</span>
			</div>
			<div className="grid">
				{colors10.map((color, index) => (
					<div
						className={`item${selectedColorId === index ? " selected" : ""}`}
						key={index}
						onClick={() => setSelectedColorId(index)}>
						<span>{index + 1}</span>
						<div className="color" style={{ backgroundColor: color }} />
					</div>
				))}
			</div>
		</div>
	);
}

export default HumanColorPicker;
