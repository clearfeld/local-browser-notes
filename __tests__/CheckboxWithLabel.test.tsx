import React from "react";
import { fireEvent, render } from "@testing-library/react";

import CheckboxWithLabel from "@src/CheckboxWithLabel";

describe("CheckboxWithLabel", () => {
	it("Change text after click", () => {
		const { queryByLabelText, getByLabelText } = render(
			<CheckboxWithLabel on={"On"} off={"Off"} />,
		);

		expect(queryByLabelText(/off/i)).toBeTruthy();

		fireEvent.click(getByLabelText(/off/i));

		expect(queryByLabelText(/on/i)).toBeTruthy();
	});
});
