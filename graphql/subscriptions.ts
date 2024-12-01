/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onCreateFolder = /* GraphQL */ `subscription OnCreateFolder($filter: ModelSubscriptionFolderFilterInput) {
  onCreateFolder(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateFolderSubscriptionVariables,
  APITypes.OnCreateFolderSubscription
>;
export const onCreateImage = /* GraphQL */ `subscription OnCreateImage($filter: ModelSubscriptionImageFilterInput) {
  onCreateImage(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateImageSubscriptionVariables,
  APITypes.OnCreateImageSubscription
>;
export const onDeleteFolder = /* GraphQL */ `subscription OnDeleteFolder($filter: ModelSubscriptionFolderFilterInput) {
  onDeleteFolder(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteFolderSubscriptionVariables,
  APITypes.OnDeleteFolderSubscription
>;
export const onDeleteImage = /* GraphQL */ `subscription OnDeleteImage($filter: ModelSubscriptionImageFilterInput) {
  onDeleteImage(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteImageSubscriptionVariables,
  APITypes.OnDeleteImageSubscription
>;
export const onUpdateFolder = /* GraphQL */ `subscription OnUpdateFolder($filter: ModelSubscriptionFolderFilterInput) {
  onUpdateFolder(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateFolderSubscriptionVariables,
  APITypes.OnUpdateFolderSubscription
>;
export const onUpdateImage = /* GraphQL */ `subscription OnUpdateImage($filter: ModelSubscriptionImageFilterInput) {
  onUpdateImage(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateImageSubscriptionVariables,
  APITypes.OnUpdateImageSubscription
>;
