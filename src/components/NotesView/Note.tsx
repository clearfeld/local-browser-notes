import React, { useEffect, useRef, useState } from "react";

import "./NotesView.scss";

import { Link } from "react-router-dom";

import { useRecoilValue, useSetRecoilState } from "recoil";
import { T_CountStateData, T_SetCountStateData, CountStateData } from "@store/CountAtom";

import { I_Note, lbn_idb__delete_note } from "@src/indexdb-helpers";

import { ReactComponent as VertMoreSVG } from "@src/components/editor/assets/more-fill.svg";
import CCLEditor from "../editor/Lexical/Editor";

interface I_NoteProps {
	note: I_Note;
	DuplicateNote: (note: I_Note) => void;
	DeleteNote: (note_id: number) => void;
}

interface I_NoteMenuProps {
	note: I_Note;
	DuplicateNote: (note: I_Note) => void;
	DeleteNote: (note_id: number) => void;

	CloseMenu: () => void;
}

interface I_LastUpdatedDateProps {
	date: number;
}

function NoteMenu(props: I_NoteMenuProps) {
	function DuplicateNote(e: any): void {
		e.preventDefault();
		e.stopPropagation();

		props.DuplicateNote(props.note);

		props.CloseMenu();
	}

	function DeleteNote(e: any): void {
		e.preventDefault();
		e.stopPropagation();

		props.DeleteNote(parseInt(props.note.id));

		props.CloseMenu();
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

function LastUpdatedDate(props: I_LastUpdatedDateProps) {
	const d = new Date(props.date);

	function ConstructTimeString(): string {
		let meridiam = "AM";
		let hours = d.getHours();
		if (hours > 12) {
			hours -= 12;
			meridiam = "PM";
		}
		if (hours === 0) {
			hours = 12;
		}

		const minutes = d.getMinutes();
		let minutes_str = minutes.toString();
		if (minutes < 10) {
			minutes_str = "0" + minutes.toString();
		}

		return `${hours}:${minutes_str} ${meridiam}`;
	}

	return (
		<div>
			<p className="notes-view__note-block__last-update-text">
				{ConstructTimeString()} - {d.getDate()}/{d.getMonth()}/{d.getFullYear()}
			</p>
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
			CloseMenu();
		}
	}

	function CloseMenu(): void {
		setShowMenu(false);
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

						<div
							style={{
								scale: "0.8",
								marginTop: "-1.75rem",
								marginLeft: "-0.625rem",
							}}
							className={"lbn_editor_preview_target"}
						>
							<CCLEditor
								value={props.note.summary}
								SetModRefTrue={null}
								PatchContent={null}
								editable={false} // : boolean;
								setEditable={null} // : Function | null;
								showToolbar={false} // : boolean;
								placeholder={""} // : string;
								// tells us whether the view is default expanded or not

								expanded={true}
								ExpandToggle={() => {
									null;
								}}
								ref={null}
								toolbarRef={null}
								affirmateAction={() => {
									null;
								}}
							/>
						</div>
					</div>

					{/* <div>{props.note.created_date}</div> */}
					<LastUpdatedDate date={props.note.last_updated_date} />
				</div>

				{showMenu && (
					<NoteMenu
						note={props.note}
						DuplicateNote={props.DuplicateNote}
						DeleteNote={props.DeleteNote}
						CloseMenu={CloseMenu}
					/>
				)}
			</Link>
		</>
	);
}

export default Note;
