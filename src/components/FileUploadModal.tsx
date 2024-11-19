import React, { useState } from "react";
import { Modal, View, Button, Text, StyleSheet } from "react-native";
import * as DocumentPicker from 'expo-document-picker';

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
        type: '*/*', // Allow all file types
        copyToCacheDirectory: true,
      });

      if (result.type === 'success') {
        const formData = new FormData();
        formData.append('file', {
          uri: result.uri,
          name: result.name,
          type: result.mimeType || 'application/octet-stream', // Default type if not provided
        });

        const response = await fetch(`/.netlify/functions/files`, {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Failed to upload file');
        }

        console.log('File uploaded successfully:', data);
        onClose(); // Close modal after successful upload
      } else {
        setError('File selection was canceled.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred during file upload.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal visible={isOpen} animationType="slide">
      <View style={styles.container}>
        <Text style={styles.title}>Upload File</Text>
        {error && <Text style={styles.errorText}>{error}</Text>}
        <Button title="Select File" onPress={handleFileUpload} disabled={uploading} />
        <Button title="Cancel" onPress={onClose} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});
