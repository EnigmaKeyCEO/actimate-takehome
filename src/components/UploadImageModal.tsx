import React, { useState } from "react";
import { Modal, FormControl, Input, Button, VStack } from "native-base";
import * as ImagePicker from "expo-image-picker";
import { Platform } from "react-native";
import useApi from "#/hooks/useApi";

interface UploadImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  folderId: string;
}

export function UploadImageModal({
  isOpen,
  onClose,
  folderId,
}: UploadImageModalProps) {
  const [name, setName] = useState("");
  const [selectedImage, setSelectedImage] =
    useState<ImagePicker.ImagePickerAsset | null>(null);

  const { apiBaseUrl } = useApi();

  const handleSelectImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0]);
      if (!name) {
        setName(result.assets[0].fileName || "Untitled Image");
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedImage) return;

    try {
      // Get upload URL from your API
      const response = await fetch(`${apiBaseUrl}/images`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method: "GET_UPLOAD_URL",
          data: {
            filename: selectedImage.fileName || "untitled.jpg",
            contentType: selectedImage.type || "image/jpeg",
          },
        }),
      });

      const { uploadUrl, filename } = await response.json();

      // Upload the file
      const blob = await fetch(selectedImage.uri).then((r) => r.blob());
      await fetch(uploadUrl, {
        method: "PUT",
        body: blob,
        headers: { "Content-Type": selectedImage.type || "image/jpeg" },
      });

      // Create image record
      await fetch(`${apiBaseUrl}/images`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method: "CREATE",
          data: {
            name,
            folderId,
            filename,
            contentType: selectedImage.type || "image/jpeg",
            size: selectedImage.fileSize || 0,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          },
        }),
      });

      onClose();
      setName("");
      setSelectedImage(null);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const modalProps = Platform.select({
    web: {
      closeOnOverlayClick: true,
      trapFocus: false,
      useRNModal: false,
    },
    default: {},
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} {...modalProps}>
      <Modal.Content>
        <Modal.Header>Upload Image</Modal.Header>
        <Modal.Body>
          <VStack space={4}>
            <FormControl>
              <FormControl.Label>Image Name</FormControl.Label>
              <Input
                value={name}
                onChangeText={setName}
                placeholder="Enter image name"
              />
            </FormControl>
            <Button onPress={handleSelectImage}>
              {selectedImage ? "Change Image" : "Select Image"}
            </Button>
            {selectedImage && (
              <Button colorScheme="primary" onPress={handleUpload}>
                Upload Image
              </Button>
            )}
          </VStack>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
}

export default UploadImageModal;
