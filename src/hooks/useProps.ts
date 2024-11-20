import React from "react";
import { useParams } from "react-router-dom";
import { Platform } from "react-native";
import { useRoute } from "@react-navigation/native";

export function useProps<T extends Record<string, any>>() {
  const paramsRef = React.useRef<any>(null);
  if (Platform.OS !== "web") {
    const Tee = useParams<T>();
    paramsRef.current = Tee;
  } else {
    const route = useRoute();
    const Tee = route.params as T;
    paramsRef.current = Tee;
  }
  return paramsRef.current;
}
