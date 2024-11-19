export interface Folder {
  id: string;
  parentId?: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFolderInput extends Omit<Folder, "id"> {
  name: string;
  parentId?: string;
}