import { atom } from "recoil";

export enum E_MODALS_NAME {
  NONE,
  SETTINGS,
  ABOUT
}

export type T_ModalStateData = {
  showModal: boolean;
  modalString: E_MODALS_NAME;
};

export type T_SetModalStateData = (State_obj: T_ModalStateData) => void;

export const ModalStateData = atom<T_ModalStateData>({
  key: "ModalStateAtom",
  default: {
    showModal: false,
    modalString: E_MODALS_NAME.NONE,
  },
});
