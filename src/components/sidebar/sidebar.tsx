import React, { useEffect } from "react";

import "./sidebar.scss";

import Cookies from "js-cookie";

interface I_Cookie_UserPreferences {
	theme: "Dark" | "Light" | string;
}

function Sidebar() {
	const user_preferences_cookie = "lbn__user_preferences";
	const domain_str = ".temp-domain.io";

	useEffect(() => {
		EnablePreferredTheme();
	}, []);

	function EnablePreferredTheme() {
		const up = Cookies.get(user_preferences_cookie);

		if (up) {
			const upc = JSON.parse(up) as I_Cookie_UserPreferences;

			const htmlroot = document.getElementsByTagName("html")[0];

			if (upc.theme === "Dark") {
				htmlroot.setAttribute("data-theme", "Dark");
			} else {
				htmlroot.setAttribute("data-theme", "Light");
			}
		}
	}

	function ToggleThemes() {
		const htmlroot = document.getElementsByTagName("html")[0];

		const dt = htmlroot.getAttribute("data-theme");
		let theme = "";
		if (dt === "Dark") {
			htmlroot.setAttribute("data-theme", "Light");
			theme = "Light";
		} else {
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
			<div
                onClick={ToggleThemes}
                onKeyDown={ToggleThemes}
                role="button"
                tabIndex={0}
            >
				Theme Toggle
			</div>

			<div>Send feedback</div>
		</div>
	);
}

export default Sidebar;
