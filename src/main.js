import { extractPalette } from "./palette-import.js";
import { pickColorFromCanvas, cropOutBg } from "./eyedropper.js";

const paletteGrid = document.querySelector(".palette .grid");
const paletteFileInput = document.querySelector('.palette input[type="file"]');

const eyedropperFileInput = document.querySelector(
	".eyedropper input[type='file']"
);
const eyedropperTarget = document.querySelector(".eyedropper .range img");
const eyedropperMagnifier = document.querySelector(".eyedropper .magnifier");
const pickedColor = document.querySelector(".eyedropper .picked-color");
const pickedSwatch = document.querySelector(
	".eyedropper .picked-color .swatch"
);
const pickedHex = document.querySelector(".eyedropper .picked-color .hex");

/**
 * @param {{ r: number, g: number, b: number }} color
 * @returns {string}
 */
function rgbToCss(color) {
	return `rgb(${color.r}, ${color.g}, ${color.b})`;
}

/**
 * @param {{ r: number, g: number, b: number }} color
 * @returns {string}
 */
function rgbToHex(color) {
	return `#${[color.r, color.g, color.b]
		.map((channel) => channel.toString(16).padStart(2, "0"))
		.join("")}`;
}

/**
 * @param {number} val
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function clamp(val, min, max) {
	return Math.min(Math.max(val, min), max);
}

/**
 * @param {Array<{ r: number, g: number, b: number }>} palette
 */
function renderPaletteGrid(palette) {
	paletteGrid.replaceChildren();

	for (const color of palette) {
		const item = document.createElement("div");
		item.className = "item";

		const rank = document.createElement("p");
		rank.className = "rank";
		rank.textContent = "#1";

		const button = document.createElement("button");
		button.type = "button";
		button.style.backgroundColor = rgbToCss(color);

		item.append(rank, button);
		paletteGrid.append(item);
	}
}

paletteFileInput.addEventListener("change", async () => {
	const file = paletteFileInput.files?.[0];
	if (!file) {
		return;
	}

	try {
		const palette = await extractPalette(file);
		renderPaletteGrid(palette);
	} catch {
		paletteGrid.replaceChildren();
	}
});

eyedropperFileInput.addEventListener("change", async (event) => {
	const file = eyedropperFileInput.files?.[0];
	if (!file) {
		return;
	}

	eyedropperTarget.hidden = true;

	const prevUrl = eyedropperTarget.src;
	if (prevUrl) {
		URL.revokeObjectURL(prevUrl);
	}
	const url = URL.createObjectURL(file);
	eyedropperTarget.src = url;

	eyedropperTarget.hidden = false;
});

/**
 * @param {{ r: number, g: number, b: number }} color
 */
function renderPickedColor(color) {
	pickedSwatch.style.backgroundColor = rgbToCss(color);
	pickedHex.textContent = rgbToHex(color);
	pickedColor.hidden = false;
}

const MAGNIFIER_ZOOM = 6;

/**
 * Magnify the preview around the cursor inside the scope
 * @param {PointerEvent} event
 */
function updateMagnifier(event) {
	const baseRect = eyedropperTarget.getBoundingClientRect();
	const scaleX = eyedropperTarget.naturalWidth / baseRect.width;
	const scaleY = eyedropperTarget.naturalHeight / baseRect.height;

	const x = clamp(
		Math.floor(event.clientX - baseRect.left),
		0,
		baseRect.width
	);
	const y = clamp(
		Math.floor(event.clientY - baseRect.top),
		0,
		baseRect.height
	);

	eyedropperMagnifier.style.backgroundImage = `url("${eyedropperTarget.src}")`;
	eyedropperMagnifier.style.backgroundSize = `
	${baseRect.width * MAGNIFIER_ZOOM}px
	${baseRect.height * MAGNIFIER_ZOOM}px
	`;
	const pixelCenterOffset = MAGNIFIER_ZOOM / 2;
	const magnifierCenterX = eyedropperMagnifier.clientWidth / 2;
	const magnifierCenterY = eyedropperMagnifier.clientHeight / 2;
	eyedropperMagnifier.style.backgroundPosition = `
	${-(x * MAGNIFIER_ZOOM + pixelCenterOffset - magnifierCenterX)}px 
	${-(y * MAGNIFIER_ZOOM + pixelCenterOffset - magnifierCenterY)}px
	`;
}

/**
 * Returns whether eyedropperMagnifier covers the eyedropperTarget, when the cursor is near.
 * @param {PointerEvent} event
 * @returns {boolean}
 */
function magnifierIsInTheWay(event) {
	const HITBOX_MARGIN = 4;

	const parentRect =
		eyedropperMagnifier.parentElement.getBoundingClientRect();
	const magnifierRect = eyedropperMagnifier.getBoundingClientRect();

	const inset = magnifierRect.top - parentRect.top;
	const rightMagnifierRect = {
		left: parentRect.right - inset - magnifierRect.width,
		right: parentRect.right - inset,
		top: magnifierRect.top,
		bottom: magnifierRect.bottom,
	};

	return (
		event.clientX > rightMagnifierRect.left - HITBOX_MARGIN &&
		event.clientX < rightMagnifierRect.right + HITBOX_MARGIN &&
		event.clientY > rightMagnifierRect.top - HITBOX_MARGIN &&
		event.clientY < rightMagnifierRect.bottom + HITBOX_MARGIN
	);
}

eyedropperTarget.addEventListener("pointerdown", (event) => {
	event.preventDefault();
	eyedropperTarget.setPointerCapture(event.pointerId);
	eyedropperMagnifier.hidden = false;

	updateMagnifier(event);
	if (magnifierIsInTheWay(event)) {
		eyedropperMagnifier.classList.add("left");
	} else {
		eyedropperMagnifier.classList.remove("left");
	}
});

eyedropperTarget.addEventListener("pointermove", (event) => {
	updateMagnifier(event);
	if (magnifierIsInTheWay(event)) {
		eyedropperMagnifier.classList.add("left");
	} else {
		eyedropperMagnifier.classList.remove("left");
	}
});

eyedropperTarget.addEventListener("pointerup", async (event) => {
	eyedropperTarget.releasePointerCapture(event.pointerId);

	try {
		const crop = await cropOutBg(eyedropperMagnifier);
		const color = pickColorFromCanvas(
			crop,
			Math.floor(crop.width / 2),
			Math.floor(crop.height / 2)
		);
		renderPickedColor(color);
	} catch {
		// Skip color pick if background crop fails
	}

	eyedropperMagnifier.hidden = true;
});

eyedropperTarget.addEventListener("pointercancel", (event) => {
	eyedropperTarget.releasePointerCapture(event.pointerId);
	eyedropperMagnifier.hidden = true;
});

eyedropperTarget.addEventListener("contextmenu", (event) => {
	event.preventDefault();
});
