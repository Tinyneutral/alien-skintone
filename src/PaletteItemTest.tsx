// import { useState } from "react";
import "./PaletteItemTest.css";
import PaletteItem from "./PaletteItem.jsx";
import Color from "colorjs.io";
import { rankPaletteByColor } from "./closest.ts";

function generateOrderedPalette(length: number, target: Color) {
	const palette = [];
	for (let i = 0; i < length; i++) {
		palette.push(
			new Color("srgb", [Math.random(), Math.random(), Math.random()])
		);
	}
	const ranks = rankPaletteByColor(palette, target, "lch", [1, 0, 0]);
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
const target = new Color("#cccccc");

function PaletteItemTest() {
	const palette = generateOrderedPalette(length, target);
	return (
		<div>
			<div className="grid">
				{Array.from({ length: length }).map((_, index) => {
					const rank = ranks[index];
					const color = palette[rank - 1];
					const featureColor = palette[rank - 1].set("lch.c", 0);
					return (
						<PaletteItem
							key={index}
							color={color}
							featureColor={featureColor}
							pickedFeatureColor={target}
							rank={rank}
						/>
					);
				})}
			</div>
		</div>
	);
}

export default PaletteItemTest;
