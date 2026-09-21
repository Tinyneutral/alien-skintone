// import { useState } from "react";
import Color from "colorjs.io";
import PaletteItem from "/PaletteItem.js";
import { toWeighted } from "/closeness.js";
import "/PaletteItemTest.css";

function randomColor(): cssColor {
	const byte = () =>
		Math.floor(Math.random() * 256)
			.toString(16)
			.padStart(2, "0");
	return `#${byte()}${byte()}${byte()}`;
}

function generateOrderedPalette(length: number, target: string) {
	const palette = Array.from({ length }, randomColor);
	const ranks = rankPaletteByColor(palette, target);
	const sortedPalette = [];
	for (let i = 0; i < length; i++) {
		sortedPalette.push(palette[ranks[i] - 1]);
	}
	return sortedPalette;
}

const length = 33;
const step = 7;
const ranks: number[] = [];
for (let i = 1; i <= step; i++) {
	for (let elem = i; elem <= length; elem += step) {
		ranks.push(elem);
	}
}
const target = "#cccccc";

function PaletteItemTest() {
	const palette = generateOrderedPalette(length, target);
	return (
		<div>
			<div className="grid">
				{Array.from({ length: length }).map((_, index) => {
					const rank = ranks[index];
					const color = palette[rank - 1];
					const featureColor = toWeighted(color, Color.spaces.lch, [1, 0, 1]);
					return (
						<PaletteItem
							key={index}
							base={color}
							feature={featureColor}
							pickedFeature={target}
							rank={rank}
						/>
					);
				})}
			</div>
		</div>
	);
}

export default PaletteItemTest;
