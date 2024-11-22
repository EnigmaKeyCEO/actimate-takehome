import { PutItemCommand } from "@aws-sdk/client-dynamodb";

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

export interface DBMetadata {
  file: FileItem | null;
  putCommand: PutItemCommand | null;
  lastKey: string | null;
}

export interface FileUploadResponse {
  message: string;
  fileId: string;
  signedUrl: string;
  key: string;
}
