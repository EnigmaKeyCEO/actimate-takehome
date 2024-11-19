import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, addDoc, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../config/firebase';
import type { Image, SortOptions } from '../types';

export function useImages(folderId: string) {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchImages = async (sort?: SortOptions) => {
    try {
      const imagesRef = collection(db, 'images');
      const q = sort
        ? query(
            imagesRef,
            where('folder_id', '==', folderId),
            orderBy(sort.field, sort.direction)
          )
        : query(imagesRef, where('folder_id', '==', folderId));
      
      const querySnapshot = await getDocs(q);
      const fetchedImages = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Image[];
      
      setImages(fetchedImages);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file: File) => {
    try {
      // Upload file to Firebase Storage
      const storageRef = ref(storage, `images/${Date.now()}-${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(storageRef);

      // Create image record in Firestore
      const imagesRef = collection(db, 'images');
      await addDoc(imagesRef, {
        folder_id: folderId,
        name: file.name,
        url: downloadUrl,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      
      await fetchImages();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    }
  };

  const sortImages = (options: SortOptions) => {
    fetchImages(options);
  };

  useEffect(() => {
    fetchImages();
  }, [folderId]);

  return { images, loading, error, uploadImage, sortImages };
}