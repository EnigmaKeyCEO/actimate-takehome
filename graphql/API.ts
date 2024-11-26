/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type Folder = {
  __typename: "Folder",
  createdAt?: number | null,
  id: string,
  images?: ModelImageConnection | null,
  name: string,
  parentId: string,
  updatedAt?: number | null,
};

export type ModelImageConnection = {
  __typename: "ModelImageConnection",
  items:  Array<Image | null >,
  nextToken?: string | null,
};

export type Image = {
  __typename: "Image",
  createdAt?: number | null,
  file?: ImageFile | null,
  folder?: Folder | null,
  folderId: string,
  id: string,
  name: string,
  updatedAt?: number | null,
  url?: string | null,
};

export type ImageFile = {
  __typename: "ImageFile",
  bucket?: string | null,
  key?: string | null,
  region?: string | null,
};

export type ModelFolderFilterInput = {
  and?: Array< ModelFolderFilterInput | null > | null,
  createdAt?: ModelIntInput | null,
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  not?: ModelFolderFilterInput | null,
  or?: Array< ModelFolderFilterInput | null > | null,
  parentId?: ModelIDInput | null,
  updatedAt?: ModelIntInput | null,
};

export type ModelIntInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
};

export enum ModelAttributeTypes {
  _null = "_null",
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
}


export type ModelIDInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  size?: ModelSizeInput | null,
};

export type ModelSizeInput = {
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
};

export type ModelStringInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  size?: ModelSizeInput | null,
};

export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC",
}


export type ModelFolderConnection = {
  __typename: "ModelFolderConnection",
  items:  Array<Folder | null >,
  nextToken?: string | null,
};

export type ModelImageFilterInput = {
  and?: Array< ModelImageFilterInput | null > | null,
  createdAt?: ModelIntInput | null,
  folderId?: ModelIDInput | null,
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  not?: ModelImageFilterInput | null,
  or?: Array< ModelImageFilterInput | null > | null,
  updatedAt?: ModelIntInput | null,
  url?: ModelStringInput | null,
};

export type ModelFolderConditionInput = {
  and?: Array< ModelFolderConditionInput | null > | null,
  createdAt?: ModelIntInput | null,
  name?: ModelStringInput | null,
  not?: ModelFolderConditionInput | null,
  or?: Array< ModelFolderConditionInput | null > | null,
  parentId?: ModelIDInput | null,
  updatedAt?: ModelIntInput | null,
};

export type CreateFolderInput = {
  createdAt?: number | null,
  id?: string | null,
  name: string,
  parentId: string,
  updatedAt?: number | null,
};

export type ModelImageConditionInput = {
  and?: Array< ModelImageConditionInput | null > | null,
  createdAt?: ModelIntInput | null,
  folderId?: ModelIDInput | null,
  name?: ModelStringInput | null,
  not?: ModelImageConditionInput | null,
  or?: Array< ModelImageConditionInput | null > | null,
  updatedAt?: ModelIntInput | null,
  url?: ModelStringInput | null,
};

export type CreateImageInput = {
  createdAt?: number | null,
  file?: ImageFileInput | null,
  folderId: string,
  id?: string | null,
  name: string,
  updatedAt?: number | null,
  url?: string | null,
};

export type ImageFileInput = {
  bucket?: string | null,
  key?: string | null,
  region?: string | null,
};

export type DeleteFolderInput = {
  id: string,
};

export type DeleteImageInput = {
  id: string,
};

export type UpdateFolderInput = {
  createdAt?: number | null,
  id: string,
  name?: string | null,
  parentId?: string | null,
  updatedAt?: number | null,
};

export type UpdateImageInput = {
  createdAt?: number | null,
  file?: ImageFileInput | null,
  folderId?: string | null,
  id: string,
  name?: string | null,
  updatedAt?: number | null,
  url?: string | null,
};

export type ModelSubscriptionFolderFilterInput = {
  and?: Array< ModelSubscriptionFolderFilterInput | null > | null,
  createdAt?: ModelSubscriptionIntInput | null,
  id?: ModelSubscriptionIDInput | null,
  name?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionFolderFilterInput | null > | null,
  parentId?: ModelSubscriptionIDInput | null,
  updatedAt?: ModelSubscriptionIntInput | null,
};

export type ModelSubscriptionIntInput = {
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  in?: Array< number | null > | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
  notIn?: Array< number | null > | null,
};

export type ModelSubscriptionIDInput = {
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  in?: Array< string | null > | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionStringInput = {
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  in?: Array< string | null > | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionImageFilterInput = {
  and?: Array< ModelSubscriptionImageFilterInput | null > | null,
  createdAt?: ModelSubscriptionIntInput | null,
  folderId?: ModelSubscriptionIDInput | null,
  id?: ModelSubscriptionIDInput | null,
  name?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionImageFilterInput | null > | null,
  updatedAt?: ModelSubscriptionIntInput | null,
  url?: ModelSubscriptionStringInput | null,
};

export type GetFolderQueryVariables = {
  id: string,
};

export type GetFolderQuery = {
  getFolder?:  {
    __typename: "Folder",
    createdAt?: number | null,
    id: string,
    images?:  {
      __typename: "ModelImageConnection",
      nextToken?: string | null,
    } | null,
    name: string,
    parentId: string,
    updatedAt?: number | null,
  } | null,
};

export type GetImageQueryVariables = {
  id: string,
};

export type GetImageQuery = {
  getImage?:  {
    __typename: "Image",
    createdAt?: number | null,
    file?:  {
      __typename: "ImageFile",
      bucket?: string | null,
      key?: string | null,
      region?: string | null,
    } | null,
    folder?:  {
      __typename: "Folder",
      createdAt?: number | null,
      id: string,
      name: string,
      parentId: string,
      updatedAt?: number | null,
    } | null,
    folderId: string,
    id: string,
    name: string,
    updatedAt?: number | null,
    url?: string | null,
  } | null,
};

export type ListFoldersQueryVariables = {
  filter?: ModelFolderFilterInput | null,
  id?: string | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListFoldersQuery = {
  listFolders?:  {
    __typename: "ModelFolderConnection",
    items:  Array< {
      __typename: "Folder",
      createdAt?: number | null,
      id: string,
      name: string,
      parentId: string,
      updatedAt?: number | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListImagesQueryVariables = {
  filter?: ModelImageFilterInput | null,
  id?: string | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListImagesQuery = {
  listImages?:  {
    __typename: "ModelImageConnection",
    items:  Array< {
      __typename: "Image",
      createdAt?: number | null,
      folderId: string,
      id: string,
      name: string,
      updatedAt?: number | null,
      url?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type CreateFolderMutationVariables = {
  condition?: ModelFolderConditionInput | null,
  input: CreateFolderInput,
};

export type CreateFolderMutation = {
  createFolder?:  {
    __typename: "Folder",
    createdAt?: number | null,
    id: string,
    images?:  {
      __typename: "ModelImageConnection",
      nextToken?: string | null,
    } | null,
    name: string,
    parentId: string,
    updatedAt?: number | null,
  } | null,
};

export type CreateImageMutationVariables = {
  condition?: ModelImageConditionInput | null,
  input: CreateImageInput,
};

export type CreateImageMutation = {
  createImage?:  {
    __typename: "Image",
    createdAt?: number | null,
    file?:  {
      __typename: "ImageFile",
      bucket?: string | null,
      key?: string | null,
      region?: string | null,
    } | null,
    folder?:  {
      __typename: "Folder",
      createdAt?: number | null,
      id: string,
      name: string,
      parentId: string,
      updatedAt?: number | null,
    } | null,
    folderId: string,
    id: string,
    name: string,
    updatedAt?: number | null,
    url?: string | null,
  } | null,
};

export type DeleteFolderMutationVariables = {
  condition?: ModelFolderConditionInput | null,
  input: DeleteFolderInput,
};

export type DeleteFolderMutation = {
  deleteFolder?:  {
    __typename: "Folder",
    createdAt?: number | null,
    id: string,
    images?:  {
      __typename: "ModelImageConnection",
      nextToken?: string | null,
    } | null,
    name: string,
    parentId: string,
    updatedAt?: number | null,
  } | null,
};

export type DeleteImageMutationVariables = {
  condition?: ModelImageConditionInput | null,
  input: DeleteImageInput,
};

export type DeleteImageMutation = {
  deleteImage?:  {
    __typename: "Image",
    createdAt?: number | null,
    file?:  {
      __typename: "ImageFile",
      bucket?: string | null,
      key?: string | null,
      region?: string | null,
    } | null,
    folder?:  {
      __typename: "Folder",
      createdAt?: number | null,
      id: string,
      name: string,
      parentId: string,
      updatedAt?: number | null,
    } | null,
    folderId: string,
    id: string,
    name: string,
    updatedAt?: number | null,
    url?: string | null,
  } | null,
};

export type UpdateFolderMutationVariables = {
  condition?: ModelFolderConditionInput | null,
  input: UpdateFolderInput,
};

export type UpdateFolderMutation = {
  updateFolder?:  {
    __typename: "Folder",
    createdAt?: number | null,
    id: string,
    images?:  {
      __typename: "ModelImageConnection",
      nextToken?: string | null,
    } | null,
    name: string,
    parentId: string,
    updatedAt?: number | null,
  } | null,
};

export type UpdateImageMutationVariables = {
  condition?: ModelImageConditionInput | null,
  input: UpdateImageInput,
};

export type UpdateImageMutation = {
  updateImage?:  {
    __typename: "Image",
    createdAt?: number | null,
    file?:  {
      __typename: "ImageFile",
      bucket?: string | null,
      key?: string | null,
      region?: string | null,
    } | null,
    folder?:  {
      __typename: "Folder",
      createdAt?: number | null,
      id: string,
      name: string,
      parentId: string,
      updatedAt?: number | null,
    } | null,
    folderId: string,
    id: string,
    name: string,
    updatedAt?: number | null,
    url?: string | null,
  } | null,
};

export type OnCreateFolderSubscriptionVariables = {
  filter?: ModelSubscriptionFolderFilterInput | null,
};

export type OnCreateFolderSubscription = {
  onCreateFolder?:  {
    __typename: "Folder",
    createdAt?: number | null,
    id: string,
    images?:  {
      __typename: "ModelImageConnection",
      nextToken?: string | null,
    } | null,
    name: string,
    parentId: string,
    updatedAt?: number | null,
  } | null,
};

export type OnCreateImageSubscriptionVariables = {
  filter?: ModelSubscriptionImageFilterInput | null,
};

export type OnCreateImageSubscription = {
  onCreateImage?:  {
    __typename: "Image",
    createdAt?: number | null,
    file?:  {
      __typename: "ImageFile",
      bucket?: string | null,
      key?: string | null,
      region?: string | null,
    } | null,
    folder?:  {
      __typename: "Folder",
      createdAt?: number | null,
      id: string,
      name: string,
      parentId: string,
      updatedAt?: number | null,
    } | null,
    folderId: string,
    id: string,
    name: string,
    updatedAt?: number | null,
    url?: string | null,
  } | null,
};

export type OnDeleteFolderSubscriptionVariables = {
  filter?: ModelSubscriptionFolderFilterInput | null,
};

export type OnDeleteFolderSubscription = {
  onDeleteFolder?:  {
    __typename: "Folder",
    createdAt?: number | null,
    id: string,
    images?:  {
      __typename: "ModelImageConnection",
      nextToken?: string | null,
    } | null,
    name: string,
    parentId: string,
    updatedAt?: number | null,
  } | null,
};

export type OnDeleteImageSubscriptionVariables = {
  filter?: ModelSubscriptionImageFilterInput | null,
};

export type OnDeleteImageSubscription = {
  onDeleteImage?:  {
    __typename: "Image",
    createdAt?: number | null,
    file?:  {
      __typename: "ImageFile",
      bucket?: string | null,
      key?: string | null,
      region?: string | null,
    } | null,
    folder?:  {
      __typename: "Folder",
      createdAt?: number | null,
      id: string,
      name: string,
      parentId: string,
      updatedAt?: number | null,
    } | null,
    folderId: string,
    id: string,
    name: string,
    updatedAt?: number | null,
    url?: string | null,
  } | null,
};

export type OnUpdateFolderSubscriptionVariables = {
  filter?: ModelSubscriptionFolderFilterInput | null,
};

export type OnUpdateFolderSubscription = {
  onUpdateFolder?:  {
    __typename: "Folder",
    createdAt?: number | null,
    id: string,
    images?:  {
      __typename: "ModelImageConnection",
      nextToken?: string | null,
    } | null,
    name: string,
    parentId: string,
    updatedAt?: number | null,
  } | null,
};

export type OnUpdateImageSubscriptionVariables = {
  filter?: ModelSubscriptionImageFilterInput | null,
};

export type OnUpdateImageSubscription = {
  onUpdateImage?:  {
    __typename: "Image",
    createdAt?: number | null,
    file?:  {
      __typename: "ImageFile",
      bucket?: string | null,
      key?: string | null,
      region?: string | null,
    } | null,
    folder?:  {
      __typename: "Folder",
      createdAt?: number | null,
      id: string,
      name: string,
      parentId: string,
      updatedAt?: number | null,
    } | null,
    folderId: string,
    id: string,
    name: string,
    updatedAt?: number | null,
    url?: string | null,
  } | null,
};
