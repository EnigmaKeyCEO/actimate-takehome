import { useState, useEffect, useCallback } from "react";
import { FileItem, SortOptions } from "#/types";
import { getFiles, uploadFile as apiUploadNewFile } from "#/api";

export function useFiles(folderId: string) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [sortOptions, setSortOptions] = useState<SortOptions>({
    field: "name",
    direction: "asc",
  });
  const [lastKey, setLastKey] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const LIMIT = process.env.NODE_ENV === "development" ? 5 : 20;

  const fetchFiles = useCallback(
    async (currentSort: SortOptions, currentLastKey: string | null) => {
      setLoading(true);
      setError(null);
      try {
        const response = await getFiles(folderId, currentLastKey, currentSort);
        const fetchedFiles = Array.isArray(response.files)
          ? response.files
          : [];
        const fetchedLastKey = response.lastKey || null;

        setFiles((prevFiles) => {
          const allFiles = [...prevFiles, ...fetchedFiles];
          const uniqueFilesMap = new Map<string, FileItem>();
          allFiles.forEach((file) => uniqueFilesMap.set(file.id, file));
          return Array.from(uniqueFilesMap.values());
        });
        setLastKey(fetchedLastKey);
        setHasMore(fetchedFiles.length === LIMIT);
      } catch (err: any) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
      } finally {
        setLoading(false);
      }
    },
    [folderId, LIMIT]
  );

  useEffect(() => {
    if (folderId) {
      setFiles([]);
      setLastKey(null);
      setHasMore(true);
      fetchFiles(sortOptions, null);
    }
  }, [folderId, sortOptions, fetchFiles]);

  const loadMoreFiles = useCallback(() => {
    if (loading || !hasMore) return;
    fetchFiles(sortOptions, lastKey);
  }, [loading, hasMore, fetchFiles, sortOptions, lastKey]);

  const sortFiles = useCallback((newSortOptions: SortOptions) => {
    setSortOptions(newSortOptions);
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
  }, []);

  const uploadNewFile = useCallback(
    async (fileData: FormData) => {
      try {
        await apiUploadNewFile(folderId, fileData);
        setFiles([]);
        setLastKey(null);
        setHasMore(true);
        await fetchFiles(sortOptions, null);
      } catch (error) {
        console.error("Error uploading new file:", error);
        throw error;
      }
    },
    [fetchFiles, sortOptions, folderId]
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
