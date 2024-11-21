import { useState, useEffect, useCallback } from "react";
import { CreateFolderInput, Folder, SortOptions } from "#/types";
import {
  getFolders,
  getFolderById,
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

  const fetchFolders = useCallback(
    async (currentPage: number = 1, currentSort: SortOptions = sortOptions) => {
      setLoading(true);
      setError(null);
      try {
        const response = await getFolders(parentId, currentPage, currentSort);
        const fetchedFolders = Array.isArray(response.folders)
          ? response.folders
          : [];

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
          setPage(currentPage + 1);
        }
      } catch (err: any) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch folders")
        );
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
    fetchFolders(1, sortOptions);
  }, [parentId, sortOptions, fetchFolders]);

  const loadMoreFolders = useCallback(() => {
    if (hasMore && !loading && !error) {
      fetchFolders(page, sortOptions);
    }
  }, [hasMore, loading, error, fetchFolders, page, sortOptions]);

  const refreshFolders = useCallback(() => {
    setFolders([]);
    setPage(1);
    setHasMore(true);
    fetchFolders(1, sortOptions);
  }, [fetchFolders, sortOptions]);

  const createFolder = useCallback(
    async (folderData: Partial<Folder>) => {
      try {
        const newFolder = await apiCreateFolder(folderData as CreateFolderInput);
        setFolders((prev) => [newFolder, ...prev]);
      } catch (err: any) {
        setError(
          err instanceof Error ? err : new Error("Failed to create folder")
        );
        throw err;
      }
    },
    [apiCreateFolder]
  );

  const deleteFolder = useCallback(
    async (id: string) => {
      try {
        await apiDeleteFolder(id);
        setFolders((prev) => prev.filter((folder) => folder.id !== id));
      } catch (err: any) {
        setError(
          err instanceof Error ? err : new Error("Failed to delete folder")
        );
        throw err;
      }
    },
    [apiDeleteFolder]
  );

  const fetchSingleFolder = useCallback(
    async (id: string): Promise<Folder | null> => {
      try {
        const folder = await getFolderById(id);
        return folder;
      } catch (err) {
        console.error("Error fetching single folder:", err);
        return null;
      }
    },
    []
  );

  return {
    folders,
    loading,
    error,
    createFolder,
    deleteFolder,
    loadMoreFolders,
    refreshFolders,
    hasMoreFolders: hasMore,
    fetchSingleFolder,
  };
}
