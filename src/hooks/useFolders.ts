import { useState, useEffect } from "react";
import type { Folder, SortOptions, CreateFolderInput } from "../types";
import {
  getFolders,
  createFolder as apiCreateFolder,
  deleteFolder as apiDeleteFolder,
  getFiles,
} from "../api/api";

export function useFolders(parentId?: string) {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [files, setFiles] = useState<any[]>([]); // Add state for files
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [sortOptions, setSortOptions] = useState<SortOptions | undefined>(
    undefined
  );
  const [page, setPage] = useState<number>(1);
  const [lastKey, setLastKey] = useState<any>(undefined);

  const fetchFolders = async (sort?: SortOptions, pageNumber: number = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getFolders(
        parentId || "root",
        pageNumber,
        sort || { field: "name", direction: "asc" }
      );
      if (pageNumber === 1) {
        setFolders(response.folders);
      } else {
        setFolders((prev) => [...prev, ...response.folders]);
      }
      setLastKey(response.lastKey);
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const createFolder = async (folderData: CreateFolderInput) => {
    try {
      const newFolder = await apiCreateFolder(folderData);
      setFolders([newFolder, ...folders]);
      return newFolder;
    } catch (err: any) {
      console.error("Error creating folder:", err);
      setError(err instanceof Error ? err : new Error("Unknown error"));
      throw err;
    }
  };

  const deleteFolder = async (id: string) => {
    try {
      await apiDeleteFolder(id);
      setFolders((prev) => prev.filter((folder) => folder.id !== id));
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
      throw err;
    }
  };

  const loadFiles = async () => {
    try {
      const response = await getFiles(parentId || "root");
      setFiles(response.files);
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
    }
  };

  const loadMoreFolders = () => {
    if (lastKey) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchFolders(sortOptions, nextPage);
    }
  };

  useEffect(() => {
    fetchFolders();
    loadFiles(); // Load files when the component mounts
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parentId]);

  return {
    folders,
    files, // Return files
    loading,
    error,
    createFolder,
    deleteFolder,
    loadMoreFolders,
  };
}

export default useFolders;
