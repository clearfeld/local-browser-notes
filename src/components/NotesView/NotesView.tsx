import React, { useEffect, useLayoutEffect, useState } from "react";

// import "./App.css";

import {
	useParams,
	RouterProvider,
	Route,
	Link,
	// Outlet,
} from "react-router-dom";

import { useRecoilValue, useSetRecoilState } from "recoil";
import { T_CountStateData, T_SetCountStateData, CountStateData } from "@store/CountAtom";

import { lbn_idb_open } from "@src/indexdb-helpers";

function NotesView() {
	// const getCountState: T_CountStateData = useRecoilValue(CountStateData);
	// const setCountState: T_SetCountStateData = useSetRecoilState(CountStateData);

	const params = useParams();

	const [notes, setNotes] = useState([]);

	useEffect(() => {
		console.log("a", params);
	}, []);

	return (
		<div>
			<div>
				{notes.map((note, nidx: number) => {
					return <div key={nidx}>a</div>;
				})}
			</div>
		</div>
	);
}

export default NotesView;
