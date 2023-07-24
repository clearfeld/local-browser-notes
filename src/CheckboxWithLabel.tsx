import React, { useState } from "react";

interface CheckboxWithLabelProps {
	on: string;
	off: string;
}

function CheckboxWithLabel(props: CheckboxWithLabelProps) {
	const [isChecked, setIsChecked] = useState(false);

	const onChange = () => {
		setIsChecked(!isChecked);
	};

	return (
		<label>
			<input type="checkbox" checked={isChecked} onChange={onChange} />
			{isChecked ? props.on : props.off}
		</label>
	);
}

export default CheckboxWithLabel;
