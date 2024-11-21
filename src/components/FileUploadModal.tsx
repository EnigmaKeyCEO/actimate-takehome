import React, { useState } from "react";
import { Modal, View, Button, Text, StyleSheet } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { uploadFile } from "#/api";
import { FileUpload } from "#/types";

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
  const [file, setFile] = useState<DocumentPicker.DocumentPickerAsset | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const pickFile = async () => {
    try {
      const pickedFiles = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });
      const result = pickedFiles.assets?.[0];
      if (result) {
        setFile(result);
      }
    } catch (err) {
      setError("Failed to pick a file.");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("No file selected.");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("folderId", folderId);
      formData.append("fileName", file.name);
      formData.append(
        "contentType",
        file.mimeType || "application/octet-stream"
      );

      const fileBlob = new Blob([file.uri], {
        type: file.mimeType || "application/octet-stream",
      });

      formData.append("file", fileBlob, file.name);

      await uploadFile(folderId, formData);

      // Handle successful upload (e.g., refresh file list, close modal)
      onClose();
    } catch (err) {
      setError("Failed to upload the file.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Modal visible={isOpen} transparent>
      <View style={styles.container}>
        <View style={styles.modal}>
          <Text style={styles.title}>Upload File</Text>
          {error && <Text style={styles.errorText}>{error}</Text>}
          <Button title="Pick a File" onPress={pickFile} />
          {file && <Text>{file.name}</Text>}
          <Button
            title={isUploading ? "Uploading..." : "Upload"}
            onPress={handleUpload}
            disabled={isUploading}
          />
          <Button title="Cancel" onPress={onClose} />
        </View>
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
  modal: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
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
