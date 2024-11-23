/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateFolderInput = {
  id?: string | null,
  name: string,
};

export type ModelFolderConditionInput = {
  name?: ModelStringInput | null,
  and?: Array< ModelFolderConditionInput | null > | null,
  or?: Array< ModelFolderConditionInput | null > | null,
  not?: ModelFolderConditionInput | null,
};

export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type Folder = {
  __typename: "Folder",
  id: string,
  name: string,
  createdAt: string,
  updatedAt: string,
};

export type UpdateFolderInput = {
  id: string,
  name?: string | null,
};

export type DeleteFolderInput = {
  id: string,
};

export type CreateImageInput = {
  id?: string | null,
  name: string,
  folderID: string,
};

export type ModelImageConditionInput = {
  name?: ModelStringInput | null,
  folderID?: ModelIDInput | null,
  and?: Array< ModelImageConditionInput | null > | null,
  or?: Array< ModelImageConditionInput | null > | null,
  not?: ModelImageConditionInput | null,
};

export type ModelIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type Image = {
  __typename: "Image",
  id: string,
  name: string,
  folderID: string,
  folder?: Folder | null,
  createdAt: string,
  updatedAt: string,
};

export type UpdateImageInput = {
  id: string,
  name?: string | null,
  folderID?: string | null,
};

export type DeleteImageInput = {
  id: string,
};

export type ModelFolderFilterInput = {
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  and?: Array< ModelFolderFilterInput | null > | null,
  or?: Array< ModelFolderFilterInput | null > | null,
  not?: ModelFolderFilterInput | null,
};

export type ModelFolderConnection = {
  __typename: "ModelFolderConnection",
  items:  Array<Folder | null >,
  nextToken?: string | null,
};

export type ModelImageFilterInput = {
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  folderID?: ModelIDInput | null,
  and?: Array< ModelImageFilterInput | null > | null,
  or?: Array< ModelImageFilterInput | null > | null,
  not?: ModelImageFilterInput | null,
};

export type ModelImageConnection = {
  __typename: "ModelImageConnection",
  items:  Array<Image | null >,
  nextToken?: string | null,
};

export type CreateFolderMutationVariables = {
  input: CreateFolderInput,
  condition?: ModelFolderConditionInput | null,
};

export type CreateFolderMutation = {
  createFolder?:  {
    __typename: "Folder",
    id: string,
    name: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateFolderMutationVariables = {
  input: UpdateFolderInput,
  condition?: ModelFolderConditionInput | null,
};

export type UpdateFolderMutation = {
  updateFolder?:  {
    __typename: "Folder",
    id: string,
    name: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteFolderMutationVariables = {
  input: DeleteFolderInput,
  condition?: ModelFolderConditionInput | null,
};

export type DeleteFolderMutation = {
  deleteFolder?:  {
    __typename: "Folder",
    id: string,
    name: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateImageMutationVariables = {
  input: CreateImageInput,
  condition?: ModelImageConditionInput | null,
};

export type CreateImageMutation = {
  createImage?:  {
    __typename: "Image",
    id: string,
    name: string,
    folderID: string,
    folder?:  {
      __typename: "Folder",
      id: string,
      name: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateImageMutationVariables = {
  input: UpdateImageInput,
  condition?: ModelImageConditionInput | null,
};

export type UpdateImageMutation = {
  updateImage?:  {
    __typename: "Image",
    id: string,
    name: string,
    folderID: string,
    folder?:  {
      __typename: "Folder",
      id: string,
      name: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteImageMutationVariables = {
  input: DeleteImageInput,
  condition?: ModelImageConditionInput | null,
};

export type DeleteImageMutation = {
  deleteImage?:  {
    __typename: "Image",
    id: string,
    name: string,
    folderID: string,
    folder?:  {
      __typename: "Folder",
      id: string,
      name: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type GetFolderQueryVariables = {
  id: string,
};

export type GetFolderQuery = {
  getFolder?:  {
    __typename: "Folder",
    id: string,
    name: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListFoldersQueryVariables = {
  filter?: ModelFolderFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListFoldersQuery = {
  listFolders?:  {
    __typename: "ModelFolderConnection",
    items:  Array< {
      __typename: "Folder",
      id: string,
      name: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetImageQueryVariables = {
  id: string,
};

export type GetImageQuery = {
  getImage?:  {
    __typename: "Image",
    id: string,
    name: string,
    folderID: string,
    folder?:  {
      __typename: "Folder",
      id: string,
      name: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListImagesQueryVariables = {
  filter?: ModelImageFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListImagesQuery = {
  listImages?:  {
    __typename: "ModelImageConnection",
    items:  Array< {
      __typename: "Image",
      id: string,
      name: string,
      folderID: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type OnCreateFolderSubscriptionVariables = {
};

export type OnCreateFolderSubscription = {
  onCreateFolder?:  {
    __typename: "Folder",
    id: string,
    name: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateFolderSubscriptionVariables = {
};

export type OnUpdateFolderSubscription = {
  onUpdateFolder?:  {
    __typename: "Folder",
    id: string,
    name: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteFolderSubscriptionVariables = {
};

export type OnDeleteFolderSubscription = {
  onDeleteFolder?:  {
    __typename: "Folder",
    id: string,
    name: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateImageSubscriptionVariables = {
};

export type OnCreateImageSubscription = {
  onCreateImage?:  {
    __typename: "Image",
    id: string,
    name: string,
    folderID: string,
    folder?:  {
      __typename: "Folder",
      id: string,
      name: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateImageSubscriptionVariables = {
};

export type OnUpdateImageSubscription = {
  onUpdateImage?:  {
    __typename: "Image",
    id: string,
    name: string,
    folderID: string,
    folder?:  {
      __typename: "Folder",
      id: string,
      name: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteImageSubscriptionVariables = {
};

export type OnDeleteImageSubscription = {
  onDeleteImage?:  {
    __typename: "Image",
    id: string,
    name: string,
    folderID: string,
    folder?:  {
      __typename: "Folder",
      id: string,
      name: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};
