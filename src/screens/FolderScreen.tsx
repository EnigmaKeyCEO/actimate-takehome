import React, { useState } from "react";
import { View } from "react-native";
import { useNavigate, useParams } from "react-router-native";
import { FolderActions } from "../components/FolderActions";
import { FolderList } from "../components/FolderList";
import { CreateFolderModal } from "../components/CreateFolderModal";
import { UploadImageModal } from "../components/UploadImageModal";
import { useFolders } from "#/hooks/useFolders";
import { Folder } from "#/types";
import { SortOptions } from "functions/adapters/StorageAdapter";

export function FolderScreen() {
  const { folderId } = useParams<{ folderId: string }>();
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const navigate = useNavigate();

  const handleFolderPress = (folder: Folder) => {
    navigate(`/folders/${folder.id}`);
  };

  const handleSort = (sortOptions: SortOptions) => {
    const { sortFolders } = useFolders(folderId);
    sortFolders(sortOptions);
  };

  return (
    <View style={{ flex: 1 }}>
      <FolderActions
        onAddFolder={() => setShowFolderModal(true)}
        onAddImage={() => setShowImageModal(true)}
      />
      <FolderList
        folderId={folderId || "root"}
        onFolderPress={handleFolderPress}
        onSort={handleSort}
      />

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
