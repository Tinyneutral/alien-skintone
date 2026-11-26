import Color from "colorjs.io";
import ColorSpace from "colorjs.io/spaces";
import { type EntryId } from "./paletteIds";

type Closeness = number;
type Rank = number;
type Space = ColorSpace;
type Weight = number;
type Filter = {
	space: Space;
	weights: Weight[];
};

type Ranks = {
	ranks: { [key: EntryId]: Rank };
	closenesses: { [key: EntryId]: Closeness };
	target: cssColor;
	filter: Filter;
};

const initialRanks: Ranks = {
	ranks: {},
	closenesses: {},
	target: "#949494",
	filter: {
		space: Color.spaces.oklab,
		weights: [1, 0, 0],
	},
};

/**
 * Applies a coord multiplier (weight) to a color.
 * @param {cssColor} color
 * @param {Filter} filter
 * @returns {cssColor}
 */
function filter(color: cssColor, { space, weights }: Filter): cssColor {
	const weightedColor = new Color(color).to(space);
	weightedColor.coords.forEach((value: number | null, index: number) => {
		if (value === null) return;
		const strength = weights[index] ?? 0;
		weightedColor.coords[index] = value * strength;
	});
	return weightedColor.display();
}

/**
 * @param {cssColor} sColor1
 * @param {cssColor} sColor2
 * @returns {Closeness} deltaE
 */
function distance(sColor1: cssColor, sColor2: cssColor): Closeness {
	const color1 = new Color(sColor1);
	const color2 = new Color(sColor2);
	return color1.deltaEOK(color2);
}

function closeness(source: cssColor, target: cssColor, f: Filter): Closeness {
	const feature = filter(source, f);
	return distance(feature, target);
}

/**
 * Get ranks, closest first. Duplicates are marked as the same rank.
 * @param closenesses { [key: EntryId]: closeness }
 * @returns { [key: EntryId]: rank }
 */
function rank(closenesses: { [key: EntryId]: Closeness }): {
	[key: EntryId]: Rank;
} {
	const rankMap = Object.entries(closenesses)
		.map(([entryId, closeness]) => ({ entryId, closeness }))
		.sort((a, b) => a.closeness - b.closeness)
		.map((entry, index) => ({ ...entry, rank: index + 1 }));
	const rankMapWithTies = rankMap;
	for (let i = 1; i < rankMap.length; i++) {
		const current = rankMapWithTies[i];
		const prev = rankMapWithTies[i - 1];
		if (current.closeness === prev.closeness) {
			current.rank = prev.rank;
		}
	}
	return Object.fromEntries(
		rankMapWithTies.map((entry) => [entry.entryId, entry.rank])
	);
}

export type { Closeness, Rank, Ranks, Space, Weight };
export { initialRanks, closeness, filter, rank };
