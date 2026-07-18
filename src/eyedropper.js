/**
 * @param {HTMLImageElement} img
 * @param {number} x
 * @param {number} y
 * @returns {{ r: number, g: number, b: number }}
 */
export function pickColorFromImage(img, x, y) {
	const c = document.createElement("canvas");
	const ctx = c.getContext("2d");

	c.width = img.naturalWidth;
	c.height = img.naturalHeight;
	ctx.drawImage(img, 0, 0);

	const [r, g, b] = ctx.getImageData(x, y, 1, 1).data;
	return { r, g, b };
}
