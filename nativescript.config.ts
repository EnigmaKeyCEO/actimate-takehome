import { NativeScriptConfig } from "@nativescript/core";
import { default as appJson } from "./app.json";
import { Platform } from "react-native";

const iosConfig = appJson.expo.ios;
const androidConfig: any = appJson.expo.android;

const packageIdentifier = Platform.select({
  ios: iosConfig.bundleIdentifier,
  android: androidConfig.package,
});

export default {
  id: packageIdentifier,
  appResourcesPath: "App_Resources",
  android: {
    v8Flags: "--expose_gc",
    markingMode: "none",
    // Additional Android configurations
    // e.g., minSdkVersion, targetSdkVersion
    ...(Object.prototype.hasOwnProperty.call(
      androidConfig,
      "minSdkVersion"
    ) && { minSdkVersion: androidConfig.minSdkVersion }),
    ...(Object.prototype.hasOwnProperty.call(
      androidConfig,
      "targetSdkVersion"
    ) && { targetSdkVersion: androidConfig.targetSdkVersion }),
  },
  ios: {
    // iOS-specific configurations
    // e.g., deploymentTarget, build configurations
  },
  appHooksPath: "apphooks",
  webpackConfigPath: "webpack.config.js",
} as NativeScriptConfig;
