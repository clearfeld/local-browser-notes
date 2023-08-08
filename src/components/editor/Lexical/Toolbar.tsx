/**
 * https://github.com/facebook/lexical/blob/main/packages/lexical-playground/src/plugins/ToolbarPlugin/index.tsx
 *
 * NOTE(marko): reference fil to pull functions and logic from
 *
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
	CAN_REDO_COMMAND,
	CAN_UNDO_COMMAND,
	REDO_COMMAND,
	UNDO_COMMAND,
	SELECTION_CHANGE_COMMAND,
	FORMAT_TEXT_COMMAND,
	FORMAT_ELEMENT_COMMAND,
	$getSelection,
	$isRangeSelection,
	$createParagraphNode,
	$getNodeByKey,
	RangeSelection,
} from "lexical";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import { $isParentElementRTL, $wrapNodes, $isAtNodeEnd } from "@lexical/selection";
import { $getNearestNodeOfType, mergeRegister } from "@lexical/utils";
import { $isListNode, ListNode } from "@lexical/list";
import { createPortal } from "react-dom";
import { $createHeadingNode, $createQuoteNode, $isHeadingNode } from "@lexical/rich-text";
import {
	$createCodeNode,
	$isCodeNode,
	getDefaultCodeLanguage,
	getCodeLanguages,
} from "@lexical/code";
import {INSERT_HORIZONTAL_RULE_COMMAND} from '@lexical/react/LexicalHorizontalRuleNode';

import { ReactComponent as ArrowClockwiseSVG } from "../assets/ArrowClockwise.svg";
import { ReactComponent as ArrowCounterClockwiseSVG } from "../assets/ArrowCounterClockwise.svg";
import { ReactComponent as BoldSVG } from "../assets/TypeBold.svg";
import { ReactComponent as ItalicSVG } from "../assets/TypeItalic.svg";
import { ReactComponent as UnderlineSVG } from "../assets/TypeUnderline.svg";
import { ReactComponent as StrikeThroughSVG } from "../assets/TypeStrikethrough.svg";
import { ReactComponent as CodeSVG } from "../assets/Code.svg";
import { ReactComponent as LinkSVG } from "../assets/Link.svg";
import { ReactComponent as LeftAlignSVG } from "../assets/TextLeft.svg";
import { ReactComponent as CenterAlignSVG } from "../assets/TextCenter.svg";
import { ReactComponent as RightAlignSVG } from "../assets/TextRight.svg";
import { ReactComponent as DivideLingSVG } from "../assets/divide-line.svg";

import { ReactComponent as ShrinkSVG } from "../assets/Shrink.svg";
import { ReactComponent as ExpandSVG } from "../assets/Expand.svg";

import BlockOptionsButton from "./Toolbar/HeadingsDropdown";
import AlignmentDropdown from "./Toolbar/AlignmentDropdown";
import FloatingLinkEditor from "./Toolbar/FloatingLinkEditor";

const CLASSNAME_PREFIX = "lbn__core__l-editor";

const LowPriority = 1;

const supportedBlockTypes = new Set([
	"paragraph",
	"quote",
	"code",
	"h1",
	"h2",
	"h3",
	"h4",
	"h5",
	"h6",
	"bullet",
	"number",
	"check",
]);

function Divider() {
	return <div className={`${CLASSNAME_PREFIX}__divider`} />;
}

function Select({ onChange, className, options, value }: any) {
	return (
		<select className={className} onChange={onChange} value={value}>
			<option hidden={true} value="" />
			{options.map((option: any) => (
				<option key={option} value={option}>
					{option}
				</option>
			))}
		</select>
	);
}

function getSelectedNode(selection: any) {
	const anchor = selection.anchor;
	const focus = selection.focus;
	const anchorNode = selection.anchor.getNode();
	const focusNode = selection.focus.getNode();
	if (anchorNode === focusNode) {
		return anchorNode;
	}
	const isBackward = selection.isBackward();
	if (isBackward) {
		return $isAtNodeEnd(focus) ? anchorNode : focusNode;
	} else {
		return $isAtNodeEnd(anchor) ? focusNode : anchorNode;
	}
}

interface I_ToolbarPluginProps {
	expanded?: boolean;
	ExpandToggle?: (state: boolean) => void;

	affirmateAction: () => void;

	SetModRefTrue: Function | null;
}

function ToolbarPlugin(props: I_ToolbarPluginProps) {
	const [editor] = useLexicalComposerContext();
	const toolbarRef = useRef(null);
	const [canUndo, setCanUndo] = useState(false);
	const [canRedo, setCanRedo] = useState(false);
	const [blockType, setBlockType] = useState("paragraph");
	const [selectedElementKey, setSelectedElementKey] = useState(null);

	const [codeLanguage, setCodeLanguage] = useState("");
	const [isRTL, setIsRTL] = useState(false);
	const [isLink, setIsLink] = useState(false);
	const [isBold, setIsBold] = useState(false);
	const [isItalic, setIsItalic] = useState(false);
	const [isUnderline, setIsUnderline] = useState(false);
	const [isStrikethrough, setIsStrikethrough] = useState(false);
	const [isCode, setIsCode] = useState(false);

	const updateToolbar = useCallback(() => {
		const selection = $getSelection();
		if ($isRangeSelection(selection)) {
			const anchorNode = selection.anchor.getNode();
			const element =
				anchorNode.getKey() === "root" ? anchorNode : anchorNode.getTopLevelElementOrThrow();
			const elementKey = element.getKey();
			const elementDOM = editor.getElementByKey(elementKey);
			if (elementDOM !== null) {
				// @ts-ignore
				setSelectedElementKey(elementKey);
				if ($isListNode(element)) {
					const parentList = $getNearestNodeOfType<ListNode>(anchorNode, ListNode);
					const type = parentList ? parentList.getListType() : element.getListType();
					setBlockType(type);
				} else {
					const type = $isHeadingNode(element) ? element.getTag() : element.getType();
					setBlockType(type);
					if ($isCodeNode(element)) {
						setCodeLanguage(element.getLanguage() || getDefaultCodeLanguage());
					}
				}
			}
			// Update text format
			setIsBold(selection.hasFormat("bold"));
			setIsItalic(selection.hasFormat("italic"));
			setIsUnderline(selection.hasFormat("underline"));
			setIsStrikethrough(selection.hasFormat("strikethrough"));
			setIsCode(selection.hasFormat("code"));
			setIsRTL($isParentElementRTL(selection));

			// Update links
			const node = getSelectedNode(selection);
			const parent = node.getParent();
			if ($isLinkNode(parent) || $isLinkNode(node)) {
				setIsLink(true);
			} else {
				setIsLink(false);
			}
		}
	}, [editor]);

	useEffect(() => {
		return mergeRegister(
			// NOTE(clearfeld): flawed doesn't pick up block convert ie heading 1 changed to heading 6
			// look into something for that later not a massive deal though
			editor.registerTextContentListener((textContent) => {
				// The latest text content of the editor!
				// console.log(textContent);
				if(props.SetModRefTrue !== null) {
					console.log("update");
					props.SetModRefTrue();
				}
			}),
			editor.registerUpdateListener(({ editorState }) => {
				editorState.read(() => {
					updateToolbar();
				});
			}),
			editor.registerCommand(
				SELECTION_CHANGE_COMMAND,
				(_payload, newEditor) => {
					updateToolbar();
					return false;
				},
				LowPriority,
			),
			editor.registerCommand(
				CAN_UNDO_COMMAND,
				(payload) => {
					setCanUndo(payload);
					return false;
				},
				LowPriority,
			),
			editor.registerCommand(
				CAN_REDO_COMMAND,
				(payload) => {
					setCanRedo(payload);
					return false;
				},
				LowPriority,
			),
		);
	}, [editor, updateToolbar]);

	const codeLanguges = useMemo(() => getCodeLanguages(), []);
	const onCodeLanguageSelect = useCallback(
		(e: any) => {
			editor.update(() => {
				if (selectedElementKey !== null) {
					const node = $getNodeByKey(selectedElementKey);
					if ($isCodeNode(node)) {
						node.setLanguage(e.target.value);
					}
				}
			});
		},
		[editor, selectedElementKey],
	);

	const insertLink = useCallback(() => {
		if (!isLink) {
			editor.dispatchCommand(TOGGLE_LINK_COMMAND, "https://");
		} else {
			editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
		}
	}, [editor, isLink]);

	return (
		<div className={`${CLASSNAME_PREFIX}__toolbar`} ref={toolbarRef}>
			<div className={`${CLASSNAME_PREFIX}__toolbar__left-side`}>
				<button
					disabled={!canUndo}
					onClick={() => {
						// @ts-ignore
						editor.dispatchCommand(UNDO_COMMAND);
					}}
					className={`${CLASSNAME_PREFIX}__toolbar-item spaced`}
					aria-label="Undo"
				>
					<ArrowCounterClockwiseSVG
						className="svg-filter format undo"
						viewBox="0 0 16 16"
						height="1rem"
						width="1rem"
					/>
				</button>
				<button
					disabled={!canRedo}
					onClick={() => {
						// @ts-ignore
						editor.dispatchCommand(REDO_COMMAND);
					}}
					className={`${CLASSNAME_PREFIX}__toolbar-item`}
					aria-label="Redo"
				>
					<ArrowClockwiseSVG
						className="svg-filter format redo"
						viewBox="0 0 16 16"
						height="1rem"
						width="1rem"
					/>
				</button>

				<Divider />

				{(supportedBlockTypes.has(blockType) || blockType === "root") && (
					<>
						<BlockOptionsButton editor={editor} blockType={blockType} toolbarRef={toolbarRef} />

						<Divider />
					</>
				)}

				{blockType === "code" ? (
					<>
						<Select
							className={`${CLASSNAME_PREFIX}__toolbar-item ${CLASSNAME_PREFIX}__code-language`}
							onChange={onCodeLanguageSelect}
							options={codeLanguges}
							value={codeLanguage}
						/>
						{/* <ChevronDownSVG
             className="svg-filter"
             height="1rem"
             width="1rem"
           /> */}
					</>
				) : (
					<>
						<button
							onClick={() => {
								editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
							}}
							className={"toolbar-item spaced " + (isBold ? "active" : "")}
							aria-label="Format Bold"
						>
							<BoldSVG
								className="svg-filter format bold"
								viewBox="0 0 16 16"
								height="1rem"
								width="1rem"
							/>
						</button>

						<button
							onClick={() => {
								editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
							}}
							className={"toolbar-item spaced " + (isItalic ? "active" : "")}
							aria-label="Format Italics"
						>
							<ItalicSVG
								className="svg-filter format italic"
								viewBox="0 0 16 16"
								height="1rem"
								width="1rem"
							/>
						</button>

						<button
							onClick={() => {
								editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
							}}
							className={"toolbar-item spaced " + (isUnderline ? "active" : "")}
							aria-label="Format Underline"
						>
							<UnderlineSVG
								className="svg-filter format underline"
								viewBox="0 0 16 16"
								height="1rem"
								width="1rem"
							/>
						</button>

						<button
							onClick={() => {
								editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
							}}
							className={"toolbar-item spaced " + (isStrikethrough ? "active" : "")}
							aria-label="Format Strikethrough"
						>
							<StrikeThroughSVG
								className="svg-filter format strikethrough"
								viewBox="0 0 16 16"
								height="1rem"
								width="1rem"
							/>
						</button>

						<button
							onClick={() => {
								editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code");
							}}
							className={"toolbar-item spaced " + (isCode ? "active" : "")}
							aria-label="Insert Code"
						>
							<CodeSVG
								className="svg-filter format code"
								viewBox="0 0 511.997 511.997"
								height="1rem"
								width="1rem"
							/>
						</button>

						<button
							onClick={insertLink}
							className={"toolbar-item spaced " + (isLink ? "active" : "")}
							aria-label="Insert Link"
						>
							<LinkSVG
								className="svg-filter format link"
								viewBox="0 0 511.997 511.997"
								// viewBox="0 0 16 16"
								height="0.825rem"
								width="0.825rem"
							/>
						</button>

						{isLink && createPortal(<FloatingLinkEditor editor={editor} />, document.body)}
						<Divider />

						<button
							onClick={() => {
								editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
							}}
							className="toolbar-item spaced"
							aria-label="Left Align"
						>
							<LeftAlignSVG
								className="svg-filter format left-align"
								viewBox="0 0 16 16"
								height="1rem"
								width="1rem"
							/>
						</button>

						<button
							onClick={() => {
								editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
							}}
							className="toolbar-item spaced"
							aria-label="Center Align"
						>
							<CenterAlignSVG
								className="svg-filter format center-align"
								viewBox="0 0 16 16"
								height="1rem"
								width="1rem"
							/>
						</button>

						<button
							onClick={() => {
								editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
							}}
							className="toolbar-item spaced"
							aria-label="Right Align"
						>
							<RightAlignSVG
								className="svg-filter format right-align"
								viewBox="0 0 16 16"
								height="1rem"
								width="1rem"
							/>
						</button>

						{/* <button
            onClick={() => {
              editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify");
            }}
            className="toolbar-item"
            aria-label="Justify Align"
          >
            <i className="format justify-align" />
          </button>{" "} */}
					</>
				)}

				{/* <Divider />

				<AlignmentDropdown
					editor={editor}
					blockType={blockType}
					toolbarRef={toolbarRef}
				/> */}

				<Divider />

				<button
							onClick={() => {
								editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined);
							}}
							className="toolbar-item spaced"
							aria-label="Right Align"
						>
							<DivideLingSVG
								className="svg-filter format right-align"
								viewBox="0 0 24 24"
								height="1.25rem"
								width="1.25rem"
								style={{
									height: "1rem",
									scale: "1.25"
								}}
							/>
						</button>

				<Divider />

				<div>
					<button
						onClick={() => {
							// editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
							if (props.ExpandToggle !== undefined && props.expanded !== undefined) {
								props.ExpandToggle(!props.expanded);
							}
						}}
						className="toolbar-item spaced"
						aria-label="Shrink or expand article"
					>
						{props.expanded ? (
							<ShrinkSVG className="svg-filter" height="1rem" width="1rem" />
						) : (
							<ExpandSVG className="svg-filter" height="1rem" width="1rem" />
						)}
					</button>
				</div>
			</div>

			<div className={`${CLASSNAME_PREFIX}__toolbar__right-side`}>
				{/* <button
					className={`${CLASSNAME_PREFIX}__save-btn`}
					onClick={() => props.affirmateAction()}
				>
					Publish
				</button> */}
			</div>
		</div>
	);
}

// ToolbarPlugin.displayName = "ToolbarPlugin";
export default ToolbarPlugin;
