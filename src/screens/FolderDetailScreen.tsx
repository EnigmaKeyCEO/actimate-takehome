import React from "react";
import {
  View,
  Button,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Text,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { useImages } from "#/hooks/useImages";
import { Image, SortOptions } from "#/types";

type RouteParams = {
  folderId: string;
};

export function FolderDetailScreen() {
  const route = useRoute();
  const { folderId } = route.params as RouteParams;
  const {
    images,
    loading,
    error,
    uploadImage,
    deleteImage,
    sortImages,
    loadMoreImages,
  } = useImages(folderId);

  const handleUploadImage = async () => {
    // Implement your image upload logic, e.g., opening an image picker
    // Example:
    // const file = await pickImage();
    // if (file) {
    //   await uploadImage(file);
    // }
  };

  const handleDeleteImage = async (id: string, filename: string) => {
    try {
      await deleteImage(id, filename);
    } catch (err) {
      console.error("Error deleting image:", err);
    }
  };

  const handleSort = (sortOptions: SortOptions) => {
    sortImages(sortOptions);
  };

  const renderItem = ({ item }: { item: Image }) => (
    <View style={styles.imageItem}>
      <Text style={styles.imageName}>{item.name}</Text>
      <Button
        title="Delete"
        onPress={() => handleDeleteImage(item.id, item.createdAt)}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Button title="Upload Image" onPress={handleUploadImage} />
      {error && <Text style={styles.errorText}>{error.message}</Text>}
      <FlatList
        data={images}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        onEndReached={loadMoreImages}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading ? <ActivityIndicator /> : null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  imageItem: {
    padding: 16,
    backgroundColor: "#fff",
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
    flex: 1,
  },
  errorText: {
    color: "red",
    marginVertical: 8,
  },
});
