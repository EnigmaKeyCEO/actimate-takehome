import { FileItem } from "#/types";
import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

interface FileFormProps {
  file: FileItem;
  onChangeName: (name: string) => void;
}

export const FileForm: React.FC<FileFormProps> = ({ file, onChangeName }) => {
  const [name, setName] = useState(file.name);

  const handleNameChange = (text: string) => {
    setName(text);
    onChangeName(text);
  };

  return (
    <View style={styles.formContainer}>
      <Text style={styles.label}>File Name:</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={handleNameChange}
        placeholder="Enter file name"
        autoCapitalize="none"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    marginVertical: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    fontSize: 16,
  },
}); 