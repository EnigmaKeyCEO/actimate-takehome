import React from "react";
import { Button, FlatList, Text, View } from "react-native";
import { useImageContext } from "#/hooks/useImages";

export default function MainPage() {
  const { createImage, images = [] } = useImageContext();
  return (
    <View>
      <Button title="Create Image" onPress={createImage} />
      <FlatList
        data={images}
        renderItem={({ item }) => <Text>{item.name}</Text>}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}
