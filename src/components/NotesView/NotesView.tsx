import React, { useEffect, useLayoutEffect, useState } from "react";

import "./NotesView.scss";

import {
	useParams,
} from "react-router-dom";

import { useRecoilValue, useSetRecoilState } from "recoil";
import { T_CountStateData, T_SetCountStateData, CountStateData } from "@store/CountAtom";

import { lbn_idb__delete_note, lbn_idb__get_notes, lbn_idb_open } from "@src/indexdb-helpers";

import Note from "@src/components/NotesView/Note";

function NotesView() {
	// const getCountState: T_CountStateData = useRecoilValue(CountStateData);
	// const setCountState: T_SetCountStateData = useSetRecoilState(CountStateData);

	const params = useParams();

	const [notes, setNotes] = useState([]);

	useEffect(() => {
		console.log("a", params);
		GetNotes();
	}, [params]);

	function GetNotes() {
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

	return (
		<div>
			<div className="notes-view__note-grid">
				{notes.map((note: any, _nidx: number) => {
					return (
						<Note
							key={note.id}
							note={note}
						/>
					);
				})}
			</div>
		</div>
	);
}

export default NotesView;
