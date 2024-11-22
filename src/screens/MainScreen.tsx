import React, { useState, useEffect, useRef, useCallback } from "react";
import { View, StyleSheet, Animated, ActivityIndicator } from "react-native";
import { useNavigate, useParams } from "react-router-native";
import { FolderActions } from "#/components/actions/FolderActions";
import { useFolders } from "#/hooks/useFolders";
import { useFiles } from "#/hooks/useFiles";
import { Folder } from "#/types";
import { useModal } from "#/components/Modal";
import { FolderList } from "#/components/folders/FolderList";
import { FilesList } from "#/components/files/FilesList";
import { SortHeader } from "#/components/headers/SortHeader";
import { SectionHeader } from "#/components/headers/SectionHeader";
import { CreateFolderModal } from "#/components/modals/FolderModal";
import { Breadcrumb } from "#/components/Breadcrumb";
import { FileUploadModal } from "#/components/FileUploadModal";

export function Screen(passedProps: { folderId?: string }) {
  const { folderId = passedProps.folderId || "root" } = useParams<{
    folderId?: string;
  }>();
  const navigate = useNavigate();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { showModal } = useModal();
  
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [showFileUploadModal, setShowFileUploadModal] = useState(false);
  
  
  const {
    loading: foldersLoading,
    error: foldersError,
    createFolder,
    fetchSingleFolder,
    sortOptions,
    setSortOptions,
  } = useFolders(folderId);
  

  const {
    loading: filesLoading,
    error: filesError,
    sortFiles,
  } = useFiles();

  const onCreateFolder = useCallback(
    async (folderName: Folder["name"]) => {
      try {
        setShowFolderModal(false);
        showModal(`Successfully created "${folderName}"`, "success");
      } catch (error: any) {
        showModal(error.message, "error");
      }
    },
    [createFolder, folderId, showModal]
  );

  const onUploadFile = useCallback(() => {
    setShowFileUploadModal(true);
  }, []);

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
    // sortFolders(sortOptions);
    sortFiles(sortOptions);
  }, [sortOptions, sortFiles]);

  // Fetch the breadcrumb path
  const [breadcrumbPath, setBreadcrumbPath] = useState<Folder[]>([]);

  const fetchBreadcrumb = useCallback(async () => {
    const path: Folder[] = [];
    let currentFolderId: string | undefined = folderId;

    while (currentFolderId && currentFolderId !== "root") {
      const folder = await fetchSingleFolder(currentFolderId);
      if (folder) {
        path.unshift(folder); // Add to the beginning to maintain order from root to current
        currentFolderId = folder.parentId;
      } else {
        break; // If folder not found, stop the loop
      }
    }

    // Optionally, add the root folder to the breadcrumb
    if (folderId !== "root") {
      const rootFolder: Folder = {
        id: "root",
        name: "Root",
        parentId: "",
        createdAt: "",
        updatedAt: "",
        // Add other necessary fields if required
      };
      path.unshift(rootFolder);
    }

    setBreadcrumbPath(path);
  }, [folderId, fetchSingleFolder]);

  useEffect(() => {
    fetchBreadcrumb();
  }, [fetchBreadcrumb]);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Breadcrumb Navigation */}
      {breadcrumbPath.length > 0 && (
        <Breadcrumb
          path={breadcrumbPath}
          onNavigate={(folderId) => navigate(`/folder/${folderId}`)}
        />
      )}

      {/* Sort Header */}
      <SortHeader
        sortOptions={sortOptions}
        onSortChange={(field) => {
          setSortOptions((prev) => ({
            field,
            direction:
              prev.field === field && prev.direction === "asc" ? "desc" : "asc",
          }));
        }}
      />

      {/* Section List for Folders */}
      <View style={styles.section}>
        <SectionHeader title="Folders" />
        {foldersLoading && folderId === "root" ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <FolderList />
        )}
      </View>

      {/* Section List for Files */}
      <View style={styles.section}>
        <SectionHeader title="Files" />
        {filesLoading && folderId === "root" ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <FilesList />
        )}
      </View>

      {/* FolderActions Fixed at Bottom */}
      <View style={styles.folderActionsContainer}>
        <FolderActions
          onAddFolder={() => setShowFolderModal(true)}
          onUploadFile={onUploadFile}
        />
      </View>

      {/* Add Folder Modal */}
      <CreateFolderModal
        isOpen={showFolderModal}
        onClose={() => setShowFolderModal(false)}
        onCreate={onCreateFolder}
      />

      <FileUploadModal
        isOpen={showFileUploadModal}
        onClose={() => setShowFileUploadModal(false)}
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
