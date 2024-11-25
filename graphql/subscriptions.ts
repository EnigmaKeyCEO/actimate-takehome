/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../types/responses";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onCreateFolder = /* GraphQL */ `subscription OnCreateFolder {
  onCreateFolder {
    id
    name
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateFolderSubscriptionVariables,
  APITypes.OnCreateFolderSubscription
>;
export const onUpdateFolder = /* GraphQL */ `subscription OnUpdateFolder {
  onUpdateFolder {
    id
    name
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateFolderSubscriptionVariables,
  APITypes.OnUpdateFolderSubscription
>;
export const onDeleteFolder = /* GraphQL */ `subscription OnDeleteFolder {
  onDeleteFolder {
    id
    name
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteFolderSubscriptionVariables,
  APITypes.OnDeleteFolderSubscription
>;
export const onCreateImage = /* GraphQL */ `subscription OnCreateImage {
  onCreateImage {
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
` as GeneratedSubscription<
  APITypes.OnCreateImageSubscriptionVariables,
  APITypes.OnCreateImageSubscription
>;
export const onUpdateImage = /* GraphQL */ `subscription OnUpdateImage {
  onUpdateImage {
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
` as GeneratedSubscription<
  APITypes.OnUpdateImageSubscriptionVariables,
  APITypes.OnUpdateImageSubscription
>;
export const onDeleteImage = /* GraphQL */ `subscription OnDeleteImage {
  onDeleteImage {
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
` as GeneratedSubscription<
  APITypes.OnDeleteImageSubscriptionVariables,
  APITypes.OnDeleteImageSubscription
>;
