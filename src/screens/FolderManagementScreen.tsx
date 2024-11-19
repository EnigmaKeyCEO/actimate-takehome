import React, { useEffect } from "react";
import {
  View,
  Button,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Text,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/RootStackParamList";
import { useFolders } from "../hooks/useFolders";
import { Folder } from "../types";

type FolderManagementScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Folders"
>;

const FolderManagementScreen: React.FC = () => {
  const {
    folders,
    loading,
    error,
    createFolder,
    deleteFolder,
    sortFolders,
    loadMoreFolders,
  } = useFolders();
  const navigation = useNavigation<FolderManagementScreenNavigationProp>();

  useEffect(() => {
    // Initial fetch is handled inside useFolders
  }, []);

  const handleAddFolder = async () => {
    try {
      const newFolder = await createFolder({
        name: "New Folder",
        parentId: "root",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      // Optionally navigate or update UI
    } catch (err) {
      console.error(`
        Error creating folder:
        ${JSON.stringify(err, null, 2)}
      `);
    }
  };

  const handleDeleteFolder = async (id: string) => {
    try {
      await deleteFolder(id);
    } catch (err) {
      console.error("Error deleting folder:", err);
    }
  };

  const handlePressFolder = (id: string) => {
    navigation.navigate("FolderDetail", { folderId: id });
  };

  const renderItem = ({ item }: { item: Folder }) => (
    <View style={styles.folderItem}>
      <Text
        style={styles.folderName}
        onPress={() => handlePressFolder(item.id)}
      >
        {item.name}
      </Text>
      <Button title="Delete" onPress={() => handleDeleteFolder(item.id)} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Button title="Add Folder" onPress={handleAddFolder} />
      {error && <Text style={styles.errorText}>{error.message}</Text>}
      <FlatList
        data={folders}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        onEndReached={loadMoreFolders}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading ? <ActivityIndicator /> : null}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  folderItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 8,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  folderName: {
    fontSize: 18,
    flex: 1,
  },
  errorText: {
    color: "red",
    marginVertical: 8,
  },
});

export default FolderManagementScreen;
