import React from "react";
import { Button, Text, View } from "react-native";
import useAppContext from "../hooks/useAppContext";

export default function MainPage() {
  const { pickImage } = useAppContext();
  return (
    <View>
      <Text>Hello World</Text>
      <Button title="Pick Image" onPress={pickImage} />
    </View>
  );
}
