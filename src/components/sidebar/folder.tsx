import React, { useEffect, useState, KeyboardEvent, useRef, SyntheticEvent } from "react";

// import "./sidebar.scss";

// import {
// 	useRecoilValue,
// 	// useRecoilValue,
// 	useSetRecoilState,
// } from "recoil";

// import {
// 	// T_ModalStateData,
// 	T_SetModalStateData,
// 	ModalStateData,
// 	E_MODALS_NAME,
// } from "../../store/ModalStateAtom";

// import {
// 	// I_Folder []
// 	T_SetFoldersStateData,
// 	FoldersStateData,
// } from "../../store/FoldersAtom";

import { Link, useParams } from "react-router-dom";

import { ReactComponent as FolderSVG } from "../editor/assets/folder.svg";
import { ReactComponent as PlusSVG } from "../editor/assets/plus.svg";
import { ReactComponent as OptionsSVG } from "../editor/assets/more-fill.svg";

import { I_Folder, lbn_idb__delete_folder } from "@src/indexdb-helpers";

interface I_FolderProps {
	folder: I_Folder;

	UpdateFolderTitle: (folder_arg: I_Folder, title_arg: string) => Promise<void>;
}

function Folder(props: I_FolderProps) {
	// const setModalState: T_SetModalStateData = useSetRecoilState(ModalStateData);

	// const getFoldersState: I_Folder[] = useRecoilValue(FoldersStateData);
	// const setFoldersState: T_SetFoldersStateData = useSetRecoilState(FoldersStateData);
	const params = useParams();

	const inputRef = useRef<HTMLInputElement>(null);

	const [folderName, setFolderName] = useState<string>(props.folder.title);
	const [folderRenameable, setFolderRenameable] = useState<boolean>(false);

	const [showOptions, setShowOptions] = useState<boolean>(false);
	const [showMenu, setShowMenu] = useState<boolean>(false);

	useEffect(() => {
		document.addEventListener("click", handleClickOutside, false);

		return () => {
			document.removeEventListener("click", handleClickOutside, false);
		};
	}, []);

	function handleClickOutside(event: any): void {
		if (inputRef.current && !inputRef.current.contains(event.target)) {
			setFolderName(props.folder.title);
			setFolderRenameable(false);
		}
	}

	return (
		<Link
			// key={fidx}
			to={`folder/${props.folder.id}`}
			className={"sidebar__folder-space__folder-link"}
			// onMouseEnter={() => setShowOptions(true)}
			// onMouseLeave={() => setShowOptions(false)}
		>
			<div
				className={
					(params.id == props.folder.id ? "sidebar__folder-space__folder-active" : "") +
					" sidebar__folder-space__folder-btn"
				}
				onClick={() => {
					console.log();
				}}
				role="button"
				tabIndex={0}
				onContextMenu={(e) => {
					// TODO: show options menu
				}}
			>
				<FolderSVG className="svg-filter" viewBox="0 0 24 24" height="1.25rem" width="1.25rem" />

				<input
					ref={inputRef}
					className={
						"sidebar__folder-space__folder-title text-no-overflow " +
						(folderRenameable ? " sidebar__folder-space__folder-input" : "")
					}
					value={folderName}
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();

						inputRef.current?.focus();
					}}
					onChange={(e) => setFolderName(e.target.value)}
					disabled={!folderRenameable}
					onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
						if (e.key === "Escape") {
							setFolderName(props.folder.title);
							setFolderRenameable(false);
						} else if (e.key === "Enter") {
							props
								.UpdateFolderTitle(props.folder, folderName)
								.then((res) => {
									console.log(res);
								})
								.catch((err) => {
									console.log("TODO: error logging - ", err);
								});
							setFolderRenameable(false);
						}
					}}
				/>

				{/* {showOptions && (
					<>
						<OptionsSVG
							className="svg-filter"
							viewBox="0 0 24 24"
							width="1.25rem"
							height="1.25rem"
						/>
					</>
				)} */}

				<div
					className={
						"sidebar__folder-space__folder-options " +
						(showMenu ? " sidebar__folder-space__folder-options-active " : "") +
						(folderRenameable ? " sidebar__folder-space__folder-options-hide " : "")
					}
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();

						setShowMenu(true);
					}}
					tabIndex={0}
					role="button"
				>
					<OptionsSVG className="svg-filter" viewBox="0 0 24 24" width="1.25rem" height="1.25rem" />
				</div>
			</div>

			{showMenu && (
				<>
					<FolderMenu
						folder={props.folder}
						EnableRenameFolder={(e: any) => {
							e.preventDefault();
							e.stopPropagation();

							setFolderRenameable(true);

							// TODO: HACK: FIXME(clearfeld): disgusting
							setTimeout(() => {
								inputRef.current?.focus();
							}, 50);
						}}
						CloseMenu={() => setShowMenu(false)}
					/>
				</>
			)}
		</Link>
	);
}

interface I_FolderMenuProps {
	folder: I_Folder;
	EnableRenameFolder: (e: any) => void;
	CloseMenu: () => void;
}

function FolderMenu(props: I_FolderMenuProps) {
	const menuRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		document.addEventListener("click", handleClickOutside, false);

		return () => {
			document.removeEventListener("click", handleClickOutside, false);
		};
	}, []);

	function handleClickOutside(event: any): void {
		if (menuRef.current && !menuRef.current.contains(event.target)) {
			props.CloseMenu();
		}
	}

	function EnableRenameFolder(e: SyntheticEvent<HTMLDivElement>): void {
		e.preventDefault();
		e.stopPropagation();

		props.EnableRenameFolder(e);
		props.CloseMenu();
	}

	function DeleteFolder(e: SyntheticEvent<HTMLDivElement>): void {
		e.preventDefault();
		e.stopPropagation();

		console.log(props.folder.id);

		// TODO(clearfeld): delete folder should ask to delete notes under it
		lbn_idb__delete_folder(parseInt(props.folder.id))
			.then((res) => {
				console.log(res);

				// TODO(clearfeld): FIXME disgusting temp
				window.location.href = `${window.location.protocol}//${window.location.host}/#/folder/0`;
				window.location.reload();
			})
			.catch((err) => {
				console.error("TODO: error logging", err);
			});
	}

	return (
		<div ref={menuRef} className="sidebar__folder-space__folder-menu__wrapper">
			<div
				className="sidebar__folder-space__folder-menu__option-btn"
				onClick={EnableRenameFolder}
				tabIndex={0}
				role="button"
			>
				<div>Rename folder</div>
			</div>

			<div
				className="sidebar__folder-space__folder-menu__option-btn"
				onClick={DeleteFolder}
				tabIndex={0}
				role="button"
			>
				<div>Delete folder</div>
			</div>
		</div>
	);
}

export default Folder;
