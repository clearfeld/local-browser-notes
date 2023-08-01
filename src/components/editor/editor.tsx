import React, { useEffect, useState, useRef, SyntheticEvent } from "react";

import "./editor.scss";

import { useParams } from "react-router-dom";

import CCLEditor from "./Lexical/Editor";
import { lbn_idb__get_note, lbn_idb__save_note } from "@src/indexdb-helpers";

function Editor() {
	const params = useParams();

	const ccDraftRef = useRef(null);
	const ccEditorToolbarLocationRef = useRef(null);

	// const toolbarRef = useRef<HTMLDivElement>(null);

	const [domReady, setDomReady] = useState(false);

	const [expanded, setExpanded] = useState(false);

	const [noteName, setNoteName] = useState<string>("");

	const [note, setNote] = useState<any>(null);

	const [noteContent, setNoteContent] = useState<string | null>(null);

	// TODO(clearfeld): important if new note route no id on start but after first save update
	// if old note pull in useEffect the id and ensure its set before doing anything
	const noteIDRef = useRef<number | null>(null);

	useEffect(() => {
		document.addEventListener("keydown", SaveHijack);

		if (!domReady) {
			AttemptToFetchNote()
				.then((res) => {
					console.log(res);
					setDomReady(true);
				})
				.catch((err) => {
					console.log(err);
				});
		}

		return () => {
			document.removeEventListener("keydown", SaveHijack);
		};
	}, [noteName]);
	//[noteName, noteContent]); // TODO: clean this up later

	async function AttemptToFetchNote() {
		if (params.note_id) {
			const note_id = parseInt(params.note_id);
			const note = await lbn_idb__get_note(note_id);

			console.log("Note - ", note);

			if (note) {
				noteIDRef.current = parseInt(note.id);
				setNoteName(note.title);
				setNoteContent(note.content);

				setNote(note);
			}

			// return note;
		}
		// else {
		//  TODO: have better checks for if params id exists or not and whether or not the note was actually fetched
		// 	return null;
		// }
	}

	function SaveHijack(e: KeyboardEvent) {
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

				console.log(noteName, params, noteIDRef.current);

				// console.log("NOTEID - ", noteIDRef.current);

				// if(noteContent === null && noteIDRef) {
				// 	return;
				// }

				// 				console.log(noteIDRef.current, params.parent_id);

				// 				if(note === null) {
				// 					console.log("NOTE - ", note);
				// 				} else {
				// 					console.log("NOTE - ", note);
				// 				}
				// return

				if (noteIDRef.current === null && params.parent_id !== undefined) {
					const nobj: any = {
						// id: noteID,
						title: noteName,
						folder_parent_id: parseInt(params.parent_id),
						summary: "", // TODO:
						tags: [], // TODO:
						content: note_content,
						created_date: new Date().valueOf(),
						last_updated_date: new Date().valueOf(),
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
						folder_parent_id: note.folder_parent_id, // TODO: FIXME: should save note details abvove and re-use the needed bits --- params.parent_id,
						summary: "", // TODO:
						tags: [], // TODO:
						content: note_content,
						created_date: note.created_date,
						last_updated_date: new Date().valueOf(),
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
								value={noteContent}
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
