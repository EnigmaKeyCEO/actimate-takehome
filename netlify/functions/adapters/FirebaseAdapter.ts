import { Folder, Image } from "../../../src/types";
import {
  StorageAdapter,
  FolderData,
  ImageData,
  SortOptions,
  PaginationOptions,
  FolderResponse,
  ImageResponse,
  FolderContentsResponse,
  UploadUrlResponse,
} from "./StorageAdapter";
import { DocumentData, getFirestore, Query } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

export class FirebaseAdapter implements StorageAdapter {
  private db = getFirestore();
  private storage = getStorage();
  private bucket = this.storage.bucket();

  async createFolder(data: FolderData): Promise<FolderResponse> {
    const docRef = await this.db.collection("folders").add(data);
    const newDoc = await docRef.get();
    return { id: docRef.id, ...newDoc.data() } as FolderResponse;
  }

  async listFolders(
    sort?: SortOptions,
    pagination?: PaginationOptions
  ): Promise<FolderResponse[]> {
    let query = this.db.collection("folders") as Query<DocumentData>;

    if (sort) {
      query = query.orderBy(sort.field, sort.direction);
    }

    if (pagination) {
      const { page, limit } = pagination;
      query = query.limit(limit).offset(page * limit);
    }

    const snapshot = await query.get();
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as FolderResponse[];
  }

  async updateFolder(
    id: string,
    data: Partial<FolderData>
  ): Promise<FolderResponse> {
    await this.db.collection("folders").doc(id).update(data);
    const updated = await this.db.collection("folders").doc(id).get();
    return { id, ...updated.data() } as FolderResponse;
  }

  async deleteFolder(id: string): Promise<void> {
    await this.db.collection("folders").doc(id).delete();
  }

  async getUploadUrl(
    filename: string,
    contentType: string
  ): Promise<UploadUrlResponse> {
    const storagePath = `images/${Date.now()}-${filename}`;
    const file = this.bucket.file(storagePath);

    const [uploadUrl] = await file.getSignedUrl({
      version: "v4",
      action: "write",
      expires: Date.now() + 3600 * 1000, // 1 hour
      contentType,
    });

    return { uploadUrl, filename: storagePath };
  }

  async createImage(data: ImageData): Promise<ImageResponse> {
    const docRef = await this.db.collection("images").add(data);
    const newDoc = await docRef.get();
    return { id: docRef.id, ...newDoc.data() } as ImageResponse;
  }

  async listImages(
    sort?: SortOptions,
    pagination?: PaginationOptions
  ): Promise<ImageResponse[]> {
    let query = this.db.collection("images") as Query<DocumentData>;

    if (sort) {
      query = query.orderBy(sort.field, sort.direction);
    }

    if (pagination) {
      const { page, limit } = pagination;
      query = query.limit(limit).offset(page * limit);
    }

    const snapshot = await query.get();
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as ImageResponse[];
  }

  async deleteImage(id: string, filename: string): Promise<void> {
    // Delete from Storage
    await this.bucket.file(filename).delete();

    // Delete from Firestore
    await this.db.collection("images").doc(id).delete();
  }

  async listFolderContents(
    folderId: string,
    sort?: SortOptions,
    pagination?: PaginationOptions
  ): Promise<FolderContentsResponse> {
    // Query folders with matching parentId
    let foldersQuery = this.db
      .collection("folders")
      .where("parentId", "==", folderId);
    let imagesQuery = this.db
      .collection("images")
      .where("folderId", "==", folderId);

    if (sort) {
      foldersQuery = foldersQuery.orderBy(sort.field, sort.direction);
      imagesQuery = imagesQuery.orderBy(sort.field, sort.direction);
    }

    if (pagination) {
      const { page, limit } = pagination;
      foldersQuery = foldersQuery.limit(limit).offset(page * limit);
      imagesQuery = imagesQuery.limit(limit).offset(page * limit);
    }

    const [foldersSnapshot, imagesSnapshot] = await Promise.all([
      foldersQuery.get(),
      imagesQuery.get(),
    ]);

    return {
      folders: foldersSnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        parentId: doc.data().parentId,
        created_at: doc.data().created_at,
        updated_at: doc.data().updated_at,
      })) as FolderResponse[],
      images: imagesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ImageResponse[],
    };
  }
}
