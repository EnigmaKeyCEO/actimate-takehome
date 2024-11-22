import React, { useCallback, useMemo } from "react";
import { FlatList, View, Text, StyleSheet } from "react-native";
import { useModal } from "../Modal";
import { FileItem } from "../../types/File";
import { FileForm } from "#/components/files/FileForm";
import { LineItem } from "#/components/common/LineItem";
import { Image } from "native-base";
import useFiles from "#/hooks/useFiles";
import { LoadingIndicator } from "#/components/common/LoadingIndicator";

interface FilesListProps {}

export const FilesList: React.FC<FilesListProps> = () => {
  const { showModal, hideModal } = useModal();

  const { loadMoreFiles, files, loading, error, removeFile, updateFile } =
    useFiles();

  const { VITE_AWS_ACCESS_URL_KEY, VITE_AWS_BUCKET_NAME } = process.env;

  React.useEffect(() => {
    if (error && !loading && error instanceof Error) {
      showModal(error.message, "error");
    }
  }, [error, showModal]);

  const handleOnPress = (file: FileItem) => {
    showModal({
      title: file.name,
      body: (
        <Image
          source={{
            uri: file.url.replace(
              String(VITE_AWS_BUCKET_NAME),
              `${String(VITE_AWS_ACCESS_URL_KEY)}.${String(
                VITE_AWS_BUCKET_NAME
              )}`
            ),
          }}
          style={{ width: "100%", height: 200 }}
          resizeMode="contain"
        />
      ),
      actions: [{ label: "Close", onPress: () => {} }],
    });
  };

  // Handler to update a file
  const handleUpdate = useCallback(
    (item: FileItem) => {
      let updatedName = item.name;

      showModal({
        title: "Update File",
        body: (
          <FileForm
            file={item}
            onChangeName={(name) => {
              updatedName = name;
            }}
          />
        ),
        actions: [
          { label: "Cancel", onPress: hideModal },
          {
            label: "Update",
            onPress: async () => {
              try {
                await updateFile({ ...item, name: updatedName });
                hideModal();
              } catch (error: any) {
                console.error("Error updating file:", error);
                showModal({
                  title: "Error",
                  body: <Text>Failed to update file.</Text>,
                  actions: [{ label: "OK", onPress: hideModal }],
                });
              }
            },
          },
        ],
      });
    },
    [showModal, hideModal, updateFile]
  );

  // Handler to delete a file
  const handleDelete = useCallback(
    (item: FileItem) => {
      showModal({
        title: "Delete File",
        body: <Text>Are you sure you want to delete this file?</Text>,
        actions: [
          { label: "Cancel", onPress: hideModal },
          {
            label: "Delete",
            onPress: async () => {
              try {
                await removeFile(item.id);
                hideModal();
              } catch (error: any) {
                console.error("Error deleting file:", error);
                showModal({
                  title: "Error",
                  body: <Text>Failed to delete file.</Text>,
                  actions: [{ label: "OK", onPress: hideModal }],
                });
              }
            },
          },
        ],
      });
    },
    [showModal, hideModal, removeFile]
  );

  // Memoized renderItem to prevent unnecessary re-renders
  const renderItem = useCallback(
    ({ item }: { item: FileItem }) => (
      <LineItem
        type="file"
        key={item.id}
        item={item}
        onPress={() => handleOnPress(item)}
        onUpdate={() => handleUpdate(item)}
        onDelete={() => handleDelete(item)}
      />
    ),
    [handleOnPress, handleUpdate, handleDelete]
  );

  // Remove duplicate files. TODO: again, unify this solution with the one in FolderList.tsx and use the same hook
  const uniqueFiles = useMemo(
    () =>
      files.reduce((acc, file) => {
        if (!acc.find((f) => f.id === file.id)) {
          acc.push(file);
        }
        return acc;
      }, [] as FileItem[]),
    [files]
  );

  return (
    <View style={styles.container}>
      {uniqueFiles.length > 0 ? (
        <FlatList
          data={uniqueFiles}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          onEndReached={loadMoreFiles}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loading ? <LoadingIndicator /> : <View style={{ height: 16 }} />
          }
        />
      ) : (
        <Text style={styles.centeredMiddleText}>No Files Found...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    padding: 16,
  },
  centeredMiddleText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#666",
  },
  loadingText: {
    textAlign: "center",
    marginTop: 10,
    fontSize: 14,
    color: "#007AFF",
  },
  errorText: {
    textAlign: "center",
    marginTop: 10,
    fontSize: 14,
    color: "red",
  },
});
