import { useContext } from "react";
import { useAppSelector } from "@/app/hooks";
import { selectPaletteEntries } from "@/features/palettes/palette";
import { ActivePaletteIdContext } from "@/components/activePaletteIdContext.tsx";

import AlienColorPicker from "./AlienColorPicker.tsx";
import HumanColorPicker from "./HumanColorPicker.tsx";
import "./ColorPickers.css";

function ColorPickers() {
	const { activeId } = useContext(ActivePaletteIdContext);
	const paletteEntries = useAppSelector(selectPaletteEntries)[activeId];
	const top10Colors = paletteEntries
		.slice() // deleting this will cause mutation of paletteEntries
		.filter((color) => color.rank <= 10)
		.sort((a, b) => a.rank - b.rank)
		.map((color) => color.color);
	console.log(top10Colors);

	return (
		<section className="color-pickers">
			<h2>Color Pickers</h2>
			<div className="pair">
				<AlienColorPicker />
				<HumanColorPicker colors10={top10Colors} />
			</div>
		</section>
		
	);
}

export default ColorPickers;
