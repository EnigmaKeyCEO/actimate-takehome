import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: "actimate-takehome",
  access: (allow) => ({
    "root/*": [allow.guest.to(["read", "write", "delete"])],
  }),
});
