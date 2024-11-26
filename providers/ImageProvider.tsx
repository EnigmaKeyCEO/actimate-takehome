import React, { useState } from "react";

import { uploadData } from "@aws-amplify/storage";

import { Image, ImageFile } from "#/types";
import { ImageContextType, ImageContext } from "#/contexts/ImageContext";

import useAmplify from "#/hooks/useAmplify";
import useFolder from "#/hooks/useFolder";
import useAppContext from "#/hooks/useAppContext";

const ImageProvider = ({ children }: { children: React.ReactNode }) => {
  const { image, pickImage } = useAppContext();
  const { list, create } = useAmplify();
  const [images, setImages] = useState<Array<Image>>([]);
  const { currentFolder } = useFolder();

  /**
   * Create an image
   * @returns A boolean indicating whether the image was created successfully
   */
  const createImage: ImageContextType["createImage"] =
    React.useCallback(async () => {
      await pickImage();
      if (!(image && image.file)) throw new Error("No image selected");
      const s3result = await uploadData({
        path: `${currentFolder.id}/${image.fileName}`,
        data: image.file,
      }).result;
      if (!s3result) throw new Error("Failed to upload image to S3");
      const result = await create<Image>({
        folderId: currentFolder.id,
        folder: currentFolder,
        name:
          image.fileName ?? s3result.metadata?.name ?? Date.now().toString(),
        file: {
          id: s3result.path,
          __typename: "ImageFile",
          bucket: s3result.metadata?.bucket ?? "default",
          key: s3result.path,
          region: s3result.metadata?.region ?? "default",
        } as ImageFile,
      } as Image);
      console.debug("createImage", result);
      return result ? true : false;
    }, [pickImage, image, currentFolder, create]);

  /**
   * Get images from the current folder
   * @param folderID - The folder ID to get images from
   * @returns An array of images
   */
  const getImages = React.useCallback(
    async (folderID: string = currentFolder.id) => {
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
      createImage,
    }),
    [images, getImages, createImage]
  );

  return (
    <ImageContext.Provider value={value}>{children}</ImageContext.Provider>
  );
};

export default ImageProvider;
