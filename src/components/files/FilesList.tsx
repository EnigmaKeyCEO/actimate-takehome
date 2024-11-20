import React, { useEffect, useRef } from "react";
import { Animated, FlatList, StyleSheet } from "react-native";
import { FileItem } from "#/types";
import { useModal } from "#/components/Modal";
import { LoadingIndicator } from "#/components/common/LoadingIndicator";
import { FileItemComponent } from "./FileItemComponent";
import { View } from "native-base";

interface FilesListProps {
  files: FileItem[];
  loadMoreFiles: () => void;
  removeFile: (id: string) => void;
  loading: boolean;
  error?: string | null;
}

export const FilesList: React.FC<FilesListProps> = ({
  files,
  loadMoreFiles,
  removeFile,
  loading,
  error,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { showModal } = useModal();

  useEffect(() => {
    if (error) {
      showModal(error, "error");
    }
  }, [error, showModal]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const renderItem = ({ item }: { item: FileItem }) => (
    <FileItemComponent file={item} onRemove={removeFile} />
  );

  return (
    <Animated.FlatList
      data={files}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      onEndReached={loadMoreFiles}
      onEndReachedThreshold={0.5}
      ListFooterComponent={loading ? <LoadingIndicator /> : <View style={{ height: 16 }} />}
      contentContainerStyle={styles.listContainer}
      style={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: 20, // Ensure space for footer
  },
  list: {
    flexGrow: 0,
  },
}); 