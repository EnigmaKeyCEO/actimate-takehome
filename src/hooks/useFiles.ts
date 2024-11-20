import { useState, useEffect } from "react";
import type { FileItem, SortOptions } from "../types";
import { getFiles, uploadFile, updateFile, deleteFile } from "../api/api";

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

  const fetchFiles = async (currentPage: number, currentSort: SortOptions) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getFiles(folderId, currentPage, currentSort);
      if (response.files?.length === 0) {
        setHasMore(false);
      } else {
        setFiles((prevFiles) => {
          if (currentPage === 1) {
            return response.files;
          } else {
            return prevFiles
              ? [...prevFiles, ...response.files]
              : response.files;
          }
        });
      }
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const loadMoreFiles = () => {
    if (loading || !hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchFiles(nextPage, sortOptions);
  };

  const uploadNewFile = async (fileData: FormData) => {
    setLoading(true);
    setError(null);
    try {
      const newFile = await uploadFile(folderId, fileData);
      setFiles((prevFiles) =>
        prevFiles ? [newFile, ...prevFiles] : [newFile]
      );
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const updateExistingFile = async (
    id: string,
    updateData: Partial<FileItem>
  ) => {
    setLoading(true);
    setError(null);
    try {
      const updatedFile = await updateFile(id, updateData);
      setFiles((prevFiles) =>
        prevFiles.map((file) => (file.id === id ? updatedFile : file))
      );
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const removeFile = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await deleteFile(id);
      setFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const sortFiles = (newSortOptions: SortOptions) => {
    setSortOptions(newSortOptions);
    setFiles([]);
    setPage(1);
    setHasMore(true);
    fetchFiles(1, newSortOptions);
  };

  useEffect(() => {
    fetchFiles(page, sortOptions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folderId]);

  return {
    files: files || [],
    loading,
    error,
    loadMoreFiles,
    uploadNewFile,
    updateExistingFile,
    removeFile,
    sortFiles,
  };
}

export default useFiles;
