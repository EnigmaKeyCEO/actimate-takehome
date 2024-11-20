import React, { useEffect, useRef } from 'react';
import { Animated, FlatList, StyleSheet } from 'react-native';
import { Folder } from '#/types';
import { useModal } from '#/components/Modal'; // TODO: move to common or context or provider... somewhere i can remember, damn
import { FolderItem } from './FolderItem';
import { LoadingIndicator } from '#/components/common/LoadingIndicator';
import { View } from 'native-base';

interface FolderListProps {
  folders: Folder[];
  loading: boolean;
  error?: string | null;
  onFolderPress: (folder: Folder) => void;
  onDeleteFolder: (folderId: string) => void;
  loadMoreFolders: () => void;
  footer?: React.ReactElement;
}

export const FolderList: React.FC<FolderListProps> = ({
  folders,
  loading,
  error,
  onFolderPress,
  onDeleteFolder,
  loadMoreFolders,
  footer,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { showModal } = useModal();

  useEffect(() => {
    if (error) {
      showModal(error, 'error');
    }
  }, [error, showModal]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const renderItem = ({ item }: { item: Folder }) => (
    <FolderItem
      folder={item}
      onPress={onFolderPress}
      onDelete={onDeleteFolder}
    />
  );

  return (
    <Animated.FlatList
      data={folders}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      onEndReached={loadMoreFolders}
      onEndReachedThreshold={0.5}
      ListFooterComponent={loading ? <LoadingIndicator /> : footer ?? <View style={{ height: 16 }} />}
      contentContainerStyle={styles.listContainer}
      style={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: 20,
  },
  list: {
    flexGrow: 0,
  },
}); 