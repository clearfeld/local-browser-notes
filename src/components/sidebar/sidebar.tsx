import React, { useEffect, useState } from "react";

import "./sidebar.scss";

import Cookies from "js-cookie";

import { ReactComponent as ThemeLightSVG } from "../editor/assets/theme-light.svg";
import { ReactComponent as ThemeDarkSVG } from "../editor/assets/theme-dark.svg";

interface I_Cookie_UserPreferences {
	theme: "Dark" | "Light" | string;
}

function Sidebar() {
	const user_preferences_cookie = "lbn__user_preferences";
	const domain_str = ".temp-domain.io";

	const [theme, setTheme] = useState<"DARK" | "LIGHT">("LIGHT");

	useEffect(() => {
		EnablePreferredTheme();
	}, []);

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
			</div>

			<div className="sidebar__spacer" />

			<hr className="sidebar__divider" />

			<a href="https://github.com/clearfeld/local-browser-notes">
				<div className="sidebar__github-link">Github</div>
			</a>
		</div>
	);
}

export default Sidebar;
