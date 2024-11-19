import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import type { Folder, SortOptions } from '../types';

interface FolderListProps {
  folders: Folder[];
  onFolderPress: (folder: Folder) => void;
  onSort: (options: SortOptions) => void;
}

export const FolderList: React.FC<FolderListProps> = ({
  folders,
  onFolderPress,
  onSort,
}) => {
  const renderItem = ({ item }: { item: Folder }) => (
    <TouchableOpacity
      style={styles.folderItem}
      onPress={() => onFolderPress(item)}
    >
      <Text style={styles.folderName}>{item.name}</Text>
      <Text style={styles.folderDate}>
        Created: {new Date(item.created_at).toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Folders</Text>
        <View style={styles.sortButtons}>
          <TouchableOpacity
            onPress={() => onSort({ field: 'name', direction: 'asc' })}
            style={styles.sortButton}
          >
            <Text>Sort by Name</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onSort({ field: 'created_at', direction: 'desc' })}
            style={styles.sortButton}
          >
            <Text>Sort by Date</Text>
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={folders}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  sortButtons: {
    flexDirection: 'row',
  },
  sortButton: {
    marginLeft: 8,
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
  },
  list: {
    flex: 1,
  },
  folderItem: {
    padding: 16,
    backgroundColor: 'white',
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  folderName: {
    fontSize: 18,
    fontWeight: '500',
  },
  folderDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});