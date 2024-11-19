import React from "react";
import { View, Button } from "react-native";

interface FolderActionsProps {
  onAddFolder: () => void;
}

export const FolderActions: React.FC<FolderActionsProps> = ({ onAddFolder }) => {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <Button title="Add Folder" onPress={onAddFolder} />
    </View>
  );
};
