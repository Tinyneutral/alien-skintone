import { defineConfig } from "vitest/config";
import { playwright } from "@vitest/browser-playwright";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
	root,
	resolve: {
		tsconfigPaths: true,
	},
	test: {
		include: ["src/tests/**/*.test.ts", "src/tests/**/*.test.js"],
		exclude: ["**/node_modules/**", "**/dist/**", "./temp/**"],
		browser: {
			enabled: true,
			provider: playwright(),
			// https://vitest.dev/config/browser/playwright
			instances: [{ browser: "chromium" }],
			headless: true,
		},
	},
});
