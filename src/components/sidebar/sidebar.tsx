import React, { useEffect, useState, KeyboardEvent, useRef } from "react";

import "./sidebar.scss";

import {
	useRecoilValue,
	// useRecoilValue,
	useSetRecoilState,
} from "recoil";

import {
	// T_ModalStateData,
	T_SetModalStateData,
	ModalStateData,
	E_MODALS_NAME,
} from "../../store/ModalStateAtom";

import {
	// I_Folder []
	T_SetFoldersStateData,
	FoldersStateData,
} from "../../store/FoldersAtom";

import Cookies from "js-cookie";

import { Link, useParams } from "react-router-dom";

import { ReactComponent as ThemeLightSVG } from "../editor/assets/theme-light.svg";
import { ReactComponent as ThemeDarkSVG } from "../editor/assets/theme-dark.svg";
import { ReactComponent as FolderSVG } from "../editor/assets/folder.svg";
import { ReactComponent as PlusSVG } from "../editor/assets/plus.svg";
import { ReactComponent as SettingsSVG } from "../editor/assets/Settings.svg";
import { ReactComponent as GithubSVG } from "../editor/assets/github-fill.svg";

import Folder from "./folder";

import {
	I_Folder,
	lbn_idb__delete_folder,
	lbn_idb__get_folders,
	lbn_idb__save_folder,
	lbn_idb__update_folder,
} from "@src/indexdb-helpers";

interface I_Cookie_UserPreferences {
	theme: "Dark" | "Light" | string;
}

function Sidebar() {
	const setModalState: T_SetModalStateData = useSetRecoilState(ModalStateData);

	const getFoldersState: I_Folder[] = useRecoilValue(FoldersStateData);
	const setFoldersState: T_SetFoldersStateData = useSetRecoilState(FoldersStateData);

	const user_preferences_cookie = "lbn__user_preferences";
	// const domain_str = ".temp-domain.io";

	const newFolderDivRef = useRef<HTMLDivElement>(null);

	const params = useParams();

	const [theme, setTheme] = useState<"DARK" | "LIGHT">("LIGHT");

	const [showCreateNewFolder, setShowCreateNewFolder] = useState<boolean>(false);
	const [folderName, setFolderName] = useState<string>("");

	useEffect(() => {
		EnablePreferredTheme();

		GetFolders()
			.then((res) => {
				// console.log(res);
				setFoldersState(res);
			})
			.catch((err) => {
				console.error("TODO: logging - ", err);
			});
	}, []);

	useEffect(() => {
		document.addEventListener("click", handleClickOutside, false);

		return () => {
			document.removeEventListener("click", handleClickOutside, false);
		};
	}, []);

	function handleClickOutside(event: any): void {
		if (newFolderDivRef.current && !newFolderDivRef.current.contains(event.target)) {
			setShowCreateNewFolder(false);
		}
	}

	async function GetFolders(): Promise<I_Folder[]> {
		const folders: I_Folder[] = await lbn_idb__get_folders();
		return folders;
	}

	function EnablePreferredTheme() {
		const up = Cookies.get(user_preferences_cookie);

		if (up) {
			const upc = JSON.parse(up) as I_Cookie_UserPreferences;

			const htmlroot = document.getElementsByTagName("html")[0];

			if (upc.theme === "Dark") {
				setTheme("DARK");
				htmlroot.setAttribute("data-theme", "Dark");
			} else {
				setTheme("LIGHT");
				htmlroot.setAttribute("data-theme", "Light");
			}
		}
	}

	function ToggleThemes() {
		const htmlroot = document.getElementsByTagName("html")[0];

		const dt = htmlroot.getAttribute("data-theme");
		let theme = "";
		if (dt === "Dark") {
			setTheme("LIGHT");
			htmlroot.setAttribute("data-theme", "Light");
			theme = "Light";
		} else {
			setTheme("DARK");
			htmlroot.setAttribute("data-theme", "Dark");
			theme = "Dark";
		}

		const up = Cookies.get(user_preferences_cookie);
		if (up) {
			const upc = JSON.parse(up) as I_Cookie_UserPreferences;

			upc.theme = theme;
			Cookies.set(user_preferences_cookie, JSON.stringify(upc), {
				path: "/",
				sameSite: "strict",
				// domain: domain_str
			});
		} else {
			const upc = {
				theme: theme,
			};

			Cookies.set(user_preferences_cookie, JSON.stringify(upc), {
				path: "/",
				sameSite: "strict",
				// domain: domain_str
			});
		}
	}

	async function SaveFolder(e: KeyboardEvent<HTMLInputElement>): Promise<void> {
		if (e.key === "Escape") {
			setShowCreateNewFolder(false);
			setFolderName("");
		} else if (e.key === "Enter") {
			setShowCreateNewFolder(false);
			setFolderName("");

			const folder = await lbn_idb__save_folder(folderName);

			const new_state = [...getFoldersState];
			// @ts-ignore
			new_state.push(folder);
			setFoldersState(new_state);
		}
	}

	// async function UpdateFolderTitle(folder_arg: I_Folder, title_arg: string): Promise<void> {
	async function UpdateFolderTitle(folder_arg: I_Folder, title_arg: string): Promise<void> {
		console.log(folder_arg, title_arg);

		const new_state = [...getFoldersState];
		console.log(new_state);

		let fobj: I_Folder;

		for (let i = 0; i < new_state.length; ++i) {
			if (new_state[i].id === folder_arg.id) {
				fobj = { ...new_state[i] };
				fobj.title = title_arg;
				new_state[i] = { ...fobj };

				const folder_res = await lbn_idb__update_folder(fobj);
				if (folder_res === undefined) {
					// TODO: report error - probably should have an error modal
				}

				break;
			}
		}

		console.log(new_state);

		// // @ts-ignore
		// new_state.push(folder);
		// setFoldersState(new_state);
	}

	return (
		<div className="sidebar__wrapper">
			<div className="sidebar__top-wrapper">
				<p className="sidebar__title-main">LB Notes</p>

				<div
					className="sidebar__icon-btn"
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
						setShowCreateNewFolder(true);
					}}
					onKeyDown={() => {
						setShowCreateNewFolder(true);
					}}
					role="button"
					tabIndex={0}
					title="Create folder"
				>
					<PlusSVG className="svg-filter" viewBox="0 0 24 24" height="1.25rem" width="1.25rem" />
				</div>

				<div
					className="sidebar__icon-btn"
					onClick={ToggleThemes}
					onKeyDown={ToggleThemes}
					role="button"
					tabIndex={0}
					title="Toggle Theme"
				>
					{theme === "DARK" ? (
						<ThemeDarkSVG
							className="svg-filter"
							viewBox="0 0 24 24"
							height="1.25rem"
							width="1.25rem"
						/>
					) : (
						<ThemeLightSVG
							className="svg-filter"
							viewBox="0 0 24 24"
							height="1.25rem"
							width="1.25rem"
						/>
					)}
				</div>

				<div
					className="sidebar__icon-btn"
					onClick={(e: any) => {
						e.preventDefault();
						e.stopPropagation();

						// TODO: autofocus input
						// setShowCreateNewFolder(true);
						setModalState({
							showModal: true,
							modalString: E_MODALS_NAME.SETTINGS,
						});
					}}
					onKeyDown={() => {
						// setShowCreateNewFolder(true);
					}}
					role="button"
					tabIndex={0}
					title="Create folder"
				>
					<SettingsSVG
						className="svg-filter"
						viewBox="0 0 426.667 426.667"
						height="1.25rem"
						width="1.25rem"
					/>
				</div>

				{/* <div
					className="sidebar__icon-btn"
					onClick={(e: any) => {
						e.preventDefault();
						e.stopPropagation();

						// TODO: autofocus input
						// setShowCreateNewFolder(true);
						setModalState({
							showModal: true,
							modalString: E_MODALS_NAME.ABOUT,
						});
					}}
					onKeyDown={() => {
						// setShowCreateNewFolder(true);
					}}
					role="button"
					tabIndex={0}
					title="Create folder"
				>
					<PlusSVG className="svg-filter" viewBox="0 0 24 24" height="1.25rem" width="1.25rem" />
				</div> */}
			</div>

			<hr className="sidebar__divider" />

			<div className="sidebar__folder-space__wrapper">
				<Link to={`folder/0`} className="sidebar__folder-space__folder-link">
					<div
						className={
							(params.id == "0" ? "sidebar__folder-space__folder-active" : "") +
							" sidebar__folder-space__folder-btn"
						}
					>
						<FolderSVG
							className="svg-filter"
							viewBox="0 0 24 24"
							height="1.25rem"
							width="1.25rem"
						/>

						<p className="sidebar__folder-space__folder-title text-no-overflow">All Notes</p>
					</div>
				</Link>

				{getFoldersState.map((folder: I_Folder, fidx: number) => {
					return <Folder key={fidx} folder={folder} UpdateFolderTitle={UpdateFolderTitle} />;
				})}

				<div ref={newFolderDivRef}>
					{showCreateNewFolder && (
						<div className="sidebar__folder-space__folder-btn">
							<FolderSVG
								className="svg-filter"
								viewBox="0 0 24 24"
								height="1.25rem"
								width="1.25rem"
							/>

							<input
								// @ts-ignore
								autoFocus={true}
								className="sidebar__folder-space__folder-input"
								value={folderName}
								onChange={(e) => {
									setFolderName(e.target.value);
								}}
								onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
									SaveFolder(e).catch((err) => {
										console.log("TODO: logging - ", err);
									});
								}}
							/>
						</div>
					)}
				</div>
			</div>

			<hr className="sidebar__divider" />

			<a className="sidebar__github-link" href="https://github.com/clearfeld/local-browser-notes">
				<GithubSVG className="svg-filter" viewBox="0 0 24 24" width="1.25rem" height="1.25rem" />

				<div className="sidebar__github-text">Github</div>
			</a>
		</div>
	);
}

export default Sidebar;
