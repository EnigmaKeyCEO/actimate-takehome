import React from "react";
import * as API from "@aws-amplify/api";
import { DocumentType } from "@aws-amplify/core/internals/utils";

type AmplifyContextType = {
  getSignedUrl: (input: {
    path: string;
    expires: number;
  }) => Promise<DocumentType>;
};

const APIName = "amplify-expoexampleamplify-dev-28768";

const AmplifyContext = React.createContext<AmplifyContextType>({
  getSignedUrl: async () => "",
});

const ApiProvider = ({ children }: { children: React.ReactNode }) => {
  const { get } = API;
  const getSignedUrl = async (input: { path: string; expires: number }) => {
    const { response: body } = await get({
      apiName: APIName,
      path: input.path,
    });
    // this looks weird, but it's the only way to get the signed url from the response
    if (!body) {
      throw new Error("No response body");
    }
    const innerBody = (await body).body;
    if (!innerBody) {
      throw new Error("No inner body");
    }
    const signedUrl: DocumentType = await innerBody.json();
    if (!signedUrl) {
      throw new Error("No signed url");
    }
    return signedUrl;
  };
  const value = {
    getSignedUrl,
  };
  return (
    <AmplifyContext.Provider value={value}>{children}</AmplifyContext.Provider>
  );
};

export default ApiProvider;
