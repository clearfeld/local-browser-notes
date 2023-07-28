import React, { useEffect, useLayoutEffect, useState } from "react";

import "./NotesView.scss";

import {
	useParams,
	Link,
} from "react-router-dom";

import { useRecoilValue, useSetRecoilState } from "recoil";
import { T_CountStateData, T_SetCountStateData, CountStateData } from "@store/CountAtom";

import { lbn_idb__delete_note, lbn_idb__get_notes, lbn_idb_open } from "@src/indexdb-helpers";

function NotesView() {
	// const getCountState: T_CountStateData = useRecoilValue(CountStateData);
	// const setCountState: T_SetCountStateData = useSetRecoilState(CountStateData);

	const params = useParams();

	const [notes, setNotes] = useState([]);

	useEffect(() => {
		console.log("a", params);
		GetNotes();
	}, []);

	function GetNotes() {
		// TODO: if id 0 otherwise pass in the param
		lbn_idb__get_notes(null)
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
				{notes.map((note: any, nidx: number) => {
					return (
						<Link
						key={nidx}
						to={`${window.location.protocol}//${window.location.host}/#/note/${note.id}`}
						relative="path"
						>
							<div
								onContextMenu={(e) => {
									e.preventDefault();

									console.log("Show cust context menu");

									lbn_idb__delete_note(note.id)
										.then((res) => {
											console.log(res);
										})
										.catch((err) => {
											console.error("TODO: error logging", err);
										});
								}}
							>
								<div className="notes-view__note-block__wrapper">
									<div>{note.title}</div>
								</div>

								<div>{note.title}</div>
							</div>
						</Link>
					);
				})}
			</div>
		</div>
	);
}

export default NotesView;
