import React from "react";
import { Slot } from "expo-router";
import AmplifyProvider from "../providers/AmplifyProvider";
import AppProvider from "../providers/AppProvider";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function AppLayout() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <AmplifyProvider>
          <SafeAreaView>
            <Slot />
          </SafeAreaView>
        </AmplifyProvider>
      </AppProvider>
    </SafeAreaProvider>
  );
}
