import { ImagePickerAsset } from "expo-image-picker";
import React from "react";

export type AppContextType = {
  takePhoto: () => void;
  pickImage: () => void;
  image: ImagePickerAsset | null;
  error: Error | null;
};

export const INITIAL_STATE: AppContextType = {
  takePhoto: () => {},
  pickImage: () => {},
  image: null,
  error: null,
};

export const AppContext = React.createContext(INITIAL_STATE);
