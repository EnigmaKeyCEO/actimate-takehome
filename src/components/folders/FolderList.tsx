import React from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';
import { useModal } from '../Modal'; // Removed ModalContextType import
import { Button } from 'native-base';

interface Folder {
  id: string;
  name: string;
}

interface FolderListProps {
  folders: Folder[];
}

export const FolderList: React.FC<FolderListProps> = ({ folders }) => {
  const { showModal } = useModal(); // Removed generic type argument

  const renderItem = ({ item }: { item: Folder }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.folderName}>{item.name}</Text>
      <Button
        onPress={() => showModal(`You pressed on ${item.name}`, 'info')}
        accessibilityRole="button"
        accessibilityLabel={`Press to interact with ${item.name}`}
      >
        Press
      </Button>
    </View>
  );

  return (
    <FlatList
      data={folders}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  folderName: {
    fontSize: 16,
  },
});
