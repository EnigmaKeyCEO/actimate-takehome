import React from "react";
import { FolderContext } from "#/contexts/FolderContext";

export const useFolder = () => {
  const context = React.useContext(FolderContext);
  if (context === undefined) {
    throw new Error("useFolder must be used within a FolderProvider");
  }
  return context;
};

export default useFolder;
