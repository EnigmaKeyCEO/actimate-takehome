import React from "react";
import { View, Button, StyleSheet, TouchableOpacity, Text } from "react-native";

interface FolderActionsProps {
  onAddFolder: () => void;
  onAddImage: () => void;
}

export const FolderActions: React.FC<FolderActionsProps> = ({
  onAddFolder,
  onAddImage,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={onAddFolder}>
        <Text style={styles.buttonText}>Add Folder</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={onAddImage}>
        <Text style={styles.buttonText}>Add Image</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  button: {
    padding: 10,
    backgroundColor: "#007bff",
    borderRadius: 5,
    elevation: 2,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});
