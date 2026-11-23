import {
	type PaletteIds,
	type Id,
	type EntryId,
	initialPaletteIds,
} from "./paletteIds";
import { type Colors, initialColors } from "./colors";
import { type Closeness, type Ranks, initialRanks, rank } from "./ranks";
import { filterObject } from "@/other/filterObject";

type Palettes = PaletteIds & Colors & Ranks;

const initialPalettesState: Palettes = {
	...initialPaletteIds,
	...initialColors,
	...initialRanks,
};

function rankPalette(
	id: Id,
	paletteIds: { [key: Id]: EntryId[] },
	closenesses: { [key: EntryId]: Closeness }
) {
	const entriesInPalette = filterObject(closenesses, ([entryId]) =>
		paletteIds[id].includes(entryId as EntryId)
	);
	return rank(entriesInPalette);
}

export type { Palettes };
export { initialPalettesState, rankPalette };
