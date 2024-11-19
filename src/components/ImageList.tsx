import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import type { Image, SortOptions } from "../types";
import { useImages } from "#/hooks/useImages";

interface ImageListProps {
  folderId: string;
  onDeleteImage: (id: string, filename: string) => void;
  onSort: (options: SortOptions) => void;
}

export const ImageList: React.FC<ImageListProps> = ({
  folderId,
  onDeleteImage,
  onSort,
}) => {
  const { images, sortImages } = useImages(folderId);

  const renderItem = React.useCallback(
    ({ item }: { item: Image }) => (
      <View style={styles.imageItem}>
        <Text style={styles.imageName}>{item.name}</Text>
        <TouchableOpacity
          onPress={() => onDeleteImage(item.id, item.createdAt)}
        >
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </View>
    ),
    [onDeleteImage]
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Images</Text>
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
        data={images}
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
  list: {
    flex: 1,
  },
  imageItem: {
    padding: 16,
    backgroundColor: "white",
    marginBottom: 8,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  imageName: {
    fontSize: 18,
    fontWeight: "500",
  },
  deleteText: {
    color: "red",
    fontSize: 14,
  },
});
