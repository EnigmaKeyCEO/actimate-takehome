import React, { useState } from "react";
import { Modal, FormControl, Input, Button } from "native-base";
import { Platform } from "react-native";

interface CreateFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  parentId: string | null;
}

export function CreateFolderModal({
  isOpen,
  onClose,
  parentId,
}: CreateFolderModalProps) {
  const [name, setName] = useState("");

  const handleCreate = async () => {
    try {
      await fetch("/.netlify/functions/folders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method: "CREATE",
          data: {
            name,
            parentId,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          },
        }),
      });

      onClose();
      setName("");
    } catch (error) {
      console.error("Failed to create folder:", error);
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
        <Modal.Header>Create New Folder</Modal.Header>
        <Modal.Body>
          <FormControl>
            <FormControl.Label>Folder Name</FormControl.Label>
            <Input
              value={name}
              onChangeText={setName}
              placeholder="Enter folder name"
            />
          </FormControl>
        </Modal.Body>
        <Modal.Footer>
          <Button.Group space={2}>
            <Button variant="ghost" onPress={onClose}>
              Cancel
            </Button>
            <Button onPress={handleCreate}>Create</Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}

export default CreateFolderModal;
