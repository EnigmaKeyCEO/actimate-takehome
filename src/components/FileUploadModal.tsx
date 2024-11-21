import React, { useState } from "react";
import { Modal, View, Button, Text, StyleSheet } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { uploadFile } from "#/api";

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  folderId: string;
}

export const FileUploadModal: React.FC<FileUploadModalProps> = ({
  isOpen,
  onClose,
  folderId,
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async () => {
    setUploading(true);
    setError(null);

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*", // Allow all file types
        copyToCacheDirectory: true,
      });

      if (result.canceled === false && result.assets.length > 0) {
        const formData = new FormData();
        const asset = result.assets[0];
        formData.append("folderId", folderId);
        formData.append("fileName", asset.name);
        formData.append(
          "contentType",
          asset.mimeType || "application/octet-stream"
        );
        formData.append("file", {
          uri: asset.uri,
          name: asset.name,
          type: asset.mimeType || "application/octet-stream", // Default type if not provided
        } as any);
        const data = await uploadFile(folderId, formData);
        console.log("File uploaded successfully:", data);
        onClose(); // Close modal after successful upload
      } else {
        setError("File selection was canceled.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred during file upload.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal visible={isOpen} animationType="slide">
      <View style={styles.container}>
        <Text style={styles.title}>Upload File</Text>
        {error && <Text style={styles.errorText}>{error}</Text>}
        <Button
          title="Select File"
          onPress={handleFileUpload}
          disabled={uploading}
        />
        <Button title="Cancel" onPress={onClose} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
});
