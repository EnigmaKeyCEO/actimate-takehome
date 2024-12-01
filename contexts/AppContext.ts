import { ImagePickerAsset } from "expo-image-picker";
import React from "react";

export type AppContextType = {
  takePhoto: () => void;
  pickImage: () => Promise<ImagePickerAsset | null>;
  image: ImagePickerAsset | null;
  error: Error | null;
};

export const INITIAL_STATE: AppContextType = {
  takePhoto: () => {},
  pickImage: () => Promise.resolve(null),
  image: null,
  error: null,
};

export const AppContext = React.createContext(INITIAL_STATE);
