import React, { useState } from "react";
import { Text, TextInput, Button, StyleSheet } from "react-native";
import { useFolders } from "../hooks/useFolders";
import { AnimatedModal } from "./AnimatedModal";

interface CreateFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  parentId: string | null;
}

export const CreateFolderModal: React.FC<CreateFolderModalProps> = ({
  isOpen,
  onClose,
  parentId,
}) => {
  const [folderName, setFolderName] = useState("");
  const { createFolder } = useFolders(parentId || undefined);

  const handleCreate = async () => {
    try {
      await createFolder({
        name: folderName,
        parentId: parentId || undefined,
        createdAt: Date.now().toString(),
        updatedAt: Date.now().toString(),
      });
      setFolderName("");
      onClose();
    } catch (err) {
      console.error(`
        Error Creating Folder...
        Error Details:
        ${JSON.stringify(err, null, 2)}
      `);
    }
  };

  return (
    <AnimatedModal isOpen={isOpen} onClose={onClose}>
      <Text style={styles.title}>Create New Folder</Text>
      <TextInput
        style={styles.input}
        placeholder="Folder Name"
        value={folderName}
        onChangeText={setFolderName}
      />
      <Button title="Create" onPress={handleCreate} />
      <Button title="Cancel" onPress={onClose} color="red" />
    </AnimatedModal>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    marginBottom: 12,
    textAlign: "center",
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginBottom: 12,
    borderRadius: 4,
  },
});
