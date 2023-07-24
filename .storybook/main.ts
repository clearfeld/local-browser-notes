import type { StorybookConfig } from "@storybook/react-vite";

import { createRequire } from "node:module";
const require = createRequire(import.meta.url);

const pathBrowserify = require.resolve("path-browserify");

const config: StorybookConfig = {
	stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
	addons: [
		"@storybook/addon-links",
		"@storybook/addon-essentials",
		"@storybook/addon-interactions",
		"@storybook/addon-actions",
		"@storybook/addon-measure",

		// None core addons
		"@storybook/addon-a11y",
		"@storybook/addon-jest",
	],
	framework: {
		name: "@storybook/react-vite",
		options: {},
	},
	docs: {
		autodocs: "tag",
	},

	core: {
		disableTelemetry: true,
	},

	// required for addon-jest
	async viteFinal(config, options) {
		config.resolve.alias["path"] = pathBrowserify;
		return config;
	},

};

export default config;
