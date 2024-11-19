import { SortOptions } from "@/types";

interface FolderResponse {
  id: string;
  name: string;
  parentId: string | null;
}

interface UploadUrlResponse {
  uploadUrl: string;
  filename: string;
}

interface ImageResponse {
  id: string;
  name: string;
  folderId: string;
  url: string;
  created_at: string;
  updated_at: string;
}

interface FolderContentsResponse {
  folders: FolderResponse[];
  images: ImageResponse[];
}

interface StorageAdapter {
  createFolder(data: FolderData): Promise<FolderResponse>;
  listFolders(
    sort?: SortOptions,
    pagination?: PaginationOptions
  ): Promise<FolderResponse[]>;
  updateFolder(id: string, data: Partial<FolderData>): Promise<FolderResponse>;
  deleteFolder(id: string): Promise<void>;
  getUploadUrl(
    filename: string,
    contentType: string
  ): Promise<UploadUrlResponse>;
  createImage(data: ImageData): Promise<ImageResponse>;
  listImages(
    sort?: SortOptions,
    pagination?: PaginationOptions
  ): Promise<ImageResponse[]>;
  deleteImage(id: string, filename: string): Promise<void>;
  listFolderContents(
    folderId: string,
    sort?: SortOptions,
    pagination?: PaginationOptions
  ): Promise<FolderContentsResponse>;
}

interface PaginationOptions {
  page: number;
  limit: number;
}

interface FolderData {
  name: string;
  parentId: string | null;
  createdAt: number;
  updatedAt: number;
}

interface ImageData {
  name: string;
  folderId: string;
  filename: string;
  contentType: string;
  size: number;
  createdAt: number;
  updatedAt: number;
}

export type {
  StorageAdapter,
  SortOptions,
  PaginationOptions,
  FolderData,
  ImageData,
  FolderResponse,
  UploadUrlResponse,
  ImageResponse,
  FolderContentsResponse,
};
