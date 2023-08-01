// const path = require("node:path");
const restrictedGlobals = require("confusing-browser-globals");

module.exports = {
	root: true,
	env: {
		browser: true,
		es2021: true,
		jest: true,
	},

	ignorePatterns: [
		"**/node_modules/**",
		"**/dist/**",
		"**/.git/**",
		"**/.turbo/**",
		"stylelint.config.cjs",
		"postcss.config.cjs",
		".eslintrc.cjs",
	],

	plugins: ["@typescript-eslint", "import", "jest", "jsx-a11y", "react", "react-hooks"],

	extends: [
		"eslint:recommended",
		"plugin:import/recommended",
		"plugin:import/typescript",
		"plugin:jest/recommended",
		"plugin:jest/style",
		"plugin:jsx-a11y/recommended",
		"plugin:react/recommended",
		"plugin:react-hooks/recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:@typescript-eslint/recommended-requiring-type-checking",
	],

	parser: "@typescript-eslint/parser",
	parserOptions: {
		tsconfigRootDir: __dirname,
		project: ["./tsconfig.json"],
		ecmaFeatures: {
			jsx: true,
		},
		ecmaVersion: "latest",
		sourceType: "module",

		warnOnUnsupportedTypeScriptVersion: true,
	},

	settings: {
		jest: {
			version: require("jest/package.json").version,
		},

		react: {
			version: "detect",
		},

		"import/parsers": {
			"@typescript-eslint/parser": [".ts", ".tsx"],
		},

		"import/resolver": {
			typescript: {
				alwaysTryTypes: true, // always try to resolve types under `<root>@types` directory even it doesn't contain any source code, like `@types/unist`

				project: "./tsconfig.json",
			},
		},
	},

	rules: {
		"no-restricted-globals": ["error"].concat(restrictedGlobals),

		// NOTE(clearfeld): set to warnings to better work with Storybook
		"@typescript-eslint/await-thenable": "warn",
		"react/no-unescaped-entities": "warn",

		// NOTE(clearfeld): TEMP remove these warnings and ensure theyre errors
		"@typescript-eslint/no-unsafe-assignment": 1, // warning instead
		"@typescript-eslint/ban-ts-comment": 1,
		"@typescript-eslint/no-explicit-any": 1,
		"@typescript-eslint/no-unsafe-return": 1,
		"@typescript-eslint/no-unsafe-member-access": 1,
		"@typescript-eslint/ban-types": 1,
		"@typescript-eslint/no-unsafe-call": 1,
		"@typescript-eslint/no-unsafe-argument": 1,
		"jsx-a11y/click-events-have-key-events": 1,
		// "@typescript-eslint/no-empty-interface": 1,
	},
};
