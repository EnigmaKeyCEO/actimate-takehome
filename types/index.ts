import { ModelFolderConnection, ModelImageConnection } from "#/graphql/API";

export * from "../graphql/API";
export * from "./ModelConnection";

export interface ListFoldersResponse {
  data: {
    listFolders: ModelFolderConnection;
  };
}

export interface ListImagesResponse {
  data: {
    listImages: ModelImageConnection;
  };
}
