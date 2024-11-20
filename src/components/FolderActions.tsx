import { View, Text, useTheme, Theme } from "native-base";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

interface FolderActionsProps {
  onAddFolder: () => void;
  onUploadFile: () => void;
}

const FolderActionButton: React.FC<{
  title: string;
  onPress: () => void;
  styles: StyleSheet.NamedStyles<any>;
}> = ({ title, onPress, styles }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

export const FolderActions: React.FC<FolderActionsProps> = ({
  onAddFolder,
  onUploadFile,
}) => {
  const theme = useTheme();
  const styles = useStyles(theme);
  return (
    <View style={styles.buttonContainer}>
      <FolderActionButton
        title="Add Folder"
        onPress={onAddFolder}
        styles={styles}
      />
      <FolderActionButton
        title="Upload File"
        onPress={onUploadFile}
        styles={styles}
      />
    </View>
  );
};

const useStyles = (theme: Theme) =>
  React.useMemo(() => {
    return StyleSheet.create({
      button: {
        backgroundColor: theme.colors.primary[500],
        padding: 10,
        borderRadius: 5,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 10,
      },
      buttonText: {
        color: theme.colors.white,
        fontWeight: "bold",
      },
      buttonContainer: {
        marginHorizontal: 10,
        flexDirection: "row",
        justifyContent: "space-evenly",
        marginTop: 10,
      },
    });
  }, []);
