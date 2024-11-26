/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const createFolder = /* GraphQL */ `mutation CreateFolder(
  $condition: ModelFolderConditionInput
  $input: CreateFolderInput!
) {
  createFolder(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateFolderMutationVariables,
  APITypes.CreateFolderMutation
>;
export const createImage = /* GraphQL */ `mutation CreateImage(
  $condition: ModelImageConditionInput
  $input: CreateImageInput!
) {
  createImage(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateImageMutationVariables,
  APITypes.CreateImageMutation
>;
export const deleteFolder = /* GraphQL */ `mutation DeleteFolder(
  $condition: ModelFolderConditionInput
  $input: DeleteFolderInput!
) {
  deleteFolder(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteFolderMutationVariables,
  APITypes.DeleteFolderMutation
>;
export const deleteImage = /* GraphQL */ `mutation DeleteImage(
  $condition: ModelImageConditionInput
  $input: DeleteImageInput!
) {
  deleteImage(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteImageMutationVariables,
  APITypes.DeleteImageMutation
>;
export const updateFolder = /* GraphQL */ `mutation UpdateFolder(
  $condition: ModelFolderConditionInput
  $input: UpdateFolderInput!
) {
  updateFolder(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateFolderMutationVariables,
  APITypes.UpdateFolderMutation
>;
export const updateImage = /* GraphQL */ `mutation UpdateImage(
  $condition: ModelImageConditionInput
  $input: UpdateImageInput!
) {
  updateImage(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateImageMutationVariables,
  APITypes.UpdateImageMutation
>;
