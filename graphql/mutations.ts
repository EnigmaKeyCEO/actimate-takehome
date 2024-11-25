/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../types/responses";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const createFolder = /* GraphQL */ `mutation CreateFolder(
  $input: CreateFolderInput!
  $condition: ModelFolderConditionInput
) {
  createFolder(input: $input, condition: $condition) {
    id
    name
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateFolderMutationVariables,
  APITypes.CreateFolderMutation
>;
export const updateFolder = /* GraphQL */ `mutation UpdateFolder(
  $input: UpdateFolderInput!
  $condition: ModelFolderConditionInput
) {
  updateFolder(input: $input, condition: $condition) {
    id
    name
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateFolderMutationVariables,
  APITypes.UpdateFolderMutation
>;
export const deleteFolder = /* GraphQL */ `mutation DeleteFolder(
  $input: DeleteFolderInput!
  $condition: ModelFolderConditionInput
) {
  deleteFolder(input: $input, condition: $condition) {
    id
    name
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteFolderMutationVariables,
  APITypes.DeleteFolderMutation
>;
export const createImage = /* GraphQL */ `mutation CreateImage(
  $input: CreateImageInput!
  $condition: ModelImageConditionInput
) {
  createImage(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateImageMutationVariables,
  APITypes.CreateImageMutation
>;
export const updateImage = /* GraphQL */ `mutation UpdateImage(
  $input: UpdateImageInput!
  $condition: ModelImageConditionInput
) {
  updateImage(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateImageMutationVariables,
  APITypes.UpdateImageMutation
>;
export const deleteImage = /* GraphQL */ `mutation DeleteImage(
  $input: DeleteImageInput!
  $condition: ModelImageConditionInput
) {
  deleteImage(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteImageMutationVariables,
  APITypes.DeleteImageMutation
>;
