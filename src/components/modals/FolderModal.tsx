import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { Button, useTheme } from "native-base";
import { AnimatedModal } from "../common/AnimatedModal";

interface FolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (folderName: string) => void;
  error?: string | null;
}

export const FolderModal: React.FC<FolderModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  error,
}) => {
  const [folderName, setFolderName] = useState("");
  const [folderNameError, setFolderNameError] = useState<string | null>(null);
  const theme = useTheme();

  useEffect(() => {
    if (!isOpen) {
      setFolderName("");
      setFolderNameError(null);
    }
  }, [isOpen]);

  const handleCreate = () => {
    // Validate folder name
    const isValidName = /^[A-Za-z_$][A-Za-z0-9_$\s]*$/.test(folderName);
    if (!isValidName) {
      setFolderNameError(
        "Invalid folder name. Use letters, spaces, numbers, underscores, or dollar signs."
      );
      return;
    }
    onCreate(folderName);
  };

  return (
    <AnimatedModal
      isOpen={isOpen}
      onClose={onClose}
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
      {error && <Text style={styles.errorText}>{error}</Text>}
      <View style={styles.modalButtons}>
        <Button
          variant="ghost"
          colorScheme="error"
          onPress={onClose}
          style={styles.button}
        >
          Cancel
        </Button>
        <Button
          onPress={handleCreate}
          style={styles.button}
          colorScheme="primary"
        >
          Create
        </Button>
      </View>
    </AnimatedModal>
  );
};

const styles = StyleSheet.create({
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
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
});
