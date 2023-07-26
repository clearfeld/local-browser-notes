import React from "react";

import "./App.css";

import {
	createRoutesFromElements,
	createBrowserRouter,
	RouterProvider,
	Route,
	Link,
	Outlet,
} from "react-router-dom";

import { useRecoilValue, useSetRecoilState } from "recoil";
import { T_CountStateData, T_SetCountStateData, CountStateData } from "@store/CountAtom";

import CheckboxWithLabel from "./CheckboxWithLabel";

import Sidebar from "./components/sidebar/sidebar";
import Editor from "./components/editor/editor";

function App() {
	const getCountState: T_CountStateData = useRecoilValue(CountStateData);
	const setCountState: T_SetCountStateData = useSetRecoilState(CountStateData);

	const router = createBrowserRouter(
		createRoutesFromElements(
			<Route
				path="/"
				element={
					<div>
						<Outlet />
					</div>
				}
			>
				<Route index element={<div></div>} />
			</Route>,
		),
	);

	return (
		<div className="App">
			<Sidebar />

			<div
				style={{
					marginLeft: "var(--sidebar-size)",
					width: "calc(100vw - var(--sidebar-size))"
				}}
			>
				<Editor />
			</div>
			{/* <p>{import.meta.env.VITE_TEST}</p>
			    <p>{process.env.VITE_TEST}</p> */}

			{/* <RouterProvider router={router} /> */}
		</div>
	);
}

export default App;
