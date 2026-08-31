/**
 * @typedef {{ r: number, g: number, b: number }} PaletteColor
 */

const MIN_PIXEL_RATIO = 0.33;

/**
 * @param {number} r
 * @param {number} g
 * @param {number} b
 * @returns {string}
 */
function rgbKey(r: number, g: number, b: number) {
	return `${r},${g},${b}`;
}

/**
 * @param {string} key
 * @returns {PaletteColor}
 */
function keyToRgb(key: string) {
	const [r, g, b] = key.split(",").map(Number);
	return { r, g, b };
}

/**
 * @param {File} file
 * @returns {Promise<{ r: number[], g: number[], b: number[], a: number[] }>}
 */
async function imageFileToRgba(file: File) {
	if (!(file instanceof File)) {
		throw new TypeError("Expected a File object");
	}
	const bitmap = await createImageBitmap(file);

	try {
		const c = document.createElement("canvas");
		const ctx = c.getContext("2d")!;
		const w = bitmap.width;
		const h = bitmap.height;

		c.width = w;
		c.height = h;
		ctx.drawImage(bitmap, 0, 0, w, h);
		const { data } = ctx.getImageData(0, 0, w, h);

		const r = data.filter((_, i) => i % 4 === 0);
		const g = data.filter((_, i) => i % 4 === 1);
		const b = data.filter((_, i) => i % 4 === 2);
		const a = data.filter((_, i) => i % 4 === 3);
		return { r, g, b, a };
	} finally {
		bitmap.close();
	}
}

/**
 * @param {File} imageFile
 * @returns {Promise<Map<string, number>>}
 */
async function countPixelColors(imageFile: File) {
	/** @type {Map<string, number>} */
	const counts = new Map();

	const { r, g, b, a } = await imageFileToRgba(imageFile);
	const pixels = r.length;
	for (let i = 0; i < pixels; i++) {
		if (a[i] === 0) {
			continue;
		}

		const key = rgbKey(r[i], g[i], b[i]);
		counts.set(key, (counts.get(key) ?? 0) + 1);
	}

	return counts;
}

/**
 * @param {Map<string, number>} counts
 * @param {number} rate
 * @returns {Map<string, number>}
 */
function filterByRatio(counts: Map<string, number>, rate: number) {
	if (counts.size === 0) {
		return new Map();
	}

	/* 
		When the border color is the same as the palette color, 
		the top count will greatly exceed the normal palette color count, so the filter overshoots.
		Thus, (if there's more than one color) the second max count is used to determine the threshold.
	*/
	const top2 = [...counts.values()].reduce(
		(top2, count) => {
			if (count > top2[0]) {
				top2[1] = top2[0];
				top2[0] = count;
			} else if (count > top2[1]) {
				top2[1] = count;
			}
			return top2;
		},
		{ 0: 0, 1: 0 }
	);
	const normalPaletteColorCount = top2[1] === 0 ? top2[0] : top2[1];
	const threshold = Math.floor(normalPaletteColorCount * rate);

	for (const [key, count] of counts.entries()) {
		if (count < threshold) {
			counts.delete(key);
		}
	}
	return counts;
}

/**
 * @param {File} imageFile
 * @returns {Promise<PaletteColor[]>}
 */
export async function extractPalette(imageFile: File) {
	const uniqueColorCounts = await countPixelColors(imageFile);
	const filteredColorCounts = filterByRatio(uniqueColorCounts, MIN_PIXEL_RATIO);
	return Array.from(filteredColorCounts.keys()).map(keyToRgb);
}
