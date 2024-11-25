import React, { useState } from "react";
import {
  uploadData,
  downloadData,
  remove,
  list,
  getProperties,
  copy,
  getUrl,
} from "@aws-amplify/storage";
import type {
  DownloadDataWithPathInput,
  DownloadDataWithPathOutput,
  RemoveWithPathInput,
  RemoveWithPathOutput,
  UploadDataWithPathInput,
  UploadDataWithPathOutput,
} from "@aws-amplify/storage";
import type {
  StorageUploadDataPayload,
  CreateFolderInput,
  CreateImageInput,
  DeleteFolderInput,
  DeleteImageInput,
  Folder,
  Image,
  ListFoldersQuery,
  ListImagesQuery,
  UpdateFolderInput,
  UpdateImageInput,
} from "../types";
import { Amplify } from "@aws-amplify/core";
import outputs from "../amplify_outputs.json";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource";

let _client: ReturnType<typeof generateClient<Schema>>;

type AmplifyContextType = {
  // TODO: remove this once the methods are implemented
  client: ReturnType<typeof generateClient<Schema>>; // only temporarily expose for testing
  ready: boolean;
  create: (
    input: CreateImageInput | CreateFolderInput,
    data?: StorageUploadDataPayload
  ) => Promise<boolean>;
  read: (id?: string) => Promise<ListImagesQuery | ListFoldersQuery | null>;
  update: (
    id: string,
    data: UpdateImageInput | UpdateFolderInput
  ) => Promise<boolean>;
  delete: (id: DeleteImageInput | DeleteFolderInput) => Promise<boolean>;
  list: (id: string) => Promise<Array<Image | Folder>>;
};

export const AmplifyContext = React.createContext<AmplifyContextType>({
  ready: false, // TODO: remove this (below) once the methods are implemented
  client: null as unknown as ReturnType<typeof generateClient<Schema>>,
  create: async () => Promise.resolve(false),
  read: async () => Promise.resolve(null),
  update: async () => Promise.resolve(false),
  delete: async () => Promise.resolve(false),
  list: async () => Promise.resolve([]),
});

const ApiProvider = ({ children }: { children: React.ReactNode }) => {
  const [ready, setIsConfigured] = useState(false);
  const [client, _setClient] = useState<
    ReturnType<typeof generateClient<Schema>> | undefined
  >(_client);
  const [error, setError] = useState<Error | null>(null);

  // set the client and update the global variable
  const setClient = (c: ReturnType<typeof generateClient<Schema>>) => {
    _setClient(c);
    _client = c;
  };

  // initialize the app
  const __inti__ = async () => {
    try {
      await Amplify.configure(outputs);
      setClient(generateClient<Schema>());
      setIsConfigured(true);
    } catch (e) {
      if (e instanceof Error) {
        console.error("Error Initializing App", e.message);
        setError(e);
      } else {
        console.error("Error Initializing App", e);
        setError(new Error("Unknown error"));
      }
      return false;
    }
    return true;
  };

  // initialize the app on mount
  React.useEffect(() => {
    __inti__();
  }, []);

  // log the client status
  React.useEffect(() => {
    if (ready) {
      if (client && client.models && client.models.Folder) {
        console.log("App is Ready");
      } else {
        console.error("Error initializing App");
      }
    }
  }, [ready]);

  // create a new image or folder
  const create = async (
    input: CreateImageInput | CreateFolderInput,
    data?: StorageUploadDataPayload
  ) => {
    switch (true) {
      case (input as CreateImageInput) !== null:
        if (!data) throw new Error("No data provided");
        return createImage(input as CreateImageInput, data);
      case (input as CreateFolderInput) !== null:
        return createFolder(input);
      default:
        throw new Error("Invalid data type");
    }
  };

  // create a new image
  const createImage = async (
    input: CreateImageInput,
    data: StorageUploadDataPayload
  ) => {
    const uploadDataInput: UploadDataWithPathInput = {
      path: input.folderID,
      data: data,
    };
    const response: UploadDataWithPathOutput = await uploadData(
      uploadDataInput
    );
    return response.result
      .then((result) => {
        console.log(result);
        return true;
      })
      .catch(() => false);
  };

  // create a new folder
  const createFolder = async (input: CreateFolderInput) => {
    // use dynamodb to create folder
    return true;
  };

  // stub in the rest so i can do this right:
  // TODO: implement read, update, delete
  const read = async () => Promise.resolve(null);
  const update = async () => Promise.resolve(false);
  const del = async () => Promise.resolve(false);
  const list = async () => Promise.resolve([]);

  const value = {
    client: client!, // only temporarily expose for testing
    ready,
    create,
    read,
    update,
    delete: del,
    list,
  };
  return (
    <AmplifyContext.Provider value={value}>{children}</AmplifyContext.Provider>
  );
};

export default ApiProvider;
