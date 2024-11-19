import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Animated,
  FlatList,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from "react-native";
import { useNavigate, useParams } from "react-router-native";
import { FolderActions } from "../components/FolderActions";
import { useFolders } from "../hooks/useFolders";
import { Folder } from "../types";
import { useModal } from "#/components/Modal";

export function FolderScreen() {
  const { folderId } = useParams<{ folderId: string }>();
  const [showFolderModal, setShowFolderModal] = useState(false);
  const navigate = useNavigate();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const {
    folders,
    loading,
    error,
    createFolder,
    deleteFolder,
    loadMoreFolders,
  } = useFolders(folderId);
  const { showModal } = useModal();
  const [folderName, setFolderName] = useState("");

  const handleFolderPress = React.useCallback(
    (folder: Folder) => {
      navigate(`/folders/${folder.id}`);
    },
    [navigate]
  );

  const handleCreateFolder = React.useCallback(async () => {
    setShowFolderModal(false);
    try {
      await createFolder({
        name: folderName,
        parentId: folderId || undefined,
        createdAt: Date.now().toString(),
        updatedAt: Date.now().toString(),
      });
      showModal("Folder created successfully", "success");
    } catch (err) {
      console.error("Error creating folder:", err);
      showModal("Failed to create folder", "error");
    }
    setFolderName("");
  }, [setShowFolderModal, setFolderName]);

  const handleDeleteFolder = React.useCallback(
    async (id: string) => {
      try {
        await deleteFolder(id);
        showModal("Folder deleted", "success");
      } catch (err) {
        console.error("Error deleting folder:", err);
      }
    },
    [deleteFolder, showModal]
  );

  const errorTextElement = React.useMemo(() => {
    if (!error) return null;
    switch (error.message) {
      case "Network Error":
        return <Text style={styles.errorText1}>No internet connection</Text>;
      case "Unhandled Request":
        return (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText1}>Hmm... No Stuff?!</Text>
            <Text style={styles.errorText2}>No folders here.</Text>
            <View style={{ height: 20 }} />
            <Text style={styles.errorText3}>
              If you're having trouble, please check your internet connection
              and try again later.
            </Text>
          </View>
        );
      default:
        return <Text style={styles.errorText2}>{error.message}</Text>;
    }
  }, [error]);

  useEffect(() => {
    if (error) {
      showModal(
        errorTextElement?.props.children[0].toString().includes(error.message)
          ? "Unknown Error"
          : React.Children.map(errorTextElement?.props.children, (child) => {
              if (typeof child === "string") {
                return child;
              }
              return {
                ...child,
                props: {
                  ...child.props,
                  style: { ...child.props.style, color: "white" },
                },
              };
            })[0],
        "error"
      );
    }
  }, [error]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const renderItem = React.useCallback(
    ({ item }: { item: Folder }) => (
      <View style={styles.folderItem}>
        <Text style={styles.folderName} onPress={() => handleFolderPress(item)}>
          {item.name}
        </Text>
        <TouchableOpacity onPress={() => handleDeleteFolder(item.id)}>
          <Text style={styles.threeDotIcon}>⋮</Text>
        </TouchableOpacity>
      </View>
    ),
    [handleFolderPress, handleDeleteFolder]
  );

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {error ? (
        <View style={styles.errorContainer}>{errorTextElement}</View>
      ) : (
        <FlatList
          data={folders}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          onEndReached={loadMoreFolders}
          onEndReachedThreshold={0.5}
          ListFooterComponent={loading ? <ActivityIndicator /> : null}
        />
      )}

      {/* FolderActions Fixed at Bottom */}
      <View style={styles.folderActionsContainer}>
        <FolderActions
          onAddFolder={() => setShowFolderModal(true)}
        />
      </View>
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
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText1: {
    fontSize: 22,
    textAlign: "center",
    alignSelf: "center",
    color: "#444",
    fontWeight: "bold",
  },
  errorText2: {
    fontSize: 18,
    textAlign: "center",
    alignSelf: "center",
    color: "#555",
    fontWeight: "400",
  },
  errorText3: {
    fontSize: 14,
    textAlign: "center",
    alignSelf: "center",
    color: "#666",
  },
  folderActionsContainer: {
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
});
