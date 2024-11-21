import { useState, useEffect, useCallback } from "react";
import type { FileItem, SortOptions } from "../types";
import { getFiles, uploadFile, updateFile, deleteFile } from "../api";

export function useFiles(folderId: string) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [sortOptions, setSortOptions] = useState<SortOptions>({
    field: "name",
    direction: "asc",
  });
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const fetchFiles = useCallback(
    async (currentPage: number, currentSort: SortOptions) => {
      setLoading(true);
      setError(null);
      try {
        const response = await getFiles(folderId, currentPage, currentSort);
        const fetchedFiles = Array.isArray(response.files) ? response.files : [];

        if (fetchedFiles.length === 0) {
          setHasMore(false);
        } else {
          setFiles((prevFiles) => {
            if (currentPage === 1) {
              return fetchedFiles;
            } else {
              return [...prevFiles, ...fetchedFiles];
            }
          });
        }
      } catch (err: any) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
      } finally {
        setLoading(false);
      }
    },
    [folderId]
  );

  useEffect(() => {
    setFiles([]);
    setPage(1);
    setHasMore(true);
    fetchFiles(1, sortOptions);
  }, [folderId, sortOptions, fetchFiles]);

  const loadMoreFiles = useCallback(() => {
    if (loading || !hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchFiles(nextPage, sortOptions);
  }, [loading, hasMore, page, sortOptions, fetchFiles]);

  const sortFiles = useCallback(
    (newSortOptions: SortOptions) => {
      setSortOptions(newSortOptions);
    },
    []
  );

  const removeFile = useCallback((id: string) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
  }, []);

  const uploadNewFile = useCallback(
    async (fileData: FormData) => {
      await uploadNewFile(fileData);
      setPage(1);
      setHasMore(true);
      await fetchFiles(1, sortOptions);
    },
    [fetchFiles, sortOptions]
  );

  return {
    files,
    loading,
    error,
    loadMoreFiles,
    uploadNewFile,
    removeFile,
    sortFiles,
    hasMore,
  };
}

export default useFiles;