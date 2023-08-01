import React from "react";

import {
    useRecoilValue,
    // useSetRecoilState
} from "recoil";

import {
	T_ModalStateData,
	// T_SetModalStateData,
	ModalStateData,
	E_MODALS_NAME,
} from "../../store/ModalStateAtom";

import Settings from "./settings/Settings";

function ModalEntryPoint() {
	const getModalState: T_ModalStateData = useRecoilValue(ModalStateData);
	// const setModalState: T_SetModalStateData = useSetRecoilState(ModalStateData);

	// function CloseModal(): void {
	// 	setModalState({
	// 		showModal: false,
	// 		modalString: E_MODALS_NAME.NONE,
	// 		targetId: null,
	// 		taskId: null,
	// 	});
	// }

	return (
		<div>
			{getModalState.showModal && (
				<div
					style={{
						position: "fixed",
						zIndex: 100,
						top: "0",
						left: "0",
						width: "100%",
						height: "100%",
						display: "flex",
						justifyContent: "center",
					}}
				>
					<div
						style={{
							background: "black",
							height: "100vh",
							opacity: "0.55",
							position: "absolute",
							width: "100vw",
						}}
					/>

                    {getModalState.modalString === E_MODALS_NAME.SETTINGS && (
						<Settings />
					)}

				</div>
			)}
		</div>
	);
}

export default ModalEntryPoint;
