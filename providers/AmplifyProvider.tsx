import React, { useState, useEffect } from "react";
import { Amplify } from "aws-amplify";
import { fetchAuthSession } from "@aws-amplify/core";
import amplifyOutputs from "#/amplify_outputs.json";
import AmplifyContext from "../contexts/AmplifyContext";
import { generateClient } from "aws-amplify/data";
import { signIn } from "@aws-amplify/auth";
import { getImage, listFolders, listImages } from "../graphql/queries";
import {
  createImage,
  createFolder,
  deleteFolder,
  deleteImage,
  updateImage,
} from "../graphql/mutations";
import type { Schema } from "../amplify/data/resource";
import {
  CreateFolderInput,
  CreateImageInput,
  DeleteFolderInput,
  DeleteFolderMutation,
  DeleteImageInput,
  DeleteImageMutation,
  Folder,
  Image,
  ListFoldersResponse,
  ListImagesResponse,
  ModelFolderConnection,
  ModelImageConnection,
  UpdateImageInput,
} from "#/types";

const AmplifyProvider = ({ children }: { children: React.ReactNode }) => {
  const [client, setClient] = useState<ReturnType<
    typeof generateClient<Schema>
  > | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const __init__ = async () => {
    try {
      Amplify.configure({
        ...amplifyOutputs,
        Auth: {
          Cognito: {
            userPoolId: amplifyOutputs.auth.user_pool_id,
            userPoolClientId: amplifyOutputs.auth.user_pool_client_id,
            identityPoolId: amplifyOutputs.auth.identity_pool_id,
            allowGuestAccess: true,
            groups: amplifyOutputs.auth.groups,
            signUpVerificationMethod: "code",
            loginWith: {
              email: true,
              phone: false
            }
          }
        }
      });

      console.log("Amplify configured with outputs:", amplifyOutputs);
      const generatedClient = generateClient<Schema>();
      console.log("Generated Client:", generatedClient);

      if (
        !(generatedClient as ReturnType<typeof generateClient<Schema>>).graphql
      ) {
        throw new Error("Failed to generate client");
      }

      setClient(generatedClient);
      await initializeGuestAccess();
      setReady(true);
    } catch (e) {
      console.error("Error Initializing App", e);
      setError(e as Error);
    }
  };

  useEffect(() => {
    if (ready === false) {
      __init__();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  const initializeGuestAccess = async () => {
    try {
      const session = await fetchAuthSession();
      if (!session.identityId) {
        await signIn({
          username: `guest_${Date.now()}`,
          password: `Guest123!${Date.now()}`,
          options: {
            authFlowType: "USER_SRP_AUTH",
          },
        });
      }
      console.log("Guest access initialized", session);
    } catch (error) {
      console.error("Error initializing guest access:", error);
      throw error;
    }
  };

  // create a new image or folder
  const create = async <T extends CreateImageInput | CreateFolderInput>(
    input: T
  ): Promise<boolean> => {
    if (!ready) return false;
    if ('file' in input) {
      const response = await client?.graphql({
        query: createImage,
        variables: {
          input: input as CreateImageInput,
        },
      });
      return Boolean(response?.data?.createImage?.id);
    } else {
      const response = await client?.graphql({
        query: createFolder,
        variables: {
          input: input as CreateFolderInput,
        },
      });
      return Boolean(response?.data?.createFolder?.id);
    }
  };

  const read = async <T extends Image | Folder>(
    id: string
  ): Promise<T | null> => {
    if (!ready) return null;
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
    if (!ready) return false;
    const response = await client?.graphql({
      query: updateImage,
      variables: {
        input: input as UpdateImageInput,
      },
    });
    return Boolean(response?.data?.updateImage?.id);
  };

  const del = async <T extends Image | Folder>(input: T): Promise<boolean> => {
    if (!ready) return false;
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
  const _listFolders = async (
    folderId: string = "root"
  ): Promise<ListFoldersResponse | null> => {
    if (!ready) return null;
    return client?.graphql({
      query: listFolders,
      variables: {
        filter: {
          parentId: { eq: folderId },
        },
      },
    }) as Promise<ListFoldersResponse>;
  };

  const _listImages = async (
    folderId: string = "root"
  ): Promise<ListImagesResponse | null> => {
    if (!ready) return null;
    return client!.graphql({
      query: listImages,
      variables: {
        filter: {
          folderId: { eq: folderId },
        },
      },
    });
  };

  const list = async <T extends Image | Folder | null>(
    folderId: string = "root"
  ): Promise<
    | ModelImageConnection
    | ModelFolderConnection
    | (ModelImageConnection & ModelFolderConnection)
    | null
  > => {
    if (!ready) return null;
    const isFolder = "parentId" in ({} as NonNullable<T>);
    const response = isFolder
      ? await _listFolders(folderId)
      : await _listImages(folderId);

    if (!response?.data) {
      return {
        listFolders: {
          items: [],
          nextToken: null,
        },
        listImages: {
          items: [],
          nextToken: null,
        },
      } as ModelFolderConnection & ModelImageConnection;
    }
    return isFolder
      ? (response as ListFoldersResponse).data.listFolders
      : (response as ListImagesResponse).data.listImages;
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

  if (error) {
    return <div>Error initializing app: {error.message}</div>;
  }

  return (
    <AmplifyContext.Provider value={value}>{children}</AmplifyContext.Provider>
  );
};

export default AmplifyProvider;
