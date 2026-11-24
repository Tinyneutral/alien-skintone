/**
 * Create a factory function for generating unique IDs.
 * @returns {() => Id} A function that generates a unique ID.
 */
function nextIdFactory(initialId: Id = 0) {
	let id = initialId;
	return function nextId(peek?: "peek") {
		if (peek) {
			return id;
		}
		const newId = id;
		id++;
		return newId;
	};
}

/**
 * Create a factory function for generating unique IDs.
 * @returns {() => EntryId} A function that generates a unique ID.
 */
function nextEntryIdFactory(paletteId: Id) {
	let id = 0;
	return function nextId(peek?: "peek") {
		if (peek) {
			return `${paletteId}-${id}`;
		}
		const newId = `${paletteId}-${id}`;
		id++;
		return newId;
	};
}

type Id = number;
type EntryId = string;

type PaletteIds = {
	paletteIds: { [key: Id]: EntryId[] };
	_nextId: ReturnType<typeof nextIdFactory>;
	_nextEntryIds: {
		[key: Id]: ReturnType<typeof nextEntryIdFactory>;
	};
};

const initialPaletteIds: PaletteIds = {
	paletteIds: { 0: [] },
	_nextId: nextIdFactory(1),
	_nextEntryIds: { 0: nextEntryIdFactory(0) },
};

export type { Id, EntryId, PaletteIds };
export { initialPaletteIds, nextIdFactory, nextEntryIdFactory };
