import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useImages } from '../hooks/useImages';
import { ImageList } from '../components/ImageList';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import * as ImagePicker from 'expo-image-picker';
import { Button } from 'native-base';
import { useParams } from 'react-router';

type Props = NativeStackScreenProps<RootStackParamList, 'FolderDetail'>;

export function FolderDetailScreen() {
  const params = useParams();
  const folderId = params.id;
  if (!folderId) {
    return <ErrorMessage message="Folder ID is required" />;
  }
  const { images, loading, error, uploadImage, sortImages } = useImages(folderId);

  const handleImageUpload = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        const response = await fetch(result.assets[0].uri);
        const blob = await response.blob();
        await uploadImage(blob as File);
      }
    } catch (err) {
      console.error('Error uploading image:', err);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error.message} />;
  }

  return (
    <View style={styles.container}>
      <Button onPress={handleImageUpload} mb={4}>
        Upload Image
      </Button>
      <ImageList images={images} onSort={sortImages} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
});

export default FolderDetailScreen;
