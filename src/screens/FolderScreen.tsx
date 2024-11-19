import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
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

  const { sortFolders } = useFolders(folderId);

  const handleFolderPress = (folder: Folder) => {
    navigate(`/folders/${folder.id}`);
  };

  const handleSort = (sortOptions: SortOptions) => {
    sortFolders(sortOptions);
  };

  return (
    <View style={styles.container}>
      <FolderList
        folderId={folderId || "root"}
        onFolderPress={handleFolderPress}
        onSort={handleSort}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  folderActionsContainer: {
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
});
