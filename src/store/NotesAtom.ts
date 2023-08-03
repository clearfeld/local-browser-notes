import { atom } from "recoil";
import { I_Note } from "@src/indexdb-helpers";

export type T_SetNotesStateData = (State_obj: I_Note[]) => void;

export const NotesStateData = atom<I_Note[]>({
  key: "NotesStateAtom",
  default: [],
});
