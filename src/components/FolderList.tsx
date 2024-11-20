import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Animated,
} from "react-native";
import type { Folder } from "#/types";
import { useFolders } from "#/hooks/useFolders";
import { useModal } from "#/components/Modal";

interface FolderListProps {
  folderId: string;
  onFolderPress: (folder: Folder) => void;
  footer?: React.ReactElement;
}

export const FolderList: React.FC<FolderListProps> = ({
  folderId,
  onFolderPress,
  footer,
}) => {
  const { folders, loading, error } = useFolders(folderId);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { showModal } = useModal();

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

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  React.useEffect(() => {
    if (error) {
      showModal(error.message, "error");
    }
  }, [error]);

  // if (loading) {
  //   return <Text>Loading...</Text>;
  // }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Folders</Text>
      </View>
      <FlatList
        data={folders}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        style={styles.list}
        ListFooterComponent={footer ?? <View style={{ height: 16 }} />}
      />
    </Animated.View>
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
  listContainer: {
    flex: 1,
    flexGrow: 1,
  },
  list: {
    flex: 1,
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
