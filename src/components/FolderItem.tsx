import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Menu, IconButton } from 'native-base';
import { Folder } from '../types';

interface FolderItemProps {
  folder: Folder;
  onPress: (folder: Folder) => void;
  onDelete: (folderId: string) => void;
  onCreate: (parentId: string) => void;
  onUpdate: (folder: Folder) => void;
  onMenu?: (folder: Folder) => void;
}

export const FolderItem: React.FC<FolderItemProps> = ({ 
  folder, 
  onPress, 
  onDelete,
  onCreate,
  onUpdate,
  onMenu 
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
{/* 
      <Menu
        trigger={(triggerProps) => (
          <IconButton
            {...triggerProps}
            icon="more-vert"
            variant="ghost"
            onPress={() => onMenu?.(folder)}
          />
        )}
      >
        <Menu.Item onPress={() => onUpdate(folder)}>Edit</Menu.Item>
        <Menu.Item onPress={() => onCreate(folder.id)}>New Subfolder</Menu.Item>
        <Menu.Item onPress={() => onDelete(folder.id)}>Delete</Menu.Item>
      </Menu> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  nameColumn: {
    flex: 0.7,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  dateColumns: {
    flex: 0.3,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  dateColumn: {
    marginLeft: 16,
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    color: '#666',
  },
  labelText: {
    fontSize: 10,
    color: '#999',
    marginTop: 2,
  },
});

export default FolderItem;
