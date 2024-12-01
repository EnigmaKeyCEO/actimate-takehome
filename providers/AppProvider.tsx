import React from "react";
import { Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { AppContext, AppContextType } from "#/contexts/AppContext";

export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [image, setImage] = React.useState<ImagePicker.ImagePickerAsset | null>(
    null
  );
  const [error, setError] = React.useState<Error | null>(null);

  const [cameraPermissionStatus, requestCameraPermissions] =
    ImagePicker.useCameraPermissions();
  const [mediaLibraryPermissionStatus, requestMediaLibraryPermissions] =
    ImagePicker.useMediaLibraryPermissions();

  const permissions = React.useRef<{
    camera: boolean;
    mediaLibrary: boolean;
  }>({
    camera: cameraPermissionStatus?.status === "granted",
    mediaLibrary: mediaLibraryPermissionStatus?.status === "granted",
  });

  React.useEffect(() => {
    (async () => {
      if (Platform.OS === "ios") {
        // only iOS requires camera permission
        if (!permissions.current.camera) {
          permissions.current.camera =
            cameraPermissionStatus?.status === "granted";
        }
        if (!permissions.current.camera) {
          const permissionPromise = await requestCameraPermissions();
          permissions.current.camera = permissionPromise.status === "granted";
        }
      }
      // all implemented platforms require mediaLibrary permission
      if (!permissions.current.mediaLibrary) {
        permissions.current.mediaLibrary =
          mediaLibraryPermissionStatus?.status === "granted";
      }
      if (!permissions.current.mediaLibrary) {
        const permissionPromise = await requestMediaLibraryPermissions();
        permissions.current.mediaLibrary =
          permissionPromise.status === "granted";
      }
      if (
        (Platform.OS === "ios" && !permissions.current.camera) ||
        !permissions.current.mediaLibrary
      ) {
        setError(
          new Error("Sorry, we need these permissions to make this work!")
        );
      }
    })();
  }, [
    cameraPermissionStatus,
    mediaLibraryPermissionStatus,
    requestCameraPermissions,
    requestMediaLibraryPermissions,
  ]);

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
    });

    handleImagePicked(result);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      quality: 1,
    });
    return await handleImagePicked(result);
  };

  const handleImagePicked = async (
    pickerResult: ImagePicker.ImagePickerResult
  ) => {
    try {
      if (pickerResult.canceled) {
        setError(new Error("User cancelled image selection"));
        return;
      } else {
        console.log("image picked", pickerResult.assets[0]);
        setImage(pickerResult.assets[0]);
        return pickerResult.assets[0];
      }
    } catch (e) {
      console.error(e);
      setError(e as Error);
    }
  };

  const value = {
    takePhoto,
    pickImage,
    image,
    error,
  } as AppContextType;

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
