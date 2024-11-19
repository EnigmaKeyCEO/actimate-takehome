import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, ActivityIndicator, StyleSheet } from 'react-native';
import { getFolders, createFolder, updateFolder, deleteFolder } from '../api/api';
import { Folder } from '../types/Folder';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/RootStackParamList';
import { useNavigation } from '@react-navigation/native';

type FolderManagementScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Folders'
>;

const FolderManagementScreen: React.FC = () => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [sort, setSort] = useState<string>('name');
  const [lastKey, setLastKey] = useState<string | undefined>(undefined);

  const navigation = useNavigation<FolderManagementScreenNavigationProp>();

  const fetchFolders = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const data = await getFolders(page, sort);
      setFolders(prev => [...prev, ...data.folders]);
      setLastKey(data.lastKey);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFolders();
  }, [page, sort]);

  const handleAddFolder = async () => {
    const newFolder = await createFolder('New Folder');
    setFolders([newFolder, ...folders]);
  };

  const handleDeleteFolder = async (id: string) => {
    await deleteFolder(id);
    setFolders(folders.filter(folder => folder.id !== id));
  };

  const handlePressFolder = (id: string) => {
    navigation.navigate('FolderDetail', { folderId: id });
  };

  const renderItem = ({ item }: { item: Folder }) => (
    <View style={styles.folderItem}>
      <Text style={styles.folderName} onPress={() => handlePressFolder(item.id)}>
        {item.name}
      </Text>
      <Button title="Delete" onPress={() => handleDeleteFolder(item.id)} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Button title="Add Folder" onPress={handleAddFolder} />
      <FlatList
        data={folders}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        onEndReached={() => {
          if (lastKey) {
            setPage(prev => prev + 1);
          }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading ? <ActivityIndicator /> : null}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  folderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  folderName: {
    fontSize: 18,
    flex: 1,
  },
});

export default FolderManagementScreen;
