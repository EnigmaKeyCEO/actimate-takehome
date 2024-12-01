import { useContext } from "react";
import { ImageContext } from "#/contexts/ImageContext";

export const useImageContext = () => {
  const context = useContext(ImageContext);
  if (!context) throw new Error("useImageContext must be used within an ImageProvider");
  return context;
};
