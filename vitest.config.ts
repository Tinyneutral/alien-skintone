import { defineConfig } from "vitest/config";
import { playwright } from "@vitest/browser-playwright";

export default defineConfig({
	test: {
		include: ["src/tests/**/*.test.ts"],
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
