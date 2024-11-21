import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TouchableWithoutFeedback } from 'react-native';
import { useTheme } from 'native-base';
import { SortField, SortOptions } from '#/types';
import { Ionicons } from '@expo/vector-icons';

interface SortHeaderProps {
  sortOptions: SortOptions;
  onSortChange: (field: SortField) => void;
}

export const SortHeader: React.FC<SortHeaderProps> = ({
  sortOptions,
  onSortChange,
}) => {
  const theme = useTheme();
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const hideMenu = () => {
    setTimeout(() => setMenuVisible(false), 500);
  };

  const handleSortChange = (field: SortField) => {
    onSortChange(field);
    hideMenu();
  };

  const sortFields: SortField[] = ['name', 'createdAt', 'updatedAt'];

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Sort By</Text>
      <TouchableOpacity
        onPress={toggleMenu}
        style={styles.menuButton}
        accessibilityLabel="Sort Options Menu"
        accessibilityRole="button"
      >
        <Ionicons name="menu" size={24} color="black" />
      </TouchableOpacity>

      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                {sortFields.map((field) => (
                  <TouchableOpacity
                    key={field}
                    style={styles.menuItem}
                    onPress={() => handleSortChange(field)}
                    accessibilityLabel={`Sort by ${field}`}
                    accessibilityRole="button"
                  >
                    <Text
                      style={[
                        styles.menuText,
                        sortOptions.field === field && styles.selectedText,
                      ]}
                    >
                      {capitalize(field)}
                    </Text>
                    {sortOptions.field === field && (
                      <Ionicons
                        name={
                          sortOptions.direction === 'asc'
                            ? 'chevron-up'
                            : 'chevron-down'
                        }
                        size={16}
                        color="black"
                        style={styles.chevron}
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    padding: 16,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 100,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  menuButton: {
    padding: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 16,
    marginTop: 50,
    marginRight: 16,
    borderRadius: 8,
    width: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  menuText: {
    fontSize: 16,
    flex: 1,
  },
  selectedText: {
    fontWeight: 'bold',
  },
  chevron: {
    marginLeft: 8,
  },
}); 