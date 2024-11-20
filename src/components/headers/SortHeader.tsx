import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from 'native-base';
import { SortField, SortOptions } from '#/types';

interface SortHeaderProps {
  sortOptions: SortOptions;
  onSortChange: (field: SortField) => void;
}

export const SortHeader: React.FC<SortHeaderProps> = ({
  sortOptions,
  onSortChange,
}) => {
  const theme = useTheme();

  const renderChevron = (field: SortField) => {
    if (sortOptions.field !== field) {
      return <Text style={styles.chevronHidden}>▼</Text>;
    }
    return sortOptions.direction === 'desc' ? (
      <Text style={[styles.chevron, styles.chevronDown]}>▼</Text>
    ) : (
      <Text style={[styles.chevron, styles.chevronUp]}>▼</Text>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => onSortChange('name')}
        style={styles.column}
      >
        <Text style={styles.title}>Name</Text>
        {renderChevron('name')}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onSortChange('updatedAt')}
        style={styles.column}
      >
        <Text style={styles.title}>Date Modified</Text>
        {renderChevron('updatedAt')}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onSortChange('createdAt')}
        style={styles.column}
      >
        <Text style={styles.title}>Date Created</Text>
        {renderChevron('createdAt')}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginVertical: 8,
    zIndex: 100,
  },
  column: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  chevron: {
    fontSize: 12,
    marginLeft: 5,
  },
  chevronDown: {
    transform: [{ rotate: '180deg' }],
  },
  chevronUp: {
    transform: [{ rotate: '0deg' }],
  },
  chevronHidden: {
    opacity: 0,
  },
}); 