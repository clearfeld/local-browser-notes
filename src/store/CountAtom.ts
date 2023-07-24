import { atom } from "recoil";

export type T_CountStateData = {
	value: number;
};

export type T_SetCountStateData = (State_obj: T_CountStateData) => void;

export const CountStateData = atom<T_CountStateData>({
	key: "CountStateAtom",
	default: {
		value: 0,
	},
});
