import { defineConfig } from "vitest/config";
import { playwright } from "@vitest/browser-playwright";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
	root,
	resolve: {
		tsconfigPaths: true,
	},
	plugins: [react()],
	test: {
		browser: {
			enabled: true,
			provider: playwright(),
			// https://vitest.dev/config/browser/playwright
			instances: [{ browser: "chromium" }],
		},
	},
});
