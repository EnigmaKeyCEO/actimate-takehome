import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  TextInput,
  Animated,
  View,
} from "react-native";
import { Button, Text } from "native-base";
import * as ImagePicker from "expo-image-picker";
import { AnimatedModal } from "./common/AnimatedModal";
import { LoadingIndicator } from "#/components/common/LoadingIndicator";

import useFiles from "#/hooks/useFiles";

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
  const { uploadNewFile } = useFiles(folderId);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fadeAnim] = useState(new Animated.Value(0));
  const fadeAnimRef = useRef<Animated.Value>(fadeAnim);

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
        const formData = new FormData();
        formData.append('file', {
          uri: file.uri,
          type: file.type,
          name: file.fileName,
        } as any);
        await uploadNewFile(formData);
        setUploading(false);
        setError(null);
        onClose();
      } catch (err) {
        setError("Failed to upload image. Please try again.");
        setUploading(false);
        console.error(`
          Error Uploading Image...
          Error Details:
          ${JSON.stringify(err, null, 2)}
        `);
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      Animated.timing(fadeAnimRef.current, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnimRef.current, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
      setError(null); // Clear error when modal closes
    }
  }, [isOpen]);

  return (
    <AnimatedModal isOpen={isOpen} onClose={onClose}>
      <Animated.View style={{ opacity: fadeAnimRef.current }}>
        <Button
          onPress={handlePickImage}
          accessibilityRole="button"
          accessibilityLabel="Pick an Image"
          style={styles.button}
        >
          Pick an Image
        </Button>
        {uploading ? (
          <LoadingIndicator />
        ) : (
          <View style={{ height: 20 }} /> // Empty view to push the cancel button down
        )}
        {error && <Text style={styles.errorText}>{error}</Text>}
        <Button
          onPress={onClose}
          colorScheme="red"
          accessibilityRole="button"
          accessibilityLabel="Cancel"
          style={styles.button}
        >
          Cancel
        </Button>
      </Animated.View>
    </AnimatedModal>
  );
};

const styles = StyleSheet.create({
  button: {
    marginVertical: 8,
    width: "100%",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginVertical: 8,
  },
});
