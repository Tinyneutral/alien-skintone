import { expect, test } from "vitest";
import { extractPalette } from "../palette-import.js";

// TODO: add jpeg/bmp/webpq support
const images = import.meta.glob("./palette-import/*.png", {
	query: "?url",
	import: "default",
	eager: true,
});

/**
 * @param {string} path
 * @returns {Promise<File>}
 */
async function loadFile(path) {
	const url = images[path];
	if (!url) {
		throw new Error(`Image not found: ${path}`);
	}

	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`Failed to load image: ${path}`);
	}

	const buffer = await response.arrayBuffer();
	const name = path.split("/").at(-1).split(".").at(0) ?? path;
	return new File([buffer], name, { type: "image/png" });
}

test.for([
	{
		name: "3 colors (small)",
		path: "./palette-import/3.png",
		expected: [
			{ 	r: 255,	g: 0,	b: 0 	},
			{ 	r: 0,	g: 255,	b: 0 	},
			{ 	r: 0,	g: 0,	b: 255 	},
		],
	},
	{
		name: "21 colors",
		path: "./palette-import/21.png",
		expected: [
			{ 	r: 6,	g: 4, 	b: 4 	},
			{	r: 26,	g: 26,	b: 23	},
			{	r: 54,	g: 52,	b: 48	},
			{	r: 143,	g: 138,	b: 109	},
			{	r: 188,	g: 188,	b: 157	},
			{	r: 134,	g: 93,	b: 56	},
			{	r: 73,	g: 47,	b: 33	},
			{	r: 40,	g: 24,	b: 19	},
			{	r: 99,	g: 33,	b: 18	},
			{	r: 133,	g: 52,	b: 25	},
			{	r: 198,	g: 117,	b: 39	},
			{	r: 124,	g: 30,	b: 20	},
			{	r: 79,	g: 16,	b: 15	},
			{	r: 34,	g: 63,	b: 45	},
			{	r: 28,	g: 33,	b: 12	},
			{	r: 48,	g: 53,	b: 23	},
			{	r: 119,	g: 106,	b: 44	},
			{	r: 24,	g: 16,	b: 36	},
			{	r: 46,	g: 28,	b: 59	},
			{	r: 160,	g: 80,	b: 62	},
			{	r: 172,	g: 63,	b: 56	},
		],
	}
])("extracts palette colors: $name", async ({ path, expected }) => {
	const imageFile = await loadFile(path);
	const palette = await extractPalette(imageFile);
	expect(palette).toEqual(expected);
});

test.for([
	{
		name: "3 colors (small)",
		path: "./palette-import/3-outlined.png",
		expected: [
			{ 	r: 255, g: 0, 	b: 0 	},
			{ 	r: 0, 	g: 255, b: 0 	},
			{ 	r: 0, 	g: 0, 	b: 255 	},
		],
	},
	{
		name: "21 colors (outline uses a palette color)",
		path: "./palette-import/21-outlined.png",
		expected: [
			{ 	r: 6,	g: 4, 	b: 4 	},
			{	r: 26,	g: 26,	b: 23	},
			{	r: 54,	g: 52,	b: 48	},
			{	r: 143,	g: 138,	b: 109	},
			{	r: 188,	g: 188,	b: 157	},
			{	r: 134,	g: 93,	b: 56	},
			{	r: 73,	g: 47,	b: 33	},
			{	r: 40,	g: 24,	b: 19	},
			{	r: 99,	g: 33,	b: 18	},
			{	r: 133,	g: 52,	b: 25	},
			{	r: 198,	g: 117,	b: 39	},
			{	r: 124,	g: 30,	b: 20	},
			{	r: 79,	g: 16,	b: 15	},
			{	r: 34,	g: 63,	b: 45	},
			{	r: 28,	g: 33,	b: 12	},
			{	r: 48,	g: 53,	b: 23	},
			{	r: 119,	g: 106,	b: 44	},
			{	r: 24,	g: 16,	b: 36	},
			{	r: 46,	g: 28,	b: 59	},
			{	r: 160,	g: 80,	b: 62	},
			{	r: 172,	g: 63,	b: 56	},
		],
	}
])("excludes outline colors: $name", async ({ path, expected }) => {
	const imageFile = await loadFile(path);
	const palette = await extractPalette(imageFile);
	expect(palette).toEqual(expected);
});
