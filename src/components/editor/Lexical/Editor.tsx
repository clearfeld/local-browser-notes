import React from "react";
import { createPortal } from "react-dom";

import "./Editor.scss";

// import EmoticonPlugin from "./plugins/EmoticonPlugin";
// import { $getRoot, $getSelection } from "lexical";

// import { EmojiNode } from "./nodes/EmojiNode";

// Lexical React plugins are React components, which makes them
// highly composable. Furthermore, you can lazy load plugins if
// desired, so you don't pay the cost for plugins until you
// actually use them.
// import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
// function MyCustomAutoFocusPlugin() {
//   const [editor] = useLexicalComposerContext();

//   useEffect(() => {
//     // Focus the editor when the effect fires!
//     editor.focus();
//   }, [editor]);

//   return null;
// }

// import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
// When the editor changes, you can get notified via the
// LexicalOnChangePlugin!
// function onChange(editorState: any) {
//   editorState.read(() => {
// Read the contents of the EditorState here.
//     const root = $getRoot();
//     const selection = $getSelection();

//     console.log(root, selection);
//   });
// }

// import ExampleTheme from "./themes/ExampleTheme";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
// import TreeViewPlugin from "./plugins/TreeViewPlugin";
import ToolbarPlugin from "./Toolbar";
import ExternalUsagePlugin from "./ExternalUsagePlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { ListItemNode, ListNode } from "@lexical/list";
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { TRANSFORMERS } from "@lexical/markdown";

import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";

import ListMaxIndentLevelPlugin from "./plugins/ListMaxIndentLevelPlugin";
import CodeHighlightPlugin from "./plugins/CodeHighlightPlugin";
import AutoLinkPlugin from "./plugins/AutoLinkPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import { CustomHeadingNode } from "./nodes/H1HeaderNode";

// import { CustomParagraphNode } from "./nodes/CustomParagraphNode";

const CLASSNAME_PREFIX = "lbn__core__l-editor";
const ExampleTheme = {
	ltr: `${CLASSNAME_PREFIX}__ltr`,
	rtl: `${CLASSNAME_PREFIX}__rtl`,
	placeholder: `${CLASSNAME_PREFIX}__editor-placeholder`,
	paragraph: `${CLASSNAME_PREFIX}__editor-paragraph`,
	quote: `${CLASSNAME_PREFIX}__editor-quote`,
	heading: {
		h1: `${CLASSNAME_PREFIX}__editor-heading-h1`,
		h2: `${CLASSNAME_PREFIX}__editor-heading-h2`,
		h3: `${CLASSNAME_PREFIX}__editor-heading-h3`,
		h4: `${CLASSNAME_PREFIX}__editor-heading-h4`,
		h5: `${CLASSNAME_PREFIX}__editor-heading-h5`,
		h6: `${CLASSNAME_PREFIX}__editor-heading-h6`,
	},
	list: {
		nested: {
			listitem: `${CLASSNAME_PREFIX}__editor-nested-listitem`,
		},
		ol: `${CLASSNAME_PREFIX}__editor-list-ol`,
		ul: `${CLASSNAME_PREFIX}__editor-list-ul`,
		listitem: `${CLASSNAME_PREFIX}__editor-listitem`,
		listitemChecked: `${CLASSNAME_PREFIX}__editor-listItemChecked`,
		listitemUnchecked: `${CLASSNAME_PREFIX}__editor-listItemUnchecked`,
	},
	image: `${CLASSNAME_PREFIX}__editor-image`,
	link: `${CLASSNAME_PREFIX}__editor-link`,
	text: {
		bold: `${CLASSNAME_PREFIX}__editor-text-bold`,
		italic: `${CLASSNAME_PREFIX}__editor-text-italic`,
		overflowed: `${CLASSNAME_PREFIX}__editor-text-overflowed`,
		hashtag: `${CLASSNAME_PREFIX}__editor-text-hashtag`,
		underline: `${CLASSNAME_PREFIX}__editor-text-underline`,
		strikethrough: `${CLASSNAME_PREFIX}__editor-text-strikethrough`,
		underlineStrikethrough: `${CLASSNAME_PREFIX}__editor-text-underlineStrikethrough`,
		code: `${CLASSNAME_PREFIX}__editor-text-code`,
	},
	code: `${CLASSNAME_PREFIX}__editor-code`,
	codeHighlight: {
		atrule: `${CLASSNAME_PREFIX}__editor-tokenAttr`,
		attr: `${CLASSNAME_PREFIX}__editor-tokenAttr`,
		boolean: `${CLASSNAME_PREFIX}__editor-tokenProperty`,
		builtin: `${CLASSNAME_PREFIX}__editor-tokenSelector`,
		cdata: `${CLASSNAME_PREFIX}__editor-tokenComment`,
		char: `${CLASSNAME_PREFIX}__editor-tokenSelector`,
		class: `${CLASSNAME_PREFIX}__editor-tokenFunction`,
		"class-name": `${CLASSNAME_PREFIX}__editor-tokenFunction`,
		comment: `${CLASSNAME_PREFIX}__editor-tokenComment`,
		constant: `${CLASSNAME_PREFIX}__editor-tokenProperty`,
		deleted: `${CLASSNAME_PREFIX}__editor-tokenProperty`,
		doctype: `${CLASSNAME_PREFIX}__editor-tokenComment`,
		entity: `${CLASSNAME_PREFIX}__editor-tokenOperator`,
		function: `${CLASSNAME_PREFIX}__editor-tokenFunction`,
		important: `${CLASSNAME_PREFIX}__editor-tokenVariable`,
		inserted: `${CLASSNAME_PREFIX}__editor-tokenSelector`,
		keyword: `${CLASSNAME_PREFIX}__editor-tokenAttr`,
		namespace: `${CLASSNAME_PREFIX}__editor-tokenVariable`,
		number: `${CLASSNAME_PREFIX}__editor-tokenProperty`,
		operator: `${CLASSNAME_PREFIX}__editor-tokenOperator`,
		prolog: `${CLASSNAME_PREFIX}__editor-tokenComment`,
		property: `${CLASSNAME_PREFIX}__editor-tokenProperty`,
		punctuation: `${CLASSNAME_PREFIX}__editor-tokenPunctuation`,
		regex: `${CLASSNAME_PREFIX}__editor-tokenVariable`,
		selector: `${CLASSNAME_PREFIX}__editor-tokenSelector`,
		string: `${CLASSNAME_PREFIX}__editor-tokenSelector`,
		symbol: `${CLASSNAME_PREFIX}__editor-tokenProperty`,
		tag: `${CLASSNAME_PREFIX}__editor-tokenProperty`,
		url: `${CLASSNAME_PREFIX}__editor-tokenOperator`,
		variable: `${CLASSNAME_PREFIX}__editor-tokenVariable`,
	},
};

interface I_PlaceholderProps {
	placeholderText: string;
}

function Placeholder(props: I_PlaceholderProps) {
	return (
		<div className={`${CLASSNAME_PREFIX}__editor-placeholder`}>
			{props.placeholderText}
		</div>
	);
}

const editorConfig = {
	namespace: "CC_CUST_EDITOR",
	// The editor theme
	theme: ExampleTheme,
	// Handling of errors during update
	onError(error: any) {
		throw error;
	},
	// Any custom nodes go here
	nodes: [
		HeadingNode,
		// CustomHeadingNode,
		// {
		// 	replace: HeadingNode,
		// 	with: (node: HeadingNode) => {
		// 		return new CustomHeadingNode(node.getTag());
		// 	},
		// },

		ListNode,
		ListItemNode,
		QuoteNode,
		CodeNode,
		CodeHighlightNode,
		TableNode,
		TableCellNode,
		TableRowNode,
		AutoLinkNode,
		LinkNode,
		// EmojiNode,
		// CustomParagraphNode,
		// {
		//   replace: ParagraphNode,
		//   with: (node) => {
		//     return new CustomParagraphNode();
		//   }
		// }
	],
};

const editorConfigReadingMode = {
	namespace: "CC_CUST_EDITOR",
	// The editor theme
	theme: ExampleTheme,
	// Handling of errors during update
	onError(error: any) {
		throw error;
	},
	// Any custom nodes go here
	nodes: [
		// HeadingNode,
		CustomHeadingNode,
		{
			replace: HeadingNode,
			with: (node: HeadingNode) => {
				return new CustomHeadingNode(node.getTag());
			},
		},

		ListNode,
		ListItemNode,
		QuoteNode,
		CodeNode,
		CodeHighlightNode,
		TableNode,
		TableCellNode,
		TableRowNode,
		AutoLinkNode,
		LinkNode,
		// EmojiNode,
		// CustomParagraphNode,
		// {
		//   replace: ParagraphNode,
		//   with: (node) => {
		//     return new CustomParagraphNode();
		//   }
		// }
	],
};

interface CCLEditorProps {
	value: any | null;
	PatchContent: Function | null;

	editable: boolean;
	setEditable: Function | null;

	showToolbar: boolean;

	placeholder: string;

	// tells us whether the view is default expanded or not
	expanded?: boolean;
	ExpandToggle?: (state: boolean) => void;

	toolbarRef: any;
	affirmateAction: () => void;
}

const CCLEditor = React.forwardRef((props: CCLEditorProps, ref: any) => {
	const editorRef = React.useRef<any>(null);
	const editorStateRef = React.useRef<any>(null);
	const toolbarRef = React.useRef<any>(null);
	// const [editor] = useLexicalComposerContext();

	const editorConfigInternal = props.editable ? editorConfig : editorConfigReadingMode;

	React.useImperativeHandle(ref, () => ({
		// NCancelEditing();
		//   NCancelEditing() {
		//       NCancelEditing();
		//   },

		//   FocusEditor() {
		//       SetFocusToEditorAtEnd();
		//   },

		//   ClearContent() {
		//       ClearContent();
		//   },

		ClearEditorState(): void {
			if(editorRef.current) {
				// console.log(toolbarRef.current);
				editorRef.current.ClearEditorState();
			} else {
				console.error("Failed to clear editor state");
			}
		},

		GetEditorContent(): string {
			// TODO: maybe make a function that returns the raw editorstate?
			return JSON.stringify(editorStateRef.current);
		},

		SetEditable(editable: boolean): void {
			if(editorRef.current) {
				// console.log(toolbarRef.current);
				editorRef.current.SetEditable(editable);
			} else {
				console.error("Failed to change editor editable state.");
			}

			// if(toolbarRef.current) {
			// 	// console.log(toolbarRef.current);
			// 	toolbarRef.current.SetEditable();
			// } else {
			// 	console.log("sad");
			// }

			// if(editorStateRef.current) {
			// 	editorStateRef.current.setEditable(editable);
			// }
		},

		// SetFocusToEditorAtEnd()
		// CancelEditing(null);
	}));

	function PatchContent() {
		if(props.PatchContent !== null) {
			props.PatchContent();
		}
		if(props.setEditable !== null) {
			props.setEditable(false);
		}
	}

	function CancelEditing(e: any): void {
		e.stopPropagation();

		if(editorRef.current) {
			// console.log(toolbarRef.current);
			editorRef.current.SetEditable(false);
		} else {
			console.log("sad");
		}

		// setEditorState(initalEditorStateCopy);
		if(props.setEditable !== null) {
			props.setEditable(false);
		}
	}

	// function test(): void {
	// 	if(editorStateRef.current) {
	// 		//saveContent(JSON.stringify(editorStateRef.current))
	// 		console.log(JSON.stringify(editorStateRef.current));
	// 	}

	// 	return;
	// }

	function ParseEditorStateIfExists() {
		if(props.value !== null) {
			return props.value;
			//   try {
			//      //JSON.parse(props.value);
			//   } catch (error) {
			//     console.error("Failed to parse editor state: ", error);
			//     // TODO: have a warning presented in the editor and show that to the users
			//     return null;
			//   }
		}

		return null;
	}

	return (
		<div>
			<LexicalComposer
				initialConfig={{
					// ...editorConfig,
					...editorConfigInternal,
					editorState: ParseEditorStateIfExists(),
					editable: props.editable,
				}}
			>
				<div
					className={
						`${CLASSNAME_PREFIX}__editor-container ` +
						(props.editable && `${CLASSNAME_PREFIX}__editor-container-border `)
					}
				>
					<ExternalUsagePlugin ref={editorRef} />

					{props.showToolbar && (
						<>
							{createPortal(
								<ToolbarPlugin
									expanded={props.expanded}
									ExpandToggle={props.ExpandToggle}
									affirmateAction={props.affirmateAction}
								/>,

								// toolbarRef.current,
								// Temp make this a function that checks if the elemenet exists
								// @ts-ignore
								document.getElementById(
									"lbn__Core__KnowledgeBase__Editor__Toolbar__Portal",
								),
							)}
						</>
					)}

					<OnChangePlugin
						onChange={(editorState) => (editorStateRef.current = editorState)}
					/>

					<div className={`${CLASSNAME_PREFIX}__editor-inner`}>
						<RichTextPlugin
							contentEditable={
								<ContentEditable
									className={`${CLASSNAME_PREFIX}__editor-input`}
								/>
							}
							placeholder={<Placeholder placeholderText={props.placeholder} />}
							ErrorBoundary={LexicalErrorBoundary}
						/>
						<HistoryPlugin />
						{/* <TreeViewPlugin /> */}
						{/* <OnChangePlugin onChange={onChange} /> */}
						{/* <EmoticonPlugin /> */}

						{/* <AutoFocusPlugin /> */}
						<CodeHighlightPlugin />
						<ListPlugin />
						<CheckListPlugin />
						<LinkPlugin />
						{/* <MyCustomAutoFocusPlugin /> */}
						<AutoLinkPlugin />
						<ListMaxIndentLevelPlugin maxDepth={5} />
						{/* <MarkdownShortcutPlugin transformers={TRANSFORMERS} /> */}
					</div>
				</div>
			</LexicalComposer>
		</div>
	);
});

CCLEditor.displayName = "CC_KnowledgeBase_LEditor";
export default CCLEditor;
