import React from "react";
import "./HeadingsDropdown.scss";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import {
	$createParagraphNode,
	$getNodeByKey,
	$getRoot,
	$getSelection,
	$isRangeSelection,
	$isRootOrShadowRoot,
	$isTextNode,
	CAN_REDO_COMMAND,
	CAN_UNDO_COMMAND,
	COMMAND_PRIORITY_CRITICAL,
	DEPRECATED_$isGridSelection,
	FORMAT_ELEMENT_COMMAND,
	FORMAT_TEXT_COMMAND,
	INDENT_CONTENT_COMMAND,
	OUTDENT_CONTENT_COMMAND,
	REDO_COMMAND,
	SELECTION_CHANGE_COMMAND,
	UNDO_COMMAND,
} from "lexical";

import {
	$isParentElementRTL,
	$wrapNodes,
	$isAtNodeEnd,
} from "@lexical/selection";
import {
	INSERT_ORDERED_LIST_COMMAND,
	INSERT_UNORDERED_LIST_COMMAND,
	REMOVE_LIST_COMMAND,
	INSERT_CHECK_LIST_COMMAND,
} from "@lexical/list";
import {
	$createHeadingNode,
	$createQuoteNode,
	HeadingTagType,
} from "@lexical/rich-text";
import { $createCodeNode } from "@lexical/code";

import { ReactComponent as ChevronDownSVG } from "../../assets/ChevronDown.svg";

import { ReactComponent as NormalTextSVG } from "../../assets/NormalText.svg";

// import { ReactComponent as H1SVG } from "../../assets/TypeH1.svg";
// import { ReactComponent as H2SVG } from "../../assets/TypeH2.svg";

import { ReactComponent as AlignLeftSVG } from "../../assets/align-left.svg";
import { ReactComponent as AlignRightSVG } from "../../assets/align-right.svg";
import { ReactComponent as AlignCenterSVG } from "../../assets/align-center.svg";
import { ReactComponent as AlignJustifySVG } from "../../assets/Justify.svg";
import { ReactComponent as OutdentSVG } from "../../assets/outdent.svg";
import { ReactComponent as IndentSVG } from "../../assets/indent.svg";

const CLASSNAME_PREFIX =
	"lbn__core__l-editor__toolbar__text-dropdown";

const blockTypeToBlockName = {
	code: "Code Block",
	h1: "Heading H1",
	h2: "Heading H2",
	h3: "Heading H3",
	h4: "Heading H4",
	h5: "Heading H5",
	h6: "Heading H6",
	ol: "Numbered List",
	paragraph: "Normal",
	quote: "Quote",
	ul: "Bulleted List",
	check: "Check List",
};

function BlockOptionsDropdownList({
	editor,
	blockType,
	toolbarRef,
	setShowBlockOptionsDropDown,
}: any) {
	const dropDownRef = useRef(null);

	useEffect(() => {
		const toolbar = toolbarRef.current;
		const dropDown = dropDownRef.current;

		if(toolbar !== null && dropDown !== null) {
			const { top, left } = toolbar.getBoundingClientRect();
			// @ts-ignore
			dropDown.style.top = `${top + 40}px`;
			// @ts-ignore
			dropDown.style.left = `${left}px`;
		}
	}, [dropDownRef, toolbarRef]);

	useEffect(() => {
		const dropDown = dropDownRef.current;
		const toolbar = toolbarRef.current;

		if(dropDown !== null && toolbar !== null) {
			const handle = (event: any) => {
				const target = event.target;

				// @ts-ignore
				if(!dropDown.contains(target) && !toolbar.contains(target)) {
					setShowBlockOptionsDropDown(false);
				}
			};
			document.addEventListener("click", handle);

			return () => {
				document.removeEventListener("click", handle);
			};
		}
	}, [dropDownRef, setShowBlockOptionsDropDown, toolbarRef]);

	const FormatHeading = (headingTag: HeadingTagType) => {
		if(blockType !== headingTag) {
			editor.update(() => {
				const selection = $getSelection();

				if($isRangeSelection(selection)) {
					$wrapNodes(selection, () => $createHeadingNode(headingTag));
				}
			});
		}
		setShowBlockOptionsDropDown(false);
	};

	const formatCheckList = () => {
		if(blockType !== "check") {
			editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
		} else {
			editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
		}
		setShowBlockOptionsDropDown(false);
	};

	return (
		<div
			className={`${CLASSNAME_PREFIX}__dropdown`}
			ref={dropDownRef}
		>
			<button
				className={
					`${CLASSNAME_PREFIX}__item `
					// + (blockType === "paragraph" && `${CLASSNAME_PREFIX}__active`)
				}
				onClick={() => {
					editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
				}}
			>
				<AlignLeftSVG
					className="svg-filter"
					height="1rem"
					width="1rem"
				/>

				<span className={`${CLASSNAME_PREFIX}__text`}>
					Left Align
				</span>
			</button>

			<button
				className={
					`${CLASSNAME_PREFIX}__item `
					// + (blockType === "paragraph" && `${CLASSNAME_PREFIX}__active`)
				}
				onClick={() => {
					editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
				}}
			>
				<AlignCenterSVG
					className="svg-filter"
					height="1rem"
					width="1rem"
				/>

				<span className={`${CLASSNAME_PREFIX}__text`}>
					Center Align
				</span>
			</button>

			<button
				className={
					`${CLASSNAME_PREFIX}__item `
					// + (blockType === "paragraph" && `${CLASSNAME_PREFIX}__active`)
				}
				onClick={() => {
					editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
				}}
			>
				<AlignRightSVG
					className="svg-filter"
					height="1rem"
					width="1rem"
				/>

				<span className={`${CLASSNAME_PREFIX}__text`}>
					Right Align
				</span>
			</button>

			<button
				className={
					`${CLASSNAME_PREFIX}__item `
					// + (blockType === "paragraph" && `${CLASSNAME_PREFIX}__active`)
				}
				onClick={() => {
					editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify");
				}}
			>
				<AlignJustifySVG
					className="svg-filter"
					height="1rem"
					width="1rem"
				/>

				<span className={`${CLASSNAME_PREFIX}__text`}>
					Justify Align
				</span>
			</button>

			{/* <Divider /> */}
{/*
			<button
				className={
					`${CLASSNAME_PREFIX}__item `
					// + (blockType === "paragraph" && `${CLASSNAME_PREFIX}__active`)
				}
				onClick={() => {
					editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined);
				}}
			>
				<i className={"icon " + (isRTL ? "indent" : "outdent")} />

				<OutdentSVG
					className="svg-filter"
					height="1rem"
					width="1rem"
				/>

				<span className={`${CLASSNAME_PREFIX}__text`}>
					Outdent
				</span>
			</button>

			<button
				className={
					`${CLASSNAME_PREFIX}__item `
					// + (blockType === "paragraph" && `${CLASSNAME_PREFIX}__active`)
				}
				onClick={() => {
					editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined);
				}}
			>
				<i className={"icon " + (isRTL ? "outdent" : "indent")} />

				<IndentSVG
					className="svg-filter"
					height="1rem"
					width="1rem"
				/>

				<span className={`${CLASSNAME_PREFIX}__text`}>
					Indent
				</span>
			</button>
             */}
		</div>
	);
}

function AlignmentDropdown({ editor, blockType, toolbarRef }: any) {
	const [showBlockOptionsDropDown, setShowBlockOptionsDropDown] =
		useState(false);

	return (
		<div>
			<button
				className={`${CLASSNAME_PREFIX}__toolbar-item ${CLASSNAME_PREFIX}__block-controls`}
				onClick={() => setShowBlockOptionsDropDown(!showBlockOptionsDropDown)}
				aria-label="Formatting Options"
			>
				<span className={`${CLASSNAME_PREFIX}__text-main`}>
					<AlignLeftSVG
						className="svg-filter"
						height="1rem"
						width="1rem"
					/>
				</span>

				<ChevronDownSVG
					className="svg-filter"
					viewBox="0 0 16 16"
					height="1rem"
					width="1rem"
				/>
			</button>

			{showBlockOptionsDropDown &&
				createPortal(
					<BlockOptionsDropdownList
						editor={editor}
						blockType={blockType}
						toolbarRef={toolbarRef}
						setShowBlockOptionsDropDown={setShowBlockOptionsDropDown}
					/>,
					document.body,
				)}
		</div>
	);
}

export default AlignmentDropdown;
