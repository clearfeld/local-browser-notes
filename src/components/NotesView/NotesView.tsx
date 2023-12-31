import React, { useEffect, useState } from "react";

import "./NotesView.scss";

import { useParams, useNavigate } from "react-router-dom";

import { useRecoilValue, useSetRecoilState } from "recoil";

import {
	T_SetNotesStateData,
	NotesStateData
} from "@store/NotesAtom";

import { ReactComponent as NewNoteSVG } from "@src/components/editor/assets/file-add-line.svg";
import { ReactComponent as FolderSVG } from "@src/components/editor/assets/folder.svg";

import {
	I_Note,
	lbn_idb__delete_note,
	lbn_idb__get_notes,
	lbn_idb__save_note,
} from "@src/indexdb-helpers";

import Note from "@src/components/NotesView/Note";

function NotesView() {
	const getNotesState = useRecoilValue(NotesStateData);
	const setNotesState: T_SetNotesStateData = useSetRecoilState(NotesStateData);

	const params = useParams();
	const navigate = useNavigate();

	// const [notes, setNotes] = useState<I_Note[]>([]);

	const [noteFetchAttemptCompleted, setBoteFetchAttemptCompleted] = useState<boolean>(false);

	useEffect(() => {
		GetNotes();
	}, [params]);

	function GetNotes(): void {
		let folder_id = null;
		if (params.id === "0" || params.id === undefined) {
			// console.log();
			// TODO: if id 0 otherwise pass in the param
		} else {
			folder_id = parseInt(params.id);
		}

		// @ts-ignore
		lbn_idb__get_notes(folder_id)
			.then((res) => {
				// console.log(res);
				setNotesState(res as I_Note[]);
				setBoteFetchAttemptCompleted(true);
			})
			.catch((err) => {
				console.error(err);
			});
	}

	function DuplicateNote(note: I_Note): void {
		console.log("Duplicate note", note);

		const nobj: any = {
			// id: noteID,
			title: note.title + " - Copy",
			folder_parent_id: note.folder_parent_id,
			summary: note.summary,
			tags: [...note.tags],
			content: note.content,
			created_date: new Date().valueOf(),
			last_updated_date: new Date().valueOf(),
		};

		lbn_idb__save_note(nobj)
			.then((res: any) => {
				console.log("Dupe note - ", res);

				const new_notes_state = [...getNotesState];
				nobj.id = res.id;
				console.log(nobj);

				// @ts-ignore
				new_notes_state.push(nobj as I_Note);

				setNotesState(new_notes_state);
			})
			.catch((err) => {
				console.error(err);
			});
	}

	function DeleteNote(note_id: number): void {
		lbn_idb__delete_note(note_id)
			.then((res) => {
				console.log("Delete note - ", note_id);

				const new_notes_state = [...getNotesState];
				// console.log(new_notes_state);

				for (let i = 0; i < getNotesState.length; ++i) {
					// @ts-ignore
					if (new_notes_state[i].id === note_id) {
						new_notes_state.splice(i, 1);
					}
				}

				// console.log(new_notes_state);

				setNotesState(new_notes_state);
			})
			.catch((err) => {
				console.error("TODO: error logging", err);
			});
	}

	function NewNote(e: any): void {
		if (params.id !== undefined) {
			navigate(`/new-note/${params.id}`);
		} else {
			navigate(`/new-note/0`);
		}
	}

	// TODO: should use virtualization for the list

	return (
		<div>
			<div className="notes-view__toolbar__wrapper">
				<div
					onClick={NewNote}
					role="button"
					tabIndex={0}
					title="New Note"
					className="notes-view__toolbar__btn"
				>
					<NewNoteSVG className="svg-filter" viewBox="0 0 24 24" height="1rem" width="1rem" />
				</div>
			</div>

			{noteFetchAttemptCompleted && (
				<>
					{getNotesState.length > 0 ? (
						<div className="notes-view__note-grid">
							{getNotesState.map((note: I_Note, _nidx: number) => {
								return (
									<Note
										key={note.id}
										note={note}
										DuplicateNote={DuplicateNote}
										DeleteNote={DeleteNote}
									/>
								);
							})}
						</div>
					) : (
						<div className="notes-view__empty-folder">
							<FolderSVG className="svg-filter" viewBox="0 0 24 24" height="2rem" width="2rem" />

							<p>Empty folder - Add a note</p>
						</div>
					)}
				</>
			)}
		</div>
	);
}

export default NotesView;
