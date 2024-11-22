# Local Environment Setup

## Prerequisites
- **Node.js and npm**: Install the latest version from [nodejs.org](https://nodejs.org/).
- **Expo CLI**: Install globally using `npm install -g expo-cli`.
- **EAS CLI**: Install using `npm install -g eas-cli`.
- **Netlify CLI**: Install using `npm install -g netlify-cli`.
- **Git**: Ensure Git is installed for version control ([Download Git](https://git-scm.com/downloads)).
- **iOS Simulator**: Requires Xcode on macOS. Download from the Mac App Store.
- **Android Emulator** (Optional): Set up Android Studio for Android development.

## Steps to Set Up
1. **Clone the repository**:
   Open your terminal and run:
   ```bash
   git clone https://github.com/EnigmaKeyCEO/actimate-takehome.git
   ```
2. **Navigate to the project directory**:
   ```bash
   cd actimate-takehome
   ```
3. **Install dependencies**:
   Run the following command to install all necessary packages:
   ```bash
   npm install
   ```
4. **Start the development server**:
   ```bash
   npm run start
   ```
   This command initializes the Expo development server for the frontend application.

5. **Run on iOS**:
   Open your terminal and execute:
   ```bash
   npm run dev:ios
   ```
   This will launch the application in the iOS simulator.

6. **Run on Android** (Optional):
   ```bash
   npm run android
   ```
   Ensure that an Android emulator is running or an Android device is connected.

7. **Run the web version**:
   ```bash
   npm run web
   ```
   Launches the application in a web browser for testing.

## Environment Variables
Configuration is managed through environment variables to maintain security and flexibility.

1. **Create a `.env` file**:
   In the root directory of the project, create a file named `.env`.

2. **Add the following variables**:
   ```bash
   VITE_API_BASE_URL=https://actimate-takehome.netlify.app/api
   VITE_AWS_ACCESS_KEY_ID=your_access_key_id
   VITE_AWS_SECRET_ACCESS_KEY=your_secret_access_key
   VITE_AWS_REGION=your_aws_region
   VITE_S3_BUCKET=your_s3_bucket
   VITE_AWS_ACCESS_URL_KEY=your_access_url_key
   ```
   - Replace `your_access_key_id`, `your_secret_access_key`, `your_aws_region`, `your_s3_bucket`, and `your_access_url_key` with your actual AWS credentials and configuration details.

3. **Security Best Practices**:
   - **Do Not Commit `.env` to Version Control**: Ensure that the `.env` file is listed in `.gitignore` to prevent sensitive information from being exposed.
   - **Use `.env.example`**: Provide a template `.env.example` file with placeholder values for easy setup by other developers.

## Troubleshooting
- **Dependency Issues**:
  - If you encounter issues during `npm install`, try deleting the `node_modules` folder and `package-lock.json` file, then rerun `npm install`.
  
- **Expo CLI Errors**:
  - Ensure that Expo CLI is installed globally.
  - Update Expo CLI to the latest version using `npm install -g expo-cli`.

- **iOS Simulator Not Launching**:
  - Verify that Xcode is correctly installed and updated.
  - Open Xcode and ensure that the iOS simulator is working independently.

- **API Endpoint Issues**:
  - Ensure that the backend API is deployed and accessible.
  - Verify that environment variables are correctly set in the `.env` file.

- **Function Not Working Locally**:
  - Ensure that Netlify Functions are running by executing `npm run dev`.
  - Check Netlify logs for any errors related to serverless functions.

## Additional Tips
- **Hot Reloading**:
  - Utilize Expo's hot reloading feature for a faster development experience. Changes in the codebase will automatically reflect in the running application.

- **Debugging**:
  - Use React Native Debugger or Expo Dev Tools for effective debugging.
  - Implement breakpoints and inspect component states as needed.

- **Version Control**:
  - Regularly commit your changes with descriptive messages.
  - Create feature branches for new functionalities to maintain a clean main branch.

- **Testing**:
  - Write unit and integration tests to ensure code reliability.
  - Run tests frequently to catch and fix issues early in the development process.

## Support
- **Official Documentation**:
  - [Expo Documentation](https://docs.expo.dev/)
  - [React Native Documentation](https://reactnative.dev/docs/getting-started)
  - [AWS SDK Documentation](https://docs.aws.amazon.com/sdk-for-javascript/)
  
- **Community Forums**:
  - [Expo Forums](https://forums.expo.dev/)
  - [Stack Overflow](https://stackoverflow.com/questions/tagged/react-native)
  
- **GitHub Issues**:
  - Report any bugs or issues by creating an issue in the [actimate-takehome repository](https://github.com/EnigmaKeyCEO/actimate-takehome/issues).

---
