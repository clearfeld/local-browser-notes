import React from "react";
import "./HeadingsDropdown.scss";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import {
	$getSelection,
	$isRangeSelection,
	$createParagraphNode,
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

import { ReactComponent as H1SVG } from "../../assets/heading_h1.svg";
import { ReactComponent as H2SVG } from "../../assets/heading_h2.svg";
import { ReactComponent as H3SVG } from "../../assets/heading_h3.svg";
import { ReactComponent as H4SVG } from "../../assets/heading_h4.svg";
import { ReactComponent as H5SVG } from "../../assets/heading_h5.svg";
import { ReactComponent as H6SVG } from "../../assets/heading_h6.svg";

import { ReactComponent as BulletListSVG } from "../../assets/ListUL.svg";
import { ReactComponent as NumberListSVG } from "../../assets/ListOl.svg";
import { ReactComponent as CheckListSVG } from "../../assets/checklist.svg";
import { ReactComponent as QuoteSVG } from "../../assets/ChatSquareQuote.svg";
import { ReactComponent as CodeSVG } from "../../assets/Code.svg";

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
	paragraph: "Normal",
	quote: "Quote",
	bullet: "Bulleted List",
	number: "Numbered List",
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
			dropDown.style.top = `${top as number + 40}px`;
			// @ts-ignore
			dropDown.style.left = `${left as number}px`;
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

	const formatParagraph = () => {
		if(blockType !== "paragraph") {
			editor.update(() => {
				const selection = $getSelection();

				if($isRangeSelection(selection)) {
					$wrapNodes(selection, () => $createParagraphNode());
				}
			});
		}
		setShowBlockOptionsDropDown(false);
	};

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

	const formatBulletList = () => {
		if(blockType !== "bullet") {
			editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND);
		} else {
			editor.dispatchCommand(REMOVE_LIST_COMMAND);
		}
		setShowBlockOptionsDropDown(false);
	};

	const formatNumberedList = () => {
		if(blockType !== "number") {
			editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND);
		} else {
			editor.dispatchCommand(REMOVE_LIST_COMMAND);
		}
		setShowBlockOptionsDropDown(false);
	};

	const formatQuote = () => {
		if(blockType !== "quote") {
			editor.update(() => {
				const selection = $getSelection();

				if($isRangeSelection(selection)) {
					// @ts-ignore
					$wrapNodes(selection, () => $createQuoteNode());
				}
			});
		}
		setShowBlockOptionsDropDown(false);
	};

	const formatCode = () => {
		if(blockType !== "code") {
			editor.update(() => {
				const selection = $getSelection();

				if($isRangeSelection(selection)) {
					$wrapNodes(selection, () => $createCodeNode());
				}
			});
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
					`${CLASSNAME_PREFIX}__item ` +
					(blockType === "paragraph" && `${CLASSNAME_PREFIX}__active`)
				}
				onClick={formatParagraph}
			>
				<NormalTextSVG
					className="svg-filter"
					height="1rem"
					width="1rem"
				/>

				<span className={`${CLASSNAME_PREFIX}__text`}>
					Normal
				</span>
			</button>

			<button
				className={
					`${CLASSNAME_PREFIX}__item ` +
					(blockType === "h1" && `${CLASSNAME_PREFIX}__active`)
				}
				onClick={() => FormatHeading("h1")}
			>
				<H1SVG
					className="svg-filter ${CLASSNAME_PREFIX}__heading-svg"
					viewBox="0 0 512.000000 512.000000"
					height="0.875rem"
					width="0.875rem"
				/>

				<span className={`${CLASSNAME_PREFIX}__text`}>
					Heading H1
				</span>
			</button>

			<button
				className={
					`${CLASSNAME_PREFIX}__item ` +
					(blockType === "h2" && `${CLASSNAME_PREFIX}__active`)
				}
				onClick={() => FormatHeading("h2")}
			>
				<H2SVG
					className="svg-filter ${CLASSNAME_PREFIX}__heading-svg"
					viewBox="0 0 512.000000 512.000000"
					height="0.875rem"
					width="0.875rem"
				/>

				<span className={`${CLASSNAME_PREFIX}__text`}>
					Heading H2
				</span>
			</button>

			<button
				className={
					`${CLASSNAME_PREFIX}__item ` +
					(blockType === "h3" && `${CLASSNAME_PREFIX}__active`)
				}
				onClick={() => FormatHeading("h3")}
			>
				<H3SVG
					className="svg-filter ${CLASSNAME_PREFIX}__heading-svg"
					viewBox="0 0 512.000000 512.000000"
					height="0.875rem"
					width="0.875rem"
				/>

				<span className={`${CLASSNAME_PREFIX}__text`}>
					Heading H3
				</span>
			</button>

			<button
				className={
					`${CLASSNAME_PREFIX}__item ` +
					(blockType === "h4" && `${CLASSNAME_PREFIX}__active`)
				}
				onClick={() => FormatHeading("h4")}
			>
				<H4SVG
					className="svg-filter ${CLASSNAME_PREFIX}__heading-svg"
					viewBox="0 0 512.000000 512.000000"
					height="0.875rem"
					width="0.875rem"
				/>

				<span className={`${CLASSNAME_PREFIX}__text`}>
					Heading H4
				</span>
			</button>

			<button
				className={
					`${CLASSNAME_PREFIX}__item ` +
					(blockType === "h5" && `${CLASSNAME_PREFIX}__active`)
				}
				onClick={() => FormatHeading("h5")}
			>
				<H5SVG
					className="svg-filter ${CLASSNAME_PREFIX}__heading-svg"
					viewBox="0 0 512.000000 512.000000"
					height="0.875rem"
					width="0.875rem"
				/>

				<span className={`${CLASSNAME_PREFIX}__text`}>
					Heading H5
				</span>
			</button>

			<button
				className={
					`${CLASSNAME_PREFIX}__item ` +
					(blockType === "h6" && `${CLASSNAME_PREFIX}__active`)
				}
				onClick={() => FormatHeading("h6")}
			>
				<H6SVG
					className="svg-filter ${CLASSNAME_PREFIX}__heading-svg"
					viewBox="0 0 512.000000 512.000000"
					height="0.875rem"
					width="0.875rem"
				/>

				<span className={`${CLASSNAME_PREFIX}__text`}>
					Heading H6
				</span>
			</button>

			<button
				className={
					`${CLASSNAME_PREFIX}__item ` +
					(blockType === "bullet" && `${CLASSNAME_PREFIX}__active`)
				}
				onClick={formatBulletList}
			>
				<BulletListSVG
					className="svg-filter"
					viewBox="0 0 16 16"
					height="1rem"
					width="1rem"
				/>

				<span className={`${CLASSNAME_PREFIX}__text`}>
					Bullet List
				</span>
			</button>

			<button
				className={
					`${CLASSNAME_PREFIX}__item ` +
					(blockType === "number" && `${CLASSNAME_PREFIX}__active`)
				}
				onClick={formatNumberedList}
			>
				<NumberListSVG
					className="svg-filter"
					viewBox="0 0 16 16"
					height="1rem"
					width="1rem"
				/>

				<span className={`${CLASSNAME_PREFIX}__text`}>
					Numbered List
				</span>
			</button>

			<button
				className={
					`${CLASSNAME_PREFIX}__item ` +
					(blockType === "check" && `${CLASSNAME_PREFIX}__active`)
				}
				onClick={formatCheckList}
			>
				<CheckListSVG
					className="svg-filter"
					viewBox="0 0 16 16"
					height="1rem"
					width="1rem"
				/>

				<span className={`${CLASSNAME_PREFIX}__text`}>
					Check List
				</span>
			</button>

			<button
				className={
					`${CLASSNAME_PREFIX}__item ` +
					(blockType === "quote" && `${CLASSNAME_PREFIX}__active`)
				}
				onClick={formatQuote}
			>
				<QuoteSVG
					className="svg-filter"
					viewBox="0 0 16 16"
					height="1rem"
					width="1rem"
				/>

				<span className={`${CLASSNAME_PREFIX}__text`}>
					Quote
				</span>
			</button>

			<button
				className={
					`${CLASSNAME_PREFIX}__item ` +
					(blockType === "code" && `${CLASSNAME_PREFIX}__active`)
				}
				onClick={formatCode}
			>
				<CodeSVG
					className="svg-filter"
					viewBox="0 0 511.997 511.997"
					height="1rem"
					width="1rem"
				/>

				<span className={`${CLASSNAME_PREFIX}__text`}>
					Code Block
				</span>
			</button>
		</div>
	);
}

function BlockOptionsButton({ editor, blockType, toolbarRef }: any) {
	const [showBlockOptionsDropDown, setShowBlockOptionsDropDown] =
		useState(false);

	return (
		<div>
			<button
				className={`${CLASSNAME_PREFIX}__toolbar-item ${CLASSNAME_PREFIX}__block-controls`}
				onClick={() => setShowBlockOptionsDropDown(!showBlockOptionsDropDown)}
				aria-label="Formatting Options"
			>
				{/* <span className={"icon block-type " + blockType} /> */}
				<span className={`${CLASSNAME_PREFIX}__text-main`}>
					{blockType === "root"
						? blockTypeToBlockName["paragraph"]
						// @ts-ignore
						: blockTypeToBlockName[blockType]}
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

export default BlockOptionsButton;
