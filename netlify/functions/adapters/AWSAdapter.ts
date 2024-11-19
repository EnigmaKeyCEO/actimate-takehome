import {
  StorageAdapter,
  FolderData,
  FolderResponse,
  ImageData,
  ImageResponse,
  SortOptions,
  PaginationOptions,
  FolderContentsResponse,
} from "./StorageAdapter";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  DynamoDB,
  ScanCommandInput,
  UpdateItemCommandInput,
} from "@aws-sdk/client-dynamodb";
import { Folder, SortField } from "../../../src/types";

export class AWSAdapter implements StorageAdapter {
  private s3: S3Client;
  private dynamodb: DynamoDB;
  private bucket: string;

  constructor() {
    this.s3 = new S3Client({ region: process.env.VITE_AWS_REGION });
    this.dynamodb = new DynamoDB({ region: process.env.VITE_AWS_REGION });
    this.bucket = process.env.VITE_AWS_BUCKET_NAME || "";
  }

  // Implement all interface methods here
  // Example implementation:
  async getUploadUrl(
    filename: string,
    contentType: string
  ): Promise<{
    uploadUrl: string;
    filename: string;
  }> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: filename,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(this.s3, command, { expiresIn: 3600 });
    return { uploadUrl, filename };
  }

  async createFolder(data: FolderData): Promise<FolderResponse> {
    const params = {
      TableName: "folders",
      Item: {
        id: { S: Date.now().toString() },
        name: { S: data.name },
        parentId: { S: data.parentId || "" },
        createdAt: { N: data.createdAt.toString() },
        updatedAt: { N: data.updatedAt.toString() },
      },
    };

    await this.dynamodb.putItem(params);
    return {
      id: params.Item.id.S,
      name: data.name,
      parentId: data.parentId,
    };
  }

  async listFolders(
    sort?: SortOptions,
    pagination?: PaginationOptions
  ): Promise<FolderResponse[]> {
    const params = {
      TableName: "folders",
      Select: "ALL_ATTRIBUTES",
    } as ScanCommandInput;

    const result = await this.dynamodb.scan(params);
    let folders = (result.Items || []).map((item) => ({
      id: item.id.S || "",
      name: item.name.S || "",
      parentId: item.parentId.S || null,
      created_at: new Date(Number(item.createdAt.N)).toISOString(),
      updated_at: new Date(Number(item.updatedAt.N)).toISOString(),
    }));

    if (sort) {
      folders.sort((a, b) => {
        const aValue = a[sort.field as SortField];
        const bValue = b[sort.field as SortField];
        return sort.direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      });
    }

    if (pagination) {
      const { page, limit } = pagination;
      folders = folders.slice(page * limit, (page + 1) * limit);
    }

    return folders.map((folder) => ({
      ...folder,
      parentId: null,
    }));
  }

  async updateFolder(
    id: string,
    data: Partial<FolderData>
  ): Promise<FolderResponse> {
    const params = {
      TableName: "folders",
      Key: { id: { S: id } },
      UpdateExpression: "SET",
      ExpressionAttributeValues: {},
    } as UpdateItemCommandInput;

    if (data.name) {
      params.UpdateExpression += " #name = :name";
      params.ExpressionAttributeNames = { "#name": "name" };
      params.ExpressionAttributeValues = { ":name": { S: data.name } };
    }

    await this.dynamodb.updateItem(params);

    // Get updated item
    const getParams = {
      TableName: "folders",
      Key: { id: { S: id } },
    };

    const result = await this.dynamodb.getItem(getParams);
    const item = result.Item;

    return {
      id,
      parentId: item?.parentId.S || null,
      name: item?.name.S || "",
    };
  }

  async deleteFolder(id: string): Promise<void> {
    const params = {
      TableName: "folders",
      Key: { id: { S: id } },
    };

    await this.dynamodb.deleteItem(params);
  }

  async createImage(data: ImageData): Promise<ImageResponse> {
    const params = {
      TableName: "images",
      Item: {
        id: { S: Date.now().toString() },
        folder_id: { S: data.folderId },
        name: { S: data.name },
        url: { S: `https://${this.bucket}.s3.amazonaws.com/${data.filename}` },
        created_at: { N: data.createdAt.toString() },
        updated_at: { N: data.updatedAt.toString() },
      },
    };

    await this.dynamodb.putItem(params);
    return {
      id: params.Item.id.S,
      folderId: data.folderId,
      name: data.name,
      url: params.Item.url.S,
      created_at: new Date(data.createdAt).toISOString(),
      updated_at: new Date(data.updatedAt).toISOString(),
    };
  }

  async listImages(
    sort?: SortOptions,
    pagination?: PaginationOptions
  ): Promise<ImageResponse[]> {
    const params = {
      TableName: "images",
      Select: "ALL_ATTRIBUTES",
    } as ScanCommandInput;

    const result = await this.dynamodb.scan(params);
    let images = (result.Items || []).map((item) => ({
      id: item.id.S || "",
      folderId: item.folder_id.S || "",
      name: item.name.S || "",
      url: item.url.S || "",
      created_at: new Date(Number(item.createdAt.N)).toISOString(),
      updated_at: new Date(Number(item.updatedAt.N)).toISOString(),
    }));

    if (sort) {
      images.sort((a, b) => {
        const aValue = a[sort.field as SortField];
        const bValue = b[sort.field as SortField];
        return sort.direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      });
    }

    if (pagination) {
      const { page, limit } = pagination;
      images = images.slice(page * limit, (page + 1) * limit);
    }

    return images;
  }

  async deleteImage(id: string, filename: string): Promise<void> {
    // Delete from S3
    const s3Params = {
      Bucket: this.bucket,
      Key: filename,
    };
    await this.s3.send(new DeleteObjectCommand(s3Params));

    // Delete from DynamoDB
    const dbParams = {
      TableName: "images",
      Key: { id: { S: id } },
    };
    await this.dynamodb.deleteItem(dbParams);
  }

  async listFolderContents(
    folderId: string,
    sort?: SortOptions,
    pagination?: PaginationOptions
  ): Promise<FolderContentsResponse> {
    // Get folders
    const folderParams = {
      TableName: "folders",
      FilterExpression: "parentId = :folderId",
      ExpressionAttributeValues: {
        ":folderId": { S: folderId },
      },
    };

    // Get images
    const imageParams = {
      TableName: "images",
      FilterExpression: "folder_id = :folderId",
      ExpressionAttributeValues: {
        ":folderId": { S: folderId },
      },
    };

    const [folderResult, imageResult] = await Promise.all([
      this.dynamodb.scan(folderParams),
      this.dynamodb.scan(imageParams),
    ]);

    let folders = (folderResult.Items || []).map((item) => ({
      id: item.id.S || "",
      name: item.name.S || "",
      parentId: item.parentId.S || null,
      created_at: new Date(Number(item.createdAt.N)).toISOString(),
      updated_at: new Date(Number(item.updatedAt.N)).toISOString(),
    }));

    let images = (imageResult.Items || []).map((item) => ({
      id: item.id.S || "",
      folder_id: item.folder_id.S || "",
      name: item.name.S || "",
      url: item.url.S || "",
      created_at: new Date(Number(item.createdAt.N)).toISOString(),
      updated_at: new Date(Number(item.updatedAt.N)).toISOString(),
    }));

    if (sort) {
      folders.sort((a, b) => {
        const aValue = a[sort.field as SortField];
        const bValue = b[sort.field as SortField];
        return sort.direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      });

      images.sort((a, b) => {
        const aValue = a[sort.field as SortField];
        const bValue = b[sort.field as SortField];
        return sort.direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      });
    }

    if (pagination) {
      const { page, limit } = pagination;
      folders = folders.slice(page * limit, (page + 1) * limit);
      images = images.slice(page * limit, (page + 1) * limit);
    }

    return {
      folders: folders,
      images: images.map((image) => ({
        ...image,
        folderId: image.folder_id,
      })),
    };
  }
}
