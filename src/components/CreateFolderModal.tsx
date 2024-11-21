import React, { useState } from "react";
import { TextInput, StyleSheet, Animated, View } from "react-native";
import { Button, Text } from "native-base";
import { useFolders } from "../hooks/useFolders";
import { AnimatedModal } from "./common/AnimatedModal";

interface CreateFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  parentId: string | null;
  setInputValue?: (value: string) => void;
}

export const CreateFolderModal: React.FC<CreateFolderModalProps> = ({
  isOpen,
  onClose,
  parentId,
  setInputValue = () => {},
}) => {
  const [folderName, setFolderName] = useState("");
  const { createFolder } = useFolders(parentId || "root");
  const [shakeAnim] = useState(new Animated.Value(0));
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!folderName.trim()) {
      Animated.sequence([
        Animated.timing(shakeAnim, {
          toValue: 10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: -10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
      setError("Folder name cannot be empty.");
      return;
    }

    try {
      await createFolder({
        name: folderName,
        parentId: parentId || undefined,
        createdAt: Date.now().toString(),
        updatedAt: Date.now().toString(),
      });
      setFolderName("");
      setInputValue("");
      setError(null);
      onClose();
    } catch (err) {
      setError("Failed to create folder. Please try again.");
      console.error(`
        Error Creating Folder...
        Error Details:
        ${JSON.stringify(err, null, 2)}
      `);
    }
  };

  return (
    <AnimatedModal isOpen={isOpen} onClose={onClose}>
      <Text style={styles.title} accessibilityRole="header">
        Create New Folder
      </Text>
      <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
        <TextInput
          style={styles.input}
          placeholder="Folder Name"
          value={folderName}
          onChangeText={setFolderName}
          autoFocus
          accessibilityLabel="Folder Name Input"
          accessibilityHint="Enter the name of the new folder"
        />
      </Animated.View>
      {error && <Text style={styles.errorText}>{error}</Text>}
      <View style={styles.buttonContainer}>
        <Button onPress={handleCreate} accessibilityRole="button" accessibilityLabel="Create Folder">
          Create
        </Button>
        <Button onPress={onClose} colorScheme="red" accessibilityRole="button" accessibilityLabel="Cancel">
          Cancel
        </Button>
      </View>
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
});
