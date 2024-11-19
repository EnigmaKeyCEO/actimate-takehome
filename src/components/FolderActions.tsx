import React from 'react';
import { View } from 'react-native';
import { Button, Icon } from 'native-base';
import AntDesign from '@expo/vector-icons/AntDesign';

interface FolderActionsProps {
  onAddFolder: () => void;
  onAddImage: () => void;
}

export function FolderActions({ onAddFolder, onAddImage }: FolderActionsProps) {
  return (
    <View style={{ flexDirection: 'row', gap: 8, padding: 16 }}>
      <Button
        leftIcon={<Icon as={AntDesign} name="addfolder" size="sm" />}
        onPress={onAddFolder}
      >
        Add Folder
      </Button>
      <Button
        leftIcon={<Icon as={AntDesign} name="picture" size="sm" />}
        onPress={onAddImage}
      >
        Add Image
      </Button>
    </View>
  );
}