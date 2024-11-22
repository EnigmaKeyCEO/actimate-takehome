import { useState, useEffect, useCallback } from "react";
import { FileItem, SortOptions } from "#/types";
import {
  getFiles,
  uploadFile as apiUploadNewFile,
  updateFile as apiCreateFile,
  updateFile as apiUpdateFile,
} from "#/api";
import { useFolders } from "#/hooks/useFolders";

export function useFiles() {
  const [files, _setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [sortOptions, setSortOptions] = useState<SortOptions>({
    field: "name",
    direction: "asc",
  });
  const [lastKey, setLastKey] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const LIMIT = process.env.NODE_ENV === "development" ? 5 : 20;

  const { parentId: folderId } = useFolders();

  const setFiles = useCallback(
    (newFiles: FileItem[] | ((prevFiles: FileItem[]) => FileItem[])) => {
      if (typeof newFiles !== "object") {
        throw new Error("newFiles must be an array of FileItem");
      }
      let prevFilesArray: FileItem[] = [];
      if (newFiles instanceof Function) {
        prevFilesArray = newFiles(files);
      } else {
        prevFilesArray = files;
      }
      const allFiles = [...prevFilesArray, ...newFiles];
      const uniqueFilesMap = new Map<string, FileItem>();
      allFiles.forEach((file) => uniqueFilesMap.set(file.id, file));
      const uniqueNewFiles = Array.from(uniqueFilesMap.values());
      _setFiles(uniqueNewFiles);
    },
    [files]
  );

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

        setFiles(fetchedFiles);
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

  const createFile = useCallback(
    async (file: FileItem) => {
      await apiCreateFile(folderId, file);
      setFiles([...files, file]);
    },
    [files]
  );

  const updateFile = useCallback(
    async (file: FileItem) => {
      await apiUpdateFile(folderId, file);
      setFiles([...files, file]);
    },
    [files]
  );

  const uploadNewFile = useCallback(
    async (fileData: FormData) => {
      try {
        await apiUploadNewFile(fileData);
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
    createFile,
    updateFile,
    sortFiles,
    hasMore,
  };
}

export default useFiles;
