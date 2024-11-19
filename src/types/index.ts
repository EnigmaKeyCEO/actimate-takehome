export interface Folder {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Image {
  id: string;
  folder_id: string;
  name: string;
  url: string;
  created_at: string;
  updated_at: string;
}

export interface SortOptions {
  field: 'name' | 'created_at' | 'updated_at';
  direction: 'asc' | 'desc';
}

export interface PaginationOptions {
  page: number;
  limit: number;
}

export type RootStackParamList = {
  Folders: undefined;
  FolderDetail: { folderId: string; folderName: string };
};
