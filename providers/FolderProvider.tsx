import React, { useRef, useState } from "react";
import useAmplify from "../hooks/useAmplify";
import { Folder } from "../types";
import { FolderContext, FolderContextType, ROOT_FOLDER } from "#/contexts/FolderContext";

const FolderProvider = ({ children }: { children: React.ReactNode }) => {
  const { create, list } = useAmplify();
  const [folders, setFolders] = useState<Array<Folder>>([]);
  const currentFolder = useRef<Folder>(ROOT_FOLDER);
  const nextToken = useRef<string | null>(null);

  const createFolder: FolderContextType["createFolder"] = React.useCallback(
    async (name: Folder["name"]) => {
      const result = await create<Folder>({
        name,
        //   parentFolderId: currentFolder.current, // TODO: Fix this rather large oversight
      } as Folder);
      return result;
    },
    [create]
  );

  const getFolders: FolderContextType["getFolders"] = React.useCallback(
    async (folderID: string = currentFolder.current.id) => {
      const result = await list<Folder>(folderID);
      nextToken.current = result?.nextToken ?? null;
      if (result?.items === null) {
        setFolders([]);
        return null;
      }
      setFolders((prevFolders) => [
        ...prevFolders,
        ...(result?.items as Array<Folder>),
      ]);
      return result?.items as Array<Folder>;
    },
    [list]
  );

  const value = React.useMemo(
    () => ({
      folders: folders ?? [],
      currentFolder: currentFolder.current ?? "root",
      getFolders,
      createFolder,
    }),
    [folders, getFolders, createFolder]
  );

  return (
    <FolderContext.Provider value={value}>{children}</FolderContext.Provider>
  );
};

export default FolderProvider;
