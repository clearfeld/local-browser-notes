import type { Preview } from "@storybook/react";

import { withTests } from "@storybook/addon-jest";

// NOTE user facing: run the command
// `pnpm test:generate-output` or `npm run test:generate-output` to generate the required file
import results from "../.jest-test-results.json";

const preview: Preview = {
	parameters: {
		actions: { argTypesRegex: "^on[A-Z].*" },
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/,
			},
		},
	},
	decorators: [
		withTests({
			results,
		}),
	],
};

export default preview;
