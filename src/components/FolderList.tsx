import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import type { Folder, SortOptions } from "../types";
import { useFolders } from "../hooks/useFolders";

interface FolderListProps {
  folderId: string;
  onFolderPress: (folder: Folder) => void;
  onSort: (options: SortOptions) => void;
  footer?: React.ReactElement;
}

export const FolderList: React.FC<FolderListProps> = ({
  folderId,
  onFolderPress,
  onSort,
  footer,
}) => {
  const { folders, sortFolders } = useFolders(folderId);

  const renderItem = React.useCallback(
    ({ item }: { item: Folder }) => (
      <TouchableOpacity
        style={styles.folderItem}
        onPress={() => onFolderPress(item)}
      >
        <Text style={styles.folderName}>{item.name}</Text>
        <Text style={styles.folderDate}>
          Created: {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </TouchableOpacity>
    ),
    [onFolderPress]
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Folders</Text>
        <View style={styles.sortButtons}>
          <TouchableOpacity
            onPress={() => onSort({ field: "name", direction: "asc" })}
            style={styles.sortButton}
          >
            <Text>Sort by Name</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onSort({ field: "createdAt", direction: "desc" })}
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
        contentContainerStyle={styles.listContainer}
        style={styles.list}
        ListFooterComponent={footer ?? <View style={{ height: 16 }} />}
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  sortButtons: {
    flexDirection: "row",
  },
  sortButton: {
    marginLeft: 8,
    padding: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
  },
  listContainer: {
    flex: 1,
    flexGrow: 1,
  },
  list: {
    flex: 1
  },
  folderItem: {
    padding: 16,
    backgroundColor: "white",
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  folderName: {
    fontSize: 18,
    fontWeight: "500",
  },
  folderDate: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
});
