export interface SortOptions {
  field: "name" | "created_at" | "updated_at";
  direction: "asc" | "desc";
}

export type SortField = SortOptions["field"];

export interface Folder extends Record<SortField, string> {
  id: string;
}

export interface Image extends Record<SortField, string> {
  id: string;
  folder_id: string;
  name: string;
  url: string;
  created_at: string;
  updated_at: string;
}

export interface PaginationOptions {
  page: number;
  limit: number;
}

export type RootStackParamList = {
  Folders: undefined;
  FolderDetail: { folderId: string; folderName: string };
};
