import React from "react";
import { Folder } from "../types";

export type FolderContextType = {
  currentFolder: Folder["id"];
  createFolder: (name: Folder["name"]) => Promise<boolean>;
  getFolders: (folderID?: string) => Promise<Array<Folder> | null>;
};

export const FolderContext = React.createContext<FolderContextType>({
  currentFolder: "root",
  createFolder: async () => Promise.resolve(false),
  getFolders: async () => Promise.resolve([]),
});

export default FolderContext;
