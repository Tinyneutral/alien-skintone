import { extractPalette } from "./color-grid-import.js";

const paletteGrid = document.querySelector(".palette .grid");
const paletteFileInput = document.querySelector('.palette input[type="file"]');

/**
 * @param {{ r: number, g: number, b: number }} color
 * @returns {string}
 */
function rgbToCss(color) {
    return `rgb(${color.r}, ${color.g}, ${color.b})`;
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

paletteFileInput?.addEventListener("change", async () => {
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
