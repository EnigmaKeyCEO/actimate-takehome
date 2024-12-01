# Actimate Take Home Challenge

This is a take home challenge for Actimate. It was built with React Native and Expo:
```bash
npx create-expo-app@latest actimate-takehome --template with-aws-storage-upload
```
The app allows you to upload images to S3 and view them in a grid.
It also allows you to copy images to the clipboard.
And organize images into folders.
You can also download images to your device.
And sort images by name, modified date and date uploaded.

> Check out the [AWS Amplify](https://docs.amplify.aws/) docs.

## How to use

### Setup AWS account

- Create a new AWS account
- Run `npm install -g @aws-amplify/cli` to install Amplify CLI
- Run `amplify init` to initilise a new Amplify project
- note: it is already deployed in my account, so you can skip this step
- Run `amplify push` to deploy the Storage and Auth resources in AWS
- note: it is already deployed in my account, so you can skip this step

### Running the app

- Run `npm install`
- Run `amplify pull --branch main --app-id d2jhnq7hpt97d5` to checkout the backend
- Run `npm run start` to try it out.

### Development

We are using Expo out-of-the-box with Expo Router and Amplify as a provider.

Files in the `app` folder are views associated with the expo router.
`app/index.tsx` is the main entry point.

The `amplify` folder is the Amplify project.

To checkout a different environment, run `amplify env checkout <env>`.
The options are `dev`, `prod` and `staging`.

To deploy the Amplify project, run `amplify push`.


