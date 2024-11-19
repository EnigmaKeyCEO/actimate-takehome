import React from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import type { Image as ImageType, SortOptions } from '../types';

interface ImageListProps {
  images: ImageType[];
  onSort: (options: SortOptions) => void;
}

export const ImageList: React.FC<ImageListProps> = ({ images, onSort }) => {
  const renderItem = ({ item }: { item: ImageType }) => (
    <View style={styles.imageItem}>
      <Image
        source={{ uri: item.url }}
        style={styles.image}
        resizeMode="cover"
      />
      <Text style={styles.imageName}>{item.name}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Images</Text>
        <View style={styles.sortButtons}>
          <TouchableOpacity
            onPress={() => onSort({ field: 'name', direction: 'asc' })}
            style={styles.sortButton}
          >
            <Text>Sort by Name</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onSort({ field: 'created_at', direction: 'desc' })}
            style={styles.sortButton}
          >
            <Text>Sort by Date</Text>
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={images}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        style={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  sortButtons: {
    flexDirection: 'row',
  },
  sortButton: {
    marginLeft: 8,
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
  },
  list: {
    flex: 1,
  },
  imageItem: {
    flex: 1,
    margin: 4,
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
  },
  imageName: {
    padding: 8,
    fontSize: 14,
  },
});