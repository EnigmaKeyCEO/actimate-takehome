import React from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';
import { useModal } from '../Modal'; // Removed ModalMessageType import
import { Button } from 'native-base';
import { FileItem } from '../../types/File';

interface FilesListProps {
  files: FileItem[];
  loadMoreFiles: () => void;
  removeFile: (id: string) => void;
  loading?: boolean; // Made optional
  error?: string | null; // Made optional
}

export const FilesList: React.FC<FilesListProps> = ({ files, loadMoreFiles, removeFile, loading, error }) => {
  const { showModal } = useModal(); // Removed generic type argument

  const renderItem = ({ item }: { item: FileItem }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.fileName}>{item.name}</Text>
      <Button
        onPress={() => showModal(`You pressed on ${item.name}`, 'info')}
        accessibilityRole="button"
        accessibilityLabel={`Press to interact with ${item.name}`}
      >
        Press
      </Button>
    </View>
  );

  return (
    <FlatList
      data={files}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContainer}
      onEndReached={loadMoreFiles}
      onEndReachedThreshold={0.5}
      ListFooterComponent={<View style={{ height: 16 }} />}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  fileName: {
    fontSize: 16,
  },
});
