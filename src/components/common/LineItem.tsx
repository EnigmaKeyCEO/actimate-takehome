import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Menu, IconButton, Icon, Pressable } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { Folder } from '#/types/Folder';
import { FileItem } from '#/types/File';

type ItemType = 'folder' | 'file';

interface LineItemProps {
  item: Folder | FileItem;
  type: ItemType;
  onPress: (item: Folder | FileItem) => void;
  onDelete: (id: string) => void;
  onUpdate: (item: Folder | FileItem) => void;
  onCreate?: (parentId: string) => void;
}

export const LineItem: React.FC<LineItemProps> = React.memo(({
  item,
  type,
  onPress,
  onDelete,
  onUpdate,
  onCreate,
}) => {
  const name = 'name' in item ? item.name : '';
  const createdAt = new Date(item.createdAt).toLocaleDateString();
  const updatedAt = new Date(item.updatedAt).toLocaleDateString();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.content} onPress={() => onPress(item)}>
        <View style={styles.nameColumn}>
          <Text style={styles.name}>{name}</Text>
        </View>
        <View style={styles.dateColumns}>
          <View style={styles.dateColumn}>
            <Text style={styles.dateText}>{updatedAt}</Text>
            <Text style={styles.labelText}>Updated</Text>
          </View>
          <View style={styles.dateColumn}>
            <Text style={styles.dateText}>{createdAt}</Text>
            <Text style={styles.labelText}>Created</Text>
          </View>
        </View>
      </TouchableOpacity>
      <Menu
        trigger={(triggerProps) => (
          <Pressable {...triggerProps}>
            <IconButton
              icon={<Icon as={MaterialIcons} name="more-vert" size="sm" />}
              variant="ghost"
            />
          </Pressable>
        )}
      >
        <Menu.Item onPress={() => onUpdate(item)}>Edit</Menu.Item>
        {type === 'folder' && onCreate && (
          <Menu.Item onPress={() => onCreate((item as Folder).id)}>
            New Subfolder
          </Menu.Item>
        )}
        <Menu.Item onPress={() => onDelete(item.id)}>Delete</Menu.Item>
      </Menu>
    </View>
  );
});

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