import Color from "colorjs.io";
import { extractPalette } from "./palette-import.js";
import { pickColorFromCanvas, cropOutBg } from "./eyedropper.js";
import { rankPaletteByColor } from "./closest.js";
import {
	DEFAULT_PRESETS,
	getAdvancedSpace,
	getCoordStrengths,
	getSpaces,
	setAdvancedSpace,
	setCoordEnabled,
	setCoordStrength,
	setMode,
} from "./feature-select.js";

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

const compareConfig = document.querySelector(".compare-config");
const compareModeSelect = document.querySelector("select.mode");
const defaultPanel = document.querySelector(".compare-config .default");
const advancedPanel = document.querySelector(".compare-config .advanced");
const presetSelect = document.querySelector(".compare-config .default select");
const presetDescription = document.querySelector(".compare-config .default.hint");
const spaceSelect = document.querySelector(".compare-config .advanced select.space");
const coordRows = [
	document.querySelector("#coord-1"),
	document.querySelector("#coord-2"),
	document.querySelector("#coord-3"),
];

/** @type {{ r: number, g: number, b: number } | null} */
let currentPickedColor = null;

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
 * Parse a CSS color string (#hex or rgb/rgba) into { r, g, b }.
 *
 * @param {string} css
 * @returns {{ r: number, g: number, b: number }}
 */
function cssColorToRgb(css) {
	const hex = css.match(/^#([0-9a-fA-F]{6})$/);
	if (hex) {
		return {
			r: parseInt(hex[1].slice(0, 2), 16),
			g: parseInt(hex[1].slice(2, 4), 16),
			b: parseInt(hex[1].slice(4, 6), 16),
		};
	}

	const rgb = css.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
	if (rgb) {
		return {
			r: Number(rgb[1]),
			g: Number(rgb[2]),
			b: Number(rgb[3]),
		};
	}

	throw new Error(`Invalid CSS color string: ${css}`);
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
		rank.textContent = "—";

		const button = document.createElement("button");
		button.className = "swatch";
		button.type = "button";
		button.style.backgroundColor = rgbToCss(color);

		item.append(rank, button);
		paletteGrid.append(item);
	}
}


function updatePaletteRanks() {
	const items = Array.from(paletteGrid.querySelectorAll(".item"));
	if (items.length === 0 || !currentPickedColor) {
		return;
	}

	const palette = items.map((item) => {
		const swatch = item.querySelector(".swatch");
		return cssColorToRgb(swatch.style.backgroundColor);
	});
	const ranks = rankPaletteByColor(
		palette,
		currentPickedColor,
		getAdvancedSpace(),
		getCoordStrengths()
	);

	for (const [i, item] of items.entries()) {
		const rankEl = item.querySelector(".rank");
		rankEl.textContent = `${ranks[i]}`;
	}
}

function syncModePanels() {
	const mode = compareModeSelect.value;
	defaultPanel.hidden = mode !== "default";
	advancedPanel.hidden = mode !== "advanced";
}

function populatePresetSelect() {
	presetSelect.replaceChildren();
	const sections = [...new Set(DEFAULT_PRESETS.map((p) => p.section))];

	for (const section of sections) {
		const group = document.createElement("optgroup");
		group.label = section;

		for (const preset of DEFAULT_PRESETS.filter(
			(entry) => entry.section === section
		)) {
			const option = document.createElement("option");
			option.value = preset.id;
			option.textContent = `${preset.name} [${preset.id}]`;
			group.append(option);
		}

		presetSelect.append(group);
	}
}

function populateSpaceSelect() {
	spaceSelect.replaceChildren();
	for (const spaceId of getSpaces()) {
		const option = document.createElement("option");
		option.value = spaceId;
		option.textContent = spaceId;
		spaceSelect.append(option);
	}
}

function applyFirstPreset() {
	const space = "srgb";
	spaceSelect.value = space;
	setAdvancedSpace(space);
	syncCoordRows();

	const first = DEFAULT_PRESETS[0];
	presetSelect.value = first.id;
	presetDescription.textContent = first.description;
	setPreset(first.id);
}

/**
 * @param {string} spaceId
 * @returns {string[]}
 */
function getCoordIds(spaceId) {
	const space = Color.spaces[spaceId];
	if (!space?.coords) {
		return [];
	}
	return Object.keys(space.coords);
}

function syncCoordRows() {
	const spaceId = getAdvancedSpace();
	const coords = getCoordIds(spaceId);
	const strengths = getCoordStrengths();

	for (const [index, row] of coordRows.entries()) {
		const slider = row.querySelector('input[type="range"]');
		const disable = row.querySelector('input[type="checkbox"]');
		const exists = index < coords.length;

		row.hidden = !exists;
		if (!exists) {
			continue;
		}

		const strength = strengths[index] ?? 0;
		slider.value = String(strength);
		slider.disabled = strength === 0;
		disable.checked = strength === 0;
		row.dataset.coord = coords[index];
	}
}

function initCompareUi() {
	populatePresetSelect();
	populateSpaceSelect();
	applyFirstDefaultPreset();
	syncCoordRows();
	syncModePanels();
}

compareModeSelect.addEventListener("change", () => {
	setMode((compareModeSelect.value));
	syncModePanels();
	updatePaletteRanks();
});

presetSelect.addEventListener("change", () => {
	applyPreset(presetSelect.value);
	updatePaletteRanks();
});

spaceSelect.addEventListener("change", () => {
	setAdvancedSpace(spaceSelect.value);
	syncCoordRows();
	updatePaletteRanks();
});

for (const [index, row] of coordRows.entries()) {
	const slider = row.querySelector('input[type="range"]');
	const disable = row.querySelector('input[type="checkbox"]');

	slider.addEventListener("input", () => {
		setCoordStrength(index, Number(slider.value));
		updatePaletteRanks();
	});

	disable.addEventListener("change", () => {
		setCoordStrength(index, slider.value * !disable.checked);
		slider.disabled = disable.checked;
		updatePaletteRanks();
	});
}

paletteFileInput.addEventListener("change", async () => {
	const file = paletteFileInput.files?.[0];
	if (!file) {
		return;
	}

	try {
		const palette = await extractPalette(file);
		renderPaletteGrid(palette);
		updatePaletteRanks();
	} catch {
		paletteGrid.replaceChildren();
	}
});

eyedropperFileInput.addEventListener("change", async () => {
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
		currentPickedColor = color;
		renderPickedColor(color);
		updatePaletteRanks();
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

initCompareUi();
