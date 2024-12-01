import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Folder: a
    .model({
      id: a.id(),
      parentId: a.id().default("root").required(),
      name: a.string().required(),
      createdAt: a.timestamp().default(Date.now()),
      updatedAt: a.timestamp().default(Date.now()),
      images: a.hasMany("Image", "folderId"), // One-to-Many relationship with Image
    })
    .authorization((allow) => [
      allow.guest().to([
        "list",
        "get",
        "create",
        "update",
        "delete",
        "sync",
        "listen",
        "search",
      ]),
      allow
        .publicApiKey()
        .to([
          "list",
          "get",
          "create",
          "update",
          "delete",
          "sync",
          "listen",
          "search",
        ]),
    ]),

  Image: a
    .model({
      id: a.id(),
      name: a.string().required(),
      folderId: a.id().required(), // Foreign key to Folder
      folder: a.belongsTo("Folder", "folderId"), // BelongsTo relationship with Folder
      createdAt: a.timestamp().default(Date.now()),
      updatedAt: a.timestamp().default(Date.now()),
      url: a.string(),
      file: a.customType({
        bucket: a.string(),
        key: a.string().required(),
        region: a.string(),
      }),
    })
    .authorization((allow) => [
      allow.guest().to([
        "list",
        "get",
        "create",
        "update",
        "delete",
        "sync",
        "listen",
        "search",
      ]),
      allow.publicApiKey().to([
        "list",
        "get",
        "create",
        "update",
        "delete",
        "sync",
        "listen",
        "search",
      ]),
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    // API Key is used for a.allow.public() rules
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
