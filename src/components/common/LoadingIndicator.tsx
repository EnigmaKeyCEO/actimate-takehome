import React from 'react';
import { View, StyleSheet } from "react-native";
import { Spinner } from "native-base";

interface LoadingIndicatorProps {
  size?: number | 'small' | 'large';
  color?: string;
  style?: object;
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  size = 'small',
  color = '#000',
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <Spinner size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
