import React from "react";
import { createRoot } from "react-dom/client";

// import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import { RecoilRoot } from "recoil";

const root = createRoot(document.getElementById("app") as HTMLElement);

root.render(
	// https://github.com/atlassian/react-beautiful-dnd/issues/2396#issuecomment-1248018320
	// TODO: enable strict mode again - try using the above to disable strict mode for dnd to avoid issues with the droppable drag

	// <React.StrictMode>
		<RecoilRoot>
			<App />
		</RecoilRoot>
	// </React.StrictMode>
	,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
