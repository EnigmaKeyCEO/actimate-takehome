import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  StyleSheet,
  Animated,
  SectionList,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  TextInput,
  useWindowDimensions,
} from "react-native";
import { useNavigate, useParams } from "react-router-native";
import { FolderActions } from "#/components/FolderActions";
import { useFolders } from "#/hooks/useFolders";
import { useFiles } from "#/hooks/useFiles";
import { Folder, Image, SortOptions } from "#/types";
import { useModal } from "#/components/Modal";
import { FolderItem } from "#/components/FolderItem";
import { FilesList } from "#/components/FilesList";
import { Button, useTheme } from "native-base";
import { AnimatedModal } from "#/components/AnimatedModal";
import * as IP from "expo-image-picker";
import { LIMIT } from "#/api/api";

interface RouteParams extends Record<string, string | undefined> {
  parentId?: string | "root";
}

export function FolderScreen() {
  const { parentId = "root" } = useParams<RouteParams>();
  const navigate = useNavigate();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const theme = useTheme();
  const { showModal } = useModal();
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [folderNameError, setFolderNameError] = useState<string | null>(null);
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const { height } = useWindowDimensions();
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
    loadMoreFolders,
    refreshFolders,
  } = useFolders(parentId);

  const {
    files,
    loading: filesLoading,
    error: filesError,
    loadMoreFiles,
    uploadNewFile,
    removeFile,
    sortFiles,
  } = useFiles(parentId);

  const handleFolderPress = useCallback(
    (folder: Folder) => {
      navigate(`/folder/${folder.id}`);
    },
    [navigate]
  );

  const handleCreateFolder = useCallback(async () => {
    // Validate folder name
    const isValidName = /^[A-Za-z_$][A-Za-z0-9_$\s]*$/.test(folderName);
    if (!isValidName) {
      setFolderNameError(
        "Invalid folder name. Use letters, spaces, numbers, underscores, or dollar signs."
      );
      return;
    }

    setShowFolderModal(false);
    setFolderNameError(null);
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
    setFolderName("");
  }, [createFolder, folderName, parentId, showModal]);

  const handleCancelCreateFolder = useCallback(() => {
    setShowFolderModal(false);
    setFolderName("");
    setFolderNameError(null);
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

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  useEffect(() => {
    sortFiles(sortOptions);
  }, [sortOptions]);

  const toggleSortDirection = (field: string) => {
    setSortMenuOpen(false);
    setSortOptions(
      (prev) =>
        ({
          field,
          direction: prev.direction === "asc" ? "desc" : "asc",
        } as SortOptions)
    );
  };

  // Prepare sections for SectionList
  const sections = [
    {
      title: "Folders",
      data: foldersLoading && parentId === "root" ? [] : folders,
    },
    {
      title: "Files",
      data: filesLoading ? [] : files,
    },
  ];

  const renderSectionHeader = ({ section: { title } }: any) => (
    <View>
      <View
        style={{
          backgroundColor: theme.colors.white,
        }}
      >
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
    </View>
  );

  const renderItem = ({ item, section }: any) => {
    if (section.title === "Folders") {
      return (
        <FolderItem
          folder={item}
          onPress={handleFolderPress}
          onDelete={handleDeleteFolder}
          onCreate={handleCreateFolder}
          onUpdate={() => {
            // TODO: Implement update folder
          }}
        />
      );
    } else if (section.title === "Files") {
      return <FilesList parentId={parentId} />;
    }
    return null;
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Table Header stays above the section headers */}
      <View
        style={[
          styles.tableHeader,
          sortMenuOpen
            ? styles.tableHeaderMenuOpen
            : styles.tableHeaderMenuClosed,
        ]}
      >
        {!sortMenuOpen ? (
          <TouchableOpacity
            style={styles.tableHeaderMenuToggle}
            onPress={() => setSortMenuOpen(true)}
          >
            <View style={styles.tableHeaderMenuToggleLine} />
            <View style={styles.tableHeaderMenuToggleLine} />
            <View style={styles.tableHeaderMenuToggleLine} />
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity
              onPressIn={() => toggleSortDirection("name")}
              style={styles.tableHeaderColumn}
            >
              <Text style={styles.tableHeaderTitle1}>Name</Text>
              <Text
                style={[
                  styles.tableHeaderChevron,
                  sortOptions.field !== "name"
                    ? styles.chevronHidden
                    : sortOptions.direction === "desc"
                    ? styles.chevronDown
                    : styles.chevronUp,
                ]}
              >
                ▼
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPressIn={() => toggleSortDirection("updatedAt")}
              style={[styles.tableHeaderColumn]}
            >
              <Text style={styles.tableHeaderTitle2}>Date Modified</Text>
              <Text
                style={[
                  styles.tableHeaderChevron,
                  sortOptions.field !== "updatedAt"
                    ? styles.chevronHidden
                    : sortOptions.direction === "desc"
                    ? styles.chevronDown
                    : styles.chevronUp,
                ]}
              >
                ▼
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPressIn={() => toggleSortDirection("createdAt")}
              style={[styles.tableHeaderColumn]}
            >
              <Text style={styles.tableHeaderTitle2}>Date Created</Text>
              <Text
                style={[
                  styles.tableHeaderChevron,
                  sortOptions.field !== "createdAt"
                    ? styles.chevronHidden
                    : sortOptions.direction === "desc"
                    ? styles.chevronDown
                    : styles.chevronUp,
                ]}
              >
                ▼
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
      {/* Replace ScrollView with SectionList */}
      <SectionList
        sections={sections}
        keyExtractor={(item, index) => item?.id || index.toString()}
        renderSectionHeader={renderSectionHeader}
        renderItem={renderItem}
        onEndReachedThreshold={0.9}
        onEndReached={({ distanceFromEnd }) => {
          const threshold = height / 4;
          console.log("distanceFromEnd", distanceFromEnd, threshold);
          if (
            distanceFromEnd < threshold &&
            !foldersLoading &&
            !filesLoading &&
            !foldersError &&
            !filesError
          ) {
            if (folders.length > 0 && folders.length % LIMIT === 0) {
              loadMoreFolders();
            }
            if (files.length > 0 && files.length % LIMIT === 0) {
              loadMoreFiles();
            }
          }
        }}
        ListFooterComponent={
          foldersLoading || filesLoading ? (
            <View style={{ padding: 20 }}>
              <ActivityIndicator />
            </View>
          ) : (
            <View style={styles.scrollViewPaddingHack} />
          )
        }
      />

      {/* FolderActions Fixed at Bottom */}
      <View style={styles.folderActionsContainer}>
        <FolderActions
          onAddFolder={() => setShowFolderModal(true)}
          onUploadFile={handleUploadFile}
        />
      </View>

      {/* Add Folder Modal */}
      {showFolderModal && <View style={styles.modalOverlay}></View>}
      <AnimatedModal
        isOpen={showFolderModal}
        onClose={handleCancelCreateFolder}
        containerStyle={styles.modalContainer}
      >
        <Text style={styles.modalTitle}>Create New Folder</Text>
        <TextInput
          style={styles.input}
          placeholder="Folder Name"
          value={folderName}
          onChangeText={setFolderName}
          autoCapitalize="none"
        />
        {folderNameError && (
          <Text style={styles.errorText}>{folderNameError}</Text>
        )}
        <View style={styles.modalButtons}>
          <Button
            color={theme.colors.error[500]}
            onPress={handleCancelCreateFolder}
          >
            Cancel
          </Button>
          <Animated.View>
            <Button
              color={theme.colors.primary[500]}
              onPress={handleCreateFolder}
            >
              Create
            </Button>
          </Animated.View>
        </View>
        <View style={{ height: 20 }} />
      </AnimatedModal>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  section: {
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    paddingHorizontal: 16,
    marginBottom: 10,
    fontVariant: ["small-caps"],
  },
  tableHeader: {
    position: "absolute",
    top: 0,
    left: "auto",
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 8,
    marginHorizontal: 16,
    marginVertical: 8,
    zIndex: 100,
  },
  tableHeaderMenu: {
    flex: 1,
    flexDirection: "row",
    textAlign: "center",
  },
  tableHeaderMenuOpen: {
    left: 0,
    height: "auto",
    margin: 0,
    paddingVertical: 16,
    paddingHorizontal: 8,
    backgroundColor: "#ffffff",
    width: "100%",
  },
  tableHeaderMenuClosed: {
    left: "auto",
    height: 50,
    backgroundColor: "#ffffff",
    width: 50,
    alignItems: "center",
    justifyContent: "center",
    // borderWidth: 1,
    // borderColor: "#000000",
    // borderRadius: 10,
    padding: 10,
    margin: 10,
    // marginTop: -16,
    transform: [{ scale: 0.75 }, { translateY: -16 }],
  },
  tableHeaderMenuToggle: {
    paddingTop: 6,
    paddingLeft: 4,
    paddingBottom: 6,
    paddingRight: 2,
    height: 50,
    width: 50,
    flexDirection: "column",
    textAlign: "center",
    transform: [{ scale: 0.9 }],
  },
  tableHeaderMenuToggleLine: {
    flex: 0.25,
    width: "100%",
    backgroundColor: "#000000",
    borderWidth: 2,
    borderColor: "#000000",
    margin: 4,
  },
  tableHeaderColumnContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  tableHeaderMenuHandler: {
    flex: 1,
    flexDirection: "row",
    textAlign: "center",
  },
  tableHeaderColumn: {
    flex: 0.33,
    flexDirection: "row",
    textAlign: "center",
  },
  tableHeaderTitle1: {
    fontSize: 16,
    fontWeight: "bold",
  },
  tableHeaderTitle2: {
    position: "absolute",
    fontSize: 12,
    textAlign: "center",
    fontWeight: "200",
  },
  tableHeaderChevron: {
    justifyContent: "flex-end",
    alignItems: "center",
    marginVertical: 4,
    fontSize: 12,
    paddingStart: 10,
  },
  chevronDown: {
    transform: [{ rotate: "180deg" }],
  },
  chevronUp: {
    transform: [{ rotate: "0deg" }],
  },
  chevronHidden: {
    opacity: 0,
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
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    marginTop: "30%",
    marginHorizontal: 20,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: "center",
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
  scrollViewPaddingHack: {
    height: 100,
  },
});
