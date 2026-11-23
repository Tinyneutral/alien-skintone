/**
 * Create a factory function for generating unique IDs.
 * @returns {() => Id} A function that generates a unique ID.
 */
function nextIdFactory() {
	let id = 0;
	return function nextId() {
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
	return function nextId() {
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
	paletteIds: {},
	_nextId: nextIdFactory(),
	_nextEntryIds: {},
};

export type { Id, EntryId, PaletteIds };
export { initialPaletteIds, nextIdFactory, nextEntryIdFactory };
