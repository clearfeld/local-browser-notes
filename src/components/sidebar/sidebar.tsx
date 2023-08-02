import React, { useEffect, useState, KeyboardEvent } from "react";

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

import {
	I_Folder,
	lbn_idb__delete_folder,
	lbn_idb__get_folders,
	lbn_idb__save_folder,
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

	async function SaveFolder(e: KeyboardEvent<HTMLInputElement>) {
		if (e.key === "Enter") {
			// console.log("Enter");

			// clear foldername
			// add to idb
			// re render list of folders

			// const x =
			const folder = await lbn_idb__save_folder(folderName);

			setFolderName("");
			setShowCreateNewFolder(false);

			const new_state = [...getFoldersState];
			// @ts-ignore
			new_state.push(folder);
			setFoldersState(new_state);
		}
	}

	return (
		<div className="sidebar__wrapper">
			<div className="sidebar__top-wrapper">
				<p className="sidebar__title-main">LB Notes</p>

				<div
					className="sidebar__icon-btn"
					onClick={() => {
						// TODO: autofocus input
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
					return (
						<Link
							key={fidx}
							to={`folder/${folder.id}`}
							className={"sidebar__folder-space__folder-link"}
						>
							<div
								className={
									(params.id == folder.id ? "sidebar__folder-space__folder-active" : "") +
									" sidebar__folder-space__folder-btn"
								}
								onClick={() => {
									console.log();
								}}
								role="button"
								tabIndex={0}
								onContextMenu={(e) => {
									e.preventDefault();

									console.log("Show cust context menu");

									// TODO(clearfeld): delete folder should ask to delete notes under it
									lbn_idb__delete_folder(parseInt(folder.id))
										.then((res) => {
											console.log(res);

											window.location.href = `${window.location.protocol}//${window.location.host}/#/folder/0`;
											window.location.reload();
										})
										.catch((err) => {
											console.error("TODO: error logging", err);
										});
								}}
							>
								<FolderSVG
									className="svg-filter"
									viewBox="0 0 24 24"
									height="1.25rem"
									width="1.25rem"
								/>

								<p className="sidebar__folder-space__folder-title text-no-overflow">
									{folder.title}
								</p>
							</div>
						</Link>
					);
				})}

				{showCreateNewFolder && (
					<div className="sidebar__folder-space__folder-btn">
						<FolderSVG
							className="svg-filter"
							viewBox="0 0 24 24"
							height="1.25rem"
							width="1.25rem"
						/>

						<input
							className="sidebar__folder-space__folder-input"
							value={folderName}
							onChange={(e) => {
								setFolderName(e.target.value);
							}}
							onKeyDown={(e) => {
								SaveFolder(e).catch((err) => {
									console.log("TODO: logging - ", err);
								});
							}}
						/>
					</div>
				)}
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
