export interface SortOptions {
  field: "name" | "createdAt" | "updatedAt";
  direction: "asc" | "desc";
}

export type SortField = SortOptions["field"];

export type { Folder } from './Folder';
export type { Image } from './Image';
export type { FileUpload, FileItem, CreateFileInput, UpdateFileInput } from './File';
export type { CreateFolderInput } from './Folder';

export type RootStackParamList = {
  Folders: { folderId?: string; };
};
