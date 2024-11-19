export interface SortOptions {
  field: "name" | "createdAt" | "updatedAt";
  direction: "asc" | "desc";
}

export type SortField = SortOptions["field"];

export type { Folder } from './Folder';
export type { Image } from './Image';
export type { CreateFolderInput } from './Folder'; // Add this line

export interface PaginationOptions {
  page: number;
  limit: number;
}

export type RootStackParamList = {
  Folders: undefined;
  FolderDetail: { folderId: string; folderName: string };
};
