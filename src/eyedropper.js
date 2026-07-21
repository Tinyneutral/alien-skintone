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

/**
 * @param {HTMLCanvasElement} canvas
 * @param {number} x
 * @param {number} y
 * @returns {{ r: number, g: number, b: number }}
 */
export function pickColorFromCanvas(canvas, x, y) {
	const ctx = canvas.getContext("2d");
	const [r, g, b] = ctx.getImageData(x, y, 1, 1).data;
	return { r, g, b };
}

/**
 * Parse a computed px pair like "12.5px 34px". One token applies to both axes.
 * @param {string} value
 * @returns {{ x: number, y: number }}
 */
export function parsePxPair(value) {
	const parts = value.trim().split(/\s+/);
	const x = parseFloat(parts[0]);
	const y = parseFloat(parts[1] ?? parts[0]);
	return { x, y };
}

/**
 * @param {string} url
 * @returns {Promise<HTMLImageElement>}
 */
function loadImage(url) {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => resolve(img);
		img.onerror = () =>
			reject(new Error("Failed to load background image"));
		img.src = url;
	});
}

/**
 * Crop the visible portion of an element's background-image onto a canvas.
 * Expects background-size and background-position as px pairs (as set by JS).
 * @param {HTMLElement} el
 * @returns {Promise<HTMLCanvasElement>}
 */
export async function cropOutBg(el) {
	const style = getComputedStyle(el);
	const match = style.backgroundImage.match(/url\(["']?(.*?)["']?\)/);
	if (!match) {
		throw new Error("No background-image url");
	}
	const img = await loadImage(match[1]);

	const nw = img.naturalWidth;
	const nh = img.naturalHeight;

	const { x: boxW, y: boxH } = { x: el.clientWidth, y: el.clientHeight };
	const { x: posX, y: posY } = parsePxPair(style.backgroundPosition);
	const { x: sizeW, y: sizeH } = parsePxPair(style.backgroundSize);

	const visibleLeft = Math.max(0, -posX);
	const visibleTop = Math.max(0, -posY);
	const visibleRight = Math.min(sizeW, boxW - posX);
	const visibleBottom = Math.min(sizeH, boxH - posY);

	const cropW = visibleRight - visibleLeft;
	const cropH = visibleBottom - visibleTop;
	if (cropW <= 0 || cropH <= 0) {
		throw new Error("No visible background area");
	}

	const sx = (visibleLeft / sizeW) * nw;
	const sy = (visibleTop / sizeH) * nh;
	const sw = (cropW / sizeW) * nw;
	const sh = (cropH / sizeH) * nh;

	const canvas = document.createElement("canvas");
	const ctx = canvas.getContext("2d");
	canvas.width = Math.max(1, Math.floor(cropW));
	canvas.height = Math.max(1, Math.floor(cropH));
	ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
	return canvas;
}
