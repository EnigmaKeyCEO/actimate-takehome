import React, { useState } from "react";
import { FlatList, View, Text, StyleSheet, TextInput } from "react-native";
import { useModal } from "../Modal";
import { Button } from "native-base";
import { FolderItem } from "#/components/folders/FolderItem";
import { Folder } from "#/types/Folder";
import { useNavigate } from "react-router-native";
import { useFolders } from "#/hooks/useFolders";

interface FolderListProps {
  folders: Folder[];
}

export const FolderList: React.FC<FolderListProps> = ({ folders }) => {
  const { showModal, hideModal } = useModal();
  const navigate = useNavigate();
  const { deleteFolder, updateFolder } = useFolders("root"); // Adjust parentId as needed

  const renderItem = ({ item }: { item: Folder }) => (
    <FolderItem
      key={`${item.parentId}-${item.id}`}
      folder={item}
      onPress={() => {
        navigate(`/folder/${item.id}`);
      }}
      onUpdate={() => {
        let updatedName = item.name;

        showModal({
          title: "Update Folder",
          body: (
            <FolderForm
              folder={item}
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
                  await updateFolder(item.id, { name: updatedName });
                  hideModal();
                } catch (error: any) {
                  console.error("Error updating folder:", error);
                }
              },
            },
          ],
        });
      }}
      onCreate={() => {
        console.log("Create subfolder functionality not implemented yet.");
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

interface FolderFormProps {
  folder: Folder;
  onChangeName: (name: string) => void;
}

const FolderForm: React.FC<FolderFormProps> = ({ folder, onChangeName }) => {
  const [name, setName] = useState(folder.name);

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
