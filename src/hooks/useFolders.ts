import { useState, useEffect } from 'react';
import { collection, addDoc, query, orderBy, getDocs, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import type { Folder, SortOptions } from '../types';

export function useFolders(parentId?: string) {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchFolders = async (sort?: SortOptions) => {
    try {
      const foldersRef = collection(db, 'folders');
      const baseQuery = query(foldersRef, where('parentId', '==', parentId || 'root'));
      const q = sort
        ? query(baseQuery, orderBy(sort.field, sort.direction))
        : baseQuery;
      
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

  const createFolder = async (folderData: Omit<Folder, 'id'>) => {
    try {
      const foldersRef = collection(db, 'folders');
      await addDoc(foldersRef, folderData);
      await fetchFolders(); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      throw err;
    }
  };

  useEffect(() => {
    fetchFolders();
  }, []);

  const sortFolders = (sort: SortOptions) => {
    fetchFolders(sort);
  };

  return {
    folders,
    loading,
    error,
    createFolder,
    sortFolders,
  };
}

export default useFolders;
