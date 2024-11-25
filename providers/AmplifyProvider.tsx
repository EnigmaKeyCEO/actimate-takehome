import React from "react";
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

type AmplifyContextType = {
  name: string;
  create: (
    input: CreateImageInput | CreateFolderInput,
    data?: StorageUploadDataPayload
  ) => Promise<boolean>;
  read: (
    id?: string
  ) => Promise<
    ListImagesQuery | ListFoldersQuery | null
  >;
  update: (
    id: string,
    data: UpdateImageInput | UpdateFolderInput
  ) => Promise<boolean>;
  delete: (id: DeleteImageInput | DeleteFolderInput) => Promise<boolean>;
  list: (id: string) => Promise<Array<Image | Folder>>;
};

const APIName = "amplify-expoexampleamplify-dev-28768";

export const AmplifyContext = React.createContext<AmplifyContextType>({
  name: APIName,
  create: async () => Promise.resolve(false),
  read: async () => Promise.resolve(null),
  update: async () => Promise.resolve(false),
  delete: async () => Promise.resolve(false),
  list: async () => Promise.resolve([]),
});

const ApiProvider = ({ children }: { children: React.ReactNode }) => {
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
  const createImage = async (input: CreateImageInput, data: StorageUploadDataPayload) => {
    const uploadDataInput: UploadDataWithPathInput = {
      path: input.folderID,
      data: data,
    };
    const response: UploadDataWithPathOutput = await uploadData(uploadDataInput);
    return response.result.then((
      (result) => {
        console.log(result);
        return true;
      }
    )).catch(() => false);
  };
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
    name: APIName,
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
