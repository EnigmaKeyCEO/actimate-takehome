import React from "react";
import useAmplify from "../hooks/useAmplify";
import { Image } from "../types";

type ImageContextType = {
  getImages: (folderID: string) => Promise<Array<Image>>;
};

const ImageContext = React.createContext<ImageContextType>({
  getImages: async () => Promise.resolve([]),
});

const ImageProvider = ({ children }: { children: React.ReactNode }) => {
  const { read } = useAmplify();

  const getImages = async (folderID: string = "root") => {
    const result = await read(folderID);
    return result as Array<Image>;
  };
  return (
    <ImageContext.Provider value={{ getImages }}>
      {children}
    </ImageContext.Provider>
  );
};

export default ImageProvider;
