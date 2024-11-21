export interface FileItem {
  id: string;
  folderId: string;
  key: string;
  url: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFileInput {
  uri: string;
  name: string;
  type: string;
  folderId: string;
}

export interface UpdateFileInput {
  name?: string;
  folderId?: string;
}

export interface FileUpload {
  uri: string;
  name: string;
  type: string;
}
