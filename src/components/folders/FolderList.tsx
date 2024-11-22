import React from "react";
import { FlatList, View, Text, StyleSheet, TextInput } from "react-native";
import { useModal } from "../Modal";
import { Folder } from "#/types/Folder";
import { useFolders } from "#/hooks/useFolders";
import { LineItem } from "#/components/common/LineItem";
import { LoadingIndicator } from "#/components/common/LoadingIndicator";

interface FolderListProps {
  folders: Folder[];
}

export const FolderList: React.FC<FolderListProps> = ({ folders }) => {
  const { showModal, hideModal } = useModal();
  const {
    loading,
    deleteFolder,
    updateFolder,
    enterFolder,
    loadMoreFolders,
    refreshFolders,
  } = useFolders();

  const handleOnPress = (folder: Folder) => {
    enterFolder(folder.id);
  };

  const handleOnCreate = (parentId: string) => {
    showModal("Create subfolder functionality not implemented yet.", "info");
  };

  const handleOnUpdate = async (folder: Folder) => {
    let updatedName = folder.name;

    showModal({
      title: "Update Folder",
      body: (
        <FolderForm
          folder={folder}
          onChangeName={(name) => {
            updatedName = name;
          }}
        />
      ),
      actions: [
        { label: "Cancel", onPress: hideModal },
        {
          label: "Update",
          onPress: async () => {
            try {
              await updateFolder(folder.id, { name: updatedName });
              hideModal();
            } catch (error: any) {
              console.error("Error updating folder:", error);
            }
          },
        },
      ],
    });
  };

  const handleOnDelete = async (folderId: string) => {
    showModal({
      title: "Delete Folder",
      body: <Text>Are you sure you want to delete this folder?</Text>,
      actions: [
        { label: "Cancel", onPress: hideModal },
        {
          label: "Delete",
          onPress: async () => {
            try {
              await deleteFolder(folderId);
              hideModal();
            } catch (error: any) {
              console.error("Error deleting folder:", error);
              showModal({
                title: "Error",
                body: <Text>Failed to delete folder.</Text>,
                actions: [{ label: "OK", onPress: hideModal }],
              });
            }
          },
        },
      ],
    });
  };

  const renderItem = React.useCallback(
    ({ item }: { item: Folder }) => (
      <LineItem
        type="folder"
        key={`${item.parentId}-${item.id}`}
        item={item}
        onPress={handleOnPress}
        onUpdate={handleOnUpdate}
        onCreate={handleOnCreate}
        onDelete={handleOnDelete}
      />
    ),
    [handleOnDelete, handleOnUpdate]
  );

  return (
    <FlatList
      data={folders}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContainer}
      onEndReached={loadMoreFolders}
      onEndReachedThreshold={0.5}
      ListFooterComponent={loading ? <LoadingIndicator /> : null}
      refreshing={loading && folders.length === 0}
      onRefresh={refreshFolders}
    />
  );
};

interface FolderFormProps {
  folder: Folder;
  onChangeName: (name: string) => void;
}

const FolderForm: React.FC<FolderFormProps> = ({ folder, onChangeName }) => {
  const [name, setName] = React.useState(folder.name);

  const handleNameChange = (text: string) => {
    setName(text);
    onChangeName(text);
  };

  return (
    <View style={styles.formContainer}>
      <Text style={styles.label}>Folder Name:</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={handleNameChange}
        placeholder="Enter folder name"
      />
    </View>
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
  formContainer: {
    marginVertical: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    fontSize: 16,
  },
});
