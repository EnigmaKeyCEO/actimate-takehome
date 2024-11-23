export type File = {
  id: string;
  name: string;
  folderID: string;
};

export const schema = {
  models: {
    File: {
      name: "File",
      fields: {
        id: { type: "ID", isRequired: true },
        name: { type: "String", isRequired: true },
        folderID: { type: "ID", isRequired: true },
      },
    },
  },
};
