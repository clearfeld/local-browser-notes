import React, { useEffect, useRef, useState } from "react";

import "./NotesView.scss";

import { Link } from "react-router-dom";

import { useRecoilValue, useSetRecoilState } from "recoil";
import { T_CountStateData, T_SetCountStateData, CountStateData } from "@store/CountAtom";

import { I_Note, lbn_idb__delete_note } from "@src/indexdb-helpers";

import { ReactComponent as VertMoreSVG } from "@src/components/editor/assets/more-fill.svg";

interface I_NoteProps {
	note: I_Note;
	DuplicateNote: (note: I_Note) => void;
	DeleteNote: (note_id: number) => void;
}

interface I_NoteMenuProps {
	note: I_Note;
	DuplicateNote: (note: I_Note) => void;
	DeleteNote: (note_id: number) => void;
}

function NoteMenu(props: I_NoteMenuProps) {
	function DuplicateNote(e: any): void {
		props.DuplicateNote(props.note);
	}

	function DeleteNote(e: any): void {
		props.DeleteNote(parseInt(props.note.id));
	}

	return (
		<div className="notes-view__note-block__menu__wrapper">
			{/**
			 * TODO: move note to different folder - needs modal
			 */}

			<div
				className="notes-view__note-block__menu__btn"
				onClick={DuplicateNote}
				role="button"
				tabIndex={0}
			>
				Duplicate Note
			</div>

			<hr className="notes-view__note-block__menu__divider" />

			<div
				className="notes-view__note-block__menu__btn"
				onClick={DeleteNote}
				role="button"
				tabIndex={0}
			>
				Delete Note
			</div>
		</div>
	);
}

function Note(props: I_NoteProps) {
	// useEffect(() => {
	// }, []);

	const blockRef = useRef(null);

	const [showMenu, setShowMenu] = useState<boolean>(false);

	useEffect(() => {
		document.addEventListener("click", handleClickOutside, false);

		return () => {
			document.removeEventListener("click", handleClickOutside, false);
		};
	}, []);

	function handleClickOutside(event: any) {
		// @ts-ignore
		if (blockRef.current && !blockRef.current.contains(event.target)) {
			setShowMenu(false);
		}
	}

	function ToggleMenu(e: any): void {
		e.preventDefault();

		setShowMenu(true);
	}

	return (
		<>
			<Link
				to={`${window.location.protocol}//${window.location.host}/note/${props.note.id}`}
				// relative="path"
				ref={blockRef}
				className="notes-view__note-block__link"
			>
				<div>
					<div className="notes-view__note-block__wrapper">
						<div className="notes-view__note-block__top-line">
							<div>{props.note.title}</div>

							<div
								className="notes-view__note-block__menu-btn"
								onClick={ToggleMenu}
								role="button"
								tabIndex={0}
							>
								<VertMoreSVG
									className="svg-filter"
									viewBox="0 0 24 24"
									height="2rem"
									width="2rem"
								/>
							</div>
						</div>
					</div>

					{/* <div>{props.note.created_date}</div>
					<div>{props.note.last_updated_date}</div> */}
				</div>
			</Link>

			{showMenu && (
				<NoteMenu
					note={props.note}
					DuplicateNote={props.DuplicateNote}
					DeleteNote={props.DeleteNote}
				/>
			)}
		</>
	);
}

export default Note;
