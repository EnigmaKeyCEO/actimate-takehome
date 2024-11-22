import React from "react";
import { FlatList, View, Text, StyleSheet, TextInput } from "react-native";
import { useModal } from "../Modal";
import { Folder } from "#/types/Folder";
import { useFolders } from "#/hooks/useFolders";
import { LineItem } from "#/components/common/LineItem";
import { LoadingIndicator } from "#/components/common/LoadingIndicator";
import { Button } from "native-base";
import { CreateFolderModal } from "#/components/modals/FolderModal";
import { createFolder } from "#/api";

interface FolderListProps {}

export const FolderList: React.FC<FolderListProps> = () => {
  const { showModal, hideModal } = useModal();
  const [isCreating, setIsCreating] = React.useState(false);
  const {
    parentId,
    folders,
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

  const handleOnCreate = () => {
    setIsCreating(true);
  };

  const onCreateFolder = React.useCallback(
    async (folderName: Folder["name"]) => {
      try {
        await createFolder(parentId, folderName);
        showModal(`Successfully created "${folderName}"`, "success");
        setIsCreating(false);
      } catch (error: any) {
        showModal(error.message, "error");
      }
    },
    [parentId, showModal]
  );
  const updatedName = React.useRef("");

    const handleOnUpdate = async (folder: Folder) => {
    updatedName.current = folder.name;

    showModal({
      title: "Update Folder",
      body: (
        <FolderForm
          folder={folder}
          onChangeName={(name) => {
            updatedName.current = name;
          }}
        />
      ),
      actions: [
        { label: "Cancel", onPress: hideModal },
        {
          label: "Update",
          onPress: async () => {
            try {
              await updateFolder(folder.id, { name: updatedName.current });
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

  const renderLoadMoreSection = React.useCallback(() => {
    if (loading) return <LoadingIndicator />;
    if (folders.length % 20 !== 0 && folders.length !== 0) {
      return null;
    }
    return (
      <View style={styles.loadMoreContainer}>
        <Button onPress={loadMoreFolders}>Load More</Button>
      </View>
    );
  }, [loading]);

  return (
    <>
      <FlatList
        data={folders}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        // TODO: use infinite scroll and a loading indicator instead of a button
        //   onEndReached={loadMoreFolders}
        //   onEndReachedThreshold={0.5}
        ListFooterComponent={renderLoadMoreSection()}
        // refreshing={loading && folders.length === 0}
        // onRefresh={refreshFolders}
      />
      <CreateFolderModal
        isOpen={isCreating}
        onClose={() => setIsCreating(false)}
        onCreate={onCreateFolder}
      />
    </>
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
    padding: 8,
  },
  loadMoreContainer: {
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
    color: "white",
  },
  formContainer: {
    width: "100%",
    marginVertical: 16,
  },
  label: {
    color: "white",
    flex: 1,
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    color: "white",
    flex: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    fontSize: 16,
  },
});
