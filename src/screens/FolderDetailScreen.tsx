import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, Image, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { getImages, uploadImage, deleteImage } from '../api/api';
import { Image as ImageType } from '../types/Image';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../types/RootStackParamList';
import * as ImagePicker from 'expo-image-picker';

type FolderDetailScreenRouteProp = RouteProp<RootStackParamList, 'FolderDetail'>;

const FolderDetailScreen: React.FC = () => {
  const route = useRoute<FolderDetailScreenRouteProp>();
  const { folderId } = route.params;

  const [images, setImages] = useState<ImageType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [sort, setSort] = useState<string>('name');
  const [lastKey, setLastKey] = useState<string | undefined>(undefined);

  const fetchImages = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const data = await getImages(folderId, page, sort);
      setImages(prev => [...prev, ...data.images]);
      setLastKey(data.lastKey);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [page, sort]);

  const handleUploadImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Permission Denied", "You need to grant camera permissions to upload images.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      const fileName = uri.split('/').pop() || 'image.jpg';
      const response = await fetch(uri);
      const blob = await response.blob();
      const file = new File([blob], fileName, { type: blob.type });

      const newImage = await uploadImage(folderId, file);
      setImages([newImage, ...images]);
    }
  };

  const handleDeleteImage = async (id: string) => {
    await deleteImage(folderId, id);
    setImages(images.filter(image => image.id !== id));
  };

  const renderItem = ({ item }: { item: ImageType }) => (
    <View style={styles.imageItem}>
      <Image source={{ uri: item.url }} style={styles.image} />
      <Text style={styles.imageName}>{item.name}</Text>
      <Button title="Delete" onPress={() => handleDeleteImage(item.id)} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Button title="Upload Image" onPress={handleUploadImage} />
      <FlatList
        data={images}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        onEndReached={() => {
          if (lastKey) {
            setPage(prev => prev + 1);
          }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading ? <ActivityIndicator /> : null}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  imageItem: {
    marginVertical: 8,
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
  },
  imageName: {
    marginTop: 8,
    fontSize: 16,
  },
});

export default FolderDetailScreen;
