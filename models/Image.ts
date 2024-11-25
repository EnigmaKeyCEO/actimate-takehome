export type Image = {
  id: string;
  folderId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  url: string;
  base64: string;
};

export const schema = {
  models: {
    Image: {
      name: "Image",
      fields: {
        id: { type: "ID", isRequired: true },
        folderId: { type: "relation", isRequired: true, relationName: "parentFolder" },
        name: { type: "String", isRequired: true },
        createdAt: { type: "AWSDateTime", isRequired: true },
        updatedAt: { type: "AWSDateTime", isRequired: true },
        url: { type: "String", isRequired: true },
        base64: { type: "String", isRequired: true },
      },
      syncable: true,
      pluralName: "Images",
    },
  },
  enums: {},
  nonModels: {},
  version: "1",
};
