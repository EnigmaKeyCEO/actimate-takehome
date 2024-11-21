import React from "react";
import {
  View,
  Text,
  IconButton,
  VStack,
  Button,
  Icon,
  Input,
  HStack,
} from "native-base";
import { FileItem } from "#/types";
import { ModalElementType, useModal } from "#/components/Modal";

export const FileItemComponent: React.FC<{
  file: FileItem;
  onRemove: (id: string) => void;
}> = ({ file, onRemove }) => {
  const { showModal, hideModal } = useModal<ModalElementType>();

  const handleRename = () => {
    hideModal();
    showModal?.({
      title: "Update File Name",
      body: (
        <Input
          defaultValue={file.name}
          onSubmitEditing={(e) => {
            // TODO: Implement update
            hideModal();
          }}
        />
      ),
      actions: [
        {
          label: "Cancel",
          onPress: hideModal,
        },
      ],
    });
  };

  const handleDelete = () => {
    hideModal();
    showModal?.({
      title: "Confirm Delete",
      body: "Are you sure you want to delete this file?",
      actions: [
        {
          label: "Cancel",
          onPress: hideModal,
        },
        {
          label: "Delete",
          onPress: () => {
            onRemove(file.id);
            hideModal();
          },
        },
      ],
    });
  };

  const fileOptionsContent = (
    <VStack space={3}>
      <Button colorScheme="blue" onPress={handleRename}>
        Rename
      </Button>
      <Button colorScheme="red" onPress={handleDelete}>
        Delete
      </Button>
    </VStack>
  );

  const showFileOptions = () => {
    showModal?.({
      title: "File Options",
      body: fileOptionsContent,
      actions: [
        {
          label: "Close",
          onPress: hideModal,
        },
      ],
    });
  };

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
      }}
    >
      <View style={{ flex: 1 }}>
        <Text fontSize="md" fontWeight="medium">
          {file.name}
        </Text>
        <View style={{ flexDirection: "row", marginTop: 4 }}>
          <Text fontSize="xs" color="gray.500">
            Created: {new Date(file.createdAt).toLocaleDateString()}
          </Text>
          <Text fontSize="xs" color="gray.500" ml={4}>
            Updated: {new Date(file.updatedAt).toLocaleDateString()}
          </Text>
        </View>
        {/* {file.description && (
          <Text fontSize="sm" color="gray.600" mt={1} numberOfLines={2}>{file.description}</Text>
        )} */}
      </View>
      <IconButton icon={<Icon name="more-vert" />} onPress={showFileOptions} />
    </View>
  );
};
