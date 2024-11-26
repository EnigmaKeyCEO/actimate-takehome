import React from "react";
import { Folder } from "../types";

export type FolderContextType = {
  currentFolder: Folder;
  createFolder: (name: Folder["name"]) => Promise<boolean>;
  getFolders: (folderID?: string) => Promise<Array<Folder> | null>;
};

export const ROOT_FOLDER_ID = "root";
export const ROOT_FOLDER = {
  id: ROOT_FOLDER_ID,
  name: "root",
} as Folder;

export const FolderContext = React.createContext<FolderContextType>({
  currentFolder: ROOT_FOLDER,
  createFolder: async () => Promise.resolve(false),
  getFolders: async () => Promise.resolve([]),
});

export default FolderContext;
