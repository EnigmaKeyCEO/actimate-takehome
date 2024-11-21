import React, { useState } from "react";
import { Text, TextInput, Button, StyleSheet, Animated, View } from "react-native";
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
      <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
        <TextInput
          style={styles.input}
          placeholder="Folder Name"
          value={folderName}
          onChangeText={setFolderName}
          autoFocus
        />
      </Animated.View>
      <View style={styles.buttonContainer}>
        <Button title="Create" onPress={handleCreate} />
        <Button title="Cancel" onPress={onClose} color="red" />
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
});
