import { I_Folder } from "@src/indexdb-helpers";
import { atom } from "recoil";

export type T_SetFoldersStateData = (State_obj: I_Folder[]) => void;

export const FoldersStateData = atom<I_Folder[]>({
  key: "FoldersStateAtom",
  default: [],
});
