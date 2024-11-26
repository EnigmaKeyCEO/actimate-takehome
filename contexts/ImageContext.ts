import React from "react";
import { Image } from "../types";

export type ImageContextType = {
  images: Array<Image>;
  getImages: (folderID: string) => Promise<Array<Image>>;
  createImage: () => Promise<boolean>;
};

export const ImageContext = React.createContext<ImageContextType>({
  images: [],
  getImages: async () => Promise.resolve([]),
  createImage: async () => Promise.resolve(false),
});
