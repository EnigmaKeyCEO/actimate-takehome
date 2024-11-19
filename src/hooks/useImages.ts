import { useState, useEffect } from 'react';
import type { Image, SortOptions } from '../types';
import {
  getImages as apiGetImages,
  uploadImage as apiUploadImage,
  deleteImage as apiDeleteImage,
} from '../api/api';
import { ImagePickerAsset } from 'expo-image-picker';

export function useImages(folderId: string) {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [sortOptions, setSortOptions] = useState<SortOptions | undefined>(undefined);
  const [page, setPage] = useState<number>(1);
  const [lastKey, setLastKey] = useState<any>(undefined);

  const fetchImages = async (sort?: SortOptions, pageNumber: number = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiGetImages(folderId, pageNumber, sort || { field: 'name', direction: 'asc' });
      if (pageNumber === 1) {
        setImages(response.images);
      } else {
        setImages((prev) => [...prev, ...response.images]);
      }
      setLastKey(response.lastKey);
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (fileAsset: ImagePickerAsset) => {
    try {
      const { uri } = fileAsset;
      const filename = uri.split('/').pop() || 'upload.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image';

      const formData = new FormData();
      formData.append('file', {
        uri,
        name: filename,
        type,
      } as any);

      const newImage = await apiUploadImage(folderId, formData);
      setImages([newImage, ...images]);
      return newImage;
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      throw err;
    }
  };

  const deleteImage = async (id: string, filename: string) => {
    try {
      await apiDeleteImage(folderId, id, filename);
      setImages((prev) => prev.filter((image) => image.id !== id));
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      throw err;
    }
  };

  const sortImages = (sort: SortOptions) => {
    setSortOptions(sort);
    setPage(1);
    fetchImages(sort, 1);
  };

  const loadMoreImages = () => {
    if (lastKey) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchImages(sortOptions, nextPage);
    }
  };

  useEffect(() => {
    fetchImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folderId]);

  return {
    images,
    loading,
    error,
    uploadImage,
    deleteImage,
    sortImages,
    loadMoreImages,
  };
}

export default useImages;