import { Folder, Image, SortOptions } from "../types";

const API_BASE_URL = process.env.VITE_API_BASE_URL || "/.netlify/functions";

// Helper function to handle fetch requests
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "API Error");
  }
  return response.json();
};

// Folders
export const getFolders = async (
  parentId: string,
  page: number,
  sort: SortOptions
): Promise<{ folders: Folder[]; lastKey?: any }> => {
  const url = new URL(`${API_BASE_URL}/folders`);
  url.searchParams.append("parentId", parentId);
  url.searchParams.append("sortField", sort.field);
  url.searchParams.append("sortDirection", sort.direction);
  url.searchParams.append("page", page.toString());
  url.searchParams.append("limit", "20");

  const response = await fetch(url.toString(), {
    method: "GET",
  });
  return handleResponse(response);
};

export const createFolder = async (data: Partial<Folder>): Promise<Folder> => {
  const response = await fetch(`${API_BASE_URL}/folders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const updateFolder = async (
  id: string,
  data: Partial<Folder>
): Promise<Folder> => {
  const response = await fetch(`${API_BASE_URL}/folders/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
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

// Images
export const getImages = async (
  folderId: string,
  page: number,
  sort: SortOptions
): Promise<{ images: Image[]; lastKey?: any }> => {
  const url = new URL(`${API_BASE_URL}/folders/${folderId}/images`);
  url.searchParams.append("sortField", sort.field);
  url.searchParams.append("sortDirection", sort.direction);
  url.searchParams.append("page", page.toString());
  url.searchParams.append("limit", "20");

  const response = await fetch(url.toString(), {
    method: "GET",
  });
  return handleResponse(response);
};

export const uploadImage = async (
  folderId: string,
  formData: FormData
): Promise<Image> => {
  const file = formData.get("file") as File;
  // Get signed URL from backend
  const uploadUrlResponse = await fetch(
    `${API_BASE_URL}/folders/${folderId}/images/upload?filename=${encodeURIComponent(
      file.name
    )}`,
    {
      method: "GET",
    }
  );
  const { uploadUrl, filename } = await handleResponse(uploadUrlResponse);

  // Upload to S3
  const uploadResponse = await fetch(uploadUrl, {
    method: "PUT",
    body: file,
  });
  if (!uploadResponse.ok) {
    throw new Error("Failed to upload image to S3");
  }

  // Create image record in backend
  const createImageResponse = await fetch(
    `${API_BASE_URL}/folders/${folderId}/images`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        key: filename,
        name: file.name,
        contentType: file.type,
        size: file.size,
      }),
    }
  );
  return handleResponse(createImageResponse);
};

export const deleteImage = async (
  folderId: string,
  id: string,
  filename: string
): Promise<void> => {
  const url = new URL(`${API_BASE_URL}/folders/${folderId}/images/${id}`);
  url.searchParams.append("filename", filename);

  const response = await fetch(url.toString(), {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete image");
  }
};
