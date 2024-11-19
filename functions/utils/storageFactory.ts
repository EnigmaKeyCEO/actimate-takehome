import { RemoteConfig } from "firebase-admin/remote-config";
import { StorageAdapter } from "../adapters/StorageAdapter";
import { AWSAdapter } from "../adapters/AWSAdapter";
import { FirebaseAdapter } from "../adapters/FirebaseAdapter";

let storageAdapter: StorageAdapter;

export async function getStorageAdapter(): Promise<StorageAdapter> {
  if (storageAdapter) return storageAdapter;

  try {
    const remoteConfig = new RemoteConfig();
    const template = await remoteConfig.getTemplate();

    // Set default value in case the parameter doesn't exist
    const useFirebase =
      // @ts-ignore - RemoteConfig types are incomplete, but value property exists at runtime
      template.parameters?.useFirebaseStorage?.defaultValue?.value === "true";

    storageAdapter = useFirebase ? new FirebaseAdapter() : new AWSAdapter();
    return storageAdapter;
  } catch (error) {
    console.error("Error getting remote config:", error);
    // Fallback to default adapter
    storageAdapter = new AWSAdapter();
    return storageAdapter;
  }
}
