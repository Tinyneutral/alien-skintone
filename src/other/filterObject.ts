function filterObject<T extends object>(
	object: T,
	predicate: (value: [keyof T, T[keyof T]]) => boolean
) {
	return Object.fromEntries(
		Object.entries(object).filter(([key, value]) =>
			predicate([key as keyof T, value])
		)
	);
}

export { filterObject };
