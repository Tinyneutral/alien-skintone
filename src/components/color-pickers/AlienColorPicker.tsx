import alienMaskUrl from "@/assets/alien-mask.svg";
import { useAppSelector } from "@/app/hooks";
import { useAppDispatch } from "@/app/hooks";
import { pickTargetColor as pickPaletteTargetColor } from "@/features/palettes/targetColor";
import { pickTargetColor } from "@/features/targetColor";
import "./AlienColorPicker.css";

function AlienColorPicker() {
	const dispatch = useAppDispatch();
	const targetColor = useAppSelector((state) => state.targetColor);
	return (
		<div className="alien">
			<input
				type="color"
				value={targetColor}
				onChange={(e) => {
					dispatch(pickPaletteTargetColor(e.target.value));
					dispatch(pickTargetColor(e.target.value));
				}}
			/>
			<div className="preview">
				<img
					src={alienMaskUrl}
					alt="Alien Color Picker"
					style={{ backgroundColor: targetColor }}
				/>
				<span>Alien</span>
			</div>
		</div>
	);
}

export default AlienColorPicker;
