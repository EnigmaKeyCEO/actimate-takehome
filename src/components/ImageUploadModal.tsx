import React, { useState, useRef } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface ImageUploadModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (file: File) => Promise<void>;
}

export const ImageUploadModal: React.FC<ImageUploadModalProps> = ({
  visible,
  onClose,
  onSubmit,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsSubmitting(true);
    try {
      await onSubmit(file);
    } finally {
      setIsSubmitting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.title}>Upload Image</Text>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
          <View style={styles.buttons}>
            <TouchableOpacity
              style={[styles.button, styles.uploadButton]}
              onPress={() => fileInputRef.current?.click()}
              disabled={isSubmitting}
            >
              <Text style={[styles.buttonText, styles.uploadButtonText]}>
                {isSubmitting ? 'Uploading...' : 'Select Image'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
              disabled={isSubmitting}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    width: '90%',
    maxWidth: 400,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginLeft: 8,
  },
  uploadButton: {
    backgroundColor: '#2196F3',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
  },
  buttonText: {
    fontSize: 16,
  },
  uploadButtonText: {
    color: 'white',
  },
});