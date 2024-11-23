import React from "react";
import Auth from "@aws-amplify/auth";
import Amplify from "aws-amplify";
import Storage from "@aws-amplify/storage";
import { platform } from "expo-clipboard";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import { Button, Image, StyleSheet, Text, View } from "react-native";

import awsconfig from "./aws-exports";
import AppProvider from "#/providers/AppProvider";

Amplify.configure(awsconfig);

export default function App() {
  return (
    <AppProvider>
      {/* TODO: implement these features in another screen*/}
      {/* TODO: implement the Expo Router here*/}
      <View style={styles.container}>
        <Text style={styles.title}>AWS Storage Upload Demo</Text>
        {percentage !== 0 && (
          <Text style={styles.percentage}>{percentage}%</Text>
        )}

        {image && (
          <View>
            <Text style={styles.result} onPress={copyToClipboard}>
              <Image
                source={{ uri: image }}
                style={{ width: 250, height: 250 }}
              />
            </Text>
            <Text style={styles.info}>Long press to copy the image url</Text>
          </View>
        )}

        <Button onPress={pickImage} title="Pick an image from camera roll" />
        <Button onPress={takePhoto} title="Take a photo" />
      </View>
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: "center",
    marginHorizontal: 15,
  },
  percentage: {
    marginBottom: 10,
  },
  result: {
    paddingTop: 5,
  },
  info: {
    textAlign: "center",
    marginBottom: 20,
  },
});
