import { useState, useEffect } from 'react';
import { collection, query, orderBy, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import type { Folder, SortOptions } from '../types';

export function useFolders() {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchFolders = async (sort?: SortOptions) => {
    try {
      const foldersRef = collection(db, 'folders');
      const q = sort
        ? query(foldersRef, orderBy(sort.field, sort.direction))
        : query(foldersRef);
      
      const querySnapshot = await getDocs(q);
      const fetchedFolders = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Folder[];
      
      setFolders(fetchedFolders);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const createFolder = async (name: string) => {
    try {
      const foldersRef = collection(db, 'folders');
      await addDoc(foldersRef, {
        name,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      
      await fetchFolders();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    }
  };

  const sortFolders = (options: SortOptions) => {
    fetchFolders(options);
  };

  useEffect(() => {
    fetchFolders();
  }, []);

  return { folders, loading, error, createFolder, sortFolders };
}