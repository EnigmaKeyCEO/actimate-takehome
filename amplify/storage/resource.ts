import { defineStorage } from '@aws-amplify/backend';
import amplifyOutputs from '../../amplify_outputs.json';

export const storage = defineStorage({
  name: amplifyOutputs.storage.bucket_name,
  access: (allow) => ({
    "root/*": [allow.guest.to(["read", "write", "delete"])],
  }),
});
