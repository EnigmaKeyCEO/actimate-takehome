import { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: 'Image Folder Manager',
  slug: 'image-folder-manager',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff'
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.yourcompany.imagefoldermanager'
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff'
    },
    package: 'com.yourcompany.imagefoldermanager'
  },
  web: {
    favicon: './assets/favicon.png'
  },
  plugins: [
    [
      'expo-image-picker',
      {
        photosPermission: 'The app needs access to your photos to upload images.'
      }
    ]
  ]
};

export default config;