import React, { useState } from "react";
import useAmplify from "../hooks/useAmplify";
import { Image } from "../types";
import useFolder from "#/hooks/useFolder";

type ImageContextType = {
  images: Array<Image>;
  getImages: (folderID: string) => Promise<Array<Image>>;
};

const ImageContext = React.createContext<ImageContextType>({
  images: [],
  getImages: async () => Promise.resolve([]),
});

const ImageProvider = ({ children }: { children: React.ReactNode }) => {
  const { list } = useAmplify();
  const [images, setImages] = useState<Array<Image>>([]);
  const { currentFolder } = useFolder();

  const getImages = React.useCallback(
    async (folderID: string = currentFolder) => {
      const result = await list<Image>(folderID);
      const _images = (result.items as Array<Image>) ?? [];
      setImages(_images);
      return _images;
    },
    [list, currentFolder]
  );

  React.useEffect(() => {
    getImages();
  }, [getImages]);

  const value = React.useMemo(
    () => ({
      images,
      getImages,
    }),
    [images, getImages]
  );

  return (
    <ImageContext.Provider value={value}>{children}</ImageContext.Provider>
  );
};

export default ImageProvider;
