import React from "react";
import { View, Text, Button, FlatList, ActivityIndicator } from "react-native";
import useFiles from "../hooks/useFiles";

interface FilesListProps {
  parentId: string;
}

export const FilesList: React.FC<FilesListProps> = ({ parentId }) => {
  const {
    files = [],
    loading,
    error,
    loadMoreFiles,
    uploadNewFile,
    updateExistingFile,
    removeFile,
    sortFiles,
  } = useFiles(parentId);

  if (loading && files.length === 0) {
    return <ActivityIndicator />;
  }

  if (error) {
    return (
      <Text
        style={{
          color: "gray",
          fontSize: 16,
          textAlign: "center",
        }}
      >
        Error: {error.message}
      </Text>
    );
  }

  return (
    <View>
      <Button title="Load More" onPress={loadMoreFiles} disabled={loading} />
      <FlatList
        data={files}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View>
            <Text>{item.name}</Text>
            <Button title="Delete" onPress={() => removeFile(item.id)} />
          </View>
        )}
      />
    </View>
  );
};

export default FilesList;
