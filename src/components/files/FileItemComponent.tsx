import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useModal } from '../Modal'; // Removed ModalElementType import
import { Button } from 'native-base';
import { FileItem } from '../../types/File';

interface FileItemComponentProps {
  file: FileItem;
}

export const FileItemComponent: React.FC<FileItemComponentProps> = ({ file }) => {
  const { showModal } = useModal(); // Removed generic type argument

  return (
    <View style={styles.itemContainer}>
      <Text style={styles.fileName}>{file.name}</Text>
      <Button
        onPress={() => showModal(`You pressed on ${file.name}`, 'info')}
        accessibilityRole="button"
        accessibilityLabel={`Press to interact with ${file.name}`}
      >
        Press
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  fileName: {
    fontSize: 16,
  },
});
