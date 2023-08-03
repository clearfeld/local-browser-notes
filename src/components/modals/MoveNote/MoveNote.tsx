import React, { useEffect, useRef, useState } from "react";

import "./MoveNote.scss";

import { useRecoilValue, useSetRecoilState } from "recoil";
import {
	T_ModalStateData, //
	T_SetModalStateData,
	E_MODALS_NAME,
	ModalStateData,
} from "@store/ModalStateAtom";

import {
	// T_ModalStateData,
	T_SetObjectSelectionStateData,
	ObjectSelectionStateData,
	E_OBJECT_TYPE,
} from "@store/ObjectSelection";

import { T_SetNotesStateData, NotesStateData } from "@store/NotesAtom";

import { T_SetFoldersStateData, FoldersStateData } from "../../../store/FoldersAtom";

import { ReactComponent as CloseSVG } from "../../editor/assets/CloseBold.svg";
import { I_Folder, I_Note, lbn_idb__save_note, lbn_idb_delete } from "@src/indexdb-helpers";
import { useParams } from "react-router-dom";

function MoveNote() {
	const wrapperRef = useRef<any>(null);

    const params: any = useParams();

	const [selectedFolder, setSelectedFolder] = useState<string | null>(null);

	const getObjectSelectionState = useRecoilValue(ObjectSelectionStateData);
	const setObjectSelectionState: T_SetObjectSelectionStateData =
		useSetRecoilState(ObjectSelectionStateData);

	const getNotesState = useRecoilValue(NotesStateData);
	const setNotesState: T_SetNotesStateData = useSetRecoilState(NotesStateData);

	const getFoldersState = useRecoilValue(FoldersStateData);

	const modalState: T_ModalStateData = useRecoilValue(ModalStateData);
	const setModalState: T_SetModalStateData = useSetRecoilState(ModalStateData);

	useEffect(() => {
		document.addEventListener("click", handleClickOutside, false);

		return () => {
			document.removeEventListener("click", handleClickOutside, false);
		};
	}, []);

	function handleClickOutside(event: any): void {
		if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
			CloseModal();
		}
	}

	function AttemptToMoveNote() {
		if (getObjectSelectionState.objects !== null && selectedFolder !== null) {
			// @ts-ignore
			const nobj: I_Note = { ...getObjectSelectionState.objects[0] };
			console.log(nobj);
			nobj.folder_parent_id = selectedFolder;
			console.log(nobj);

			lbn_idb__save_note(nobj)
				.then((res: any) => {
					console.log(res);

                    const notes_view_folder_id = parseInt(params.id);
                    const new_state = [...getNotesState];
                    for(let i = 0; i < new_state.length; ++i) {
                        if(new_state[i].id === nobj.id) {
                            if(notes_view_folder_id !== 0) {
                                new_state.splice(i, 1);
                            } else {
                                new_state[i] = { ...nobj };
                            }

                            break;
                        }
                    }
                    setNotesState(new_state);

					CloseModal();
				})
				.catch((err: any) => {
					console.log(err);
				});
		}
	}

	function CloseModal(): void {
		setObjectSelectionState({
			object_type: E_OBJECT_TYPE.NONE,
			objects: null,
		});

		setModalState({
			showModal: false,
			modalString: E_MODALS_NAME.NONE,
		});
	}

	return (
		<div className="lbn__modals__move-note__wrapper" ref={wrapperRef}>
			<div className="lbn__modals__settings__top-row__wrapper">
				<div className="lbn__modals__settings__title-row">
					<h4 className="lbn__modals__settings__title">Move Note</h4>

					<div onClick={CloseModal} role="button" tabIndex={0}>
						<CloseSVG className="svg-filter" viewBox="0 0 24 24" height="1.5rem" width="1.5rem" />
					</div>

					<div>
						<p>Select Folder</p>
						{getFoldersState && (
							<div className="lbn__modals__move-note__folder-selector-wrapper">
								{getFoldersState.map((folder: I_Folder, fidx: number) => {
									return (
										<div
											key={fidx}
											onClick={() => {
												setSelectedFolder(folder.id);
											}}
											role="button"
											tabIndex={0}
											className={
												"lbn__modals__move-note__folder-option " +
												(folder.id === selectedFolder
													? " lbn__modals__move-note__folder-option-active "
													: "")
											}
										>
											{folder.title}
										</div>
									);
								})}
							</div>
						)}
					</div>
				</div>
			</div>

			<div className="lbn__modals__move-note__bottom-row__wrapper">
				<button
					className={
						"lbn__modals__settings__delete-btn " +
						(selectedFolder != null
							? " lbn__modals__move-note__confirm-btn "
							: " lbn__modals__move-note__disabled-btn ")
					}
					onClick={() => {
						if (selectedFolder != null) {
							AttemptToMoveNote();
						}
					}}
				>
					Move
				</button>

				<div
					style={{
						width: "2rem",
					}}
				/>

				<button
					className="lbn__modals__settings__delete-btn
                lbn__modals__move-note__cancel-btn
                "
					onClick={CloseModal}
				>
					Cancel
				</button>
			</div>
		</div>
	);
}

export default MoveNote;
