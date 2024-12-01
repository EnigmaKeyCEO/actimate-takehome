import React, { useState } from "react";
import { Button, FlatList, Text, View } from "react-native";
import { useImageContext } from "#/hooks/useImages";

export default function MainPage() {
  const { createImage, images = [] } = useImageContext();
  const [loading, setLoading] = useState(false);

  const handleCreateImage = async () => {
    setLoading(true);
    await createImage();
    setLoading(false);
  };

  return (
    <View>
      <Button
        title={loading ? "loading..." : "Create Image"}
        onPress={handleCreateImage}
        disabled={loading}
      />
      <FlatList
        data={images}
        renderItem={({ item }) => <Text>{item.name}</Text>}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}
