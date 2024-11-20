import React from 'react';
import { Text, StyleSheet } from 'react-native';

interface ErrorTextProps {
  message: string;
}

export const ErrorText: React.FC<ErrorTextProps> = ({ message }) => {
  return <Text style={styles.error}>{message}</Text>;
};

const styles = StyleSheet.create({
  error: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
}); 