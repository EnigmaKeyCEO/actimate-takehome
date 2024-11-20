import React, { useRef, useEffect } from "react";
import {
  View,
  Button,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Text,
  Animated,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { Image, SortOptions } from "#/types";
import useFolders from "#/hooks/useFolders";
import useFiles from "#/hooks/useFiles";
import * as ImagePicker from "expo-image-picker";

type RouteParams = {
  folderId: string;
};

export function FolderDetailScreen() {
  const route = useRoute();
  const { folderId } = route.params as RouteParams;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { createFolder, deleteFolder, loadMoreFolders } = useFolders(folderId);
  const {
    uploadNewFile,
    updateExistingFile,
    removeFile,
    sortFiles,
    files,
    loading,
    error,
    loadMoreFiles,
  } = useFiles(folderId);

  const handleUploadImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        const asset = result.assets[0];
        const formData = new FormData();
        formData.append("file", {
          uri: asset.uri,
          type: "image/jpeg",
          name: "upload.jpg",
        } as any);
        await uploadNewFile(formData);
      }
    } catch (err) {
      console.error("Error uploading:", err);
    }
  };

  const handleDeleteImage = async (id: string, filename: string) => {
    try {
      await removeFile(id);
    } catch (err) {
      console.error("Error deleting image:", err);
    }
  };

  const handleSort = (sortOptions: SortOptions) => {
    sortFiles(sortOptions);
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

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Button title="Upload Image" onPress={handleUploadImage} />
      <FlatList
        data={files}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        onEndReached={loadMoreFiles}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading ? <ActivityIndicator /> : null}
      />
    </Animated.View>
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
