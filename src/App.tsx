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

import { ReactComponent as LogoSVG } from "./logo.svg";
import CheckboxWithLabel from "./CheckboxWithLabel";

function App() {
	const getCountState: T_CountStateData = useRecoilValue(CountStateData);
	const setCountState: T_SetCountStateData = useSetRecoilState(CountStateData);

	const router = createBrowserRouter(
		createRoutesFromElements(
			<Route
				path="/"
				element={
					<div>
						<div
							style={{
								display: "grid",
								gridTemplateColumns: "1fr 1fr 1fr",
							}}
						>
							<Link to={"/"}>
								<div className="link">Home</div>
							</Link>

							<Link to={"/global"}>
								<div className="link">Global State</div>
							</Link>

							<Link to={"/links"}>
								<div className="link">Links</div>
							</Link>
						</div>

						<Outlet />
					</div>
				}
			>
				<Route
					index
					element={
						<div className="route-block">
							<CheckboxWithLabel off={"Off"} on={"On"} />

							<p>Edit src\App.tsx and save to reload.</p>
							<a
								className="link"
								href="https://reactjs.org"
								target="_blank"
								rel="noopener noreferrer"
							>
								Learn React
							</a>
						</div>
					}
				/>

				<Route
					path="Global"
					element={
						<div className="route-block">
							<button
								onClick={() => {
									const newState: T_CountStateData = {
										value: getCountState.value + 1,
									};

									setCountState(newState);
								}}
							>
								increment
							</button>

							<p>Count: {getCountState.value}</p>
						</div>
					}
				/>

				<Route
					path="links"
					element={
						<div className="route-block">
							<a
								className="link"
								href="https://github.com/clearfeld/create-next-gen-react-app"
								target="_blank"
								rel="noopener noreferrer"
							>
								Repository
							</a>
							<br />
							<a
								className="link"
								href="https://create-next-gen-react-app.vercel.app/docs/getting-started/getting-started"
								target="_blank"
								rel="noopener noreferrer"
							>
								Docs
							</a>
						</div>
					}
				/>
			</Route>,
		),
	);

	return (
		<div className="App">
			<LogoSVG className="logo" />

			<h1 className="title">React</h1>

			{/* <p>{import.meta.env.VITE_TEST}</p>
			    <p>{process.env.VITE_TEST}</p> */}

			<RouterProvider router={router} />
		</div>
	);
}

export default App;
