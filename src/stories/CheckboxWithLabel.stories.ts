import type { Meta, StoryObj } from "@storybook/react";

import CheckboxWithLabel from "@src/CheckboxWithLabel";

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta = {
	title: "Example/CheckboxWithLabel",
	component: CheckboxWithLabel,
	tags: ["autodocs"],
    parameters: {
        jest: ["CheckboxWithLabel.test.tsx"],
    },
} satisfies Meta<typeof CheckboxWithLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/7.0/react/writing-stories/args
export const Primary: Story = {
	args: {
		on: "On",
		off: "Off",
	},
};
