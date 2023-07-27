import React, { useEffect, useLayoutEffect, useState } from "react";

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

import { lbn_idb_open } from "./indexdb-helpers";

function App() {
	const getCountState: T_CountStateData = useRecoilValue(CountStateData);
	const setCountState: T_SetCountStateData = useSetRecoilState(CountStateData);

	const [loading, setLoading] = useState<boolean>(true);

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

	useLayoutEffect(() => {
		lbn_idb_open()
			.then((db) => {
				window.LBN.idb_ref = db;
				console.log(db);
				setLoading(false);
			})
			.catch((err) => {
				console.error(err);
				// setLoading(false);
			});
	}, []);

	useEffect(() => {
		console.log();
	}, []);

	return (
		<div className="App">
			{!loading && (
				<>
					<Sidebar />

					<div
						style={{
							marginLeft: "var(--sidebar-size)",
							width: "calc(100vw - var(--sidebar-size))",
						}}
					>
						<Editor />
					</div>
					{/* <p>{import.meta.env.VITE_TEST}</p>
			    <p>{process.env.VITE_TEST}</p> */}

					{/* <RouterProvider router={router} /> */}
				</>
			)}
		</div>
	);
}

export default App;
