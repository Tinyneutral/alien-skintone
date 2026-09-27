import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));

// https://vite.dev/config/
export default defineConfig({
	root,
	resolve: {
		tsconfigPaths: true,
	},
	plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
});
