import React, { useEffect, useState } from "react";

import "./sidebar.scss";

import Cookies from "js-cookie";

import { ReactComponent as ThemeLightSVG } from "../editor/assets/theme-light.svg";
import { ReactComponent as ThemeDarkSVG } from "../editor/assets/theme-dark.svg";
import { ReactComponent as FolderSVG } from "../editor/assets/folder.svg";
import { ReactComponent as PlusSVG } from "../editor/assets/plus.svg";
import { lbn_idb__delete_folder, lbn_idb__get_folders, lbn_idb__save_folder } from "@src/indexdb-helpers";

interface I_Cookie_UserPreferences {
	theme: "Dark" | "Light" | string;
}

function Sidebar() {
	const user_preferences_cookie = "lbn__user_preferences";
	const domain_str = ".temp-domain.io";

	const [theme, setTheme] = useState<"DARK" | "LIGHT">("LIGHT");

	const [showCreateNewFolder, setShowCreateNewFolder] = useState<boolean>(false);
	const [folderName, setFolderName] = useState<string>("");

	// TODO: move this to recoil global state
	const [folders, setFolders] = useState<any[]>([]);

	useEffect(() => {
		EnablePreferredTheme();

		GetFolders()
			.then((res) => {
				// console.log(res);
				setFolders(res);
			})
			.catch((err) => {
				console.error("TODO: logging");
			});
	}, []);

	async function GetFolders() {
		const folders = await lbn_idb__get_folders();
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

	async function SaveFolder(e: any) {
		if (e.key === "Enter") {
			// console.log("Enter");

			// clear foldername
			// add to idb
			// re render list of folders

			// const x =
			const folder = await lbn_idb__save_folder(folderName);

			setFolderName("");
			setShowCreateNewFolder(false);

			const new_state = [...folders];
			new_state.push(folder);
			setFolders(new_state);
		}
	}

	return (
		<div className="sidebar__wrapper">
			<div className="sidebar__top-wrapper">
				<p className="sidebar__title-main">LB Notes</p>

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
			</div>

			{/* <hr className="sidebar__divider" /> */}

			<div className="sidebar__folder-space__wrapper">
				<div className="sidebar__folder-space__folder-btn">
					<FolderSVG className="svg-filter" viewBox="0 0 24 24" height="1.25rem" width="1.25rem" />

					<p className="sidebar__folder-space__folder-title text-no-overflow">All Notes</p>
				</div>

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
									console.log();
								});
							}}
						/>
					</div>
				)}

				{folders.map((folder, fidx: number) => {
					return (
						<div
							className="sidebar__folder-space__folder-btn"
							key={fidx}
							onContextMenu={(e) => {
								e.preventDefault();

								console.log("Show cust context menu");

								lbn_idb__delete_folder(folder.id)
									.then((res) => {
										console.log(res);
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

							<p className="sidebar__folder-space__folder-title text-no-overflow">{folder.title}</p>
						</div>
					);
				})}
			</div>

			<hr className="sidebar__divider" />

			<a href="https://github.com/clearfeld/local-browser-notes">
				<div className="sidebar__github-link">Github</div>
			</a>
		</div>
	);
}

export default Sidebar;
