import React from "react";
import { AmplifyContext } from "#/contexts/AmplifyContext";

export const useAmplify = () => {
  const context = React.useContext(AmplifyContext);
  if (context === undefined) {
    throw new Error("useAmplify must be used within a AmplifyProvider");
  }
  return context;
};

export default useAmplify;
