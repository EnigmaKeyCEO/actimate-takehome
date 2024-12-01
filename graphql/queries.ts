/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getFolder = /* GraphQL */ `query GetFolder($id: ID!) {
  getFolder(id: $id) {
    createdAt
    id
    images {
      nextToken
      __typename
    }
    name
    parentId
    updatedAt
    __typename
  }
}
` as GeneratedQuery<APITypes.GetFolderQueryVariables, APITypes.GetFolderQuery>;
export const getImage = /* GraphQL */ `query GetImage($id: ID!) {
  getImage(id: $id) {
    createdAt
    file {
      bucket
      key
      region
      __typename
    }
    folder {
      createdAt
      id
      name
      parentId
      updatedAt
      __typename
    }
    folderId
    id
    name
    updatedAt
    url
    __typename
  }
}
` as GeneratedQuery<APITypes.GetImageQueryVariables, APITypes.GetImageQuery>;
export const listFolders = /* GraphQL */ `query ListFolders(
  $filter: ModelFolderFilterInput
  $id: ID
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  listFolders(
    filter: $filter
    id: $id
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
      createdAt
      id
      name
      parentId
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
export const listImages = /* GraphQL */ `query ListImages(
  $filter: ModelImageFilterInput
  $id: ID
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  listImages(
    filter: $filter
    id: $id
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
      createdAt
      folderId
      id
      name
      updatedAt
      url
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
