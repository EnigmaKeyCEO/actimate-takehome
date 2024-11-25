import React from "react";
import Storage, { TransferProgressEvent } from "@aws-amplify/storage";
import Clipboard from "expo-clipboard";
import { FileType, FolderType } from "../types";
import { Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ImageType } from "../types";

export type AppContextType = {
  takePhoto: () => void;
  pickImage: () => void;
  image: string | null; // selected image uri
  images: FileType[]; // list of images
  folders: FolderType[]; // list of folders
  percentage: number;
  copyToClipboard: () => void;
  uploadImage: (
    filename: string,
    img: Blob
  ) => Promise<{ path: string }>;
  downloadImage: (uri: string) => void;
  fetchImageFromUri: (uri: string) => Promise<Blob>;
  setLoading: (progress: TransferProgressEvent) => void;
  updatePercentage: (number: number) => void;
};

export const INITIAL_STATE: AppContextType = {
  takePhoto: () => {},
  pickImage: () => {},
  image: null,
  images: [],
  folders: [],
  percentage: 0,
  copyToClipboard: () => {},
  uploadImage: () => Promise.resolve({ path: "" }),
  downloadImage: () => {},
  fetchImageFromUri: () => Promise.resolve(new Blob()),
  setLoading: () => {},
  updatePercentage: () => {},
};

export const AppContext = React.createContext(INITIAL_STATE);

export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [image, setImage] = React.useState<ImageType | null>(null);
  const [percentage, setPercentage] = React.useState(0);

  React.useEffect(() => {
    (async () => {
      if (Platform.OS === "ios") {
        const cameraRollStatus =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
        if (
          cameraRollStatus.status !== "granted" ||
          cameraStatus.status !== "granted"
        ) {
          alert("Sorry, we need these permissions to make this work!");
        }
      } else if (Platform.OS === "android") {
        const cameraRollStatus =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (cameraRollStatus.status !== "granted") {
          alert("Sorry, we need these permissions to make this work!");
        }
      }
    })();
  }, []);

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
    });

    handleImagePicked(result);
  };

  const pickImage = async () => {
    console.log("pickImage");
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      quality: 1,
    });

    handleImagePicked(result);
  };

  const handleImagePicked = async (
    pickerResult: ImagePicker.ImagePickerResult
  ) => {
    try {
      if (pickerResult.canceled) {
        alert("Upload cancelled");
        return;
      } else {
        setPercentage(0);
        const img = await fetchImageFromUri(pickerResult.assets[0].uri);
        const uploadUrl = await uploadImage("demo.jpg", img);
        downloadImage(uploadUrl.path);
      }
    } catch (e) {
      console.log(e);
      alert("Upload failed");
    }
  };

  const uploadImage = async (filename: string, img: Blob) => {
    const data: Storage.UploadDataWithPathInput = {
      path: filename,
      data: img,
    };
    const output = await Storage.uploadData(data);
    return await output.result;
  };

  const setLoading = (progress: TransferProgressEvent) => {
    const calculated = Math.round(
      (progress.transferredBytes / (progress.totalBytes ?? 0)) * 100
    );
    updatePercentage(calculated); // due to s3 put function scoped
  };

  const updatePercentage = (number: number) => {
    setPercentage(number);
  };

  const downloadImage = async (uri: string) => {
    const response = await Storage.downloadData({ path: uri });
    const result = await response.result;
    setImage({ uri: result.path, name: result.path });
  };

  const fetchImageFromUri = async (uri: string) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return blob;
  };

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(image?.uri ?? "");
    alert("Copied image URL to clipboard");
  };

  const value = {
    takePhoto,
    pickImage,
    image,
    images: [], // TODO: implement
    folders: [], // TODO: implement
    percentage,
    copyToClipboard,
    uploadImage,
    downloadImage,
    fetchImageFromUri,
    setLoading,
    updatePercentage,
  } as AppContextType;

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
