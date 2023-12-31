// import { openDB, deleteDB, DBSchema } from "idb";
import { openDB, deleteDB, DBSchema } from "idb/with-async-ittr";

// import { v4 as uuidv4 } from "uuid";

const idb_name = "lbn";

//

declare global {
  interface Window {
    LBN: {
      idb_ref: any | null;
    };
  }
}
window.LBN = { idb_ref: null };

// export let idb_ref: any | null;

// TODO: probably should use this instead of fetching the notes in full from the notes indexeddb space
interface I_NoteRef {
  id: string;
  title: string;
  summary: string;
  tags: string[];
}

export interface I_FolderOrder {
  id: string;
  id_order: string[];
}

export interface I_Folder {
  id: string;
  title: string;
  parent_id: string | null;
  note_ids: I_NoteRef[];
  created_date: number;
  last_updated_date: number;
}

export interface I_Folder_DB {
  key: string;
  value: {
    title: string;
    parent_id: string | null;
    note_ids: I_NoteRef[];
    created_date: number;
    last_updated_date: number;
  };
}

export interface I_Tag {
  key: string;
  value: {
    title: string;
    color: string;
    // usage_count: number; ???
  };
}

export interface I_Note {
  id: string;
  title: string;
  folder_parent_id: string;
  summary: string;
  tags: string[];
  content: string;
  created_date: number;
  last_updated_date: number;
}

export interface I_Note_DB {
  key: string;
  value: {
    title: string;
    folder_parent_id: string;
    summary: string;
    tags: string[];
    content: string;
    created_date: number;
    last_updated_date: number;
  };
}

interface I_IDB_V1 extends DBSchema {
  // meta: {}

  // TODO(clearfeld): think about maybe create a scratch space thats the default none connected note for initial open

  folder_order: {
    key: string;
    value: {
      id_order: string[];
    };
  };

  folders: {
    key: string;
    value: {
      title: string;
      parent_id: string | null;
      note_ids: I_NoteRef[];
      created_date: string;
      last_updated_date: number;
    };
  };

  tags: {
    key: string;
    value: {
      title: string;
      color: string;
      created_date: number;
      last_updated_date: number;
    };
  };

  notes: {
    key: string;
    value: {
      title: string;
      folder_parent_id: string;
      summary: string;
      tags: string[];
      content: string;
      created_date: number;
      last_updated_date: number;
    };
    indexes: {
      last_updated_date: number;
      folder_parent_id: string;
    };
  };
}

export async function lbn_idb_open() {
  const db = await openDB<I_IDB_V1>(idb_name, 2, {
    upgrade(db, oldVersion, newVersion, transaction, event) {
      // …

      if (oldVersion < 1) {
        // Create a store of objects
        const store_folders = db.createObjectStore("folders", {
          // The 'id' property of the object will be the key.
          keyPath: "id",
          // If it isn't explicitly set, create a value by auto incrementing.
          autoIncrement: true,
        });

        const store_tags = db.createObjectStore("tags", {
          // The 'id' property of the object will be the key.
          keyPath: "id",
          // If it isn't explicitly set, create a value by auto incrementing.
          autoIncrement: true,
        });

        const store_notes = db.createObjectStore("notes", {
          // The 'id' property of the object will be the key.
          keyPath: "id",
          // If it isn't explicitly set, create a value by auto incrementing.
          autoIncrement: true,
        });
        // @ts-ignore
        store_notes.createIndex("last_updated_date", "last_updated_date");
        // @ts-ignore
        store_notes.createIndex("folder_parent_id", "folder_parent_id");

        // Create an index on the 'date' property of the objects.
        // store.createIndex("date", "date");
      }

      if (oldVersion < 2) {
        const store_folder_order = db.createObjectStore("folder_order", {
          // The 'id' property of the object will be the key.
          keyPath: "id",
          // If it isn't explicitly set, create a value by auto incrementing.
          autoIncrement: false,
        });
      }
    },

    // blocked(currentVersion, blockedVersion, event) {
    //   // …
    // },
    // blocking(currentVersion, blockedVersion, event) {
    //   // …
    // },

    terminated() {
      // …
    },
  });

  return db;
}

export async function lbn_idb_delete() {
  const x = await deleteDB(idb_name, {
    // blocked() {
    //   console.log("Error: delete db blocked");
    // },
  });

  return x;
}

// Folder order start

export async function lbn_idb__get_folder_order(): Promise<I_FolderOrder | null> {
  if (window.LBN.idb_ref !== null) {
    const folder_order: I_FolderOrder[] = await window.LBN.idb_ref.getAll(
      "folder_order"
    );
    // console.log("Folders:- ", folders);
    if(folder_order !== null && folder_order.length > 0) {
      return folder_order[0];
    } else {
      return null;
    }
  } else {
    console.error();
    // TODO: logging / error reporting
  }

  return null;
}

export async function lbn_idb__update_folder_order(
  folder_arg: I_FolderOrder
): Promise<I_FolderOrder | null> {
  if (window.LBN.idb_ref !== null) {
    const tx = window.LBN.idb_ref.transaction("folder_order", "readwrite");

    // TODO: logging / error reporting
    const res = await tx.store.put(folder_arg);

    return folder_arg;
  } else {
    // TODO: logging / error reporting

    return null;
  }

  return null;
}

// Folder order end

// Folders start

export async function lbn_idb__get_folders(): Promise<I_Folder[]> {
  if (window.LBN.idb_ref !== null) {
    const folders: I_Folder[] = await window.LBN.idb_ref.getAll("folders");
    // console.log("Folders:- ", folders);
    return folders;
  } else {
    console.error();
    // TODO: logging / error reporting
  }

  return [];
}

export async function lbn_idb__update_folder(
  folder_arg: I_Folder
): Promise<I_Folder | undefined> {
  if (window.LBN.idb_ref !== null) {
    const tx = window.LBN.idb_ref.transaction("folders", "readwrite");

    // TODO: logging / error reporting
    const res = await tx.store.put(folder_arg);

    return folder_arg;
  } else {
    // TODO: logging / error reporting

    return undefined;
  }

  return undefined;
}

export async function lbn_idb__save_folder(folder_name: string) {
  if (window.LBN.idb_ref !== null) {
    const tx = window.LBN.idb_ref.transaction("folders", "readwrite");

    // TODO: logging / error reporting
    const res = await tx.store.put({
      title: folder_name,
      parent_id: null,
      note_ids: [],
    });

    return {
      id: res,
      title: folder_name,
      parent_id: null,
      note_ids: [],
    };
  } else {
    // TODO: logging / error reporting
  }
}

export async function lbn_idb__delete_folder(folder_id: number) {
  if (window.LBN.idb_ref !== null) {
    const tx_n = window.LBN.idb_ref.transaction("notes", "readwrite");
    // TODO: logging / error reporting
    const index = await tx_n.store.index("folder_parent_id");
    for await (const cursor of index.iterate(folder_id)) {
      cursor.delete();
    }

    const tx = window.LBN.idb_ref.transaction("folders", "readwrite");
    // TODO: logging / error reporting
    const res = await tx.store.delete(folder_id);

    return;
  } else {
    // TODO: logging / error reporting
  }
}

// Folders end

// Notes start

export async function lbn_idb__get_notes(
  filter_id: number | null
): Promise<I_Note[] | undefined> {
  if (window.LBN.idb_ref !== null) {
    if (filter_id === null) {
      const notes: I_Note[] = await window.LBN.idb_ref.getAll("notes");
      return notes;
    } else {
      // const notes = await window.LBN.idb_ref.getAllFrom("notes");
      // return notes;

      const tx = window.LBN.idb_ref.transaction("notes", "readwrite");
      const index = tx.store.index("folder_parent_id");

      const notes: I_Note[] = [];

      // console.log(filter_id, tx, index);
      // console.log(index.iterate("0")); //index.iterate(filter_id));

      for await (const cursor of index.iterate(filter_id)) {
        // console.log(cursor.value);
        notes.push(cursor.value);
      }
      // for await (const cursor of index.iterate(filter_id)) {
      //   console.log(cursor.value);
      //   notes.push(cursor.value);
      // }

      return notes;
    }
  } else {
    // TODO: logging / error reporting
  }
}

export async function lbn_idb__get_note(
  note_id: number | null
): Promise<I_Note | undefined> {
  if (window.LBN.idb_ref !== null) {
    const note: I_Note | undefined = await window.LBN.idb_ref.get(
      "notes",
      note_id
    );
    return note;
  } else {
    // TODO: logging / error reporting
  }
}

export async function lbn_idb__save_note(note: any) {
  if (window.LBN.idb_ref !== null) {
    const tx = window.LBN.idb_ref.transaction("notes", "readwrite");

    // TODO: logging / error reporting
    const res = await tx.store.put(note);

    return {
      id: res,
    };
  } else {
    // TODO: logging / error reporting
  }
}

export async function lbn_idb__delete_note(note_id: number) {
  if (window.LBN.idb_ref !== null) {
    const tx = window.LBN.idb_ref.transaction("notes", "readwrite");

    // TODO: logging / error reporting
    const res = await tx.store.delete(note_id);

    return;
  } else {
    // TODO: logging / error reporting
  }
}

// Notes end

// TODO: create delete db helper function later
