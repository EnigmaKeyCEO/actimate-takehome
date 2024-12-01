import { defineAuth } from "@aws-amplify/backend";

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */

export const auth = defineAuth({
  loginWith: {
    email: {
      userInvitation: {
        emailSubject: "Invitation To Join Actimate Takehome",
        emailBody: (username: () => string, code: () => string) =>
          `Welcome ${username()}!\n\nYour verification code is: ${code()}`,
        smsMessage: (username: () => string, code: () => string) =>
          `Welcome ${username()}!\n\nYour verification code is: ${code()}`,
      },
      verificationEmailSubject: "Verify your email for Actimate Takehome",
      verificationEmailBody: (createCode: () => string) =>
        `Your verification code is: ${createCode()}`,
      verificationEmailStyle: "CODE",
    },
  },
});
