import { type EntryId } from "./paletteIds";

type Colors = {
	colors: { [key: EntryId]: cssColor };
};

const initialColors: Colors = {
	colors: {},
};

export type { Colors };
export { initialColors };
