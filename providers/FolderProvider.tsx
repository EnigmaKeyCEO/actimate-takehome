import React from "react";
import useAmplify from "../hooks/useAmplify";
import { Folder } from "../types";

type FolderContextType = {
  getFolders: (folderID: string) => Promise<Array<Folder>>;
};

const FolderContext = React.createContext<FolderContextType>({
  getFolders: async () => Promise.resolve([]),
});

const FolderProvider = ({ children }: { children: React.ReactNode }) => {
  const { read } = useAmplify();

  const getFolders = async (folderID: string = "root") => {
    const result = await read(folderID);
    return result as Array<Folder>;
  };
  return (
    <FolderContext.Provider value={{ getFolders }}>
      {children}
    </FolderContext.Provider>
  );
};

export default FolderProvider;
