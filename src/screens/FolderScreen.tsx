import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useFolders } from '../hooks/useFolders';
import { FolderList } from '../components/FolderList';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';

type Props = NativeStackScreenProps<RootStackParamList, 'Folders'>;

export function FolderScreen({ navigation }: Props) {
  const { folders, loading, error, createFolder, sortFolders } = useFolders();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error.message} />;
  }

  return (
    <View style={styles.container}>
      <FolderList
        folders={folders}
        onFolderPress={(folder) => {
          navigation.navigate('FolderDetail', {
            folderId: folder.id,
            folderName: folder.name,
          });
        }}
        onSort={sortFolders}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});

export default FolderScreen;
