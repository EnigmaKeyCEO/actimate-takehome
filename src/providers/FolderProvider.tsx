import React, { useCallback, useState } from "react";
import type { CreateFolderInput, Folder, SortOptions } from "../types";
import {
  getFolders,
  createFolder as apiCreateFolder,
  deleteFolder as apiDeleteFolder,
} from "../api/api";

export const FolderContext = React.createContext<{
  folders: Folder[];
  loading: boolean;
  error: Error | null;
  parentId: string | "root";
  setParentId: (parentId: string | "root") => void;
  sortOptions: SortOptions | undefined;
  setSortOptions: (sortOptions: SortOptions) => void;
  createFolder: (folderData: CreateFolderInput) => Promise<Folder>;
  deleteFolder: (id: string) => Promise<void>;
  loadMoreFolders: () => void;
  refreshFolders: () => Promise<void>;
}>({
  folders: [],
  loading: true,
  error: null,
  parentId: "root",
  setParentId: () => {},
  sortOptions: undefined,
  setSortOptions: () => {},
  createFolder: async () => {
    throw new Error("createFolder called too soon or without provider");
  },
  deleteFolder: async () => {
    throw new Error("deleteFolder called too soon or without provider");
  },
  loadMoreFolders: () => {},
  refreshFolders: async () => {},
});

const initialState: Folder[] = [];

export const FolderProvider = ({ children }: { children: React.ReactNode }) => {
  const [folders, setFolders] = useState<Folder[]>(initialState);
  const [parentId, setParentId] = useState<string | "root">("root");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [sortOptions, setSortOptions] = useState<SortOptions | undefined>(
    undefined
  );
  const [page, setPage] = useState<number>(1);
  const [lastKey, setLastKey] = useState<any>(undefined);

  const fetchFolders = useCallback(
    async (sort?: SortOptions, pageNumber: number = 1) => {
      setLoading(true);
      setError(null);
      try {
        const response = await getFolders(
          parentId || "root",
          pageNumber,
          sort || { field: "name", direction: "asc" }
        );
        console.debug("response", response);
        if (pageNumber === 1) {
          setFolders(response.folders);
        } else {
          setFolders((prev) => [...prev, ...response.folders]);
        }
        setLastKey(response.lastKey);
      } catch (err: any) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch folders")
        );
        // Consider adding retry logic here
      } finally {
        setLoading(false);
      }
    },
    [parentId]
  );

  const refreshFolders = useCallback(async () => {
    return await fetchFolders();
  }, [fetchFolders]);

  const createFolder = async (folderData: CreateFolderInput) => {
    try {
      const newFolder = await apiCreateFolder(folderData);
      try {
        setFolders([newFolder, ...folders]);
      } catch (err) {
        setFolders([newFolder]);
      }
      try {
        await refreshFolders();
      } catch (err) {
        console.error("Error refreshing folders:", err);
      }
      return newFolder;
    } catch (err: any) {
      setError(
        err instanceof Error ? err : new Error("Failed to create folder")
      );
      throw err;
    }
  };

  const deleteFolder = async (id: string) => {
    try {
      await apiDeleteFolder(id);
      setFolders((prev) => prev.filter((folder) => folder.id !== id));
      await refreshFolders();
    } catch (err: any) {
      setError(
        err instanceof Error ? err : new Error("Failed to delete folder")
      );
      throw err;
    }
  };

  const loadMoreFolders = () => {
    if (lastKey) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchFolders(sortOptions, nextPage);
    }
  };

  React.useEffect(() => {
    fetchFolders();
  }, [parentId, sortOptions]);

  const value = {
    folders,
    loading,
    error,
    parentId,
    setParentId,
    sortOptions,
    setSortOptions,
    createFolder,
    deleteFolder,
    loadMoreFolders,
    refreshFolders,
  };
  return (
    <FolderContext.Provider value={value}>{children}</FolderContext.Provider>
  );
};
