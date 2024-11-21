import { CreateFolderInput, FileItem, UpdateFileInput } from "#/types";
import { Folder, Image, SortOptions } from "../types";

export const API_BASE_URL =
  process.env.VITE_API_BASE_URL || "https://actimate-takehome.netlify.app/api";

export const LIMIT = process.env.NODE_ENV === "development" ? 5 : 20;

// Helper function to handle fetch requests
const handle = async (response: Response, ...more: any[]) => {
  try {
    if (more && process.env.NODE_ENV === "development") {
      console.log("Request:", JSON.stringify(more, null, 2));
    }
    if (!response.json) {
      const errorData = await response.json();
      throw new Error(errorData.message || "API Error", {
        cause: errorData,
      });
    }
    return response.json();
  } catch (err: any) {
    console.error(
      "Error handling response:",
      err.message,
      JSON.stringify(err.cause, null, 2)
    );
    throw err;
  }
};

// Folders
export const getFolders = async (
  folderId: string,
  page: number,
  sort: SortOptions
): Promise<{ folders: Folder[]; lastKey?: any }> => {
  const url = new URL(`${API_BASE_URL}/folders`);
  url.searchParams.append("folderId", folderId);
  url.searchParams.append("sortField", sort.field);
  url.searchParams.append("sortDirection", sort.direction);
  url.searchParams.append("page", page.toString());
  url.searchParams.append("limit", LIMIT.toString());

  const response = await fetch(url.toString(), {
    method: "GET",
  });
  return handle(response, url);
};

export const createFolder = async (
  data: CreateFolderInput
): Promise<Folder> => {
  const url = new URL(`${API_BASE_URL}/folders`);
  console.log("Creating folder with data:", data); // Log the input data
  try {
    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData.message || `API Error: ${response.status}`;
      console.error(`Error creating folder: ${errorMessage}`, errorData); // Log the error details
      throw new Error(errorMessage);
    }

    const createdFolder = await response.json();
    console.log("Folder created successfully:", createdFolder); // Log the created folder
    return createdFolder;
  } catch (error: any) {
    console.error("Error CReating folder:", error); // Log the error
    throw error; // Re-throw the error to be handled by the caller
  }
};

export const deleteFolder = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/folders/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete folder");
  }
};

// Files
export const getFiles = async (
  folderId: string,
  page: number,
  sort: SortOptions
): Promise<{ files: FileItem[]; lastKey?: any }> => {
  const url = new URL(`${API_BASE_URL}/files`);
  url.searchParams.append("folderId", folderId);
  url.searchParams.append("sortField", sort.field);
  url.searchParams.append("sortDirection", sort.direction);
  url.searchParams.append("page", page.toString());
  url.searchParams.append("limit", LIMIT.toString());

  const response = await fetch(url.toString(), {
    method: "GET",
  });
  return handle(response, url);
};

export const uploadFile = async (
  folderId: string,
  formData: FormData
): Promise<FileItem> => {
  const response = await fetch(`${API_BASE_URL}/files`, {
    method: "POST",
    body: formData,
  });
  return handle(response);
};

export const updateFile = async (
  id: string,
  updateData: UpdateFileInput
): Promise<FileItem> => {
  const response = await fetch(`${API_BASE_URL}/files/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updateData),
  });
  return handle(response);
};

export const deleteFile = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/files/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete file");
  }
};
