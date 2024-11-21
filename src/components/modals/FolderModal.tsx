import React, { useState, useEffect } from "react";
import { StyleSheet, TextInput, Animated, View } from "react-native";
import { Button, Text } from "native-base";
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
  const [shakeAnim] = useState(new Animated.Value(0));

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
      <Text style={styles.modalTitle} accessibilityRole="header">
        Create New Folder
      </Text>
      <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
        <TextInput
          style={styles.input}
          placeholder="Folder Name"
          value={folderName}
          onChangeText={setFolderName}
          autoCapitalize="none"
          accessibilityLabel="Folder Name Input"
          accessibilityHint="Enter the name of the new folder"
        />
      </Animated.View>
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
          accessibilityRole="button"
          accessibilityLabel="Cancel"
        >
          Cancel
        </Button>
        <Button
          onPress={handleCreate}
          style={styles.button}
          colorScheme="primary"
          accessibilityRole="button"
          accessibilityLabel="Create Folder"
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
    textAlign: "center",
    marginBottom: 10,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
});
