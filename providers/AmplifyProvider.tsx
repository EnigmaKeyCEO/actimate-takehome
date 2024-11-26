import React, { useState } from "react";
import AmplifyContext from "../contexts/AmplifyContext";
import { Amplify } from "@aws-amplify/core";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource";
import outputs from "../amplify_outputs.json";
import type {
  CreateImageInput,
  CreateFolderInput,
  Image,
  Folder,
  DeleteFolderMutation,
  DeleteImageMutation,
  ListImagesQueryVariables,
  ListFoldersQueryVariables,
  ModelImageConnection,
  ModelFolderConnection,
  DeleteImageInput,
  DeleteFolderInput,
  UpdateImageInput,
} from "../types";
import { ModelConnection } from "../types";

import {
  createImage,
  createFolder,
  updateImage,
  deleteImage,
  deleteFolder,
} from "../graphql/mutations";
import { getImage, listImages, listFolders } from "../graphql/queries";

let _client: ReturnType<typeof generateClient<Schema>>;

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally empty so it only runs once

  // log the client status
  React.useEffect(() => {
    if (ready) {
      if (client && client.models && client.models.Folder) {
        console.log("App is Ready");
      } else {
        console.error("Error initializing App");
      }
    }
  }, [ready, client]);

  // create a new image or folder
  const create = async <T extends CreateImageInput | CreateFolderInput>(
    input: T
  ): Promise<boolean> => {
    switch (true) {
      case (input as CreateImageInput) !== null: {
        // TODO: add data validation
        // if (!input.data) throw new Error("No data provided");
        const response = await client?.graphql({
          query: createImage,
          variables: {
            input: input as CreateImageInput,
          },
        });
        return Boolean(response?.data?.createImage?.id);
      }
      case (input as CreateFolderInput) !== null: {
        const response = await client?.graphql({
          query: createFolder,
          variables: {
            input: input as CreateFolderInput,
          },
        });
        return Boolean(response?.data?.createFolder?.id);
      }
      default:
        throw new Error("Invalid data type");
    }
  };

  const read = async <T extends Image | Folder>(
    id: string
  ): Promise<T | null> => {
    const response = await client?.graphql({
      query: getImage,
      variables: {
        id,
      },
    });
    return response?.data?.getImage as T | null;
  };

  const update = async <T extends Image | Folder>(
    input: T
  ): Promise<boolean> => {
    const response = await client?.graphql({
      query: updateImage,
      variables: {
        input: input as UpdateImageInput,
      },
    });
    return Boolean(response?.data?.updateImage?.id);
  };

  const del = async <T extends Image | Folder>(input: T): Promise<boolean> => {
    const isFolder = (input as Folder) !== null;
    const response = await client?.graphql({
      query: isFolder ? deleteFolder : deleteImage,
      variables: {
        input: isFolder
          ? (input as DeleteFolderInput)
          : (input as DeleteImageInput),
      },
    });
    const data = response?.data;
    return isFolder
      ? Boolean(data as DeleteFolderMutation)
      : Boolean(data as DeleteImageMutation);
  };

  const list = async <T extends Image | Folder>(
    folderId: string = "root"
  ): Promise<
    ModelImageConnection | ModelFolderConnection
  > => {
    const type = {} as new (...args: unknown[]) => T;
    const query = type.name === "Image" ? listImages : listFolders;
    const response = await client?.graphql({
      query,
      variables:
        type.name === "Image"
          ? ({
              folderId: folderId,
            } as ListImagesQueryVariables)
          : ({
              id: folderId,
            } as ListFoldersQueryVariables),
    });
    return new ModelConnection(response?.data).list;
  };

  const value = {
    client: client!, // only temporarily expose for testing
    ready,
    error,
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
