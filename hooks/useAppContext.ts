import React from "react";
import { AppContext } from "#/contexts/AppContext";

export const useAppContext = () => {
  const context = React.useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within a AppProvider");
  }
  return context;
};

export default useAppContext;
