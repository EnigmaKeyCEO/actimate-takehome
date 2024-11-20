import React, { useState, useEffect, useRef, useCallback } from "react";
import { View, StyleSheet, Animated, useWindowDimensions } from "react-native";
import { useNavigate, useParams } from "react-router-native";
import { useTheme } from "native-base";
import { FolderActions } from "#/components/actions/FolderActions";
import { useFolders } from "#/hooks/useFolders";
import { useFiles } from "#/hooks/useFiles";
import { Folder, Image, SortOptions } from "#/types";
import { useModal } from "#/components/Modal";
import { FolderList } from "#/components/folders/FolderList";
import { FilesList } from "#/components/files/FilesList";
import { SortHeader } from "#/components/headers/SortHeader";
import { SectionHeader } from "#/components/headers/SectionHeader";
import { LoadingIndicator } from "#/components/common/LoadingIndicator";
import { FolderModal } from "#/components/modals/FolderModal";
import * as IP from "expo-image-picker";
import { LIMIT } from "#/api";
import { debounce } from "lodash";

export function FolderScreen(passedProps: { parentId?: string }) {
  const { parentId = passedProps.parentId || "root" } = useParams<{
    parentId?: string;
  }>();
  const navigate = useNavigate();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const theme = useTheme();
  const { showModal } = useModal();
  const { height } = useWindowDimensions();

  const [showFolderModal, setShowFolderModal] = useState(false);
  const [sortMenuOpen, setSortMenuOpen] = useState(false);

  // Define sortOptions state
  const [sortOptions, setSortOptions] = useState<SortOptions>({
    field: "name",
    direction: "asc",
  });

  const {
    folders,
    loading: foldersLoading,
    error: foldersError,
    createFolder,
    deleteFolder,
    loadMoreFolders: doLoadMoreFolders,
    refreshFolders,
  } = useFolders(parentId);

  const {
    files,
    loading: filesLoading,
    error: filesError,
    loadMoreFiles: doLoadMoreFiles,
    uploadNewFile,
    removeFile,
    sortFiles,
    hasMore: hasMoreFiles,
  } = useFiles(parentId);

  const handleFolderPress = useCallback(
    (folder: Folder) => {
      navigate(`/folder/${folder.id}`);
    },
    [navigate]
  );

  const handleCreateFolder = useCallback(
    async (folderName: string) => {
      // Create folder with the provided name
      try {
        await createFolder({
          name: folderName,
          parentId: parentId || "root",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        showModal("Folder created successfully", "success");
      } catch (err) {
        console.error("Error creating folder:", err);
        showModal("Failed to create folder", "error");
      }
      setShowFolderModal(false);
      setSortMenuOpen(false);
      refreshFolders();
    },
    [createFolder, parentId, showModal, refreshFolders]
  );

  const handleCancelCreateFolder = useCallback(() => {
    setShowFolderModal(false);
  }, []);

  const handleDeleteFolder = useCallback(
    async (id: string) => {
      try {
        await deleteFolder(id);
        showModal("Folder deleted", "success");
      } catch (err) {
        console.error("Error deleting folder:", err);
        showModal("Failed to delete folder", "error");
      }
    },
    [deleteFolder, showModal]
  );

  const handleUploadFile = useCallback(async () => {
    try {
      const result = await IP.launchImageLibraryAsync({
        mediaTypes: IP.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        base64: true,
      });

      if (!result.canceled) {
        const { uri, type, base64 } = result.assets[0];
        const fileName = uri.split("/").pop() || "file";
        const payload = new FormData();
        payload.append("file", new File([base64!], fileName, { type }));

        await uploadNewFile(payload);
        showModal("File uploaded successfully", "success");
        refreshFolders();
      }
    } catch (err) {
      console.error("Error uploading file:", err);
      showModal("Failed to upload file", "error");
    }
  }, [uploadNewFile, showModal, refreshFolders]);

  // Handle errors for both folders and files
  useEffect(() => {
    if (foldersError) {
      showModal(foldersError.message, "error");
    } else if (filesError) {
      showModal(filesError.message, "error");
    }
  }, [foldersError, filesError, showModal]);

  // Animate on mount
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  // Sort files when sortOptions change
  useEffect(() => {
    sortFiles(sortOptions);
  }, [sortOptions, sortFiles]);

  // Toggle sort direction
  const toggleSortDirection = useCallback((field: SortOptions["field"]) => {
    setSortMenuOpen(false);
    setSortOptions((prev: SortOptions) => {
      return {
        field,
        direction: prev.direction === "asc" ? "desc" : "asc",
      };
    });
  }, []);

  // Handle loading more folders
  const handleLoadMoreFolders = useCallback(
    debounce(() => {
      if (!foldersLoading && !foldersError && folders.length % LIMIT === 0) {
        doLoadMoreFolders();
      }
    }, 300),
    [foldersLoading, foldersError, folders.length, doLoadMoreFolders]
  );

  // Handle loading more files
  const handleLoadMoreFiles = useCallback(
    debounce(() => {
      if (
        !filesLoading &&
        hasMoreFiles &&
        files.length % LIMIT === 0 &&
        !filesError
      ) {
        doLoadMoreFiles();
      }
    }, 300),
    [filesLoading, hasMoreFiles, files.length, doLoadMoreFiles, filesError]
  );

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Sort Header */}
      <SortHeader
        sortOptions={sortOptions}
        onSortChange={toggleSortDirection}
      />

      {/* Section List for Folders */}
      <View style={styles.section}>
        <SectionHeader title="Folders" />
        <FolderList
          folders={folders}
          loading={foldersLoading}
          error={foldersError ? foldersError.message : null}
          onFolderPress={handleFolderPress}
          onDeleteFolder={handleDeleteFolder}
          loadMoreFolders={handleLoadMoreFolders}
          footer={<View style={{ height: 16 }} />}
        />
      </View>

      {/* Section List for Files */}
      <View style={styles.section}>
        <SectionHeader title="Files" />
        <FilesList
          files={files}
          loadMoreFiles={handleLoadMoreFiles}
          removeFile={removeFile}
          loading={filesLoading}
          error={filesError ? filesError.message : null}
        />
      </View>

      {/* FolderActions Fixed at Bottom */}
      <View style={styles.folderActionsContainer}>
        <FolderActions
          onAddFolder={() => setShowFolderModal(true)}
          onUploadFile={handleUploadFile}
        />
      </View>

      {/* Add Folder Modal */}
      <FolderModal
        isOpen={showFolderModal}
        onClose={handleCancelCreateFolder}
        onCreate={handleCreateFolder}
        error={foldersError ? foldersError.message : null}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    flex: 1,
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  folderActionsContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
});
