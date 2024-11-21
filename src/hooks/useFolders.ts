import React, { useContext } from "react";
import { FolderContext } from "#/providers/FolderProvider";

export function useFolders(parentId?: string) {
  const context = useContext(FolderContext);
  React.useEffect(() => {
    if (parentId && parentId !== context.parentId) {
      context.enterFolder(parentId);
    }
  }, [parentId]);
  if (!context) {
    throw new Error("useFolders must be used within a FolderProvider");
  }
  return context;
}
