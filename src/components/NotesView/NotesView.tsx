import React, { useEffect, useLayoutEffect, useState } from "react";

import "./NotesView.scss";

import { useParams, useNavigate } from "react-router-dom";

import { useRecoilValue, useSetRecoilState } from "recoil";
import { T_CountStateData, T_SetCountStateData, CountStateData } from "@store/CountAtom";

import { ReactComponent as NewNoteSVG } from "@src/components/editor/assets/file-add-line.svg";
// import { ReactComponent as ArrowClockwiseSVG } from "../assets/ArrowClockwise.svg";

import {
	I_Note,
	lbn_idb__delete_note,
	lbn_idb__get_notes,
	lbn_idb__save_note,
	lbn_idb_open,
} from "@src/indexdb-helpers";

import Note from "@src/components/NotesView/Note";

function NotesView() {
	// const getCountState: T_CountStateData = useRecoilValue(CountStateData);
	// const setCountState: T_SetCountStateData = useSetRecoilState(CountStateData);

	const params = useParams();
	const navigate = useNavigate();

	const [notes, setNotes] = useState([]);

	useEffect(() => {
		console.log("a", params);
		GetNotes();
	}, [params]);

	function GetNotes(): void {
		// TODO: if id 0 otherwise pass in the param
		// @ts-ignore
		lbn_idb__get_notes(parseInt(params.id))
			.then((res) => {
				console.log(res);
				setNotes(res);
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

				const new_notes_state = [...notes];
				nobj.id = res.id;
				console.log(nobj);

				// @ts-ignore
				new_notes_state.push(nobj as I_Note);

				setNotes(new_notes_state);
			})
			.catch((err) => {
				console.error(err);
			});
	}

	function DeleteNote(note_id: number): void {
		lbn_idb__delete_note(note_id)
			.then((res) => {
				console.log("Delete note - ", note_id);

				const new_notes_state = [...notes];
				// console.log(new_notes_state);

				for (let i = 0; i < notes.length; ++i) {
					// @ts-ignore
					if (new_notes_state[i].id === note_id) {
						new_notes_state.splice(i, 1);
					}
				}

				// console.log(new_notes_state);

				setNotes(new_notes_state);
			})
			.catch((err) => {
				console.error("TODO: error logging", err);
			});
	}

	function NewNote(e: any): void {
		navigate(`/new-note/${params.id}`);
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

			<div className="notes-view__note-grid">
				{notes.map((note: I_Note, _nidx: number) => {
					return (
						<Note key={note.id} note={note} DuplicateNote={DuplicateNote} DeleteNote={DeleteNote} />
					);
				})}
			</div>
		</div>
	);
}

export default NotesView;
