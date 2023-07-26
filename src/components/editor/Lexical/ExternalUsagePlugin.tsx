import React from "react";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot } from "lexical";

interface I_ExternalUsagePluginProps {}

const ExternalUsagePlugin = React.forwardRef((props: I_ExternalUsagePluginProps, ref: any) => {
	const [editor] = useLexicalComposerContext();

	React.useImperativeHandle(ref, () => ({
		SetEditable(editable: boolean): void {
			editor.setEditable(editable);
			// console.log("test from toolbar");
		},

		ClearEditorState(editable: boolean): void {
			editor.update(() => {
				$getRoot().clear();
			});
		},
	}));

	return <></>;
});

ExternalUsagePlugin.displayName = "ExternalUsagePlugin";
export default ExternalUsagePlugin;
