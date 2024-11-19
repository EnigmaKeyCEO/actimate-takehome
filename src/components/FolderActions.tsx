import React from "react";
import { View, Button, StyleSheet } from "react-native";

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
      <Button title="Add Folder" onPress={onAddFolder} />
      <Button title="Add Image" onPress={onAddImage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
});
