import axios from 'axios';
import { Folder, Image } from '../types';

const API_BASE_URL = process.env.VITE_API_BASE_URL || 'https://actimate-takehome.netlify.app/api';

// Folders
export const getFolders = async (page: number, sort: string): Promise<{ folders: Folder[]; lastKey?: string }> => {
  const response = await axios.get(`${API_BASE_URL}/folders`, { params: { page, sort } });
  return response.data;
};

export const createFolder = async (name: string): Promise<Folder> => {
  const response = await axios.post(`${API_BASE_URL}/folders`, { name });
  return response.data;
};

export const updateFolder = async (id: string, name: string): Promise<Folder> => {
  const response = await axios.put(`${API_BASE_URL}/folders/${id}`, { name });
  return response.data;
};

export const deleteFolder = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/folders/${id}`);
};

// Images
export const getImages = async (folderId: string, page: number, sort: string): Promise<{ images: Image[]; lastKey?: string }> => {
  const response = await axios.get(`${API_BASE_URL}/folders/${folderId}/images`, { params: { page, sort } });
  return response.data;
};

export const uploadImage = async (folderId: string, file: File): Promise<Image> => {
  // Get signed URL from backend
  const { url, key } = await axios.get(`${API_BASE_URL}/folders/${folderId}/images/upload`, { params: { filename: file.name } }).then(res => res.data);

  // Upload to S3
  await fetch(url, {
    method: 'PUT',
    body: file,
  });

  // Create image record in backend
  const response = await axios.post(`${API_BASE_URL}/folders/${folderId}/images`, { key, name: file.name });
  return response.data;
};

export const deleteImage = async (folderId: string, id: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/folders/${folderId}/images/${id}`);
};
