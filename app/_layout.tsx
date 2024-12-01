import React from "react";
import { Slot } from "expo-router";
import AmplifyProvider from "../providers/AmplifyProvider";
import AppProvider from "../providers/AppProvider";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import ImageProvider from "#/providers/ImageProvider";
import FolderProvider from "#/providers/FolderProvider";

export default function AppLayout() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <AmplifyProvider>
          <FolderProvider>
            <ImageProvider>
              <SafeAreaView>
                <Slot />
              </SafeAreaView>
            </ImageProvider>
          </FolderProvider>
        </AmplifyProvider>
      </AppProvider>
    </SafeAreaProvider>
  );
}
