import React from "react";

import "./FloatingLinkEditor.scss";

import { useCallback, useEffect, useRef, useState } from "react";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import { mergeRegister } from "@lexical/utils";
import { $isAtNodeEnd } from "@lexical/selection";
import {
	SELECTION_CHANGE_COMMAND,
	$getSelection,
	$isRangeSelection,
} from "lexical";

import { ReactComponent as EditSVG } from "../../assets/Edit.svg";

const CLASSNAME_PREFIX = "lbn__core__l-editor__f-link-editor";

const LowPriority = 1;

function getSelectedNode(selection: any) {
	const anchor = selection.anchor;
	const focus = selection.focus;
	const anchorNode = selection.anchor.getNode();
	const focusNode = selection.focus.getNode();
	if(anchorNode === focusNode) {
		return anchorNode;
	}
	const isBackward = selection.isBackward();
	if(isBackward) {
		return $isAtNodeEnd(focus) ? anchorNode : focusNode;
	} else {
		return $isAtNodeEnd(anchor) ? focusNode : anchorNode;
	}
}

function positionEditorElement(editor: any, rect: any) {
	if(rect === null) {
		editor.style.opacity = "0";
		editor.style.top = "-1000px";
		editor.style.left = "-1000px";
	} else {
		editor.style.opacity = "1";
		editor.style.top = `${rect.top + rect.height + window.pageYOffset + 10}px`;
		editor.style.left = `${
			rect.left + window.pageXOffset - editor.offsetWidth / 2 + rect.width / 2
		}px`;
	}
}

function FloatingLinkEditor({ editor }: any) {
	const editorRef = useRef(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const mouseDownRef = useRef(false);
	const [linkUrl, setLinkUrl] = useState("");
	const [isEditMode, setEditMode] = useState(false);
	const [lastSelection, setLastSelection] = useState(null);

	const updateLinkEditor = useCallback(() => {
		const selection = $getSelection();
		if($isRangeSelection(selection)) {
			const node = getSelectedNode(selection);
			const parent = node.getParent();
			if($isLinkNode(parent)) {
				setLinkUrl(parent.getURL());
			} else if($isLinkNode(node)) {
				setLinkUrl(node.getURL());
			} else {
				setLinkUrl("");
			}
		}
		const editorElem = editorRef.current;
		const nativeSelection = window.getSelection();
		const activeElement = document.activeElement;

		if(editorElem === null) {
			return;
		}

		const rootElement = editor.getRootElement();
		if(
			selection !== null &&
			nativeSelection &&
			!nativeSelection.isCollapsed &&
			rootElement !== null &&
			rootElement.contains(nativeSelection.anchorNode)
		) {
			const domRange = nativeSelection.getRangeAt(0);
			let rect;
			if(nativeSelection.anchorNode === rootElement) {
				let inner = rootElement;
				while(inner.firstElementChild != null) {
					inner = inner.firstElementChild;
				}
				rect = inner.getBoundingClientRect();
			} else {
				rect = domRange.getBoundingClientRect();
			}

			if(!mouseDownRef.current) {
				positionEditorElement(editorElem, rect);
			}

			// @ts-ignore
			setLastSelection(selection);
		} else if(!activeElement || activeElement.className !== "link-input") {
			positionEditorElement(editorElem, null);
			setLastSelection(null);
			setEditMode(false);
			setLinkUrl("");
		}

		return true;
	}, [editor]);

	useEffect(() => {
		return mergeRegister(
			editor.registerUpdateListener(({ editorState }: any) => {
				editorState.read(() => {
					updateLinkEditor();
				});
			}),

			editor.registerCommand(
				SELECTION_CHANGE_COMMAND,
				() => {
					updateLinkEditor();
					return true;
				},
				LowPriority,
			),
		);
	}, [editor, updateLinkEditor]);

	useEffect(() => {
		editor.getEditorState().read(() => {
			updateLinkEditor();
		});
	}, [editor, updateLinkEditor]);

	useEffect(() => {
		if(isEditMode && inputRef.current) {
			inputRef.current.focus();
		}
	}, [isEditMode]);

	return (
		<div
			ref={editorRef}
			className={`${CLASSNAME_PREFIX}__link-editor`}
		>
			{isEditMode ? (
				<input
					ref={inputRef}
					className={`${CLASSNAME_PREFIX}__link-input`}
					value={linkUrl}
					onChange={(event) => {
						setLinkUrl(event.target.value);
					}}
					onKeyDown={(event) => {
						if(event.key === "Enter") {
							event.preventDefault();
							if(lastSelection !== null) {
								if(linkUrl !== "") {
									editor.dispatchCommand(TOGGLE_LINK_COMMAND, linkUrl);
								}
								setEditMode(false);
							}
						} else if(event.key === "Escape") {
							event.preventDefault();
							setEditMode(false);
						}
					}}
				/>
			) : (
				<>
					<div className={`${CLASSNAME_PREFIX}__link-input`}>
						<a
							href={linkUrl}
							target="_blank"
							rel="noopener noreferrer"
						>
							{linkUrl}
						</a>

						<div
							className={`${CLASSNAME_PREFIX}__link-edit`}
							role="button"
							tabIndex={0}
							onMouseDown={(event) => event.preventDefault()}
							onClick={() => {
								setEditMode(true);
							}}
						>
							<EditSVG
								className="svg-filter"
								viewBox="0 0 485.219 485.22"
								height="1rem"
								width="1rem"
							/>
						</div>
					</div>
				</>
			)}
		</div>
	);
}

export default FloatingLinkEditor;
