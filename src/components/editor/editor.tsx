import React, { useEffect, useState, useRef } from "react";

import "./editor.scss";

import CCLEditor from "./Lexical/Editor";
import { lbn_idb__save_note } from "@src/indexdb-helpers";

function Editor() {
	const ccDraftRef = useRef(null);
	const ccEditorToolbarLocationRef = useRef(null);

	const toolbarRef = useRef<HTMLDivElement>(null);

	const [domReady, setDomReady] = useState(false);

	const [expanded, setExpanded] = useState(false);

	const [noteName, setNoteName] = useState<string>("");

	// TODO(clearfeld): important if new note route no id on start but after first save update
	// if old note pull in useEffect the id and ensure its set before doing anything
	const noteIDRef = useRef<number | null>(null);

	useEffect(() => {
		setDomReady(true);

		document.addEventListener("keydown", SaveHijack);

		return () => {
			document.removeEventListener("keydown", SaveHijack);
		};
	}, [noteName]); // TODO: clean this up later

	function SaveHijack(e: any) {
		if (e.ctrlKey && e.key === "s") {
			// Prevent the Save dialog to open
			e.preventDefault();
			// Place your code here
			// console.log("CTRL + S");

			if (ccDraftRef.current) {
				// TODO: clean up later and do proper types and interfaces
				// @ts-ignore
				// console.log(ccDraftRef.current.GetEditorContent());

				const note_content = ccDraftRef.current.GetEditorContent();

				console.log(noteName);
				// console.log("NOTEID - ", noteIDRef.current);

				if (noteIDRef.current === null) {
					const nobj: any = {
						// id: noteID,
						title: noteName,
						summary: "", // TODO:
						tags: [], // TODO:
						content: note_content,
					};

					lbn_idb__save_note(nobj)
						.then((res: any) => {
							// console.log(res);
							noteIDRef.current = res.id;
						})
						.catch((err) => {
							console.error(err);
						});
				} else {
					const nobj: any = {
						id: noteIDRef.current,
						title: noteName,
						summary: "", // TODO:
						tags: [], // TODO:
						content: note_content,
					};

					lbn_idb__save_note(nobj)
						.then((res: any) => {
							// console.log(res);
							// setNoteID(res.id);
						})
						.catch((err) => {
							console.error(err);
						});
				}
			}
		}
	}

	return (
		<div>
			<div
				id="lbn__Core__KnowledgeBase__Editor__Toolbar__Portal"
				ref={ccEditorToolbarLocationRef}
			/>

			<div className={"lbn__core__knowledge-base__article-new__article-wrapper "}>
				<div
					className={
						"lbn__core__knowledge-base__article-new__article-wrapper-constrained-view " +
						(!expanded
							? "lbn__core__knowledge-base__article-new__article-wrapper-constrained-view__active"
							: "lbn__core__knowledge-base__article-new__article-wrapper-constrained-view__full-width")
					}
				>
					<div>
						<input
							className="lbn__core__knowledge-base__article-new__input"
							id="note-name"
							name="note-name"
							type="text"
							value={noteName}
							onChange={(e) => {
								setNoteName(e.target.value);
							}}
							placeholder="Note title"
						/>
					</div>

					<hr
						style={{
							border: "none",
							borderTop: "0.0625rem solid var(--color-border)",
						}}
					/>

					{domReady && (
						<div>
							<CCLEditor
								value={null}
								PatchContent={null}
								editable={true} // : boolean;
								setEditable={null} // : Function | null;
								showToolbar={true} // : boolean;
								placeholder={""} // : string;
								// tells us whether the view is default expanded or not

								expanded={expanded}
								ExpandToggle={setExpanded}
								ref={ccDraftRef}
								toolbarRef={ccEditorToolbarLocationRef}
								affirmateAction={() => {
									null;
								}} // : () => void;
							/>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default Editor;
