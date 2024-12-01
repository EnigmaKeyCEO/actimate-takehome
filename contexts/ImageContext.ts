import React from "react";
import { Image } from "../types";

export type ImageContextType = {
  images: Array<Image>;
  progress: number;
  getImages: (folderID: string) => Promise<Array<Image>>;
  createImage: () => Promise<boolean>;
};

export const ImageContext = React.createContext<ImageContextType>({
  images: [],
  progress: 0,
  getImages: async () => Promise.resolve([]),
  createImage: async () => Promise.resolve(false),
});
