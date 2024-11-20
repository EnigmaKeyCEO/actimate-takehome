import React, { useState, useCallback } from "react";
import { Folder, CreateFolderInput } from "#/types";
import {
  createFolder as apiCreateFolder,
  deleteFolder as apiDeleteFolder,
  getFolders as apiFetchFolders,
} from "#/api";
import { useFolders } from "#/hooks/useFolders";

export const FolderContext = React.createContext<{
  folders: Folder[];
  loading: boolean;
  error: Error | null;
  createFolder: (folderData: CreateFolderInput) => Promise<Folder>;
  deleteFolder: (id: string) => Promise<void>;
  loadMoreFolders: () => void;
  refreshFolders: () => Promise<void>;
}>({
  folders: [],
  loading: false,
  error: null,
  createFolder: async () => {
    throw new Error("Not implemented");
  },
  deleteFolder: async () => {
    throw new Error("Not implemented");
  },
  loadMoreFolders: () => {},
  refreshFolders: async () => {},
});
// TODO: move the hook logic to this provider
export const FolderProvider = ({ children }: { children: React.ReactNode }) => {
  const { folders, loading, error, loadMoreFolders, refreshFolders } =
    useFolders("root");

  return (
    <FolderContext.Provider
      value={{
        folders,
        loading,
        error,
        createFolder: apiCreateFolder,
        deleteFolder: apiDeleteFolder,
        loadMoreFolders,
        refreshFolders,
      }}
    >
      {children}
    </FolderContext.Provider>
  );
};
