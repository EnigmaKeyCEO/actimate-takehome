export interface Folder {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Image {
  id: string;
  folderId: string;
  key: string;
  url: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}
