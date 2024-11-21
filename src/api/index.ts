import { Folder, FileItem } from "#/types";
import { API_BASE_URL } from "./config";

export const getFolders = async (
  folderId: string,
  page: number,
  sortOptions: any
) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/folders?parentId=${folderId}&page=${page}&sort=${sortOptions.field}&direction=${sortOptions.direction}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch folders");
    }
    const folders = await response.json();
    if (process.env.environment === "development") {
      console.log("Fetched folders:", folders);
    }
    return folders;
  } catch (error) {
    console.error("Error fetching folders:", error);
    throw error;
  }
};

export const createFolder = async (data: any) => {
  try {
    if (process.env.environment === "development") {
      console.log("Creating folder with data:", data);
    }
    const response = await fetch(`${API_BASE_URL}/folders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Failed to create folder");
    }
    const createdFolder = await response.json();
    if (process.env.environment === "development") {
      console.log("Folder created successfully:", createdFolder);
    }
    return createdFolder;
  } catch (error) {
    console.error("Error creating folder:", error);
    throw error;
  }
};

export const getFiles = async (
  folderId: string,
  lastKey: string | null,
  sortOptions: any
) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/files?folderId=${folderId}&lastKey=${lastKey}&sort=${sortOptions.field}&direction=${sortOptions.direction}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch files");
    }
    const files = await response.json();
    if (process.env.environment === "development") {
      console.log("Fetched files:", files);
    }
    return files;
  } catch (error) {
    console.error("Error fetching files:", error);
    throw error;
  }
};

export const uploadFile = async (folderId: string, fileData: FormData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/files`, {
      method: "POST",
      body: fileData,
    });
    if (!response.ok) {
      throw new Error("Failed to upload file");
    }
    const uploadedFile = await response.json();
    if (process.env.environment === "development") {
      console.log("File uploaded successfully:", uploadedFile);
    }
    return uploadedFile;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

export const updateFile = async (folderId: string, file: FileItem) => {
  try {
    const response = await fetch(`${API_BASE_URL}/files/${file.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(file),
    });
    if (!response.ok) {
      throw new Error("Failed to update file");
    }
    const updatedFile = await response.json();
    if (process.env.environment === "development") {
      console.log("File updated successfully:", updatedFile);
    }
    return updatedFile;
  } catch (error) {
    console.error("Error updating file:", error);
    throw error;
  }
};

export const deleteFolder = async (folderId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/folders/${folderId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete folder");
    }
    if (process.env.environment === "development") {
      console.log("Folder deleted successfully");
    }
  } catch (error) {
    console.error("Error deleting folder:", error);
    throw error;
  }
};

export const updateFolder = async (folderId: string, data: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/folders/${folderId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Failed to update folder");
    }
    const updatedFolder = await response.json();
    if (process.env.environment === "development") {
      console.log("Folder updated successfully:", updatedFolder);
    }
    return updatedFolder;
  } catch (error) {
    console.error("Error updating folder:", error);
    throw error;
  }
};

export const getFolderById = async (folderId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/folders/${folderId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch folder");
    }
    const folder = await response.json();
    if (process.env.environment === "development") {
      console.log("Fetched folder:", folder);
    }
    return folder;
  } catch (error) {
    console.error("Error fetching folder:", error);
    throw error;
  }
};
