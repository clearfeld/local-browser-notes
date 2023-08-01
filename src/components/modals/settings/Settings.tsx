import React, { useEffect, useRef } from "react";

import "./Settings.scss";

import { useRecoilValue, useSetRecoilState } from "recoil";
import {
	T_ModalStateData, //
	T_SetModalStateData,
	E_MODALS_NAME,
	ModalStateData,
} from "../../../store/ModalStateAtom";

import { ReactComponent as CloseSVG } from "../../editor/assets/CloseBold.svg";
import { lbn_idb_delete } from "@src/indexdb-helpers";

function Settings() {
	const wrapperRef = useRef<any>(null);

	const modalState: T_ModalStateData = useRecoilValue(ModalStateData);
	const setModalState: T_SetModalStateData = useSetRecoilState(ModalStateData);

	useEffect(() => {
		document.addEventListener("click", handleClickOutside, false);

		return () => {
			document.removeEventListener("click", handleClickOutside, false);
		};
	}, []);

	function handleClickOutside(event: any): void {
		if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
			CloseModal();
		}
	}

	function CloseModal(): void {
		setModalState({
			showModal: false,
			modalString: E_MODALS_NAME.NONE,
		});
	}

	function AttemptToDeleteDB(): void {
		lbn_idb_delete()
			.then((res) => {
				console.log(res);
				CloseModal();
			})
			.catch((err) => {
				console.log("TODO: error logging - ", err);
			});

		window.location.href = `${window.location.protocol}//${window.location.host}/#/folder/0`;
		window.location.reload();
	}

	return (
		<div className="lbn__modals__settings__wrapper" ref={wrapperRef}>
			<div className="lbn__modals__settings__top-row__wrapper">
				<div className="lbn__modals__settings__title-row">
					<h4 className="lbn__modals__settings__title">Settings</h4>

					<div onClick={CloseModal} role="button" tabIndex={0}>
						<CloseSVG className="svg-filter" viewBox="0 0 24 24" height="1.5rem" width="1.5rem" />
					</div>
				</div>

				<br />

				<div>
					<p className="lbn__modals__settings__text">
						WARNING: Once site data is deleted, recovery is not possible.
					</p>

					<br />

					<button className="lbn__modals__settings__delete-btn" onClick={AttemptToDeleteDB}>
						Delete All Site Data
					</button>
				</div>
			</div>

			{/* <div className="lbn__modals__settings__bottom-row__wrapper">
			</div> */}
		</div>
	);
}

export default Settings;
