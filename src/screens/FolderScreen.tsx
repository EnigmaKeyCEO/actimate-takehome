import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { View, StyleSheet, Animated, useWindowDimensions } from "react-native";
import { useNavigate, useParams } from "react-router-native";
import { useTheme } from "native-base";
import { FolderActions } from "#/components/actions/FolderActions";
import { useFolders } from "#/hooks/useFolders";
import { useFiles } from "#/hooks/useFiles";
import { Folder, SortOptions } from "#/types";
import { ModalMessageType, useModal } from "#/components/Modal";
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
  const { showModal } = useModal<ModalMessageType>();
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
    hasMoreFolders,
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
    async (folderName: Folder["name"]) => {
      try {
        await createFolder({
          name: folderName,
          parentId: parentId || "root",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        setShowFolderModal(false);
      } catch (error: any) {
        showModal(error.message, "error");
      }
    },
    [createFolder, showModal]
  );

  const handleDeleteFolder = useCallback(
    async (folderId: string) => {
      try {
        await deleteFolder(folderId);
      } catch (error: any) {
        showModal(error.message, "error");
      }
    },
    [deleteFolder, showModal]
  );

  const handleUploadFile = useCallback(async () => {
    // Implement your file upload logic here
    // Example: Launch image picker and upload selected file
    const result = await IP.launchImageLibraryAsync({
      mediaTypes: IP.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      const formData = new FormData();
      formData.append("file", result.assets[0].base64);
      try {
        await uploadNewFile(formData);
      } catch (error: any) {
        showModal(error.message, "error");
      }
    }
  }, [uploadNewFile, showModal]);

  // Debounced handlers to prevent rapid calls
  const handleLoadMoreFolders = useCallback(
    debounce(() => {
      if (hasMoreFolders && !foldersLoading && !foldersError) {
        doLoadMoreFolders();
      }
    }, 300),
    [hasMoreFolders, foldersLoading, foldersError, doLoadMoreFolders]
  );

  const handleLoadMoreFiles = useCallback(
    debounce(() => {
      if (hasMoreFiles && !filesLoading && !filesError) {
        doLoadMoreFiles();
      }
    }, 300),
    [hasMoreFiles, filesLoading, filesError, doLoadMoreFiles]
  );

  // Handle errors for both folders and files
  useEffect(() => {
    if (foldersError) {
      showModal(foldersError.message, "error");
    } else if (filesError) {
      showModal(filesError.message, "error");
    }
  }, [foldersError, filesError, showModal]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  useEffect(() => {
    sortFiles(sortOptions);
  }, [sortOptions, sortFiles]);

  const sortedFolders = useMemo(() => {
    return folders.sort((a, b) => {
      if (sortOptions.direction === "asc") {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });
  }, [folders, sortOptions]);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Sort Header */}
      <SortHeader
        sortOptions={sortOptions}
        onSortChange={(field) => {
          setSortOptions((prev) => ({
            field,
            direction: prev.direction === "asc" ? "desc" : "asc",
          }));
        }}
      />

      {/* Section List for Folders */}
      <View style={styles.section}>
        <SectionHeader title="Folders" />
        <FolderList
          folders={sortedFolders}
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
        onClose={() => setShowFolderModal(false)}
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
