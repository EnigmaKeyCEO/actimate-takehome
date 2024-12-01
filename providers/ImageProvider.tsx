import React, { useState } from "react";
import {
  uploadData,
  TransferProgressEvent,
  UploadDataWithPathOutput,
  UploadDataWithPathInput,
} from "@aws-amplify/storage";

import { CreateImageInput, Image, ImageFileInput } from "#/types";
import { ImageContextType, ImageContext } from "#/contexts/ImageContext";

import useAmplify from "#/hooks/useAmplify";
import useFolder from "#/hooks/useFolder";
import useAppContext from "#/hooks/useAppContext";

import amplifyOutputs from "#/amplify_outputs.json";

const ImageProvider = ({ children }: { children: React.ReactNode }) => {
  const { image, pickImage } = useAppContext();
  const { list, create, ready } = useAmplify();
  const [images, setImages] = useState<Array<Image>>([]);
  const { currentFolder } = useFolder();
  const [progress, setProgress] = useState(0);

  /**
   * Update the progress of the image upload
   * @param bytesLoaded - The number of bytes loaded
   * @param bytesTotal - The total number of bytes
   */
  const updateProgress = ({
    transferredBytes,
    totalBytes,
  }: TransferProgressEvent) => {
    setProgress(Math.round((transferredBytes / (totalBytes ?? 1)) * 100));
  };

  /**
   * Create an image
   * @returns A boolean indicating whether the image was created successfully
   */
  const createImage: ImageContextType["createImage"] =
    React.useCallback(async () => {
      if (!ready) {
        console.error("Amplify is not ready");
        return false;
      }

      const _img = await pickImage();
      if (!_img) {
        console.error("No image selected", image, _img);
        return false;
      }

      try {
        const uploadDataInput: UploadDataWithPathInput = {
          path: `${currentFolder.id}/${_img.fileName}`,
          data: _img.file!,
          options: {
            onProgress: updateProgress,
          },
        };
        const storageTask: UploadDataWithPathOutput = await uploadData(
          uploadDataInput
        );

        const s3result = await storageTask.result;

        if (!s3result.path) throw new Error("Failed to upload image to S3");

        const input: CreateImageInput = {
          folderId: currentFolder.id,
          name: _img.fileName ?? s3result.metadata?.name ?? Date.now().toString(),
          file: {
            bucket: amplifyOutputs.storage.bucket_name,
            key: s3result.path,
            region: amplifyOutputs.storage.aws_region,
          } as ImageFileInput,
        };
        return await create<CreateImageInput>(input);
      } catch (error) {
        console.error("Error creating image:", error);
        return false;
      }
    }, [pickImage, image, currentFolder, create, ready]);

  /**
   * Get images from the current folder
   * @param folderID - The folder ID to get images from
   * @returns An array of images
   */
  const getImages = React.useCallback(
    async (folderID: string = currentFolder.id) => {
      const result = await list<Image>(folderID);
      const _images = (result?.items as Array<Image>) ?? [];
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
      progress,
    }),
    [images, getImages, createImage, progress]
  );

  return (
    <ImageContext.Provider value={value}>{children}</ImageContext.Provider>
  );
};

export default ImageProvider;
