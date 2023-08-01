import React, { useEffect, useLayoutEffect, useState } from "react";

import "./App.css";

import {
	createRoutesFromElements,
	createHashRouter,
	RouterProvider,
	Route,
	Link,
	Outlet,
} from "react-router-dom";

// import { useRecoilValue, useSetRecoilState } from "recoil";
// import { T_CountStateData, T_SetCountStateData, CountStateData } from "@store/CountAtom";

// import CheckboxWithLabel from "./CheckboxWithLabel";

import Sidebar from "./components/sidebar/sidebar";
import Editor from "./components/editor/editor";

import { lbn_idb_open } from "./indexdb-helpers";
import NotesView from "./components/NotesView/NotesView";
import ModalEntryPoint from "./components/modals/ModalEntryPoint";

function App() {
	// const getCountState: T_CountStateData = useRecoilValue(CountStateData);
	// const setCountState: T_SetCountStateData = useSetRecoilState(CountStateData);

	const [loading, setLoading] = useState<boolean>(true);

	const router = createHashRouter(
		createRoutesFromElements(
			<Route
				path="/"
				element={
					<>
						<ModalEntryPoint />

						<Sidebar />

						<div
							style={{
								marginLeft: "var(--sidebar-size)",
								width: "calc(100vw - var(--sidebar-size))",
							}}
						>
							<Outlet />
						</div>
					</>
				}
			>
				<Route index element={<NotesView />} />
				<Route path="/folder/:id" element={<NotesView />} />
				<Route path="/new-note/:parent_id" element={<Editor />} />
				<Route path="/note/:note_id" element={<Editor />} />
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
					<RouterProvider router={router} />
					{/* <p>{import.meta.env.VITE_TEST}</p>
			    		<p>{process.env.VITE_TEST}</p> */}
				</>
			)}
		</div>
	);
}

export default App;
