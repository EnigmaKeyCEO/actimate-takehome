import React from "react";
import { FlatList, View, Text, StyleSheet } from "react-native";
import { useModal } from "../Modal";
import { Button } from "native-base";
import { FolderItem } from "#/components/folders/FolderItem";
import { Folder } from "#/types/Folder";
import { useNavigate, useNavigation } from "react-router-native";
import { deleteFolder } from "#/api";

interface FolderListProps {
  folders: Folder[];
}

const FolderForm = ({ folder }: { folder: Folder }) => {
  return <Text>Input Form Coming Soon</Text>;
};

export const FolderList: React.FC<FolderListProps> = ({ folders }) => {
  const { showModal, hideModal } = useModal();
  const genericNavigate = useNavigate();

  const renderItem = ({ item }: { item: Folder }) => (
    <FolderItem
      key={item.id}
      folder={item}
      onPress={() => {
        genericNavigate(`/folder/${item.id}`);
      }}
      onUpdate={() => {
        showModal({
          title: "Update Folder",
          body: <FolderForm folder={item} />,
          actions: [{ label: "Update", onPress: () => {} }],
        });
      }}
      onCreate={() => {
        console.log("how did you find this button, it's illogical");
      }}
      onDelete={() => {
        showModal({
          title: "Delete Folder",
          body: <Text>Are you sure you want to delete this folder?</Text>,
          actions: [
            { label: "Cancel", onPress: hideModal },
            {
              label: "Delete",
              onPress: async () => {
                try {
                  await deleteFolder(item.id);
                  hideModal();
                } catch (error: any) {
                  console.error("Error deleting folder:", error);
                  showModal("Failed to delete folder.", "error");
                }
              },
            },
          ],
        });
      }}
    />
  );

  return (
    <FlatList
      data={folders}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  folderName: {
    fontSize: 16,
  },
});
