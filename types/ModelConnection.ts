import {
  Folder,
  Image,
  ModelFolderConnection,
  ModelImageConnection,
} from "#/graphql/API";

export class ModelConnection<T extends Image | Folder> {
  list: T extends Image ? ModelImageConnection : ModelFolderConnection;
  constructor(
    {
      listImages,
      listFolders,
    }:
      | {
          listImages?: ModelImageConnection;
          listFolders?: ModelFolderConnection;
        }
      | undefined = {
      listImages: undefined,
      listFolders: undefined,
    }
  ) {
    if (listImages) {
      this.list = listImages as T extends Image ? ModelImageConnection : never;
    } else if (listFolders) {
      this.list = listFolders as T extends Image
        ? never
        : ModelFolderConnection;
    } else {
      // this is a bit of a hack to get the correct type
      // it works for now, but is not a good solution
      // TODO: fix this
      this.list = {
        items: [],
        nextToken: null,
      } as unknown as T extends Image
        ? ModelImageConnection
        : ModelFolderConnection;
    }
  }
}
