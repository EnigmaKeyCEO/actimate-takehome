import React, { useState, useEffect, useCallback, useContext } from "react";
import type { Folder, SortOptions, CreateFolderInput } from "../types";
import {
  getFolders as apiFetchFolders,
  createFolder as apiCreateFolder,
  deleteFolder as apiDeleteFolder,
} from "#/api";

export function useFolders(parentId: string) {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [sortOptions, setSortOptions] = useState<SortOptions>({
    field: "name",
    direction: "asc",
  });
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [lastKey, setLastKey] = useState<string | null>(null);

  const fetchFolders = useCallback(
    async (currentPage: number = 1, currentSort: SortOptions = sortOptions) => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiFetchFolders(
          parentId,
          currentPage,
          currentSort
        );
        const fetchedFolders = Array.isArray(response.folders) ? response.folders : [];

        if (fetchedFolders.length === 0) {
          setHasMore(false);
        } else {
          setFolders((prevFolders) => {
            if (currentPage === 1) {
              return fetchedFolders;
            } else {
              return [...prevFolders, ...fetchedFolders];
            }
          });
          setLastKey(response.lastKey || null);
        }
      } catch (err: any) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
      } finally {
        setLoading(false);
      }
    },
    [parentId, sortOptions]
  );

  useEffect(() => {
    setFolders([]);
    setPage(1);
    setHasMore(true);
    setLastKey(null);
    fetchFolders(1, sortOptions);
  }, [parentId, sortOptions, fetchFolders]);

  const loadMoreFolders = useCallback(() => {
    if (loading || !hasMore || !lastKey) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchFolders(nextPage, sortOptions);
  }, [loading, hasMore, lastKey, page, sortOptions, fetchFolders]);

  const refreshFolders = useCallback(async () => {
    setFolders([]);
    setPage(1);
    setHasMore(true);
    setLastKey(null);
    await fetchFolders(1, sortOptions);
  }, [fetchFolders, sortOptions]);

  const createFolder = useCallback(async (folderData: Partial<Folder>) => {
    try {
      const newFolder = await apiCreateFolder(folderData as CreateFolderInput);
      setFolders((prev) => [newFolder, ...prev]);
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error("Failed to create folder"));
      throw err;
    }
  }, []);

  const deleteFolder = useCallback(async (id: string) => {
    try {
      await apiDeleteFolder(id);
      setFolders((prev) => prev.filter((folder) => folder.id !== id));
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error("Failed to delete folder"));
      throw err;
    }
  }, []);

  return {
    folders,
    loading,
    error,
    createFolder,
    deleteFolder,
    loadMoreFolders,
    refreshFolders,
  };
}

export default useFolders;
