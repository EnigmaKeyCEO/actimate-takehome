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
        type: "image/*", // Restrict to images initially
        copyToCacheDirectory: true,
      });

      if (result.canceled === false && result.assets.length > 0) {
        const asset = result.assets[0];
        const fileName = asset.name;
        const contentType = asset.mimeType || "application/octet-stream";

        const formData = new FormData();
        formData.append("folderId", folderId);
        formData.append("fileName", fileName);
        formData.append("contentType", contentType);
        formData.append("file", {
          uri: asset.uri,
          name: fileName,
          type: contentType,
        } as any);

        console.log("Uploading file with FormData:", {
          folderId,
          fileName,
          contentType,
          uri: asset.uri,
        }); // Debugging log

        const data = await uploadFile(folderId, formData);
        console.log("File uploaded successfully:", data);
        onClose(); // Close modal after successful upload
      } else {
        setError("File selection was canceled.");
      }
    } catch (err: any) {
      console.error("File upload error:", err);
      setError(err.message || "An error occurred during file upload.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal visible={isOpen} animationType="slide">
      <View style={styles.container}>
        <Text style={styles.title}>Upload Image</Text>
        {error && <Text style={styles.errorText}>{error}</Text>}
        <Button
          title={uploading ? "Uploading..." : "Select Image"}
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
    textAlign: "center",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
});
