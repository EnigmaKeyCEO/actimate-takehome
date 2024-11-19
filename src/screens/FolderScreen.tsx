import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Button, FlatList, ActivityIndicator, Text, TouchableOpacity } from "react-native";
import { useNavigate, useParams } from "react-router-native";
import { FolderActions } from "../components/FolderActions";
import { FolderList } from "../components/FolderList";
import { CreateFolderModal } from "../components/CreateFolderModal";
import { UploadImageModal } from "../components/UploadImageModal";
import { useFolders } from "../hooks/useFolders";
import { Folder } from "../types";
import { SortOptions } from "../types";

export function FolderScreen() {
  const { folderId } = useParams<{ folderId: string }>();
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const navigate = useNavigate();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const {
    folders,
    loading,
    error,
    createFolder,
    deleteFolder,
    sortFolders,
    loadMoreFolders,
  } = useFolders(folderId);

  const handleFolderPress = (folder: Folder) => {
    navigate(`/folders/${folder.id}`);
  };

  const handleSort = (sortOptions: SortOptions) => {
    sortFolders(sortOptions);
  };

  const handleAddFolder = async () => {
    try {
      await createFolder({
        name: "New Folder",
        parentId: folderId || "root",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.error("Error creating folder:", err);
    }
  };

  const handleDeleteFolder = async (id: string) => {
    try {
      await deleteFolder(id);
    } catch (err) {
      console.error("Error deleting folder:", err);
    }
  };

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const renderItem = ({ item }: { item: Folder }) => (
    <View style={styles.folderItem}>
      <Text style={styles.folderName} onPress={() => handleFolderPress(item)}>
        {item.name}
      </Text>
      <TouchableOpacity onPress={() => handleDeleteFolder(item.id)}>
        <Text style={styles.threeDotIcon}>⋮</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Button title="Add Folder" onPress={handleAddFolder} />
      {error && <Text style={styles.errorText}>{error.message}</Text>}
      <FlatList
        data={folders}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        onEndReached={loadMoreFolders}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading ? <ActivityIndicator /> : null}
      />

      {/* FolderActions Fixed at Bottom */}
      <View style={styles.folderActionsContainer}>
        <FolderActions
          onAddFolder={() => setShowFolderModal(true)}
          onAddImage={() => setShowImageModal(true)}
        />
      </View>

      {/* Modals */}
      <CreateFolderModal
        isOpen={showFolderModal}
        onClose={() => setShowFolderModal(false)}
        parentId={folderId || null}
      />

      <UploadImageModal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        folderId={folderId || "root"}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  folderItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 8,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  folderName: {
    fontSize: 18,
    flex: 1,
  },
  threeDotIcon: {
    fontSize: 24,
    color: "#666",
  },
  errorText: {
    color: "red",
    marginVertical: 8,
  },
  folderActionsContainer: {
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
});
