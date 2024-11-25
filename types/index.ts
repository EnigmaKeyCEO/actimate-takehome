export * from "./responses";

export type ImageType = {
  uri: string;
  name: string;
};

export type FileType = {
  id: string;
  name: string;
  folderID: string;
};

export type FolderType = {
  id: string;
  parentFolderID: string | "root";
  name: string;
};