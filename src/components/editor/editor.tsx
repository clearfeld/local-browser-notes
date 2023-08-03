import React, { useEffect, useState, useRef, SyntheticEvent } from "react";

import "./editor.scss";

import { useLocation, useNavigate, useParams } from "react-router-dom";

import CCLEditor from "./Lexical/Editor";
import { I_Note, lbn_idb__get_note, lbn_idb__save_note } from "@src/indexdb-helpers";

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

	const noteRef = useRef<I_Note | null>(null);

	const location = useLocation();

	useEffect(() => {
		document.addEventListener("keydown", SaveHijack);

		if (!domReady) {
			AttemptToFetchNote()
				.then((res) => {
					// console.log(res);
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

	useEffect(() => {
		let cur_href: any = null;
		if (cur_href === null) {
			cur_href = window.location.href;
		}

		const cur_ccdf = ccDraftRef.current;

		// console.log(cur_href, window.location.href);

		// @ts-ignore
		// console.log(cur_ccdf, cur_ccdf?.GetEditorContent());

		window.addEventListener("beforeunload", AttemptAutoSave);

		return () => {
			// console.log("CLEAN - ", cur_href, window.location.href);

			window.removeEventListener("beforeunload", AttemptAutoSave);

			// AttemptAutoSave();
			if (cur_href !== window.location.href) {
				// TODO: leave for more navigation leave testing combos
				// // @ts-ignore
				// console.log("AAAAAAAAAAAAAA", cur_ccdf?.GetEditorContent());
				// // eslint-disable-next-line no-debugger
				// debugger;

				// @ts-ignore
				if (cur_ccdf?.GetEditorContent() !== "null") {
					AutoSaveProcess(cur_ccdf);
				}
			}
		};
	}, [window.location.href, ccDraftRef.current, noteName, domReady]);

	function AttemptAutoSave() {
		// console.log("Attempt AutoSave");

		// TODO: leave for more navigation leave testing combos
		// // @ts-ignore
		// console.log("AAAAAAAAAAAAAA", ccDraftRef.current.GetEditorContent());
		// // eslint-disable-next-line no-debugger
		// debugger;

		// @ts-ignore
		if (ccDraftRef.current.GetEditorContent() !== "null") {
			AutoSaveProcess(ccDraftRef.current);
		}
	}

	async function AttemptToFetchNote() {
		if (params.note_id) {
			const note_id = parseInt(params.note_id);
			const note = await lbn_idb__get_note(note_id);

			// console.log("Note - ", note);

			if (note) {
				noteIDRef.current = parseInt(note.id);
				setNoteName(note.title);
				setNoteContent(note.content);

				setNote(note);
				noteRef.current = note;
			}

			// return note;
		}
		// else {
		//  TODO: have better checks for if params id exists or not and whether or not the note was actually fetched
		// 	return null;
		// }
	}

	function AutoSaveProcess(cur_ccdf: any): void {
		// console.log("Here", cur_ccdf);

		if (cur_ccdf) {

			// @ts-ignore
			const note_content = cur_ccdf.GetEditorContent();
			// @ts-ignore
			const note_summary = cur_ccdf.GetSummaryContentOfState();

			// console.log(noteName, params, noteIDRef.current);

			if (noteIDRef.current === null && params.parent_id !== undefined) {
				const nobj: any = {
					// id: noteID,
					title: noteName === "" ? "Untitled" : noteName,
					folder_parent_id: parseInt(params.parent_id),
					summary: note_summary,
					tags: [], // TODO:
					content: note_content,
					created_date: new Date().valueOf(),
					last_updated_date: new Date().valueOf(),
				};

				// console.log(nobj);
				// return;

				lbn_idb__save_note(nobj)
					.then((res: any) => {
						// console.log(res);
						noteIDRef.current = res.id;

						if (params.parent_id) {
							noteRef.current = {
								id: res.id,
								title: noteName === "" ? "Untitled" : noteName,
								folder_parent_id: params.parent_id.toString(),
								summary: note_summary,
								tags: [], // TODO:
								content: note_content,
								created_date: new Date().valueOf(),
								last_updated_date: new Date().valueOf(),
							};
						}
					})
					.catch((err) => {
						console.error(err);
					});
			} else {
				if (noteRef.current) {
					const nobj: any = {
						id: noteIDRef.current,
						title: noteName,
						folder_parent_id: noteRef.current.folder_parent_id,
						summary: note_summary,
						tags: [], // TODO:
						content: note_content,
						created_date: note.created_date,
						last_updated_date: new Date().valueOf(),
					};

					// console.log("ELSE - ", nobj);
					// return;

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

	function SaveHijack(e: KeyboardEvent) {
		// if(e.ctrlKey) {
		// 	if (ccDraftRef.current) {
		// 		// @ts-ignore
		// 		ccDraftRef.current.GetSummaryContentOfState();
		// 	}
		// }
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
				// @ts-ignore
				const note_summary = ccDraftRef.current.GetSummaryContentOfState();

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
						summary: note_summary,
						tags: [], // TODO:
						content: note_content,
						created_date: new Date().valueOf(),
						last_updated_date: new Date().valueOf(),
					};

					lbn_idb__save_note(nobj)
						.then((res: any) => {
							// console.log(res);
							noteIDRef.current = res.id;

							if (params.parent_id) {
								noteRef.current = {
									id: res.id,
									title: noteName,
									folder_parent_id: params.parent_id.toString(),
									summary: note_summary,
									tags: [], // TODO:
									content: note_content,
									created_date: new Date().valueOf(),
									last_updated_date: new Date().valueOf(),
								};
							}
						})
						.catch((err) => {
							console.error(err);
						});
				} else {
					if (noteRef.current) {
						const nobj: any = {
							id: noteIDRef.current,
							title: noteName,
							folder_parent_id: noteRef.current.folder_parent_id,
							summary: note_summary,
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
