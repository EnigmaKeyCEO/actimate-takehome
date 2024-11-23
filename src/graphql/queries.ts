/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../providers/ApiProvider";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getFolder = /* GraphQL */ `query GetFolder($id: ID!) {
  getFolder(id: $id) {
    id
    name
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<APITypes.GetFolderQueryVariables, APITypes.GetFolderQuery>;
export const listFolders = /* GraphQL */ `query ListFolders(
  $filter: ModelFolderFilterInput
  $limit: Int
  $nextToken: String
) {
  listFolders(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      name
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListFoldersQueryVariables,
  APITypes.ListFoldersQuery
>;
export const getImage = /* GraphQL */ `query GetImage($id: ID!) {
  getImage(id: $id) {
    id
    name
    folderID
    folder {
      id
      name
      createdAt
      updatedAt
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<APITypes.GetImageQueryVariables, APITypes.GetImageQuery>;
export const listImages = /* GraphQL */ `query ListImages(
  $filter: ModelImageFilterInput
  $limit: Int
  $nextToken: String
) {
  listImages(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      name
      folderID
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListImagesQueryVariables,
  APITypes.ListImagesQuery
>;
