import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  View,
  Button,
  StyleSheet,
  ActivityIndicator,
  Text,
  Animated,
  Dimensions,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useImages } from "#/hooks/useImages";
import { AnimatedModal } from "#/components/AnimatedModal";

interface UploadImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  folderId: string;
}

export const UploadImageModal: React.FC<UploadImageModalProps> = ({
  isOpen,
  onClose,
  folderId,
}) => {
  const { uploadImage } = useImages(folderId);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fadeAnim] = useState(new Animated.Value(0));

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      try {
        setUploading(true);
        const file = result.assets?.[0] as ImagePicker.ImagePickerAsset;
        if (!file) {
          setError("No image selected.");
          setUploading(false);
          return;
        }
        await uploadImage(file);
        setUploading(false);
        onClose();
      } catch (err) {
        setError("Failed to upload image.");
        setUploading(false);
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isOpen, fadeAnim]);

  return (
    <AnimatedModal isOpen={isOpen} onClose={onClose}>
      <Animated.View style={{ opacity: fadeAnim }}>
        <Button title="Pick an Image" onPress={handlePickImage} />
        {uploading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <View style={{ height: 20 }} /> // empty view to push the cancel button down
        )}
        {error && <Text style={styles.errorText}>{error}</Text>}
        <Button title="Cancel" onPress={onClose} color="red" />
      </Animated.View>
    </AnimatedModal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  modalContainer: {
    width: "100%",
    padding: 16,
    backgroundColor: "#fff",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    alignItems: "center",
    // For iOS shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    // For Android shadow
    elevation: 5,
  },
  errorText: {
    color: "red",
    marginVertical: 8,
    textAlign: "center",
  },
});
