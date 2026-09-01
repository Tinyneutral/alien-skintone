/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
	tabWidth: 4,
	useTabs: true,
	trailingComma: "es5",
	bracketSameLine: true,
	overrides: [
		{
			files: ["*.tsx"],
			options: {
				parser: "typescript",
				tabWidth: 2,
			},
		},
	],
};

export default config;
