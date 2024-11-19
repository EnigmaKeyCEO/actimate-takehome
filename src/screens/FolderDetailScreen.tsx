import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useImages } from '../hooks/useImages';
import { ImageList } from '../components/ImageList';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';

type Props = NativeStackScreenProps<RootStackParamList, 'FolderDetail'>;

export function FolderDetailScreen({ route }: Props) {
  const { folderId } = route.params;
  const { images, loading, error, uploadImage, sortImages } = useImages(folderId);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error.message} />;
  }

  return (
    <View style={styles.container}>
      <ImageList images={images} onSort={sortImages} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});

export default FolderDetailScreen;
