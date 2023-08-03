import { atom } from "recoil";
import { I_Folder, I_Note } from "@src/indexdb-helpers";

export enum E_OBJECT_TYPE {
  NONE,
  FOLDER,
  NOTE,
}

export type T_ObjectSelectionStateData = {
    object_type: E_OBJECT_TYPE;
    objects: null | I_Folder[] | I_Note[];
    // ids: string[]; ?? maybe
};

export type T_SetObjectSelectionStateData = (State_obj: T_ObjectSelectionStateData) => void;

export const ObjectSelectionStateData = atom<T_ObjectSelectionStateData>({
  key: "ObjectSelectionStateAtom",
  default: {
    object_type: E_OBJECT_TYPE.NONE,
    objects: null,
  },
});
