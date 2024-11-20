import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Menu, IconButton } from 'native-base';
import { Folder } from '#/types';

interface FolderItemProps {
  folder: Folder;
  onPress: (folder: Folder) => void;
  onDelete: (folderId: string) => void;
}

export const FolderItem: React.FC<FolderItemProps> = ({ 
  folder, 
  onPress, 
  onDelete 
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.content} 
        onPress={() => onPress(folder)}
      >
        <View style={styles.nameColumn}>
          <Text style={styles.name}>{folder.name}</Text>
        </View>
        <View style={styles.dateColumns}>
          <View style={styles.dateColumn}>
            <Text style={styles.dateText}>{new Date(folder.updatedAt).toLocaleDateString()}</Text>
            <Text style={styles.labelText}>Updated</Text>
          </View>
          <View style={styles.dateColumn}>
            <Text style={styles.dateText}>{new Date(folder.createdAt).toLocaleDateString()}</Text>
            <Text style={styles.labelText}>Created</Text>
          </View>
        </View>
      </TouchableOpacity>
      {/* Menu for additional actions can be added here if needed */}
      {/* 
      <Menu
        trigger={(triggerProps) => (
          <IconButton
            {...triggerProps}
            icon="more-vert"
            variant="ghost"
          />
        )}
      >
        <Menu.Item onPress={() => onUpdate(folder)}>Edit</Menu.Item>
        <Menu.Item onPress={() => onCreate(folder.id)}>New Subfolder</Menu.Item>
        <Menu.Item onPress={() => onDelete(folder.id)}>Delete</Menu.Item>
      </Menu> 
      */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  content: {
    flexDirection: 'row',
    flex: 1,
  },
  nameColumn: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
  },
  dateColumns: {
    flexDirection: 'row',
  },
  dateColumn: {
    marginLeft: 16,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 14,
  },
  labelText: {
    fontSize: 12,
    color: '#666',
  },
});
