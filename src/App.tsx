import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  NativeRouter,
  Route as NativeRoute,
  Routes as NativeRoutes,
} from "react-router-native";
import {
  BrowserRouter,
  Route as BrowserRoute,
  Routes as BrowserRoutes,
} from "react-router-dom";
import { LogBox, Platform, SafeAreaView } from "react-native";
import { NativeBaseProvider, extendTheme } from "native-base";
import { FolderScreen } from "./screens/FolderScreen";
import { Modal, ModalProvider } from "#/components/Modal";
import { FolderProvider } from "#/providers/FolderProvider";

const theme = extendTheme({
  config: {
    useSystemColorMode: false,
    initialColorMode: "light",
  },
});

// Configure NativeBase for web
const config = {
  // Disable features not supported on web
  disableBackHandler: Platform.OS === "web",
  backHandler: undefined,
  suppressColorAccessibilityWarning: true,
};

// quick and dirty way to handle web and native routing, but it works
const Router = Platform.OS === "web" ? BrowserRouter : NativeRouter;
const Routes = Platform.OS === "web" ? BrowserRoutes : NativeRoutes;
const Route = Platform.OS === "web" ? BrowserRoute : NativeRoute;

export default function App() {
  React.useEffect(() => {
    LogBox.ignoreLogs([/Warning:/, /SSRProvider/]);
    // LogBox.ignoreAllLogs();
  }, []);
  return (
    <SafeAreaProvider>
      <NativeBaseProvider theme={theme} config={config}>
        <FolderProvider>
          <ModalProvider>
            <SafeAreaView style={{ flex: 1 }}>
              <Router future={{ v7_relativeSplatPath: true }}>
                <Routes>
                  <Route path="/" element={<FolderScreen />} />
                  <Route
                    path="/folder/:parentId"
                    element={<FolderScreen parentId=":parentId" />}
                  />
                </Routes>
              </Router>
              <Modal />
            </SafeAreaView>
          </ModalProvider>
        </FolderProvider>
      </NativeBaseProvider>
    </SafeAreaProvider>
  );
}
